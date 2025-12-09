import api from "@/lib/axios";

export type CreateShortLinkPayload = {
  destination: string;
  customAlias?: string;
  title?: string;
  maxClicks?: number;
};

export interface ShortLink {
  id: number;
  code: string;
  destination: string;
  customAlias?: string | null;
  title?: string | null;
  createdAt: Date;
  expiresAt?: Date | null;
  maxClicks?: number | null;
  clicks?: number | null;
  ownerId?: number | null;
}

export async function createShortLink(data: CreateShortLinkPayload) {
  const response = await api.post<{ data: ShortLink }>("/links", data);

  return response.data;
}
