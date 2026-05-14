import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Search, Copy, ArrowLeftRight } from "lucide-react";
import { memo } from "react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/album", label: "Álbum", icon: BookOpen },
  { to: "/missing", label: "Faltam", icon: Search },
  { to: "/duplicates", label: "Repetidas", icon: Copy },
  { to: "/trades", label: "Trocas", icon: ArrowLeftRight },
] as const;

export const BottomNav = memo(function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-md grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium"
            >
              <Icon className="w-5 h-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});
