import jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  type?: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (payload: Omit<JWTPayload, 'type'>): string => {
  return jwt.sign(
    { ...payload, type: 'access' },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
};

export const generateRefreshToken = (payload: Omit<JWTPayload, 'type'>): string => {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
};

export const generateTokenPair = (payload: Omit<JWTPayload, 'type'>): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
  if (decoded.type !== 'access') {
    throw new Error('Token invalide');
  }
  return decoded;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JWTPayload;
  if (decoded.type !== 'refresh') {
    throw new Error('Refresh token invalide');
  }
  return decoded;
};

// Fonction de compatibilité
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
