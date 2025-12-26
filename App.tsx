
import React, { useState, useCallback } from 'react';
import { 
  Flower2,
  Gem,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Settings,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { ProjectGenerator } from './components/ProjectGenerator';
import { BRAND_CONFIG } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // 用户界面 (100% 业务视角)
  const renderUserView = () => (
    <div className="animate-in fade-in duration-1000">
      <header className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-black text-rose-400 mb-10 tracking-widest uppercase backdrop-blur-md">
          <Sparkles size={12} /> 
          赋能智慧医疗美学
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1] text-white">
          遇见<br />
          <span className="gradient-text">{BRAND_CONFIG.slogan.slice(2)}</span>
        </h1>
        <p className="max-w-xl mx-auto text-slate-400 text-lg font-medium leading-relaxed mb-12 opacity-80">
          {BRAND_CONFIG.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <button 
             onClick={() => scrollToSection('consultation')}
             className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-base flex items-center justify-center gap-2 shadow-[0_25px_50px_rgba(255,255,255,0.1)] hover:-translate-y-1.5 transition-all duration-300"
           >
             立即咨询 <ArrowUpRight size={20} />
           </button>
           <div className="flex items-center gap-3 text-slate-500 text-sm font-bold tracking-tight">
             <ShieldCheck size={18} className="text-emerald-500" /> 专业医学背书
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
        <section id="consultation" className="scroll-mt-32">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2 space-y-12 py-12">
              <div className="space-y-6">
                <div className="w-16 h-1 w-24 bg-rose-500 rounded-full"></div>
                <h2 className="text-5xl font-black text-white tracking-tighter">智慧咨询助理</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  无论您是想了解玻尿酸填充、激光美肤还是面部提拉，我们的 AI 助理都能通过精准的知识匹配，为您提供即时的专业解答。
                </p>
              </div>
              
              <div className="space-y-5">
                 {[
                   { title: "全天候响应", desc: "随时随地解答您的疑问" },
                   { title: "科学方案解读", desc: "通过数据对比各项目优劣" },
                   { title: "术后安心护理", desc: "定制化的术后恢复期指导" },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                      <div className="w-2 h-2 rounded-full bg-rose-400 mt-2"></div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-lg">{item.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <ChatInterface isAdmin={false} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  // 管理端 (100% 开发者视角)
  const renderAdminView = () => (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-[0.4em]">
            <Lock size={14} /> 系统管理员后台 (开发者可见)
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">RAG 全栈实验室控制台</h2>
          <p className="text-slate-500 text-lg max-w-xl">
            此界面用于 RAG (检索增强生成) 技术的底层配置与教学展示。
          </p>
        </div>
        <button 
          onClick={() => setView('user')}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-xs font-black tracking-widest transition-all border border-white/10 uppercase"
        >
          退出管理
        </button>
      </div>
      
      <div className="grid gap-12">
        <ProjectGenerator />
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "向量库规模", value: "2.4 GB", color: "text-cyan-400" },
            { label: "LLM 平均延迟", value: "480ms", color: "text-emerald-400" },
            { label: "RAG 准确率", value: "98.2%", color: "text-rose-400" },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[2rem] border border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#01040f] text-slate-200 selection:bg-rose-500/30 overflow-x-hidden flex flex-col">
      {/* 动态背景光晕 */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-rose-500/5 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/5 blur-[150px] rounded-full animate-pulse [animation-delay:3s]"></div>
      </div>

      {/* 纯净导航 */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <div 
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => setView('user')}
          >
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Flower2 size={20} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white">{BRAND_CONFIG.name}</span>
              <span className="text-[8px] text-rose-400 font-bold uppercase tracking-[0.4em] opacity-80 mt-1">{BRAND_CONFIG.subName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <button onClick={() => scrollToSection('consultation')} className="hover:text-white transition-colors">专家建议</button>
              <button className="hover:text-white transition-colors">严选项目</button>
              <button className="hover:text-white transition-colors">关于 {BRAND_CONFIG.name}</button>
            </div>
            <button className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-black shadow-xl shadow-rose-900/30 hover:bg-rose-400 transition-all">
              立即体验
            </button>
          </div>
        </div>
      </nav>

      {/* 视图分发 */}
      <div className="flex-1">
        {view === 'user' ? renderUserView() : renderAdminView()}
      </div>

      {/* Footer (管理员入口深度隐藏) */}
      <footer className="py-24 bg-black border-t border-white/5 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-sm">{BRAND_CONFIG.name.charAt(0)}</div>
               <span className="text-lg font-black tracking-tighter text-white">{BRAND_CONFIG.name} 中心</span>
            </div>
            <p className="text-[10px] text-slate-700 tracking-[0.3em] font-black uppercase">{BRAND_CONFIG.footerNote}</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <p className="text-xs text-slate-600 font-medium max-w-sm text-center md:text-right leading-relaxed">
              {BRAND_CONFIG.riskNotice}
            </p>
            {/* 隐藏入口：设置极低透明度和无背景颜色 */}
            <button 
              onClick={() => setView(view === 'user' ? 'admin' : 'user')}
              className="text-slate-900/20 hover:text-slate-500/50 transition-colors p-2"
              title="Console"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-[9px] text-slate-800 font-black tracking-[0.5em] uppercase text-center md:text-left">
          © 2025 {BRAND_CONFIG.name.toUpperCase()} TECHNOLOGY. SECURED ACCESS.
        </div>
      </footer>
    </div>
  );
};

export default App;
