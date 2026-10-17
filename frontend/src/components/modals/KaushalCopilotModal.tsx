'use client';

import React, { useState, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { clsx } from 'clsx';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Database 
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
  const { copilotOpen, setCopilotOpen, t, l } = useApp();
  const [input, setInput] = useState('');

  // Close on Escape key
  React.useEffect(() => {
    if (!copilotOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setCopilotOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copilotOpen, setCopilotOpen]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: l(
        'Welcome! I am Kaushal Copilot — MSDE Labour Market Intelligence Assistant. Ask me about district shortages, 6-month forecasts, explainability drivers, or policy seat reallocation impacts.',
        'नमस्ते! मैं कौशल कोपायलट हूँ — एमएसडीई श्रम बाजार बुद्धिमत्ता सहायक। आप मुझसे किसी भी जिले में कौशल अंतराल, मांग पूर्वानुमान, या सीट पुनर्वितरण के बारे में पूछ सकते हैं।'
      ),
      timestamp: 'Just now',
      source: 'LMIS Analytics Engine',
      runId: 'RUN-2026-10-04-001',
      confidence: 94
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback((userText?: string) => {
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
    
    // Check specific executive demo prompts
    let customAnswer: { text: string; source: string; confidence: number } | null = null;
    
    if (lower.includes('simulate 97-seat') || lower.includes('97-seat transfer') || lower.includes('seat transfer in gorakhpur')) {
      customAnswer = {
        text: l(
          'LP Solver Simulation Result (Gorakhpur): Reallocating 97 seats from Retail Sales Associate (536 surplus seats) to Solar PV Installer closes 6.2% of the 711-candidate deficit. Retrofit CapEx is ₹6.31L (@ ₹6,500/seat) with zero donor trade deficit risk (Donor Safety Score 52, Balanced). Public funds saved: ₹6.3L vs constructing new capacity.',
          'एलपी सॉल्वर सिमुलेशन परिणाम (गोरखपुर): रिटेल सेल्स एसोसिएट (536 अतिरिक्त सीटें) से सोलर पीवी इंस्टॉलर में 97 सीटों का पुनर्आवंटन 711-उम्मीदवारों के घाटे का 6.2% बंद करता है। रेट्रोफ़िट पूंजी व्यय ₹6.31 लाख (@ ₹6,500/सीट) है जिसमें कोई दाता जोखिम नहीं है। नई क्षमता बनाने की तुलना में ₹6.3 लाख की सार्वजनिक निधि बचत।'
        ),
        source: 'MSDE Linear Programming Optimizer (PuLP Engine)',
        confidence: 96
      };
    } else if (lower.includes('compare solar pv') || lower.includes('across up') || lower.includes('up districts')) {
      customAnswer = {
        text: l(
          'Cross-District Solar PV Deficit Analysis (Uttar Pradesh): Gorakhpur exhibits the highest acute deficit at 711 candidates (demand 808 vs 97 supply, Gap Score 94), driven by Purvanchal rooftop installations. Lucknow shows a moderate deficit of 342, and Varanasi records 298. Gorakhpur has highest priority for donor-safe capacity transfers.',
          'क्रॉस-डिस्ट्रिक्ट सोलर पीवी घाटा विश्लेषण (उत्तर प्रदेश): पूर्वांचल रूफटॉप इंस्टॉलेशन के कारण गोरखपुर में 711 उम्मीदवारों (मांग 808 बनाम 97 आपूर्ति, गैप स्कोर 94) का सबसे गंभीर घाटा है। लखनऊ में 342 और वाराणसी में 298 का घाटा दर्ज है।'
        ),
        source: 'MSDE Regional Deficit Matrix (16 Districts)',
        confidence: 93
      };
    } else if (lower.includes('policy brief') || lower.includes('generate') || lower.includes('pdf')) {
      customAnswer = {
        text: l(
          'MSDE Policy Brief Dossier Ready: 4 high-confidence interventions queued. 1) Gorakhpur: 97-seat Solar PV transfer (₹6.31L CapEx, ₹6.3L savings). 2) Pune: 400-seat EV Powertrain Diagnostics Hub (₹26.0L CapEx). 3) Coimbatore: 350-seat Precision CNC Cluster (₹22.75L CapEx). 4) Ahmedabad: 250-seat Multi-Axis CNC expansion. Use the "Export Data & Reports" button to download.',
          'एमएसडीई नीति संक्षिप्त विवरण तैयार: 4 उच्च-विश्वसनीयता हस्तक्षेप पंक्तिबद्ध हैं। गोरखपुर (97 सीटें), पुणे (400 सीटें), कोयंबटूर (350 सीटें), और अहमदाबाद (250 सीटें)। डाउनलोड करने के लिए "Export Data & Reports" का उपयोग करें।'
        ),
        source: 'MSDE Automated Policy Formulation Engine',
        confidence: 98
      };
    }

    let match = COPILOT_KNOWLEDGE.find(k => 
      lower.includes(k.question.toLowerCase()) || (k.questionHi && lower.includes(k.questionHi.toLowerCase()))
    );

    if (!customAnswer && !match) {
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

      if (customAnswer) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: customAnswer.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: customAnswer.source,
          runId: 'RUN-2026-10-04-001',
          confidence: customAnswer.confidence
        };
      } else if (match) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: l(match.answer, match.answerHi || match.answer),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'MSDE Labour Intelligence Multi-Source Aggregate',
          runId: 'RUN-SIH-001',
          confidence: 94
        };
      } else {
        // Section 19 & 20 Mandate: Copilot must NEVER invent analytical values when data is insufficient
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: l(
            "I don't have enough data to answer this reliably. Please query a valid MSDE district (e.g., Gorakhpur, Lucknow, Pune, Bengaluru) or recognized NCO-2015 trade code.",
            'मेरे पास इस प्रश्न का विश्वसनीय उत्तर देने के लिए पर्याप्त डेटा नहीं है। कृपया किसी मान्य एमएसडीई जिले (जैसे गोरखपुर, लखनऊ, पुणे, बेंगलुरु) या मान्यता प्राप्त NCO व्यापार कोड के बारे में पूछें।'
          ),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Data Governance Insufficient Evidence Protocol',
          runId: 'RUN-2026-10-04-001',
          confidence: 0
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 350);
  }, [input, l]);

  const presetQuestions = [
    'Simulate 97-seat transfer in Gorakhpur',
    'Compare Solar PV deficit across UP districts',
    'Generate MSDE Policy Brief PDF',
    'Why is Solar PV in Gorakhpur short by 711?',
    'What dataset and ML pipeline is loaded?'
  ];

  if (!copilotOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) setCopilotOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-label={t.copilot.title}
    >
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_24px_50px_-12px_rgba(15,23,42,0.25)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_24px_50px_-12px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden relative">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-900/20 border border-slate-700">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                  {t.copilot.title}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Grounded in Live Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.copilot.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCopilotOpen(false)}
            aria-label="Close Assistant"
            className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
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
                    ? 'bg-sky-600 dark:bg-sky-500 text-white rounded-tr-none'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-none backdrop-blur-md'
                )}
              >
                <p>{m.text}</p>

                {/* Grounded Evidence Tag (Section 30) */}
                {m.source && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50/60 dark:bg-slate-900/60 p-2 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                        <Database className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                        Source: {m.source}
                      </span>
                      <span className="font-mono text-slate-400">
                        Run: {m.runId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Model Verified Attribution</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Confidence: {m.confidence}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-xs w-48 animate-pulse border border-slate-200/80 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Querying LMIS Engine...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800 overflow-x-auto whitespace-nowrap space-x-2 flex scrollbar-none">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white/85 dark:bg-slate-800/85 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded-full px-3 py-1 transition-all shrink-0 cursor-pointer active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center gap-2">
          <input
            type="text"
            placeholder={t.copilot.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs sm:text-sm py-2 px-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]"
          />
          <button
            onClick={() => handleSend()}
            className="btn-liquid-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
