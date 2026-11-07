import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * Opening intro: a cinema camera assembles itself, its reels spin and unspool a
 * film strip of the team's photos, a clapperboard snaps, polaroids fly into orbit,
 * and on exit the view dives into the lens.
 *
 * All models are built from primitives here — no external assets.
 */

const ORANGE = 0xf26a2e;
const CREAM = 0xf5efe2;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => {
  const c1 = 1.5,
    c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

/** draw `img` cover-fitted into a rect */
function cover(c: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height);
  const iw = img.width * s,
    ih = img.height * s;
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  c.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  c.restore();
}

interface Part {
  obj: THREE.Object3D;
  home: THREE.Vector3;
  homeRot: THREE.Euler;
  from: THREE.Vector3;
  fromRot: THREE.Euler;
  delay: number;
}

interface Card {
  mesh: THREE.Mesh;
  a: number;
  r: number;
  y: number;
  delay: number;
  from: THREE.Vector3;
  spin: number;
}

export class CinemaIntro {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private cam: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private raf = 0;
  private t0 = performance.now();
  private lastNow = 0;
  private started = false;
  private disposed = false;
  /** called once the first frame is on screen */
  onStart: (() => void) | null = null;
  private mx = 0;
  private my = 0;
  private smx = 0;
  private smy = 0;

  private rig = new THREE.Group(); // the cinema camera
  private parts: Part[] = [];
  private reels: THREE.Object3D[] = [];
  private recLamp!: THREE.Mesh;
  private lensGlass!: THREE.MeshStandardMaterial;
  private lensFront = new THREE.Vector3();
  private clapArm!: THREE.Object3D;
  private clapFlash!: THREE.PointLight;
  private film!: THREE.Mesh;
  private filmTex!: THREE.CanvasTexture;
  private filmCount = 0;
  private cards: Card[] = [];
  private dust!: THREE.Points;

  private exiting = false;
  private exitT0 = 0;
  private exitDur = 1.4;
  private exitFrom = new THREE.Vector3();
  private exitResolve: (() => void) | null = null;

  constructor(
    private container: HTMLElement,
    photos: string[],
    private small = false
  ) {
    const w = container.clientWidth || innerWidth,
      h = container.clientHeight || innerHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(small ? 1.5 : 2, devicePixelRatio || 1));
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // fade the canvas in on its first frame instead of popping
    this.renderer.domElement.style.opacity = '0';
    this.renderer.domElement.style.transition = 'opacity .6s ease';
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.Fog(0x050505, 14, 34);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.cam = new THREE.PerspectiveCamera(w < h ? 52 : 38, w / h, 0.05, 80);
    this.cam.position.set(0, 2.6, 16);

    this.buildLights();
    this.buildCamera();
    this.buildClapper();
    this.buildFilm(photos);
    this.buildCards(photos);
    this.buildDust();

