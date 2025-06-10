import { useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useSearchParams } from 'react-router-dom';

export default function Checkout() {
  const stripePromise: Promise<Stripe | null> = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const [searchParams] = useSearchParams();
  const amount = parseInt(searchParams.get('amount') || '0');

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const response = await fetch(`http://localhost:3000/payment/create-session?amount=${amount}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data: { clientSecret: string } = await response.json();
    return data.clientSecret;
  }, []);

  const options = { fetchClientSecret };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-6xl">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl font-bold mb-4 mt-4">Complete Your Purchase</h1>
          <p className="text-gray-200 mb-6">
            Thanks for choosing us! Your purchase is 100% secure and backed by our guarantee.
          </p>
          <ul className="list-disc list-inside text-gray-400">
            <li>Encrypted Stripe checkout</li>
            <li>Instant confirmation</li>
            <li>24/7 support</li>
          </ul>
        </div>

        {/* Checkout */}
        <div className="w-full lg:w-[480px]">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
