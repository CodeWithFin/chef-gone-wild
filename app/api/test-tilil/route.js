import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    const TILIL_API_KEY = process.env.TILIL_API_KEY;
    const TILIL_SHORTCODE = process.env.TILIL_SHORTCODE;
    const SMS_ENDPOINT = process.env.SMS_ENDPOINT;

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone and message are required' },
        { status: 400 }
      );
    }

    // Format phone
    let formattedPhone = phone.replace(/^\+/, '').trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const results = [];

    // Test 1: Standard format (apikey in body)
    try {
      console.log('\n=== TEST 1: API Key in Body ===');
      const response1 = await axios.post(
        SMS_ENDPOINT,
        {
          apikey: TILIL_API_KEY,
          shortcode: TILIL_SHORTCODE,
          mobile: formattedPhone,
          message: message
        },
        {
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true
        }
      );
      results.push({
        test: 'API Key in Body',
        status: response1.status,
        data: response1.data,
        success: Array.isArray(response1.data) 
          ? response1.data[0]?.status_code === '200' || response1.data[0]?.status_code === '1000'
          : false
      });
    } catch (e) {
      results.push({
        test: 'API Key in Body',
        error: e.message,
        success: false
      });
    }

    // Test 2: API Key in Header
    try {
      console.log('\n=== TEST 2: API Key in Header ===');
      const response2 = await axios.post(
        SMS_ENDPOINT,
        {
          shortcode: TILIL_SHORTCODE,
          mobile: formattedPhone,
          message: message
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': TILIL_API_KEY,
            'X-API-Key': TILIL_API_KEY
          },
          validateStatus: () => true
        }
      );
      results.push({
        test: 'API Key in Header',
        status: response2.status,
        data: response2.data,
        success: Array.isArray(response2.data) 
          ? response2.data[0]?.status_code === '200' || response2.data[0]?.status_code === '1000'
          : false
      });
    } catch (e) {
      results.push({
        test: 'API Key in Header',
        error: e.message,
        success: false
      });
    }

    // Test 3: API Key as Query Parameter
    try {
      console.log('\n=== TEST 3: API Key as Query Parameter ===');
      const url = `${SMS_ENDPOINT}?apikey=${encodeURIComponent(TILIL_API_KEY)}`;
      const response3 = await axios.post(
        url,
        {
          shortcode: TILIL_SHORTCODE,
          mobile: formattedPhone,
          message: message
        },
        {
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true
        }
      );
      results.push({
        test: 'API Key as Query Parameter',
        status: response3.status,
        data: response3.data,
        success: Array.isArray(response3.data) 
          ? response3.data[0]?.status_code === '200' || response3.data[0]?.status_code === '1000'
          : false
      });
    } catch (e) {
      results.push({
        test: 'API Key as Query Parameter',
        error: e.message,
        success: false
      });
    }

    // Test 4: Different field names
    try {
      console.log('\n=== TEST 4: Alternative Field Names ===');
      const response4 = await axios.post(
        SMS_ENDPOINT,
        {
          api_key: TILIL_API_KEY,
          shortcode: TILIL_SHORTCODE,
          mobile: formattedPhone,
          message: message
        },
        {
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true
        }
      );
      results.push({
        test: 'Alternative Field Names (api_key)',
        status: response4.status,
        data: response4.data,
        success: Array.isArray(response4.data) 
          ? response4.data[0]?.status_code === '200' || response4.data[0]?.status_code === '1000'
          : false
      });
    } catch (e) {
      results.push({
        test: 'Alternative Field Names',
        error: e.message,
        success: false
      });
    }

    return NextResponse.json({
      phone: formattedPhone,
      originalPhone: phone,
      config: {
        hasApiKey: !!TILIL_API_KEY,
        apiKeyLength: TILIL_API_KEY?.length,
        apiKeyLast4: TILIL_API_KEY ? '***' + TILIL_API_KEY.slice(-4) : 'missing',
        shortcode: TILIL_SHORTCODE,
        endpoint: SMS_ENDPOINT
      },
      results: results,
      summary: {
        totalTests: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
