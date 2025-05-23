import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CODE, CONSENT, OFFLINE, REFRESH_TOKEN } from "../../utils/constants";
import SignInDialog from "../reusable/SignInDialog";
import NavBar from "../reusable/NavBar";

export default function Home() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URL;
  const scope = import.meta.env.VITE_GOOGLE_SCOPE;

  const [showSignInDialog, setShowSignInDialog] = useState<boolean>(false);

  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");

  const placeholders = [
    "How many conversions did Spring Sale Blowout get in this year's Spring season?",
    "How much has my account spent in the last 7 days?",
    "Is conversion tracking enabled on my account?",
    "Should I increase my daily budget for Lawn Equipment since it is going to be Summer?",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [signedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN)) {
      setSignedIn(true);
    }
  });

  const getRefreshToken = () => {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: CODE,
        scope: scope,
        access_type: OFFLINE,
        prompt: CONSENT
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleClick = () => {
    if (!signedIn) {
      setShowSignInDialog(true);
      return;
    }

    if (input.trim()) {
      navigate("/chat", {
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

  return (
    <>
      <NavBar></NavBar>
      <div className="h-screen w-screen overflow-y-hidden snap-y snap-mandatory scroll-smooth">
        {/* First screen */}
        <section className="h-screen w-full snap-start flex flex-col justify-center items-center">
          <div className="flex flex-col w-[90%] max-w-xl text-center">
            <span className="mb-2 text-3xl md:text-4xl font-bold">
              Your Google Ads Co-Pilot
            </span>
            <span className="mb-4 text-2xl text-green-400">Powered by AddyAI</span>
            <input
              type="text"
              className="mb-8 p-4 border-gray-400 border-2 focus:outline-none focus:ring-0 focus:border-green-400"
              placeholder={placeholders[placeholderIndex]}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleClick}
              className="bg-blue-400 p-3 rounded text-white hover:bg-blue-400 transition"
            >
              Ask Your Google Ads
            </button>
          </div>
        </section>
        <SignInDialog
          show={showSignInDialog}
          onClose={handleSignInDialogClick}
        />
      </div>
    </>
  );
}
