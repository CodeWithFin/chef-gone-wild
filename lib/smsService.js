const axios = require('axios');

/**
 * Send SMS using TILIL API
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} - Response from SMS API
 */
async function sendSMS(phoneNumber, message) {
  try {
    const TILIL_API_KEY = process.env.TILIL_API_KEY;
    const TILIL_SHORTCODE = process.env.TILIL_SHORTCODE;
    const SMS_ENDPOINT = process.env.SMS_ENDPOINT;

    // Check if required environment variables are set
    if (!TILIL_API_KEY || !TILIL_SHORTCODE || !SMS_ENDPOINT) {
      console.error('Missing SMS configuration:', {
        hasApiKey: !!TILIL_API_KEY,
        hasShortcode: !!TILIL_SHORTCODE,
        hasEndpoint: !!SMS_ENDPOINT
      });
      return {
        success: false,
        error: 'SMS configuration missing',
        phoneNumber: phoneNumber
      };
    }

    // Format phone number - TILIL expects format without +, just country code + number
    // Remove + and leading 0, ensure it starts with country code
    let formattedPhone = phoneNumber.replace(/^\+/, '').trim();
    
    // If starts with 0, replace with 254 (Kenya)
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    
    // If doesn't start with country code, add 254
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    console.log('=== TILIL SMS Request ===');
    console.log('Endpoint:', SMS_ENDPOINT);
    console.log('Phone (original):', phoneNumber);
    console.log('Phone (formatted):', formattedPhone);
    console.log('Shortcode:', TILIL_SHORTCODE);
    console.log('Message length:', message.length);
    console.log('API Key (last 4):', TILIL_API_KEY ? '***' + TILIL_API_KEY.slice(-4) : 'MISSING');

    // TILIL API v3 format - try different possible formats
    const requestBody = {
      apikey: TILIL_API_KEY.trim(),
      shortcode: TILIL_SHORTCODE.trim(),
      mobile: formattedPhone,
      message: message.trim()
    };

    console.log('Request body (without API key):', {
      ...requestBody,
      apikey: '***HIDDEN***'
    });

    // Try TILIL API - attempt with API key in body first
    // If that fails with 1013 (Invalid API Key), try alternative formats
    let response;
    let apiKeyError = false;
    
    try {
      response = await axios.post(
        SMS_ENDPOINT.trim(),
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000,
          validateStatus: function (status) {
            return status < 500; // Accept any status < 500 to see the response
          }
        }
      );

      // Check if response contains invalid API key error (even if HTTP 200)
      if (Array.isArray(response.data) && response.data[0]?.status_code === '1013') {
        apiKeyError = true;
        throw new Error('Invalid API Key - trying alternative format');
      }
    } catch (error) {
      if (apiKeyError || error.message.includes('Invalid API Key')) {
        // Try Format 2: API key in header
        console.log('⚠️  Format 1 failed (Invalid API Key), trying Format 2: API key in header...');
        try {
          response = await axios.post(
            SMS_ENDPOINT.trim(),
            {
              shortcode: TILIL_SHORTCODE.trim(),
              mobile: formattedPhone,
              message: message.trim()
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'apikey': TILIL_API_KEY.trim(),
                'X-API-Key': TILIL_API_KEY.trim()
              },
              timeout: 30000,
              validateStatus: function (status) {
                return status < 500;
              }
            }
          );

          // Check response again
          if (Array.isArray(response.data) && response.data[0]?.status_code === '1013') {
            throw new Error('Invalid API Key - Format 2 also failed');
          }
        } catch (error2) {
          // Try Format 3: API key as query parameter
          console.log('⚠️  Format 2 failed, trying Format 3: API key as query parameter...');
          try {
            const urlWithKey = `${SMS_ENDPOINT.trim()}?apikey=${encodeURIComponent(TILIL_API_KEY.trim())}`;
            response = await axios.post(
              urlWithKey,
              {
                shortcode: TILIL_SHORTCODE.trim(),
                mobile: formattedPhone,
                message: message.trim()
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                timeout: 30000,
                validateStatus: function (status) {
                  return status < 500;
                }
              }
            );
          } catch (error3) {
            // All formats failed - return the original error response
            console.error('❌ All API key formats failed. The API key may be invalid or expired.');
            throw error;
          }
        }
      } else {
        // Non-API-key error, rethrow
        throw error;
      }
    }

    console.log('=== TILIL SMS Response ===');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    // Check response format - TILIL returns array with status
    if (Array.isArray(response.data) && response.data.length > 0) {
      const result = response.data[0];
      
      // Check status codes
      // 200 or 1000 = success
      // 1013 = Invalid API Key
      // Other codes = various errors
      if (result.status_code === '200' || result.status_code === '1000') {
        return {
          success: true,
          data: response.data,
          phoneNumber: formattedPhone,
          messageId: result.message_id
        };
      } else {
        // API returned an error
        console.error('TILIL API Error Response:', result);
        return {
          success: false,
          error: result.status_desc || 'SMS sending failed',
          statusCode: result.status_code,
          phoneNumber: formattedPhone,
          data: result
        };
      }
    } else if (response.data && response.data.status_code) {
      // Single object response
      const result = response.data;
      if (result.status_code === '200' || result.status_code === '1000') {
        return {
          success: true,
          data: response.data,
          phoneNumber: formattedPhone
        };
      } else {
        return {
          success: false,
          error: result.status_desc || 'SMS sending failed',
          statusCode: result.status_code,
          phoneNumber: formattedPhone
        };
      }
    } else {
      // Unexpected response format
      console.warn('Unexpected TILIL response format:', response.data);
      return {
        success: false,
        error: 'Unexpected API response format',
        phoneNumber: formattedPhone,
        data: response.data
      };
    }
  } catch (error) {
    console.error('=== SMS Sending Exception ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Request config:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data ? {
        ...JSON.parse(error.config.data),
        apikey: '***HIDDEN***'
      } : null
    });

    return {
      success: false,
      error: error.response?.data || error.message,
      phoneNumber: phoneNumber,
      statusCode: error.response?.status
    };
  }
}

/**
 * Generate customer order confirmation SMS
 */
function generateCustomerSMS(order, restaurantInfo) {
  const items = order.items.map(item => 
    `${item.quantity}x ${item.name}`
  ).join('\n');

  const tableNumber = order.order_type.replace('table-', 'Table ');
  
  return `Chef Gone Wild - Order Confirmed!
Order #${order.order_number}

${items}

Total: KSh ${order.total_amount.toFixed(2)}
Ready in: 30-45 minutes
${tableNumber}

Questions? Call ${restaurantInfo.phone}`;
}

/**
 * Generate kitchen order notification SMS
 */
function generateKitchenSMS(order, restaurantInfo) {
  const items = order.items.map(item => {
    let itemText = `${item.quantity}x ${item.name}`;
    if (item.special_instructions) {
      itemText += ` (${item.special_instructions})`;
    }
    return itemText;
  }).join('\n');

  const timestamp = new Date(order.created_at).toLocaleString('en-KE', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  const tableNumber = order.order_type.replace('table-', 'Table ');
  
  return `NEW ORDER #${order.order_number}
Customer: ${order.customer_name} - ${order.customer_phone}

${items}

${order.special_instructions ? `Special Instructions: ${order.special_instructions}\n` : ''}${tableNumber.toUpperCase()}
Time: ${timestamp}`;
}

module.exports = {
  sendSMS,
  generateCustomerSMS,
  generateKitchenSMS
};
