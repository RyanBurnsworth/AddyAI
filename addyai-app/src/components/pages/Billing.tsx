import BillingChart from '../reusable/BillingChart';
import { useEffect, useState } from 'react';
import PaymentDialog from '../reusable/PaymentSelectionDialog';
import { useNavigate } from 'react-router-dom';
import NavBar from '../reusable/NavBar';
import ReactGA from 'react-ga4';
import { useStoredUser } from '../../hooks/useStoredUser';

export default function Billing() {
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BASE_URL;
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>('0.00');

  const {
    storedUserId,
    storedEmail,
    storedCustomerId,
    storedName,
    storedLastSynced
  } = useStoredUser();

  useEffect(() => {
    // if the user is not logged in or has properly stored data return them to the home page
    if (storedUserId === '' || storedCustomerId === '' || storedEmail === '' || storedName === '' || storedLastSynced === '') {
      navigate('/', { replace: true });
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseURL}/user?id=${storedUserId}`);
        const userData = await response.json();

        // Ensure balance is formatted correctly, accounting for potential division by 1000
        setBalance('$' + (Number(userData.balance) / 100 / 10).toFixed(2)); // Corrected calculation based on typical cents to dollars conversion
      } catch (error) {
        console.log('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [
    baseURL, 
    storedUserId,
    storedCustomerId,
    storedEmail,
    storedLastSynced,
    storedName, 
    navigate
  ]); 

  const handleAddCreditButtonClick = () => {
    if (!showPaymentDialog) {
      // track new conversation started
      ReactGA.event({
        category: 'User Interaction',
        action: 'Clicked Button',
        label: 'Add Credit Button',
      });

      setShowPaymentDialog(true);
    }
  };

  return (
    <>
      <div className="relative z-50">
        <NavBar /> 
      </div>
      <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
        {/* Animated Background Grid & Radial Gradient - Matched from Home/Start */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              // Static center for the radial gradient
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

        <div className="relative z-10 flex flex-1 w-full pt-16">
          {' '}
          <div className="flex flex-col flex-1 p-4 md:p-8">
            {' '}
            {/* Added overall padding to the main content area */}
            <main className="flex-1 flex flex-col items-center justify-start w-full">
              {' '}
              {/* Changed justify-between to justify-start */}
              <div className="flex flex-col flex-grow w-full max-w-4xl bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 md:p-8 space-y-6 border border-zinc-700/50 shadow-lg">
                {' '}
                {/* Applied new styling */}
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
                  Your Billing Overview
                </h2>
                <div className="flex justify-between items-center w-full bg-zinc-800/70 p-4 rounded-lg border border-zinc-700">
                  <span className="text-xl font-semibold text-zinc-200">
                    Current Balance: <span className="text-green-400">{balance}</span>
                  </span>
                  <button
                    className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                    onClick={handleAddCreditButtonClick}
                  >
                    <div className="relative flex items-center justify-center space-x-2">
                      <span>Add Credit</span>
                    </div>
                  </button>
                </div>
                <div className="w-full flex-grow flex items-center justify-center min-h-[300px] bg-zinc-800/70 rounded-lg border border-zinc-700 p-4">
                  {/* BillingChart will render inside this themed container */}
                  <BillingChart />
                </div>
              </div>
              <PaymentDialog
                onClose={() => setShowPaymentDialog(false)}
                onError={() => setShowPaymentDialog(false)}
                onSuccess={amount => navigate(`/checkout?amount=${amount! * 100}`)}
                show={showPaymentDialog}
              />
            </main>
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
