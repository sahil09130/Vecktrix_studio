"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { MotifId } from "@/components/motion/ids";
import type { Layout, Slot } from "@/lib/tiles-layout";
import {
  getHaloTexture,
  loadFonts,
  makeFaceTexture,
  SLAB_RADIUS,
  type Fonts,
} from "./faceTexture";
import { drawArt, getMotif } from "@/components/motion";
import { SpaceDust } from "./SpaceDust";
import { Backdrop } from "./Backdrop";
import { isSoundOn, playArrive, playClick, playHover, playHoverEnd, playLeave } from "@/lib/sound";

const FOV = 30;
const DEPTH = 0.36;
/** Illustrations redraw at most this often (seconds). */
const ART_STEP = 1 / 30;
const damp = THREE.MathUtils.damp;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface View {
  top: number; // stage top relative to the viewport (px)
  vh: number;
}
interface Pointer {
  x: number;
  y: number;
}

/** One 3D tile: a featured service, or a chapter's "View all" tile. */
export interface TileItem {
  key: string;
  title: string;
  description: string;
  /** Small mono label top-left, e.g. "03.07". */
  label: string;
  /** Pill top-right, e.g. "KRITCUTS". */
  badge: string | null;
  motif: MotifId | null;
  cta: boolean;
}

export interface ServiceSceneProps {
  tiles: TileItem[];
  layout: Layout;
  focusedKey: string | null;
  onOpen: (t: TileItem) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  /** Called once if the scene is too slow on this device (switches to the lite layout). */
  onSlow?: () => void;
}

/**
 * Viewport-sized canvas that stays sticky while the stage scrolls past.
 * The camera follows the scroll, so tiles laid out down the whole stage move
 * with the page exactly as if the canvas were as tall as the stage.
 */
export default function ServiceScene(props: ServiceSceneProps) {
  const { layout, containerRef } = props;
  const mobile = layout.mobile;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "150px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef]);

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: FOV, near: 1, far: 400, position: [0, 0, 40] }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}

function Scene({ tiles, layout, focusedKey, onOpen, containerRef, onSlow }: ServiceSceneProps) {
  const { size, gl } = useThree();
  const mobile = layout.mobile;
  const [fonts, setFonts] = useState<Fonts | null>(null);
  const view = useRef<View>({ top: 0, vh: 800 });
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  // Frame-rate check over the first few seconds. Below ~28 fps, hand over to the lite layout.
  const fps = useRef({ frames: 0, time: 0, done: false });
  useFrame((_state, dt) => {
    const f = fps.current;
    if (f.done) return;
    f.frames += 1;
    f.time += Math.min(dt, 0.25);
    if (f.time >= 3) {
      f.done = true;
      if (f.frames / f.time < 28) onSlow?.();
    }
  });

  useEffect(() => {
    let alive = true;
    loadFonts().then((f) => alive && setFonts(f));
    return () => {
      alive = false;
    };
  }, []);

  // Each frame: read where the stage and the sticky canvas are, then put the
  // camera over the slice of the stage the canvas currently covers.
  useFrame((state) => {
    const stage = containerRef.current;
    if (!stage) return;
    const stageTop = stage.getBoundingClientRect().top;
    const canvasTop = gl.domElement.getBoundingClientRect().top;
    view.current.top = stageTop;
    view.current.vh = window.innerHeight;

    const cam = state.camera as THREE.PerspectiveCamera;
    const z = size.height / 100 / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const y = -(canvasTop - stageTop + size.height / 2) / 100;
    if (cam.fov !== FOV) {
      cam.fov = FOV;
      cam.updateProjectionMatrix();
    }
    cam.position.set(0, y, z);
  });

  useEffect(() => {
    if (mobile) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mobile]);

  const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 8, 10]} intensity={2.4} />
      <directionalLight position={[-8, -3, 5]} intensity={1.1} color="#ff4d2e" />
      <Backdrop layout={layout} mobile={mobile} />
      <SpaceDust stageHeight={layout.total} fov={FOV} mobile={mobile} pointer={pointer} />
      {fonts &&
        tiles.map((item, i) =>
          layout.slots[item.key] ? (
            <Slab
              key={item.key}
              item={item}
              seed={i}
              slot={layout.slots[item.key]}
              view={view}
              pointer={pointer}
              mobile={mobile}
              active={focusedKey === item.key}
              onOpen={onOpen}
              fonts={fonts}
              anisotropy={anisotropy}
            />
          ) : null,
        )}
    </>
  );
}

interface SlabProps {
  item: TileItem;
  seed: number;
  slot: Slot;
  view: RefObject<View>;
  pointer: RefObject<Pointer>;
  mobile: boolean;
  active: boolean;
  onOpen: (t: TileItem) => void;
  fonts: Fonts;
  anisotropy: number;
}

