import React, { useState, useEffect } from 'react';
import { WebsiteHeader } from './components/WebsiteHeader';
import { EnquiryChatbotSection } from './components/EnquiryChatbotSection';
import { WebsiteFooter } from './components/WebsiteFooter';
import { ChatMessage } from './types/chatbot';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'bot',
  text: `Welcome to Vivekananda College of Technology & Management (VCTM), Aligarh! 🎓\n\nI am the digital enquiry assistant for our admissions and student affairs division (AKTU College Code: **340**, BTE UP Code: **1628** · Official Website: **vctm.in**).\n\nYou can ask me any question regarding B.Tech fees, courses, eligibility, HOD details, scholarships, hostel accommodation, or campus placements.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestedFollowUps: [
    'btech fees',
    'Who is the HOD of CS?',
    'What courses are offered?',
    'What is the eligibility for B.Tech?',
    'What scholarships are available?',
    'What hostel facilities are available?',
    'How are the placements?',
    'Where is the college located?',
    'How can I contact the college?',
  ],
  sourceReference: 'VCTM Admissions Directorate (vctm.in / AKTU Code: 340)',
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('vctm_website_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  // Save conversation state in session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('vctm_website_chat_messages', JSON.stringify(messages));
    } catch {
      // ignore storage error
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* 1. College Header Banner (Top utility notification strip + College wordmark & affiliation) */}
      <WebsiteHeader />

      {/* 2. Main Body: Intro Banner & Full-Width Chat Window */}
      <main className="flex-1 flex flex-col">
        <EnquiryChatbotSection
          messages={messages}
          setMessages={setMessages}
          onClearChat={handleClearChat}
        />
      </main>

      {/* 3. Footer: College Info, Helplines, Social & Website Links, Copyright */}
      <WebsiteFooter />
    </div>
  );
}
