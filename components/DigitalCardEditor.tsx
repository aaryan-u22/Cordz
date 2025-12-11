"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import DigitalCardPreview, { Card } from "@/components/DigitalCardPreview";

type CardForm = {
  title: string;
  content: string;
  color_r: number;
  color_g: number;
  color_b: number;
  text_r: number;
  text_g: number;
  text_b: number;
  font_key: string;
  template_key: string;
};

const FONT_OPTIONS = [
  { value: "modern", label: "Modern Sans" },
  { value: "techno", label: "Techno" },
  { value: "mono", label: "Monospace" },
  { value: "soft", label: "Soft Rounded" },
  { value: "serif", label: "Elegant Serif" },
  { value: "condensed", label: "Condensed" },
  { value: "bold", label: "Bold Display" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "corporate", label: "Corporate" },
  { value: "geometric", label: "Geometric" },
  { value: "minimal", label: "Minimal" },
  { value: "elegant", label: "Elegant Sans" },
];

const TEMPLATE_OPTIONS = [
  { value: "classic", label: "Classic Glow" },
  { value: "pill", label: "Apex" },
  { value: "neon", label: "Neon Frame" },
  { value: "stripe", label: "Diagonal Stripes" },

  // Replaced the previous three (accent, panels, glass) with shape-focused templates:
  { value: "shape-tr", label: "Sky Fold" },     // shape in top-right
  { value: "shape-right", label: "Edge Rail" }, // shape centered on right
  { value: "shape-br", label: "Anchor Glow" },  // shape in bottom-right

  // Keep other variants
  { value: "radiant", label: "Radiant Flow" },
  { value: "halo", label: "Halo Top" },
  { value: "orbit", label: "Orbit Rings" },
  { value: "gradient", label: "Gradient Flow" },
  { value: "mesh", label: "Mesh Grid" },
];

// Helpers for hex ↔ rgb
function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, v))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return { r: 255, g: 255, b: 255 };
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

