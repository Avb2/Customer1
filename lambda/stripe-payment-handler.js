// Optional: Lambda function for creating Stripe payment intents
// This provides secure server-side payment intent creation
// Deploy this if you want full Stripe integration

const AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', // In production, replace with your domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { amount, currency = 'usd', productName } = body;

        if (!amount || amount <= 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid amount'
                })
            };
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: currency,
            metadata: {
                product: productName || 'Unknown'
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret
            })
        };

    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to create payment intent',
                message: error.message
            })
        };
    }
};

