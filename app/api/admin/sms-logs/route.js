import { NextResponse } from 'next/server';
import { dbAll } from '@/lib/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = 'SELECT * FROM sms_logs';
    const params = [];

    if (orderId) {
      query += ' WHERE order_id = ?';
      params.push(orderId);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const logs = await dbAll(query, params);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMS logs' },
      { status: 500 }
    );
  }
}
