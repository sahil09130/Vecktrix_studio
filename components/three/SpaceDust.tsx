"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, type RefObject } from "react";

/**
 * Deep-space dust behind and around the service tiles.
 *
 * Points are spread through depth along the whole services stage. Because the
 * camera follows the scroll, near dust slides past faster than far dust, which
 * gives the fly-in a sense of travel. Each mote drifts and twinkles in the
 * shader; a few are accent-coloured. One draw call, no per-frame CPU work
 * beyond two uniforms and the pointer offset.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPx;
  attribute float aSize;
  attribute float aPhase;
  attribute float aAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.12 + aPhase * 6.2831) * 0.35;
    p.y += cos(uTime * 0.09 + aPhase * 4.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    gl_PointSize = min(aSize * uPx * (14.0 / dist), 7.0 * uPx);
    float twinkle = 0.6 + 0.4 * sin(uTime * (0.7 + aPhase * 1.6) + aPhase * 20.0);
    float near = smoothstep(55.0, 12.0, dist);
    vAlpha = twinkle * mix(0.3, 1.0, near);
    vAccent = aAccent;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 cream = vec3(0.949, 0.937, 0.914);
    vec3 accent = vec3(1.0, 0.302, 0.180);
    gl_FragColor = vec4(mix(cream, accent, vAccent), a * vAlpha * uOpacity);
  }
`;

/** Small seeded PRNG so the field is stable across renders. */
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function SpaceDust({
  stageHeight,
  fov,
  mobile,
  pointer,
}: {
  /** Stage height in px (world units = px / 100). */
  stageHeight: number;
  fov: number;
  mobile: boolean;
  pointer: RefObject<{ x: number; y: number }>;
}) {
  const { size, viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(7);
    const tan = Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const camZ = size.height / 100 / 2 / tan;
    const aspect = size.width / Math.max(1, size.height);
    const margin = size.height / 100;
    const top = margin;
    const bottom = -stageHeight / 100 - margin;
    const span = top - bottom;
    const count = Math.round(span * (mobile ? 6 : 14));

    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phase = new Float32Array(count);
    const acc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Bias towards the back so the field reads as deep, with a few close motes.
      const z = -36 + Math.pow(rand(), 0.7) * 42; // -36 .. 6
      const halfW = (camZ - z) * tan * aspect * 1.15;
      pos[i * 3] = (rand() * 2 - 1) * halfW;
      pos[i * 3 + 1] = bottom + rand() * span;
      pos[i * 3 + 2] = z;
      const bright = rand() < 0.1;
      sizes[i] = bright ? 3.8 + rand() * 2.2 : 1.2 + rand() * 1.8;
      phase[i] = rand();
      acc[i] = rand() < 0.07 ? 1 : 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aAccent", new THREE.BufferAttribute(acc, 1));
    return g;
  }, [stageHeight, fov, mobile, size.width, size.height]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPx: { value: 1 },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useFrame((state, dt) => {
    const m = mat.current;
    if (m) {
      m.uniforms.uTime.value = state.clock.elapsedTime;
      m.uniforms.uPx.value = viewport.dpr;
    }
    const g = group.current;
    if (g && !mobile) {
      const d = Math.min(dt, 0.05);
      g.position.x = THREE.MathUtils.damp(g.position.x, pointer.current.x * 0.6, 1.8, d);
      g.position.y = THREE.MathUtils.damp(g.position.y, pointer.current.y * 0.3, 1.8, d);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false} raycast={() => null}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
