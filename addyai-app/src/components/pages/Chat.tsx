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

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage = { message, isUserInput: true };
      const newMessages = [...messagesRef.current, userMessage];
      const conversationId = localStorage.getItem(CONVERSATION_ID);

      if (!conversationId || '') {
        // If no conversationId, assume initial message and navigate to home to start new chat
        if (!initialMessage) {
          // Only navigate if it's not the initial message from start page
          navigate('/');
        }
        // Proceed with sending message, API will handle new conversation creation
      }

      messagesRef.current = newMessages;
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const res = await fetch(messagingUrl, {
          method: POST,
          headers: { 'Content-Type': APPLICATION_JSON },
          body: JSON.stringify({
            userId,
            userPrompt: message,
            customerId,
            ...(conversationId && {
              conversationId: Number(conversationId),
            }),
          }),
        });

        if (res.status !== 201) throw new Error('Bad status');

        const contentType = res.headers.get('content-type');
        const data = contentType?.includes('application/json')
          ? await res.json()
          : await res.text();

        localStorage.setItem(CONVERSATION_ID, data?.conversationId);
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
    [customerId, messagingUrl, userId, initialMessage, navigate] // Added initialMessage and navigate to dependencies
  );

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
  }, [userId, customerId, baseURL]); // Added baseURL to dependencies

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
    [userId, customerId, baseURL] // Added baseURL to dependencies
  );

  useEffect(() => {
    handleLoadingConversationHistory();
    if (initialMessage) {
      handleSendMessage(initialMessage);
    } else if (!initialMessage && messages.length === 0) {
      navigate('/');
    }
    navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed messages from dependency array to prevent infinite loop, handles initial message once.

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden relative">
      {/* Animated Background Grid & Radial Gradient - Matched from Home */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            // Static center for the radial gradient as mousePosition is not available here
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)`,
          }}
        />
        <div className="grid-background" />
      </div>

      {/* Floating Particles - Matched from Home */}
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

      <div className="relative z-10 flex flex-1 w-full">
        {/* ChatHistorySidebar - Assuming it handles its own styling within the dark theme */}
        <ChatHistorySidebar
          isPanelOpen
          isLoading={isLoading}
          isHistoryLoading={isHistoryLoading}
          conversationHistory={conversationHistory}
          loadConversationById={loadConversationById}
        />

        <div className="flex flex-col flex-1">
          {' '}
          {/* Changed w-full to flex-1 to allow sidebar space */}
          <NavBar />
          <main className="flex-1 flex flex-col items-center justify-between p-4">
            {' '}
            {/* Added padding here */}
            <MessageContainer messages={messages} isLoading={isLoading} />
            <UserImportForm isLoading={isLoading} onMessageSubmitted={handleSendMessage} />
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

      {/* Matched CSS animations from Home/Start page */}
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
