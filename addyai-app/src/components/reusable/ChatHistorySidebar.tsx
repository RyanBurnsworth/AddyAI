// ChatHistorySidebar.tsx
import { useState } from 'react';
import classNames from 'classnames';
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import { RiChatNewLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

interface ChatHistorySidebarProps {
  isPanelOpen: boolean;
  isLoading: boolean;
  isHistoryLoading: boolean;
  conversationHistory: Record<string, { id: number; headline: string; createdAt: string }[]> | null;
}

export default function ChatHistorySidebar({
  isPanelOpen: defaultOpen,
  isLoading,
  isHistoryLoading,
  conversationHistory,
}: ChatHistorySidebarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);
  const navigate = useNavigate();

  return (
    <aside
      className={classNames(
        'bg-zinc-900 text-white p-4 flex flex-col transition-all duration-300 sm:flex border-r border-zinc-700/50 h-screen', // Added h-screen for full height
        {
          'w-64': isPanelOpen,
          'w-16 items-center': !isPanelOpen,
        }
      )}
    >
      {/* Header section - fixed height */}
      <div className="flex flex-row justify-between items-center mb-8 flex-shrink-0">
        {isPanelOpen && (
          <RiChatNewLine
            size={28}
            title="Start New Chat"
            onClick={() => window.location.href = '/chat'}
            className="text-green-400 cursor-pointer hover:text-green-300 transition-colors"
          />
        )}
        {isPanelOpen ? (
          <LuPanelLeftClose
            size={28}
            onClick={() => setIsPanelOpen(false)}
            title="Close Panel"
            className="text-amber-400 cursor-pointer hover:text-amber-300 transition-colors"
          />
        ) : (
          <LuPanelLeftOpen
            size={28}
            onClick={() => setIsPanelOpen(true)}
            title="Open Panel"
            className="text-amber-400 cursor-pointer hover:text-amber-300 transition-colors"
          />
        )}
      </div>

      {/* Scrollable content section */}
      {isPanelOpen && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 space-y-6">
          {isHistoryLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg
                className="animate-spin h-8 w-8 text-green-400"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          ) : conversationHistory &&
            Object.entries(conversationHistory).some(
              ([_, conversations]) => conversations.length > 0
            ) ? (
            Object.entries(conversationHistory)
              .filter(([_, conversations]) => conversations.length > 0)
              .map(([period, conversations]) => (
                <div key={period}>
                  <h3 className="text-xs text-zinc-500 uppercase mb-3 font-semibold tracking-wider">
                    {period.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </h3>
                  <ul className="space-y-2">
                    {conversations.map(conv => (
                      <li
                        key={conv.id}
                        className="text-sm text-zinc-300 hover:bg-zinc-800/70 p-3 rounded-md cursor-pointer transition-colors duration-200"
                        onClick={() => {
                          if (!isLoading) navigate(`/chat?conversationId=${conv.id}`);
                        }}
                      >
                        {conv.headline}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <p className="text-zinc-500 text-sm italic pt-4">No Chat History Yet!</p>
          )}
        </div>
      )}
    </aside>
  );
}
