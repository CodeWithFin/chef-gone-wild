# Chef Gone Wild Ordering System

A streamlined ordering system built with Next.js that enables customers to place food orders and automatically notifies both customers and kitchen staff via SMS when orders are received.

## Features

- **Customer Ordering Interface**: Browse menu, add items to cart, and place orders
- **SMS Notifications**: Automatic SMS notifications to customers and kitchen staff via TILIL API
- **Admin Dashboard**: Kitchen staff can view and manage orders in real-time
- **Order Tracking**: Customers can track their order status using order number
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Next.js 14**: Built with the latest Next.js App Router

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TILIL API credentials

## Installation

1. Clone or navigate to the project directory:
```bash
cd chef-gone-wild
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```env
     TILIL_API_KEY=your_api_key
     TILIL_SHORTCODE=your_shortcode
     SMS_ENDPOINT=https://api.tililtech.com/sms/v3/sendsms
     KITCHEN_PHONE_NUMBERS=+254700000000,+254700000001
     RESTAURANT_NAME=Chef Gone Wild
     RESTAURANT_PHONE=+254700000000
     RESTAURANT_ADDRESS=123 Culinary Ave, Nairobi, Kenya
     ```
   - Update `KITCHEN_PHONE_NUMBERS` with actual kitchen staff phone numbers

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The application will start on `http://localhost:3000`.

## Usage

### Customer Interface
- Visit `http://localhost:3000` to browse the menu and place orders
- Add items to cart and proceed to checkout
- Enter customer details (name, phone, order type)
- Receive SMS confirmation with order number
- Track order status at `http://localhost:3000/track`

### Admin Dashboard
- Visit `http://localhost:3000/admin` to view all orders
- Filter orders by status (New, Preparing, Ready, Completed)
- Click on any order to view details
- Update order status as it progresses

### Order Tracking
- Visit `http://localhost:3000/track`
- Enter order number to view order status and details
- Or use direct link: `http://localhost:3000/track?order=CGW12345678`

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu?category=Entree` - Get menu items by category
- `GET /api/menu/categories` - Get all menu categories

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderNumber` - Get order by order number
- `GET /api/admin/orders` - Get all orders (for admin)
- `GET /api/admin/orders?status=new` - Get orders by status
- `PATCH /api/admin/orders/:orderId/status` - Update order status

## Database Schema

The application uses SQLite with the following tables:
- `menu_items` - Menu items with categories and pricing
- `orders` - Customer orders
- `order_items` - Items in each order
- `sms_logs` - SMS notification logs

## SMS Integration

The system uses TILIL API for SMS notifications:
- Customer receives confirmation SMS upon order placement
- Kitchen staff receive notification SMS for new orders
- All SMS transactions are logged in the database

### SMS Templates

**Customer SMS:**
```
Chef Gone Wild - Order Confirmed!
Order #[NUMBER]
[ITEMS]
Total: KSh [AMOUNT]
Ready in: 30-45 minutes
[PICKUP/DELIVERY] order
Questions? Call [RESTAURANT_PHONE]
```

**Kitchen SMS:**
```
NEW ORDER #[NUMBER]
Customer: [NAME] - [PHONE]
[ITEMS WITH QUANTITIES]
Special Instructions: [NOTES]
[PICKUP/DELIVERY]
Time: [TIMESTAMP]
```

## Configuration

### Environment Variables

- `TILIL_API_KEY` - TILIL API key
- `TILIL_SHORTCODE` - TILIL shortcode
- `SMS_ENDPOINT` - TILIL SMS endpoint URL
- `KITCHEN_PHONE_NUMBERS` - Comma-separated kitchen phone numbers
- `RESTAURANT_NAME` - Restaurant name
- `RESTAURANT_PHONE` - Restaurant phone number
- `RESTAURANT_ADDRESS` - Restaurant address
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
chef-gone-wild/
├── app/
│   ├── api/            # Next.js API routes
│   │   ├── menu/       # Menu API endpoints
│   │   ├── orders/     # Order API endpoints
│   │   └── admin/      # Admin API endpoints
│   ├── admin/          # Admin dashboard page
│   ├── track/          # Order tracking page
│   ├── layout.js       # Root layout
│   ├── page.js         # Home/ordering page
│   └── globals.css     # Global styles
├── lib/
│   ├── database.js     # Database setup and utilities
│   ├── smsService.js   # SMS service with TILIL integration
│   └── utils.js        # Helper functions
├── package.json        # Dependencies and scripts
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── .env.local          # Environment variables (not in git)
└── README.md           # This file
```

## Sample Menu Items

The database is automatically populated with sample menu items on first run:
- Truffle Roast Chicken
- Grilled Beef Steak
- The Smoky Old Fashioned
- Hibiscus Sour
- Caesar Salad
- Chocolate Lava Cake
- Margherita Pizza
- Fish Tacos

## Troubleshooting

### SMS Not Sending
- Verify TILIL credentials in `.env`
- Check phone number format (should start with +)
- Review SMS logs in database: `sms_logs` table
- Check TILIL API status

### Database Issues
- Delete `chef_gone_wild.db` to reset database
- Restart server to reinitialize tables

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

## Future Enhancements

- Customer accounts and order history
- Online payment processing
- Delivery tracking with GPS
- Push notifications as alternative to SMS
- Multi-language support
- Analytics and reporting dashboard

## License

ISC

## Support

For issues or questions, please contact the development team.
# chef-gone-wild
