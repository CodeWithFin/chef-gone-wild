const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db = null;

function getDatabase() {
  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'chef_gone_wild.db');
  db = new sqlite3.Database(dbPath);

  // Initialize database tables
  db.serialize(() => {
    // Menu items table
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      available BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      order_type TEXT NOT NULL,
      special_instructions TEXT,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      special_instructions TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )`);

    // SMS logs table
    db.run(`CREATE TABLE IF NOT EXISTS sms_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      recipient_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )`);

    // Insert sample menu items if table is empty
    db.get('SELECT COUNT(*) as count FROM menu_items', (err, row) => {
      if (err) {
        console.error('Error checking menu items:', err);
        return;
      }
      
      if (row && row.count === 0) {
        const sampleItems = [
          ['Truffle Roast Chicken', 'Wild mushroom, thyme jus, mash', 1850, 'Entree', 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg'],
          ['Grilled Beef Steak', 'Premium cut with roasted vegetables', 2200, 'Entree', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800'],
          ['The Smoky Old Fashioned', 'Bourbon, maple, hickory smoke', 1450, 'Cocktails', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'],
          ['Hibiscus Sour', 'Gin, egg white, hibiscus syrup', 1200, 'Cocktails', 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp'],
          ['Caesar Salad', 'Fresh romaine, parmesan, croutons', 850, 'Salads', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800'],
          ['Chocolate Lava Cake', 'Warm chocolate cake with vanilla ice cream', 950, 'Desserts', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800'],
          ['Margherita Pizza', 'Fresh mozzarella, basil, tomato sauce', 1200, 'Mains', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800'],
          ['Fish Tacos', 'Grilled fish, slaw, chipotle aioli', 1100, 'Mains', 'https://images.unsplash.com/photo-1565299585323-38174c2b8c0a?w=800']
        ];

        const stmt = db.prepare('INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)');
        sampleItems.forEach(item => {
          stmt.run(item);
        });
        stmt.finalize();
        console.log('Sample menu items inserted');
      }
    });
  });

  return db;
}

// Promisify database methods
function promisify(method) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      method.apply(db, [...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }]);
    });
  };
}

module.exports = { getDatabase };
