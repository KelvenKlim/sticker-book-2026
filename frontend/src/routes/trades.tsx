import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ALL_STICKERS } from "@/lib/stickers";
import { useStickers } from "@/hooks/useStickers";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/trades")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Trocas — Controle de Figurinhas 2026" },
      { name: "description", content: "Suas listas de troca: tenho repetidas e procuro." },
    ],
  }),
  component: TradesPage,
});

function TradesPage() {
  const { map } = useStickers();
  const [copied, setCopied] = useState(false);

  const dups = useMemo(
    () =>
      ALL_STICKERS.filter((s) => map[s.code]?.status === "duplicate").map((s) => ({
        code: s.code,
        qty: map[s.code]?.duplicates || 1,
      })),
    [map]
  );

  const missing = useMemo(
    () =>
      ALL_STICKERS.filter((s) => (map[s.code]?.status ?? "missing") === "missing").map(
        (s) => s.code
      ),
    [map]
  );

  const copy = async () => {
    const have = dups.map((d) => (d.qty > 1 ? `${d.code} (x${d.qty})` : d.code)).join(", ");
    const need = missing.join(", ");
    const text = `Tenho para troca: ${have || "—"}\n\nProcuro: ${need || "—"}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <AppHeader title="Trocas" subtitle="Mostre essa tela na hora da troca" />
      <main className="px-4 py-4 space-y-4">
        <Button onClick={copy} className="w-full" size="lg">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copiado!" : "Copiar resumo"}
        </Button>

        <section className="rounded-2xl border bg-card p-4">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--duplicate)]" />
            Tenho para troca
            <span className="ml-auto text-xs text-muted-foreground">{dups.length}</span>
          </h2>
          {dups.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-3">Nenhuma repetida marcada.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {dups.map((d) => (
                <span
                  key={d.code}
                  className="rounded-md bg-[var(--duplicate)] text-[var(--duplicate-foreground)] px-2 py-1 text-xs font-bold"
                >
                  {d.code}
                  {d.qty > 1 && <span className="opacity-70 ml-1">×{d.qty}</span>}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Procuro
            <span className="ml-auto text-xs text-muted-foreground">{missing.length}</span>
          </h2>
          {missing.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-3">Álbum completo! 🏆</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {missing.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-dashed px-2 py-1 text-xs font-semibold text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
