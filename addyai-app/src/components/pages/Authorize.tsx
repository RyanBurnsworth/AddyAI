import { useEffect, useState } from "react";
import {
  APPLICATION_JSON,
  CODE,
  CUSTOMER_ID,
  EMAIL,
  GET,
  INCLUDE,
  NAME,
  PICTURE,
  PUT,
  REFRESH_TOKEN,
} from "../../utils/constants";
import { GridLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function Authorize() {
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [textHeader, setTextHeader] = useState<string>("Authorizing");
  const [textSubHeader, setTextSubHeader] = useState<string>(
    "Authorizing Access to Google Ads..."
  );

  // Send the authorization code on load
  useEffect(() => {
    // Get the full query string from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get(CODE);
    const errorParam = queryParams.get('error');

    const authorizeUrl = import.meta.env.VITE_AUTHORIZE_URL;
    const customerIdUrl = import.meta.env.VITE_GOOGLE_CUSTOMER_ID_URL;
    const upsertUserUrl = import.meta.env.VITE_UPSERT_USER_URL;
    
    if (errorParam) {
        setTextHeader('Error Authorizing');
        setTextSubHeader('User denied access to Google Ads');
        setError(true);
        return;
    }

    const authorizationURL = new URL(authorizeUrl);
    authorizationURL.searchParams.append(CODE, code!!);

    const customerIdURL = new URL(customerIdUrl);

    const upsertUserURL = new URL(upsertUserUrl);

    // Send the request to your backend to exchange the code for tokens
    const authenticator = async () => {
      try {
        // Step 1: Validate the authorization code
        const authResponse = await fetch(authorizationURL.toString(), {
          method: GET,
          credentials: INCLUDE,
        });

        const authData = await authResponse.json();

        // Update text header and subheader
        setTextHeader("Gathering");
        setTextSubHeader("Obtaining Account Information...");

        // prepare the user payload for step 3
        const userPayload = {
          customerId: "",
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

        // append refresh_token to the search params for step 2
        customerIdURL.searchParams.append(
          "refresh_token",
          userPayload.refreshToken
        );

        // Step 2: Get the customer ids associated to the user
        const getCustomerIds = await fetch(customerIdURL, {
          method: GET,
          credentials: INCLUDE,
        });

        const customerIds = await getCustomerIds.json();
        const customerId = customerIds[0].replace("customers/", "");

        // Set the customer id
        localStorage.setItem(CUSTOMER_ID, customerId);
        userPayload.customerId = customerId;

        setTextHeader("Saving Account Info");
        setTextSubHeader("Storing Account Access Information...");

        // Step 3: Save or Update the User
        const upsertUser = await fetch(upsertUserURL, {
          method: PUT,
          headers: {
            "Content-Type": APPLICATION_JSON,
          },
          body: JSON.stringify(userPayload),
        });

        // upsert the user into the db
        upsertUser;

        // navigate back to the homescreen
        navigate("/");
      } catch (error) {
        console.log("Error authorizing user: ", error);
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
