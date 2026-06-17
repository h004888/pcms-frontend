// =====================================================
// /ai/chat — CHAT-AI
// Chat với dược sĩ AI
// =====================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Send, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

const SUGGESTIONS = [
  'Paracetamol có dùng được cho bà bầu không?',
  'Tôi bị đau đầu, nên dùng thuốc gì?',
  'Tương tác giữa Amoxicillin và rượu?',
  'Liều Vitamin C cho trẻ 5 tuổi?',
];

const AI_RESPONSES: Record<string, string> = {
  default:
    'Cảm ơn bạn đã hỏi. Đây là thông tin tham khảo, không thay thế tư vấn y khoa. Bạn có thể mô tả chi tiết hơn về triệu chứng để tôi hỗ trợ tốt hơn?',
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      content: 'Xin chào! Tôi là trợ lý dược sĩ AI. Bạn cứ hỏi về thuốc, liều dùng, tương tác — tôi sẽ hỗ trợ trong khả năng tốt nhất.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || sending) return;
    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    // Mock AI response sau 1.2s
    setTimeout(() => {
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        role: 'ai',
        content:
          AI_RESPONSES[text] ??
          `${AI_RESPONSES.default}\n\nBạn vừa hỏi: "${text}"`,
        timestamp: Date.now() + 1,
      };
      setMessages((m) => [...m, aiMsg]);
      setSending(false);
    }, 1200);
  };

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'AI' }, { label: 'Chat dược sĩ' }]} />
          <div className="mt-3 flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-700" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900">Trợ lý dược sĩ AI</h1>
              <p className="text-xs text-ink-500">Hỏi đáp 24/7 · Phản hồi tức thì</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white border border-ink-200 rounded-md flex flex-col h-[60vh]">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${
                  m.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.role === 'ai' ? 'bg-accent-100' : 'bg-ink-100'
                  }`}
                  aria-hidden="true"
                >
                  {m.role === 'ai' ? (
                    <Bot className="w-4 h-4 text-accent-700" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-ink-600" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-md text-sm whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-accent-600 text-white'
                      : 'bg-ink-50 text-ink-900'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
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
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 border-t border-ink-100 pt-2">
              <p className="text-xs text-ink-500 mb-2">Gợi ý câu hỏi:</p>
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

          {/* Input */}
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