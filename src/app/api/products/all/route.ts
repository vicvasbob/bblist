import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const products = await db.getProductsAllList();

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (_) {
    return new Response('Failed to fetch products', { status: 500 });
  }
}