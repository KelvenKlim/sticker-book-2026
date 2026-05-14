import { useStickers } from "@/hooks/useStickers";
import type { Sticker } from "@/lib/stickers";
import { cn } from "@/lib/utils";
import { Plus, Minus, X } from "lucide-react";
import { memo } from "react";

interface Props {
  sticker: Sticker;
  onLongPress?: (s: Sticker) => void;
}

export const StickerCard = memo(function StickerCard({ sticker, onLongPress }: Props) {
  const { get, cycle, addDuplicate, removeDuplicate, clear } = useStickers();
  const entry = get(sticker.code);

  const handleMainClick = (e: React.MouseEvent) => {
    // Se for duplicada, não faz nada no click principal (usa os botões)
    if (entry.status === "duplicate") {
      return;
    }
    cycle(sticker.code);
  };

  const handleAddDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    addDuplicate(sticker.code);
  };

  const handleRemoveDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeDuplicate(sticker.code);
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.(sticker);
      }}
      className={cn(
        "relative aspect-[3/4] rounded-lg border-2 text-xs font-bold flex items-center justify-center transition-all select-none group",
        entry.status === "owned" &&
          "bg-[var(--owned)] text-[var(--owned-foreground)] border-[var(--owned)] shadow cursor-pointer active:scale-95",
        entry.status === "duplicate" &&
          "bg-[var(--duplicate)] text-[var(--duplicate-foreground)] border-[var(--duplicate)] shadow",
        entry.status === "missing" &&
          "bg-card text-muted-foreground border-dashed border-border hover:border-primary cursor-pointer active:scale-95"
      )}
      onClick={handleMainClick}
    >
      <span className="leading-tight text-center px-1">{sticker.code}</span>
      
      {/* Badge com quantidade de duplicadas */}
      {entry.status === "duplicate" && entry.duplicates > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold pointer-events-none">
          +{entry.duplicates}
        </span>
      )}
      
      {/* Check para owned */}
      {entry.status === "owned" && (
        <span className="absolute top-1 right-1 text-[10px]">✓</span>
      )}

      {/* Controles para adicionar/remover duplicadas */}
      {entry.status === "duplicate" && (
        <div className="absolute inset-0 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              clear(sticker.code);
            }}
            className="bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-lg transition-all hover:scale-110 active:scale-95"
            title="Remover completamente"
          >
            <X className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={handleRemoveDuplicate}
            className="bg-background/90 hover:bg-background text-foreground rounded-full p-0.5 shadow-lg transition-all hover:scale-110 active:scale-95"
            title="Remover 1 duplicada"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={handleAddDuplicate}
            className="bg-background/90 hover:bg-background text-foreground rounded-full p-0.5 shadow-lg transition-all hover:scale-110 active:scale-95"
            title="Adicionar duplicada"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* Botão para adicionar primeira duplicada quando está "owned" */}
      {entry.status === "owned" && (
        <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              clear(sticker.code);
            }}
            className="bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-0.5 shadow transition-all hover:scale-110 active:scale-95"
            title="Remover (marcar como não tenho)"
          >
            <X className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addDuplicate(sticker.code);
            }}
            className="bg-background/90 hover:bg-background text-foreground rounded-full p-0.5 shadow transition-all hover:scale-110 active:scale-95"
            title="Adicionar duplicada"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>
      )}
    </div>
  );
});
