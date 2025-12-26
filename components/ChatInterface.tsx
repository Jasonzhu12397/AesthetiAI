
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Database, ShieldCheck, Search, Quote, Info, HeartPulse } from 'lucide-react';
import { processRAGQuery } from '../services/geminiService';
import { Message } from '../types';

interface ChatInterfaceProps {
  isAdmin?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isAdmin = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await processRAGQuery(input);
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.text,
        retrievedContext: result.context,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '系统繁忙，请稍后再试。',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[650px] transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-2xl relative border ${
      isAdmin ? 'bg-slate-900 border-cyan-500/20' : 'glass border-white/5 shadow-rose-500/5'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b border-white/5 flex items-center justify-between ${isAdmin ? 'bg-black/40' : 'bg-white/5'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
            isAdmin ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gradient-to-tr from-rose-400 to-rose-300 text-white'
          }`}>
            {isAdmin ? <Database size={24} /> : <HeartPulse size={24} />}
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              {isAdmin ? "RAG 系统底层调试" : "私人咨询助理"}
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-widest mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-rose-400'} animate-pulse`}></span>
              {isAdmin ? "DeepSeek V3 Backend Active" : "专业咨询通道已加密"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10 animate-in fade-in zoom-in duration-1000">
            <div className={`p-6 rounded-3xl mb-6 ${isAdmin ? 'bg-cyan-500/5' : 'bg-rose-500/5'}`}>
               <Sparkles size={40} className={isAdmin ? 'text-cyan-600' : 'text-rose-300'} />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">
              {isAdmin ? "请输入调试 Query" : "您好，有什么可以帮您？"}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[320px]">
              {isAdmin 
                ? "输入关键词测试本地/远程 LLM 的 RAG 检索命中率。" 
                : "基于您的个性化需求，我将为您提供最专业的医美项目解读与建议。"}
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}>
            <div className={`max-w-[90%] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-200 text-slate-900 rounded-[1.5rem] rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-slate-200 rounded-[1.5rem] rounded-tl-none'
            } px-6 py-4`}>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
              
              {/* 仅管理员可见：技术性 RAG 溯源 */}
              {isAdmin && msg.retrievedContext && msg.role === 'assistant' && (
                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    <Database size={12} /> Vector Store Hits
                  </div>
                  {msg.retrievedContext.map((ctx, i) => (
                    <div key={i} className="text-[11px] bg-black/40 p-3 rounded-xl text-slate-400 font-mono border border-white/5">
                      <Quote size={10} className="mb-1 opacity-30 text-cyan-400" />
                      {ctx}
                    </div>
                  ))}
                </div>
              )}

              {/* 用户可见：柔性合规提示 */}
              {!isAdmin && msg.role === 'assistant' && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-tight">
                  <ShieldCheck size={12} className="text-emerald-500/40" />
                  内容基于官方备案医学库生成
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[1.5rem] rounded-tl-none flex gap-2 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAdmin ? "测试 RAG 检索命中..." : "询问关于项目、恢复期或效果的问题..."}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm focus:outline-none focus:border-rose-500/30 transition-all placeholder:text-slate-600 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-3 bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-30 rounded-xl transition-all active:scale-90 shadow-xl"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
