# TILIL SMS Troubleshooting Guide

## Current Issue: "Invalid API Key" (Status Code 1013)

The TILIL API is returning error code `1013` which means "Invalid API Key". This indicates the API key is being rejected by TILIL's servers.

## Possible Causes

1. **API Key is Invalid/Expired**
   - The API key may have been revoked or expired
   - Verify with TILIL support that the key is active

2. **API Key Format Issue**
   - The API might expect a different format
   - Check if there are any special characters or encoding issues

3. **Account Issues**
   - Account may need activation
   - Account may have insufficient credits/balance
   - Account may be suspended

4. **API Endpoint or Version**
   - The endpoint URL might be incorrect
   - The API version might have changed

## Diagnostic Steps

### Step 1: Test API Directly

Use the test endpoint to try different authentication formats:

```bash
curl -X POST http://localhost:3000/api/test-tilil \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254746551520",
    "message": "Test message"
  }'
```

This will test 4 different authentication methods and show which (if any) works.

### Step 2: Check Server Logs

When placing an order, check the terminal output for:
- `=== TILIL SMS Request ===` - Shows what's being sent
- `=== TILIL SMS Response ===` - Shows the API response
- Error messages with status codes

### Step 3: Verify API Key

1. Log into your TILIL account dashboard
2. Verify the API key matches exactly what's in `.env.local`
3. Check if the API key has an expiration date
4. Verify the account has sufficient credits

### Step 4: Contact TILIL Support

If the API key appears correct, contact TILIL support with:
- Your API key (last 4 characters: `...kob1s`)
- The endpoint you're using: `https://api.tililtech.com/sms/v3/sendsms`
- The error code: `1013 - Invalid API Key`
- Request the correct API format/authentication method

## Alternative Solutions

### Option 1: Verify API Key Format
Some SMS providers require:
- API key in specific header format
- Base64 encoding
- Different field names

### Option 2: Check API Documentation
Review TILIL's official API documentation for:
- Correct endpoint URL
- Required request format
- Authentication method
- Field names and formats

### Option 3: Test with Postman/cURL
Test the API directly outside of the application:

```bash
curl -X POST https://api.tililtech.com/sms/v3/sendsms \
  -H "Content-Type: application/json" \
  -d '{
    "apikey": "YOUR_API_KEY",
    "shortcode": "SISCOM TECH",
    "mobile": "254746551520",
    "message": "Test message"
  }'
```

### Option 4: Check Account Status
- Log into TILIL dashboard
- Check account balance
- Verify shortcode is approved
- Check if account is active

## Next Steps

1. Run the diagnostic test endpoint
2. Review the results to see which format (if any) works
3. Update the SMS service based on working format
4. If none work, contact TILIL support with diagnostic results

## Current Configuration

- **API Key**: `dTn46V80hpQIMkef3NLDSiEZcCzatP9myugYq2BwH7GlOFrJARvXjWU5xKob1s`
- **Shortcode**: `SISCOM TECH`
- **Endpoint**: `https://api.tililtech.com/sms/v3/sendsms`
- **Error**: `1013 - Invalid API Key`
