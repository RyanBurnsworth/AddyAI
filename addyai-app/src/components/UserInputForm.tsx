import { useState } from 'react';

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
      <form onSubmit={handleMessageSubmit}>
        <div className="flex items-center justify-center w-full sm:w-[400px] md:w-[600px] lg:w-[1000px] p-4 rounded-b-md shadow-md">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Ask AddyAI..."
            className="w-full m-4 p-4 border-green-400 border-2 focus:outline-none focus:ring-0 focus:border-green-400 text-white"
          />
          <button
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow"
            disabled={isLoading}
          >
            +
          </button>
        </div>
      </form>
    </>
  );
}

export default UserImportForm;