function Slab({
  item,
  seed,
  slot,
  view,
  pointer,
  mobile,
  active,
  onOpen,
  fonts,
  anisotropy,
}: SlabProps) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.MeshStandardMaterial>(null);
  const rim = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const artMat = useRef<THREE.MeshBasicMaterial>(null);
  const hover = useRef(false);
  const tilt = useRef({ x: 0, y: 0 });
  const cur = useRef({
    p: 0,
    glow: 0,
    tx: 0,
    ty: 0,
    px: 0,
    py: 0,
    at: 0,
    since: 0,
    drawn: false,
    // Sound presence: true while the tile is in view (see the arrive/leave logic below).
    present: false,
    primed: false,
    prevTop: NaN,
  });
  const phase = seed * 1.7 + 0.5;
  const dir = slot.x < 0 ? -1 : 1;
  const { w, h } = slot;

  const { texture: face, art } = useMemo(
    () =>
      makeFaceTexture({
        item,
        w,
        h,
        fonts,
        pxPerUnit: mobile ? 180 : 220,
        anisotropy,
      }),
    [item, w, h, fonts, mobile, anisotropy],
  );
  useEffect(() => () => face.dispose(), [face]);

  // Animated illustration: its own small canvas texture on top of the face.
  const artW = art.w * w;
  const artH = art.h * h;
  const artLayer = useMemo(() => {
    const ppu = mobile ? 130 : 160;
    const f = Math.min(1, 512 / (artW * ppu), 384 / (artH * ppu));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(artW * ppu * f));
    canvas.height = Math.max(1, Math.round(artH * ppu * f));
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    return { canvas, ctx: canvas.getContext("2d"), tex };
  }, [artW, artH, mobile, anisotropy]);
  useEffect(() => () => artLayer.tex.dispose(), [artLayer]);
  const drawFn = useMemo(() => getMotif(item.motif ?? undefined), [item.motif]);
  const showArt = !!item.motif && artH > 0.35;
  const haloTex = useMemo(() => getHaloTexture(), []);

  useEffect(
    () => () => {
      if (hover.current) document.body.style.cursor = "";
    },
    [],
  );

  useFrame((state, rawDt) => {
    const g = group.current;
    if (!g) return;
    const { top, vh } = view.current;

    // Tile centre relative to the viewport top (px).
    const pageY = top - slot.y * 100;

    // Skip tiles well outside the viewport.
    if (pageY < -vh * 0.8 || pageY > vh * 1.8) {
      g.visible = false;
      // Off-screen tiles already left (or have not arrived); reset without sound.
      cur.current.present = false;
      return;
    }
    g.visible = true;

    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const c = cur.current;
    const amp = mobile ? 0.5 : 1;

    // Scroll progress: 0 when the tile is at the bottom edge, 1 once it is
    // roughly mid-screen. Drives the fly-in from depth.
    const target = clamp01((vh - pageY) / (vh * 0.55));
    // First frame: snap to the current state so tiles already on screen at
    // load don't all play their arrive sound at once.
    if (!c.primed) {
      c.primed = true;
      c.p = target;
    } else {
      c.p = damp(c.p, target, 3.5, dt);
    }
    const e = 1 - Math.pow(1 - c.p, 3);

    // Arrive / leave sounds. Present = flown in and not yet scrolled past the top.
    const offTop = pageY < -slot.h * 50;
    const speed = Number.isFinite(c.prevTop) && dt > 0 ? clamp01(Math.abs(top - c.prevTop) / dt / 2500) : 0;
    c.prevTop = top;
    const wasPresent = c.present;
    if (!c.present && c.p >= 0.6 && !offTop) c.present = true;
    else if (c.present && (c.p <= 0.3 || offTop)) c.present = false;
    if (c.present !== wasPresent && c.primed && isSoundOn()) {
      const shape = {
        pan: Math.max(-1, Math.min(1, slot.x / 3)),
        size: clamp01((slot.w - 2.2) / 1.5),
        speed,
      };
      if (c.present) playArrive(shape);
      else playLeave(shape);
    }

    const lit = active || hover.current;
    c.glow = damp(c.glow, lit ? 1 : 0, 7, dt);
    c.tx = damp(c.tx, hover.current ? tilt.current.x : 0, 8, dt);
    c.ty = damp(c.ty, hover.current ? tilt.current.y : 0, 8, dt);
    c.px = damp(c.px, mobile ? 0 : pointer.current.x, 2.5, dt);
    c.py = damp(c.py, mobile ? 0 : pointer.current.y, 2.5, dt);

    const depthFactor = 0.7 + (slot.z + 0.5) * 0.5;
    g.position.set(
      slot.x + (1 - e) * dir * 3 + c.px * 0.4 * depthFactor + Math.cos(t * 0.35 + phase) * 0.08 * amp,
      slot.y + Math.sin(t * 0.5 + phase) * 0.12 * amp + c.py * 0.2 * depthFactor,
      slot.z - (1 - e) * 18 + c.glow * 0.5,
    );
    g.rotation.set(
      (1 - e) * 0.9 + Math.sin(t * 0.37 + phase) * 0.05 * amp - c.py * 0.07 + c.tx,
      (1 - e) * dir * 1.4 + Math.cos(t * 0.3 + phase) * 0.09 * amp + c.px * 0.1 + c.ty,
      Math.sin(t * 0.4 + phase) * 0.035 * amp + (1 - e) * dir * 0.4,
    );
    g.scale.setScalar(0.35 + 0.65 * e + c.glow * 0.04);

    // Illustration, throttled; it speeds up a little while the tile is lit.
    c.at += dt * (1 + 0.6 * c.glow);
    c.since += rawDt;
    if (showArt && artLayer.ctx && (c.since >= ART_STEP || !c.drawn)) {
      drawArt(artLayer.ctx, artLayer.canvas.width, artLayer.canvas.height, drawFn, c.at + seed * 0.37, c.glow);
      if (artMat.current?.map) artMat.current.map.needsUpdate = true;
      c.since = 0;
      c.drawn = true;
    }

    if (body.current) body.current.emissiveIntensity = c.glow * 0.5;
    if (rim.current) rim.current.opacity = Math.max(c.glow * 0.95, item.cta ? 0.4 : 0);
    if (halo.current) halo.current.opacity = c.glow * 0.55;
  });

  const setTiltFrom = (ev: ThreeEvent<PointerEvent>) => {
    const g = group.current;
    if (!g) return;
    const local = g.worldToLocal(ev.point.clone());
    tilt.current.x = THREE.MathUtils.clamp(local.y / (h / 2), -1, 1) * 0.3;
    tilt.current.y = -THREE.MathUtils.clamp(local.x / (w / 2), -1, 1) * 0.3;
  };

  return (
    <group
      ref={group}
      onPointerOver={(ev) => {
        ev.stopPropagation();
        hover.current = true;
        document.body.style.cursor = "pointer";
        setTiltFrom(ev);
        // Hover tick: desktop mouse only, and only once the tile has flown in.
        if (!mobile && ev.nativeEvent.pointerType === "mouse" && cur.current.p > 0.85 && isSoundOn()) {
          playHover({ pan: Math.max(-1, Math.min(1, slot.x / 3)), pitch: (seed * 0.618) % 1 });
        }
      }}
      onPointerMove={(ev) => {
        ev.stopPropagation();
        setTiltFrom(ev);
      }}
      onPointerOut={(ev) => {
        const wasHovered = hover.current;
        hover.current = false;
        document.body.style.cursor = "";
        if (wasHovered && !mobile && ev.nativeEvent.pointerType === "mouse" && cur.current.p > 0.85 && isSoundOn()) {
          playHoverEnd({ pan: Math.max(-1, Math.min(1, slot.x / 3)), pitch: (seed * 0.618) % 1 });
        }
      }}
      onClick={(ev) => {
        ev.stopPropagation();
        // Click confirmation for any input, just before the page opens.
        if (isSoundOn()) playClick({ pan: Math.max(-1, Math.min(1, slot.x / 3)) });
        onOpen(item);
      }}
    >
      <RoundedBox args={[w, h, DEPTH]} radius={SLAB_RADIUS} smoothness={4}>
        <meshStandardMaterial
          ref={body}
          color="#10121a"
          metalness={0.55}
          roughness={0.4}
          emissive="#ff4d2e"
          emissiveIntensity={0}
        />
      </RoundedBox>
      <RoundedBox
        args={[w + 0.08, h + 0.08, DEPTH * 0.8]}
        radius={SLAB_RADIUS + 0.04}
        smoothness={4}
        position={[0, 0, -0.03]}
        raycast={() => null}
      >
        <meshBasicMaterial ref={rim} color="#ff4d2e" transparent opacity={0} toneMapped={false} />
      </RoundedBox>
      <mesh position={[0, 0, DEPTH / 2 + 0.004]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={face} transparent toneMapped={false} />
      </mesh>
      {showArt && (
        <mesh
          position={[-w / 2 + (art.x + art.w / 2) * w, h / 2 - (art.y + art.h / 2) * h, DEPTH / 2 + 0.006]}
          raycast={() => null}
          renderOrder={2}
        >
          <planeGeometry args={[artW, artH]} />
          <meshBasicMaterial ref={artMat} map={artLayer.tex} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, 0, -0.4]} raycast={() => null}>
        <planeGeometry args={[w * 2, h * 2]} />
        <meshBasicMaterial
          ref={halo}
          map={haloTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
