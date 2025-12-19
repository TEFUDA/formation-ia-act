// app/api/webhooks/stripe/route.ts
// Webhook Stripe pour déclencher l'envoi automatique des documents OPCO

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Traitement des événements
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// ============================================
// HANDLER: Checkout Session Completed
// ============================================
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  // Récupérer les métadonnées du client
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const metadata = session.metadata || {};

  if (!customerEmail) {
    console.error('No customer email in session');
    return;
  }

  // Extraire prénom et nom
  const nameParts = (customerName || 'Client').split(' ');
  const firstName = nameParts[0] || 'Client';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Déterminer le plan acheté (à partir des métadonnées ou du montant)
  const amount = session.amount_total || 0;
  let planId: 'solo' | 'equipe' | 'enterprise' = 'solo';
  
  if (metadata.planId) {
    planId = metadata.planId as 'solo' | 'equipe' | 'enterprise';
  } else {
    // Déduction par le montant (en centimes)
    if (amount >= 1800000) planId = 'enterprise'; // 18000€
    else if (amount >= 200000) planId = 'equipe'; // 2000€
    else planId = 'solo'; // 500€
  }

  // Générer un numéro de facture
  const invoiceNumber = `FA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  // Préparer les données client
  const clientData = {
    firstName,
    lastName,
    email: customerEmail,
    company: metadata.company || session.customer_details?.name || undefined,
    siret: metadata.siret || undefined,
    address: session.customer_details?.address?.line1 || undefined,
    postalCode: session.customer_details?.address?.postal_code || undefined,
    city: session.customer_details?.address?.city || undefined,
    phone: session.customer_details?.phone || undefined,
  };

  // 1. Créer l'utilisateur dans la base de données
  await createUserInDatabase({
    email: customerEmail,
    name: customerName || firstName,
    planId,
    stripeCustomerId: session.customer as string,
    stripeSessionId: session.id,
    invoiceNumber,
  });

  // 2. Envoyer les documents OPCO par email
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://formation-ia-act.fr';
    
    const response = await fetch(`${baseUrl}/api/opco-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client: clientData,
        planId,
        invoiceNumber,
        stripePaymentId: session.payment_intent as string,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send OPCO documents:', await response.text());
    } else {
      console.log('OPCO documents sent successfully');
    }
  } catch (error) {
    console.error('Error sending OPCO documents:', error);
  }

  // 3. Envoyer un email de bienvenue séparé (optionnel)
  // await sendWelcomeEmail(customerEmail, firstName, planId);

  console.log(`User created and OPCO documents sent for ${customerEmail}`);
}

// ============================================
// HELPER: Créer l'utilisateur en base de données
// ============================================
async function createUserInDatabase(userData: {
  email: string;
  name: string;
  planId: string;
  stripeCustomerId: string;
  stripeSessionId: string;
  invoiceNumber: string;
}) {
  // TODO: Adapter selon votre ORM (Prisma, Drizzle, etc.)
  
  // Exemple avec Prisma:
  /*
  import { prisma } from '@/lib/prisma';
  
  await prisma.user.upsert({
    where: { email: userData.email },
    update: {
      stripeCustomerId: userData.stripeCustomerId,
      plan: userData.planId,
      invoiceNumber: userData.invoiceNumber,
      accessExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    create: {
      email: userData.email,
      name: userData.name,
      stripeCustomerId: userData.stripeCustomerId,
      plan: userData.planId,
      invoiceNumber: userData.invoiceNumber,
      accessExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });
  */

  console.log('User created/updated in database:', userData);
}

// ============================================
// HELPER: Générer la facture PDF avec Stripe
// ============================================
// Note: Stripe peut aussi générer des factures automatiquement
// Voir: https://stripe.com/docs/invoicing
