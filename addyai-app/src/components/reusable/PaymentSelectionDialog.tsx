import { useState } from 'react';
import type DialogProps from '../../props/DialogProps';

const predefinedAmounts = ['$5.00', '$10.00', '$20.00', '$25.00', '$50.00', '$100.00', 'Custom'];

export default function PaymentDialog({ show, onError, onSuccess }: DialogProps) {
  const [selectedAmount, setSelectedAmount] = useState(predefinedAmounts[0]);
  const [customAmount, setCustomAmount] = useState('');

  if (!show) return null;

  const handleSubmit = () => {
    const amountToUse = selectedAmount === 'Custom' ? customAmount : selectedAmount;
    const numericAmount = parseFloat(amountToUse.replace(/[^0-9.]/g, ''));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      onError?.('Invalid amount entered.');
    } else {
      onSuccess?.(numericAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative rounded-2xl bg-zinc-900/90 p-8 shadow-xl w-full max-w-md text-center border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
          Add Credit to Your AddyAI Balance
        </h2>

        <div className="mb-4 text-left">
          <label className="block text-zinc-300 font-medium mb-1">Select Amount</label>
          <select
            value={selectedAmount}
            onChange={e => setSelectedAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
          >
            {predefinedAmounts.map(amount => (
              <option key={amount} value={amount} className="bg-zinc-800 text-white">
                {amount}
              </option>
            ))}
          </select>
        </div>

        {selectedAmount === 'Custom' && (
          <div className="mb-4 text-left">
            <label className="block text-zinc-300 font-medium mb-1">Enter Custom Amount</label>
            <input
              type="text"
              placeholder="e.g. 42.00"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-zinc-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-amber-500 text-white rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            <div className="relative flex items-center justify-center space-x-2">
              <span>Confirm</span>
            </div>
          </button>
          <button
            onClick={() => onError?.('User cancelled')}
            className="px-6 py-3 rounded-full text-zinc-300 bg-zinc-700/50 hover:bg-zinc-700/70 transition-colors duration-200 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
