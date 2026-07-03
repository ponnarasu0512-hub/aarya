import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, ArrowDown, HelpCircle, Loader2 } from "lucide-react";
import { BusinessState, CfoMessage } from "../types";

interface CfoChatProps {
  state: BusinessState;
  addChatMessage: (msg: CfoMessage) => void;
  clearChat: () => void;
  currencySymbol: string;
}

export const CfoChatView: React.FC<CfoChatProps> = ({ state, addChatMessage, clearChat, currencySymbol }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatHistory, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create and append user message
    const userMsg: CfoMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
    addChatMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      // API call to Express backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...state.chatHistory, userMsg],
          context: {
            businessName: state.businessName,
            industry: state.industry,
            currency: state.currency,
            currencySymbol: currencySymbol,
            startingBalance: state.startingBalance,
            ledger: state.ledger,
            invoices: state.invoices,
            activities: state.activities
          }
        })
      });

      const data = await response.json();
      
      const agentMsg: CfoMessage = {
        id: "msg_" + (Date.now() + 1),
        sender: "agent",
        text: data.reply || "I am processing the ledgers. Please ask again in a moment.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      addChatMessage(agentMsg);
    } catch (err) {
      console.error("Failed to connect to CFO backend:", err);
      // Failover message
      const agentMsg: CfoMessage = {
        id: "msg_" + (Date.now() + 1),
        sender: "agent",
        text: "My apologies. I encountered a network disruption while checking your ledger accounts. I recommend reviewing your outstanding overdue list directly on the Ledger tab.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      addChatMessage(agentMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedClick = (promptText: string) => {
    handleSend(promptText);
  };

  const suggestions = [
    "Who owes me money?",
    "Why is cash flow down?",
    "Generate a collection risk report.",
    "Give me advice on accelerating collections."
  ];

  return (
    <div id="cfo-chat-view" className="flex-1 flex flex-col h-screen max-h-screen bg-[#EAE7E4] text-neutral-900 relative">
      {/* Chat header bar */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414]/10 border border-[#141414]/20 flex items-center justify-center text-[#141414]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm tracking-tight text-neutral-900 flex items-center gap-2">
              A.A.R.Y.A CFO <span className="text-[9px] bg-[#141414] text-[#FF3B30] px-1.5 py-0.5 rounded font-mono font-bold uppercase">ACTIVE AGENT</span>
            </h2>
            <p className="text-[10px] text-neutral-500 font-mono">
              Capital Intelligence core &bull; Gemini-3.5-Flash
            </p>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={clearChat}
          className="text-[10px] text-neutral-500 hover:text-red-600 font-mono uppercase tracking-wider bg-white border border-neutral-200 px-2.5 py-1.5 rounded-lg hover:border-red-200 transition-colors"
        >
          Reset Session
        </button>
      </div>

      {/* Message body list */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 scroll-smooth pb-44 lg:pb-32"
      >
        {state.chatHistory.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar circle */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isUser 
                  ? "bg-[#F4F2F0] text-[#141414] border border-[#E2E1DE]" 
                  : "bg-[#141414] text-[#FF3B30] border border-[#000000]"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message content block */}
              <div className="flex flex-col space-y-1 max-w-[85%]">
                <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-line border ${
                  isUser 
                    ? "bg-[#F4F2F0] border-[#E2E1DE] text-[#141414]" 
                    : "bg-white border-[#E2E1DE] text-neutral-800 shadow-sm"
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[10px] text-neutral-400 font-mono ${isUser ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading/thinking Shimmer widget */}
        {loading && (
          <div className="flex items-start gap-3.5 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-[#141414] text-[#FF3B30] border border-[#000000] flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="space-y-1.5 max-w-sm w-full">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <Loader2 className="w-4.5 h-4.5 text-[#141414] animate-spin" />
                <span className="text-xs text-neutral-600 font-medium font-mono">A.A.R.Y.A is auditing cash journals...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts and Input Bar docked at bottom */}
      <div className="absolute bottom-[68px] lg:bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#EAE7E4] via-[#EAE7E4] to-transparent z-20">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Suggested chips (Only show if history is short e.g. 1 message) */}
          {state.chatHistory.length <= 1 && !loading && (
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  id={`suggestion-chip-${idx}`}
                  type="button"
                  onClick={() => handleSuggestedClick(sug)}
                  className="px-3.5 py-2 rounded-full bg-white border border-[#E5E7EB] hover:border-[#141414] hover:bg-[#F4F2F0] text-xs text-neutral-600 hover:text-[#141414] transition-all flex items-center gap-1.5 font-medium shadow-sm"
                >
                  <HelpCircle className="w-3.5 h-3.5 stroke-[2]" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }} 
            className="flex gap-3"
          >
            <input
              type="text"
              id="chat-user-input"
              disabled={loading}
              placeholder="Ask A.A.R.Y.A to audit accounts, find overdue invoices, or predict revenue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-white border border-[#E5E7EB] focus:border-[#141414] rounded-xl text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all disabled:opacity-50 shadow-sm"
            />
            <button
              type="submit"
              id="chat-send-btn"
              disabled={loading || !input.trim()}
              className="px-5 rounded-xl bg-[#141414] text-[#FF3B30] flex items-center justify-center hover:scale-103 active:scale-97 transition-all font-heading font-bold disabled:opacity-40 disabled:hover:scale-100 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
