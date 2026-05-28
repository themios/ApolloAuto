import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Car, Sparkles, Send, Landmark, HelpCircle, ShieldAlert, PhoneCall, ChevronRight, User } from 'lucide-react';

interface ChatTurn {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AIAssistantProps {
  initialCtx?: {
    location?: string;
    interest?: string;
    credit?: string;
  };
}

// Helper to parse markdown links [Text](Url) into safe, styled clickable React anchors
function parseLineWithLinks(text: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [_, linkText, url] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    parts.push(
      <a
        key={matchIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lemon hover:text-sun-bright underline font-extrabold transition-colors mx-0.5 inline-flex items-center leading-snug"
      >
        <span>{linkText}</span>
        <ChevronRight className="w-4 h-4 ml-0.5 inline shrink-0" />
      </a>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function AIAssistant({ initialCtx }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      sender: 'ai',
      text: "Hi, I'm Tim's advisor at Apollo Auto. Ask me about safe first cars for teens, gas savers for long commutes, or financing after a repo. I'll give you straight answers. What's on your mind?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    { label: 'Teen first car', text: 'My teen needs a safe first car. What model should we look at?', icon: Car },
    { label: 'After repossession', text: 'I have a previous repossession. Can I qualify for financing?', icon: Landmark },
    { label: 'Documents to bring', text: 'What do I need to bring to the lot for subprime approval?', icon: Sparkles },
    { label: 'Lost pink slip', text: 'How do we handle trade-ins with lost pink slips?', icon: HelpCircle },
  ];

  // Scroll only inside the chat panel — never the main page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (rawText: string) => {
    if (!rawText.trim() || loading) return;

    const userMessage: ChatTurn = {
      sender: 'user',
      text: rawText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setLoading(true);

    try {
      // Assemble standard history omitting system instructions
      const history = messages.slice(0).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawText,
          history,
          context: initialCtx
        })
      });

      const data = await res.json();
      
      const aiResponse: ChatTurn = {
        sender: 'ai',
        text: data.text || "I apologize, my engine stalled momentarily. Tim remains fully online: can I suggest checking our FAQ or calling him directly at (805) 404-3873?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I couldn't reach the bank servers just now! Please call or text Tim directly at (805) 404-3873 (Simi Valley) or (626) 215-0440 (El Monte) and we'll handle your questions with zero delay.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-advisor-panel" className="bg-sky-deep rounded-3xl overflow-hidden border-2 border-sun/40 shadow-xl flex flex-col h-[min(80vh,640px)] lg:h-[680px] text-white overscroll-contain">
      {/* Header */}
      <div className="bg-white/10 p-5 border-b-2 border-sun/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sun flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-display font-bold text-sm text-white leading-tight">Apollo AI Advisor</h3>
              <span className="inline-block w-2 h-2 bg-success rounded-full"></span>
            </div>
            <p className="text-sm text-gray-300">Representing Tim • Always ask Tim to evaluate your specific scenario</p>
          </div>
        </div>
        <div className="hidden sm:flex text-sm text-lemon font-bold border-2 border-lemon/40 px-2 py-0.5 rounded-full bg-white/10">
          Family-Approved Guardrails
        </div>
      </div>

      {/* Message Screen */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-y-contain p-5 space-y-4 bg-sky-deep/80 backdrop-blur-sm select-none scrollbar-thin"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar block */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              m.sender === 'user' ? 'bg-sun text-white font-bold' : 'bg-white/15 text-lemon border border-white/20'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Car className="w-4 h-4" />}
            </div>

            {/* Bubble — ~0.84rem (20% smaller than 1.05rem) */}
            <div className={`rounded-xl p-3.5 text-[0.84rem] leading-relaxed shadow-md ${
              m.sender === 'user'
                ? 'bg-sun text-white font-extrabold rounded-tr-none'
                : 'bg-white/12 text-white border border-white/20 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {m.sender === 'ai' ? (
                // Super simple markdown parse for nice bullets & active links
                m.text.split('\n').map((line, i) => {
                  const cleanedLine = line.trim();
                  if (cleanedLine.startsWith('* ') || cleanedLine.startsWith('- ')) {
                    const contentOfBullet = cleanedLine.replace(/^[\*\-]\s+/, '');
                    return (
                      <div key={i} className="flex items-start space-x-2 pl-2 my-1.5">
                        <span className="text-lemon font-extrabold select-none mt-0.5">•</span>
                        <span className="text-white">{parseLineWithLinks(contentOfBullet)}</span>
                      </div>
                    );
                  }
                  return <p key={i} className={`text-white ${i > 0 ? 'mt-3' : ''}`}>{parseLineWithLinks(line)}</p>;
                })
              ) : (
                <p className="font-semibold">{m.text}</p>
              )}
              <span className="block text-xs text-right text-lemon/90 font-mono mt-1.5 opacity-90">
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2.5 max-w-[80%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-navy-soft text-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white/12 text-white border border-white/20 rounded-2xl rounded-tl-none p-3.5 text-[0.84rem] leading-relaxed">
              Tim is thinking... finding inventory options
            </div>
          </div>
        )}
      </div>

      {/* Quick topics — dropdown on mobile, wrapped chips on larger screens */}
      <div className="p-3 bg-white/5 border-t-2 border-sun/20 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-lemon px-0.5">Quick topics</p>

        {/* Mobile: native dropdown (full question text, no clipping) */}
        <div className="sm:hidden">
          <label htmlFor="ai-quick-topics" className="sr-only">
            Choose a quick topic
          </label>
          <select
            id="ai-quick-topics"
            defaultValue=""
            disabled={loading}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                handleSendMessage(value);
                e.target.value = '';
                e.target.blur();
              }
            }}
            className="w-full min-h-[2.75rem] rounded-xl border-2 border-white/20 bg-sky-deep/60 text-white text-base font-semibold px-3 py-2.5 focus:outline-none focus:border-sun cursor-pointer"
          >
            <option value="" disabled>
              Tap to pick a topic…
            </option>
            {presetQuestions.map((q) => (
              <option key={q.label} value={q.text} className="text-navy bg-white">
                {q.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tablet+: wrap chips (scroll not required) */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {presetQuestions.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                type="button"
                title={q.text}
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMessage(q.text);
                }}
                className="inline-flex items-center gap-1.5 max-w-full px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-sun/50 text-sm text-white font-semibold transition-all cursor-pointer disabled:opacity-50 text-left"
              >
                <Icon className="w-4 h-4 text-lemon shrink-0" />
                <span className="truncate">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMsg);
        }}
        className="p-4 bg-white/5 border-t border-white/10 flex items-center space-x-3"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask about safe models, bad-credit documents, checklists..."
          disabled={loading}
          className="flex-1 bg-white/10 text-base border-2 border-white/20 rounded-xl px-4 py-3 min-h-[2.75rem] text-white placeholder-white/50 focus:outline-none focus:border-sun transition-colors"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || loading}
          className="p-3 rounded-xl bg-sun hover:bg-sun-bright disabled:bg-white/20 text-white disabled:text-white/40 transition-all flex items-center justify-center shrink-0 min-h-[2.75rem] min-w-[2.75rem]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
