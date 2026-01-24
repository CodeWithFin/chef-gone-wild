import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/smsService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    console.log('Test SMS request:', { phone, message });
    console.log('Environment check:', {
      hasApiKey: !!process.env.TILIL_API_KEY,
      hasShortcode: !!process.env.TILIL_SHORTCODE,
      hasEndpoint: !!process.env.SMS_ENDPOINT,
      apiKey: process.env.TILIL_API_KEY ? '***' + process.env.TILIL_API_KEY.slice(-4) : 'missing',
      shortcode: process.env.TILIL_SHORTCODE,
      endpoint: process.env.SMS_ENDPOINT
    });

    const result = await sendSMS(phone, message);

    return NextResponse.json({
      success: result.success,
      result: result,
      debug: {
        phone: result.phoneNumber,
        error: result.error
      }
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
