export interface TokenResponse {
  accessToken: string;
  accessExpiresIn?: number | string;
  refreshToken: string;
  refreshExpiresIn?: number | string;
}

export interface TokenPayload {
  id: number;
  email: string;
}

export type JwtPayload = {
  email: string;
  id?: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
