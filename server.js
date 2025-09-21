import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Helper function to validate required parameters
function validateParameters(body) {
  const required = ['origin', 'pass', 'smtp', 'port', 'dest', 'subject', 'body'];
  const missing = required.filter(param => !body[param]);
  
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  
  return { valid: true };
}

// Helper function to send email
async function sendEmail(emailConfig) {
  const { origin, pass, smtp, port, dest, subject, body } = emailConfig;
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtp,
    port: parseInt(port),
    secure: parseInt(port) === 465, // true for 465, false for other ports
    auth: {
      user: origin,
      pass: pass
    }
  });

  // Email options
  const mailOptions = {
    from: origin,
    to: dest,
    subject: subject,
    text: body,
    html: body // Support both text and HTML
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  return info;
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'SMTP Webhook Service',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /webhook',
      api_webhook: 'POST /api/webhook'
    },
    status: 'running'
  });
});

// Webhook endpoint (both routes for compatibility)
app.post('/webhook', handleWebhook);
app.post('/api/webhook', handleWebhook);

async function handleWebhook(req, res) {
  try {
    // Get request body
    const body = req.body;

    // Validate required parameters
    const validation = validateParameters(body);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Missing required parameters',
        missing: validation.missing,
        required: ['origin', 'pass', 'smtp', 'port', 'dest', 'subject', 'body']
      });
    }

    // Send email
    const emailResult = await sendEmail(body);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: emailResult.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SMTP Webhook Service running on port ${PORT}`);
  console.log(`📧 POST endpoint available at: http://localhost:${PORT}/webhook`);
  console.log(`📧 API endpoint available at: http://localhost:${PORT}/api/webhook`);
});

export default app;