import { prisma } from '../prisma';
import { User } from './types';
import { convertDbRowToUser, convertDbRowToPartialUser } from './types';
import { isPrismaError, hashString, generateRandomToken } from './utils';

export const users = {
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        orderBy: { created_at: 'desc' }
      });
      return users.map(convertDbRowToUser);
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error('Failed to fetch users: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async getUserByToken(token: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { token }
      });
      return user ? convertDbRowToUser(user) : null;
    } catch (error) {
      console.error('Error fetching user by token:', error);
      throw new Error('Failed to fetch user by token: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async getUsersById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      return user ? convertDbRowToPartialUser(user) : null;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw new Error('Failed to fetch user by id: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    try {
      const hash_password = await hashString(userData.password);
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hash_password,
          is_admin: userData.is_admin ?? false,
          token: userData.token ?? null
        }
      });
      return convertDbRowToUser(user);
    } catch (error) {
      console.error('Error creating user:', error);
      if (isPrismaError(error) && error.code === 'P2002') {
        throw new Error('A user with this email already exists');
      }
      throw new Error('Failed to create user: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updates
      });
      return user ? convertDbRowToUser(user) : null;
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        return null; // User not found
      }
      throw new Error('Failed to update user');
    }
  },

  async checkUserHasReservedProducts(userId: number): Promise<boolean> {
    try {
      const reservedProductsCount = await prisma.product.count({
        where: { reserved_by: userId }
      });
      return reservedProductsCount > 0;
    } catch (error) {
      console.error('Error checking user reserved products:', error);
      throw new Error('Failed to check user reserved products: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async deactivateUser(id: number): Promise<User | null> {
    try {
      // Verificar si tiene productos reservados
      const hasReservedProducts = await this.checkUserHasReservedProducts(id);
      if (hasReservedProducts) {
        throw new Error('Cannot deactivate user with reserved products');
      }

      const user = await prisma.user.update({
        where: { id },
        data: { active: false, token: null }
      });
      return user ? convertDbRowToUser(user) : null;
    } catch (error) {
      console.error('Error deactivating user:', error);
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw error; // Re-throw to preserve custom error messages
    }
  },

  async deleteUser(id: number): Promise<boolean> {
    try {
      // Verificar si tiene productos reservados
      const hasReservedProducts = await this.checkUserHasReservedProducts(id);
      if (hasReservedProducts) {
        throw new Error('Cannot delete user with reserved products');
      }

      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      if (isPrismaError(error) && error.code === 'P2025') {
        return false; // User not found
      }
      throw error; // Re-throw to preserve custom error messages
    }
  },

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const hash_password = await hashString(password);
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user || user.password !== hash_password) {
        throw new Error('Failed to log in user');
      }
      const new_token = await generateRandomToken(password);
      
      // Actualizar el usuario directamente con prisma en lugar de usar this
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { token: new_token }
      });
      return updatedUser ? convertDbRowToUser(updatedUser) : null;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw new Error('Failed to log in user: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  }
};