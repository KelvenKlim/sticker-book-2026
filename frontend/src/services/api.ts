import axios from "axios";

// URL base da API - ajuste conforme necessário
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipos
export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Serviço de API
export const apiService = {
  // Autenticação
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>("/api/auth/register", data);
    return response.data;
  },

  async login(data: LoginData): Promise<Token> {
    const response = await api.post<Token>("/api/auth/login", data);
    const token = response.data;
    // Salvar token no localStorage
    localStorage.setItem("access_token", token.access_token);
    return token;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("access_token");
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/api/users/me");
    return response.data;
  },

  // Figurinhas
  async getStickers(): Promise<any[]> {
    const response = await api.get("/api/stickers");
    return response.data;
  },

  async getUserStickers(): Promise<any[]> {
    const response = await api.get("/api/users/me/stickers");
    return response.data;
  },

  async updateUserSticker(code: string, update: { status: string; duplicates: number }): Promise<any> {
    const response = await api.put(`/api/users/me/stickers/${code}`, update);
    return response.data;
  },

  async addSticker(stickerId: number, quantity: number = 1): Promise<any> {
    const response = await api.post("/api/users/me/stickers", {
      sticker_id: stickerId,
      quantity,
    });
    return response.data;
  },

  async updateStickerQuantity(
    stickerId: number,
    quantity: number
  ): Promise<any> {
    const response = await api.put(`/api/users/me/stickers/${stickerId}`, {
      quantity,
    });
    return response.data;
  },

  async removeSticker(stickerId: number): Promise<void> {
    await api.delete(`/api/users/me/stickers/${stickerId}`);
  },

  // Trocas
  async getTrades(): Promise<any[]> {
    const response = await api.get("/api/trades");
    return response.data;
  },

  async createTrade(data: any): Promise<any> {
    const response = await api.post("/api/trades", data);
    return response.data;
  },

  async acceptTrade(tradeId: number): Promise<any> {
    const response = await api.post(`/api/trades/${tradeId}/accept`);
    return response.data;
  },

  async rejectTrade(tradeId: number): Promise<any> {
    const response = await api.post(`/api/trades/${tradeId}/reject`);
    return response.data;
  },

  async cancelTrade(tradeId: number): Promise<void> {
    await api.delete(`/api/trades/${tradeId}`);
  },
};

export default api;
