import { useState } from 'react';
import { Send } from 'lucide-react'; // Import the Send icon

interface UserImportFormProps {
  isLoading: boolean;
  onMessageSubmitted: (message: string) => void;
}

function UserImportForm({ isLoading, onMessageSubmitted }: UserImportFormProps) {
  const [message, setMessage] = useState('');

  const handleMessageSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() === '') return;

    onMessageSubmitted(message);
    setMessage('');
  };

  return (
    <>
      <form onSubmit={handleMessageSubmit} className="w-full">
        <div className="flex items-center justify-center w-full max-w-4xl mx-auto p-4 rounded-t-2xl bg-zinc-900/50 backdrop-blur-md border-t border-zinc-700/50 shadow-lg">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Ask AddyAI..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-zinc-400 border border-green-400/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 mr-3 text-base"
          />
          <button
            className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-amber-500 text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <Send className="w-6 h-6" /> {/* Using the Send icon */}
          </button>
        </div>
      </form>
    </>
  );
}

export default UserImportForm;
