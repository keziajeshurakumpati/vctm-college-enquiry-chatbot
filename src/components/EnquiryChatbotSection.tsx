import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  GraduationCap,
  Award,
  DollarSign,
  Home,
  Briefcase,
  FileText,
  BookOpen,
  Trash2,
  ShieldCheck,
  ArrowDown,
} from 'lucide-react';
import { ChatMessage } from '../types/chatbot';
import { nlpEngine } from '../ml/nlpEngine';
import { generateResponse } from '../services/responseGenerator';
import { ChatCard } from './ChatCards';
import heroCampusImg from '../assets/images/vctm_campus_hero_1790257787368.jpg';

interface EnquiryChatbotSectionProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onClearChat: () => void;
}

export const EnquiryChatbotSection: React.FC<EnquiryChatbotSectionProps> = ({
  messages,
  setMessages,
  onClearChat,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [activeCourseContext, setActiveCourseContext] = useState<string | undefined>(undefined);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // References for internal chat container only - never scrolling the page/window
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested questions shown when chat has few messages
  const primarySuggestedQuestions = [
    'btech fees',
    'Who is the HOD of CS?',
    'What courses are offered?',
    'What is the eligibility for B.Tech?',
    'What scholarships are available?',
    'What hostel facilities are available?',
    'How are the placements?',
    'Where is the college located?',
    'How can I contact the college?',
  ];

  // Exactly the 8 topic buttons requested:
  // (Courses, Admissions, Eligibility, Fees, Scholarships, Hostel & Mess, Placements, Examinations)
  const topicButtons = [
    { label: 'Courses', query: 'What courses are offered?', icon: GraduationCap },
    { label: 'Admissions', query: 'How do I take admission in VCTM college?', icon: BookOpen },
    { label: 'Eligibility', query: 'What is the eligibility for B.Tech?', icon: FileText },
    { label: 'Fees', query: 'btech fees', icon: DollarSign },
    { label: 'Scholarships', query: 'What scholarships are available?', icon: Award },
    { label: 'Hostel & Mess', query: 'What hostel facilities are available?', icon: Home },
    { label: 'Placements', query: 'How are the placements?', icon: Briefcase },
    { label: 'Examinations', query: 'What is the exam pattern and schedule at VCTM?', icon: FileText },
  ];

  // Check if the user is scrolled near the bottom of the internal container (within 80px)
  const checkIfNearBottom = () => {
    const el = chatContainerRef.current;
    if (!el) return true;
    const threshold = 80;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  };

  // Monitor internal container scrolling to detect if user has manually scrolled up
  const handleContainerScroll = () => {
    const nearBottom = checkIfNearBottom();
    isAtBottomRef.current = nearBottom;
    setShowScrollBottomBtn(!nearBottom);
  };

  // Scroll ONLY the internal container (never calls window or scrollIntoView)
  const scrollToBottom = (smooth = true) => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // Auto-scroll ONLY internal chat box, and ONLY if the user was already at the bottom
  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(true);
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // User initiated an action: auto-scroll internal box to display the sent message
    isAtBottomRef.current = true;
    setShowScrollBottomBtn(false);
    requestAnimationFrame(() => {
      scrollToBottom(true);
    });

    // Call Backend /api/chat endpoint with seamless client-side fallback
    const fetchBotResponse = async () => {
      try {
        const response = await fetch('https://vctm-college-enquiry-chatbot.onrender.com/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            activeCourseContext,
            sessionId: `sess-${Date.now()}`,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Track course context from backend entity extractor
        const isGeneral =
          /\b(what\s+(are\s+the\s+)?courses|courses\s+offered|what\s+programs|programs\s+offered|list\s+(all\s+)?courses|which\s+(courses|degrees|programs)|all\s+courses|course\s+list|academic\s+programs|available\s+courses|what\s+can\s+i\s+study|degrees\s+offered|branches\s+(offered|available)|tell\s+me\s+courses|show\s+courses|all\s+branches|what\s+are\s+the\s+programmes|programmes\s+offered|available\s+programmes)\b/i.test(query) ||
          (/\b(courses?|programs?|degrees?)\b/i.test(query) &&
            !/\b(cse|cs|computer\s+science|mechanical|civil|ece|electrical|electronics|agricultural|agri|mba|mca|polytechnic|diploma|m\.?\s?tech|production|structural)\b/i.test(query));

        const crossDomain = /\b(scholarship|scholarships|contact|helpline|phone|email|placement|placements|recruiters?|hostel|transport|bus|admission|examination|exam|facility|facilities|department|hod|faculty)\b/i.test(query);
        if (isGeneral || crossDomain) {
          setActiveCourseContext(undefined);
        } else if (data.classification?.extractedEntities?.course) {
          setActiveCourseContext(data.classification.extractedEntities.course);
        }

        const botMsg: ChatMessage = {
          id: data.id || `bot-${Date.now()}`,
          sender: 'bot',
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          classification: data.classification,
          cardType: data.cardType,
          cardData: data.cardData,
          suggestedFollowUps: data.suggestedFollowUps,
          sourceReference: data.sourceReference,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        // Fallback to local Logistic Regression pipeline if network is interrupted
        const isGeneral =
          /\b(what\s+(are\s+the\s+)?courses|courses\s+offered|what\s+programs|programs\s+offered|list\s+(all\s+)?courses|which\s+(courses|degrees|programs)|all\s+courses|course\s+list|academic\s+programs|available\s+courses|what\s+can\s+i\s+study|degrees\s+offered|branches\s+(offered|available)|tell\s+me\s+courses|show\s+courses|all\s+branches|what\s+are\s+the\s+programmes|programmes\s+offered|available\s+programmes)\b/i.test(query) ||
          (/\b(courses?|programs?|degrees?)\b/i.test(query) &&
            !/\b(cse|cs|computer\s+science|mechanical|civil|ece|electrical|electronics|agricultural|agri|mba|mca|polytechnic|diploma|m\.?\s?tech|production|structural)\b/i.test(query));

        const classification = nlpEngine.classify(query, isGeneral ? undefined : activeCourseContext);

        const crossDomain = /\b(scholarship|scholarships|contact|helpline|phone|email|placement|placements|recruiters?|hostel|transport|bus|admission|examination|exam|facility|facilities|department|hod|faculty)\b/i.test(query);
        if (isGeneral || crossDomain) {
          setActiveCourseContext(undefined);
        } else if (classification.extractedEntities.course) {
          setActiveCourseContext(classification.extractedEntities.course);
        }

        const botResponse = generateResponse(query, classification, isGeneral ? undefined : activeCourseContext);
        const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse.text,
          timestamp: botTimestamp,
          cardType: botResponse.cardType,
          cardData: botResponse.cardData,
          suggestedFollowUps: botResponse.suggestedFollowUps,
          sourceReference: botResponse.sourceReference,
        };

        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchBotResponse();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeech = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`•]/g, ' ').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="w-full py-6 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* 1. "How can we help you?" Intro Banner with Campus Image */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-2/5 hidden md:block opacity-20 pointer-events-none">
            <img
              src={heroCampusImg}
              alt="VCTM Campus"
              className="w-full h-full object-cover object-right"
            />
          </div>

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Official Student Help Desk · Session 2026-27</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] tracking-tight font-serif">
              How can we help you?
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
              Ask us about admissions, courses, fees, eligibility, scholarships, hostel, placements and more.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3.5 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Instant Verified Responses
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Course-Specific Guidance (B.Tech, MBA, MCA, Polytechnic)
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> AKTU College Code: 340 · BTE: 1628
              </span>
            </div>
          </div>
        </div>

        {/* 2. Full-Width "VCTM Admissions Enquiry Desk" Chat Window */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col h-[700px] sm:h-[750px] max-h-[85vh] overflow-hidden">
          {/* Top Bar of Chat Window */}
          <div className="bg-[#0f2c59] text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-[#0f2c59] flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-5 h-5 text-[#0f2c59]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold tracking-wide">
                    VCTM Admissions Enquiry Desk
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Vivekananda College of Technology & Management (Aligarh · AKTU Code: 340 · BTE: 1628)
                </p>
              </div>
            </div>

            {/* Chat action: Clear Conversation */}
            <button
              onClick={onClearChat}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-rose-900/60 text-slate-100 transition-colors flex items-center gap-1.5"
              title="Clear Conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear chat</span>
            </button>
          </div>

          {/* 3. Topic Buttons Bar (Courses, Admissions, Eligibility, Fees, Scholarships, Hostel & Mess, Placements, Examinations) */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-slate-500 font-bold shrink-0 text-[10px] uppercase tracking-wider pr-1">
                Topics:
              </span>
              {topicButtons.map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(btn.query)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 hover:border-blue-400 shadow-2xs font-semibold flex items-center gap-1.5 transition-all text-xs active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#0f2c59]" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Course Context Indicator */}
          {activeCourseContext && (
            <div className="bg-blue-50/90 px-5 py-2 border-b border-blue-100 flex items-center justify-between text-xs text-[#0f2c59] shrink-0">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-500 font-normal">Active Course Context:</span>
                <span className="font-bold underline decoration-blue-400">{activeCourseContext}</span>
              </div>
              <button
                onClick={() => setActiveCourseContext(undefined)}
                className="text-[11px] text-slate-500 hover:text-rose-700 hover:underline"
              >
                Reset context
              </button>
            </div>
          )}

          {/* Chat Messages Stream (Internal Scroll Area ONLY) */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            <div
              ref={chatContainerRef}
              onScroll={handleContainerScroll}
              className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFBFD] overscroll-contain"
            >
            {messages.map((message) => {
              const isUser = message.sender === 'user';

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 text-xs sm:text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#0f2c59] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 shadow-2xs transition-all ${
                      isUser
                        ? 'bg-[#0f2c59] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px] text-slate-400">
                      <span className="font-bold tracking-wider uppercase">
                        {isUser ? 'You' : 'VCTM Admissions Desk'}
                      </span>
                      <span>{message.timestamp}</span>
                    </div>

                    {/* Formatted Markdown-like Content */}
                    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
                      {message.text.split('\n\n').map((paragraph, pIdx) => {
                        const formatText = (raw: string) =>
                          raw
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(
                              /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
                              '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 underline font-semibold">$1</a>'
                            );

                        if (paragraph.startsWith('• ') || paragraph.includes('\n• ')) {
                          const bullets = paragraph.split('\n');
                          return (
                            <ul key={pIdx} className="space-y-1 my-1">
                              {bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-1.5 text-xs sm:text-sm">
                                  <span className="text-amber-500 font-bold shrink-0">•</span>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: formatText(b.replace(/^•\s*/, '')),
                                    }}
                                  />
                                </li>
                              ))}
                            </ul>
                          );
                        }

                        return (
                          <p
                            key={pIdx}
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: formatText(paragraph),
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Interactive Rich Card Data Component */}
                    {message.cardType && message.cardData && (
                      <ChatCard
                        type={message.cardType}
                        data={message.cardData}
                        onFollowUpClick={handleSendMessage}
                      />
                    )}

                    {/* Bot Actions: Copy, Voice Readout & Source Citation */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        {message.sourceReference ? (
                          <span className="italic text-[10px] text-slate-400">
                            Source: {message.sourceReference}
                          </span>
                        ) : (
                          <span></span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(message.text, message.id)}
                            className="hover:text-blue-900 transition-colors p-1"
                            title="Copy response"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSpeech(message.text, message.id)}
                            className="hover:text-blue-900 transition-colors p-1"
                            title="Read out text"
                          >
                            {speakingId === message.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-up Buttons */}
                    {!isUser && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Suggested Questions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {message.suggestedFollowUps.map((suggested, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(suggested)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50/90 hover:bg-blue-100 text-[#0f2c59] border border-blue-200/80 transition-all font-medium text-left"
                            >
                              {suggested}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <User className="w-4 h-4 text-slate-700" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-[#0f2c59] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-900 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-900 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-900 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-500 font-medium ml-2">Consulting VCTM knowledge base...</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating "Scroll to bottom" button if user has scrolled up to read earlier messages */}
          {showScrollBottomBtn && (
            <button
              type="button"
              onClick={() => {
                isAtBottomRef.current = true;
                setShowScrollBottomBtn(false);
                scrollToBottom(true);
              }}
              className="absolute bottom-3 right-5 z-20 px-3 py-1.5 rounded-full bg-[#0f2c59]/90 hover:bg-[#0f2c59] text-white text-xs font-semibold shadow-lg border border-blue-800/60 flex items-center gap-1.5 transition-all backdrop-blur-xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Scroll down to latest messages"
            >
              <span>Latest messages</span>
              <ArrowDown className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}
        </div>

        {/* Quick prompt suggestions when conversation is brief */}
        {messages.length <= 2 && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 overflow-x-auto scrollbar-none shrink-0">
            <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
              <span className="text-[10px] text-slate-500 uppercase font-bold pr-1">Try Asking:</span>
              {primarySuggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 text-xs transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Chat Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about B.Tech fees, courses, eligibility, HOD details, scholarships, hostel..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0f2c59] focus:border-transparent text-xs sm:text-sm bg-slate-50/50"
                  disabled={isTyping}
                />
                <Sparkles className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-5 py-3 rounded-xl bg-[#0f2c59] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
              <span>Official AICTE Approved & AKTU (Code: 340) · BTE UP (Code: 1628) Knowledge Desk</span>
              <span>•</span>
              <a href="https://vctm.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900">
                vctm.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