export default function DigitalCardEditor({
  onSaved,
  onClose,
}: {
  onSaved?: () => void;
  onClose?: () => void;
}) {
  const [form, setForm] = useState<CardForm>({
    title: "",
    content: "",
    // default background: white
    color_r: 255,
    color_g: 255,
    color_b: 255,
    // default text color: black
    text_r: 0,
    text_g: 0,
    text_b: 0,
    font_key: "modern",
    template_key: "classic",
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string>("You");
  const [saving, setSaving] = useState(false);
  const [previewCard, setPreviewCard] = useState<Card>({
    title: "",
    tagline: "",
    color_r: 255,
    color_g: 255,
    color_b: 255,
    text_r: 0,
    text_g: 0,
    text_b: 0,
    creator_name: "You",
    font_key: "modern",
    template_key: "classic",
  });

  // Load user + profile display name
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      const name =
        profile?.display_name ||
        user.email?.split("@")[0] ||
        user.email ||
        "You";

      setCreatorName(name);
      setPreviewCard((prev) => ({ ...prev, creator_name: name }));
    })();
  }, []);

  // Update preview when form or creator changes
  useEffect(() => {
    setPreviewCard((prev) => ({
      ...prev,
      title: form.title,
      tagline: form.content,
      color_r: form.color_r,
      color_g: form.color_g,
      color_b: form.color_b,
      text_r: form.text_r,
      text_g: form.text_g,
      text_b: form.text_b,
      font_key: form.font_key,
      template_key: form.template_key,
      creator_name: creatorName,
    }));
  }, [form, creatorName]);

  const handleFieldChange =
    (field: keyof CardForm) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const value = e.target.value;

      if (
        field === "color_r" ||
        field === "color_g" ||
        field === "color_b" ||
        field === "text_r" ||
        field === "text_g" ||
        field === "text_b"
      ) {
        const numeric = parseInt(value, 10);
        setForm((f) => ({ ...f, [field]: isNaN(numeric) ? 0 : numeric }));
      } else {
        setForm((f) => ({ ...f, [field]: value }));
      }
    };

  const handleTemplateClick = (value: string) => {
    setForm((f) => ({ ...f, template_key: value }));
  };

  const handleFontClick = (value: string) => {
    setForm((f) => ({ ...f, font_key: value }));
  };

  // Background color from color spectrum
  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { r, g, b } = hexToRgb(e.target.value);
    setForm((f) => ({
      ...f,
      color_r: r,
      color_g: g,
      color_b: b,
    }));
  };

  // Text color from color spectrum
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { r, g, b } = hexToRgb(e.target.value);
    setForm((f) => ({
      ...f,
      text_r: r,
      text_g: g,
      text_b: b,
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      alert("Not signed in.");
      return;
    }

    if (!form.title.trim() && !form.content.trim()) {
      alert("Please add at least a title or some content.");
      return;
    }

    setSaving(true);

    const payload: any = {
      owner: userId,
      creator_id: userId,
      creator_name: creatorName,
      title: form.title,
      tagline: form.content,
      color_r: form.color_r,
      color_g: form.color_g,
      color_b: form.color_b,
      font_key: form.font_key,
      template_key: form.template_key,
      text_r: form.text_r,
      text_g: form.text_g,
      text_b: form.text_b,
    };

    const { error } = await supabase.from("cards").insert(payload);
    setSaving(false);

    if (error) {
      alert("Failed to save: " + error.message);
      return;
    }

    setForm((f) => ({
      ...f,
      title: "",
      content: "",
    }));
    onSaved?.();
  };

  const bgRgb = `rgb(${form.color_r}, ${form.color_g}, ${form.color_b})`;
  const textRgb = `rgb(${form.text_r}, ${form.text_g}, ${form.text_b})`;
  const bgHex = rgbToHex(form.color_r, form.color_g, form.color_b);
  const textHex = rgbToHex(form.text_r, form.text_g, form.text_b);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto p-4">
      <div className="min-h-screen flex items-center justify-center py-8">
        <motion.div
          className="bg-slate-900/95 rounded-2xl border border-slate-800 w-full max-w-4xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Create New Card</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs text-slate-300 mb-1">Title</label>
              <input
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                value={form.title}
                onChange={handleFieldChange("title")}
                placeholder="Card title..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Content
              </label>
              <textarea
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 min-h-[80px] resize-none"
                value={form.content}
                onChange={handleFieldChange("content")}
                placeholder="Card description..."
              />
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-xs text-slate-300 mb-2">Font</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => handleFontClick(font.value)}
                    className={`p-2 rounded-lg border text-xs transition-all ${
                      form.font_key === font.value
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 hover:border-slate-600 bg-slate-950"
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Template
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TEMPLATE_OPTIONS.map((tpl) => (
                  <button
                    key={tpl.value}
                    onClick={() => handleTemplateClick(tpl.value)}
                    className={`p-2 rounded-lg border text-xs transition-all ${
                      form.template_key === tpl.value
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 hover:border-slate-600 bg-slate-950"
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color pickers */}
            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Colors
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Background color */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Background color
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgHex}
                      onChange={handleBgColorChange}
                      className="h-10 w-16 rounded-md border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <div>
                      <div
                        className="w-10 h-10 rounded-md border border-slate-700 mb-1"
                        style={{ background: bgRgb }}
                      />
                      <div className="text-[11px] text-slate-400">
                        {bgRgb}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text color */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Text color
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={textHex}
                      onChange={handleTextColorChange}
                      className="h-10 w-16 rounded-md border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <div>
                      <div
                        className="w-10 h-10 rounded-md border border-slate-700 mb-1"
                        style={{ background: textRgb }}
                      />
                      <div className="text-[11px] text-slate-400">
                        {textRgb}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Preview
              </label>
              <div className="flex justify-center">
                <DigitalCardPreview card={previewCard} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Card"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
