import { useState } from 'react';
import type DialogProps from '../../props/DialogProps';
import { EMAIL } from '../../utils/constants';

export default function WarningDialog({ headling, message, confirmText, cancelText, show, onClose }: DialogProps) {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleDelete = async () => {
    const userEmail = localStorage.getItem('email') || null;
    if (!userEmail) {
      alert('User email not found. Please log in again.');
      onClose?.(true);
      return;
    }

    setLoading(true);
    try {
      const userEmail = localStorage.getItem(EMAIL);
      if (!userEmail) {
        console.error('User email not found in localStorage');
        throw new Error('User email not found');
      }

      const params = new URLSearchParams({
        email: userEmail
      });

      const response = await fetch(`${baseURL}/user?${params}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Close the dialog and optionally notify parent
      onClose?.(true);
    } catch (error) {
      console.error(error);
      alert('Failed to delete account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative rounded-2xl bg-zinc-900/90 p-8 shadow-xl w-full max-w-lg text-center border border-zinc-700">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
          { headling }
        </h2>
        <p className="text-zinc-300 font-normal mb-6 leading-relaxed">
          { message }
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => onClose?.(false)}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-6 rounded-lg border border-amber-400 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            { cancelText || 'Cancel' }
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center gap-3 text-white font-medium py-3 px-6 ml-8 rounded-lg border !bg-red-700 hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
                confirmText || 'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
