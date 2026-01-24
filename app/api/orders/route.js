import { NextResponse } from 'next/server';
import { dbGet, dbAll, dbRun, generateOrderNumber, logSMS } from '@/lib/utils';
import { sendSMS, generateCustomerSMS, generateKitchenSMS } from '@/lib/smsService';

const restaurantInfo = {
  name: process.env.RESTAURANT_NAME || 'Chef Gone Wild',
  phone: process.env.RESTAURANT_PHONE || '+254700000000',
  address: process.env.RESTAURANT_ADDRESS || '123 Culinary Ave, Nairobi, Kenya'
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, order_type, items, special_instructions } = body;

    // Validation
    if (!customer_name || !customer_phone || !order_type || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await dbGet('SELECT * FROM menu_items WHERE id = ? AND available = 1', [item.menu_item_id]);

      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menu_item_id} not found or unavailable` },
          { status: 400 }
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price,
        name: menuItem.name,
        special_instructions: item.special_instructions || null
      });
    }

    const orderNumber = generateOrderNumber();

    // Insert order
    const orderResult = await dbRun(
      'INSERT INTO orders (order_number, customer_name, customer_phone, order_type, special_instructions, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [orderNumber, customer_name, customer_phone, order_type, special_instructions || null, totalAmount]
    );

    const orderId = orderResult.lastID;

    // Insert order items
    const { getDatabase } = require('@/lib/database');
    const db = getDatabase();
    
    for (const item of orderItems) {
      await dbRun(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price, item.special_instructions]
      );
    }

    // Prepare order object for SMS
    const orderForSMS = {
      order_number: orderNumber,
      customer_name,
      customer_phone,
      order_type,
      special_instructions,
      total_amount: totalAmount,
      items: orderItems,
      created_at: new Date().toISOString()
    };

    // Send SMS notifications asynchronously (don't await to not block response)
    (async () => {
      try {
        console.log('\n========== SMS SENDING PROCESS STARTED ==========');
        console.log('Order ID:', orderId);
        console.log('Order Number:', orderNumber);
        
        // Send customer SMS
        const customerMessage = generateCustomerSMS(orderForSMS, restaurantInfo);
        console.log('\n--- Sending Customer SMS ---');
        console.log('To:', customer_phone);
        
        const customerSMSResult = await sendSMS(customer_phone, customerMessage);
        
        console.log('Customer SMS Result:', {
          success: customerSMSResult.success,
          statusCode: customerSMSResult.statusCode,
          error: customerSMSResult.error
        });
        
        await logSMS(
          orderId,
          customer_phone,
          customerMessage,
          customerSMSResult.success ? 'sent' : 'failed',
          customerSMSResult.success ? null : JSON.stringify({
            error: customerSMSResult.error,
            statusCode: customerSMSResult.statusCode,
            data: customerSMSResult.data
          })
        );

        // Send kitchen SMS to all configured numbers
        const kitchenPhones = (process.env.KITCHEN_PHONE_NUMBERS || '').split(',').map(p => p.trim()).filter(p => p);
        
        if (kitchenPhones.length === 0) {
          console.warn('⚠️  No kitchen phone numbers configured!');
        } else {
          console.log('\n--- Sending Kitchen SMS ---');
          console.log('Kitchen phones:', kitchenPhones);
          
          const kitchenMessage = generateKitchenSMS(orderForSMS, restaurantInfo);

          for (const kitchenPhone of kitchenPhones) {
            console.log('\nSending to kitchen:', kitchenPhone);
            const kitchenSMSResult = await sendSMS(kitchenPhone, kitchenMessage);
            
            console.log('Kitchen SMS Result:', {
              success: kitchenSMSResult.success,
              statusCode: kitchenSMSResult.statusCode,
              error: kitchenSMSResult.error
            });
            
            await logSMS(
              orderId,
              kitchenPhone,
              kitchenMessage,
              kitchenSMSResult.success ? 'sent' : 'failed',
              kitchenSMSResult.success ? null : JSON.stringify({
                error: kitchenSMSResult.error,
                statusCode: kitchenSMSResult.statusCode,
                data: kitchenSMSResult.data
              })
            );
          }
        }
        
        console.log('========== SMS SENDING PROCESS COMPLETED ==========\n');
      } catch (error) {
        console.error('❌ Error in SMS sending process:', error);
        console.error('Error stack:', error.stack);
      }
    })();

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'new'
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
