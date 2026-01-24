const { getDatabase } = require('./database');

// Helper function to generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CGW${timestamp}${random}`;
}

// Helper function to log SMS
function logSMS(orderId, recipientPhone, message, status, errorMessage = null) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(
      'INSERT INTO sms_logs (order_id, recipient_phone, message, status, error_message) VALUES (?, ?, ?, ?, ?)',
      [orderId, recipientPhone, message, status, errorMessage],
      (err) => {
        if (err) {
          console.error('Error logging SMS:', err);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Promisify database query methods
function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

module.exports = {
  generateOrderNumber,
  logSMS,
  dbGet,
  dbAll,
  dbRun
};
