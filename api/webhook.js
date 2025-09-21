const nodemailer = require('nodemailer');

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
  const transporter = nodemailer.createTransporter({
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

// Main handler function for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

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