import { useEffect, useState } from 'react';
import {
  APPLICATION_JSON,
  CODE,
  EMAIL,
  GET,
  INCLUDE,
  NAME,
  PICTURE,
  PUT,
  REFRESH_TOKEN,
} from '../../utils/constants';
import { GridLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

export default function Authorize() {
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [textHeader, setTextHeader] = useState<string>('Authorizing');
  const [textSubHeader, setTextSubHeader] = useState<string>('Authorizing Access to Google Ads...');

  // Moved environment variable access outside useEffect
  // This ensures they are always available within the component's scope.
  const authorizeUrl = import.meta.env.VITE_AUTHORIZE_URL;
  const upsertUserUrl = import.meta.env.VITE_UPSERT_USER_URL;

  // Send the authorization code on load
  useEffect(() => {
    // Get the full query string from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get(CODE);
    const errorParam = queryParams.get('error');

    if (errorParam) {
      setTextHeader('Error Authorizing');
      setTextSubHeader('User denied access to Google Ads');
      setError(true);
      return;
    }

    // Ensure 'code' is not null before proceeding, as it's used with '!!'
    if (!code) {
      setTextHeader('Missing Authorization Code');
      setTextSubHeader('Failed to receive authorization code from Google. Please try again.');
      setError(true);
      return;
    }

    const authorizationURL = new URL(authorizeUrl, window.location.origin);
    authorizationURL.searchParams.append(CODE, code); // 'code' is now guaranteed not null

    // Send the request to your backend to exchange the code for tokens
    const authenticator = async () => {
      try {
        // Step 1: Validate the authorization code
        const authResponse = await fetch(authorizationURL.toString(), {
          method: GET,
          credentials: INCLUDE,
        });

        if (authResponse.status !== 200) {
          console.error('Error fetching authorization');
          setTextHeader('Error Obtaining Authorization');
          setTextSubHeader("Couldn't obtain authorization from Google Ads");
          setError(true);
          return;
        }

        const authData = await authResponse.json();

        // Update text header and subheader
        setTextHeader('Authorization Success');
        setTextSubHeader('Obtaining Account Information...');

        // prepare the user payload for step 3
        const userPayload = {
          name: authData.token.payload.name,
          email: authData.token.payload.email,
          picture: authData.token.payload.picture,
          refreshToken: authData.token.data.refresh_token,
          accessToken: authData.token.data.access_token,
          expiresIn: authData.token.data.expires_in,
          refreshTokenExpiresIn: authData.token.data.refresh_token_expires_in,
          tokenType: authData.token.data.token_type,
          scope: authData.token.data.scope,
          idToken: authData.token.data.id_token,
        };

        // store neccesary user data in local storage
        localStorage.setItem(NAME, userPayload.name);
        localStorage.setItem(PICTURE, userPayload.picture);
        localStorage.setItem(EMAIL, userPayload.email);
        localStorage.setItem(REFRESH_TOKEN, userPayload.refreshToken);

        setTextHeader('Validating User');
        setTextSubHeader('Validating User Information...');

        // Step 2: Validate an existing user or create a new user
        const upsertUser = await fetch(`${upsertUserUrl}`, {
          method: PUT,
          headers: {
            'Content-Type': APPLICATION_JSON,
          },
          body: JSON.stringify(userPayload),
        });

        if (upsertUser.status !== 201) {
          console.error('Error upserting user');
          setTextHeader('Error Setting User');
          setTextSubHeader("Couldn't validate user information");
          setError(true);
          return;
        }

        // upsert the user into the db
        const userResp = await upsertUser.json();
        localStorage.setItem('userId', userResp.id);

        setTextHeader('Saving Account Info');
        setTextSubHeader('Storing Account Access Information...');

        // track new conversation started
        ReactGA.event({
          category: 'Major',
          action: 'Authorized',
          label: 'Successful Sign-In',
        });

        // navigate back to the homescreen
        navigate('/chat');
      } catch (error) {
        console.log('Error authorizing user: ', error);
        setTextHeader('Error Authorizing');
        setTextSubHeader('Please try again later');
        setError(true);
        return;
      }
    };

    authenticator(); // Call authenticator directly, 'code' check is now earlier.
  }, [navigate, authorizeUrl, upsertUserUrl]); // Dependencies updated: now include authorizeUrl, upsertUserUrl

  return (
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

      <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-700 max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
          {textHeader}
        </h1>
        <span className="text-lg text-zinc-300 mb-8 leading-relaxed">{textSubHeader}</span>
        {!error && <GridLoader color="#4ade80" size={32} />} {/* Larger loader */}
        {error && (
          <button
            onClick={() => navigate('/')}
            className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 mt-6"
          >
            Return Home
          </button>
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
  );
}
