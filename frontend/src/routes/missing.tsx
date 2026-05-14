import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ALL_STICKERS, TEAMS, type Sticker } from "@/lib/stickers";
import { useStickers } from "@/hooks/useStickers";
import { AppHeader } from "@/components/AppHeader";
import { StickerCard } from "@/components/StickerCard";
import { StickerSheet } from "@/components/StickerSheet";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/missing")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Faltantes — Controle de Figurinhas 2026" },
      { name: "description", content: "Veja todas as figurinhas que ainda faltam no seu álbum." },
    ],
  }),
  component: MissingPage,
});

function MissingPage() {
  const { map } = useStickers();
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<Sticker | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const missing = useMemo(
    () => ALL_STICKERS.filter((s) => (map[s.code]?.status ?? "missing") === "missing"),
    [map]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return missing;
    if (filter === "special") return missing.filter((s) => s.category === "special");
    if (filter === "cocacola") return missing.filter((s) => s.category === "cocacola");
    return missing.filter((s) => s.group === filter);
  }, [missing, filter]);

  const grouped = useMemo(() => {
    const g: Record<string, { name: string; items: Sticker[] }> = {};
    for (const s of filtered) {
      if (!g[s.group]) g[s.group] = { name: s.groupName, items: [] };
      g[s.group].items.push(s);
    }
    return g;
  }, [filtered]);

  const toggleGroup = (code: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const expandAll = () => setCollapsedGroups(new Set());
  const collapseAll = () => setCollapsedGroups(new Set(Object.keys(grouped)));

  return (
    <>
      <AppHeader title="Faltantes" subtitle={`${missing.length} para completar o álbum`} />

      <div className="sticky top-[68px] z-20 bg-background/95 backdrop-blur border-b py-2">
        <div className="flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Todas</FilterChip>
          <FilterChip active={filter === "special"} onClick={() => setFilter("special")}>Especiais</FilterChip>
          <FilterChip active={filter === "cocacola"} onClick={() => setFilter("cocacola")}>Coca-Cola</FilterChip>
          {TEAMS.map((t) => (
            <FilterChip key={t.code} active={filter === t.code} onClick={() => setFilter(t.code)}>
              <span className="mr-1">{t.flag}</span>
              {t.code}
            </FilterChip>
          ))}
        </div>
      </div>

      <main className="px-4 py-4 space-y-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🏆</div>
            <p className="font-bold">Tudo completo aqui!</p>
            <p className="text-sm text-muted-foreground">Você já tem todas dessa categoria.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 justify-end">
              <button
                onClick={expandAll}
                className="text-xs text-primary hover:underline"
              >
                Expandir todos
              </button>
              <span className="text-xs text-muted-foreground">·</span>
              <button
                onClick={collapseAll}
                className="text-xs text-primary hover:underline"
              >
                Colapsar todos
              </button>
            </div>
            {Object.entries(grouped).map(([code, g]) => {
              const team = TEAMS.find((t) => t.code === code);
              const isCollapsed = collapsedGroups.has(code);
              return (
                <section key={code}>
                  <button
                    onClick={() => toggleGroup(code)}
                    className="w-full font-bold text-sm mb-2 flex items-center gap-2 hover:opacity-70 transition-opacity"
                  >
                    {team && <span className="text-lg">{team.flag}</span>}
                    <span>{g.name}</span>
                    <span className="text-xs text-muted-foreground">({g.items.length})</span>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronUp className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  {!isCollapsed && (
                    <div className="grid grid-cols-5 gap-2">
                      {g.items.map((s) => (
                        <StickerCard key={s.code} sticker={s} onLongPress={setActive} />
                      ))}
                    </div>
                  )}
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

function FilterChip({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold border",
        active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
      )}
    >
      {children}
    </button>
  );
}
