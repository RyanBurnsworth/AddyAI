import { useEffect, useRef, useState } from "react";
import type MessageProps from "../../props/MessageProps";
import MessageContainer from "../MessageContainer";
import UserImportForm from "../UserInputForm";
import { useLocation, useNavigate } from "react-router-dom";
import { SnackBar } from "../reusable/SnackBar";
import {
  APPLICATION_JSON,
  CONVERSATION_ID,
  CUSTOMER_ID,
  POST,
  USERID,
} from "../../utils/constants";
import NavBar from "../reusable/NavBar";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import classNames from "classnames";
import { RiChatNewLine } from "react-icons/ri";

export default function ChatContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialMessage = (location.state as { initialMessage?: string })
    ?.initialMessage;

  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);

  const [conversationHistory, setConversationHistory] = useState<Record<
    string,
    { id: number; headline: string; createdAt: string }[]
  > | null>(null);

  const messagesRef = useRef<MessageProps[]>([]);

  let response: any;
  const handleSendMessage = async (message: string) => {
    const userMessage = { message, isUserInput: true };

    const userId = Number(localStorage.getItem(USERID));
    const customerId = localStorage.getItem(CUSTOMER_ID);
    const conversationId = localStorage.getItem(CONVERSATION_ID) ?? undefined;
    const messagingUrl = import.meta.env.VITE_MESSAGING_URL;

    const newMessages = [...messagesRef.current, userMessage];
    messagesRef.current = newMessages;

    setMessages(newMessages);
    setIsLoading(true);

    try {
      response = await fetch(messagingUrl, {
        method: POST,
        headers: {
          "Content-Type": APPLICATION_JSON,
        },
        body: JSON.stringify({
          userId,
          userPrompt: message,
          customerId,
          ...(conversationId !== undefined && {
            conversationId: Number(conversationId),
          }),
        }),
      });

      if (response.status !== 201) {
        setErrorMessage("Failed to receive incoming message");
        setShowSnackBar(true);
        return;
      }

      let incoming;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        incoming = await response.json();
      } else {
        incoming = await response.text();
      }

      localStorage.setItem(CONVERSATION_ID, incoming?.conversationId);

      const botMessage = {
        message:
          incoming?.result ?? "Sorry, I wasn't able to find that answer.",
        isUserInput: false,
      };

      const updatedMessages = [...messagesRef.current, botMessage];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      setIsLoading(false);
    } catch (err) {
      console.error("Fetching error: ", err);
      setIsLoading(false);
      setErrorMessage(
        "Error receiving response from service. Please try again."
      );
      setShowSnackBar(true);
    }
  };

  const handleLoadingConversationHistory = async () => {
    setIsHistoryLoading(true); // ← Start spinner

    const params = new URLSearchParams({
      user_id: localStorage.getItem(USERID)!!,
      customer_id: localStorage.getItem(CUSTOMER_ID)!!,
    });

    try {
      const response = await fetch(
        `http://localhost:3000/conversation/grouped?${params.toString()}`
      );

      if (response.status !== 200) {
        setErrorMessage("Failed to load conversation history");
        setShowSnackBar(true);
        return;
      }

      const data = await response.json();
      setConversationHistory(data || {});
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error loading history");
      setShowSnackBar(true);
    } finally {
      setIsHistoryLoading(false); // ← End spinner
    }
  };

  useEffect(() => {
    handleLoadingConversationHistory();

    if (initialMessage) {
      handleSendMessage(initialMessage);
      location.state = null; // clear after use
    } else if (!initialMessage && messages.length == 0) {
      navigate("/");
      return;
    }

    // Remove initialMessage from location.state to prevent re-triggering
    navigate(location.pathname, { replace: true });
  }, [initialMessage]);

  const loadConversationById = async (conversationId: number) => {
    try {
      const params = new URLSearchParams({
        user_id: localStorage.getItem(USERID)!!,
        customer_id: localStorage.getItem(CUSTOMER_ID)!!,
        conversation_id: conversationId.toString(),
      });

      const response = await fetch(
        `http://localhost:3000/conversation?${params.toString()}`
      );

      if (response.status !== 200) {
        setErrorMessage("Failed to load conversation");
        setShowSnackBar(true);
        return;
      }

      const data = await response.json();

      const exchanges = data.exchange ?? [];

      const loadedMessages: MessageProps[] = exchanges.flatMap((item: any) => {
        const messages: MessageProps[] = [];
        if (item.input) {
          messages.push({ message: item.input, isUserInput: true });
        }
        if (item.output) {
          messages.push({ message: item.output, isUserInput: false });
        }
        return messages;
      });

      setMessages(loadedMessages);
      messagesRef.current = loadedMessages; // update the ref too
      localStorage.setItem(CONVERSATION_ID, data.id);
    } catch (error) {
      console.error("Error loading conversation:", error);
      setErrorMessage("Failed to load conversation.");
      setShowSnackBar(true);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <div className="flex flex-1 w-full">
        {/* 👇 Transition Panel */}
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
                className="text-green-400"
              />
            )}
            {isPanelOpen ? (
              <LuPanelLeftClose
                size={24}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                title="Close Panel"
                className="text-amber-400"
              />
            ) : (
              <LuPanelLeftOpen
                size={24}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                title="Open Panel"
                className="text-amber-400"
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
                            onClick={() => loadConversationById(conv.id)}
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

        <div className="flex flex-col w-full">
          <NavBar />
          <main className="flex-1 flex flex-col items-center justify-between">
            <MessageContainer messages={messages} isLoading={isLoading} />
            <UserImportForm onMessageSubmitted={handleSendMessage} />
          </main>
        </div>
      </div>

      <SnackBar
        message={errorMessage}
        color="bg-red-900"
        duration={2000}
        onClose={() => setShowSnackBar(false)}
        show={showSnackBar}
      />
    </div>
  );
}
