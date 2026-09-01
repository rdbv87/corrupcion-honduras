'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:8000';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hola, soy el asistente de Corrupción Honduras. Puedo ayudarte con información sobre casos de corrupción documentados. ¿Qué deseas saber?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Lo siento, no pude conectar con el servicio de chat. Verifica que el backend esté ejecutándose.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#1c1917] hover:bg-[#292524] text-white dark:bg-[#f4f4f5] dark:text-[#121316] dark:hover:bg-white p-3.5 border-2 border-[#1c1917] dark:border-[#f4f4f5] shadow-retro dark:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-[#faf8f2] dark:bg-[#181920] border-2 border-[#1c1917] dark:border-[#3f3f46] shadow-retro dark:shadow-none flex flex-col overflow-hidden font-mono">
          <div className="bg-[#1c1917] text-white dark:bg-[#242730] px-4 py-3 flex items-center justify-between border-b-2 border-[#1c1917] dark:border-[#3f3f46]">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider">[ TERMINAL ASISTENTE ]</h3>
              <p className="text-[10px] text-[#a8a29e] dark:text-[#a1a1aa]">
                Consultas sobre expedientes públicos
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#a8a29e] hover:text-white p-1 border border-transparent hover:border-white transition-colors"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh] sm:max-h-[380px] min-h-[200px] text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 border ${
                    msg.role === 'user'
                      ? 'bg-[#1c1917] text-white border-[#1c1917] dark:bg-[#f4f4f5] dark:text-[#121316]'
                      : 'bg-white dark:bg-[#1f2026] text-[#1c1917] dark:text-[#f4f4f5] border-[#1c1917]/30 dark:border-[#3f3f46]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1f2026] p-2 border border-dashed border-[#1c1917]/40 text-[11px] text-[#78716c] dark:text-[#a1a1aa]">
                  <span className="animate-pulse">&gt; Consultando base documental...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t-2 border-[#1c1917] dark:border-[#3f3f46] p-2.5 bg-white dark:bg-[#15161c]">
            <label htmlFor="chat-input" className="sr-only">
              Escribe tu mensaje
            </label>
            <div className="flex gap-2">
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta..."
                className="input-base text-xs resize-none py-1.5"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
                aria-label="Enviar"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
