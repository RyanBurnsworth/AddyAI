import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { USERID } from "../../utils/constants";

export default function Finish() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionStatus = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get("session_id");
        const userId = localStorage.getItem(USERID);

        if (!sessionId) {
          console.error("No session ID found in URL.");
          setIsSuccessful(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3000/payment/status?user_id=${userId}&session_id=${sessionId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve checkout session status");
        }

        const session = await response.text();
        if (session === "complete") setIsSuccessful(true);
        else if (session === "open") setIsSuccessful(false);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching session status:", error);
        setIsSuccessful(false);
        setLoading(false);
      }
    };

    checkSessionStatus();
  }, []);

  const handleButtonClick = (() => {
    navigate("/profile");
  });

  return (
    <>
      <div className="w-[100vw] flex flex-col items-center justify-center">
        {loading && (
          <div className="loading-container">
            <h1 className="mb-8">Processing Payment...</h1>
            <GridLoader color="#4ade80" size={24} />
          </div>
        )}

        {!loading && (
          <div className="complete-container">
            {isSuccessful && <h1>Payment Successful!</h1>}
            {isSuccessful === false && <h1>Payment Failed!</h1>}
            <button className="mt-8" onClick={handleButtonClick}>Return to Profile</button>
          </div>
        )}
      </div>
    </>
  );
}
