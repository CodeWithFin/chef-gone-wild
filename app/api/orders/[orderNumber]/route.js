import { NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    const { orderNumber } = params;

    const order = await dbGet('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get order items
    const items = await dbAll(
      `SELECT oi.*, mi.name, mi.description, mi.image_url 
       FROM order_items oi 
       JOIN menu_items mi ON oi.menu_item_id = mi.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    return NextResponse.json({
      ...order,
      items: items
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
