import { db } from './database/index';
import type { User, Product } from './database/types';
import { getUserByRequest, hashString, generateRandomToken } from './database/utils';

export { db, getUserByRequest, hashString, generateRandomToken };
export type { User, Product };