import { useState } from 'react';
import type DialogProps from '../../props/DialogProps';
import { CUSTOMER_ID, LAST_SYNCED, MANAGER_ID, REFRESH_TOKEN, USERID } from '../../utils/constants';

export default function SyncDialog({ show, onError, onSuccess }: DialogProps) {
  if (!show) return null;

  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSync = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/sync`, {
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
        return;
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

  return (
    <>
      <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="relative rounded-2xl bg-zinc-900/90 p-8 shadow-xl w-full max-w-lg text-center border border-zinc-700">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
            Synchronize Your Google Ads Account
          </h2>
          <p className="text-zinc-300 font-normal mb-6 leading-relaxed">
            We'll start by synchronizing the last 6 months of data. Please keep this window open as
            this may take a few minutes.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleSync}
              disabled={loading}
              className={`group relative px-6 py-3 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Syncing...</span>
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
