import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { TenantRole } from "../entities/UserTenant";

type TokenPayload = {
  userId: string;
  tenantId?: string;
  role?: TenantRole;
};

export const signToken = (payload: TokenPayload, expiresIn = "12h") => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};

