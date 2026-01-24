const axios = require('axios');

const TILIL_API_KEY = process.env.TILIL_API_KEY;
const TILIL_SHORTCODE = process.env.TILIL_SHORTCODE;
const SMS_ENDPOINT = process.env.SMS_ENDPOINT;

/**
 * Send SMS using TILIL API
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} - Response from SMS API
 */
async function sendSMS(phoneNumber, message) {
  try {
    // Format phone number (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    const response = await axios.post(
      SMS_ENDPOINT,
      {
        apikey: TILIL_API_KEY,
        shortcode: TILIL_SHORTCODE,
        mobile: formattedPhone,
        message: message
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return {
      success: true,
      data: response.data,
      phoneNumber: formattedPhone
    };
  } catch (error) {
    console.error('SMS sending error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
      phoneNumber: phoneNumber
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

  return `Chef Gone Wild - Order Confirmed!
Order #${order.order_number}

${items}

Total: KSh ${order.total_amount.toFixed(2)}
Ready in: 30-45 minutes
${order.order_type === 'pickup' ? 'Pickup' : 'Delivery'} order

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

  return `NEW ORDER #${order.order_number}
Customer: ${order.customer_name} - ${order.customer_phone}

${items}

${order.special_instructions ? `Special Instructions: ${order.special_instructions}\n` : ''}${order.order_type.toUpperCase()}
Time: ${timestamp}`;
}

module.exports = {
  sendSMS,
  generateCustomerSMS,
  generateKitchenSMS
};
