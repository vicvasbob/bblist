import { NextRequest } from 'next/server';

// Type guard para errores de Prisma
export function isPrismaError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export async function hashString(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(length = 5) {
  const hexChars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return result;
}

export async function generateRandomToken(prev_string: string) {
  const hex = randomHex(5);
  const token = await hashString(hex + prev_string);
  return token;
}

// Esta función se moverá más tarde al módulo de autenticación si crece
export async function getUserByRequest(request: NextRequest) {
  const authStr = request.headers.get('Authorization') || 'Bearer ';
  console.log('Authorization header received:', authStr);
  
  const token = authStr.split('Bearer ')[1];
  console.log('Token extracted:', token ? 'Present' : 'Missing');
  console.log('Token length:', token ? token.length : 0);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

  if (!token || token.length < 10) {
    console.log('No valid token provided');
    throw new Error('No token provided');
  }

  try {
    const { users } = await import('./users');
    const user = await users.getUserByToken(token);
    console.log('User found by token:', user ? 'Yes' : 'No');
    
    if (!user || !user.id) {
      console.log('Token provided not valid - no user found for token');
      throw new Error('Token provided not valid');
    }
    
    console.log('User authenticated:', user.name, 'Admin:', user.is_admin);
    return user;
  } catch (error) {
    console.log('Error in getUserByRequest:', error);
    throw error;
  }
}