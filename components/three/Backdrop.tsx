"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { Layout } from "@/lib/tiles-layout";

/**
 * Deep-space backdrop behind the homepage service tiles: drifting ember nebula,
 * a few distant planets, and occasional comets. Everything sits far behind the
 * tiles and is kept low-contrast so the tiles stay the focus.
 *
 * Tune the intensity of each layer here (0 switches it off).
 */
export const BACKDROP = {
  nebula: 0.42,
  planets: 0.85,
  comets: 0.7,
};

const FOV = 30;
const ACCENT = new THREE.Color("#ff4d2e");
const WARM = new THREE.Color("#2a1d1a");
const SLATE = new THREE.Color("#141821");

/** Small seeded generator so the layout is stable between renders. */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const cloudVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  uniform vec3 uA;
  uniform vec3 uB;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float fall = smoothstep(1.0, 0.15, length(p));
    vec2 q = vUv * 2.6 + vec2(uSeed, uSeed * 0.7) + vec2(uTime * 0.015, -uTime * 0.008);
    float n = fbm(q);
    float cloud = smoothstep(0.3, 0.85, n) * fall;
    vec3 col = mix(uB, uA, smoothstep(0.4, 0.8, n));
    gl_FragColor = vec4(col, cloud * uOpacity * 1.8);
  }
`;

const planetVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const planetFragment = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uBase;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    float band = 0.5 + 0.5 * sin(vNormal.y * 18.0);
    vec3 col = uBase * (0.85 + 0.15 * band) + uRim * rim * 0.5;
    gl_FragColor = vec4(col, uOpacity);
  }
`;

interface Cloud {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  seed: number;
}

interface Planet {
  x: number;
  y: number;
  z: number;
  r: number;
  ring: boolean;
  seed: number;
}

interface Comet {
  next: number;
  start: number;
  dur: number;
  from: [number, number];
  to: [number, number];
  active: boolean;
}

