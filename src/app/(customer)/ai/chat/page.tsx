// =====================================================
// /ai/chat — CHAT-AI (polished)
// Smart pattern matching với AI_INTENTS database
// + follow-up suggestions
// + conversation history
// =====================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { sendChatMessage } from '@/features/ai-chat';
import type { AIMessage } from '@/features/ai-chat';

interface Message extends AIMessage {
  followUp?: string[];
}

const SUGGESTIONS = [
  'Paracetamol có dùng được cho bà bầu không?',
  'Liều Paracetamol cho trẻ 5 tuổi?',
  'Tôi bị đau đầu, nên dùng thuốc gì?',
  'Tương tác giữa Ibuprofen và Aspirin?',
  'Vitamin D3 uống bao nhiêu mỗi ngày?',
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      content:
        'Xin chào! Tôi là trợ lý dược sĩ AI của PCMS.\n\nTôi có thể giúp bạn về:\n• Tra cứu thuốc, liều dùng\n• Tương tác thuốc\n• Triệu chứng thường gặp\n• Vitamin & TPCN\n\nBạn đang cần tư vấn về vấn đề gì?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || sending) return;
    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: cleanText,
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      const history = messages.slice(0, -1).map(m => ({ id: m.id, role: m.role, content: m.content, timestamp: m.timestamp }));
      const { response, followUp } = await sendChatMessage({ message: cleanText, history });
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
        followUp,
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        role: 'ai',
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        timestamp: Date.now(),
      };
      setMessages((m) => [...m, aiMsg]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    if (!window.confirm('Xoá toàn bộ cuộc trò chuyện?')) return;
    setMessages([
      {
        id: '0',
        role: 'ai',
        content: 'Đã xoá cuộc trò chuyện. Bạn cứ hỏi bất kỳ điều gì nhé!',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'AI' }, { label: 'Chat dược sĩ' }]} />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-accent-700" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-ink-900">Trợ lý dược sĩ AI</h1>
                <p className="text-xs text-ink-500">Hỏi đáp 24/7 · Phản hồi tức thì</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearChat}
              className="text-xs text-ink-500 hover:text-danger-600 transition-colors"
            >
              Xoá cuộc trò chuyện
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white border border-ink-200 rounded-md flex flex-col h-[60vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <MessageBubble key={m.id} msg={m} onSuggest={send} />
            ))}
            {sending && <TypingIndicator />}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 border-t border-ink-100 pt-2">
              <p className="text-xs text-ink-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Gợi ý câu hỏi:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="px-3 h-7 text-xs text-left bg-ink-100 text-ink-700 rounded-full hover:bg-ink-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 p-3 border-t border-ink-200"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về thuốc, liều dùng, tương tác..."
              disabled={sending}
              className="flex-1 h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
              aria-label="Nhập câu hỏi"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="w-10 h-10 bg-accent-600 text-white rounded-md hover:bg-accent-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              aria-label="Gửi"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <p className="mt-3 text-xs text-ink-500 text-center">
          ⚠️ AI có thể mắc sai sót. Luôn kiểm chứng với dược sĩ/bác sĩ trước khi dùng thuốc.
        </p>
      </div>
    </>
  );
}

function MessageBubble({
  msg,
  onSuggest,
}: {
  msg: Message;
  onSuggest: (s: string) => void;
}) {
  return (
    <div className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          msg.role === 'ai' ? 'bg-accent-100' : 'bg-ink-100'
        }`}
        aria-hidden="true"
      >
        {msg.role === 'ai' ? (
          <Bot className="w-4 h-4 text-accent-700" />
        ) : (
          <UserIcon className="w-4 h-4 text-ink-600" />
        )}
      </div>
      <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3 rounded-md text-sm whitespace-pre-line ${
            msg.role === 'user'
              ? 'bg-accent-600 text-white rounded-br-sm'
              : 'bg-ink-50 text-ink-900 rounded-bl-sm'
          }`}
        >
          {msg.content}
        </div>
        {msg.role === 'ai' && msg.followUp && msg.followUp.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.followUp.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggest(s)}
                className="px-2.5 h-6 text-[10px] font-medium bg-white border border-accent-300 text-accent-700 rounded-full hover:bg-accent-50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-accent-700" />
      </div>
      <div className="bg-ink-50 px-3 py-2 rounded-md text-sm text-ink-500">
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-pulse" />
          <span className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-pulse [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-pulse [animation-delay:0.4s]" />
        </span>
      </div>
    </div>
  );
}
