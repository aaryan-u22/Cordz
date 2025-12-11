"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import DigitalCardEditor from "@/components/DigitalCardEditor";
import DigitalCardPreview, { Card } from "@/components/DigitalCardPreview";

export default function DashboardPage() {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [deletedCards, setDeletedCards] = useState<Card[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Load ALL cards (shared dashboard)
  const fetchCards = async () => {
    // Active cards — not deleted
    const { data: active, error: activeError } = await supabase
      .from("cards")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (!activeError && active) {
      setCards(
        active.map((c: any) => ({
          id: c.id,
          title: c.title,
          tagline: c.tagline,
          creator_name: c.creator_name,
          owner: c.owner,
          color_r: c.color_r ?? 0,
          color_g: c.color_g ?? 0,
          color_b: c.color_b ?? 0,
          text_r: c.text_r ?? null,
          text_g: c.text_g ?? null,
          text_b: c.text_b ?? null,
          created_at: c.created_at,
          deleted_at: c.deleted_at,
          font_key: c.font_key ?? "modern",
          template_key: c.template_key ?? "classic",
        }))
      );
    }

    // Recently deleted (within last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: deleted, error: deletedError } = await supabase
      .from("cards")
      .select("*")
      .not("deleted_at", "is", null)
      .gte("deleted_at", oneWeekAgo.toISOString())
      .order("deleted_at", { ascending: false });

    if (!deletedError && deleted) {
      setDeletedCards(
        deleted.map((c: any) => ({
          id: c.id,
          title: c.title,
          tagline: c.tagline,
          creator_name: c.creator_name,
          owner: c.owner,
          color_r: c.color_r ?? 0,
          color_g: c.color_g ?? 0,
          color_b: c.color_b ?? 0,
          text_r: c.text_r ?? null,
          text_g: c.text_g ?? null,
          text_b: c.text_b ?? null,
          created_at: c.created_at,
          deleted_at: c.deleted_at,
          font_key: c.font_key ?? "modern",
          template_key: c.template_key ?? "classic",
        }))
      );
    }
  };

  // Auth + profile + initial fetch
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      setCurrentUserId(user.id);

      // Try to fetch profile.display_name
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      let finalName: string;

      if (profileError) {
        console.error("Error fetching profile", profileError);
      }

      if (!profile) {
        // No profile row yet, create one with default from email prefix
        const fallbackFromEmail =
          user.email?.split("@")[0] || "User";

        const { data: inserted, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            display_name: fallbackFromEmail,
          })
          .select("display_name")
          .single();

        if (insertError) {
          console.error("Error inserting profile", insertError);
          finalName = user.email ?? "User";
        } else {
          finalName = inserted.display_name ?? fallbackFromEmail;
        }
      } else {
        finalName =
          profile.display_name ||
          user.email?.split("@")[0] ||
          user.email ||
          "User";
      }

      setUserName(finalName);
      setLoadingUser(false);
      await fetchCards();
    })();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // 1st delete: soft delete (send to Recently deleted)
  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      "Send this card to Recently deleted? You can restore it or permanently delete it within 7 days."
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("cards")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Failed to delete: " + error.message);
      return;
    }

    await fetchCards();
  };

  // Restore from soft delete
  const handleRestore = async (id: string | undefined) => {
    if (!id) return;
    const { error } = await supabase
      .from("cards")
      .update({ deleted_at: null })
      .eq("id", id);

    if (error) {
      alert("Failed to restore: " + error.message);
      return;
    }

    await fetchCards();
  };

  // 2nd delete: permanent delete from DB
  const handlePermanentDelete = async (id: string | undefined) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      "This will permanently delete the card from the database and cannot be undone. Continue?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to permanently delete: " + error.message);
      return;
    }

    await fetchCards();
  };

  const handleEditorClose = () => {
    setShowEditor(false);
  };

  const handleEditorSaved = async () => {
    setShowEditor(false);
    await fetchCards();
  };

  if (loadingUser) {
    return <p className="mt-6 text-sm text-slate-300">Loading...</p>;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Our Safe Place</h1>
            <p className="text-xs text-slate-400">
              Logged in as {userName || "user"}
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs hover:bg-slate-800/70 bg-slate-900/70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            Logout
          </motion.button>
        </div>

        {/* Create Card Button */}
        <div>
          <motion.button
            onClick={() => setShowEditor(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium text-white shadow-md shadow-indigo-500/40 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Create New Card
          </motion.button>
        </div>

        {/* Active cards */}
        <section className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">All active cards</h3>
            <span className="text-[11px] text-slate-500">
              {cards.length} active
            </span>
          </div>

          {cards.length === 0 ? (
            <p className="text-xs text-slate-400">
              No cards yet. Create your first card using the button above.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3 flex flex-col gap-2"
                  whileHover={{ y: -2 }}
                >
                  <DigitalCardPreview card={card} />

                  <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                    <span>Created by: {card.creator_name || "Unknown"}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-2">
                    {/* Only owner can see delete button */}
                    {currentUserId === card.owner && (
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="
                          inline-flex items-center justify-center
                          w-9 h-9 rounded-full
                          bg-slate-900/80
                          border border-slate-700
                          text-slate-200
                          hover:bg-red-500/80 hover:text-white hover:border-red-300
                          active:scale-95
                          transition-all
                        "
                      >
                        {/* Trash icon */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4m16 0H4"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Recently deleted */}
        <section className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Recently deleted (shared)</h3>
            <span className="text-[11px] text-slate-500">
              {deletedCards.length} within last 7 days
            </span>
          </div>

          {deletedCards.length === 0 ? (
            <p className="text-xs text-slate-500">
              No cards in the restore window.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {deletedCards.map((card) => (
                <motion.div
                  key={card.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3 flex flex-col gap-2"
                  whileHover={{ y: -2 }}
                >
                  <DigitalCardPreview card={card} />

                  <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                    <span>Created by: {card.creator_name || "Unknown"}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-2">
                    {/* Only owner can act on their deleted cards */}
                    {currentUserId === card.owner && (
                      <>
                        <button
                          onClick={() => handleRestore(card.id)}
                          className="
                            inline-flex items-center justify-center
                            w-9 h-9 rounded-full
                            bg-slate-900/80
                            border border-slate-700
                            text-slate-200
                            hover:bg-emerald-500/80 hover:text-white hover:border-emerald-300
                            active:scale-95
                            transition-all
                          "
                        >
                          {/* Restore icon */}
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 4v5h.582m0 0A7.5 7.5 0 0112 4.5 7.5 7.5 0 0119.418 9M4.582 9H9m11 11v-5h-.582m0 0A7.5 7.5 0 0112 19.5 7.5 7.5 0 014.582 15M19.418 15H15"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(card.id)}
                          className="
                            inline-flex items-center justify-center
                            w-9 h-9 rounded-full
                            bg-slate-900/80
                            border border-slate-700
                            text-slate-200
                            hover:bg-red-500/90 hover:text-white hover:border-red-300
                            active:scale-95
                            transition-all
                          "
                        >
                          {/* Trash icon */}
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4m16 0H4"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showEditor && (
        <DigitalCardEditor
          onSaved={handleEditorSaved}
          onClose={handleEditorClose}
        />
      )}
    </>
  );
}
