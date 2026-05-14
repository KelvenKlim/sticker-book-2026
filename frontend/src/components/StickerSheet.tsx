import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStickers } from "@/hooks/useStickers";
import type { Sticker } from "@/lib/stickers";
import { Minus, Plus, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  sticker: Sticker | null;
  onClose: () => void;
}

export function StickerSheet({ sticker, onClose }: Props) {
  const { get, markOwned, addDuplicate, removeDuplicate, clear, setEntry } = useStickers();
  const [inputValue, setInputValue] = useState("");

  const entry = sticker ? get(sticker.code) : { status: "missing" as const, duplicates: 0 };

  // Atualizar input quando o sticker mudar
  useEffect(() => {
    if (sticker) {
      const currentEntry = get(sticker.code);
      setInputValue(currentEntry.duplicates?.toString() || "0");
    }
  }, [sticker?.code, get]);

  if (!sticker) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir apenas números
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue) || 0;
    const clampedNum = Math.max(0, Math.min(num, 999)); // Limitar entre 0 e 999
    
    if (clampedNum === 0) {
      // Se zero, marcar como owned
      markOwned(sticker.code);
    } else {
      // Se maior que zero, marcar como duplicate
      setEntry(sticker.code, { status: "duplicate", duplicates: clampedNum });
    }
    setInputValue(clampedNum.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <Sheet open={!!sticker} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-2xl">{sticker.code}</SheetTitle>
          <p className="text-sm text-muted-foreground">{sticker.groupName}</p>
        </SheetHeader>

        <div className="my-6 flex items-center justify-center">
          <div className="aspect-[3/4] w-32 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
            {sticker.code}
          </div>
        </div>

        <div className="space-y-3 pb-6">
          {/* Status da figurinha */}
          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="text-xs text-muted-foreground mb-2">Status atual</div>
            <div className="font-semibold">
              {entry.status === "missing" && "❌ Não tenho"}
              {entry.status === "owned" && "✅ Tenho"}
              {entry.status === "duplicate" && `🔄 Tenho + ${entry.duplicates} repetida${entry.duplicates > 1 ? "s" : ""}`}
            </div>
          </div>

          {/* Botões rápidos */}
          <div className="flex gap-2">
            <Button
              variant={entry.status === "owned" || entry.status === "duplicate" ? "default" : "outline"}
              className="flex-1"
              onClick={() => markOwned(sticker.code)}
            >
              <Check className="w-4 h-4 mr-1" /> Tenho
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => clear(sticker.code)}>
              <X className="w-4 h-4 mr-1" /> Não tenho
            </Button>
          </div>

          {/* Controle de duplicadas */}
          <div className="rounded-lg border p-4 bg-card">
            <div className="text-sm font-medium mb-3 text-center">Gerenciar Duplicadas</div>
            
            {/* Botões +/- */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => removeDuplicate(sticker.code)}
                disabled={!entry.duplicates}
                className="h-10 w-10"
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="text-3xl font-bold w-16 text-center">
                {entry.duplicates || 0}
              </div>
              <Button 
                size="icon" 
                onClick={() => addDuplicate(sticker.code)}
                className="h-10 w-10"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Input direto */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block text-center">
                ou digite a quantidade:
              </label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="text-center text-lg font-semibold"
                placeholder="0"
              />
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Quantidade de figurinhas extras que você tem para trocar
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
