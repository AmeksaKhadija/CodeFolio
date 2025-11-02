import { AuthenticationError } from "apollo-server-express";
import { verifyToken, JWTPayload } from "../utils/jwt";

export interface Context {
  user?: JWTPayload;
}

export const authenticate = (context: Context): JWTPayload => {
  if (!context.user) {
    throw new AuthenticationError("Non authentifié");
  }
  return context.user;
};

export const getUser = (token?: string): JWTPayload | null => {
  if (!token) return null;

  try {
    // Enlever "Bearer " si présent
    const cleanToken = token.replace("Bearer ", "");
    return verifyToken(cleanToken);
  } catch (error) {
    return null;
  }
};
