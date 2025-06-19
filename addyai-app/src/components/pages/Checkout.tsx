import { useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../reusable/NavBar';

export default function Checkout() {
  const stripePromise: Promise<Stripe | null> = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const [searchParams] = useSearchParams();
  const amount = parseInt(searchParams.get('amount') || '0');
  const baseURL = import.meta.env.VITE_BASE_URL;

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const response = await fetch(`${baseURL}/payment/create-session?amount=${amount}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data: { clientSecret: string } = await response.json();
    return data.clientSecret;
  }, [baseURL, amount]); // Added dependencies

  const options = { fetchClientSecret };

  return (
    <>
      <NavBar />
      <div className="w-[100vw] min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative pt-16">
        {' '}
        {/* Added pt-16 for NavBar space */}
        {/* Animated Background Grid & Radial Gradient - Matched from Home/Start */}
        <div className="fixed inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
            }}
          />
          <div className="grid-background" />
        </div>
        {/* Floating Particles - Matched from Home/Start */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-6xl p-4 lg:p-8">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left bg-zinc-900/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-zinc-700">
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
              Complete Your Purchase
            </h1>
            <p className="text-zinc-300 mb-6 leading-relaxed">
              Thanks for choosing us! Your purchase is 100% secure and backed by our guarantee.
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-2 text-left mx-auto lg:mx-0 max-w-sm">
              <li>Encrypted Stripe checkout with industry-leading security</li>
              <li>Instant credit confirmation to your account</li>
              <li>24/7 dedicated support for any questions</li>
            </ul>
          </div>

          {/* Checkout */}
          <div className="w-full lg:w-[480px] bg-zinc-900/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-zinc-700">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>

      {/* Matched CSS animations from Home/Start page */}
      <style>{`
        .grid-background {
          background-image: linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes gradient-x-delayed {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: right center;
          }
          50% {
            background-size: 200% 200%;
            background-position: left center;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
        .animate-gradient-x-delayed {
          animation: gradient-x-delayed 6s ease infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