export function Backdrop({ layout, mobile }: { layout: Layout; mobile: boolean }) {

  const cloudGroups = useRef<THREE.Group[]>([]);
  const planetGroups = useRef<THREE.Group[]>([]);
  const moons = useRef<THREE.Mesh[]>([]);
  const comets = useRef<THREE.Mesh[]>([]);
  const cometState = useRef<Comet[]>([]);
  const rng = useMemo(() => lcg(42), []);

  // Each chapter's centre height (scene units) and which side its big tile is on.
  const chapters = useMemo(
    () =>
      layout.chapters.map((ch, ci) => ({
        y: -(ch.tilesTop + ch.tilesH / 2) / 100,
        // Matches computeLayout: odd chapters are mirrored.
        side: mobile ? 0 : ci % 2 === 1 ? 1 : -1,
      })),
    [layout, mobile],
  );

  const clouds = useMemo<Cloud[]>(() => {
    const out: Cloud[] = [];
    chapters.forEach((c, i) => {
      // Clouds go on the empty side of the zig-zag, so they frame the tiles.
      out.push({ x: -c.side * 4.8, y: c.y + 1, z: -34, sx: 20, sy: 13, seed: i * 3.1 });
      if (!mobile) out.push({ x: c.side * 2.6, y: c.y - 4.5, z: -40, sx: 16, sy: 10, seed: i * 3.1 + 1.7 });
    });
    return out;
  }, [chapters, mobile]);

  const planets = useMemo<Planet[]>(() => {
    const out: Planet[] = [];
    chapters.forEach((c, i) => {
      // Desktop: a planet in every other chapter. Mobile: just one.
      if (mobile ? i !== 1 : i % 2 !== 0) return;
      out.push({
        x: -c.side * 7.2,
        y: c.y - 1.2,
        z: -44,
        r: mobile ? 2.2 : 3.4,
        ring: i % 4 === 1,
        seed: i,
      });
    });
    return out;
  }, [chapters, mobile]);

  const cloudMaterials = useMemo(
    () =>
      clouds.map(
        (c) =>
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uSeed: { value: c.seed },
              uOpacity: { value: 0 },
              uA: { value: ACCENT.clone().lerp(WARM, 0.6) },
              uB: { value: SLATE.clone() },
            },
            vertexShader: cloudVertex,
            fragmentShader: cloudFragment,
            transparent: true,
            depthWrite: false,
          }),
      ),
    [clouds],
  );

  const planetMaterials = useMemo(
    () =>
      planets.map(
        () =>
          new THREE.ShaderMaterial({
            uniforms: {
              uRim: { value: ACCENT.clone() },
              uBase: { value: new THREE.Color("#0b0c12") },
              uOpacity: { value: 0 },
            },
            vertexShader: planetVertex,
            fragmentShader: planetFragment,
            transparent: true,
            depthWrite: false,
          }),
      ),
    [planets],
  );

  const cometTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 4;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, "rgba(242,239,233,0)");
    g.addColorStop(0.7, "rgba(242,239,233,0.35)");
    g.addColorStop(1, "rgba(255,190,170,0.95)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 4);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camY = state.camera.position.y;
    const camZ = state.camera.position.z;
    const halfH = (camZ + 20) * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const halfW = halfH * (state.size.width / Math.max(1, state.size.height));

    // Clouds: slow drift, only when their chapter is near the camera.
    cloudMaterials.forEach((m, i) => {
      m.uniforms.uTime.value = t;
      m.uniforms.uOpacity.value = BACKDROP.nebula;
      const g = cloudGroups.current[i];
      if (g) g.visible = Math.abs(camY - clouds[i].y) < 9;
    });

    // Planets: slow spin, moon on a small orbit, culled like the clouds.
    planetMaterials.forEach((m, i) => {
      m.uniforms.uOpacity.value = BACKDROP.planets;
      const g = planetGroups.current[i];
      if (!g) return;
      g.visible = Math.abs(camY - planets[i].y) < 9;
      g.rotation.y = t * 0.04 + i;
      const moon = moons.current[i];
      if (moon) {
        const a = t * 0.35 + i * 2;
        moon.position.set(Math.cos(a) * planets[i].r * 1.9, Math.sin(a) * planets[i].r * 0.45, 0);
      }
    });

    // Comets: a pool of two, each crossing the screen behind the tiles now and then.
    if (cometState.current.length === 0) {
      cometState.current = [0, 1].map((k) => ({
        next: 3 + k * 4 + rng() * 4,
        start: 0,
        dur: 1.8,
        from: [0, 0],
        to: [0, 0],
        active: false,
      }));
    }
    cometState.current.forEach((c, k) => {
      const mesh = comets.current[k];
      if (!mesh) return;
      if (!c.active && t >= c.next) {
        const ch = chapters[Math.floor(rng() * chapters.length)];
        const y = ch.y + (rng() - 0.5) * 3;
        const dir = rng() < 0.5 ? -1 : 1;
        c.from = [-dir * halfW * 1.1, y];
        c.to = [dir * halfW * 1.1, y - (rng() - 0.5) * 1.6];
        c.start = t;
        c.dur = 1.6 + rng() * 0.8;
        c.active = true;
      }
      if (c.active) {
        const p = (t - c.start) / c.dur;
        if (p >= 1) {
          c.active = false;
          c.next = t + 6 + rng() * 6;
          mesh.visible = false;
          return;
        }
        const e = p * p * (3 - 2 * p);
        mesh.visible = true;
        mesh.position.set(
          c.from[0] + (c.to[0] - c.from[0]) * e,
          c.from[1] + (c.to[1] - c.from[1]) * e,
          -22,
        );
        mesh.rotation.z = Math.atan2(c.to[1] - c.from[1], c.to[0] - c.from[0]);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(p * Math.PI) * BACKDROP.comets;
      }
    });
  });

  return (
    <group>
      {clouds.map((c, i) => (
        <group
          key={`cloud-${i}`}
          ref={(g) => {
            if (g) cloudGroups.current[i] = g;
          }}
          position={[c.x, c.y, c.z]}
        >
          <mesh scale={[c.sx, c.sy, 1]} raycast={() => null}>
            <planeGeometry args={[1, 1]} />
            <primitive object={cloudMaterials[i]} attach="material" />
          </mesh>
        </group>
      ))}

      {planets.map((p, i) => (
        <group
          key={`planet-${i}`}
          ref={(g) => {
            if (g) planetGroups.current[i] = g;
          }}
          position={[p.x, p.y, p.z]}
        >
          <mesh raycast={() => null}>
            <sphereGeometry args={[p.r, 48, 32]} />
            <primitive object={planetMaterials[i]} attach="material" />
          </mesh>
          {p.ring && (
            <mesh rotation={[1.2, 0, 0.25]} raycast={() => null}>
              <ringGeometry args={[p.r * 1.35, p.r * 1.9, 96]} />
              <meshBasicMaterial color="#f2efe9" transparent opacity={0.12 * BACKDROP.planets} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          )}
          <mesh
            ref={(m) => {
              if (m) moons.current[i] = m;
            }}
            raycast={() => null}
          >
            <sphereGeometry args={[0.09, 12, 8]} />
            <meshBasicMaterial color="#ff4d2e" transparent opacity={0.9 * BACKDROP.planets} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {[0, 1].map((k) => (
        <mesh
          key={`comet-${k}`}
          ref={(m) => {
            if (m) comets.current[k] = m;
          }}
          visible={false}
          raycast={() => null}
        >
          <planeGeometry args={[2.6, 0.04]} />
          <meshBasicMaterial map={cometTexture} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
