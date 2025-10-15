import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ReactGA from 'react-ga4';

interface UserImportFormProps {
  isLoading: boolean;
  onMessageSubmitted: (message: string) => void;
}

function UserImportForm({ isLoading, onMessageSubmitted }: UserImportFormProps) {
  const [message, setMessage] = useState('');

  const handleMessageSubmit = (event: React.FormEvent) => {
    // send Google Analytics Event
    ReactGA.event({
      category: 'User Interaction',
      action: 'Clicked Button',
      label: 'Sent Message',
    });

    event.preventDefault();
    if (message.trim() === '' || isLoading) return;

    onMessageSubmitted(message);
    setMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleMessageSubmit(event as any);
    }
  };

  return (
    <div className="w-full bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/80 
                    border-t border-slate-700/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-auto p-4">
        <form onSubmit={handleMessageSubmit} className="relative">
          <div className="flex items-end gap-3 p-3 
                        bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80
                        rounded-2xl border border-slate-600/30 shadow-lg shadow-black/20
                        backdrop-blur-sm transition-all duration-300
                        focus-within:border-green-400/50 focus-within:shadow-green-400/10">
            
            {/* Input Field */}
            <div className="flex-1 min-w-0">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-slate-200 placeholder-slate-400 
                         resize-none outline-none text-base leading-6
                         disabled:opacity-50 disabled:cursor-not-allowed
                         scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
                style={{
                  minHeight: '24px',
                  maxHeight: '120px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgb(71 85 105) transparent'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || message.trim() === ''}
              className="flex-shrink-0 w-10 h-10 rounded-xl
                       bg-gradient-to-r from-green-400 to-amber-400
                       hover:from-green-400 hover:to-amber-400
                       disabled:from-slate-600 disabled:to-slate-700
                       text-white flex items-center justify-center
                       shadow-lg shadow-green-500/25 hover:shadow-green-400/30
                       transition-all duration-200 
                       hover:scale-105 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:hover:scale-100 disabled:shadow-slate-600/10
                       border border-green-400/20 disabled:border-slate-600/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Character count or status indicator */}
          {message.length > 0 && (
            <div className="flex justify-between items-center mt-2 px-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-700/50 border border-slate-600/50 rounded text-xs">
                    Enter
                  </kbd>
                  <span>to send</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-700/50 border border-slate-600/50 rounded text-xs">
                    Shift + Enter
                  </kbd>
                  <span>for new line</span>
                </span>
              </div>
              <span className={`${message.length > 1000 ? 'text-amber-400' : 'text-slate-500'}`}>
                {message.length}/2000
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UserImportForm;