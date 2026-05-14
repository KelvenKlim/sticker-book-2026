import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMemo } from "react";
import { ALL_STICKERS, TEAMS } from "@/lib/stickers";
import { useStickers } from "@/hooks/useStickers";
import { AppHeader } from "@/components/AppHeader";
import { FIFATrophy } from "@/components/WorldCupAssets";
import { BookOpen, Search, Copy, Sparkles, Flag, Wine } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Início — Controle de Figurinhas 2026" },
      { name: "description", content: "Acompanhe seu progresso no álbum da Copa 2026." },
    ],
  }),
  component: Index,
});

function Index() {
  const { map } = useStickers();

  const stats = useMemo(() => {
    const total = ALL_STICKERS.length;
    let owned = 0;
    let duplicates = 0;
    for (const s of ALL_STICKERS) {
      const e = map[s.code];
      if (!e) continue;
      if (e.status === "owned" || e.status === "duplicate") owned++;
      if (e.status === "duplicate") duplicates += e.duplicates || 0;
    }
    const missing = total - owned;
    const pct = total ? Math.round((owned / total) * 100) : 0;
    return { total, owned, missing, duplicates, pct };
  }, [map]);

  const byCategory = useMemo(() => {
    const cats = { special: { total: 0, owned: 0 }, country: { total: 0, owned: 0 }, cocacola: { total: 0, owned: 0 } };
    for (const s of ALL_STICKERS) {
      cats[s.category].total++;
      const e = map[s.code];
      if (e && (e.status === "owned" || e.status === "duplicate")) cats[s.category].owned++;
    }
    return cats;
  }, [map]);

  return (
    <>
      <AppHeader title="Figurinhas Copa 2026" subtitle="USA · Canadá · México" />
      <main className="px-4 py-5 space-y-5">
        {/* Banner Copa 2026 com Taça */}
        <section className="relative rounded-3xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-500 p-1 shadow-2xl overflow-hidden">
          {/* Pattern de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
            }}></div>
          </div>
          
          <div className="relative rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-black tracking-tight">FIFA</span>
                  <span className="text-sm font-light opacity-90">World Cup™</span>
                </div>
                <h2 className="text-2xl font-black mb-2">2026</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">🇺🇸 USA</span>
                  <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">🇨🇦 Canadá</span>
                  <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">🇲🇽 México</span>
                </div>
              </div>
              
              {/* Taça oficial da FIFA */}
              <FIFATrophy size="md" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-5 text-primary-foreground shadow-lg">
          <p className="text-xs uppercase tracking-wider opacity-80">Progresso geral</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{stats.pct}%</span>
            <span className="opacity-90 text-sm">{stats.owned} / {stats.total}</span>
          </div>
          <div className="mt-3 h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${stats.pct}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/15 rounded-lg py-2 backdrop-blur">
              <div className="text-lg font-bold">{stats.owned}</div>
              <div className="text-[10px] opacity-90">Tenho ✓</div>
            </div>
            <div className="bg-white/15 rounded-lg py-2 backdrop-blur">
              <div className="text-lg font-bold">{stats.missing}</div>
              <div className="text-[10px] opacity-90">Faltam 📋</div>
            </div>
            <div className="bg-white/15 rounded-lg py-2 backdrop-blur">
              <div className="text-lg font-bold">{stats.duplicates}</div>
              <div className="text-[10px] opacity-90">Extras 🔄</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Categorias</h2>
          <div className="grid grid-cols-2 gap-3">
            <CategoryCard
              icon={<Sparkles className="w-5 h-5" />}
              label="Especiais / FWC"
              owned={byCategory.special.owned}
              total={byCategory.special.total}
              to="/album"
              search={{ category: "special" }}
            />
            <CategoryCard
              icon={<Flag className="w-5 h-5" />}
              label="Seleções"
              owned={byCategory.country.owned}
              total={byCategory.country.total}
              to="/album"
              search={{ category: "country" }}
            />
            <CategoryCard
              icon={<Wine className="w-5 h-5" />}
              label="Coca-Cola"
              owned={byCategory.cocacola.owned}
              total={byCategory.cocacola.total}
              to="/album"
              search={{ category: "cocacola" }}
            />
            <Link
              to="/album"
              className="group rounded-2xl border-2 border-border hover:border-primary bg-gradient-to-br from-card to-muted/30 p-4 flex flex-col gap-2 active:scale-95 transition-all shadow-sm hover:shadow-md"
            >
              <div className="p-2 w-fit rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-sm">Álbum Completo</span>
              <span className="text-xs text-muted-foreground">{TEAMS.length} seleções · {ALL_STICKERS.length} figurinhas</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link 
            to="/missing" 
            className="group rounded-2xl border-2 border-border hover:border-destructive bg-card p-4 flex items-center gap-3 active:scale-95 transition-all shadow-sm hover:shadow-md"
          >
            <div className="p-2 rounded-full bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
              <Search className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Faltantes</div>
              <div className="text-xs text-muted-foreground">{stats.missing} restantes</div>
            </div>
          </Link>
          <Link 
            to="/duplicates" 
            className="group rounded-2xl border-2 border-border hover:border-accent bg-card p-4 flex items-center gap-3 active:scale-95 transition-all shadow-sm hover:shadow-md"
          >
            <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Copy className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Repetidas</div>
              <div className="text-xs text-muted-foreground">{stats.duplicates} para troca</div>
            </div>
          </Link>
        </section>
      </main>
    </>
  );
}

function CategoryCard({ icon, label, owned, total, to, search }: any) {
  const pct = total ? Math.round((owned / total) * 100) : 0;
  return (
    <Link 
      to={to} 
      search={search} 
      className="group rounded-2xl border-2 border-border hover:border-primary bg-card p-4 flex flex-col gap-2 active:scale-95 transition-all shadow-sm hover:shadow-md"
    >
      <div className="text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs text-muted-foreground">
        <span className="font-bold text-foreground">{owned}</span> / {total}
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}
