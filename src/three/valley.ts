import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { perfTier, frameGuard, type Tier } from '../lib/device';

/**
 * Night Flower Valley — an original three.js scene.
 * Thousands of glowing point-sprite flowers bloom as the camera flies down a
 * valley. The cursor pushes flowers aside in screen space and lights them up.
 * Post: bloom, RGB split + grain, and a vignette that tightens with speed.
 */

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const damp = (a: number, b: number, l: number, dt: number) => a + (b - a) * (1 - Math.exp(-l * dt));

// deterministic random
let seed = 1337;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;

export const pathX = (z: number) => 7 * Math.sin(z * 0.013) + 3 * Math.sin(z * 0.031 + 1.3);
export const height = (x: number, z: number) => {
  const dx = x - pathX(z);
  return (
    9 * (1 - Math.exp(-(dx * dx) / 700)) +
    1.6 * Math.sin(x * 0.07 + z * 0.023) +
    1.1 * Math.sin(z * 0.041) * Math.cos(x * 0.09) +
    0.5 * Math.sin(x * 0.21 + z * 0.17)
  );
};

const Z_START = 18;
const Z_END = -460;

const flowerVS = /* glsl */ `
attribute float aSize;
attribute float aRand;
attribute vec3 aColor;
attribute float aKind; // 0 flower, 1 leaf
uniform float uTime, uPixel, uIntro, uDisperse, uAspect, uPush, uPulse;
uniform vec2 uMouse;
uniform vec3 uTint;
uniform vec4 uWaves[4]; // ndc.xy, start time, strength
varying vec3 vColor;
varying float vGlow, vKind, vRand, vFade, vDisp, vNear;

vec3 hash3(float n){ return fract(sin(vec3(n, n+1.7, n+3.1))*vec3(43758.5453,22578.1459,19642.3490))*2.-1.; }

void main(){
  vec3 p = position;
  // wind
  float sway = sin(uTime*1.1 + p.z*.14 + p.x*.09 + aRand*6.28);
  p.x += sway*.16*(1.-aKind*.4);
  p.y += cos(uTime*.8 + aRand*12.)*.05;

  // disperse into floating particles
  vec3 dir = hash3(aRand*91.7);
  float dd = uDisperse*(1.0+aRand*.6);
  p += vec3(dir.x*5., abs(dir.y)*6.+2.5, dir.z*4.)*dd*(1.+aRand*1.5);
  p.y += sin(uTime*.6 + aRand*30.)*1.2*uDisperse;
  p.x += cos(uTime*.4 + aRand*17.)*1.0*uDisperse;

  vec4 mv = modelViewMatrix*vec4(p,1.);
  float dist = -mv.z;
  vec4 clip = projectionMatrix*mv;

  vec2 ndc = clip.xy/clip.w;

  // click shockwaves: expanding rings that shove and ignite the flowers
  float ring = 0.;
  for(int i=0;i<4;i++){
    vec4 w = uWaves[i];
    float age = uTime-w.z;
    if(age<0. || age>3.5) continue;
    vec2 dw = (ndc-w.xy)*vec2(uAspect,1.);
    float lw = length(dw);
    float rr = exp(-pow((lw-age*1.35)*5.,2.))*exp(-age*1.05)*w.w;
    ndc += (dw/(lw+1e-4))/vec2(uAspect,1.)*rr*.1;
    ring += rr;
  }

  // screen-space push away from the cursor
  vec2 d = (ndc-uMouse)*vec2(uAspect,1.);
  float l = length(d);
  float f = exp(-l*l*9.)*uPush;
  ndc += (d/(l+1e-4))/vec2(uAspect,1.)*f*.16;
  clip.xy = ndc*clip.w;
  gl_Position = clip;

  vGlow = exp(-l*l*26.)*uPush + ring*.9;

  // flowers bloom as they approach, leaves grow further back
  float grow = aKind < .5 ? mix(.28, 1., smoothstep(80., 12., dist)) : smoothstep(2.5, 22., dist);
  float intro = smoothstep(aRand*.6, aRand*.6+.4, uIntro);
  float beat = 1. + uPulse*(.25+aRand*.6)*(1.-aKind);
  float s = aSize*grow*intro*beat*(1.+vGlow*.9)*(1.+uDisperse*(aKind<.5?-.35:-.6));
  vNear = smoothstep(6., 1.8, dist)*(1.-aKind);
  gl_PointSize = clamp(s*uPixel*240./max(dist,.1), 0., mix(64., 130., vNear)*uPixel);

  vColor = aColor*uTint*(1.+uPulse*.5);
  vKind = aKind;
  vRand = aRand;
  vDisp = uDisperse;
  vFade = exp(-dist*.0085)*smoothstep(.5, 3., dist);
}`;

