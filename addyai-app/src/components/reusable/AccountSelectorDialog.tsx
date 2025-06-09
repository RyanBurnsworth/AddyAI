import { useEffect, useState } from "react";
import type DialogProps from "../../props/DialogProps";
import {
  CUSTOMER_ID,
  LAST_SYNCED,
  MANAGER_ID,
  USERID,
} from "../../utils/constants";

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

export default function AccountSelectorDialog({
  show,
  onSuccess,
  onError,
}: DialogProps) {
  if (!show) return null;

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

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

  const [customerAccounts, setCustomerAccounts] = useState<
    {
      customerId: string;
      name: string;
      managerId: string | null;
      isManager: boolean;
      lastSynced: string | null;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  const accountUrl = "http://localhost:3000/account";
  const refreshToken = localStorage.getItem("refreshToken");

  const params = new URLSearchParams({
    refresh_token: refreshToken ?? "",
    user_id: localStorage.getItem(USERID) ?? "",
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);

      try {
        const response = await fetch(accountUrl + `?${params.toString()}`);
        if (!response.ok) {
          const err = await response.json();
          console.error("Error fetching accounts:", err?.message);
          onError!!(err?.message ?? "Error fetching accounts");
          return;
        }

        const data: Account[] = await response.json();
        if (!data) return;

        const managers = data.filter((acc) => acc.isManager);
        const managerAccountsFormatted = managers.map((manager) => ({
          managerId: manager.customerId,
          name: manager.name || `Manager ${manager.customerId}`,
          clients: data
            .filter((acc) => acc.managerId === manager.customerId)
            .map((client) => ({
              customerId: client.customerId,
              name: client.name || `Client ${client.customerId}`,
              managerId: client.managerId,
              isManager: client.isManager,
              lastSynced: client.lastSynced,
            })),
        }));

        const standaloneCustomers = data
          .filter((acc) => !acc.isManager && acc.managerId === null)
          .map((client) => ({
            customerId: client.customerId,
            name: client.name || `Client ${client.customerId}`,
            managerId: client.managerId,
            isManager: client.isManager,
            lastSynced: client.lastSynced,
          }));

        setManagerAccounts(managerAccountsFormatted);
        setCustomerAccounts(standaloneCustomers);
      } catch (error) {
        console.error("Fetch failed:", error);
        onError!!("Error fetching accounts from Google Ads");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleManagerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedManager(selected);
    setSelectedCustomer(""); // reset customer

    if (selected) {
      const manager = managerAccounts.find((m) => m.managerId === selected);
      setCustomerAccounts(manager?.clients ?? []);
    } else {
      const standaloneCustomers = managerAccounts.flatMap((m) =>
        m.clients.length === 0 ? [] : []
      );
      setCustomerAccounts(standaloneCustomers);
    }
  };

  const handleCustomerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCustomer(event.target.value);
  };

  const handleSyncAccount = () => {
    const selected = customerAccounts.find(
      (acc) => acc.customerId === selectedCustomer
    );

    if (!selected) {
      onError!!("Please select a customer account");
      return;
    }

    if (!selected.lastSynced) {
      localStorage.setItem(CUSTOMER_ID, selected.customerId);
      localStorage.setItem(LAST_SYNCED, selected.lastSynced?.toString() ?? "");
      if (selected.managerId && selected.managerId !== "")
        localStorage.setItem(MANAGER_ID, selected.managerId);

      onSuccess!!();
    } else {
      alert(
        `Last synced at: ${new Date(selected.lastSynced).toLocaleString()}`
      );
      onSuccess!!();
    }

    // Optionally trigger sync logic here
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative rounded bg-gray-100 to-gray-300 p-8 shadow-lg w-full max-w-lg text-center">
        <h2 className="text-xl text-gray-900 font-semibold mb-4">
          Account Selection
        </h2>

        <p className="text-gray-800 font-weight-400 mb-4">
          Select the account you would like to work with
        </p>

        {loading ? (
          <div className="flex justify-center my-8">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {managerAccounts.length > 0 && (
              <>
                <label
                  htmlFor="managerSelect"
                  className="block mb-2 mt-2 text-sm font-medium text-gray-700"
                >
                  Select Your Manager Account:
                </label>

                <select
                  id="managerSelect"
                  value={selectedManager}
                  onChange={handleManagerChange}
                  className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-700"
                >
                  <option value="">None</option>
                  {managerAccounts.map((m) => (
                    <option key={m.managerId} value={m.managerId}>
                      {m.name} ({m.managerId})
                    </option>
                  ))}
                </select>
              </>
            )}

            <label
              htmlFor="customerSelect"
              className="block mb-2 mt-4 text-sm font-medium text-gray-700"
            >
              Select Your Customer Account:
            </label>

            <select
              id="customerSelect"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-700"
            >
              <option value="">-- Select --</option>
              {customerAccounts.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.name} ({c.customerId})
                </option>
              ))}
            </select>
          </>
        )}

        <div className="flex justify-center">
          <button
            disabled={selectedCustomer === ""}
            onClick={handleSyncAccount}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Select Account
          </button>
        </div>

        <div className="flex justify-center text-gray-900 underline cursor-pointer mt-8">
          Privacy Policy
        </div>
      </div>
    </div>
  );
}
