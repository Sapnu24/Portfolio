import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  MessageSquare,
  Send,
  Bot,
  X,
  Trash2,
} from "lucide-react";
import { SITE } from "@/data/work";
import "@/styles/Chatbot.css";

const QUICK_PROMPTS = [
  "What kinds of videos do you edit?",
  "Which tools do you use?",
  "Tell me about your experience",
  "How can I contact you?",
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Global event listener for mobile dock / external triggers
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("open-chatbot", handleOpen);
    window.addEventListener("toggle-chatbot", handleToggle);
    return () => {
      window.removeEventListener("open-chatbot", handleOpen);
      window.removeEventListener("toggle-chatbot", handleToggle);
    };
  }, []);

  // Static knowledge: video editing only (nothing is read from the old developer data)
  const buildSystemContext = () => `You are the AI Assistant for Sean Marion Velasco, Video Editor and AI Video Production Lead. Speak on behalf of Sean ("Sean", "I", "my work").

CRITICAL SCOPE RESTRICTION:
- You must ONLY answer questions directly related to Sean Marion Velasco, video editing (long-form, short-form, ads, VSLs, travel vlogs, eye care education), AI video workflows, editing tools, his work at Specialty Vision, Upwork, and hiring Sean.
- You must REFUSE to answer off-topic questions (e.g., general world trivia, math homework, politics, personal non-career questions, jokes, cooking recipes, weather, general AI assistance).
- When an off-topic question is asked, respond ONLY with: "I'm only trained to answer questions about Sean Marion Velasco's video editing background, work, tools, and how to hire him!"
- Keep all valid answers concise, friendly, professional, and straight to the point (2-3 sentences max).

=== PROFILE ===
- Name: Sean Marion Velasco
- Role: Video Editor and AI Video Production Lead, based in the Philippines
- Email: ${SITE.email}
- Upwork: ${SITE.upwork}
- Upwork status: Top Rated Plus (top 3% of freelancers), 6,259 hours, 5.0 client rating
- Rate: $12 per hour; for bigger or ongoing work the rate can be adjusted depending on the workload
- Services: Video editing for YouTube, ads and healthcare practices, plus AI video production workflows

=== WHAT SEAN EDITS ===
- Long-form YouTube videos, short-form (Reels, TikTok, Shorts), DTC and UGC ads, VSLs, travel vlogs, eye care, optometry and ophthalmology patient education, AI talking heads, text-only motion graphics ads.

=== EXPERIENCE ===
- Specialty Vision (healthcare marketing agency): Assistant Video Editor (Feb 2025), Junior (Aug 2025), Senior Video Editor (Feb 2026): patient education, practice ads, testimonials and short-form for eye care clinics.
- Upwork: 300+ videos edited, 6,259 hours, 5.0 client rating.
- Education: BS Information Technology, Pampanga State Agricultural University (2020 to 2024).

=== TOOLS ===
- Editing: Premiere Pro, CapCut, HyperFrames, ffmpeg. AI: Google Flow, ElevenLabs, Claude Code, Whisper. Scripts: Python.
`;

  // Local fallback if the API key fails or the network is unavailable
  const getSmartLocalResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("video") || q.includes("edit") || q.includes("work") || q.includes("sample") || q.includes("portfolio")) {
      return `Sean edits long-form and short-form videos, ads and VSLs, travel vlogs and eye care education videos, plus AI talking heads and motion graphics. Watch samples in the Work section.`;
    }
    if (q.includes("tool") || q.includes("software") || q.includes("premiere") || q.includes("capcut") || q.includes("ai")) {
      return `Sean edits in Premiere Pro and CapCut, and builds AI workflows with Google Flow, ElevenLabs, Claude Code and HyperFrames. Open the Tools section for what each one is used for.`;
    }
    if (q.includes("experience") || q.includes("team") || q.includes("track record") || q.includes("sean")) {
      return `Sean is an Upwork Top Rated Plus freelancer (top 3% of freelancers), has edited 300+ videos and has 6,259 hours on Upwork.`;
    }
    if (q.includes("rate") || q.includes("price") || q.includes("charge") || q.includes("cost")) {
      return `Sean charges $12 per hour. For bigger or ongoing work, the rate can be adjusted depending on the workload.`;
    }
    if (q.includes("contact") || q.includes("hire") || q.includes("upwork") || q.includes("quote") || q.includes("reach")) {
      return `You can hire Sean on Upwork or email ${SITE.email}. He is open to video editing projects and roles.`;
    }
    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who are you")) {
      return `Hi! I'm Sean Marion Velasco's assistant. Ask me about his video work, tools or experience.`;
    }
    return `I'm only trained to answer questions about Sean Marion Velasco's video editing background, work, tools, and how to hire him.`;
  };

  const handleSend = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : input;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMessage = { role: "user", text: textToSend.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not set");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = buildSystemContext();

      // Models to try in order of preference
      const modelCandidates = [
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-pro",
      ];

      let reply = null;
      let lastErr = null;

      const chatHistory = messages
        .slice(-6)
        .map((m) => `${m.role === "user" ? "Client" : "Sean Velasco"}: ${m.text}`)
        .join("\n");

      const prompt = `${systemInstruction}\n\n=== CONVERSATION HISTORY ===\n${chatHistory}\n\nClient question: ${textToSend.trim()}\nSean Velasco:`;

      for (const modelName of modelCandidates) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const responseText = result?.response?.text();
          if (responseText && responseText.trim()) {
            reply = responseText.trim();
            break;
          }
        } catch (modelErr) {
          lastErr = modelErr;
          console.warn(`Model ${modelName} call error:`, modelErr?.message || modelErr);
        }
      }

      if (!reply) {
        throw lastErr || new Error("No response generated");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: reply,
        },
      ]);
    } catch (err) {
      console.error("Gemini Error:", err?.message || err);
      // Seamless local intelligent fallback
      const fallbackReply = getSmartLocalResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: fallbackReply,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        className={`chatbot-toggle ${isOpen ? "active" : ""}`}
        aria-label="Chat with Sean Velasco AI Assistant"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="chatbot-toggle-pulse" />
        {isOpen ? <X size={20} className="chatbot-icon" /> : <MessageSquare size={21} className="chatbot-icon" />}
        {!isOpen && messages.length === 0 && (
          <span className="chatbot-badge-dot" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container" role="dialog" aria-label="Sean Velasco AI Assistant">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <Bot size={18} />
              </div>
              <div className="chatbot-header-info">
                <span className="chatbot-title">SMV AI</span>
                <span className="chatbot-status">
                  <span className="chatbot-status-dot" /> Online • Sean Velasco Assistant
                </span>
              </div>
            </div>

            <div className="chatbot-header-actions">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="chatbot-action-btn"
                  title="Clear conversation"
                  onClick={clearChat}
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                type="button"
                className="chatbot-close-btn"
                aria-label="Close Chat"
                onClick={() => setIsOpen(false)}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {/* Welcome Message */}
            <div className="chat-message bot">
              <div className="bot-greeting">
                <p>
                  👋 Hi! I'm <strong>Sean Marion Velasco</strong>'s AI assistant. Ask me about Sean's video work, editing tools, experience, or hiring him on Upwork!
                </p>
              </div>
            </div>

            {/* Quick Prompts on start */}
            {messages.length === 0 && (
              <div className="quick-prompts-container">
                <span className="quick-prompts-label">
                  Suggested questions:
                </span>
                <div className="quick-prompts-list">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-prompt-btn"
                      onClick={() => handleSend(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Stream */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.text}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="chat-message bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Powered by Gemini Tag */}
          <div className="powered-by-container">
            <span>Powered by Google Gemini AI</span>
          </div>

          {/* Input Box */}
          <div className="chatbot-input">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about videos, tools, experience..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              className={`chatbot-send-btn ${loading ? "loading" : ""}`}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
