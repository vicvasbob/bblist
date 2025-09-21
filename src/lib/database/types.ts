export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  active?: boolean;
  created_at?: Date;
  token?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  url: string;
  image_url: string;
  active: boolean;
  reserved_by: number | null;
  created_at: Date;
}

// Convertidores de tipos
export function convertDbRowToUser(row: User): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    is_admin: row.is_admin,
    active: row.active,
    created_at: row.created_at ? new Date(row.created_at) : undefined,
    token: row.token,
  };
}

export function convertDbRowToPartialUser(row: User): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: '',
    is_admin: row.is_admin,
    active: row.active,
    created_at: row.created_at ? new Date(row.created_at) : undefined,
    token: '',
  };
}

export function convertDbRowToProduct(row: Product): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    image_url: row.image_url,
    active: row.active,
    reserved_by: row.reserved_by,
    created_at: new Date(row.created_at),
  };
}