import { useEffect, useState, useMemo } from 'react';
import NavBar from '../reusable/NavBar';
import { CUSTOMER_ID, USERID } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

// Define a type for chat history items
interface ChatHistoryItem {
  id: number;
  headline: string;
  createdAt: string;
}

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<Record<string, ChatHistoryItem[]> | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useMemo(() => Number(localStorage.getItem(USERID)), []);
  const customerId = useMemo(() => localStorage.getItem(CUSTOMER_ID), []);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate(); // Initialize useNavigate

  // This function will be responsible for fetching the conversation history.
  const fetchConversationHistory = async () => {
    setIsHistoryLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        user_id: String(userId),
        customer_id: customerId ?? '',
      });

      const res = await fetch(`${baseURL}/conversation/grouped?${params}`);
      if (!res.ok) {
        throw new Error('Failed to fetch conversation history');
      }
      const data = await res.json();
      setChatHistory(data);
    } catch (err) {
      console.error('Error fetching conversation history:', err);
      setError('Failed to load conversation history. Please try again later.');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleViewConversation = (conversationId: number) => {
    ReactGA.event({
      category: 'User Interaction',
      action: 'Clicked Conversation',
      label: 'Changed Conversation from History',
    });

    navigate(`/chat?conversationId=${conversationId}`);
  };

  useEffect(() => {
    fetchConversationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, customerId, baseURL]); // Re-fetch if userId, customerId, or baseURL changes

  // Helper function to flatten the grouped history into a single array for easier rendering
  const flattenedHistory = useMemo(() => {
    if (!chatHistory) return [];
    return Object.keys(chatHistory)
      .flatMap(date => chatHistory[date].map(item => ({ date, ...item })))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by most recent
  }, [chatHistory]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
      {/* Animated Background Grid & Radial Gradient (Copied from Chat.tsx) */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
          }}
        />
        <div className="grid-background" />
      </div>

      {/* Floating Particles (Copied from Chat.tsx) */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* NavBar - positioned above everything */}
      <NavBar />

      <div className="relative z-10 flex flex-1 h-full min-h-0 pt-20 px-4 sm:px-6 lg:px-8">
        <main className="flex-1 flex flex-col items-center justify-start min-h-0 py-8">
          <h1 className="text-4xl font-bold mb-8 animate-slide-up">Your Conversation History</h1>

          {isHistoryLoading && (
            <p className="text-gray-400 animate-fade-in">Loading conversations...</p>
          )}

          {error && (
            <div className="bg-red-700 text-white p-4 rounded-lg animate-fade-in">
              <p>{error}</p>
            </div>
          )}

          {!isHistoryLoading && !error && flattenedHistory.length === 0 && (
            <p className="text-gray-400 animate-fade-in">No conversations found.</p>
          )}

          {!isHistoryLoading && !error && flattenedHistory.length > 0 && (
            <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-xl bg-zinc-800/70">
              <table className="min-w-full divide-y divide-zinc-700 hidden sm:table">
                <thead className="bg-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Conversation ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Headline
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {flattenedHistory.map(conv => (
                    <tr
                      key={conv.id}
                      className="hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleViewConversation(conv.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-200">
                          {new Date(conv.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(conv.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">
                        {conv.id}
                      </td>
                      <td className="px-6 py-4 text-gray-200 line-clamp-2">{conv.headline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile card layout */}
              <div className="sm:hidden flex flex-col space-y-4 p-2">
                {flattenedHistory.map(conv => (
                  <div
                    key={conv.id}
                    className="bg-zinc-900/80 p-4 rounded-lg border border-zinc-700 hover:bg-zinc-800 cursor-pointer transition-colors"
                    onClick={() => handleViewConversation(conv.id)}
                  >
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>{new Date(conv.createdAt).toLocaleDateString()}</span>
                      <span className="text-green-400 font-medium">#{conv.id}</span>
                    </div>
                    <div className="text-gray-200 text-base font-medium">{conv.headline}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CSS animations (Copied from Chat.tsx) */}
      <style>{`
        .grid-background {
          background-image: linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes gradient-x-delayed {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: right center;
          }
          50% {
            background-size: 200% 200%;
            background-position: left center;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
        .animate-gradient-x-delayed {
          animation: gradient-x-delayed 6s ease infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
