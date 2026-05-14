import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ALL_STICKERS, TEAMS, type Sticker } from "@/lib/stickers";
import { useStickers } from "@/hooks/useStickers";
import { AppHeader } from "@/components/AppHeader";
import { StickerCard } from "@/components/StickerCard";
import { StickerSheet } from "@/components/StickerSheet";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/duplicates")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Repetidas — Controle de Figurinhas 2026" },
      { name: "description", content: "Suas figurinhas repetidas, prontas para troca." },
    ],
  }),
  component: DupsPage,
});

function DupsPage() {
  const { map } = useStickers();
  const [active, setActive] = useState<Sticker | null>(null);

  const dups = useMemo(
    () => ALL_STICKERS.filter((s) => map[s.code]?.status === "duplicate"),
    [map]
  );
  
  const total = useMemo(
    () => dups.reduce((acc, s) => acc + (map[s.code]?.duplicates || 0), 0),
    [dups, map]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, { name: string; items: Sticker[] }> = {};
    for (const s of dups) {
      if (!groups[s.group]) groups[s.group] = { name: s.groupName, items: [] };
      groups[s.group].items.push(s);
    }
    return groups;
  }, [dups]);

  return (
    <>
      <AppHeader title="Repetidas" subtitle={`${dups.length} figurinhas · ${total} extras`} />
      <main className="px-4 py-4 space-y-5">
        {dups.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-bold">Nenhuma repetida ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Marque suas duplicadas no álbum para listá-las aqui.
            </p>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([code, g]) => {
              const team = TEAMS.find((t) => t.code === code);
              return (
                <section key={code}>
                  <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
                    {team && <span className="text-lg">{team.flag}</span>}
                    <span>{g.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      ({g.items.length} {g.items.length === 1 ? 'figurinha' : 'figurinhas'})
                    </span>
                  </h2>
                  <div className="grid grid-cols-5 gap-2">
                    {g.items.map((s) => (
                      <StickerCard key={s.code} sticker={s} onLongPress={setActive} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
      <StickerSheet sticker={active} onClose={() => setActive(null)} />
    </>
  );
}
