/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  return !!token;
}

/**
 * Obtém o token de autenticação
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Remove o token de autenticação
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
}
