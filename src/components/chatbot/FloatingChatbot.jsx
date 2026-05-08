import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Trash2, Send, Bot, User } from 'lucide-react';
import { chatWithMistral } from '../../services/api';
import { useDashboardData } from '../../context/DashboardContext';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { issData, newsData } = useDashboardData();

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem('chatbot_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'ai', content: 'Hello! I am your dashboard assistant. I can answer questions about the ISS and current news. What would you like to know?' }]);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('chatbot_history', JSON.stringify(messages));
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const constructSystemContext = () => {
    const { currentPosition, speed, locationName, astronauts } = issData;
    const { articles } = newsData;

    let context = `You are a helpful AI assistant for a Real-Time ISS & News Dashboard. YOU CAN ONLY ANSWER QUESTIONS BASED ON THE PROVIDED DATA. DO NOT USE EXTERNAL KNOWLEDGE. If you don't know the answer based on the data below, say exactly: "I can only answer based on dashboard data."\n\n`;
    
    context += `--- CURRENT ISS DATA ---\n`;
    context += `- Latitude: ${currentPosition?.lat?.toFixed(4) || 'Unknown'}\n`;
    context += `- Longitude: ${currentPosition?.lon?.toFixed(4) || 'Unknown'}\n`;
    context += `- Speed: ${speed} km/h\n`;
    context += `- Nearest Location: ${locationName}\n`;
    context += `- Astronauts in space: ${astronauts?.count || 0}\n`;
    if (astronauts?.people?.length > 0) {
      context += `- Names: ${astronauts.people.map(p => p.name).join(', ')}\n`;
    }

    context += `\n--- LATEST NEWS HEADLINES (${articles?.length || 0} articles) ---\n`;
    if (articles && articles.length > 0) {
      articles.slice(0, 5).forEach((art, i) => {
        context += `${i+1}. Title: ${art.title}\n   Author: ${art.author || 'Unknown'}\n   Description: ${art.description}\n`;
      });
    }

    return context;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    
    // Keep only last 30 chats
    if (newMessages.length > 30) {
      newMessages.splice(0, newMessages.length - 30);
    }
    
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const systemContext = constructSystemContext();
      const reply = await chatWithMistral(userMsg, systemContext);
      
      setMessages(prev => {
        const updated = [...prev, { role: 'ai', content: reply }];
        if (updated.length > 30) updated.splice(0, updated.length - 30);
        return updated;
      });
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the AI service. Please check your API token.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', content: 'Hello! I am your dashboard assistant. I can answer questions about the ISS and current news. What would you like to know?' }]);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[340px] sm:w-[400px] glass rounded-2xl overflow-hidden flex flex-col z-50 transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '520px', maxHeight: '80vh' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/15 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Dashboard AI</h3>
              <p className="text-[10px] text-white/70">Powered by Mistral</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearChat} title="Clear Chat" className="p-1.5 hover:bg-white/15 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} title="Close" className="p-1.5 hover:bg-white/15 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/80 dark:bg-slate-900/80 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl p-3 text-[13px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-sm' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 rounded-bl-md shadow-sm'
              }`}>
                <div className="flex items-center gap-1.5 mb-1 opacity-60 text-[10px] font-medium">
                  {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  <span>{msg.role === 'user' ? 'You' : 'AI'}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl rounded-bl-md p-3.5 flex gap-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ISS or News…"
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/40 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm outline-none transition-all dark:text-slate-200"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-40 transition-all active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FloatingChatbot;
