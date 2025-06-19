import { BeatLoader } from 'react-spinners';
import type MessageProps from '../../props/MessageProps';
import Message from './Message';
import { useEffect, useRef } from 'react';

function MessageContainer({
  messages,
  isLoading,
}: {
  messages: MessageProps[];
  isLoading: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 p-4 pt-20">
        {' '}
        {/* Added pt-20 for space from NavBar */}
        {messages.map((msg, idx) =>
          msg.isUserInput ? (
            <Message key={idx} message={msg.message} isUserInput={true} />
          ) : (
            <Message key={idx} message={msg.message} isUserInput={false} />
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <BeatLoader color="#4ade80" size={16} /> {/* Green accent loader */}
        </div>
      )}
    </>
  );
}

export default MessageContainer;
