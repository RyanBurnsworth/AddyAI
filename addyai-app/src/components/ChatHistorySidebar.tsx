// ChatHistorySidebar.tsx
import { useState } from "react";
import classNames from "classnames";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { RiChatNewLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

interface ChatHistorySidebarProps {
  isPanelOpen: boolean;
  isLoading: boolean;
  isHistoryLoading: boolean;
  conversationHistory: Record<string, { id: number; headline: string; createdAt: string }[]> | null;
  loadConversationById: (id: number) => void;
}

export default function ChatHistorySidebar({
  isPanelOpen: defaultOpen,
  isLoading,
  isHistoryLoading,
  conversationHistory,
  loadConversationById,
}: ChatHistorySidebarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);
  const navigate = useNavigate();

  return (
    <aside
      className={classNames(
        "bg-zinc-900 text-white p-4 flex-col transition-all duration-300 hidden sm:flex",
        {
          "w-64": isPanelOpen,
          "w-12": !isPanelOpen,
        }
      )}
    >
      <div className="flex flex-row justify-between items-center mt-2 mb-8">
        {isPanelOpen && (
          <RiChatNewLine
            size={24}
            title="Start New Chat"
            onClick={() => navigate("/")}
            className="text-green-400 cursor-pointer"
          />
        )}
        {isPanelOpen ? (
          <LuPanelLeftClose
            size={24}
            onClick={() => setIsPanelOpen(false)}
            title="Close Panel"
            className="text-amber-400 cursor-pointer"
          />
        ) : (
          <LuPanelLeftOpen
            size={24}
            onClick={() => setIsPanelOpen(true)}
            title="Open Panel"
            className="text-amber-400 cursor-pointer"
          />
        )}
      </div>

      {isPanelOpen && (
        <div className="space-y-4">
          {isHistoryLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg
                className="animate-spin h-6 w-6 text-amber-400"
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
                  <h3 className="text-xs text-zinc-400 uppercase mb-2">
                    {period
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h3>
                  <ul className="space-y-1">
                    {conversations.map((conv) => (
                      <li
                        key={conv.id}
                        className="text-sm text-white hover:bg-zinc-800 p-2 rounded cursor-pointer"
                        onClick={() => {
                          if (!isLoading) loadConversationById(conv.id);
                        }}
                      >
                        {conv.headline}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <p className="text-zinc-400 text-sm">No Chat History Yet!</p>
          )}
        </div>
      )}
    </aside>
  );
}