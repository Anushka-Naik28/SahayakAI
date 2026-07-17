"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { Bot, Mic, Send, X, Volume2, VolumeX, Sparkles } from "lucide-react";

export default function FloatingAssistant() {
  const { userId, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; date: string }>>([
    {
      sender: "ai",
      text: "Namaste! I am SahayakAI, your Citizen Copilot. Ask me questions about schemes, documents, or check your eligibility criteria.",
      date: "Just Now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Voice Assistant Speech-to-Text simulation
  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Simulating voice query instead.");
      simulateVoiceQuery();
      return;
    }
    
    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : (language === "kn" ? "kn-IN" : "en-IN");
    recognition.interimResults = false;
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      await sendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert("Error recognizing voice input. Please try typing instead.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const simulateVoiceQuery = () => {
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      const randomQueries = [
        "How do I qualify for Ayushman Bharat health insurance?",
        "Is there a scheme for small business Mudra loans?",
        "Show me required documents for PM Kisan",
        "Explain PM Awas Yojana housing support"
      ];
      const query = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      await sendMessage(query);
    }, 2000);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const today = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: "user", text: textToSend, date: today }]);
    setInputText("");
    setLoading(true);

    try {
      const response = await sahayakApi.sendChatMessage(textToSend, userId, language);
      setMessages((prev) => [...prev, { sender: "ai", text: response, date: today }]);
      
      // Text to Speech logic
      if (speechEnabled && typeof window !== "undefined") {
        const cleanText = response.replace(/\*\*|#/g, ""); // Strip markdown
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === "hi" ? "hi-IN" : (language === "kn" ? "kn-IN" : "en-US");
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(inputText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="blue-gradient text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">SahayakAI Copilot</h4>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                  <span className="text-[10px] text-slate-200 font-medium">Llama 3.3 Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={speechEnabled ? "Mute Speech Feedback" : "Enable Speech Feedback"}
              >
                {speechEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5 text-white/50" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Conversation history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/20">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[85%] text-xs p-3 rounded-2xl ${
                    m.sender === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800/40 rounded-tl-none shadow-sm"
                  } leading-relaxed whitespace-pre-line`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.date}</span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-800/40 max-w-[120px]">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick recommendations pills */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200/30 dark:border-slate-800/30 flex space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button 
              onClick={() => sendMessage("Tell me about PM Kisan")}
              className="text-[10px] font-semibold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/40 hover:text-primary transition-colors"
            >
              🌾 PM Kisan
            </button>
            <button 
              onClick={() => sendMessage("Required documents for Ayushman Bharat")}
              className="text-[10px] font-semibold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/40 hover:text-primary transition-colors"
            >
              🏥 Ayushman Bharat
            </button>
            <button 
              onClick={() => sendMessage("What is Atal Pension Yojana?")}
              className="text-[10px] font-semibold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/40 hover:text-primary transition-colors"
            >
              🪙 Atal Pension
            </button>
          </div>

          {/* Input Panel */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center space-x-2">
            <button
              type="button"
              onClick={startSpeechRecognition}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
              title="Speak voice query"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about welfare schemes..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl blue-gradient text-white flex items-center justify-center hover:opacity-90"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="flex space-x-3">
        {/* Floating Voice Assistant Trigger button */}
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              startSpeechRecognition();
            }}
            className="w-14 h-14 rounded-full saffron-gradient hover:scale-105 shadow-lg text-white flex items-center justify-center transition-all animate-bounce"
            title="Talk to Voice Assistant"
          >
            <Mic className="w-6 h-6" />
          </button>
        )}

        {/* Primary chat toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full blue-gradient hover:scale-105 shadow-lg text-white flex items-center justify-center transition-all ${
            isOpen ? "rotate-90" : ""
          }`}
          title="Toggle AI Copilot"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </button>
      </div>

    </div>
  );
}
