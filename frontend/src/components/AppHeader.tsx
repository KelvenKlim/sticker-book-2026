import { memo } from "react";
import { UserProfile } from "@/components/UserProfile";

interface Props {
  title: string;
  subtitle?: string;
}

export const AppHeader = memo(function AppHeader({ title, subtitle }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground shadow-lg border-b-2 border-accent/30">
      <div className="mx-auto max-w-md px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo FIFA World Cup 2026 */}
          <div className="w-12 h-12 bg-white rounded-full p-1.5 shadow-lg flex items-center justify-center border-2 border-white/50">
            <img 
              src="/assets/worldcup-2026-logo.png"
              alt="FIFA World Cup 2026"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback para URL online
                const target = e.currentTarget;
                target.src = "https://digitalhub.fifa.com/transform/7189acb1-8453-4a14-8248-70ab7a76f372/FWC-26-Logo-for-Countdown?&io=transform:fill&quality=75";
                target.onerror = () => {
                  // Fallback final para emoji
                  target.style.display = 'none';
                  const span = document.createElement('span');
                  span.className = 'text-2xl';
                  span.innerHTML = '🏆';
                  target.parentElement?.appendChild(span);
                };
              }}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              {title}
            </h1>
            {subtitle && <p className="text-xs opacity-90 mt-0.5">{subtitle}</p>}
          </div>
          {/* Perfil do usuário */}
          <UserProfile />
        </div>
      </div>
      {/* Detalhe decorativo */}
      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"></div>
    </header>
  );
});
