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
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      // Use scrollTop instead of scrollIntoView for more reliable scrolling
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]); // Added isLoading to ensure scroll happens after loading ends

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {' '}
      {/* Added min-h-0 to allow shrinking */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 p-4"
      >
        <div className="w-full max-w-4xl mx-auto space-y-4">
          {' '}
          {/* Removed pt-20 since NavBar spacing is handled at layout level */}
          {messages.map((msg, idx) =>
            msg.isUserInput ? (
              <Message key={idx} message={msg.message} isUserInput={true} />
            ) : (
              <Message key={idx} message={msg.message} isUserInput={false} />
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center p-4 flex-shrink-0">
          {' '}
          {/* Added flex-shrink-0 */}
          <BeatLoader color="#4ade80" size={16} />
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
