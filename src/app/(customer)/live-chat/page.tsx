// =====================================================
// /live-chat — SHOP-LIVE-CHAT
// Live chat với dược sĩ
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Send, MessageCircle, Phone, Video, Clock } from 'lucide-react';

interface Msg {
  id: string;
  role: 'me' | 'pharmacist';
  text: string;
  time: string;
}

const INITIAL: Msg[] = [
  { id: '0', role: 'pharmacist', text: 'Xin chào! Tôi là DS. Trang, có thể giúp gì cho bạn?', time: '14:00' },
  { id: '1', role: 'me', text: 'Chào dược sĩ, tôi muốn hỏi về liều dùng Amoxicillin cho bé 8 tuổi.', time: '14:01' },
  { id: '2', role: 'pharmacist', text: 'Dạ bé 8 tuổi nặng khoảng 25kg thì dùng 250mg/lần, 3 lần/ngày, trong 5-7 ngày ạ. Bạn đã có đơn từ bác sĩ chưa?', time: '14:02' },
];

export default function LiveChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [
      ...m,
      {
        id: String(Date.now()),
        role: 'me',
        text: input,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Live chat' }]} />
          <div className="mt-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-accent-700">DT</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-ink-900">DS. Trần Thị Trang</h1>
              <p className="text-xs text-success-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                Đang trực tuyến
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Gọi điện"
                className="w-9 h-9 inline-flex items-center justify-center text-ink-700 hover:bg-ink-50 rounded transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Video call"
                className="w-9 h-9 inline-flex items-center justify-center text-ink-700 hover:bg-ink-50 rounded transition-colors"
              >
                <Video className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-4">
        <div className="bg-white border border-ink-200 rounded-md flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%]`}>
                  <div
                    className={`p-3 rounded-md text-sm whitespace-pre-line ${
                      m.role === 'me'
                        ? 'bg-accent-600 text-white rounded-br-sm'
                        : 'bg-ink-50 text-ink-900 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <p
                    className={`mt-1 text-[10px] font-mono ${
                      m.role === 'me' ? 'text-right' : ''
                    } text-ink-400`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 p-3 border-t border-ink-200"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              aria-label="Nhập tin nhắn"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-accent-600 text-white rounded-md hover:bg-accent-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              aria-label="Gửi"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <p className="mt-3 text-xs text-ink-500 text-center flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          Dược sĩ phản hồi trong vòng 2 phút · 8:00-22:00 hằng ngày
        </p>
      </div>
    </>
  );
}