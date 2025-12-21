// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Mapping des prix Stripe aux produits
const PRODUCT_MAP: Record<number, {
  type: 'formation' | 'templates' | 'audit' | 'bundle';
  plan: string;
  name: string;
}> = {
  // Formations
  50000: { type: 'formation', plan: 'solo', name: 'Formation Solo' },
  200000: { type: 'formation', plan: 'equipe', name: 'Formation Équipe' },
  1800000: { type: 'formation', plan: 'enterprise', name: 'Formation Enterprise' },
  25000: { type: 'formation', plan: 'solo_upsell', name: 'Formation Solo (Upsell -50%)' },
  
  // Templates
  29900: { type: 'templates', plan: 'essentiel', name: 'Pack Templates Essentiel' },
  59900: { type: 'templates', plan: 'complet', name: 'Pack Templates Complet' },
  79900: { type: 'bundle', plan: 'bundle', name: 'Bundle Formation + Templates' },
  
  // Audit
  49900: { type: 'audit', plan: 'starter', name: 'Audit Starter' },
  99900: { type: 'audit', plan: 'pro', name: 'Audit Pro' },
  299900: { type: 'audit', plan: 'enterprise', name: 'Audit Enterprise' },
};

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const amountTotal = session.amount_total; // en centimes

    if (!customerEmail || !amountTotal) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const product = PRODUCT_MAP[amountTotal];
    
    if (!product) {
      console.log(`Unknown product amount: ${amountTotal}`);
      return NextResponse.json({ received: true });
    }

    console.log(`✅ Achat: ${product.name} par ${customerEmail}`);

    // Générer numéro de facture
    const invoiceNumber = `FA-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Actions selon le type de produit
    switch (product.type) {
      case 'formation':
      case 'bundle':
        // Envoyer documents OPCO (formation incluse)
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/opco-documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client: {
              email: customerEmail,
              firstName: customerName?.split(' ')[0] || 'Client',
              lastName: customerName?.split(' ').slice(1).join(' ') || '',
            },
            planId: product.plan,
            invoiceNumber,
            includeTemplates: product.type === 'bundle',
          }),
        });
        break;

      case 'templates':
        // Envoyer email avec lien de téléchargement + upsells
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/templates-purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerEmail,
            name: customerName,
            pack: product.plan,
            invoiceNumber,
          }),
        });
        break;

      case 'audit':
        // Envoyer email avec lien vers le questionnaire
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/audit-purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerEmail,
            name: customerName,
            plan: product.plan,
            invoiceNumber,
          }),
        });
        break;
    }
  }

  return NextResponse.json({ received: true });
}
