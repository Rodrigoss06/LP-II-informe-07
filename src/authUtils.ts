import jwt from 'jsonwebtoken';

export function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as { user_id: number };
    return decoded.user_id;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};
