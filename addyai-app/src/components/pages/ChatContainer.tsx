// ChatContainer.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../reusable/NavBar';
import MessageContainer from '../MessageContainer';
import UserImportForm from '../UserInputForm';
import { SnackBar } from '../reusable/SnackBar';
import type MessageProps from '../../props/MessageProps';
import {
  APPLICATION_JSON,
  CONVERSATION_ID,
  CUSTOMER_ID,
  POST,
  USERID,
} from '../../utils/constants';
import ChatHistorySidebar from '../ChatHistorySidebar';

export default function ChatContainer() {
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

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage = { message, isUserInput: true };
      const newMessages = [...messagesRef.current, userMessage];
      const conversationId = localStorage.getItem(CONVERSATION_ID);

      if (!conversationId || '') navigate('/');

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
    [customerId, messagingUrl, userId]
  );

  const handleLoadingConversationHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const params = new URLSearchParams({
        user_id: String(userId),
        customer_id: customerId ?? '',
      });
      const res = await fetch(`http://localhost:3000/conversation/grouped?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setConversationHistory(data);
    } catch (err) {
      console.error('Error loading chat history');
    } finally {
      setIsHistoryLoading(false);
    }
  }, [userId, customerId]);

  const loadConversationById = useCallback(
    async (conversationId: number) => {
      try {
        const params = new URLSearchParams({
          user_id: String(userId),
          customer_id: customerId ?? '',
          conversation_id: conversationId.toString(),
        });

        const res = await fetch(`http://localhost:3000/conversation?${params}`);
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
    [userId, customerId]
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
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <div className="flex flex-1 w-full">
        <ChatHistorySidebar
          isPanelOpen
          isLoading={isLoading}
          isHistoryLoading={isHistoryLoading}
          conversationHistory={conversationHistory}
          loadConversationById={loadConversationById}
        />

        <div className="flex flex-col w-full">
          <NavBar />
          <main className="flex-1 flex flex-col items-center justify-between">
            <MessageContainer messages={messages} isLoading={isLoading} />
            <UserImportForm isLoading={isLoading} onMessageSubmitted={handleSendMessage} />
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
