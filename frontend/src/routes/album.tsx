import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ALL_STICKERS, TEAMS, type Sticker, type StickerCategory } from "@/lib/stickers";
import { useStickers } from "@/hooks/useStickers";
import { AppHeader } from "@/components/AppHeader";
import { StickerCard } from "@/components/StickerCard";
import { StickerSheet } from "@/components/StickerSheet";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/lib/auth";

const searchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["all", "owned", "missing", "duplicate"]).optional(),
  category: z.enum(["all", "special", "country", "cocacola"]).optional(),
  team: z.string().optional(),
});

export const Route = createFileRoute("/album")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Álbum — Controle de Figurinhas 2026" },
      { name: "description", content: "Veja todas as figurinhas e marque o que você possui." },
    ],
  }),
  validateSearch: searchSchema,
  component: AlbumPage,
});

function AlbumPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { map } = useStickers();
  const [active, setActive] = useState<Sticker | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const status = search.status ?? "all";
  const category = search.category ?? "all";
  const team = search.team ?? "all";
  const q = (search.q ?? "").trim().toUpperCase();

  const toggleGroup = (groupCode: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupCode)) {
        newSet.delete(groupCode);
      } else {
        newSet.add(groupCode);
      }
      return newSet;
    });
  };

  const filtered = useMemo(() => {
    return ALL_STICKERS.filter((s) => {
      if (q && !s.code.includes(q)) return false;
      if (category !== "all" && s.category !== category) return false;
      if (team !== "all" && s.group !== team) return false;
      const e = map[s.code];
      const st = e?.status ?? "missing";
      if (status === "owned" && !(st === "owned" || st === "duplicate")) return false;
      if (status === "missing" && st !== "missing") return false;
      if (status === "duplicate" && st !== "duplicate") return false;
      return true;
    });
  }, [q, status, category, team, map]);

  const grouped = useMemo(() => {
    const groups: Record<string, { name: string; items: Sticker[] }> = {};
    for (const s of filtered) {
      if (!groups[s.group]) groups[s.group] = { name: s.groupName, items: [] };
      groups[s.group].items.push(s);
    }
    return groups;
  }, [filtered]);

  const set = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }), replace: true });

  return (
    <>
      <AppHeader title="Álbum" subtitle={`${filtered.length} figurinhas`} />
      <div className="sticky top-[68px] z-20 bg-background/95 backdrop-blur px-4 pt-3 pb-2 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar BRA10, FWC5, CC3..."
            value={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value })}
            className="pl-9 h-10"
          />
        </div>
        <div className="mt-2 flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
          {[
            { v: "all", l: "Todas" },
            { v: "missing", l: "Faltam" },
            { v: "owned", l: "Tenho" },
            { v: "duplicate", l: "Repetidas" },
          ].map((o) => (
            <Chip key={o.v} active={status === o.v} onClick={() => set({ status: o.v as any })}>
              {o.l}
            </Chip>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
          {[
            { v: "all", l: "Tudo" },
            { v: "special", l: "Especiais" },
            { v: "country", l: "Seleções" },
            { v: "cocacola", l: "Coca-Cola" },
          ].map((o) => (
            <Chip
              key={o.v}
              active={category === o.v}
              onClick={() => set({ category: o.v as StickerCategory | "all", team: "all" })}
            >
              {o.l}
            </Chip>
          ))}
        </div>
        {(category === "all" || category === "country") && (
          <div className="mt-1.5 flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
            <Chip active={team === "all"} onClick={() => set({ team: "all" })}>
              Todas seleções
            </Chip>
            {TEAMS.map((t) => (
              <Chip key={t.code} active={team === t.code} onClick={() => set({ team: t.code })}>
                <span className="mr-1">{t.flag}</span>
                {t.code}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <main className="px-4 py-4 space-y-5">
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Nenhuma figurinha encontrada com esses filtros.
          </div>
        )}
        {Object.keys(grouped).length > 0 && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setCollapsedGroups(new Set())}
              className="text-xs text-primary hover:underline"
            >
              Expandir todos
            </button>
            <span className="text-xs text-muted-foreground">·</span>
            <button
              onClick={() => setCollapsedGroups(new Set(Object.keys(grouped)))}
              className="text-xs text-primary hover:underline"
            >
              Colapsar todos
            </button>
          </div>
        )}
        {Object.entries(grouped).map(([code, g]) => {
          const team = TEAMS.find((t) => t.code === code);
          const isCollapsed = collapsedGroups.has(code);
          
          return (
            <section key={code}>
              <button
                onClick={() => toggleGroup(code)}
                className="w-full font-bold text-sm mb-2 flex items-center gap-2 hover:text-primary transition-colors text-left"
              >
                {team && <span className="text-lg">{team.flag}</span>}
                <span>{g.name}</span>
                <span className="text-xs text-muted-foreground font-normal">({g.items.length})</span>
                <span className="ml-auto">
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </span>
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
      </main>

      <StickerSheet sticker={active} onClose={() => setActive(null)} />

      <button
        className="fixed bottom-20 right-4 z-30 bg-accent text-accent-foreground rounded-full px-4 py-2 text-xs font-bold shadow-lg"
        onClick={() => set({ q: "", status: "all", category: "all", team: "all" })}
      >
        Limpar filtros
      </button>
    </>
  );
}

function Chip({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border"
      )}
    >
      {children}
    </button>
  );
}
