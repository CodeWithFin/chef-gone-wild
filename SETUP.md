# Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Create .env.local File
Create a `.env.local` file in the root directory with the following content:

```env
# TILIL SMS API Credentials
TILIL_API_KEY=dTn46V80hpQIMkef3NLDSiEZcCzatP9myugYq2BwH7GlOFrJARvXjWU5xKob1s
TILIL_SHORTCODE=SISCOM TECH
SMS_ENDPOINT=https://api.tililtech.com/sms/v3/sendsms

# Kitchen Phone Numbers (comma-separated)
KITCHEN_PHONE_NUMBERS=+254700000000,+254700000001

# Restaurant Information
RESTAURANT_NAME=Chef Gone Wild
RESTAURANT_PHONE=+254700000000
RESTAURANT_ADDRESS=123 Culinary Ave, Nairobi, Kenya

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important:** Update `KITCHEN_PHONE_NUMBERS` with actual kitchen staff phone numbers!

## Step 3: Run the Application

### Development Mode (with hot reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

## Step 4: Access the Application
- **Customer Interface**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Order Tracking**: http://localhost:3000/track

## First Run
On first run, the database will be automatically created and populated with sample menu items.

## Testing SMS
1. Place a test order from the customer interface
2. Check that SMS is sent to:
   - The customer's phone number
   - All kitchen phone numbers in `KITCHEN_PHONE_NUMBERS`
3. View SMS logs in the database if needed

## Troubleshooting

### Database Issues
If you need to reset the database:
```bash
rm chef_gone_wild.db
npm start
```

### SMS Not Working
1. Verify phone numbers are in international format (e.g., +254700000000)
2. Check TILIL API credentials
3. Review server logs for error messages
4. Check `sms_logs` table in database for delivery status
