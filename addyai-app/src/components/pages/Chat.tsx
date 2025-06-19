import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../reusable/NavBar';
import { SnackBar } from '../reusable/SnackBar';
import type MessageProps from '../../props/MessageProps';
import {
  APPLICATION_JSON,
  CONVERSATION_ID,
  CUSTOMER_ID,
  POST,
  USERID,
} from '../../utils/constants';
import ChatHistorySidebar from '../reusable/ChatHistorySidebar';
import MessageContainer from '../reusable/MessageContainer';
import UserImportForm from '../reusable/UserInputForm';

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Record<
    string,
    { id: number; headline: string; createdAt: string }[]
  > | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const userId = useMemo(() => Number(localStorage.getItem(USERID)), []);
  const customerId = useMemo(() => localStorage.getItem(CUSTOMER_ID), []);

  const messagesRef = useRef<MessageProps[]>([]);
  const messagingUrl = import.meta.env.VITE_MESSAGING_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleLoadingConversationHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const params = new URLSearchParams({
        user_id: String(userId),
        customer_id: customerId ?? '',
      });
      const res = await fetch(`${baseURL}/conversation/grouped?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setConversationHistory(data);
    } catch (err) {
      console.error('Error loading chat history');
    } finally {
      setIsHistoryLoading(false);
    }
  }, [userId, customerId, baseURL]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage = { message, isUserInput: true };
      const newMessages = [...messagesRef.current, userMessage];
      let currentConversationId = localStorage.getItem(CONVERSATION_ID);

      // If no conversation ID and no initial message, navigate to home (should not happen if flow is correct)
      if (!currentConversationId && !initialMessage) {
        navigate('/');
        return; // Prevent further execution if navigating away
      }

      messagesRef.current = newMessages;
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const payload: {
          userId: number;
          userPrompt: string;
          customerId: string | null;
          conversationId?: number;
        } = {
          userId,
          userPrompt: message,
          customerId,
        };

        if (currentConversationId) {
          payload.conversationId = Number(currentConversationId);
        }

        const res = await fetch(messagingUrl, {
          method: POST,
          headers: { 'Content-Type': APPLICATION_JSON },
          body: JSON.stringify(payload),
        });

        if (res.status !== 201) throw new Error('Bad status');

        const contentType = res.headers.get('content-type');
        const data = contentType?.includes('application/json')
          ? await res.json()
          : await res.text();

        // Update conversation ID in local storage
        localStorage.setItem(CONVERSATION_ID, data?.conversationId);

        // After successfully sending the message and getting a response, reload history
        // This ensures the new conversation or updated headline appears immediately
        await handleLoadingConversationHistory();

        const botMessage = {
          message: data?.result ?? "Sorry, I wasn't able to find that answer.",
          isUserInput: false,
        };

        const updatedMessages = [...messagesRef.current, botMessage];
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);
      } catch (err) {
        console.error('Error:', err);
        setErrorMessage('Error receiving response from service. Please try again.');
        setShowSnackBar(true);
      } finally {
        setIsLoading(false);
      }
    },
    [customerId, messagingUrl, userId, initialMessage, navigate, handleLoadingConversationHistory]
  );

  const loadConversationById = useCallback(
    async (conversationId: number) => {
      try {
        const params = new URLSearchParams({
          user_id: String(userId),
          customer_id: customerId ?? '',
          conversation_id: conversationId.toString(),
        });

        const res = await fetch(`${baseURL}/conversation?${params}`);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        const exchanges = data.exchange ?? [];

        const loadedMessages: MessageProps[] = exchanges.flatMap((item: any) => [
          ...(item.input ? [{ message: item.input, isUserInput: true }] : []),
          ...(item.output ? [{ message: item.output, isUserInput: false }] : []),
        ]);

        messagesRef.current = loadedMessages;
        setMessages(loadedMessages);
        localStorage.setItem(CONVERSATION_ID, data.id);
      } catch (err) {
        console.error('Error loading conversation:', err);
        setErrorMessage('Failed to load conversation.');
        setShowSnackBar(true);
      }
    },
    [userId, customerId, baseURL]
  );

  useEffect(() => {
    // Load history on initial render
    handleLoadingConversationHistory();

    if (initialMessage) {
      handleSendMessage(initialMessage);
    } else if (!initialMessage && messages.length === 0) {
      // Only navigate to home if there's no initial message and no messages loaded
      // This prevents redirecting after a conversation has started or been loaded
      if (!localStorage.getItem(CONVERSATION_ID)) {
        navigate('/');
      }
    }
    // Clean up location state to prevent re-triggering initial message on subsequent renders
    navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
      {/* Animated Background Grid & Radial Gradient */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
          }}
        />
        <div className="grid-background" />
      </div>

      {/* Floating Particles */}
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

      <div className="relative z-10 flex flex-1 h-full min-h-0 pt-20">
        {' '}
        {/* Added pt-20 for NavBar space */}
        {/* ChatHistorySidebar */}
        <ChatHistorySidebar
          isPanelOpen
          isLoading={isLoading}
          isHistoryLoading={isHistoryLoading}
          conversationHistory={conversationHistory}
          loadConversationById={loadConversationById}
        />
        <div className="flex flex-col flex-1 min-h-0">
          <main className="flex-1 flex flex-col min-h-0">
            <MessageContainer messages={messages} isLoading={isLoading} />
            <div className="flex-shrink-0 p-4">
              {' '}
              {/* Wrapper for UserInputForm */}
              <UserImportForm isLoading={isLoading} onMessageSubmitted={handleSendMessage} />
            </div>
          </main>
        </div>
      </div>

      <SnackBar
        message={errorMessage}
        color="bg-red-600"
        duration={2000}
        onClose={() => setShowSnackBar(false)}
        show={showSnackBar}
      />

      {/* CSS animations */}
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