const flowerFS = /* glsl */ `
uniform float uTime;
varying vec3 vColor;
varying float vGlow, vKind, vRand, vFade, vDisp, vNear;
void main(){
  vec2 c = gl_PointCoord-.5;
  float r = length(c)*2.;
  if(r>1.) discard;
  vec3 col;
  float a;
  float dotGlow = exp(-r*r*7.);
  if(vKind<.5){
    float ang = atan(c.y,c.x) + vRand*6.28 + uTime*.05;
    float petals = 5.+floor(vRand*3.);
    float shape = .5+.5*abs(cos(ang*petals*.5));
    float petal = smoothstep(shape*.95, shape*.95-.22, r);
    float core = smoothstep(.3, 0., r);
    float halo = exp(-r*r*3.2)*.45;
    col = vColor*(petal*.95+halo) + vec3(1.,.93,.78)*core*.9;
    a = max(petal, halo);
    col = mix(col, vColor*1.6+vec3(.25), vDisp*.85);
    a = mix(a, dotGlow, vDisp*.85);
    col = mix(col, vColor*dotGlow*1.4, vDisp*.85);
    // out-of-focus bokeh for flowers right in front of the lens
    float disc = smoothstep(1., .86, r);
    float rim = smoothstep(.62, .95, r)*disc;
    vec3 bok = vColor*(disc*.22 + rim*.45);
    col = mix(col, bok, vNear);
    a = mix(a, disc*.5, vNear);
  } else {
    float ang = vRand*6.28;
    mat2 R = mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
    vec2 q = R*c*vec2(3.2,1.);
    float leaf = smoothstep(.5,.3,length(q));
    col = vColor*leaf;
    a = leaf*(1.-vDisp*.7);
  }
  float tw = .8+.2*sin(uTime*2.3+vRand*40.);
  col *= tw;
  col += vec3(1.,.85,.6)*vGlow*1.6*a;
  gl_FragColor = vec4(col*vFade, 1.);
}`;

const groundVS = /* glsl */ `
varying float vH; varying float vD; varying vec3 vW;
void main(){
  vec4 w = modelMatrix*vec4(position,1.);
  vW = w.xyz; vH = position.y;
  vec4 mv = viewMatrix*w; vD = -mv.z;
  gl_Position = projectionMatrix*mv;
}`;
const groundFS = /* glsl */ `
uniform vec3 uLow, uHigh, uFog; uniform float uTime;
varying float vH; varying float vD; varying vec3 vW;
void main(){
  vec3 c = mix(uLow, uHigh, smoothstep(-2., 14., vH));
  float lines = smoothstep(.97,1.,sin(vW.z*.5+vW.x*.02))*.02;
  c += lines;
  float fog = 1.-exp(-vD*.016);
  gl_FragColor = vec4(mix(c, uFog, fog), 1.);
}`;

const skyVS = /* glsl */ `
varying vec3 vDir;
void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); gl_Position = p.xyww; }`;
const skyFS = /* glsl */ `
uniform vec3 uTop, uHorizon, uGlow; uniform float uTime;
varying vec3 vDir;
void main(){
  float h = vDir.y;
  vec3 c = mix(uHorizon, uTop, smoothstep(-.05,.55,h));
  float g = exp(-abs(h+.02)*9.)*.9;
  c += uGlow*g;
  // aurora ribbon
  float band = exp(-pow((h-.22-.05*sin(vDir.x*3.+uTime*.05))*9.,2.));
  c += vec3(.06,.12,.1)*band*(.5+.5*sin(vDir.x*6.+uTime*.1));
  gl_FragColor = vec4(c,1.);
}`;

const dustVS = /* glsl */ `
attribute float aRand;
uniform vec3 uCam; uniform float uTime, uPixel, uBox, uIntro;
varying float vA;
void main(){
  vec3 p = position + vec3(sin(uTime*.2+aRand*30.)*1.5, uTime*.25*(.3+aRand), cos(uTime*.15+aRand*20.)*1.5);
  p = mod(p - uCam + uBox*.5, uBox) - uBox*.5 + uCam;
  vec4 mv = modelViewMatrix*vec4(p,1.);
  float d = -mv.z;
  gl_Position = projectionMatrix*mv;
  float tw = .5+.5*sin(uTime*(1.+aRand*3.)+aRand*50.);
  vA = tw*smoothstep(uBox*.5, uBox*.2, d)*smoothstep(.5,2.,d)*uIntro;
  gl_PointSize = (1.5+aRand*3.5)*uPixel*40./max(d,.1);
}`;
const dustFS = /* glsl */ `
uniform vec3 uColor; varying float vA;
void main(){ float r = length(gl_PointCoord-.5)*2.; float a = exp(-r*r*5.)*vA; gl_FragColor = vec4(uColor*a,1.); }`;

const starVS = /* glsl */ `
attribute float aRand; uniform float uTime, uPixel;
varying float vA;
void main(){
  vec4 mv = modelViewMatrix*vec4(position,1.);
  gl_Position = projectionMatrix*mv; gl_Position.z = gl_Position.w*.9999;
  vA = (.35+.65*sin(uTime*(.5+aRand*2.)+aRand*90.))*smoothstep(-.05,.3,normalize(position).y);
  gl_PointSize = (1.+aRand*2.2)*uPixel;
}`;
const starFS = /* glsl */ `
varying float vA;
void main(){ float r = length(gl_PointCoord-.5)*2.; gl_FragColor = vec4(vec3(.9,.92,1.)*(1.-r)*vA,1.); }`;

