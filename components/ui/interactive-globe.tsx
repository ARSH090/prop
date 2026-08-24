"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { getCleanLogoUrl } from "@/lib/utils/logo-url";

export interface GlobeMarker {
  id?: string;
  lat: number;
  lng: number;
  name: string;
  sublabel?: string;
  logoUrl?: string;
  firmImageUrl?: string;
  affiliateUrl?: string;
  color?: string;
  badgeBg?: string;
  isActive?: boolean;
}

export interface GlobeConnection {
  from: [number, number];
  to: [number, number];
  color?: string;
}

export interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  connections?: GlobeConnection[];
  markers?: GlobeMarker[];
  globeFirms?: any[];
}

// Global Prop Firm Headquarters & Major Trading Centers evenly distributed across 360° sphere
export const DEFAULT_GLOBE_MARKERS: GlobeMarker[] = [
  {
    id: "slot-empirial",
    lat: 28.6139,
    lng: 77.209,
    name: "EMPIRIAL",
    sublabel: "HQ / Trader Hub",
    logoUrl: "/logo.png",
    affiliateUrl: "/about",
    color: "#22D3EE",
    badgeBg: "#12131A",
  },
  {
    id: "slot-ftmo",
    lat: 50.0755,
    lng: 14.4378,
    name: "FTMO",
    sublabel: "Prague, CZ",
    logoUrl: getCleanLogoUrl("FTMO", null),
    affiliateUrl: "https://ftmo.com?ref=empirial",
    color: "#FF4E00",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-topstep",
    lat: 41.8781,
    lng: -87.6298,
    name: "Topstep",
    sublabel: "Chicago, US",
    logoUrl: getCleanLogoUrl("Topstep", null),
    affiliateUrl: "https://topstep.com?ref=empirial",
    color: "#FFD700",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-pips",
    lat: 25.2048,
    lng: 55.2708,
    name: "Funding Pips",
    sublabel: "Dubai, UAE",
    logoUrl: getCleanLogoUrl("Funding Pips", null),
    affiliateUrl: "https://fundingpips.com?ref=empirial",
    color: "#8A2BE2",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-alpha",
    lat: 51.5074,
    lng: -0.1278,
    name: "Alpha Capital",
    sublabel: "London, UK",
    logoUrl: getCleanLogoUrl("Alpha Capital", null),
    affiliateUrl: "https://alphacapitalgroup.uk?ref=empirial",
    color: "#3B82F6",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-e8",
    lat: 32.7767,
    lng: -96.797,
    name: "E8 Markets",
    sublabel: "Dallas, US",
    logoUrl: getCleanLogoUrl("E8", null),
    affiliateUrl: "https://e8markets.com?ref=empirial",
    color: "#00FF66",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-mff",
    lat: 40.7128,
    lng: -74.006,
    name: "MyFundedFutures",
    sublabel: "New York, US",
    logoUrl: getCleanLogoUrl("MyFundedFutures", null),
    affiliateUrl: "https://myfundedfutures.com?ref=empirial",
    color: "#FF007F",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-5ers",
    lat: 1.3521,
    lng: 103.8198,
    name: "The 5%ers",
    sublabel: "Singapore",
    logoUrl: getCleanLogoUrl("The 5%ers", null),
    affiliateUrl: "https://the5ers.com?ref=empirial",
    color: "#F59E0B",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-fundednext",
    lat: 35.6762,
    lng: 139.6503,
    name: "FundedNext",
    sublabel: "Tokyo, JP",
    logoUrl: getCleanLogoUrl("FundedNext", null),
    affiliateUrl: "https://fundednext.com?ref=empirial",
    color: "#6366F1",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-gft",
    lat: 24.4539,
    lng: 54.3773,
    name: "GFT",
    sublabel: "Abu Dhabi, UAE",
    logoUrl: getCleanLogoUrl("Goat Funded", null),
    affiliateUrl: "https://goatfundedtrader.com?ref=empirial",
    color: "#00D2FF",
    badgeBg: "#181D2A",
  },
  {
    id: "slot-breakout",
    lat: -33.8688,
    lng: 151.2093,
    name: "Breakout",
    sublabel: "Sydney, AU",
    logoUrl: getCleanLogoUrl("Breakout", null),
    affiliateUrl: "https://breakoutprop.com?ref=empirial",
    color: "#EC4899",
    badgeBg: "#181D2A",
  },
];

