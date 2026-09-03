import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const stripeKeyLine = envContent.split('\n').find(line => line.startsWith('STRIPE_SECRET_KEY'));
const STRIPE_SECRET_KEY = stripeKeyLine.split('=')[1].trim();

const stripeHeaders = (key) => ({
  "Authorization": `Bearer ${key}`,
  "Content-Type": "application/x-www-form-urlencoded",
});

async function testPaymentIntent(amount) {
  try {
    console.log("1. Creating Customer...");
    const customerReq = await fetch("https://api.stripe.com/v1/customers", {
      method: "POST",
      headers: stripeHeaders(STRIPE_SECRET_KEY),
      body: new URLSearchParams({
        name: "Test User",
        email: "test@example.com",
        "address[line1]": "123 Test St",
        "address[country]": "US",
        "address[postal_code]": "10001",
      }),
    });
    const customer = await customerReq.json();
    if (customer.error) throw new Error(customer.error.message);
    console.log("Customer created:", customer.id);

    console.log("2. Creating Ephemeral Key...");
    const ephemeralKeyReq = await fetch(
      "https://api.stripe.com/v1/ephemeral_keys",
      {
        method: "POST",
        headers: {
          ...stripeHeaders(STRIPE_SECRET_KEY),
          "Stripe-Version": "2024-06-20",
        },
        body: new URLSearchParams({ customer: customer.id }),
      }
    );
    const ephemeralKey = await ephemeralKeyReq.json();
    if (ephemeralKey.error) throw new Error(ephemeralKey.error.message);
    console.log("Ephemeral Key created:", ephemeralKey.secret ? "Success" : "Failed");

    console.log("3. Creating Payment Intent...");
    const piReq = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: stripeHeaders(STRIPE_SECRET_KEY),
      body: new URLSearchParams({
        amount: String(Math.round(amount * 100)),
        currency: "inr",
        customer: customer.id,
        "automatic_payment_methods[enabled]": "true",
        description: "Sheyshop AI Payment"
      }),
    });
    const pi = await piReq.json();
    if (pi.error) throw new Error(pi.error.message);
    console.log("Payment Intent created:", pi.id);

    console.log("\n--- Final Response Payload ---");
    console.log(JSON.stringify({
      clientSecret: pi.client_secret,
      customer: customer.id,
      ephemeralKey: ephemeralKey.secret,
      paymentIntentId: pi.id,
    }, null, 2));
    
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Test with amount 50
testPaymentIntent(50);
