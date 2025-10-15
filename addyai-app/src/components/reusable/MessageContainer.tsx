import type MessageProps from '../../props/MessageProps';
import Message from './Message';
import { useEffect, useRef, useState } from 'react';

function MessageContainer({
  messages,
  isLoading,
}: {
  messages: MessageProps[];
  isLoading: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Enhanced scroll to bottom with smooth animation
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current && containerRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  };

  // Check if user is at bottom of chat
  const checkIfAtBottom = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const threshold = 100; // pixels from bottom
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold);
    }
  };

  // Auto-scroll when new messages arrive, but only if user was already at bottom
  useEffect(() => {
    if (isAtBottom || isLoading) {
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, isAtBottom]);

  // Group consecutive messages from the same sender
  const groupedMessages = messages.reduce((groups: (MessageProps & { isLastInGroup: boolean, isFirstInGroup: boolean })[], message, index) => {
    const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.isUserInput !== message.isUserInput;
    const isFirstInGroup = index === 0 || messages[index - 1]?.isUserInput !== message.isUserInput;
    
    groups.push({ ...message, isLastInGroup, isFirstInGroup });
    return groups;
  }, []);

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Main Messages Container - Constrained to parent height */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 
                   scrollbar-track-transparent hover:scrollbar-thumb-slate-500 
                   transition-colors duration-200"
        onScroll={checkIfAtBottom}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(71 85 105) transparent'
        }}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          {/* Welcome Message */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-amber-500 
                            rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-200">Start a conversation</h3>
                <p className="text-slate-400 max-w-md">
                  Ask me anything! I'm here to help with questions, analysis, optimization tips, and more.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-1">
            {groupedMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                  ${msg.isFirstInGroup ? 'mt-6' : 'mt-1'}
                  ${msg.isLastInGroup ? 'mb-2' : ''}
                `}
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <Message 
                  message={msg.message} 
                  isUserInput={msg.isUserInput}
                />
              </div>
            ))}
          </div>

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6 animate-slide-up">
              <div className="max-w-[65%] relative">
                <div className="bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 
                              text-slate-200 p-4 rounded-2xl rounded-bl-md
                              shadow-lg shadow-black/20 border border-slate-600/30
                              backdrop-blur-sm relative">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-slate-400">AddyAI is thinking...</span>
                  </div>

                  {/* Typing indicator tail */}
                  <div className="absolute top-4 w-3 h-3 transform rotate-45
                                bg-gradient-to-br from-slate-700/80 to-slate-800/80 
                                -left-1.5 border-l border-t border-slate-600/30" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {!isAtBottom && messages.length > 3 && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-full shadow-lg shadow-blue-600/25
                   transition-all duration-200 hover:scale-110 active:scale-95
                   border border-blue-500/30 backdrop-blur-sm z-10"
          title="Scroll to bottom"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default MessageContainer;