// File: netlify/functions/create-subscription.js
import pg from 'pg';
const { Client } = pg;
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { customerInfo, priceId } = JSON.parse(event.body);

    // 1. Create a Stripe Customer
    const customer = await stripe.customers.create({
      email: customerInfo.email,
      name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      phone: customerInfo.phone,
    });

    // 2. Create the Subscription
    // This creates the subscription in an "incomplete" state
    // and prepares its first invoice for payment.
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // 3. Send the client_secret from the invoice's Payment Intent
    // back to the frontend. The frontend will use this to
    // confirm the card payment.
    return new Response(
      JSON.stringify({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create subscription", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
