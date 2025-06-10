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

export default function Authorize() {
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [textHeader, setTextHeader] = useState<string>('Authorizing');
  const [textSubHeader, setTextSubHeader] = useState<string>('Authorizing Access to Google Ads...');

  // Send the authorization code on load
  useEffect(() => {
    // Get the full query string from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get(CODE);
    const errorParam = queryParams.get('error');

    const authorizeUrl = import.meta.env.VITE_AUTHORIZE_URL;
    const upsertUserUrl = import.meta.env.VITE_UPSERT_USER_URL;

    if (errorParam) {
      setTextHeader('Error Authorizing');
      setTextSubHeader('User denied access to Google Ads');
      setError(true);
      return;
    }

    const authorizationURL = new URL(authorizeUrl);
    authorizationURL.searchParams.append(CODE, code!!);

    const upsertUserURL = new URL(upsertUserUrl);

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
        const upsertUser = await fetch(upsertUserURL, {
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

        // navigate back to the homescreen
        navigate('/');
      } catch (error) {
        console.log('Error authorizing user: ', error);
        setTextHeader('Error Authorizing');
        setTextSubHeader('Please try again later');
        setError(true);
        return;
      }
    };

    // start the authenticator
    authenticator();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-center text-xl font-semibold mb-4">{textHeader}</h1>
      <span className="mb-4">{textSubHeader}</span>
      {!error && <GridLoader color="#4ade80" size={24} />}
      {error && <button onClick={() => navigate('/')}>Return Home</button>}
    </div>
  );
}
