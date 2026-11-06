import * as THREE from 'three';

/**
 * Scroll-driven video ribbon: a strip of live media cards slides along a fixed
 * 3D rail that spirals around the viewer, then each card lands in a 3×2 grid.
 * Everything is driven by one smoothed scroll progress value p ∈ [0,1].
 */

export interface RibbonItem {
  title: string;
  src: string;
  type: 'video' | 'image';
}

export interface RibbonEls {
  track: HTMLElement;
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  l1: HTMLElement;
  l2: HTMLElement;
  cap: HTMLElement;
  intro: HTMLElement[];
  rule: HTMLElement;
  name: HTMLElement;
  counter?: HTMLElement;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const out = (t: number) => 1 - (1 - t) ** 3;
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

const CARD_W = 2.1,
  CARD_H = 1.32,
  GAP = 0.03,
  STEP = CARD_W + GAP,
  NX = 28,
  NY = 3;
const GZ = 8;
const RIB_A = 0.14,
  RIB_B = 0.63;
const SAMPLES = 1200;
const PH0 = -1.5,
  PH1 = Math.PI * 2 + 1.35;
const FOV = 35;

const vs = `uniform float uVel;varying vec2 vUv;
void main(){
  vUv=uv;
  vec3 p=position;
  // scroll velocity bows the sheet like fabric in the wind
  float b=sin(uv.x*3.14159);
  p.z+=b*uVel*1.1; p.y+=b*uVel*.35;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;
const fs = `uniform sampler2D map;uniform vec2 cover,uMouse;uniform float aspect,ready,radius,hover,uVel,uTime,uDim;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  // liquid ripple from the cursor on hover
  vec2 md=(uv-uMouse)*vec2(aspect,1.);
  float ml=length(md);
  uv+=md/(ml+1e-4)*sin(ml*38.-uTime*7.)*.0055*hover*exp(-ml*3.5);
  vec2 tuv=(uv-.5)*cover*(1.-hover*.07)+.5;
  vec2 rgb=vec2(uVel*.035,0.)*cover.x;
  vec3 t=vec3(texture2D(map,tuv+rgb).r,texture2D(map,tuv).g,texture2D(map,tuv-rgb).b);
  vec3 c=mix(vec3(.075),t,ready);
  float lum=dot(c,vec3(.299,.587,.114));
  c=mix(c,vec3(lum)*.55,uDim);
  // soft spotlight following the cursor
  c+=vec3(1.,.85,.7)*exp(-ml*ml*9.)*hover*.12;
  float edge=smoothstep(-.012-px,-.012,d);
  c=mix(c,vec3(1.,.78,.6),edge*(.1+hover*.6));
  gl_FragColor=vec4(c,a);
}`;

interface Card {
  i: number;
  title: string;
  v?: HTMLVideoElement;
  geo: THREE.PlaneGeometry;
  mat: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  rect: ReturnType<VideoRibbon['grid']> | null;
  hover: number;
  muv: THREE.Vector2;
}

export class VideoRibbon {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  private pathP: THREE.Vector3[] = [];
  private pathT: THREE.Vector3[] = [];
  private PATH_L = 1;
  private cards: Card[];
  private W = 1;
  private H = 1;
  private asp = 1;
  private cols = 3;
  private rows = 2;
  private tanH = 0.3153;
  private target = 0;
  private p = 0;
  private raf = 0;
  private visible = false;
  private io: IntersectionObserver;
  private hovered: Card | null = null;
  private vel = 0;
  private pPrev = 0;
  private dim = 0;
  private mx = 0;
  private my = 0;
  private cmx = 0;
  private cmy = 0;
  private t0 = performance.now();
  private op = new THREE.Vector3();
  private ot = new THREE.Vector3();
  private up = new THREE.Vector3();
  private Y = new THREE.Vector3(0, 1, 0);
  private vp = new THREE.Vector3();

  constructor(private els: RibbonEls, items: RibbonItem[], private onCardClick?: (i: number) => void) {
    this.renderer = new THREE.WebGLRenderer({ canvas: els.canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0, 0);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    this.cards = items.map((it, i) => this.makeCard(it, i));

    this.resize();
    this.buildPath();
    window.addEventListener('resize', this.resize);
    els.stage.addEventListener('pointermove', this.onMove);
    els.stage.addEventListener('pointerleave', this.onOut);
    els.stage.addEventListener('click', this.onClick);

    this.io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this.loop();
        else {
          cancelAnimationFrame(this.raf);
          this.cards.forEach((c) => c.v && !c.v.paused && c.v.pause());
        }
      },
      { rootMargin: '200px 0px' }
    );
    this.io.observe(els.track);
    this.readScroll();
    this.p = this.target;
    this.render();
  }

  private makeCard(it: RibbonItem, i: number): Card {
    let tex: THREE.Texture;
    const mat = new THREE.ShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        map: { value: null },
        cover: { value: new THREE.Vector2(1, 1) },
        aspect: { value: CARD_W / CARD_H },
        ready: { value: 0 },
        radius: { value: 0.018 },
        hover: { value: 0 },
        uVel: { value: 0 },
        uTime: { value: 0 },
        uDim: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
    });
    const setCover = (w: number, h: number) => {
      const va = w / h,
        ca = CARD_W / CARD_H;
      mat.uniforms.cover.value.set(va > ca ? ca / va : 1, va > ca ? 1 : va / ca);
    };
    let v: HTMLVideoElement | undefined;
    if (it.type === 'video') {
      v = document.createElement('video');
      Object.assign(v, { crossOrigin: 'anonymous', muted: true, loop: true, playsInline: true, preload: 'auto', src: it.src });
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');
      tex = new THREE.VideoTexture(v);
      v.addEventListener('loadeddata', () => {
        setCover(v!.videoWidth, v!.videoHeight);
        this.fadeIn(mat);
      });
    } else {
      tex = new THREE.Texture();
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        tex.image = img;
        tex.needsUpdate = true;
        setCover(img.naturalWidth, img.naturalHeight);
        this.fadeIn(mat);
      };
      img.src = it.src;
    }
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    mat.uniforms.map.value = tex;
    const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    return { i, title: it.title, v, geo, mat, mesh, rect: null, hover: 0, muv: new THREE.Vector2(0.5, 0.5) };
  }

  private fadeIn(mat: THREE.ShaderMaterial) {
    const t0 = performance.now();
    const step = () => {
      const k = clamp((performance.now() - t0) / 600);
      mat.uniforms.ready.value = ease(k);
      if (k < 1) requestAnimationFrame(step);
      else if (!this.visible) this.render();
    };
    step();
  }

  private buildPath() {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const t = i / 160,
        ph = mix(PH0, PH1, t),
        cs = Math.cos(ph),
        u = 2 * t - 1;
      const depth = cs > 0 ? 7.6 + 16.4 * cs ** 0.9 : 7.6 + 2.2 * cs;
      const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
      pts.push(
        new THREE.Vector3(edge * Math.sin(ph) * depth * 0.561, 0.5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * 0.63, -depth)
      );
    }
    const path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    path.arcLengthDivisions = 1500;
    this.PATH_L = path.getLength();
    this.pathP.length = this.pathT.length = 0;
    for (let i = 0; i <= SAMPLES; i++) {
      const u = i / SAMPLES;
      this.pathP.push(path.getPointAt(u));
      this.pathT.push(path.getTangentAt(u));
    }
  }

  private at(s: number, op: THREE.Vector3, ot: THREE.Vector3) {
    const f = clamp(s / this.PATH_L) * SAMPLES,
      i = Math.min(SAMPLES - 1, Math.floor(f)),
      k = f - i;
    op.lerpVectors(this.pathP[i], this.pathP[i + 1], k);
    ot.lerpVectors(this.pathT[i], this.pathT[i + 1], k).normalize();
  }

  resize = () => {
    const r = this.els.stage.getBoundingClientRect();
    this.W = r.width || innerWidth;
    this.H = r.height || innerHeight;
    this.asp = this.W / this.H;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(this.W, this.H, false);
    this.camera.aspect = this.asp;
    this.camera.fov = this.asp < 16 / 9 ? (Math.atan(0.561 / this.asp) * 360) / Math.PI : FOV;
    this.camera.updateProjectionMatrix();
    this.tanH = Math.tan((this.camera.fov * Math.PI) / 360);
    this.cols = this.asp < 0.9 ? 2 : 3;
    this.rows = this.asp < 0.9 ? 3 : 2;
    if (!this.visible && this.pathP.length) this.render();
  };

  grid(i: number) {
    const { cols, rows, asp, tanH } = this;
    const vh = 2 * GZ * tanH,
      vw = vh * asp,
      gw = vw * (cols === 3 ? 0.74 : 0.88),
      gap = gw * 0.017;
    const cw = (gw - gap * (cols - 1)) / cols,
      ch = cw / (CARD_W / CARD_H),
      gh = ch * rows + gap * 1.6 * (rows - 1);
    const c = i % cols,
      r = Math.floor(i / cols);
    return { x: -gw / 2 + cw / 2 + c * (cw + gap), y: gh / 2 - ch / 2 - r * (ch + gap * 1.6), w: cw, h: ch, vw, vh, c, r };
  }

  private readScroll() {
    const r = this.els.track.getBoundingClientRect();
    this.target = clamp(-r.top / Math.max(1, r.height - innerHeight));
  }

  private poseRibbon(c: Card, head: number) {
    const pos = c.geo.attributes.position as THREE.BufferAttribute,
      centre = head - c.i * STEP;
    const { op, ot, up, Y, vp } = this;
    for (let iy = 0; iy <= NY; iy++)
      for (let ix = 0; ix <= NX; ix++) {
        const k = iy * (NX + 1) + ix,
          lu = ix / NX - 0.5,
          lv = 0.5 - iy / NY;
        this.at(centre + lu * CARD_W, op, ot);
        up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
        vp.copy(op).addScaledVector(up, lv * CARD_H);
        pos.setXYZ(k, vp.x, vp.y, vp.z);
      }
    pos.needsUpdate = true;
  }

  private poseGrid(c: Card, q: number) {
    const g = this.grid(c.i),
      pos = c.geo.attributes.position as THREE.BufferAttribute;
    const { cols, rows } = this;
    const dx = (g.c - (cols - 1) / 2) * 1.2,
      dy = g.r < rows / 2 ? 1 : -1;
    const ox = dx * g.vw * 0.62 * (1 - q),
      oy = dy * g.vh * (g.c === 1 ? 0.95 : 0.34) * (1 - q),
      tilt = (1 - q) * 0.22 * (g.c - 1 || 0.5) * dy;
    const cs = Math.cos(tilt),
      sn = Math.sin(tilt);
    // hover: card lifts toward the camera with a gentle bulge
    const hv = c.hover;
    const sc = 1 + hv * 0.035;
    for (let iy = 0; iy <= NY; iy++)
      for (let ix = 0; ix <= NX; ix++) {
        const k = iy * (NX + 1) + ix,
          x = (ix / NX - 0.5) * g.w * sc,
          y = (0.5 - iy / NY) * g.h * sc;
        pos.setXYZ(
          k,
          g.x + ox + x * cs - y * sn,
          g.y + oy + x * sn + y * cs,
          -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI) + hv * 0.25 * Math.sin((ix / NX) * Math.PI)
        );
      }
    pos.needsUpdate = true;
    c.rect = g;
  }

  private render() {
    const pp = this.p;
    const { els } = this;
    const rise = 1 - out(span(pp, 0, 0.12));
    const run = mix(-50, 76, span(pp, 0, 0.58));
    const sk = clamp(this.vel * -2500, -12, 12);
    els.l1.style.transform = `translate3d(${run}vw,${rise * 34}vh,0) skewX(${sk}deg)`;
    els.l2.style.transform = `translate3d(${-run}vw,${rise * 34}vh,0) skewX(${-sk}deg)`;

    // camera drifts with the cursor once the grid has settled
    const gridness = span(pp, 0.8, 0.92);
    this.camera.position.set(this.cmx * 0.28 * gridness, -this.cmy * 0.18 * gridness, 0);
    this.camera.lookAt(0, 0, -GZ);
    const time = (performance.now() - this.t0) / 1000;
    const v = clamp(this.vel * 150, -1.2, 1.2);
    els.cap.style.opacity = String(1 - span(pp, 0.52, 0.57));
    els.cap.style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;
    const intro = 1 - span(pp, 0, 0.05);
    for (const el of els.intro) el.style.opacity = String(intro);
    els.rule.style.transform = `scaleX(${ease(span(pp, 0.72, 0.86))})`;
    if (els.counter) {
      const n = Math.min(this.cards.length, Math.max(1, Math.ceil(span(pp, RIB_A, RIB_B) * this.cards.length)));
      els.counter.textContent = `${String(n).padStart(2, '0')} / ${String(this.cards.length).padStart(2, '0')}`;
    }

    const total = this.PATH_L + this.cards.length * STEP;
    const pr = span(pp, RIB_A, RIB_B),
      head = mix(0, total, pr);
    for (const c of this.cards) {
      const s = head - c.i * STEP,
        end = this.PATH_L - CARD_W;
      const un = c.mat.uniforms;
      un.hover.value = c.hover;
      un.uVel.value = v;
      un.uTime.value = time;
      un.uDim.value = this.dim * (1 - c.hover) * 0.85;
      un.uMouse.value.copy(c.muv);
      if (s < end) {
        c.mesh.visible = s > CARD_W;
        c.rect = null;
        if (c.mesh.visible) this.poseRibbon(c, head);
      } else if (c.i < this.cols * this.rows) {
        const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / total),
          q = out(span(pp, st, st + 0.13));
        c.mesh.visible = q > 0.001;
        if (c.mesh.visible) this.poseGrid(c, q);
      } else {
        c.mesh.visible = false;
        c.rect = null;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  private hitTest(e: PointerEvent | MouseEvent): Card | null {
    if (this.p <= 0.86) return null;
    const r = this.els.stage.getBoundingClientRect();
    const nx = (e.clientX - r.left) / this.W - 0.5,
      ny = 0.5 - (e.clientY - r.top) / this.H;
    let hit: Card | null = null;
    for (const c of this.cards) {
      const g = c.rect;
      if (!g) continue;
      const x = nx * g.vw,
        y = ny * g.vh;
      if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) hit = c;
    }
    return hit;
  }

  private onMove = (e: PointerEvent) => {
    const hit = this.hitTest(e);
    this.hovered = hit;
    {
      const r = this.els.stage.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / this.W - 0.5;
      this.my = (e.clientY - r.top) / this.H - 0.5;
      if (hit && hit.rect) {
        const g = hit.rect;
        hit.muv.set((this.mx * g.vw - g.x) / g.w + 0.5, (-this.my * g.vh - g.y) / g.h + 0.5);
      }
    }
    const n = this.els.name;
    n.style.opacity = hit ? '1' : '0';
    this.els.stage.style.cursor = hit && this.onCardClick ? 'pointer' : '';
    if (hit) {
      const r = this.els.stage.getBoundingClientRect();
      n.textContent = hit.title;
      n.style.transform = `translate(${e.clientX - r.left + 14}px,${e.clientY - r.top + 16}px)`;
    }
  };
  private onOut = () => {
    this.hovered = null;
    this.els.name.style.opacity = '0';
  };
  private onClick = (e: MouseEvent) => {
    const hit = this.hitTest(e);
    if (hit && this.onCardClick) this.onCardClick(hit.i);
  };

  private loop = () => {
    if (!this.visible) return;
    this.readScroll();
    this.p += (this.target - this.p) * 0.09;
    if (Math.abs(this.target - this.p) < 0.00005) this.p = this.target;
    this.vel += (this.p - this.pPrev - this.vel) * 0.18;
    this.pPrev = this.p;
    this.cmx += (this.mx - this.cmx) * 0.06;
    this.cmy += (this.my - this.cmy) * 0.06;
    this.dim += ((this.hovered ? 1 : 0) - this.dim) * 0.1;
    for (const c of this.cards) {
      c.hover += ((c === this.hovered ? 1 : 0) - c.hover) * 0.12;
      if (!c.v) continue;
      if (c.mesh.visible && c.v.paused) c.v.play().catch(() => {});
      else if (!c.mesh.visible && !c.v.paused) c.v.pause();
    }
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.visible = false;
    this.io.disconnect();
    window.removeEventListener('resize', this.resize);
    this.els.stage.removeEventListener('pointermove', this.onMove);
    this.els.stage.removeEventListener('pointerleave', this.onOut);
    this.els.stage.removeEventListener('click', this.onClick);
    for (const c of this.cards) {
      c.v?.pause();
      if (c.v) c.v.src = '';
      (c.mat.uniforms.map.value as THREE.Texture)?.dispose();
      c.geo.dispose();
      c.mat.dispose();
    }
    this.renderer.dispose();
  }
}
