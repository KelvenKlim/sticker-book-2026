interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WorldCupTrophy({ className = "", size = "md" }: Props) {
  const sizes = {
    sm: "w-12 h-16",
    md: "w-20 h-24",
    lg: "w-32 h-40",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Taça */}
      <div className="absolute inset-0 flex flex-col items-center justify-end">
        {/* Topo da taça (Copa) */}
        <div className="w-full h-[50%] bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 rounded-t-3xl border-2 border-yellow-500 shadow-2xl relative overflow-hidden">
          {/* Brilho metálico */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10"></div>
          
          {/* Detalhes da taça */}
          <div className="absolute top-[25%] left-0 right-0 h-[2px] bg-yellow-600/40"></div>
          <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-yellow-600/40"></div>
          
          {/* Reflexo */}
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[20%] bg-white/50 rounded-full blur-sm"></div>
        </div>
        
        {/* Pescoço da taça */}
        <div className="w-[75%] h-[15%] bg-gradient-to-b from-yellow-400 to-yellow-500 border-x-2 border-yellow-600"></div>
        
        {/* Base da taça */}
        <div className="w-[85%] h-[10%] bg-gradient-to-b from-yellow-500 to-yellow-600 border-2 border-yellow-600"></div>
        <div className="w-[95%] h-[8%] bg-gradient-to-b from-yellow-600 to-amber-700 rounded-b-xl border-2 border-amber-800 shadow-lg"></div>
      </div>
      
      {/* Brilho ao redor (aura dourada) */}
      <div className="absolute -inset-3 bg-yellow-300/20 rounded-full blur-2xl animate-pulse"></div>
    </div>
  );
}
