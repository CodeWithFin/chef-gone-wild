import { NextResponse } from 'next/server';
import { dbAll } from '@/lib/utils';

export async function GET() {
  try {
    const rows = await dbAll('SELECT DISTINCT category FROM menu_items WHERE available = 1 ORDER BY category');
    const categories = rows.map(row => row.category);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
