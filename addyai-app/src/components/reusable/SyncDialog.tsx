import { useState } from "react";
import type DialogProps from "../../props/DialogProps";
import {
  CUSTOMER_ID,
  LAST_SYNCED,
  MANAGER_ID,
  REFRESH_TOKEN,
  USERID,
} from "../../utils/constants";

export default function SyncDialog({ show, onError, onSuccess }: DialogProps) {
  if (!show) return null;
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem(USERID),
          customerId: localStorage.getItem(CUSTOMER_ID),
          loginCustomerId: localStorage.getItem(MANAGER_ID) ?? null,
          refreshToken: localStorage.getItem(REFRESH_TOKEN),
        }),
      });

      if (response.status !== 201) {
        // TODO throw an error
      }

      localStorage.setItem(LAST_SYNCED, new Date().toString());
      onSuccess!!();
    } catch (error) {
      onError!!("Failed to sync with Google Ads");
      console.error("POST failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative rounded bg-white to-gray-300 p-8 shadow-lg w-full max-w-lg text-center">
        <h2 className="text-xl text-gray-900 font-semibold mb-4">
          Looks Like This Account Isn't Synced
        </h2>
        <p className="text-gray-800 font-weight-400 mb-4">
          Sync your Google Ads data to start using AddyAI with this account
        </p>
        <br />
        <p className="text-gray-800 font-weight-800 mb-4">
          <strong>AddyAI Google Ads Co-Pilot</strong>
        </p>

        <p className="text-gray-800 font-weight-400 mb-4">293-291-2955</p>
        <div className="flex justify-center">
          <button
            onClick={handleSync}
            disabled={loading}
            className={`px-4 py-2 rounded bg-green-500 text-white ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Syncing...
              </div>
            ) : (
              "Sync Account"
            )}
          </button>
        </div>

        <div className="flex justify-center text-gray-900 underline cursor-pointer mt-8">
          Privacy Policy
        </div>
      </div>
    </div>
  );
}
