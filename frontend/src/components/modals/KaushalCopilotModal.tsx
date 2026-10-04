'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { clsx } from 'clsx';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  HelpCircle,
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';
import { COPILOT_KNOWLEDGE } from '@/lib/demoData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  runId?: string;
  confidence?: number;
}

export const KaushalCopilotModal: React.FC = () => {
  const { copilotOpen, setCopilotOpen, language, t } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'नमस्ते! मैं कौशल कोपायलट हूँ — एमएसडीई श्रम बाजार बुद्धिमत्ता सहायक। आप मुझसे किसी भी जिले में कौशल अंतराल, मांग पूर्वानुमान, या सीट पुनर्वितरण के बारे में पूछ सकते हैं।'
        : 'Welcome! I am Kaushal Copilot — MSDE Labour Market Intelligence Assistant. Ask me about district shortages, 6-month forecasts, explainability drivers, or policy seat reallocation impacts.',
      timestamp: 'Just now',
      source: 'LMIS Analytics Engine',
      runId: 'RUN-2026-10-04-001',
      confidence: 94
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!copilotOpen) return null;

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Find grounded match in verified deterministic knowledge base
    const lower = textToSend.toLowerCase();
    let match = COPILOT_KNOWLEDGE.find(k => 
      lower.includes(k.query) || (k.queryHi && lower.includes(k.queryHi))
    );

    if (!match) {
      if (lower.includes('solar') || lower.includes('सोलर') || lower.includes('pv') || lower.includes('why is solar')) {
        match = COPILOT_KNOWLEDGE[0];
      } else if (lower.includes('gorakhpur') || lower.includes('गोरखपुर') || lower.includes('shortage') || lower.includes('कमी')) {
        match = COPILOT_KNOWLEDGE[1];
      } else if (lower.includes('retail') || lower.includes('रिटेल') || lower.includes('oversupply') || lower.includes('oversupplied') || lower.includes('अतिआपूर्ति')) {
        match = COPILOT_KNOWLEDGE[2];
      } else if (lower.includes('uttar pradesh') || lower.includes('उत्तर प्रदेश') || lower.includes('up') || lower.includes('increase training')) {
        match = COPILOT_KNOWLEDGE[3];
      } else if (lower.includes('500') || lower.includes('seats') || lower.includes('add') || lower.includes('reallocation')) {
        match = COPILOT_KNOWLEDGE[4];
      }
    }

    setTimeout(() => {
      let botResponse: Message;

      if (match) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: language === 'hi' ? match.answerHi : match.answerEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'LMIS Analytics Multi-Source Aggregate',
          runId: match.runId,
          confidence: match.confidence
        };
      } else {
        // Section 19 & 20 Mandate: Copilot must NEVER invent analytical values when data is insufficient
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: language === 'hi'
            ? 'मेरे पास इस प्रश्न का विश्वसनीय उत्तर देने के लिए पर्याप्त डेटा नहीं है। कृपया किसी मान्य एमएसडीई जिले (जैसे गोरखपुर, लखनऊ, पुणे, बेंगलुरु) या मान्यता प्राप्त NCO व्यापार कोड के बारे में पूछें।'
            : "I don't have enough data to answer this reliably. Please query a valid MSDE district (e.g., Gorakhpur, Lucknow, Pune, Bengaluru) or recognized NCO-2015 trade code.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Data Governance Insufficient Evidence Protocol',
          runId: 'RUN-2026-10-04-001',
          confidence: 0
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 350);
  };

  const presetQuestions = [
    t.copilot.prompt1,
    t.copilot.prompt2,
    t.copilot.prompt3,
    t.copilot.prompt4
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl flex flex-col justify-between overflow-hidden relative">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {t.copilot.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Grounded in Live Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t.copilot.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCopilotOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={clsx(
                'flex flex-col',
                m.sender === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={clsx(
                  'max-w-[85%] rounded-2xl p-3.5 shadow-xs leading-relaxed',
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100/90 text-slate-900 border border-slate-200/80 rounded-tl-none'
                )}
              >
                <p>{m.text}</p>

                {/* Grounded Evidence Tag (Section 30) */}
                {m.source && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10px] text-slate-500 space-y-1 bg-white/70 p-2 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Database className="w-3 h-3 text-blue-600" />
                        Source: {m.source}
                      </span>
                      <span className="font-mono text-slate-500">
                        Run: {m.runId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Model Verified Attribution</span>
                      <span className="font-bold text-emerald-700">
                        Confidence: {m.confidence}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 text-slate-500 text-xs w-48 animate-pulse">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Querying LMIS Engine...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-4 py-2 bg-slate-50/90 border-t border-slate-200/70 overflow-x-auto whitespace-nowrap space-x-2 flex">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200/90 rounded-xl px-2.5 py-1 transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder={t.copilot.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs sm:text-sm py-2 px-3.5 rounded-xl liquid-control text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
