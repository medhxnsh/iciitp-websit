"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SPACING = 8;   // px between particles — larger = sparser grid
const MARGIN = 12;   // tiny edge margin so particles don't clip exactly at border
const THICKNESS = Math.pow(90, 2);  // mouse repulsion radius²
const DRAG = 0.95;
const EASE = 0.25;
// Brand orange accent: #f79420 → rgb(247, 148, 32)
const PR = 247, PG = 148, PB = 32;

interface Particle {
  x: number; y: number;
  ox: number; oy: number;
  vx: number; vy: number;
}

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;

export function ParticleHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let tog = true;
    let man = false;
    let mx = 0, my = 0;
    let list: Particle[] = [];
    let w = 0, h = 0;
    let numParticles = 0;

    const init = () => {
      w = canvas.width = wrap.clientWidth;
      h = canvas.height = wrap.clientHeight;

      // Fill edge-to-edge with minimal margin
      const cols = Math.floor((w - MARGIN * 2) / SPACING);
      const rows = Math.floor((h - MARGIN * 2) / SPACING);
      numParticles = cols * rows;

      const gridW = (cols - 1) * SPACING;
      const gridH = (rows - 1) * SPACING;
      const ox0 = (w - gridW) / 2;
      const oy0 = (h - gridH) / 2;

      list = Array.from({ length: numParticles }, (_, i) => {
        const ox = ox0 + SPACING * (i % cols);
        const oy = oy0 + SPACING * Math.floor(i / cols);
        return { x: ox, y: oy, ox, oy, vx: 0, vy: 0 };
      });
    };

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      man = true;
    };

    init();
    wrap.addEventListener("mousemove", onMove);

    const step = (now: number) => {
      animId = requestAnimationFrame(step);
      tog = !tog;

      if (tog) {
        if (!man) {
          const t = now * 0.001;
          const tanVal = Math.max(-2, Math.min(2, Math.tan(Math.sin(t * 0.8))));
          mx = w * 0.5 + Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45;
          my = h * 0.5 + Math.sin(t * 3.2) * tanVal * h * 0.45;
        }
        for (let i = 0; i < numParticles; i++) {
          const p = list[i];
          const dx = mx - p.x, dy = my - p.y;
          const d = dx * dx + dy * dy;
          if (d < THICKNESS) {
            const angle = Math.atan2(dy, dx);
            const f = -THICKNESS / d;
            p.vx += f * Math.cos(angle);
            p.vy += f * Math.sin(angle);
          }
          p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
          p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;
        }
      } else {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = `rgba(${PR},${PG},${PB},0.5)`;
        for (let i = 0; i < numParticles; i++) {
          const p = list[i];
          ctx.fillRect(~~p.x, ~~p.y, 2, 2);
        }
      }
    };

    animId = requestAnimationFrame(step);

    const ro = new ResizeObserver(() => init());
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(animId);
      wrap.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="flex-1 relative w-full min-h-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-4"
        style={{ pointerEvents: "none" }}
      >
        <motion.p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#3a5214" }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_CURVE }}
        >
          Incubation Centre · IIT Patna
        </motion.p>
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black max-w-3xl mx-auto leading-tight mb-6 text-center"
          style={{ color: "#1c2e06" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: EASE_CURVE }}
        >
          India&apos;s leading ESDM &amp; Medical Electronics Incubator
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg max-w-xl mx-auto text-center"
          style={{ color: "#2a3a0d" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.26, ease: EASE_CURVE }}
        >
          ₹47.10 Crore undertaking backed by Govt. of India &amp; Govt. of Bihar
          {" — "}100+ startups, 6 labs, 6 schemes.
        </motion.p>

        {/* Apply Now CTA — intersection-observed by the nav */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-5"
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42, ease: EASE_CURVE }}
        >
          <a
            id="hero-cta"
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#f79420" }}
          >
            Apply Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          {/* Quick trust stats */}
          <p className="text-xs text-center" style={{ color: "#5a7c20" }}>
            1,000+ B-plans screened &nbsp;·&nbsp; 25 patents filed &nbsp;·&nbsp; Est. 2015
          </p>
        </motion.div>
      </div>
    </div>
  );
}
