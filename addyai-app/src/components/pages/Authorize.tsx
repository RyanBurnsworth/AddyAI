import { useEffect } from "react";

export default function Authorize() {
    useEffect(() => {
        // Get the full query string from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');

        if (code) {
            const backendURL = new URL('http://localhost:3000/auth/authorize');
            backendURL.searchParams.append('code', code);

            // Send the request to your backend to exchange the code for tokens
            fetch(backendURL.toString(), {
                method: 'GET',
                credentials: 'include', // Optional: for sending cookies if needed
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Backend response:", data);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('name', data.name);
                    localStorage.setItem('profileImage', data.profileImage);
                    localStorage.setItem('email', data.email);
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
