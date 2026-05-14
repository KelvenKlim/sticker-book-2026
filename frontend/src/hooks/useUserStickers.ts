import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { StickerStatus } from "@/lib/stickers";

export interface UserStickerEntry {
  id: number;
  code: string;
  category: string;
  group: string;
  group_name: string;
  number: number;
  status: StickerStatus;
  duplicates: number;
}

export interface StickerUpdate {
  status: StickerStatus;
  duplicates: number;
}

export function useUserStickers() {
  const queryClient = useQueryClient();

  // Query para buscar todas as figurinhas do usuário
  const { data: userStickers = [], isLoading } = useQuery({
    queryKey: ["userStickers"],
    queryFn: async () => {
      try {
        const response = await apiService.getUserStickers();
        return response as UserStickerEntry[];
      } catch (error: any) {
        // Se não estiver autenticado, retorna array vazio
        if (error.response?.status === 401) {
          return [];
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });

  // Mutation para atualizar uma figurinha
  const updateMutation = useMutation({
    mutationFn: async ({ code, update }: { code: string; update: StickerUpdate }) => {
      return await apiService.updateUserSticker(code, update);
    },
    onSuccess: () => {
      // Invalida o cache para forçar refetch
      queryClient.invalidateQueries({ queryKey: ["userStickers"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });

  // Criar um map para acesso rápido
  const stickersMap = userStickers.reduce((acc, sticker) => {
    acc[sticker.code] = {
      status: sticker.status,
      duplicates: sticker.duplicates,
    };
    return acc;
  }, {} as Record<string, { status: StickerStatus; duplicates: number }>);

  // Funções auxiliares
  const get = (code: string) => {
    return stickersMap[code] || { status: "missing" as const, duplicates: 0 };
  };

  const setEntry = async (code: string, entry: { status: StickerStatus; duplicates: number }) => {
    await updateMutation.mutateAsync({ code, update: entry });
  };

  const cycle = async (code: string) => {
    const current = get(code);
    let newStatus: StickerStatus;
    let newDuplicates = 0;

    if (current.status === "missing") {
      newStatus = "owned";
    } else if (current.status === "owned") {
      newStatus = "duplicate";
      newDuplicates = 1;
    } else {
      newStatus = "missing";
    }

    await setEntry(code, { status: newStatus, duplicates: newDuplicates });
  };

  const addDuplicate = async (code: string) => {
    const current = get(code);
    const newDuplicates = (current.duplicates || 0) + 1;
    await setEntry(code, { status: "duplicate", duplicates: newDuplicates });
  };

  const removeDuplicate = async (code: string) => {
    const current = get(code);
    const newDuplicates = Math.max(0, (current.duplicates || 0) - 1);
    
    if (newDuplicates === 0) {
      await setEntry(code, { status: "owned", duplicates: 0 });
    } else {
      await setEntry(code, { status: "duplicate", duplicates: newDuplicates });
    }
  };

  const markOwned = async (code: string) => {
    await setEntry(code, { status: "owned", duplicates: 0 });
  };

  const clear = async (code: string) => {
    await setEntry(code, { status: "missing", duplicates: 0 });
  };

  return {
    map: stickersMap,
    get,
    setEntry,
    cycle,
    addDuplicate,
    removeDuplicate,
    markOwned,
    clear,
    isLoading,
  };
}
