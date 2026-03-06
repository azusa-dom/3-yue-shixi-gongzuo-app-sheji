import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bot, ChevronRight, LoaderCircle, Send, Sparkles } from 'lucide-react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import { generateAssistantReply, type AssistantAction, type AssistantIntent } from '../lib/assistantEngine';

type Role = 'bot' | 'user';

interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  time: string;
  urgency?: 'normal' | 'urgent';
  action?: AssistantAction;
}

const CHAT_STORAGE_KEY = 'yuntu-assistant-chat-history-v1';
const defaultPrompts = ['如何预约 GP 建档?', '我想做心理测评', '紧急情况拨打什么电话?', '我的会员权益有哪些?'];
const thinkingTips = ['正在整理你的问题...', '正在生成建议...', '正在匹配服务路径...'];
const RESPONSE_LATENCY_MS = 120;

function nowLabel() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function createWelcomeMessage(membershipExpiry: string): ChatMessage {
  return {
    id: 'welcome',
    role: 'bot',
    text:
      `您好，我是云途护航智能助手。\n当前账号会员有效期至 ${membershipExpiry}。\n您可以直接告诉我：预约 GP、申请病假条、查看进度、紧急就医等具体需求。`,
    time: nowLabel(),
    urgency: 'normal',
  };
}

function restoreMessages(membershipExpiry: string): ChatMessage[] {
  const fallback = [createWelcomeMessage(membershipExpiry)];
  if (typeof window === 'undefined') return fallback;

  const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || !parsed.length) return fallback;

    const sanitized = parsed
      .filter(item => item && (item.role === 'bot' || item.role === 'user') && typeof item.text === 'string')
      .map(item => ({
        id: typeof item.id === 'string' ? item.id : `msg-${Date.now()}-${Math.random()}`,
        role: item.role,
        text: item.text,
        time: typeof item.time === 'string' ? item.time : nowLabel(),
        urgency: item.urgency === 'urgent' ? 'urgent' : 'normal',
        action: item.action,
      })) as ChatMessage[];

    return sanitized.length ? sanitized.slice(-80) : fallback;
  } catch {
    return fallback;
  }
}

export function AssistantScreen() {
  const { push } = useNav();
  const { membershipExpiry, serviceRequests, documentRecords } = useDemoData();
  const [messages, setMessages] = useState<ChatMessage[]>(() => restoreMessages(membershipExpiry));
  const [input, setInput] = useState('');
  const [smartPrompts, setSmartPrompts] = useState<string[]>(defaultPrompts);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState(thinkingTips[0]);
  const [lastIntent, setLastIntent] = useState<AssistantIntent | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistantContext = useMemo(
    () => ({
      membershipExpiry,
      serviceRequests,
      documentRecords,
    }),
    [membershipExpiry, serviceRequests, documentRecords],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-80)));
  }, [messages]);

  const handleAction = (action?: AssistantAction) => {
    if (!action) return;
    if (action.type === 'open-booking') {
      push({ id: 'booking', title: action.payload || '找医生与科室' });
      return;
    }
    if (action.type === 'open-medical-guide') {
      push({ id: 'medical-guide' });
      return;
    }
    if (action.type === 'open-faq') {
      push({ id: 'faq' });
      return;
    }
    if (action.type === 'open-benefits') {
      push({ id: 'benefits' });
      return;
    }
    if (action.type === 'open-academic-docs') {
      push({ id: 'academic-docs' });
      return;
    }
    if (action.type === 'open-request-progress') {
      if (action.payload) {
        push({ id: 'request-progress', requestId: action.payload });
      } else {
        push({ id: 'service-portal' });
      }
      return;
    }
    if (action.type === 'open-mental-assessment') {
      push({ id: 'mental-assessment' });
    }
  };

  const runAssistant = (question: string) => {
    const tip = thinkingTips[Math.floor(Math.random() * thinkingTips.length)];
    setThinkingText(tip);
    setIsThinking(true);

    window.setTimeout(() => {
      const reply = generateAssistantReply({
        input: question,
        context: assistantContext,
        lastIntent,
      });

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: reply.text,
          time: nowLabel(),
          urgency: reply.urgency,
          action: reply.action,
        },
      ]);
      setSmartPrompts(reply.followUps.slice(0, 4));
      setLastIntent(reply.intent);
      setIsThinking(false);
    }, RESPONSE_LATENCY_MS);
  };

  const handleSend = (text: string = input) => {
    const question = text.trim();
    if (!question || isThinking) return;

    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: question,
        time: nowLabel(),
      },
    ]);
    setInput('');
    runAssistant(question);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      <div className="pt-12 pb-4 px-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-500" />
          <h1 className="text-lg font-bold text-slate-800">智能助手</h1>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">本地智能分流模式</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-36">
        {messages.map(message => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {message.role === 'bot' && (
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Bot size={18} />
              </div>
            )}

            <div className="max-w-[82%]">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border whitespace-pre-line ${
                  message.role === 'bot'
                    ? message.urgency === 'urgent'
                      ? 'bg-red-50 border-red-100 text-red-700 rounded-tl-none'
                      : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'
                    : 'bg-blue-500 border-blue-400 text-white rounded-tr-none'
                }`}
              >
                {message.urgency === 'urgent' && message.role === 'bot' && (
                  <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold">
                    <AlertTriangle size={14} />
                    紧急分级提醒
                  </div>
                )}
                {message.text}
              </div>

              <div className={`mt-1 text-[10px] text-slate-400 ${message.role === 'user' ? 'text-right' : ''}`}>{message.time}</div>

              {message.role === 'bot' && message.action && (
                <button
                  onClick={() => handleAction(message.action)}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {message.action.label}
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <LoaderCircle size={18} className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-sm text-slate-500 shadow-sm">
              {thinkingText}
            </div>
          </div>
        )}

        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">猜你想问</p>
          <div className="flex flex-wrap gap-2">
            {smartPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isThinking}
                className="bg-white border border-slate-200 px-4 py-2 rounded-full text-xs text-slate-600 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center gap-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt}
                <ChevronRight size={12} />
              </button>
            ))}
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 pb-safe z-20">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入你的需求，例如：我需要查看最近服务进度"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform disabled:bg-blue-200 disabled:cursor-not-allowed"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