export const DEFAULT_GLOBE_CONNECTIONS: GlobeConnection[] = [
  { from: [28.6139, 77.209], to: [50.0755, 14.4378] }, // Delhi -> Prague (FTMO)
  { from: [28.6139, 77.209], to: [25.2048, 55.2708] }, // Delhi -> Dubai (Funding Pips)
  { from: [28.6139, 77.209], to: [51.5074, -0.1278] }, // Delhi -> London (Alpha Capital)
  { from: [28.6139, 77.209], to: [1.3521, 103.8198] }, // Delhi -> Singapore (5%ers)
  { from: [50.0755, 14.4378], to: [41.8781, -87.6298] }, // Prague -> Chicago (Topstep)
  { from: [51.5074, -0.1278], to: [40.7128, -74.006] }, // London -> New York (MFF)
  { from: [40.7128, -74.006], to: [32.7767, -96.797] }, // New York -> Dallas (E8)
  { from: [25.2048, 55.2708], to: [1.3521, 103.8198] }, // Dubai -> Singapore
  { from: [1.3521, 103.8198], to: [35.6762, 139.6503] }, // Singapore -> Tokyo (FundedNext)
  { from: [35.6762, 139.6503], to: [-33.8688, 151.2093] }, // Tokyo -> Sydney (Breakout)
  { from: [25.2048, 55.2708], to: [50.0755, 14.4378] }, // Dubai -> Prague
];

