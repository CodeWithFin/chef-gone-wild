# SMS Debugging Guide

## Quick Debug Steps

### 1. Check Server Logs
When you place an order, check your terminal/console where `npm run dev` is running. You should see:
- "Starting SMS sending process..."
- "TILIL_API_KEY exists: true/false"
- "Sending SMS via TILIL: ..."
- "SMS API Response: ..." or error messages

### 2. Test SMS Endpoint
You can test SMS directly using this endpoint:

```bash
curl -X POST http://localhost:3000/api/test-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254758190230",
    "message": "Test message from Chef Gone Wild"
  }'
```

Or use a tool like Postman to send a POST request to:
- URL: `http://localhost:3000/api/test-sms`
- Body (JSON):
```json
{
  "phone": "+254758190230",
  "message": "Test message"
}
```

### 3. Check SMS Logs in Database
View SMS logs via API:
```bash
curl http://localhost:3000/api/admin/sms-logs
```

Or check the database directly:
```bash
sqlite3 chef_gone_wild.db "SELECT * FROM sms_logs ORDER BY created_at DESC LIMIT 10;"
```

### 4. Verify Environment Variables
Make sure `.env.local` exists and has:
- `TILIL_API_KEY` - Should be set
- `TILIL_SHORTCODE` - Should be "SISCOM TECH"
- `SMS_ENDPOINT` - Should be "https://api.tililtech.com/sms/v3/sendsms"
- `KITCHEN_PHONE_NUMBERS` - Should be "+254758190230"

**Important:** Restart the Next.js server after changing `.env.local`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 5. Common Issues

**Issue: Environment variables not loading**
- Make sure file is named `.env.local` (not `.env`)
- Restart the server after changes
- Check that variables don't have quotes around values

**Issue: API returns error**
- Check server logs for the exact error message
- Verify API key is correct
- Check if TILIL account has balance/credits
- Verify phone number format (should start with +)

**Issue: SMS sent but not received**
- Check SMS logs in database - status should be "sent"
- Verify phone number is correct
- Check if phone has signal/reception
- Some carriers may delay SMS delivery

### 6. Check TILIL API Response
The logs will show the API response. Common responses:
- Success: Should return a success status
- Error: Will show error details in logs

If you see errors, check:
- API key validity
- Account balance
- Phone number format
- API endpoint correctness
