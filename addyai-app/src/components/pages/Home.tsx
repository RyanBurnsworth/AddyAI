import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import question_balloons from "../../assets/question_ballons.png";

export default function Home() {
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");

  const placeholders = [
    "How many conversions did Spring Sale Blowout get in this year's Spring season?",
    "How much has my account spent in the last 7 days?",
    "Is conversion tracking enabled on my account?",
    "Should I increase my daily budget for Lawn Equipment since it is going to be Summer?",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getRefreshToken = () => {
    const params = new URLSearchParams({
        client_id: '453865601493-6kmumtadvpc285p7sk5v638f0vab6r4c.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:5173/authorize',
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/adwords openid email profile',
        access_type: 'offline',
        prompt: 'consent'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleClick = () => {
    if (!localStorage.getItem('refreshToken')) {
      getRefreshToken();
      return;
    }

    if (input.trim()) {
      navigate("/chat", {
        state: { initialMessage: input.trim() },
      });
    }
  };

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* First screen */}
      <section className="h-screen w-full snap-start flex flex-col justify-center items-center">
        <div className="flex flex-col w-[90%] max-w-xl text-center">
          <h1 className="mb-8 text-3xl md:text-4xl font-bold">
            Ask Your Ads Data Anything!
          </h1>
          <input
            type="text"
            className="mb-8 p-4 border-amber-400 border-2 focus:outline-none focus:ring-0 focus:border-amber-400"
            placeholder={placeholders[placeholderIndex]}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleClick}
            className="bg-blue-500 p-3 rounded text-white hover:bg-blue-600 transition"
          >
            Ask Your Google Ads
          </button>
        </div>
      </section>

      {/* Second screen (parallax-style content below) */}
      <section className="h-screen w-full snap-start flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-white text-gray-800">
        <img src={question_balloons} />
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Understand your Google Ads like never before
        </h2>
        <p className="max-w-xl text-center px-4">
          Dive deeper into your ad performance, budget, and strategy with AddyAI's
          real-time answers. Scroll up anytime to ask more questions.
        </p>
      </section>

      {/* Third screen (parallax-style content below) */}
      <section className="h-screen w-full snap-start flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-white text-gray-800">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Understand your Google Ads like never before
        </h2>
        <p className="max-w-xl text-center px-4">
          Dive deeper into your ad performance, budget, and strategy with AddyAI's
          real-time answers. Scroll up anytime to ask more questions.
        </p>
      </section>
    </div>
  );
}
