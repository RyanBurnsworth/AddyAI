import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useNavigate } from 'react-router-dom';
import {
  CODE,
  CONSENT,
  CONVERSATION_ID,
  CUSTOMER_ID,
  LAST_SYNCED,
  OFFLINE,
  REFRESH_TOKEN,
  USERID,
} from '../../utils/constants';
import SignInDialog from '../reusable/SignInDialog';
import NavBar from '../reusable/NavBar';
import AccountSelectorDialog from '../reusable/AccountSelectorDialog';
import SyncDialog from '../reusable/SyncDialog';
import { SnackBar } from '../reusable/SnackBar';
import { Rocket, ChevronRight, Search } from 'lucide-react';

export default function Start() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URL;
  const scope = import.meta.env.VITE_GOOGLE_SCOPE;

  const [showSignInDialog, setShowSignInDialog] = useState<boolean>(false);
  const [showAccountSelectorDialog, setShowAccountSelectorDialog] = useState<boolean>(false);
  const [showSyncDialog, setShowSyncDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

  const navigate = useNavigate();
  const [input, setInput] = useState<string>('');

  const placeholders = [
    "How many conversions did Spring Sale Blowout get in this year's Spring season?",
    'How much has my account spent in the last 7 days?',
    'Is conversion tracking enabled on my account?',
    'Should I increase my daily budget for Lawn Equipment since it is going to be Summer?',
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 2000); // This effect causes re-renders every 2 seconds.

    return () => clearInterval(interval);
  }, []);

  // Effect to manage dialog visibility based on local storage and error state
  useEffect(() => {
    localStorage.removeItem(CONVERSATION_ID);

    // Prioritize sign-in if tokens are missing
    if (!localStorage.getItem(REFRESH_TOKEN) || !localStorage.getItem(USERID)) {
      setShowSignInDialog(true);
      setShowAccountSelectorDialog(false); // Ensure other dialogs are hidden
      setShowSyncDialog(false);
    } else if (!localStorage.getItem(CUSTOMER_ID) && errorMessage === null) {
      // If signed in but customer ID is missing and no error is present
      setShowSignInDialog(false);
      setShowSyncDialog(false);
      setShowAccountSelectorDialog(true); // Show account selector
    } else if (
      (!localStorage.getItem(LAST_SYNCED) || localStorage.getItem(LAST_SYNCED) === '') &&
      errorMessage === null
    ) {
      // If customer ID is set but not synced and no error is present
      setShowSignInDialog(false);
      setShowAccountSelectorDialog(false);
      setShowSyncDialog(true); // Show sync dialog
    }
  }, [errorMessage]); // errorMessage is a dependency.

  const getRefreshToken = () => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: CODE,
      scope: scope,
      access_type: OFFLINE,
      prompt: CONSENT,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleClick = () => {
    if (input.trim()) {
      navigate('/chat', {
        state: { initialMessage: input.trim() },
      });
    }
  };

  const handleSignInDialogClick = (isCancelled: boolean) => {
    if (!isCancelled) {
      getRefreshToken();
    }
    setShowSignInDialog(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  // Memoize onError for AccountSelectorDialog to prevent re-renders in child
  const handleAccountSelectorError = useCallback((msg: string) => {
    setShowAccountSelectorDialog(false);
    setErrorMessage(msg);
    setShowSnackBar(true);
  }, []); // Empty dependency array because state setters are stable.

  // Memoize onSuccess for AccountSelectorDialog to prevent re-renders in child
  const handleAccountSelectorSuccess = useCallback(() => {
    setShowAccountSelectorDialog(false);
    // After selecting an account, check if it needs syncing
    if (!localStorage.getItem(LAST_SYNCED) || localStorage.getItem(LAST_SYNCED) === '') {
      setShowSyncDialog(true);
    }
    // Also, clear any error message if a success happened
    setErrorMessage(null); // Clear error on success to potentially allow re-showing if needed later
    setShowSnackBar(false); // Hide snackbar on success
  }, []); // Empty dependency array because state setters and localStorage are stable.

  // Memoize onError for SyncDialog
  const handleSyncDialogError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setShowSnackBar(true);

    // be sure last_synced is clear
    localStorage.removeItem(LAST_SYNCED);
  }, []);

  // Memoize onSuccess for SyncDialog
  const handleSyncDialogSuccess = useCallback(() => {
    setShowSyncDialog(false);
    // Clear error message on successful sync
    setErrorMessage(null);
    setShowSnackBar(false);
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-[100vw] min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
        {/* Animated Background Grid & Radial Gradient - Matched from Home */}
        <div className="fixed inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              // Static center for the radial gradient as mousePosition is not available here
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
            }}
          />
          <div className="grid-background" />
        </div>

        {/* Floating Particles - Matched from Home */}
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

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 lg:px-8">
          <div className="flex flex-col w-[90%] max-w-xl text-center space-y-8 bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-zinc-700/50 shadow-lg">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-green-400 via-amber-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
                Your AddyAI
              </span>
              <span className="block bg-gradient-to-r from-amber-400 via-green-400 to-amber-400 bg-clip-text text-transparent animate-gradient-x-delayed">
                Co-Pilot
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-zinc-300 leading-relaxed max-w-prose mx-auto">
              Ask questions, get insights, and manage your campaigns effortlessly with AddyAI.
            </p>

            <div className="relative flex items-center w-full">
              <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 text-white placeholder-zinc-400 border border-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 text-lg"
                placeholder={placeholders[placeholderIndex]}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                value={input}
              />
            </div>

            <button
              onClick={handleClick}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center space-x-3">
                <Rocket className="w-5 h-5" />
                <span>Ask AddyAI</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {errorMessage && (
            <SnackBar
              message={errorMessage}
              color="bg-red-600"
              duration={3000}
              onClose={() => {
                setShowSnackBar(false);
              }}
              show={showSnackBar}
            />
          )}
        </div>

        <SignInDialog show={showSignInDialog} onClose={handleSignInDialogClick} />

        <AccountSelectorDialog
          show={showAccountSelectorDialog}
          onError={handleAccountSelectorError} // Use memoized callback
          onSuccess={handleAccountSelectorSuccess} // Use memoized callback
        />

        <SyncDialog
          show={showSyncDialog}
          onError={handleSyncDialogError} // Use memoized callback
          onSuccess={handleSyncDialogSuccess} // Use memoized callback
        />
      </div>
      {/* Matched CSS animations from Home page */}
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
