export type { User, Product } from './types';
export { convertDbRowToUser, convertDbRowToPartialUser, convertDbRowToProduct } from './types';
export { isPrismaError, hashString, generateRandomToken, getUserByRequest } from './utils';

import { users } from './users';
import { products } from './products';

// Combinar users y products en un solo objeto db
export const db = {
  // User operations
  getAllUsers: users.getAllUsers,
  getUserByToken: users.getUserByToken,
  getUsersById: users.getUsersById,
  createUser: users.createUser,
  updateUser: users.updateUser,
  deleteUser: users.deleteUser,
  loginUser: users.loginUser,

  // Product operations
  getProductsAllList: products.getProductsAllList,
  getProductsActivateList: products.getProductsActivateList,
  createProduct: products.createProduct,
  updateProduct: products.updateProduct,
  deleteProduct: products.deleteProduct,
  reserveProduct: products.reserveProduct
};