const trailVS = /* glsl */ `
attribute float aLife; attribute float aSeed; uniform float uPixel;
varying float vLife; varying float vSeed;
void main(){
  vec4 mv = modelViewMatrix*vec4(position,1.);
  gl_Position = projectionMatrix*mv;
  vLife = aLife; vSeed = aSeed;
  gl_PointSize = aLife*(2.+aSeed*5.)*uPixel*22./max(-mv.z,.1);
}`;
const trailFS = /* glsl */ `
varying float vLife; varying float vSeed;
void main(){
  float r = length(gl_PointCoord-.5)*2.;
  float a = exp(-r*r*6.)*vLife;
  vec3 c = mix(vec3(1.,.42,.16), vec3(1.,.93,.8), vSeed);
  gl_FragColor = vec4(c*a*1.6,1.);
}`;

const shootVS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const shootFS = /* glsl */ `
uniform float uAlpha; varying vec2 vUv;
void main(){
  float a = pow(vUv.x, 3.)*(1.-abs(vUv.y-.5)*2.)*uAlpha;
  gl_FragColor = vec4(vec3(1.,.95,.88)*a*2.,1.);
}`;

const rayVS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const rayFS = /* glsl */ `
uniform float uTime, uSeed, uOpacity; uniform vec3 uColor; varying vec2 vUv;
void main(){
  float x = abs(vUv.x-.5)*2.;
  float a = (1.-x)*(1.-x)*smoothstep(0.,.35,vUv.y)*smoothstep(1.,.55,vUv.y);
  a *= .55+.45*sin(uTime*.35+uSeed*7.);
  gl_FragColor = vec4(uColor*a*uOpacity,1.);
}`;

const finalShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uSplit: { value: 0.002 },
    uVig: { value: 0 },
    uGrain: { value: 0.035 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uWave: { value: new THREE.Vector4(0.5, 0.5, 99, 0) },
    uAspect: { value: 1 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: /* glsl */ `
  uniform sampler2D tDiffuse; uniform float uTime, uSplit, uVig, uGrain, uAspect; uniform vec2 uRes; uniform vec4 uWave;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
  void main(){
    vec2 uv = vUv;
    // refraction ring from the latest shockwave
    vec2 wd = (uv-uWave.xy)*vec2(uAspect,1.);
    float wl = length(wd);
    float wr = exp(-pow((wl-uWave.z*.68)*16.,2.))*exp(-uWave.z*1.3)*uWave.w;
    uv -= (wd/(wl+1e-4))/vec2(uAspect,1.)*wr*.028;
    vec2 dir = uv-.5; float d = length(dir);
    vec2 off = dir*uSplit*(1.+d*2.);
    float n = hash(vec2(floor(vUv.y*uRes.y*.5), floor(uTime*24.)));
    off.x += (n-.5)*uSplit*.35;
    vec3 c;
    off += (wd/(wl+1e-4))/vec2(uAspect,1.)*wr*.01;
    c.r = texture2D(tDiffuse, uv+off).r;
    c.g = texture2D(tDiffuse, uv).g;
    c.b = texture2D(tDiffuse, uv-off).b;
    c += vec3(1.,.8,.6)*wr*.06;
    float g = hash(vUv*uRes + fract(uTime)*100.)-.5;
    c += g*uGrain;
    float inner = .42 - uVig*.22;
    c *= 1. - smoothstep(inner, inner+.62, d)*(.82+uVig*.15);
    gl_FragColor = vec4(c,1.);
  }`,
};

export interface ValleyOptions {
  onLoaded?: () => void;
  onIntroDone?: () => void;
  /** 0..1 loudness of the ambient track; flowers pulse with it */
  getAudioLevel?: () => number;
}

const TRAIL_N = 90;
const PALETTE_STOPS = [
  { glow: new THREE.Color('#3a1a0c'), tint: new THREE.Color(1, 1, 1) },
  { glow: new THREE.Color('#2e0d2c'), tint: new THREE.Color(1.05, 0.86, 1.12) },
  { glow: new THREE.Color('#062a2c'), tint: new THREE.Color(0.85, 1.05, 1.15) },
];

export class FlowerValley {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private final: ShaderPass;
  private flowerMat!: THREE.ShaderMaterial;
  private dustMat!: THREE.ShaderMaterial;
  private starMat!: THREE.ShaderMaterial;
  private skyMat!: THREE.ShaderMaterial;
  private rays: THREE.ShaderMaterial[] = [];
  private rayGroup = new THREE.Group();
  private path!: THREE.CatmullRomCurve3;
  private clock = new THREE.Clock();
  private raf = 0;
  private running = false;
  private disposed = false;
  private introDone = false;

  // state
  private s = 0; // path progress 0..1
  private sPrev = 0;
  private drift = 0;
  private scrollT = 0;
  private flight = 1; // 1 = flying, 0 = stopped
  private flightTarget = 1;
  private disperse = 0;
  private disperseTarget = 0;
  private intro = 0;
  private speed = 0;
  private mouse = new THREE.Vector2(0, 0);
  private mouseS = new THREE.Vector2(0, 0);
  private push = 0;
  private pushTarget = 0;
  private lookTarget = new THREE.Vector3();
  private tmpV = new THREE.Vector3();
  private W = 1;
  private H = 1;
  private mobile: boolean;
  private pixel = 1;
  private baseFov = 58;
  private pulse = 0;
  // shockwaves
  private waves = [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, -99, 0));
  private waveIdx = 0;
  private lastWave = new THREE.Vector4(0, 0, -99, 0);
  // cursor trail
  private trailGeo!: THREE.BufferGeometry;
  private trailPos = new Float32Array(TRAIL_N * 3);
  private trailVel = new Float32Array(TRAIL_N * 3);
  private trailLife = new Float32Array(TRAIL_N);
  private trailHead = 0;
  private mouseMoved = 0;
  // shooting star
  private shoot!: THREE.Mesh;
  private shootMat!: THREE.ShaderMaterial;
  private shootT = -1;
  private shootNext = 3;
  private shootA = 0;
  private shootFrom = new THREE.Vector2();
  private tmpC = new THREE.Color();
  private tmpTint = new THREE.Color();

  constructor(private container: HTMLElement, private opts: ValleyOptions = {}) {
    this.tier = perfTier();
    this.mobile = this.tier !== 'high' || window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches;
    this.q = this.tier === 'low' ? 0.45 : 1;
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: this.tier === 'low' ? 'default' : 'high-performance' });
    this.pixel = Math.min(window.devicePixelRatio, this.tier === 'low' ? 0.85 : this.mobile ? 1.35 : 1.75);
    this.guard = frameGuard(() => this.degrade());
    this.renderer.setPixelRatio(this.pixel);
    this.renderer.setClearColor(0x020306, 1);
    this.renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1200);
    this.buildPath();
    this.buildSky();
    this.buildGround();
    this.buildFlowers();
    this.buildDust();
    this.buildRays();
    this.buildTrail();
    this.buildShootingStar();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.7, 0.18);
    this.composer.addPass(this.bloom);
    this.final = new ShaderPass(finalShader);
    this.composer.addPass(this.final);
    this.composer.addPass(new OutputPass());
    if (this.tier === 'low') this.bloom.enabled = false;

    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('pointerleave', this.onLeave);
    this.clickTarget = container.parentElement || container;
    this.clickTarget.addEventListener('pointerdown', this.onDown);

    // first frame is ready → loaded
    requestAnimationFrame(() => {
      this.renderFrame(0);
      this.opts.onLoaded?.();
    });
    this.start();
  }

  /* ---------- builders ---------- */
  private buildPath() {
    const pts: THREE.Vector3[] = [];
    for (let z = Z_START; z >= Z_END; z -= 20) {
      const x = pathX(z);
      let h = -Infinity;
      for (let k = -6; k <= 6; k += 3) h = Math.max(h, height(x, z + k));
      pts.push(new THREE.Vector3(x, h + 3.2, z));
    }
    this.path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    this.path.arcLengthDivisions = 800;
  }

  private buildSky() {
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: skyVS,
      fragmentShader: skyFS,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color('#020309') },
        uHorizon: { value: new THREE.Color('#0b1020') },
        uGlow: { value: new THREE.Color('#3a1a0c') },
        uTime: { value: 0 },
      },
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), this.skyMat);
    sky.frustumCulled = false;
    sky.renderOrder = -2;
    this.scene.add(sky);

    // stars
    const N = Math.round((this.mobile ? 900 : 1800) * this.q);
    const pos = new Float32Array(N * 3);
    const r = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(rnd() * 0.95);
      pos.set([Math.sin(ph) * Math.cos(th) * 800, Math.cos(ph) * 800, Math.sin(ph) * Math.sin(th) * 800], i * 3);
      r[i] = rnd();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1));
    this.starMat = new THREE.ShaderMaterial({
      vertexShader: starVS,
      fragmentShader: starFS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixel: { value: this.pixel } },
    });
    const stars = new THREE.Points(g, this.starMat);
    stars.frustumCulled = false;
    stars.renderOrder = -1;
    this.scene.add(stars);

    // moon
    const moonTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const x = c.getContext('2d')!;
      const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, 'rgba(255,240,220,1)');
      gr.addColorStop(0.12, 'rgba(255,236,210,.95)');
      gr.addColorStop(0.16, 'rgba(255,200,150,.25)');
      gr.addColorStop(0.5, 'rgba(242,106,46,.05)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr;
      x.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    })();
    const moon = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: moonTex, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
    );
    moon.scale.set(220, 220, 1);
    moon.position.set(-160, 190, -700);
    (moon as any).userData.follow = true;
    this.moon = moon;
    this.scene.add(moon);
  }
  private moon!: THREE.Sprite;

  private buildGround() {
    const W = 260,
      L = Z_START - Z_END + 200;
    const g = new THREE.PlaneGeometry(W, L, 130, 340);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, (Z_START + Z_END) / 2 - 60);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i);
      p.setY(i, height(x, z) - 0.35);
    }
    g.computeVertexNormals();
    const m = new THREE.ShaderMaterial({
      vertexShader: groundVS,
      fragmentShader: groundFS,
      uniforms: {
        uLow: { value: new THREE.Color('#030507') },
        uHigh: { value: new THREE.Color('#0a0f12') },
        uFog: { value: new THREE.Color('#0b1020') },
        uTime: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    this.scene.add(mesh);
  }

  private buildFlowers() {
    const NF = Math.round((this.mobile ? 9000 : 20000) * this.q);
    const NL = Math.round((this.mobile ? 5000 : 11000) * this.q);
    const N = NF + NL;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const size = new Float32Array(N);
    const rand = new Float32Array(N);
    const kind = new Float32Array(N);
    const palette = [
      ['#F26A2E', 3],
      ['#FF9A5A', 2.4],
      ['#FFC46B', 2],
      ['#F5EFE2', 1.6],
      ['#FF6F91', 1],
      ['#B48CFF', 0.7],
      ['#7FE0D0', 0.5],
    ] as const;
    const total = palette.reduce((a, [, w]) => a + w, 0);
    const pick = () => {
      let r = rnd() * total;
      for (const [c, w] of palette) {
        if ((r -= w) <= 0) return new THREE.Color(c);
      }
      return new THREE.Color(palette[0][0]);
    };
    const leafCols = ['#1d4a2e', '#2c6b3f', '#173a2a', '#3f7d4a'].map((c) => new THREE.Color(c));
    for (let i = 0; i < N; i++) {
      const isLeaf = i >= NF;
      const z = Z_START + 6 - rnd() * (Z_START - Z_END + 40);
      // cluster near the path, with meadows on the slopes
      const spread = isLeaf ? 26 : rnd() < 0.75 ? 12 : 26;
      let x = pathX(z) + gauss() * spread;
      // keep a soft corridor for the camera
      const dx = x - pathX(z);
      if (Math.abs(dx) < 2.2) x += Math.sign(dx || 1) * (2.2 - Math.abs(dx)) * (0.6 + rnd());
      const y = height(x, z) + (isLeaf ? 0.1 + rnd() * 0.5 : 0.25 + rnd() * 1.1);
      pos.set([x, y, z], i * 3);
      const c = isLeaf ? leafCols[(rnd() * leafCols.length) | 0].clone().multiplyScalar(0.4) : pick().multiplyScalar(0.3 + rnd() * 0.45);
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = isLeaf ? 0.3 + rnd() * 0.4 : 0.18 + Math.pow(rnd(), 2.6) * 0.6;
      rand[i] = rnd();
      kind[i] = isLeaf ? 1 : 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    g.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
    this.flowerMat = new THREE.ShaderMaterial({
      vertexShader: flowerVS,
      fragmentShader: flowerFS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixel: { value: this.pixel },
        uIntro: { value: 0 },
        uDisperse: { value: 0 },
        uAspect: { value: 1 },
        uPush: { value: 0 },
        uPulse: { value: 0 },
        uTint: { value: new THREE.Color(1, 1, 1) },
        uWaves: { value: this.waves },
        uMouse: { value: new THREE.Vector2(9, 9) },
      },
    });
    const pts = new THREE.Points(g, this.flowerMat);
    pts.frustumCulled = false;
    this.scene.add(pts);
  }

  private buildDust() {
    const N = Math.round((this.mobile ? 500 : 1400) * this.q);
    const box = 50;
    const pos = new Float32Array(N * 3);
    const r = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos.set([(rnd() - 0.5) * box, (rnd() - 0.5) * box * 0.5, (rnd() - 0.5) * box], i * 3);
      r[i] = rnd();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1));
    this.dustMat = new THREE.ShaderMaterial({
      vertexShader: dustVS,
      fragmentShader: dustFS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uCam: { value: new THREE.Vector3() },
        uTime: { value: 0 },
        uPixel: { value: this.pixel },
        uBox: { value: box },
        uIntro: { value: 0 },
        uColor: { value: new THREE.Color('#ffd7a3') },
      },
    });
    const p = new THREE.Points(g, this.dustMat);
    p.frustumCulled = false;
    this.scene.add(p);
  }

  private buildRays() {
    for (let i = 0; i < 6; i++) {
      const m = new THREE.ShaderMaterial({
        vertexShader: rayVS,
        fragmentShader: rayFS,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: i * 1.37 },
          uOpacity: { value: 0.025 + rnd() * 0.025 },
          uColor: { value: new THREE.Color(i % 2 ? '#ffd2a0' : '#9fb6ff') },
        },
      });
      this.rays.push(m);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4 + rnd() * 6, 90), m);
      mesh.position.set(-34 + i * 12 + rnd() * 6, 14, -60 - rnd() * 20);
      mesh.rotation.z = -0.42 + rnd() * 0.1;
      this.rayGroup.add(mesh);
    }
    this.scene.add(this.rayGroup);
  }

  private buildTrail() {
    const g = (this.trailGeo = new THREE.BufferGeometry());
    const seed = new Float32Array(TRAIL_N);
    for (let i = 0; i < TRAIL_N; i++) seed[i] = rnd();
    g.setAttribute('position', new THREE.BufferAttribute(this.trailPos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aLife', new THREE.BufferAttribute(this.trailLife, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: trailVS,
      fragmentShader: trailFS,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uPixel: { value: this.pixel } },
    });
    const p = new THREE.Points(g, m);
    p.frustumCulled = false;
    p.renderOrder = 5;
    this.scene.add(p);
  }

  private buildShootingStar() {
    this.shootMat = new THREE.ShaderMaterial({
      vertexShader: shootVS,
      fragmentShader: shootFS,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uAlpha: { value: 0 } },
    });
    this.shoot = new THREE.Mesh(new THREE.PlaneGeometry(70, 0.9), this.shootMat);
    this.shoot.frustumCulled = false;
    this.shoot.renderOrder = -1;
    this.shoot.visible = false;
    this.scene.add(this.shoot);
  }

  /* ---------- events ---------- */
  private clickTarget!: HTMLElement;
  private onPointer = (e: PointerEvent) => {
    const r = this.container.getBoundingClientRect();
    this.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.pushTarget = e.pointerType === 'touch' ? 0.6 : 1;
    this.mouseMoved = Math.min(4, this.mouseMoved + Math.hypot(e.movementX || 0, e.movementY || 0) * 0.05);
  };
  private onDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement)?.closest?.('a,button')) return;
    const r = this.container.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1,
      y = -((e.clientY - r.top) / r.height) * 2 + 1;
    this.waves[this.waveIdx].set(x, y, this.elapsed, 1);
    this.waveIdx = (this.waveIdx + 1) % this.waves.length;
    this.lastWave.set((x + 1) / 2, (y + 1) / 2, this.elapsed, 1);
    this.pulse = Math.min(1.4, this.pulse + 0.6);
    this.burstTrail(x, y, 26);
  };

  private worldAt(nx: number, ny: number, dist: number, out: THREE.Vector3) {
    out.set(nx, ny, 0.5).unproject(this.camera).sub(this.camera.position).normalize();
    return out.multiplyScalar(dist).add(this.camera.position);
  }
  private spawnTrail(nx: number, ny: number, speed: number) {
    const i = this.trailHead;
    this.trailHead = (this.trailHead + 1) % TRAIL_N;
    this.worldAt(nx + (rnd() - 0.5) * 0.02, ny + (rnd() - 0.5) * 0.02, 6 + rnd() * 3, this.tmpV);
    this.trailPos.set([this.tmpV.x, this.tmpV.y, this.tmpV.z], i * 3);
    this.trailVel.set([(rnd() - 0.5) * speed, (0.3 + rnd()) * speed * 0.8, (rnd() - 0.5) * speed], i * 3);
    this.trailLife[i] = 1;
  }
  private burstTrail(nx: number, ny: number, n: number) {
    for (let k = 0; k < n; k++) this.spawnTrail(nx, ny, 2.6);
  }
  private onLeave = () => {
    this.pushTarget = 0;
  };

  resize = () => {
    const r = this.container.getBoundingClientRect();
    this.W = Math.max(1, r.width);
    this.H = Math.max(1, r.height);
    this.renderer.setSize(this.W, this.H, false);
    this.composer.setSize(this.W, this.H);
    this.composer.setPixelRatio(this.pixel);
    this.bloom.resolution.set(this.W * 0.5, this.H * 0.5);
    this.camera.aspect = this.W / this.H;
    this.baseFov = this.camera.aspect < 1 ? 70 : 58;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
    this.flowerMat.uniforms.uAspect.value = this.camera.aspect;
    this.final.uniforms.uAspect.value = this.camera.aspect;
    this.final.uniforms.uRes.value.set(this.W * this.pixel, this.H * this.pixel);
  };

  /* ---------- public API ---------- */
  setScroll(t: number) {
    this.scrollT = clamp(t);
  }
  startHoverTransition() {
    this.flightTarget = 0;
    this.disperseTarget = 1;
  }
  stopHoverTransition() {
    this.flightTarget = 1;
    this.disperseTarget = 0;
  }
  setActive(on: boolean) {
    if (on) this.start();
    else this.stop();
  }
  get progress() {
    return this.s;
  }
  get depth() {
    return this.s * this.path.getLength();
  }

  private start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.getDelta();
    const tick = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(tick);
      this.renderFrame(Math.min(this.clock.getDelta(), 0.05));
    };
    this.raf = requestAnimationFrame(tick);
  }
  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private tier: Tier = 'high';
  /** particle-count multiplier (lower on weak devices) */
  private q = 1;
  private guard: (now: number) => void = () => {};
  private degraded = 0;
  /** Frame guard tripped: lower resolution, then drop bloom. */
  private degrade() {
    this.degraded++;
    this.pixel = Math.max(0.7, this.pixel * 0.75);
    this.renderer.setPixelRatio(this.pixel);
    if (this.degraded >= 2) this.bloom.enabled = false;
    this.resize();
    if (this.degraded < 3) this.guard = frameGuard(() => this.degrade());
  }

  private elapsed = 0;
  private renderFrame(dt: number) {
    this.guard(performance.now());
    this.elapsed += dt;
    const t = this.elapsed;

    // intro: descend into the valley
    this.intro = Math.min(1, this.intro + dt / 3.6);
    const ie = 1 - Math.pow(1 - this.intro, 3);
    if (!this.introDone && this.intro >= 0.82) {
      this.introDone = true;
      this.opts.onIntroDone?.();
    }

    this.flight = damp(this.flight, this.flightTarget, 2.2, dt);
    this.disperse = damp(this.disperse, this.disperseTarget, this.disperseTarget > this.disperse ? 1.6 : 2.4, dt);
    this.drift += dt * 0.0024 * this.flight * ie;

    const target = clamp(0.02 + this.scrollT * 0.42 + this.drift, 0, 0.985);
    // when stopped, freeze where we are
    const blend = 0.5 + 0.5 * this.flight;
    this.sPrev = this.s;
    this.s = damp(this.s, target, 3.2 * blend, dt);
    if (this.s > 0.97) this.drift -= dt * 0.01; // gently hold at the end
    const v = Math.abs(this.s - this.sPrev) / Math.max(dt, 1e-4);
    this.speed = damp(this.speed, clamp(v * 18), 4, dt);

    // camera
    const p = this.path.getPointAt(this.s);
    const ahead = this.path.getPointAt(Math.min(1, this.s + 0.012));
    const lift = (1 - ie) * 26;
    this.camera.position.set(p.x, p.y + lift + Math.sin(t * 0.6) * 0.08, p.z + (1 - ie) * 18);
    this.mouseS.lerp(this.mouse, 1 - Math.exp(-3 * dt));
    this.lookTarget.set(
      ahead.x + this.mouseS.x * 2.6,
      ahead.y + 0.6 + this.mouseS.y * 1.4 - (1 - ie) * 4,
      ahead.z
    );
    this.camera.lookAt(this.lookTarget);
    this.camera.rotateZ(-this.mouseS.x * 0.025 + Math.sin(t * 0.3) * 0.006);
    // speed warp: the lens widens as you rush forward
    const fov = this.baseFov + this.speed * 11 - this.disperse * 3;
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }

    // palette drifts with depth: ember dusk → violet night → teal aurora
    const seg = this.s * (PALETTE_STOPS.length - 1);
    const i0 = Math.min(PALETTE_STOPS.length - 2, Math.floor(seg)),
      k = seg - i0;
    this.tmpC.copy(PALETTE_STOPS[i0].glow).lerp(PALETTE_STOPS[i0 + 1].glow, k);
    this.skyMat.uniforms.uGlow.value.copy(this.tmpC);
    this.tmpTint.copy(PALETTE_STOPS[i0].tint).lerp(PALETTE_STOPS[i0 + 1].tint, k);

    // audio-reactive pulse + click energy
    const lvl = this.opts.getAudioLevel?.() ?? 0;
    this.pulse = damp(this.pulse, 0, 2.2, dt);
    const pulse = Math.min(1.5, this.pulse + lvl * 1.6);

    // cursor trail of embers
    this.mouseMoved *= Math.exp(-6 * dt);
    if (this.mouseMoved > 0.25 && this.push > 0.3 && this.intro > 0.6) {
      const n = Math.min(3, Math.floor(this.mouseMoved));
      for (let q = 0; q <= n; q++) this.spawnTrail(this.mouseS.x + (this.mouse.x - this.mouseS.x) * (q / (n + 1)), this.mouseS.y + (this.mouse.y - this.mouseS.y) * (q / (n + 1)), 0.6);
    }
    for (let q = 0; q < TRAIL_N; q++) {
      if (this.trailLife[q] <= 0) continue;
      this.trailLife[q] = Math.max(0, this.trailLife[q] - dt * 0.75);
      const j = q * 3;
      this.trailVel[j + 1] += dt * 0.25;
      for (let a = 0; a < 3; a++) {
        this.trailPos[j + a] += this.trailVel[j + a] * dt;
        this.trailVel[j + a] *= Math.exp(-1.4 * dt);
      }
    }
    this.trailGeo.attributes.position.needsUpdate = true;
    this.trailGeo.attributes.aLife.needsUpdate = true;

    // shooting stars
    if (this.shootT < 0 && t > this.shootNext && this.intro > 0.9) {
      this.shootT = 0;
      this.shootA = -0.35 - rnd() * 0.5;
      this.shootFrom.set(-200 + rnd() * 400, 150 + rnd() * 110);
      this.shoot.visible = true;
    }
    if (this.shootT >= 0) {
      this.shootT += dt;
      const life = this.shootT / 1.1;
      const dir = new THREE.Vector2(Math.cos(this.shootA), Math.sin(this.shootA));
      this.tmpV.set(this.shootFrom.x + dir.x * life * 260, this.shootFrom.y + dir.y * life * 260, -520).applyQuaternion(this.camera.quaternion);
      this.shoot.position.copy(this.camera.position).add(this.tmpV);
      this.shoot.quaternion.copy(this.camera.quaternion);
      this.shoot.rotateZ(this.shootA);
      this.shootMat.uniforms.uAlpha.value = Math.sin(Math.min(1, life) * Math.PI);
      if (life >= 1) {
        this.shootT = -1;
        this.shoot.visible = false;
        this.shootNext = t + 4 + rnd() * 7;
      }
    }

    // rays & moon follow the camera
    this.rayGroup.position.copy(this.camera.position);
    this.rayGroup.rotation.y = Math.atan2(-(ahead.x - p.x), -(ahead.z - p.z)) + Math.PI;
    this.rayGroup.rotation.y = 0;
    this.rayGroup.position.z = this.camera.position.z;
    this.moon.position.set(this.camera.position.x + 330, 250, this.camera.position.z - 680);

    this.push = damp(this.push, this.pushTarget, 5, dt);

    const u = this.flowerMat.uniforms;
    u.uTime.value = t;
    u.uIntro.value = ie;
    u.uDisperse.value = this.disperse;
    u.uMouse.value.copy(this.mouse);
    u.uPush.value = this.push;
    u.uPulse.value = pulse;
    u.uTint.value.copy(this.tmpTint);
    this.final.uniforms.uWave.value.set(this.lastWave.x, this.lastWave.y, t - this.lastWave.z, this.lastWave.w);
    this.dustMat.uniforms.uTime.value = t;
    this.dustMat.uniforms.uIntro.value = ie;
    this.dustMat.uniforms.uCam.value.copy(this.camera.position);
    this.starMat.uniforms.uTime.value = t;
    this.skyMat.uniforms.uTime.value = t;
    for (const r of this.rays) r.uniforms.uTime.value = t;

    this.bloom.strength = 0.65 + this.disperse * 0.5 + this.speed * 0.2 + pulse * 0.25;
    const f = this.final.uniforms;
    f.uTime.value = t;
    f.uVig.value = clamp(this.speed + this.disperse * 0.35);
    f.uSplit.value = 0.0016 + this.speed * 0.006 + this.disperse * 0.002;

    this.composer.render(dt);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('pointerleave', this.onLeave);
    this.clickTarget.removeEventListener('pointerdown', this.onDown);
    this.scene.traverse((o: any) => {
      o.geometry?.dispose?.();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: any) => m.dispose());
    });
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/* ---------- Ambient audio (procedural, WebAudio) ---------- */
export class AmbientAudio {
  private ctx?: AudioContext;
  private master?: GainNode;
  private filter?: BiquadFilterNode;
  private chimeTimer = 0;
  private analyser?: AnalyserNode;
  private buf?: Uint8Array;
  private lvl = 0;
  muted = true;

