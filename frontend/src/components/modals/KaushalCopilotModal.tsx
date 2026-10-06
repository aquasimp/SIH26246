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
      lower.includes(k.question.toLowerCase()) || (k.questionHi && lower.includes(k.questionHi.toLowerCase()))
    );

    if (!match) {
      if (lower.includes('solar') || lower.includes('सोलर') || lower.includes('pv') || lower.includes('why is solar')) {
        match = COPILOT_KNOWLEDGE[2];
      } else if (lower.includes('gorakhpur') || lower.includes('गोरखपुर') || lower.includes('shortage') || lower.includes('कमी')) {
        match = COPILOT_KNOWLEDGE[2];
      } else if (lower.includes('dataset') || lower.includes('डेटासेट') || lower.includes('run') || lower.includes('data')) {
        match = COPILOT_KNOWLEDGE[1];
      } else if (lower.includes('kaushalyuva') || lower.includes('कौशल') || lower.includes('what is')) {
        match = COPILOT_KNOWLEDGE[0];
      }
    }

    setTimeout(() => {
      let botResponse: Message;

      if (match) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: language === 'hi' ? match.answerHi : match.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'LMIS Analytics Multi-Source Aggregate',
          runId: 'RUN-SIH-001',
          confidence: 94
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] rounded-3xl overlay border border-[var(--border-strong)] shadow-2xl flex flex-col justify-between overflow-hidden relative">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] glass-strong flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--brand)] text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text)] tracking-tight">
                  {t.copilot.title}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--balanced)]/10 text-[var(--balanced)] border border-[var(--balanced)]/20">
                  Grounded in Live Pipeline
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {t.copilot.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCopilotOpen(false)}
            className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
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
                    ? 'bg-[var(--brand)] text-white rounded-tr-none'
                    : 'glass-strong text-[var(--text)] border border-[var(--border)] rounded-tl-none'
                )}
              >
                <p>{m.text}</p>

                {/* Grounded Evidence Tag (Section 30) */}
                {m.source && (
                  <div className="mt-3 pt-2.5 border-t border-[var(--border)] text-[10px] text-[var(--text-faint)] space-y-1 glass p-2 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 font-semibold text-[var(--text)]">
                        <Database className="w-3 h-3 text-[var(--brand)]" />
                        Source: {m.source}
                      </span>
                      <span className="font-mono text-[var(--text-faint)]">
                        Run: {m.runId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--text-faint)]">
                      <span>Model Verified Attribution</span>
                      <span className="font-mono font-bold text-[var(--balanced)]">
                        Confidence: {m.confidence}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-faint)] mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl glass text-[var(--text-muted)] text-xs w-48 animate-pulse border border-[var(--border)]">
              <Sparkles className="w-4 h-4 text-[var(--brand)]" />
              <span>Querying LMIS Engine...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-4 py-2 glass border-t border-[var(--border)] overflow-x-auto whitespace-nowrap space-x-2 flex">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] liquid-control rounded-xl px-2.5 py-1 transition-all shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[var(--border)] glass-strong flex items-center gap-2">
          <input
            type="text"
            placeholder={t.copilot.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs sm:text-sm py-2 px-3.5 rounded-xl liquid-control text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 sm:px-4 sm:py-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
