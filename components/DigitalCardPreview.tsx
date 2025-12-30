"use client";

import React from "react";
import { motion } from "framer-motion";
import { fontClassMap } from "../src/app/fonts";

export type Card = {
  id?: string;
  title?: string | null;
  tagline?: string | null;
  creator_name?: string | null;
  owner?: string | null;
  color_r: number;
  color_g: number;
  color_b: number;
  text_r?: number | null;
  text_g?: number | null;
  text_b?: number | null;
  created_at?: string;
  deleted_at?: string | null;
  font_key?: string | null;
  template_key?: string | null;
};

export default function DigitalCardPreview({ card }: { card: Card }) {
  const bg = `rgb(${card.color_r}, ${card.color_g}, ${card.color_b})`;
  const heading = card.title?.trim() || "Card Title";
  const content =
    card.tagline?.trim() ||
    "This is your card content. Add a short message or description here.";
  const createdLabel = card.created_at
    ? new Date(card.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not saved yet";
  const isDeleted = !!card.deleted_at;

  const fontKey = card.font_key ?? "modern";
  const fontClass = fontClassMap[fontKey] ?? fontClassMap.modern;

  const templateKey = card.template_key ?? "classic";

  const textColor =
    card.text_r != null &&
    card.text_g != null &&
    card.text_b != null
      ? `rgb(${card.text_r}, ${card.text_g}, ${card.text_b})`
      : "#ffffff";

  const baseInner = (
    <>
      <div className="relative z-10">
        <h3
          className="text-xl font-bold tracking-tight text-white drop-shadow-lg"
          style={{ color: textColor }}
        >
          {heading}
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed text-white/95 drop-shadow whitespace-pre-wrap"
          style={{ color: textColor }}
        >
          {content}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between text-xs text-white/80">
        <span className="font-medium" style={{ color: textColor }}>
          {card.creator_name || "Unknown user"}
        </span>
        <span style={{ color: textColor }}>{createdLabel}</span>
      </div>
    </>
  );

  const renderTemplateDecor = () => {
    switch (templateKey) {
      case "pill":
        return (
          <>
            <div className="absolute -left-12 -top-12 w-40 h-40 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -right-8 bottom-0 w-28 h-28 rounded-full bg-black/30 blur-2xl" />
            <div className="absolute right-4 top-4 w-16 h-16 rounded-full border-2 border-white/20" />
          </>
        );

      case "neon":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 via-transparent to-cyan-400/20 mix-blend-screen" />
            <div className="absolute -inset-4 border-2 border-emerald-300/40 rounded-2xl" />
            <div className="absolute -inset-2 border border-cyan-300/30 rounded-2xl" />
          </>
        );

      case "stripe":
        return (
          <>
            <div className="absolute -top-10 -right-12 w-48 h-24 bg-white/15 rotate-12 blur-sm" />
            <div className="absolute -top-6 -right-8 w-48 h-20 bg-black/15 rotate-12" />
            <div className="absolute top-0 -right-4 w-48 h-16 bg-white/10 rotate-12 blur-sm" />
          </>
        );

      // NEW: Top-right shape (clean, geometric)
      case "shape-tr":
        return (
          <>
            {/* large rotated polygon */}
            <div
              className="absolute -right-8 -top-8 w-44 h-44 rounded-2xl transform rotate-12"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
                clipPath:
                  "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%)",
                filter: "blur(8px)",
              }}
            />
            {/* small accent */}
            <div className="absolute -right-2 top-6 w-12 h-12 rounded-full border border-white/18 bg-white/6" />
          </>
        );

      // NEW: Right-side shape (vertical pill + diagonal slice)
      case "shape-right":
        return (
          <>
            <div
              className="absolute right-0 top-0 bottom-0 w-20 rounded-l-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                boxShadow: "inset -10px 0 30px rgba(0,0,0,0.25)",
              }}
            />
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-md transform rotate-12"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06), transparent)",
                clipPath: "polygon(0 0, 100% 0, 60% 100%, 0% 100%)",
                opacity: 0.9,
                filter: "blur(4px)",
              }}
            />
            <div className="absolute right-3 top-3 w-6 h-6 rounded-full bg-white/10" />
          </>
        );

      // NEW: Bottom-right shape (corner wedge + soft glow)
      case "shape-br":
        return (
          <>
            <div
              className="absolute right-0 bottom-0 w-40 h-36 rounded-tl-xl"
              style={{
                background:
                  "linear-gradient(225deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                clipPath: "polygon(100% 30%, 100% 100%, 30% 100%, 0 70%, 0 0, 100% 0)",
                filter: "blur(6px)",
              }}
            />
            <div className="absolute right-6 bottom-6 w-12 h-12 rounded-full border border-white/18 bg-white/8" />
            <div className="absolute right-12 bottom-12 w-6 h-6 rounded-sm bg-white/6" />
          </>
        );

      case "radiant":
        return (
          <>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-36 rounded-full bg-white/12 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-black/18" />
          </>
        );

      case "halo":
        return (
          <>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-28 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/80 rounded-full shadow-lg" />
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-px bg-white/40" />
          </>
        );
      case "orbit":
        return (
          <>
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/20 rounded-full" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-32 h-32 border border-white/40 rounded-full" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/60 rounded-full shadow-lg" />
          </>
        );
      case "gradient":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        );
      case "letter":
        return (
          <>
            <div className="absolute inset-0 bg-white/6" />
            <div className="absolute inset-4 border border-white/20 rounded-xl" />
          </>
        );
      case "aura":
        return (
          <>
            {/* inner soft aura */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18), transparent 60%)",
              }}
            />

            {/* outer ambient glow */}
            <div
              className="absolute -inset-16 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 70%)",
                filter: "blur(24px)",
              }}
            />
          </>
        );

      case "quote":
        return (
          <>
            {/* top-right opening quote */}
            <div
              className="absolute top-2 right-4 text-[140px] leading-none pointer-events-none select-none"
              style={{
                color: "rgba(255,255,255,0.06)",
                fontFamily: "serif",
                filter: "blur(1px)",
              }}
            >
              “
            </div>

            {/* bottom-left closing quote */}
            <div
              className="absolute bottom-4 left-6 text-[90px] leading-none pointer-events-none select-none"
              style={{
                color: "rgba(255,255,255,0.04)",
                fontFamily: "serif",
              }}
            >
              ”
            </div>
          </>
        );


      case "divider":
        return (
          <>
            {/* primary abstract motion sweep */}
            <div
              className="absolute -left-24 top-18 w-[170%] h-[160px] pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    65% 110% at 28% 50%,
                    rgba(255,255,255,0.32),
                    rgba(255,255,255,0.22),
                    rgba(255,255,255,0.12),
                    rgba(255,255,255,0.05),
                    transparent 72%
                  )
                `,
                transform: "rotate(-1deg)",
                filter: "blur(18px)",
                opacity: 1,
              }}
            />

            {/* secondary echo for depth */}
            <div
              className="absolute -right-24 bottom-2 w-[150%] h-[140px] pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    55% 95% at 72% 55%,
                    rgba(255,255,255,0.26),
                    rgba(255,255,255,0.16),
                    rgba(255,255,255,0.08),
                    transparent 70%
                  )
                `,
                transform: "rotate(1deg)",
                filter: "blur(22px)",
                opacity: 0.95,
              }}
            />
          </>
        );

      case "sticky":
        return (
          <>
            <div className="absolute inset-0 rotate-[-1.5deg] bg-black/10" />
          </>
        );

      case "mesh":
        return (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
              `,
                backgroundSize: "50px 50px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
          </>
        );
      case "classic":
      default:
        // fallback visual (covers unknown/old keys as well)
        return (
          <>
            <div className="absolute -inset-20 bg-radial from-white/25 via-transparent to-transparent opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          </>
        );
    }
  };

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-slate-500/40 via-indigo-500/50 to-purple-500/40 shadow-2xl shadow-black/60">
        <motion.div
          className={`relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden min-h-[240px] ${fontClass}`}
          style={{ background: bg }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Base dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

          {/* Template decorations */}
          {renderTemplateDecor()}

          {/* Deleted overlay (if you ever reuse this inside deleted list alone) */}
          {isDeleted && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-20">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-slate-500/80 bg-slate-900/90 shadow-xl">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                    Deleted
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Restore within 7 days
                </p>
              </div>
            </div>
          )}

          {baseInner}
        </motion.div>
      </div>
    </motion.div>
  );
}
