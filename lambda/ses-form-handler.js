const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });

// Configure these environment variables in Lambda:
// - FROM_EMAIL: Your verified SES email address
// - TO_EMAIL: Email address where enquiries should be sent

exports.handler = async (event) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*', // In production, replace * with your domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse the request body
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required fields: name, email, subject, and message are required.'
                })
            };
        }

        // Email configuration
        const fromEmail = process.env.FROM_EMAIL || 'noreply@yourdomain.com';
        const toEmail = process.env.TO_EMAIL || 'contact@yourdomain.com';

        // Create email content
        const emailSubject = `New Enquiry: ${subject}`;
        const emailBody = `
New enquiry received from your website:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}

---
This email was sent from your website contact form.
        `.trim();

        const emailParams = {
            Source: fromEmail,
            Destination: {
                ToAddresses: [toEmail]
            },
            Message: {
                Subject: {
                    Data: emailSubject,
                    Charset: 'UTF-8'
                },
                Body: {
                    Text: {
                        Data: emailBody,
                        Charset: 'UTF-8'
                    }
                }
            },
            ReplyToAddresses: [email] // Allow replying directly to the customer
        };

        // Send email via SES
        await ses.sendEmail(emailParams).promise();

        // Optional: Send auto-reply to customer
        const autoReplyParams = {
            Source: fromEmail,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: {
                    Data: 'Thank you for contacting us',
                    Charset: 'UTF-8'
                },
                Body: {
                    Text: {
                        Data: `Dear ${name},

Thank you for contacting us. We have received your message and will get back to you as soon as possible.

Your message:
${message}

Best regards,
Your Business Team
                        `.trim(),
                        Charset: 'UTF-8'
                    }
                }
            }
        };

        // Send auto-reply (optional - comment out if not needed)
        try {
            await ses.sendEmail(autoReplyParams).promise();
        } catch (autoReplyError) {
            console.error('Auto-reply failed (non-critical):', autoReplyError);
            // Don't fail the whole request if auto-reply fails
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Enquiry submitted successfully'
            })
        };

    } catch (error) {
        console.error('Error processing enquiry:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

