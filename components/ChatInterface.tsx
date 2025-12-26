
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Database, ShieldCheck, HeartPulse, Settings2, X, ChevronDown, Check } from 'lucide-react';
import { processRAGQuery, LLMConfig } from '../services/geminiService';
import { Message } from '../types';

interface ChatInterfaceProps {
  isAdmin?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isAdmin = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // 从本地存储加载配置
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => {
    const saved = localStorage.getItem('llm_config');
    if (saved) return JSON.parse(saved);
    return {
      baseUrl: "https://api.deepseek.com/v1",
      apiKey: "",
      model: "deepseek-chat"
    };
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('llm_config', JSON.stringify(llmConfig));
  }, [llmConfig]);

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
      const result = await processRAGQuery(input, llmConfig);
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
        content: '系统连接失败，请检查设置。',
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
      
      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute inset-0 z-50 glass backdrop-blur-2xl p-8 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Settings2 size={20} className="text-rose-400" /> 模型配置
            </h3>
            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Endpoint</label>
              <input 
                type="text" 
                value={llmConfig.baseUrl}
                onChange={e => setLlmConfig({...llmConfig, baseUrl: e.target.value})}
                placeholder="https://api.deepseek.com/v1"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-100 outline-none focus:border-rose-500/50"
              />
              <p className="text-[10px] text-slate-600">本地部署通常为 http://localhost:11434/v1 (Ollama)</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Key</label>
              <input 
                type="password" 
                value={llmConfig.apiKey}
                onChange={e => setLlmConfig({...llmConfig, apiKey: e.target.value})}
                placeholder="sk-..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-100 outline-none focus:border-rose-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model ID</label>
              <input 
                type="text" 
                value={llmConfig.model}
                onChange={e => setLlmConfig({...llmConfig, model: e.target.value})}
                placeholder="deepseek-chat or llama3"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-100 outline-none focus:border-rose-500/50"
              />
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-rose-900/20 transition-all"
            >
              <Check size={18} /> 保存并应用配置
            </button>
          </div>
        </div>
      )}

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
              {isAdmin ? "底层 RAG 调试模式" : "私人咨询助理"}
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-widest mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-rose-400'} animate-pulse`}></span>
              {llmConfig.model} 在线中
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
          title="模型配置"
        >
          <Settings2 size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10 animate-in fade-in zoom-in duration-1000">
            <div className={`p-6 rounded-3xl mb-6 ${isAdmin ? 'bg-cyan-500/5' : 'bg-rose-500/5'}`}>
               <Sparkles size={40} className={isAdmin ? 'text-cyan-600' : 'text-rose-300'} />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">
              {isAdmin ? "进入调试环境" : "您好，有什么可以帮您？"}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[320px]">
              {isAdmin 
                ? "支持多模型接入，点击右上角齿轮可切换本地/云端 LLM。" 
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
              
              {isAdmin && msg.retrievedContext && msg.role === 'assistant' && (
                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    <Database size={12} /> 知识库命中片段
                  </div>
                  {msg.retrievedContext.map((ctx, i) => (
                    <div key={i} className="text-[11px] bg-black/40 p-3 rounded-xl text-slate-400 font-mono border border-white/5">
                      {ctx}
                    </div>
                  ))}
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
            placeholder={isAdmin ? "发送 Query 测试检索效率..." : "咨询关于项目、恢复期或效果的问题..."}
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
