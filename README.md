# Vercel Webhook SMTP Email Service

A serverless Node.js application that runs on Vercel to receive webhook requests and send emails via SMTP.

## Features

- 🚀 Serverless deployment on Vercel
- 📧 SMTP email sending using Nodemailer
- 🔒 Parameter validation and error handling
- 🌐 CORS support for cross-origin requests
- ⚡ Fast and scalable

## API Endpoint

### POST `/api/webhook`

Receives a webhook payload and sends an email using the provided SMTP configuration.

#### Required Parameters

All parameters must be included in the JSON request body:

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| `origin`  | string | SMTP username (sender email address) |
| `pass`    | string | SMTP password or app password        |
| `smtp`    | string | SMTP server hostname                 |
| `port`    | string | SMTP server port (usually 587 or 465)|
| `dest`    | string | Recipient email address              |
| `subject` | string | Email subject line                   |
| `body`    | string | Email body content (text or HTML)    |

#### Example Request

```bash
curl -X POST https://your-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "sender@gmail.com",
    "pass": "your-app-password",
    "smtp": "smtp.gmail.com",
    "port": "587",
    "dest": "recipient@example.com",
    "subject": "Test Email from Webhook",
    "body": "This is a test email sent via the webhook service."
  }'
```

#### Success Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<unique-message-id>",
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

#### Error Response

```json
{
  "error": "Missing required parameters",
  "missing": ["smtp", "port"],
  "required": ["origin", "pass", "smtp", "port", "dest", "subject", "body"]
}
```

## Deployment

### Prerequisites

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Deploy to Vercel

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy the project:
   ```bash
   vercel --prod
   ```

3. Your API will be available at: `https://your-project-name.vercel.app/api/webhook`

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Test locally at: `http://localhost:3000/api/webhook`

## SMTP Configuration Examples

### Gmail
```json
{
  "smtp": "smtp.gmail.com",
  "port": "587",
  "origin": "your-email@gmail.com",
  "pass": "your-app-password"
}
```

### Outlook/Hotmail
```json
{
  "smtp": "smtp-mail.outlook.com",
  "port": "587",
  "origin": "your-email@outlook.com",
  "pass": "your-password"
}
```

### Custom SMTP Server
```json
{
  "smtp": "mail.yourprovider.com",
  "port": "587",
  "origin": "your-email@yourprovider.com",
  "pass": "your-password"
}
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never expose SMTP credentials** in client-side code
2. Consider implementing **authentication/authorization** for production use
3. **Rate limiting** should be implemented to prevent abuse
4. Use **environment variables** for sensitive configuration when possible
5. Consider **IP whitelisting** for webhook sources

## Error Handling

The service handles the following error scenarios:

- Missing required parameters (400 Bad Request)
- Invalid SMTP configuration (500 Internal Server Error)
- Network/connection issues (500 Internal Server Error)
- Invalid email addresses (500 Internal Server Error)

## File Structure

```
├── api/
│   └── webhook.js          # Main API endpoint
├── package.json            # Dependencies and scripts
├── vercel.json            # Vercel configuration
└── README.md              # Documentation
```

## Dependencies

- **nodemailer**: ^6.9.7 - For sending emails via SMTP
- **vercel**: ^32.4.1 (dev) - For local development and deployment

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues or questions, please check the error responses from the API which include detailed error messages and timestamps.