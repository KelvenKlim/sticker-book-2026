interface Props {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function WorldCupLogo({ className = "", size = "md" }: Props) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <img 
        src="/assets/worldcup-2026-logo.png"
        alt="FIFA World Cup 2026"
        className="w-full h-full object-contain drop-shadow-xl"
        onError={(e) => {
          // Fallback para URL online se a imagem local não carregar
          const target = e.currentTarget;
          target.src = "https://digitalhub.fifa.com/transform/7189acb1-8453-4a14-8248-70ab7a76f372/FWC-26-Logo-for-Countdown?&io=transform:fill&quality=75";
          target.onerror = () => {
            // Fallback final para emoji
            target.style.display = 'none';
            const div = document.createElement('div');
            div.className = 'text-5xl flex items-center justify-center w-full h-full';
            div.innerHTML = '🏆';
            target.parentElement?.appendChild(div);
          };
        }}
      />
    </div>
  );
}

interface TrophyProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Componente para a taça/logo (mesmo componente, reutilizado)
export function FIFATrophy({ className = "", size = "md" }: TrophyProps) {
  const sizes = {
    sm: "w-12 h-16",
    md: "w-20 h-28",
    lg: "w-32 h-44",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <img 
        src="/assets/worldcup-2026-logo.png"
        alt="FIFA World Cup 2026"
        className="w-full h-full object-contain drop-shadow-2xl"
        onError={(e) => {
          // Fallback para URL online
          const target = e.currentTarget;
          target.src = "https://digitalhub.fifa.com/transform/7189acb1-8453-4a14-8248-70ab7a76f372/FWC-26-Logo-for-Countdown?&io=transform:fill&quality=75";
          target.onerror = () => {
            // Fallback final para emoji
            target.style.display = 'none';
            const div = document.createElement('div');
            div.className = 'text-6xl flex items-center justify-center w-full h-full';
            div.innerHTML = '🏆';
            target.parentElement?.appendChild(div);
          };
        }}
      />
      {/* Brilho dourado ao redor */}
      <div className="absolute -inset-4 bg-yellow-300/20 rounded-full blur-2xl animate-pulse"></div>
    </div>
  );
}
