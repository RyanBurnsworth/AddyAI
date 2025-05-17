import { useEffect } from "react";
import { CODE, EMAIL, GET, INCLUDE, NAME, PICTURE, REFRESH_TOKEN } from "../../utils/constants";

export default function Authorize() {
    useEffect(() => {
        // Get the full query string from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get(CODE);
        const authorizeUrl = import.meta.env.VITE_API_URL;
        
        if (code) {
            const backendURL = new URL(authorizeUrl);
            backendURL.searchParams.append(CODE, code);

            // Send the request to your backend to exchange the code for tokens
            fetch(backendURL.toString(), {
                method: GET,
                credentials: INCLUDE, // Optional: for sending cookies if needed
            }).then(response => response.json())
                .then(data => {
                    console.log("Backend response:", data);
                    localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                    localStorage.setItem(NAME, data.name);
                    localStorage.setItem(PICTURE, data.picture);
                    localStorage.setItem(EMAIL, data.email);
                    // Save refreshToken, name, image_url, etc. as needed
                })
                .catch(error => {
                    console.error("Error authorizing:", error);
                });
        } else {
            console.error("Authorization code not found in URL.");
        }
    }, []);

    return (
        <div className="flex flex-col w-[90%] max-w-xl text-center">
            <h1>Authorizing...</h1>
        </div>
    );
}