    if (!small) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.cam));
      // gentle bloom: only truly bright things (lens, REC lamp, clap flash) glow
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.42, 0.5, 0.88));
      this.composer.addPass(new OutputPass());
    }

    addEventListener('resize', this.onResize);
    addEventListener('pointermove', this.onMove, { passive: true });
    this.raf = requestAnimationFrame(this.loop);
  }

  /* ------------------------------------------------------------------ */
  /* models                                                              */
  /* ------------------------------------------------------------------ */

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0x8899ff, 0x1a0d05, 0.35));
    const key = new THREE.SpotLight(0xffb27a, 60, 30, 0.55, 0.5, 1.6);
    key.position.set(5, 7, 6);
    this.scene.add(key, key.target);
    const rim = new THREE.DirectionalLight(0x6fa8ff, 1.6);
    rim.position.set(-6, 3, -6);
    this.scene.add(rim);
    const fill = new THREE.PointLight(ORANGE, 14, 12, 1.8);
    fill.position.set(-2.5, -1, 3);
    this.scene.add(fill);

    // soft glow disc behind everything
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.MeshBasicMaterial({
        map: canvasTex(256, 256, (c) => {
          const g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
          g.addColorStop(0, 'rgba(242,106,46,0.45)');
          g.addColorStop(0.4, 'rgba(242,106,46,0.12)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = g;
          c.fillRect(0, 0, 256, 256);
        }),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.position.set(0, 0.6, -7);
    this.scene.add(glow);
  }

  private addPart(obj: THREE.Object3D, delay: number, spread = 7) {
    const home = obj.position.clone();
    const homeRot = obj.rotation.clone();
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.2, Math.random() - 0.5).normalize();
    const from = home.clone().add(dir.multiplyScalar(spread + Math.random() * 4));
    const fromRot = new THREE.Euler(homeRot.x + (Math.random() - 0.5) * 4, homeRot.y + (Math.random() - 0.5) * 4, homeRot.z + (Math.random() - 0.5) * 4);
    obj.position.copy(from);
    obj.rotation.copy(fromRot);
    this.parts.push({ obj, home, homeRot, from, fromRot, delay });
    this.rig.add(obj);
  }

  private buildCamera() {
    const body = new THREE.MeshStandardMaterial({ color: 0x17171a, metalness: 0.75, roughness: 0.32 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, metalness: 0.5, roughness: 0.55 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xd8d8de, metalness: 1, roughness: 0.18 });
    const accent = new THREE.MeshStandardMaterial({ color: ORANGE, metalness: 0.4, roughness: 0.35, emissive: ORANGE, emissiveIntensity: 0.25 });

    // main body
    const box = new THREE.Mesh(new RoundedBoxGeometry(2.4, 1.5, 1.15, 5, 0.14), body);
    this.addPart(box, 0.05, 5);

    // side plate with an orange stripe
    const plate = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.9, 0.05, 3, 0.03), dark);
    plate.position.set(-0.05, 0, 0.6);
    this.addPart(plate, 0.25);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.06), accent);
    stripe.position.set(-0.05, -0.38, 0.62);
    this.addPart(stripe, 0.32);

    // lens barrel (points along +x = "front")
    const lens = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 1.0, 40, 1, true), dark);
    barrel.rotation.z = Math.PI / 2;
    lens.add(barrel);
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.47 - i * 0.02, 0.035, 12, 48), i === 1 ? accent : chrome);
      ring.rotation.y = Math.PI / 2;
      ring.position.x = -0.35 + i * 0.35;
      lens.add(ring);
    }
    const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.46, 0.35, 40, 1, true), body);
    hood.rotation.z = Math.PI / 2;
    hood.position.x = 0.62;
    lens.add(hood);
    this.lensGlass = new THREE.MeshStandardMaterial({
      color: 0x0a1426,
      metalness: 0.9,
      roughness: 0.05,
      emissive: 0x2a5fff,
      emissiveIntensity: 0.35,
      emissiveMap: canvasTex(256, 256, (c) => {
        const g = c.createRadialGradient(128, 128, 10, 128, 128, 128);
        g.addColorStop(0, '#9fd0ff');
        g.addColorStop(0.35, '#3256c8');
        g.addColorStop(0.7, '#1a1440');
        g.addColorStop(1, '#000');
        c.fillStyle = g;
        c.fillRect(0, 0, 256, 256);
        c.fillStyle = 'rgba(255,255,255,.75)';
        c.beginPath();
        c.ellipse(92, 84, 26, 12, -0.6, 0, Math.PI * 2);
        c.fill();
      }),
    });
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.44, 48), this.lensGlass);
    glass.rotation.y = Math.PI / 2;
    glass.position.x = 0.5;
    lens.add(glass);
    lens.position.set(1.68, -0.05, 0);
    this.addPart(lens, 0.45, 6);

    // matte box arms
    const top = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.22, 0.6, 2, 0.05), dark);
    top.position.set(-0.6, 0.86, 0);
    this.addPart(top, 0.3);

    // viewfinder + eyecup at the back
    const vf = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 24), body);
    vf.rotation.z = Math.PI / 2;
    vf.position.set(-1.5, 0.45, -0.35);
    this.addPart(vf, 0.55);
    const cup = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.06, 12, 24), dark);
    cup.rotation.y = Math.PI / 2;
    cup.position.set(-1.88, 0.45, -0.35);
    this.addPart(cup, 0.62);

    // top handle
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 12, 32, Math.PI), chrome);
    handle.position.set(0.3, 0.78, 0);
    this.addPart(handle, 0.7);

    // two film reels on top
    const reelGeo = (() => {
      const s = new THREE.Shape();
      s.absarc(0, 0, 0.72, 0, Math.PI * 2, false);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const h = new THREE.Path();
        h.absarc(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.16, 0, Math.PI * 2, true);
        s.holes.push(h);
      }
      const hub = new THREE.Path();
      hub.absarc(0, 0, 0.08, 0, Math.PI * 2, true);
      s.holes.push(hub);
      return new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 40 });
    })();
    [
      [-0.55, 1.62],
      [0.95, 1.5],
    ].forEach(([x, y], i) => {
      const reel = new THREE.Group();
      const side1 = new THREE.Mesh(reelGeo, i ? chrome : body);
      side1.position.z = 0.12;
      const side2 = new THREE.Mesh(reelGeo, i ? chrome : body);
      side2.position.z = -0.19;
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.7 }));
      core.rotation.x = Math.PI / 2;
      const hubM = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.42, 16), accent);
      hubM.rotation.x = Math.PI / 2;
      reel.add(side1, side2, core, hubM);
      reel.position.set(x, y, 0);
      reel.scale.setScalar(i ? 0.82 : 1);
      this.reels.push(reel);
      this.addPart(reel, 0.8 + i * 0.12, 8);
    });

    // REC lamp
    this.recLamp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff2a2a }));
    this.recLamp.position.set(0.95, 0.5, 0.6);
    this.addPart(this.recLamp, 1.0, 3);

    // tripod
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.85, roughness: 0.3 });
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.3, 24), legMat);
    head.position.set(0, -0.95, 0);
    this.addPart(head, 0.15, 5);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 3.4, 10), legMat);
      leg.position.set(Math.cos(a) * 0.75, -2.55, Math.sin(a) * 0.75);
      leg.lookAt(new THREE.Vector3(0, -0.9, 0));
      leg.rotateX(Math.PI / 2);
      this.addPart(leg, 0.0 + i * 0.06, 6);
    }

    this.rig.rotation.y = -0.35;
    this.scene.add(this.rig);
  }

  private buildClapper() {
    const g = new THREE.Group();
    const stripes = canvasTex(256, 32, (c) => {
      c.fillStyle = '#f5efe2';
      c.fillRect(0, 0, 256, 32);
      c.fillStyle = '#111';
      for (let x = -32; x < 288; x += 40) {
        c.beginPath();
        c.moveTo(x, 32);
        c.lineTo(x + 20, 32);
        c.lineTo(x + 40, 0);
        c.lineTo(x + 20, 0);
        c.fill();
      }
    });
    const slate = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.15, 0.06),
      new THREE.MeshStandardMaterial({
        roughness: 0.6,
        map: canvasTex(320, 230, (c) => {
          c.fillStyle = '#121214';
          c.fillRect(0, 0, 320, 230);
          c.strokeStyle = 'rgba(245,239,226,.55)';
          c.lineWidth = 2;
          [70, 125, 180].forEach((y) => {
            c.beginPath();
            c.moveTo(12, y);
            c.lineTo(308, y);
            c.stroke();
          });
          c.beginPath();
          c.moveTo(160, 70);
          c.lineTo(160, 180);
          c.stroke();
          c.fillStyle = '#f5efe2';
          c.font = '600 30px Antonio, Impact, sans-serif';
          c.fillText('RGU MEDIA TEAM', 20, 52);
          c.font = '500 16px monospace';
          c.fillStyle = 'rgba(245,239,226,.75)';
          c.fillText('SCENE', 20, 100);
          c.fillText('TAKE', 172, 100);
          c.fillText('ROLL', 20, 155);
          c.fillText('DATE', 172, 155);
          c.fillStyle = '#f26a2e';
          c.font = '600 26px monospace';
          c.fillText('01', 90, 112);
          c.fillText('26', 240, 112);
          c.fillText('A1', 90, 167);
          c.fillText('NOW', 236, 167);
        }),
      })
    );
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.08), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.5 }));
    bar.position.y = 0.68;
    g.add(slate, bar);
    // the clapping arm, hinged at its left end
    const pivot = new THREE.Group();
    pivot.position.set(-0.8, 0.8, 0);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.08), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.5 }));
    arm.position.x = 0.8;
    arm.position.y = 0.1;
    pivot.add(arm);
    pivot.rotation.z = 0.55;
    g.add(pivot);
    this.clapArm = pivot;
    this.clapFlash = new THREE.PointLight(0xffffff, 0, 6, 2);
    this.clapFlash.position.set(0, 0.9, 0.4);
    g.add(this.clapFlash);

    g.position.set(-3.1, -0.7, 1.6);
    g.rotation.set(0.05, 0.55, -0.12);
    g.scale.setScalar(0.85);
    this.addPart(g, 0.9, 9);
    this.rig.remove(g);
    this.scene.add(g);
    // keep the part list pointing at the scene-level object
  }

  private buildFilm(photos: string[]) {
    const FRAMES = 4;
    const fw = 256,
      fh = 160;
    const cv = document.createElement('canvas');
    cv.width = fw * FRAMES;
    cv.height = fh;
    const c = cv.getContext('2d')!;
    const paint = (imgs: (HTMLImageElement | null)[]) => {
      c.fillStyle = '#0d0b0a';
      c.fillRect(0, 0, cv.width, fh);
      for (let i = 0; i < FRAMES; i++) {
        const x = i * fw;
        // sprocket holes
        c.fillStyle = '#e9e2d4';
        for (let k = 0; k < 6; k++) {
          c.beginPath();
          c.roundRect(x + 12 + k * 42, 8, 22, 14, 3);
          c.roundRect(x + 12 + k * 42, fh - 22, 22, 14, 3);
          c.fill();
        }
        const img = imgs[i % Math.max(1, imgs.length)];
        if (img) cover(c, img, x + 10, 32, fw - 20, fh - 64);
        else {
          const g = c.createLinearGradient(x, 32, x + fw, fh - 32);
          g.addColorStop(0, '#f26a2e');
          g.addColorStop(1, '#5a2a8a');
          c.fillStyle = g;
          c.fillRect(x + 10, 32, fw - 20, fh - 64);
        }
        // warm film tint
        c.fillStyle = 'rgba(242,106,46,.12)';
        c.fillRect(x + 10, 32, fw - 20, fh - 64);
        c.fillStyle = 'rgba(245,239,226,.6)';
        c.font = '500 11px monospace';
        c.fillText(`RGU ${String(i + 1).padStart(2, '0')}A`, x + 14, fh - 26 + 2);
      }
    };
    paint([]);
    this.filmTex = new THREE.CanvasTexture(cv);
    this.filmTex.colorSpace = THREE.SRGBColorSpace;
    this.filmTex.wrapS = THREE.RepeatWrapping;
    this.filmTex.anisotropy = 4;
    Promise.all(photos.slice(0, FRAMES).map(loadImage)).then((imgs) => {
      if (this.disposed) return;
      paint(imgs);
      this.filmTex.needsUpdate = true;
    });

    // the strip leaves the front reel, loops over and wraps around the scene
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.6, 2.0, 0.3),
        new THREE.Vector3(1.6, 3.2, 1.4),
        new THREE.Vector3(3.6, 2.6, 2.2),
        new THREE.Vector3(4.8, 0.6, 0.4),
        new THREE.Vector3(3.8, -1.2, -2.6),
        new THREE.Vector3(0.4, -0.2, -4.4),
        new THREE.Vector3(-3.6, 1.4, -3.2),
        new THREE.Vector3(-5.2, 2.6, 0.2),
        new THREE.Vector3(-4.4, 0.4, 3.4),
        new THREE.Vector3(-1.4, -1.6, 5.2),
        new THREE.Vector3(2.8, -2.4, 6.2),
        new THREE.Vector3(7.0, -1.0, 7.0),
      ],
      false,
      'catmullrom',
      0.4
    );
    const SEG = 420;
    const width = 0.62;
    const pos = new Float32Array((SEG + 1) * 2 * 3);
    const uv = new Float32Array((SEG + 1) * 2 * 2);
    const idx: number[] = [];
    const len = curve.getLength();
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG;
      const p = curve.getPointAt(u);
      const tg = curve.getTangentAt(u);
      // side vector with a gentle twist along the strip
      const side = new THREE.Vector3().crossVectors(tg, up).normalize();
      side.applyAxisAngle(tg, Math.sin(u * Math.PI * 3) * 0.9);
      const a = p.clone().addScaledVector(side, width / 2);
      const b = p.clone().addScaledVector(side, -width / 2);
      pos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
      const uu = (u * len) / (width * 1.6) / FRAMES;
      uv.set([uu, 1, uu, 0], i * 4);
      if (i < SEG) {
        const k = i * 2;
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    this.filmCount = idx.length;
    geo.setDrawRange(0, 0);
    this.film = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        map: this.filmTex,
        side: THREE.DoubleSide,
        roughness: 0.45,
        metalness: 0.1,
        emissive: 0xffffff,
        emissiveMap: this.filmTex,
        emissiveIntensity: 0.14,
      })
    );
    this.scene.add(this.film);
  }

  private buildCards(photos: string[]) {
    const N = this.small ? 6 : 9;
    const geo = new THREE.PlaneGeometry(1.1, 1.32);
    for (let i = 0; i < N; i++) {
      const tex = canvasTex(220, 264, (c) => {
        c.fillStyle = '#f5efe2';
        c.fillRect(0, 0, 220, 264);
        const g = c.createLinearGradient(0, 0, 220, 200);
        g.addColorStop(0, '#f26a2e');
        g.addColorStop(1, '#3a1d5c');
        c.fillStyle = g;
        c.fillRect(12, 12, 196, 196);
      });
      const src = photos[i % Math.max(1, photos.length)];
      if (src)
        loadImage(src).then((img) => {
          if (!img || this.disposed) return;
          const c = (tex.image as HTMLCanvasElement).getContext('2d')!;
          cover(c, img, 12, 12, 196, 196);
          c.fillStyle = 'rgba(30,24,20,.75)';
          c.font = '600 15px Antonio, Impact, sans-serif';
          c.fillText(['CAMPUS', 'EVENTS', 'FESTS', 'SPORTS', 'STAGE', 'PODCAST', 'REELS', 'CREW', 'MOMENTS'][i % 9], 16, 240);
          tex.needsUpdate = true;
        });
      const mat = new THREE.MeshStandardMaterial({ transparent: true, color: 0xc9c4bc, map: tex, roughness: 0.55, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.05 });
      const mesh = new THREE.Mesh(geo, mat);
      const a = (i / N) * Math.PI * 2;
      const from = new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 16, -28 - Math.random() * 10);
      mesh.position.copy(from);
      this.cards.push({ mesh, a, r: 4.8 + (i % 3) * 0.6, y: ((i % 4) - 1.5) * 0.85, delay: 1.1 + i * 0.12, from, spin: (Math.random() - 0.5) * 0.6 });
      this.scene.add(mesh);
    }
  }

  private buildDust() {
    const n = this.small ? 400 : 900;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) p.set([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 30], i * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    this.dust = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffd2a8,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        map: canvasTex(32, 32, (c) => {
          const gr = c.createRadialGradient(16, 16, 0, 16, 16, 16);
          gr.addColorStop(0, '#fff');
          gr.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = gr;
          c.fillRect(0, 0, 32, 32);
        }),
      })
    );
    this.scene.add(this.dust);
  }

  /* ------------------------------------------------------------------ */
  /* loop                                                                */
  /* ------------------------------------------------------------------ */

  private onResize = () => {
    const w = this.container.clientWidth || innerWidth,
      h = this.container.clientHeight || innerHeight;
    this.cam.aspect = w / h;
    this.cam.fov = w < h ? 52 : 38;
    this.cam.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer?.setSize(w, h);
  };

  private onMove = (e: PointerEvent) => {
    this.mx = (e.clientX / innerWidth) * 2 - 1;
    this.my = (e.clientY / innerHeight) * 2 - 1;
  };

  private loop = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    // timeline starts on the first rendered frame (not at construction), so slow
    // shader compiles don't eat the opening; dt keeps speed equal on 60/120/144 Hz
    if (!this.started) {
      this.started = true;
      this.t0 = now;
      this.lastNow = now;
      this.renderer.domElement.style.opacity = '1';
      this.onStart?.();
    }
    const t = (now - this.t0) / 1000;
    const dt = Math.min(0.05, (now - this.lastNow) / 1000);
    this.lastNow = now;
    const f = dt * 60; // 1 at 60 fps
    this.smx += (this.mx - this.smx) * 0.05 * f;
    this.smy += (this.my - this.smy) * 0.05 * f;

    // assemble the camera
    for (const p of this.parts) {
      const k = clamp01((t - p.delay) / 0.95);
      const e = easeOutBack(k);
      p.obj.position.lerpVectors(p.from, p.home, e);
      p.obj.rotation.set(
        THREE.MathUtils.lerp(p.fromRot.x, p.homeRot.x, easeOutCubic(k)),
        THREE.MathUtils.lerp(p.fromRot.y, p.homeRot.y, easeOutCubic(k)),
        THREE.MathUtils.lerp(p.fromRot.z, p.homeRot.z, easeOutCubic(k))
      );
      p.obj.visible = t > p.delay - 0.05;
    }
    const reelSpeed = 1.2 + clamp01((t - 1.2) / 1.5) * 4;
    this.reels.forEach((r, i) => (r.rotation.z -= reelSpeed * dt * (i ? 1.25 : 1)));
    (this.recLamp.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(t * 6) > 0 ? 0xff2a2a : 0x3a0505);
    this.rig.position.y = Math.sin(t * 1.1) * 0.06;
    this.rig.rotation.y = -0.35 + Math.sin(t * 0.4) * 0.08;

    // clapper: open, snap shut at 1.7 s, reopen slowly
    const snap = 1.7;
    let armA = 0.55;
    if (t > snap - 0.25 && t < snap) armA = 0.55 + (t - (snap - 0.25)) * 0.5; // wind up
    else if (t >= snap && t < snap + 0.08) armA = THREE.MathUtils.lerp(0.68, 0, (t - snap) / 0.08);
    else if (t >= snap + 0.08) armA = Math.min(0.4, (t - snap - 0.6) * 0.3);
    this.clapArm.rotation.z = Math.max(0, armA);
    this.clapFlash.intensity = t > snap && t < snap + 0.5 ? (1 - (t - snap) / 0.5) * 18 : 0;

    // film: unspool, then keep running
    const spool = easeInOutCubic(clamp01((t - 0.9) / 1.9));
    this.film.geometry.setDrawRange(0, Math.floor((this.filmCount / 6) * spool) * 6);
    this.filmTex.offset.x = -t * 0.35;

    // polaroids fly in and orbit
    const camTarget = this.cam.position;
    this.cards.forEach((c, i) => {
      const k = easeOutCubic(clamp01((t - c.delay) / 1.3));
      const a = c.a + t * 0.22;
      // flattened orbit so cards circle the camera instead of filling the lens
      const home = new THREE.Vector3(Math.cos(a) * c.r, c.y + Math.sin(t * 0.9 + i) * 0.18, Math.sin(a) * c.r * 0.55 - 0.8);
      // fade out cards that swing close to the viewer
      const near = c.mesh.position.distanceTo(camTarget);
      (c.mesh.material as THREE.MeshStandardMaterial).opacity = clamp01((near - 3) / 2.5);
      if (this.exiting) {
        const ek = easeInOutCubic(clamp01((now - this.exitT0) / 1000 / this.exitDur));
        home.multiplyScalar(1 + ek * 3.5);
      }
      c.mesh.position.lerpVectors(c.from, home, k);
      c.mesh.lookAt(camTarget);
      c.mesh.rotateZ(c.spin + Math.sin(t + i) * 0.08);
      c.mesh.visible = t > c.delay - 0.05;
    });

    this.dust.rotation.y = t * 0.02;
    this.dust.position.y = Math.sin(t * 0.3) * 0.3;

    // camera move: sweeping crane shot onto a 3/4 view
    if (!this.exiting) {
      const k = easeOutCubic(clamp01(t / 3.2));
      const ang = THREE.MathUtils.lerp(-1.05, 0.42, k) + this.smx * 0.12;
      // portrait screens need the camera further back to fit the lens and reels
      const fit = this.cam.aspect < 1 ? THREE.MathUtils.clamp(1 / this.cam.aspect, 1, 1.9) * 0.78 : 1;
      const rad = THREE.MathUtils.lerp(15, 8.6, k) * Math.max(1, fit);
      const y = THREE.MathUtils.lerp(3.2, 1.1, k) - this.smy * 0.5;
      this.cam.position.set(Math.sin(ang) * rad, y, Math.cos(ang) * rad);
      this.cam.lookAt(this.cam.aspect < 1 ? 0.6 : 0, 0.35, 0);
    } else {
      const e = easeInOutCubic(clamp01((now - this.exitT0) / 1000 / this.exitDur));
      this.rig.updateMatrixWorld();
      // aim at a point just in front of the glass, then push through it
      const front = new THREE.Vector3(2.25, -0.05, 0).applyMatrix4(this.rig.matrixWorld);
      const out = new THREE.Vector3(6.5, -0.05, 0).applyMatrix4(this.rig.matrixWorld);
      this.lensFront.copy(front);
      // curve round onto the lens axis first, then push straight into the glass
      const target = front.clone().lerp(out, 0.02);
      const a = this.exitFrom.clone().lerp(out, e);
      const b = out.clone().lerp(target, e);
      this.cam.position.copy(a.lerp(b, e));
      this.cam.lookAt(new THREE.Vector3(0.5, -0.05, 0).applyMatrix4(this.rig.matrixWorld));
      this.cam.fov = THREE.MathUtils.lerp(this.cam.fov, 75, Math.min(1, 0.08 * f));
      this.cam.updateProjectionMatrix();
      this.lensGlass.emissiveIntensity = 0.35 + e * e * 6;
      if (e >= 1 && this.exitResolve) {
        const r = this.exitResolve;
        this.exitResolve = null;
        r();
      }
    }

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.cam);
  };

  /** Fly into the lens. Resolves when the camera is through the glass. */
  exit(): Promise<void> {
    if (this.exiting) return Promise.resolve();
    this.exiting = true;
    this.exitT0 = performance.now();
    this.exitFrom.copy(this.cam.position);
    return new Promise((r) => (this.exitResolve = r));
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    removeEventListener('resize', this.onResize);
    removeEventListener('pointermove', this.onMove);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => {
        Object.values(mat).forEach((v) => (v as THREE.Texture)?.isTexture && (v as THREE.Texture).dispose());
        mat.dispose();
      });
    });
    this.scene.environment?.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
