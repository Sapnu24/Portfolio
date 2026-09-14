import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  MessageSquare,
  Send,
  Bot,
  X,
  Trash2,
  Sparkles,
} from "lucide-react";
import { getHeroProfile, DEFAULT_PROFILE } from "@/services/profileServices";
import { getProjects, DEFAULT_PROJECTS } from "@/services/projectServices";
import { getTimelineItems, DEFAULT_TIMELINE } from "@/services/timelineServices";
import { getSkillCategories, DEFAULT_SKILL_CATEGORIES } from "@/services/skillServices";
import "@/styles/Chatbot.css";

const QUICK_PROMPTS = [
  "What are your top projects?",
  "What is your tech stack?",
  "Tell me about your experience",
  "How can I contact you?",
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [liveData, setLiveData] = useState({
    profile: DEFAULT_PROFILE,
    projects: DEFAULT_PROJECTS,
    timeline: DEFAULT_TIMELINE,
    skills: DEFAULT_SKILL_CATEGORIES,
  });

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

  // Fetch real-time portfolio knowledge from Firestore / Local Cache
  useEffect(() => {
    async function loadPortfolioContext() {
      try {
        const [profile, projects, timeline, skills] = await Promise.all([
          getHeroProfile().catch(() => DEFAULT_PROFILE),
          getProjects().catch(() => DEFAULT_PROJECTS),
          getTimelineItems().catch(() => DEFAULT_TIMELINE),
          getSkillCategories().catch(() => DEFAULT_SKILL_CATEGORIES),
        ]);
        setLiveData({ profile, projects, timeline, skills });
      } catch (err) {
        console.error("Error loading chatbot knowledge context:", err);
      }
    }
    loadPortfolioContext();
  }, []);

  // System instruction and dynamic context prompt
  const buildSystemContext = () => {
    const { profile, projects, timeline, skills } = liveData;

    const projectSummary = projects
      ?.slice(0, 8)
      ?.map((p) => `- ${p.title}: ${p.description || ""} (Tech: ${p.tags?.join(", ") || ""})`)
      ?.join("\n");

    const timelineSummary = timeline
      ?.map((t) => `- ${t.role} at ${t.company} (${t.period}): ${t.description || ""}`)
      ?.join("\n");

    const skillsSummary = skills
      ?.map((s) => `- ${s.name}: ${s.skills?.map((item) => (typeof item === "string" ? item : item.name)).join(", ")}`)
      ?.join("\n");

    return `You are the AI Assistant for Sean Marion Velasco, Web Developer – Full Stack. Speak on behalf of Sean ("Sean", "I", "my work").

CRITICAL SCOPE RESTRICTION:
- You must ONLY answer questions directly related to Sean Marion Velasco, full-stack web development, programming languages & frameworks (React, Laravel, Next.js, Node.js, PHP, MySQL, TypeScript, Tailwind CSS, REST APIs, Cloud), case studies, work experience, Upwork contracts, and hiring Sean.
- You must REFUSE to answer off-topic questions (e.g., general world trivia, math homework, politics, personal non-career questions, jokes, cooking recipes, weather, general AI assistance).
- When an off-topic question is asked, respond ONLY with: "I'm only trained to answer questions about Sean Marion Velasco's web development background, projects, skills, and how to start an Upwork contract with him! 🚀"
- Keep all valid answers concise, friendly, professional, and straight to the point (2-3 sentences max).

=== SEAN MARION VELASCO PROFILE DATA ===
- Name: ${profile?.name || "Sean Marion Velasco"}
- Role: ${profile?.role || "Web Developer – Full Stack"}
- Bio: ${profile?.bio || "Dedicated freelance full-stack developer committed to crafting clean, reliable, and high-performance web applications."}
- Email: ${profile?.email || "seanmarionvelasco.work@gmail.com"}
- Availability: Available for Upwork Contracts, Fixed Projects, and Dedicated Sprints
- Upwork: ${profile?.upworkUrl || "https://www.upwork.com/freelancers/~01c5be6cda3726622f?mp_source=share"}
- LinkedIn: ${profile?.linkedinUrl || "https://linkedin.com"}
- GitHub: ${profile?.githubUrl || "https://github.com/Sapnu24"}

=== KEY CASE STUDIES & DELIVERABLES ===
${projectSummary || "Kam Maalam Enterprise Web Portal, ACV Veterinary & Adoption System, Non-Profit Web Apps"}

=== FREELANCE & CLIENT MILESTONES ===
${timelineSummary || "Full-Stack Architecture, Enterprise Web Systems, and Web Engineering"}

=== TECHNICAL CAPABILITIES ===
${skillsSummary || "React.js, Next.js, Laravel PHP, Node.js, TypeScript, MySQL, Tailwind CSS, RESTful APIs, Cloud"}
`;
  };

  // Intelligent local fallback if API key fails or network is unavailable
  const getSmartLocalResponse = (query) => {
    const q = query.toLowerCase();
    const { profile, projects, timeline, skills } = liveData;

    if (q.includes("project") || q.includes("work") || q.includes("built") || q.includes("case") || q.includes("app")) {
      const topProjects = projects?.slice(0, 3)?.map((p) => p.title)?.join(", ");
      return `Featured projects delivered by Sean (assisted by his team) include ${topProjects || "Enterprise Web Systems, SaaS Platforms, and Custom Portals"}. You can explore live previews in the Projects section! 🚀`;
    }

    if (q.includes("database") || q.includes("backend") || q.includes("api") || q.includes("cloud")) {
      return `Sean architects secure, high-performance backends using Laravel PHP, Node.js, MySQL, PostgreSQL, and RESTful APIs backed by cloud infrastructure. ⚡`;
    }

    if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("framework")) {
      return `Sean specializes in React.js, Next.js, Laravel PHP, TypeScript, MySQL, Tailwind CSS, Cloud architecture, and modern full-stack web engineering. 💻`;
    }

    if (q.includes("experience") || q.includes("team") || q.includes("track record") || q.includes("sean")) {
      return `Sean Marion Velasco brings 4+ years of hands-on software engineering experience delivering high-converting web applications for global clients. 🌟`;
    }

    if (q.includes("contact") || q.includes("hire") || q.includes("upwork") || q.includes("quote") || q.includes("reach")) {
      return `You can hire Sean directly on Upwork with full escrow protection or reach out at ${profile?.email || "seanmarionvelasco.work@gmail.com"}. He is available for fixed-price contracts and dedicated hourly sprints! 📬`;
    }

    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who are you")) {
      return `Hi! I'm Sean Marion Velasco's AI assistant. How can Sean help bring your project to life today? 😊`;
    }

    return `I'm only trained to answer questions about Sean Marion Velasco's web development capabilities, projects, and how to hire him. Feel free to ask about his projects or how to start a contract! 🚀`;
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
                  👋 Hi! I'm <strong>Sean Marion Velasco</strong>'s AI assistant. Ask me about Sean's engineering background, featured projects, tech stack, or hiring on Upwork!
                </p>
              </div>
            </div>

            {/* Quick Prompts on start */}
            {messages.length === 0 && (
              <div className="quick-prompts-container">
                <span className="quick-prompts-label">
                  <Sparkles size={12} /> Suggested questions:
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
              placeholder="Ask about projects, stack, experience..."
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