function latLngToXYZ(
  lat: number,
  lng: number,
  radius: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  fov: number
): [number, number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

interface RenderedHitbox {
  x: number;
  y: number;
  width: number;
  height: number;
  marker: GlobeMarker;
}

export function InteractiveGlobe({
  className,
  size,
  dotColor = "rgba(34, 211, 238, ALPHA)", // EMPIRIAL Cyan
  arcColor = "rgba(34, 211, 238, 0.4)",
  markerColor = "rgba(34, 211, 238, 1)",
  autoRotateSpeed = 0.0018,
  connections = DEFAULT_GLOBE_CONNECTIONS,
  markers = DEFAULT_GLOBE_MARKERS,
  globeFirms,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation angles in radians (rotY is 360° unbounded, rotX clamped)
  const rotYRef = useRef(0.6);
  const rotXRef = useRef(0.25);

  // Drag physics & interaction state
  const isDraggingRef = useRef(false);
  const downPosRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });
  const lastPosRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPausedRef = useRef(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Preloaded logo images cache
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Visible markers bounding boxes for hit-testing on click/hover
  const visibleHitboxesRef = useRef<RenderedHitbox[]>([]);

  // Generate globe dots (Fibonacci sphere)
  const dotsRef = useRef<[number, number, number][]>([]);

  // Preload logo images on mount & marker changes
  useEffect(() => {
    markers.forEach((m) => {
      if (m.logoUrl && !imageCacheRef.current.has(m.logoUrl)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = m.logoUrl;
        img.onload = () => {
          imageCacheRef.current.set(m.logoUrl!, img);
        };
        img.onerror = () => {
          // Keep placeholder fallback
        };
      }
    });
  }, [markers]);

  useEffect(() => {
    const dots: [number, number, number][] = [];
    const numDots = 1350;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numDots; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numDots);
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      dots.push([x, y, z]);
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = canvas.clientWidth || 400;
    const h = canvas.clientHeight || 400;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const fov = 600;

    // Clear previous frame hitboxes
    visibleHitboxesRef.current = [];

    // Apply continuous rotation and inertia
    if (!isDraggingRef.current) {
      if (
        Math.abs(velocityRef.current.x) > 0.0001 ||
        Math.abs(velocityRef.current.y) > 0.0001
      ) {
        rotYRef.current += velocityRef.current.x;
        rotXRef.current = Math.max(
          -0.75,
          Math.min(0.75, rotXRef.current + velocityRef.current.y)
        );
        velocityRef.current.x *= 0.94; // friction decay
        velocityRef.current.y *= 0.94;
      } else if (!isPausedRef.current) {
        rotYRef.current += autoRotateSpeed;
      }
    }

    // Wrap rotY continuously for 360° infinite rotation
    rotYRef.current = rotYRef.current % (Math.PI * 2);

    timeRef.current += 0.015;
    const time = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    // 1. Outer atmospheric halo
    const glowGrad = ctx.createRadialGradient(
      cx,
      cy,
      radius * 0.7,
      cx,
      cy,
      radius * 1.5
    );
    glowGrad.addColorStop(0, "rgba(34, 211, 238, 0.07)");
    glowGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.03)");
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Globe subtle boundary sphere outline
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(34, 211, 238, 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. Orbital trajectory rings
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 1.22, radius * 0.48, -0.22, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(34, 211, 238, 0.09)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    const ry = rotYRef.current;
    const rx = rotXRef.current;

    // 4. Draw Fibonacci Sphere Dots
    const dots = dotsRef.current;
    for (let i = 0; i < dots.length; i++) {
      let [x, y, z] = dots[i];
      x *= radius;
      y *= radius;
      z *= radius;

      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      if (z > 0) continue; // Back-face culling

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.12, 1 - (z + radius) / (2 * radius));
      const dotSize = 1 + depthAlpha * 0.85;

      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace("ALPHA", depthAlpha.toFixed(2));
      ctx.fill();
    }

    // 5. Draw Great-Circle Trade Routes (Arcs)
    for (const conn of connections) {
      const [lat1, lng1] = conn.from;
      const [lat2, lng2] = conn.to;

      let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius);
      let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius);

      [x1, y1, z1] = rotateX(x1, y1, z1, rx);
      [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx);
      [x2, y2, z2] = rotateY(x2, y2, z2, ry);

      // Occlude back-facing connection arcs
      if (z1 > radius * 0.35 && z2 > radius * 0.35) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const midZ = (z1 + z2) / 2;
      const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ) || 1;
      const arcHeight = radius * 1.28;
      const elevX = (midX / midLen) * arcHeight;
      const elevY = (midY / midLen) * arcHeight;
      const elevZ = (midZ / midLen) * arcHeight;
      const [scx, scy] = project(elevX, elevY, elevZ, cx, cy, fov);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = conn.color || arcColor;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Traveling photon packet along the arc
      const t = (Math.sin(time * 1.3 + lat1 * 0.15) + 1) / 2;
      const tx =
        (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
      const ty =
        (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;

      ctx.beginPath();
      ctx.arc(tx, ty, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#22D3EE";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 6. Draw Prominent Prop Firm Logo Markers with Liquid Glass Badges
    for (const marker of markers) {
      if (marker.isActive === false) continue;

      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      // Depth awareness: only render markers on the visible front hemisphere
      if (z > radius * 0.22) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);

      // Calculate depth scaling factor so foreground markers are larger & crisp (44px base dimension)
      const depthScale = Math.max(0.72, 1 - (z + radius * 0.2) / (radius * 1.6));
      const badgeSize = Math.round(44 * depthScale);
      const halfSize = badgeSize / 2;

      // Animated surface pulse ring anchored to the city pin
      const pulse = Math.sin(time * 2.5 + marker.lat) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = marker.color
        ? marker.color.replace(")", ", 0.45)").replace("rgb", "rgba")
        : "rgba(34, 211, 238, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Anchor core dot
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = marker.color || "#22D3EE";
      ctx.fill();

      // Elevated badge coordinates
      const badgeX = sx - halfSize;
      const badgeY = sy - badgeSize - 8;

      // Register interactive hitbox for click/hover routing
      visibleHitboxesRef.current.push({
        x: badgeX,
        y: badgeY,
        width: badgeSize,
        height: badgeSize + 16,
        marker,
      });

      // Small vertical connecting pin line
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, badgeY + badgeSize);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw Liquid Glass Badge Container
      const radiusCorner = 10 * depthScale;
      ctx.save();

      // Drop shadow for 3D elevation
      ctx.shadowColor = marker.color || "rgba(34, 211, 238, 0.6)";
      ctx.shadowBlur = 12 * depthScale;
      ctx.shadowOffsetY = 3;

      // Badge Rounded Rect Path
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, radiusCorner);

      // Dark translucent Liquid Glass background fill
      ctx.fillStyle = "rgba(18, 19, 26, 0.92)";
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Frosted Border
      ctx.strokeStyle = marker.color
        ? marker.color
        : "rgba(34, 211, 238, 0.7)";
      ctx.lineWidth = 1.5 * depthScale;
      ctx.stroke();

      // Top Glass Inset Highlight
      ctx.beginPath();
      ctx.roundRect(
        badgeX + 1,
        badgeY + 1,
        badgeSize - 2,
        (badgeSize - 2) * 0.4,
        [radiusCorner, radiusCorner, 0, 0]
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx.fill();

      // Draw Prop Firm Logo inside the badge with object-fit contain ratio
      const cachedImg = marker.logoUrl
        ? imageCacheRef.current.get(marker.logoUrl)
        : null;

      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        const padding = 5.5 * depthScale;
        const targetW = badgeSize - padding * 2;
        const targetH = badgeSize - padding * 2;
        const imgRatio = cachedImg.naturalWidth / cachedImg.naturalHeight;

        let drawW = targetW;
        let drawH = targetH;
        if (imgRatio > 1) {
          drawH = targetW / imgRatio;
        } else {
          drawW = targetH * imgRatio;
        }

        const drawX = badgeX + padding + (targetW - drawW) / 2;
        const drawY = badgeY + padding + (targetH - drawH) / 2;

        ctx.drawImage(cachedImg, drawX, drawY, drawW, drawH);
      } else {
        // Fallback typography abbreviation badge
        ctx.font = `bold ${Math.round(11 * depthScale)}px Inter, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          marker.name.substring(0, 4).toUpperCase(),
          badgeX + halfSize,
          badgeY + halfSize
        );
      }

      ctx.restore();

      // Micro Name Label beneath the badge for instant recognition
      ctx.font = `bold ${Math.round(9.5 * depthScale)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(marker.name, sx, badgeY + badgeSize + 3);
    }

    ctx.restore();
    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Pointer Down (Mouse & Touch)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isPausedRef.current = true;
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    velocityRef.current = { x: 0, y: 0 };

    downPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    lastPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  // Pointer Move (Mouse & Touch Drag + Hover Cursor)
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;

    // Hover cursor check when not actively dragging
    if (!isDraggingRef.current && canvas) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const hoveredHitbox = visibleHitboxesRef.current.find(
        (box) =>
          mx >= box.x &&
          mx <= box.x + box.width &&
          my >= box.y &&
          my <= box.y + box.height
      );

      if (hoveredHitbox) {
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "grab";
      }
      return;
    }

    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastPosRef.current.time);
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;

    // Full 360° horizontal rotation with natural sensitivity
    rotYRef.current += dx * 0.006;
    rotXRef.current = Math.max(
      -0.75,
      Math.min(0.75, rotXRef.current + dy * 0.004)
    );

    // Compute velocity for inertia
    velocityRef.current = {
      x: (dx / dt) * 16 * 0.005,
      y: (dy / dt) * 16 * 0.004,
    };

    lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
  }, []);

  // Pointer Up (Smooth Release, Click Detection & Affiliate Redirect)
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const distMoved = Math.hypot(
        e.clientX - downPosRef.current.x,
        e.clientY - downPosRef.current.y
      );

      // Distinguish click from drag release (< 6px movement)
      if (distMoved < 6) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const clickedHitbox = visibleHitboxesRef.current.find(
          (box) =>
            clickX >= box.x &&
            clickX <= box.x + box.width &&
            clickY >= box.y &&
            clickY <= box.y + box.height
        );

        if (clickedHitbox) {
          const targetUrl =
            clickedHitbox.marker.affiliateUrl ||
            (clickedHitbox.marker as any).href ||
            (clickedHitbox.marker as any).website_url ||
            `/firms/${clickedHitbox.marker.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

          // Sanitize & trigger secure external navigation
          if (
            targetUrl.startsWith("http://") ||
            targetUrl.startsWith("https://") ||
            targetUrl.startsWith("/")
          ) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
          }
        }
      }
    }

    // Resume auto-rotation after 2.5s of inactivity
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 2500);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-pan-y",
        className
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing max-w-full max-h-full"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}

export const Component = InteractiveGlobe;
export const Globe = InteractiveGlobe;
export default InteractiveGlobe;

