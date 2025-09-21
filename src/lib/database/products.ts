import { prisma } from '../prisma';
import { Product } from './types';
import { convertDbRowToProduct } from './types';

export const products = {
  async getProductsAllList(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { id: 'desc' },
        include: { user: true }
      });
      return products.map(convertDbRowToProduct);
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  async getProductsActivateList(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: { active: true },
        orderBy: { id: 'desc' },
        include: { user: true }
      });
      return products.map(convertDbRowToProduct);
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'reserved_by'>): Promise<Product> {
    try {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          url: productData.url,
          image_url: productData.image_url || '',
          active: productData.active,
          reserved_by: null
        }
      });
      return convertDbRowToProduct(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product> {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: updates
      });
      return convertDbRowToProduct(product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async deleteProduct(productId: number): Promise<Product> {
    try {
      const product = await prisma.product.delete({
        where: { id: productId }
      });
      return convertDbRowToProduct(product);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  },

  async reserveProduct(productId: number, userId: number): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      if (!product || product.reserved_by) {
        return null; // Product is already reserved or not found
      }
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { reserved_by: userId }
      });
      return convertDbRowToProduct(updatedProduct);
    } catch (error) {
      console.error('Error reserving product:', error);
      throw new Error('Failed to reserve product: ' + (error instanceof Error ? error.message : 'unknown error'));
    }
  }
};