import { useUserStickers } from "@/hooks/useUserStickers";

/**
 * Hook que usa a API para gerenciar figurinhas.
 * Requer autenticação - redireciona para login se não estiver autenticado.
 */
export function useStickers() {
  return useUserStickers();
}
