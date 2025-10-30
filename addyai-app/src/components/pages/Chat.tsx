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
  REFRESH_TOKEN,
  LAST_SYNCED,
  CODE,
  CONSENT,
  OFFLINE,
} from '../../utils/constants';
import ChatHistorySidebar from '../reusable/ChatHistorySidebar';
import MessageContainer from '../reusable/MessageContainer';
import UserImportForm from '../reusable/UserInputForm';
import SignInDialog from '../reusable/SignInDialog';
import AccountSelectorDialog from '../reusable/AccountSelectorDialog';
import SyncDialog from '../reusable/SyncDialog';


export default function Chat() {
  const ESTIMATED_COST_PER_MSG = 0.05;

  const location = useLocation();
  const navigate = useNavigate();

  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;

  const [userBalance, setUserBalance] = useState(-1);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Record<
    string,
    { id: number; headline: string; createdAt: string }[]
  > | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // Dialog related states
  const [showSignInDialog, setShowSignInDialog] = useState<boolean>(false);
  const [showAccountSelectorDialog, setShowAccountSelectorDialog] = useState<boolean>(false);
  const [showSyncDialog, setShowSyncDialog] = useState<boolean>(false);


  const userId = useMemo(() => Number(localStorage.getItem(USERID)), []);
  const customerId = useMemo(() => localStorage.getItem(CUSTOMER_ID), []);

  const messagesRef = useRef<MessageProps[]>([]);
  const messagingUrl = import.meta.env.VITE_MESSAGING_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URL;
  const scope = import.meta.env.VITE_GOOGLE_SCOPE;


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

  const handleGetUserBalance = useCallback(async () => {
    const res = await fetch(`${baseURL}/user/balance?id=${userId}`);

    if (res.status !== 200) throw new Error('Bad status');
    const balance = await res.text();
    setUserBalance(Number(balance));
  }, [baseURL, userId]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage = { message, isUserInput: true };
      const newMessages = [...messagesRef.current, userMessage];
      let currentConversationId = localStorage.getItem(CONVERSATION_ID);

      if (userBalance !== -1 && userBalance < ESTIMATED_COST_PER_MSG) {
        setErrorMessage('Balance is too low. Add more credits');
        setShowSnackBar(true);
        return;
      }

      setUserBalance(userBalance - 25);

      messagesRef.current = newMessages;
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const payload: {
          userId: number;
          userPrompt: string;
          customerId: string | null;
          conversationId?: number | null;
        } = {
          userId,
          userPrompt: message,
          customerId,
          conversationId: Number(currentConversationId),
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

        if (data.conversation_id) localStorage.setItem(CONVERSATION_ID, data.conversation_id);

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
    [
      customerId,
      messagingUrl,
      userId,
      userBalance,
      handleLoadingConversationHistory,
    ]
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

  // Dialog related functions
  const getRefreshToken = useCallback(() => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: CODE,
      scope: scope,
      access_type: OFFLINE,
      prompt: CONSENT,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, [clientId, redirectUri, scope]);

  const handleSignInDialogClick = useCallback((isCancelled: boolean) => {
    if (!isCancelled) {
      getRefreshToken();
    }
    setShowSignInDialog(false);
  }, [getRefreshToken]);

  const handleAccountSelectorError = useCallback((msg: string) => {
    setShowAccountSelectorDialog(false);
    setErrorMessage(msg);
    setShowSnackBar(true);
  }, []);

  const handleAccountSelectorSuccess = useCallback(() => {
    setShowAccountSelectorDialog(false);
    if (!localStorage.getItem(LAST_SYNCED) || localStorage.getItem(LAST_SYNCED) === '') {
      setShowSyncDialog(true);
    }
    setErrorMessage('');
    setShowSnackBar(false);
  }, []);

  const handleSyncDialogError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setShowSnackBar(true);
    localStorage.removeItem(LAST_SYNCED);
  }, []);

  const handleSyncDialogSuccess = useCallback(() => {
    setShowSyncDialog(false);
    setErrorMessage('');
    setShowSnackBar(false);
  }, []);


  useEffect(() => {
    localStorage.removeItem(CONVERSATION_ID);

    if (!localStorage.getItem(REFRESH_TOKEN) || !localStorage.getItem(USERID)) {
      setShowSignInDialog(true);
    } else if (!localStorage.getItem(CUSTOMER_ID)) {
      setShowAccountSelectorDialog(true);
    } else if (!localStorage.getItem(LAST_SYNCED) || localStorage.getItem(LAST_SYNCED) === '') {
      setShowSyncDialog(true);
    } else {
      handleGetUserBalance();
      handleLoadingConversationHistory();

      const currentConversationId = localStorage.getItem(CONVERSATION_ID);

      if (initialMessage) {
        handleSendMessage(initialMessage);
      } else if (currentConversationId) {
        loadConversationById(Number(currentConversationId));
      } else if (messages.length === 0) {
        navigate('/');
      }
    }
    navigate(location.pathname, { replace: true, state: {} });
  }, [
    initialMessage,
    navigate,
    location.pathname,
    handleGetUserBalance,
    handleLoadingConversationHistory,
    loadConversationById,
    handleSendMessage,
  ]);


  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 opacity-20">
          <div className="mesh-gradient" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>


      {/* Main Content Area - Takes remaining height after NavBar */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* ChatHistorySidebar - Fixed width, constrained height */}
        <div className="flex-shrink-0 h-full">
          <ChatHistorySidebar
            isPanelOpen
            isLoading={isLoading}
            isHistoryLoading={isHistoryLoading}
            conversationHistory={conversationHistory}
            loadConversationById={loadConversationById}
          />
        </div>

        {/* Main Chat Area - Takes remaining width, constrained height */}
        <div className="flex flex-col flex-1 min-h-0 h-full">
          
          {/* NavBar - Fixed height */}
          <div className="flex-shrink-0 relative z-20">
            <NavBar />
          </div>

          {/* Messages Container - Grows to fill available space, constrained */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] rounded-t-2xl border-t border-slate-800/50" />
            <div className="relative z-10 h-full overflow-hidden">
              <MessageContainer messages={messages} isLoading={isLoading} />
            </div>
          </div>

          {/* Input Form - Fixed height at bottom */}
          <div className="flex-shrink-0 p-4 relative">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md border-t border-slate-800/50" />
            <div className="relative z-10">
              <UserImportForm isLoading={isLoading} onMessageSubmitted={handleSendMessage} />
            </div>
          </div>
          
        </div>
      </div>

      <SnackBar
        message={errorMessage}
        color="bg-red-600"
        duration={2000}
        onClose={() => setShowSnackBar(false)}
        show={showSnackBar}
      />

      {/* Dialogs */}
      <SignInDialog show={showSignInDialog} onClose={handleSignInDialogClick} />

      <AccountSelectorDialog
        show={showAccountSelectorDialog}
        onError={handleAccountSelectorError}
        onSuccess={handleAccountSelectorSuccess}
      />

      <SyncDialog
        show={showSyncDialog}
        onError={handleSyncDialogError}
        onSuccess={handleSyncDialogSuccess}
      />

      {/* CSS animations */}
      <style>{`
        .mesh-gradient {
          background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.03) 50%, transparent 70%),
                     linear-gradient(-45deg, transparent 30%, rgba(139, 92, 246, 0.03) 50%, transparent 70%);
          background-size: 100px 100px, 120px 120px;
          animation: mesh-move 25s linear infinite;
        }

        @keyframes mesh-move {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-20px, -20px) rotate(90deg); }
          50% { transform: translate(20px, -40px) rotate(180deg); }
          75% { transform: translate(-40px, 20px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgb(71 85 105);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(51 65 85);
        }

        .prose code {
          font-size: 0.875em;
          font-weight: 500;
        }

        .prose pre {
          background-color: rgba(30, 41, 59, 0.5) !important;
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}