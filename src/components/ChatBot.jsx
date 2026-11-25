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
  "How much do you charge?",
  "Can you edit my YouTube videos?",
  "How long does an edit take?",
  "How do I send my footage?",
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
- When an off-topic question is asked, respond ONLY with: "I can only help with video editing questions: rates, turnaround, samples, tools and hiring Sean."
- Keep all valid answers concise, friendly, professional, and straight to the point (2-3 sentences max).
- Treat visitors as potential clients with a video editing inquiry: answer, then invite them to share video type, length and deadline, and to hire Sean on Upwork or by email.
- Never invent prices, turnaround times or results. Rate: $12 per hour, adjustable for bigger or ongoing work. Turnaround and revisions are agreed per project.

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

  // Local answers for video editing inquiries (used when no AI key is set or the network fails).
  // Each rule: keywords to look for, and the reply. The first rule that matches wins.
  const LOCAL_RULES = [
    [["rate", "price", "pricing", "charge", "cost", "budget", "how much", "fee", "per hour", "hourly"],
      `Sean charges $12 per hour. For bigger or ongoing work, the rate can be adjusted depending on the workload. Message him on Upwork or email ${SITE.email} with your project details.`],
    [["turnaround", "how long", "deadline", "fast", "rush", "timeline", "when can", "delivery time"],
      `It depends on the video length and how many revisions you need. Sean agrees on a timeline with you before he starts, so send the length and deadline and he will confirm.`],
    [["revision", "changes", "feedback", "edit again", "notes"],
      `You get a first cut, send your notes, and Sean revises. The number of revision rounds is agreed before work starts.`],
    [["send", "footage", "raw", "files", "upload", "google drive", "dropbox", "brief"],
      `Send your raw footage through Google Drive, Dropbox or any link, plus a short brief: the platform, length, style and any reference videos you like.`],
    [["youtube", "long-form", "long form", "podcast", "vlog", "travel"],
      `Yes. Sean edits long-form YouTube videos, podcasts and travel vlogs: pacing, cuts, b-roll, captions, sound and color, exported for YouTube.`],
    [["short", "reel", "tiktok", "shorts", "vertical", "9:16", "clip", "repurpose"],
      `Yes. Sean edits Reels, TikToks and YouTube Shorts, including cutting shorts from your long videos, with captions, hooks and motion graphics.`],
    [["ad", "ugc", "vsl", "sales", "dtc", "ecommerce", "e-commerce", "product"],
      `Yes. Sean edits ads, UGC and VSLs: strong hooks, word-synced captions, product callouts, offer cards and several versions for testing.`],
    [["caption", "subtitle", "motion graphic", "animation", "kinetic", "text", "thumbnail"],
      `Sean adds word-synced captions, kinetic text and motion graphics. Ask about thumbnails with your project details.`],
    [["eye", "optometr", "ophthalm", "clinic", "healthcare", "medical", "doctor", "patient"],
      `Sean has edited patient-education videos, practice ads and testimonials for eye care, optometry and ophthalmology practices.`],
    [["ai", "avatar", "talking head", "voice", "elevenlabs", "flow", "generated"],
      `Sean produces AI talking-head and AI UGC videos with Google Flow and ElevenLabs, and checks every clip before it goes out.`],
    [["tool", "software", "premiere", "capcut", "program", "app"],
      `Sean edits in Premiere Pro and CapCut, and uses Claude Code and HyperFrames for motion graphics and fast variations. The Tools section explains each one.`],
    [["sample", "portfolio", "example", "work", "previous"],
      `Watch his samples in the Work section and the short-form highlights at the top of the page.`],
    [["experience", "how many", "years", "background", "upwork rating", "review"],
      `Sean is an Upwork Top Rated Plus freelancer (top 3% of freelancers), has edited 300+ videos and has 6,259 hours on Upwork with a 5.0 client rating.`],
    [["timezone", "time zone", "where", "location", "based", "available", "hours"],
      `Sean is in the Philippines (GMT+8) and works remotely. You can agree on overlap hours with your team.`],
    [["contact", "hire", "upwork", "email", "reach", "start", "book", "quote"],
      `You can hire Sean on Upwork or email ${SITE.email}. Share the video type, length and deadline to get started.`],
    [["hi", "hello", "hey", "who are you", "good morning", "good evening"],
      `Hi! I'm Sean Marion Velasco's assistant. Tell me about the video you need edited, or ask about rates, turnaround or samples.`],
  ];

  const getSmartLocalResponse = (query) => {
    const q = ` ${query.toLowerCase()} `;
    for (const [words, reply] of LOCAL_RULES) {
      if (words.some((w) => (w.length <= 3 ? new RegExp(`\\b${w}\\b`).test(q) : q.includes(w)))) return reply;
    }
    return `I can help with video editing questions: rates, turnaround, revisions, the kinds of videos Sean edits, and how to hire him. What are you working on?`;
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

          {/* Footer hint */}
          <div className="powered-by-container">
            <span>Ask about rates, turnaround and samples</span>
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
