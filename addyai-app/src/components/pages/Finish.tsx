import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { USERID } from '../../utils/constants';
import ReactGA from 'react-ga4';
import { useStoredUser } from '../../hooks/useStoredUser';

export default function Finish() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
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

    const checkSessionStatus = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get('session_id');
        const userId = localStorage.getItem(USERID);

        if (!sessionId) {
          console.error('No session ID found in URL.');
          setIsSuccessful(false);
          return;
        }

        const response = await fetch(
          `${baseURL}/payment/status?user_id=${userId}&session_id=${sessionId}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          // send Google Analytics Event
          ReactGA.event({
            category: 'Major',
            action: 'Payment',
            label: 'Payment Failed: userId: ' + userId + ' sessionId: ' + sessionId,
          });
          throw new Error('Failed to retrieve checkout session status');
        }

        // send Google Analytics Event
        ReactGA.event({
          category: 'Major',
          action: 'Payment',
          label: 'Payment Success: userId: ' + userId + ' sessionId: ' + sessionId,
        });

        const session = await response.text();
        if (session === 'complete') setIsSuccessful(true);
        else if (session === 'open') setIsSuccessful(false);
        else if (!session || session === '') setIsSuccessful(false);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching session status:', error);
        setIsSuccessful(false);
        setLoading(false);
      }
    };

    checkSessionStatus();
  }, [
    baseURL,
    storedUserId,
    storedCustomerId,
    storedEmail,
    storedLastSynced,
    storedName, 
    navigate
  ]); // Added baseURL and navigate to dependencies

  const handleButtonClick = () => {
    // send Google Analytics Event
    ReactGA.event({
      category: 'User Interaction',
      action: 'Clicked Button',
      label: 'Return to Billing',
    });
    navigate('/billing');
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
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

        <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-700 max-w-lg text-center">
          {loading && (
            <div className="flex flex-col items-center loading-container">
              <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
                Processing Payment...
              </h1>
              <GridLoader color="#4ade80" size={32} /> {/* Larger loader */}
            </div>
          )}

          {!loading && (
            <div className="flex flex-col items-center complete-container">
              {isSuccessful && (
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                  Payment Successful!
                </h1>
              )}
              {isSuccessful === false && (
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                  Payment Failed!
                </h1>
              )}
              <button
                onClick={handleButtonClick}
                className="group relative px-8 py-3 mt-8 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                Return to Billing
              </button>
            </div>
          )}
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
      </div>
    </>
  );
}
