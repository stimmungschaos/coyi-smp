export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface WhitelistEntry {
  id: number;
  minecraft_name: string;
  discord_name: string;
  created_at: string;
}

export interface GrieflistEntry {
  id: number;
  minecraft_name: string;
  consents: Consents;
  last_updated: string;
}

export interface Consents {
  pvp: boolean;
  griefing: boolean;
  stealing: boolean;
  trapping: boolean;
  petKilling: boolean;
  nothingAllowed: boolean;
} 