  /** smoothed loudness 0..1 (0 while muted) */
  level() {
    if (!this.analyser || !this.buf || this.muted) return (this.lvl *= 0.9);
    this.analyser.getByteTimeDomainData(this.buf as Uint8Array<ArrayBuffer>);
    let s = 0;
    for (let i = 0; i < this.buf.length; i++) {
      const v = (this.buf[i] - 128) / 128;
      s += v * v;
    }
    const rms = Math.sqrt(s / this.buf.length);
    const target = Math.min(1, Math.max(0, (rms - 0.04) * 9));
    this.lvl += (target - this.lvl) * (target > this.lvl ? 0.5 : 0.08);
    return this.lvl;
  }

  private init() {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = (this.ctx = new AC());
    const master = (this.master = ctx.createGain());
    master.gain.value = 0;
    const filter = (this.filter = ctx.createBiquadFilter());
    filter.type = 'lowpass';
    filter.frequency.value = 16000;
    filter.Q.value = 0.7;
    filter.connect(master);
    master.connect(ctx.destination);
    const an = (this.analyser = ctx.createAnalyser());
    an.fftSize = 512;
    this.buf = new Uint8Array(an.fftSize);
    master.connect(an);

    // echo bus
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    delay.connect(fb).connect(delay);
    delay.connect(wet).connect(filter);
    this.echo = delay;

    // pad — dreamy Amaj9 voicing
    const notes = [55, 110, 164.81, 246.94, 277.18, 415.3];
    notes.forEach((f, i) => {
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.05 : 0.028;
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.04 + i * 0.017;
      lfoG.gain.value = g.gain.value * 0.8;
      lfo.connect(lfoG).connect(g.gain);
      lfo.start();
      [-4, 4].forEach((det, k) => {
        const o = ctx.createOscillator();
        o.type = k ? 'triangle' : 'sine';
        o.frequency.value = f;
        o.detune.value = det;
        o.connect(g);
        o.start();
      });
      g.connect(filter);
    });

    // wind
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 500;
    bp.Q.value = 0.5;
    const wl = ctx.createOscillator();
    const wlG = ctx.createGain();
    wl.frequency.value = 0.07;
    wlG.gain.value = 260;
    wl.connect(wlG).connect(bp.frequency);
    wl.start();
    const ng = ctx.createGain();
    ng.gain.value = 0.035;
    noise.connect(bp).connect(ng).connect(filter);
    noise.start();

    this.scheduleChime();
  }
  private echo?: DelayNode;

  private scheduleChime = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const scale = [880, 987.77, 1108.73, 1318.51, 1479.98, 1760];
    const f = scale[(Math.random() * scale.length) | 0];
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.03, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
    o.connect(g);
    g.connect(this.filter!);
    g.connect(this.echo!);
    o.start(now);
    o.stop(now + 2.8);
    this.chimeTimer = window.setTimeout(this.scheduleChime, 2500 + Math.random() * 4500);
  };

  /** returns new muted state */
  toggle() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    if (ctx.state === 'suspended') ctx.resume();
    this.muted = !this.muted;
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(this.muted ? 0 : 0.9, ctx.currentTime + 1.4);
    return this.muted;
  }
  muffle(on: boolean) {
    if (!this.ctx || !this.filter) return;
    const f = this.filter.frequency;
    f.cancelScheduledValues(this.ctx.currentTime);
    f.setValueAtTime(f.value, this.ctx.currentTime);
    f.exponentialRampToValueAtTime(on ? 520 : 16000, this.ctx.currentTime + 1.2);
  }
  dispose() {
    clearTimeout(this.chimeTimer);
    this.ctx?.close();
    this.ctx = undefined;
  }
}
