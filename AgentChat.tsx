import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { AgentConfiguration, ChatMessage } from '../types';
import { generateAgentAdvice } from '../services/geminiService';

interface AgentChatProps {
  config: AgentConfiguration;
}

export const AgentChat: React.FC<AgentChatProps> = ({ config }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm Sentinel. I can help you configure your maintenance agent. Ask me about scheduling, security, or how to set up Docker services.",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const advice = await generateAgentAdvice(input, config);

    const aiMsg: ChatMessage = {
      role: 'model',
      text: advice,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
      <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex items-center gap-3">
        <Bot className="text-blue-400" />
        <div>
          <h3 className="font-bold">Sentinel Assistant</h3>
          <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-blue-400" />
              </div>
            )}
            <div 
              className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
             {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600/20 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div className="bg-gray-700 p-3 rounded-lg rounded-bl-none flex items-center">
                <Loader2 className="animate-spin text-gray-400" size={16} />
              </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your configuration..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-4 pr-12 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};