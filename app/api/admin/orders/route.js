import { NextResponse } from 'next/server';
import { dbAll } from '@/lib/utils';
import { getDatabase } from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT 100';

    const orders = await dbAll(query, params);

    // Get items for each order
    const orderPromises = orders.map(async (order) => {
      const items = await dbAll(
        `SELECT oi.*, mi.name, mi.description 
         FROM order_items oi 
         JOIN menu_items mi ON oi.menu_item_id = mi.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, items: items };
    });

    const ordersWithItems = await Promise.all(orderPromises);
    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
