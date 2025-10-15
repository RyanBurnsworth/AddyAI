import type MessageProps from '../../props/MessageProps';
import { useState } from 'react';

export default function Message({ message, isUserInput }: MessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleCopyMessage = async () => {
    try {
      // Strip HTML tags for plain text copy
      const plainText = message.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(plainText);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className={`flex mb-6 animate-slide-up ${isUserInput ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          relative max-w-[65%] group transition-all duration-300 ease-out
          ${isHovered ? 'transform scale-[1.02]' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Message Bubble */}
        <div
          className={`
            relative p-4 backdrop-blur-sm transition-all duration-300
            ${isUserInput 
              ? `bg-gradient-to-br from-green-400 via-green-600 to-green-700 
                 text-white rounded-2xl rounded-br-md
                 shadow-lg shadow-green-400/25 border border-green-400/20
                 hover:shadow-xl hover:shadow-green-400/30`
              : `bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 
                 text-slate-100 rounded-2xl rounded-bl-md
                 shadow-lg shadow-black/20 border border-slate-600/30
                 hover:shadow-xl hover:shadow-black/30`
            }
          `}
        >
          {/* Message Content */}
          {isUserInput ? (
            <p className="text-green-50 leading-relaxed font-medium">
              {message}
            </p>
          ) : (
            <div 
              className="text-slate-200 leading-relaxed prose prose-invert prose-sm max-w-none
                         prose-p:my-2 prose-code:bg-slate-700/50 prose-code:px-2 prose-code:py-1 
                         prose-code:rounded prose-code:text-green-300"
              dangerouslySetInnerHTML={{ __html: message }} 
            />
          )}

          {/* Message Tail */}
          <div
            className={`
              absolute top-4 w-3 h-3 transform rotate-45
              ${isUserInput 
                ? 'bg-gradient-to-br from-green-400 to-green-600 -right-1.5 border-r border-b border-green-400/20'
                : 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 -left-1.5 border-l border-t border-slate-600/30'
              }
            `}
          />

          {/* Subtle inner glow */}
          <div
            className={`
              absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300
              ${isUserInput ? 'rounded-br-md' : 'rounded-bl-md'}
              ${isHovered 
                ? isUserInput 
                  ? 'bg-gradient-to-br from-green-400/10 to-transparent opacity-100'
                  : 'bg-gradient-to-br from-slate-400/10 to-transparent opacity-100'
                : 'opacity-0'
              }
            `}
          />
        </div>

        {/* Hover Actions */}
        <div
          className={`
            absolute ${isUserInput ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}
            top-1/2 -translate-y-1/2 flex items-center space-x-2 px-3
            transition-all duration-200 ease-out
            ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}
        >
          <button
            onClick={handleCopyMessage}
            className="p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 
                     border border-slate-500/30 transition-all duration-200
                     hover:scale-110 active:scale-95"
            title="Copy message"
          >
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Copy Feedback */}
        {showCopyFeedback && (
          <div
            className={`
              absolute ${isUserInput ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}
              top-1/2 -translate-y-1/2 px-3 py-1 bg-green-600 text-white text-xs
              rounded-full border border-green-500 animate-fade-in px-4
            `}
          >
            Copied!
          </div>
        )}

        {/* Timestamp (shows on hover) */}
        <div
          className={`
            absolute ${isUserInput ? 'left-0 -translate-x-full pr-3' : 'right-0 translate-x-full pl-3'}
            bottom-0 text-xs text-slate-400 transition-all duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}