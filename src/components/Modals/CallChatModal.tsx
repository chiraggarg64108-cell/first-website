import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { Send, Phone, MessageSquare, Mic, X, CheckCheck } from 'lucide-react';

interface CallChatModalProps {
  onClose: () => void;
  initialMode?: 'chat' | 'call';
}

export const CallChatModal: React.FC<CallChatModalProps> = ({ onClose, initialMode = 'chat' }) => {
  const { currentTrip } = useRide();
  const [mode, setMode] = useState<'chat' | 'call'>(initialMode);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: "Hello! I am on 7th Ave turning onto 42nd St right now. See you in about 2 minutes!",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  if (!currentTrip || !currentTrip.driver) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = { sender: 'user' as const, text: inputText, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Driver automatic reply simulation
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'driver',
          text: "Got it! Look for the yellow cab with plate " + currentTrip.driver?.vehicle.plate + " with hazard lights on.",
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  const quickReplies = [
    "I'm wearing a black jacket",
    "Waiting right outside the entrance",
    "Running 1 minute late!",
    "I see your yellow taxi!"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-neutral-100 flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentTrip.driver.avatar}
              alt={currentTrip.driver.name}
              className="w-10 h-10 rounded-full object-cover border border-yellow-400"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{currentTrip.driver.name}</h4>
              <p className="text-[11px] text-yellow-400 font-mono">
                {currentTrip.driver.vehicle.model} ({currentTrip.driver.vehicle.plate})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setMode(m => m === 'call' ? 'chat' : 'call');
                setCallActive(true);
              }}
              className={`p-2 rounded-xl transition-colors ${
                mode === 'call' ? 'bg-yellow-400 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {mode === 'call' ? (
          /* Simulated Voice Call Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-yellow-400/20 animate-ping absolute inset-0" />
              <img
                src={currentTrip.driver.avatar}
                alt={currentTrip.driver.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{currentTrip.driver.name}</h3>
              <p className="text-xs text-yellow-400 mt-1 font-mono">
                {callActive ? 'Voice Call Connected · 00:14' : 'Calling driver via RideWeb In-App Voice...'}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Number Masking Active for Rider Privacy</p>
            </div>

            <div className="pt-6 flex items-center gap-6">
              <button
                onClick={() => {
                  setCallActive(false);
                  setMode('chat');
                }}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                <Phone className="w-6 h-6 rotate-135" />
              </button>
            </div>
          </div>
        ) : (
          /* Simulated In-App Chat Screen */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs ${
                      m.sender === 'user'
                        ? 'bg-yellow-400 text-neutral-950 font-medium rounded-tr-none'
                        : 'bg-neutral-800 text-neutral-100 rounded-tl-none border border-neutral-700/60'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-0.5 px-1 flex items-center gap-1">
                    {m.time} {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-yellow-500" />}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-3 py-1.5 border-t border-neutral-800 bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto text-nowrap">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputText(qr);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] shrink-0 border border-neutral-700/50"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Message your driver..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:hover:bg-yellow-400 text-neutral-950 font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
