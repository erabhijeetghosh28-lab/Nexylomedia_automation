import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { env } from "../config/env";
import { TenantRole } from "../entities/UserTenant";

export type TokenPayload = {
  userId: string;
  tenantId?: string | null;
  role?: TenantRole;
  scopes?: string[];
  iat?: number;
  exp?: number;
};

const secret: Secret = env.jwtSecret;

export const signToken = (
  payload: TokenPayload,
  expiresIn = "12h",
): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, secret) as TokenPayload;
};

