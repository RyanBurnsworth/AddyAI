import { useEffect, useState, useCallback } from 'react';
import type DialogProps from '../../props/DialogProps';
import { CUSTOMER_ID, LAST_SYNCED, MANAGER_ID, USERID } from '../../utils/constants';
import ReactGA from 'react-ga4';

interface Account {
  id: number;
  userId: number;
  name: string;
  customerId: string;
  managerId: string | null;
  isManager: boolean;
  lastSynced: string | null;
  created_at: string;
}

export default function AccountSelectorDialog({ show, onSuccess, onError }: DialogProps) {
  // Only render if 'show' is true. This component will be unmounted when 'show' is false,
  // preventing its useEffect from running.
  if (!show) return null;

  // Assuming import.meta.env.VITE_GOOGLE_CUSTOMER_ID_URL is a stable string
  const customerAccountURL = import.meta.env.VITE_GOOGLE_CUSTOMER_ID_URL;

  const [selectedManager, setSelectedManager] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const [managerAccounts, setManagerAccounts] = useState<
    {
      managerId: string;
      name: string;
      clients: {
        customerId: string;
        name: string;
        managerId: string | null;
        isManager: boolean;
        lastSynced: string | null;
      }[];
    }[]
  >([]);

  // Store all accounts data to avoid recalculating
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);

  // Derived state for customer accounts based on manager selection
  const customerAccounts = selectedManager
    ? managerAccounts.find(m => m.managerId === selectedManager)?.clients ?? []
    : allAccounts
        .filter(acc => !acc.isManager && acc.managerId === null)
        .map(client => ({
          customerId: client.customerId,
          name: client.name || `Client ${client.customerId}`,
          managerId: client.managerId,
          isManager: client.isManager,
          lastSynced: client.lastSynced,
        }));

  const [loading, setLoading] = useState(true);

  // Memoize the error callback to prevent unnecessary re-renders
  // This depends on onError, so if onError changes in the parent, this will too.
  // Ensure onError is stable in the parent component.
  const handleError = useCallback(
    (message: string) => {
      onError?.(message);
    },
    [onError] // This is the key. If onError changes frequently, this useCallback will too.
  );

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem(USERID);

        if (!refreshToken || !userId) {
          handleError('Missing authentication tokens');
          return;
        }

        const params = new URLSearchParams({
          refresh_token: refreshToken,
          user_id: userId,
        });

        const response = await fetch(`${customerAccountURL}?${params.toString()}`);
        if (!response.ok) {
          const err = await response.json();
          console.error('Error fetching accounts:', err?.message);
          handleError(err?.message ?? 'Error fetching accounts');
          return;
        }

        const data: Account[] = await response.json();
        if (!data || !Array.isArray(data)) {
          handleError('Invalid response format');
          return;
        }

        // Store all accounts
        setAllAccounts(data);

        const managers = data.filter(acc => acc.isManager);
        const managerAccountsFormatted = managers.map(manager => ({
          managerId: manager.customerId,
          name: manager.name || `Manager ${manager.customerId}`,
          clients: data
            .filter(acc => acc.managerId === manager.customerId)
            .map(client => ({
              customerId: client.customerId,
              name: client.name || `Client ${client.customerId}`,
              managerId: client.managerId,
              isManager: client.isManager,
              lastSynced: client.lastSynced,
            })),
        }));

        setManagerAccounts(managerAccountsFormatted);
      } catch (error) {
        console.error('Fetch failed:', error);
        handleError('Error fetching accounts from Google Ads');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [customerAccountURL, handleError]); // 'show' is now handled by the early exit 'if (!show) return null;'

  const handleManagerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // send Google Analytics Event
    ReactGA.event({
      category: 'User Interaction',
      action: 'Clicked Button',
      label: 'Changed Manager',
    });

    const selected = event.target.value;
    setSelectedManager(selected);
    setSelectedCustomer(''); // reset customer selection
  };

  const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // send Google Analytics Event
    ReactGA.event({
      category: 'User Interaction',
      action: 'Clicked Button',
      label: 'Changed Customer',
    });

    setSelectedCustomer(event.target.value);
  };

  const handleSyncAccount = async () => {
    const selected = customerAccounts.find(acc => acc.customerId === selectedCustomer);

    if (!selected) {
      handleError('Please select a customer account');
      return;
    }

    try {
      localStorage.setItem(CUSTOMER_ID, selected.customerId);
      localStorage.setItem(LAST_SYNCED, selected.lastSynced?.toString() ?? '');
      if (selected.managerId && selected.managerId !== '') {
        localStorage.setItem(MANAGER_ID, selected.managerId);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving account data:', error);
      handleError('Error saving account selection');
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative rounded-2xl bg-zinc-900/90 p-8 shadow-xl w-full max-w-lg text-center border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
          Google Ads Account Selector
        </h2>

        {loading ? (
          <div className="flex justify-center my-8">
            <div className="w-10 h-10 border-4 border-zinc-600 border-t-green-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {managerAccounts.length > 0 && (
              <>
                <label
                  htmlFor="managerSelect"
                  className="block mb-2 mt-2 text-sm font-medium text-zinc-300 text-left"
                >
                  Select Your Manager Account:
                </label>

                <select
                  id="managerSelect"
                  value={selectedManager}
                  onChange={handleManagerChange}
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
                >
                  <option value="" className="bg-zinc-800 text-white">
                    None
                  </option>
                  {managerAccounts.map(m => (
                    <option
                      key={m.managerId}
                      value={m.managerId}
                      className="bg-zinc-800 text-white"
                    >
                      {m.name} ({m.managerId})
                    </option>
                  ))}
                </select>
              </>
            )}

            <label
              htmlFor="customerSelect"
              className="block mb-2 mt-4 text-sm font-medium text-zinc-300 text-left"
            >
              Select Your Customer Account:
            </label>

            <select
              id="customerSelect"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
            >
              <option value="" className="bg-zinc-800 text-white">
                -- Select --
              </option>
              {customerAccounts.map(c => (
                <option key={c.customerId} value={c.customerId} className="bg-zinc-800 text-white">
                  {c.name} ({c.customerId})
                </option>
              ))}
            </select>
          </>
        )}

        <div className="flex justify-center mt-6">
          <button
            disabled={selectedCustomer === '' || loading}
            onClick={handleSyncAccount}
            className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center justify-center space-x-2">
              <span>Select Account</span>
            </div>
          </button>
        </div>

        <div className="flex justify-center text-zinc-400 underline cursor-pointer mt-8 hover:text-green-400 transition-colors duration-200">
          Privacy Policy
        </div>
      </div>
    </div>
  );
}
