import { useState } from "react";
import type DialogProps from "../../props/DialogProps";

const predefinedAmounts = ["$5.00", "$10.00", "$20.00", "$25.00", "$50.00", "$100.00", "Custom"];

export default function PaymentDialog({ show, onError, onSuccess, onClose }: DialogProps) {
  const [selectedAmount, setSelectedAmount] = useState(predefinedAmounts[0]);
  const [customAmount, setCustomAmount] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    const amountToUse = selectedAmount === "Custom" ? customAmount : selectedAmount;
    const numericAmount = parseFloat(amountToUse.replace(/[^0-9.]/g, ""));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      onError?.("Invalid amount entered.");
    } else {
      onSuccess?.(numericAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative rounded-xl bg-white p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl text-gray-900 font-semibold mb-6 text-center">
          Add Credit to Your AddyAI Balance
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Select Amount</label>
          <select
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
            className="w-full border text-black border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {predefinedAmounts.map((amount) => (
              <option key={amount} value={amount}>
                {amount}
              </option>
            ))}
          </select>
        </div>

        {selectedAmount === "Custom" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Enter Custom Amount</label>
            <input
              type="text"
              placeholder="e.g. 42.00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full border text-black border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={() => onError?.("User cancelled")}
            className="px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
