import { useState } from 'react';
import type DialogProps from '../../props/DialogProps';
import { CUSTOMER_ID, LAST_SYNCED, MANAGER_ID, REFRESH_TOKEN, USERID } from '../../utils/constants';
import { IoArrowBackOutline } from 'react-icons/io5';

export default function SyncDialog({ show, onError, onSuccess }: DialogProps) {
  if (!show) return null;

  const [loading, setLoading] = useState(false);
  const handleSync = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem(USERID),
          customerId: localStorage.getItem(CUSTOMER_ID),
          loginCustomerId: localStorage.getItem(MANAGER_ID) ?? null,
          refreshToken: localStorage.getItem(REFRESH_TOKEN),
        }),
      });

      if (response.status !== 201) {
        onError!!('Failed to sync with Google Ads');
        console.error('Failed to sync with Google Ads account');
      }

      localStorage.setItem(LAST_SYNCED, new Date().toString());
      onSuccess!!();
    } catch (error) {
      onError!!('Failed to sync with Google Ads');
      console.error('Failed to sync with Google Ads account');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    localStorage.setItem('customerId', '');
  };

  return (
    <>
      <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative rounded bg-white to-gray-300 p-8 shadow-lg w-full max-w-lg text-center">
          <div className="absolute top-4 left-4 text-gray-700 cursor-pointer flex items-center gap-2 mb-4">
            <IoArrowBackOutline onClick={goBack} />
          </div>
          <h2 className="text-xl text-gray-900 font-semibold mb-4">
            Synchronize Your Google Ads Account
          </h2>
          <p className="text-gray-800 font-weight-400 mb-4">
            We'll start by synchronizing the last 6 months of data. Don't close this window. This
            may take a few minutes.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleSync}
              disabled={loading}
              className={`px-4 py-2 rounded bg-green-500 text-white ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Syncing...
                </div>
              ) : (
                'Sync Account'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
