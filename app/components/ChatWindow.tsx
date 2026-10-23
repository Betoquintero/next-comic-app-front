'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { assertChatResponseOk, parseChatStream, ChatMessage, ChatSource } from '../../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DisplayMessage extends ChatMessage {
  sources?: ChatSource[];
}

const MAX_HISTORY = 20;

const WELCOME_MESSAGE =
  'Ask me what to read next — e.g. "I loved Infinity Gauntlet, what should I read next without spoilers for Secret Wars?"';

const ChatWindow: React.FC = () => {
  const { isAuthenticated, authenticatedFetch } = useAuth();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: DisplayMessage = { role: 'user', content: trimmedInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    let assistantMessageStarted = false;

    const appendDelta = (text: string) => {
      // Flip the flag synchronously here, not inside the setState updater
      // below — React may defer calling that updater, so code right after
      // parseChatStream resolves would still see the stale `false`.
      const isFirstDelta = !assistantMessageStarted;
      assistantMessageStarted = true;

      setMessages((prev) => {
        if (isFirstDelta) {
          return [...prev, { role: 'assistant', content: text }];
        }
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + text };
        return next;
      });
    };

    try {
      const historyToSend: ChatMessage[] = updatedMessages
        .slice(-MAX_HISTORY)
        .map(({ role, content }) => ({ role, content }));

      const response = await authenticatedFetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyToSend }),
      });

      await assertChatResponseOk(response);

      const { sources } = await parseChatStream(response, appendDelta);

      if (assistantMessageStarted) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], sources };
          return next;
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get a response from the chat assistant',
        {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reading Assistant</h2>
        <p className="text-gray-600 mb-4">You need to be logged in to use the chat assistant.</p>
        <Link
          href="/login"
          className="bg-gray-700 text-white text-center text-lg rounded-lg py-2 px-6 inline-block hover:shadow-lg"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-[70vh]">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Reading Assistant</h2>

      <div className="flex-grow overflow-y-auto space-y-4 mb-4 p-2" data-testid="chat-messages">
        {messages.length === 0 && (
          <p className="text-gray-600 text-center italic">{WELCOME_MESSAGE}</p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === 'user' ? 'bg-dc-blue text-white' : 'bg-light-grey text-gray-800'
              }`}
            >
              {/* Claude answers in markdown; Tailwind's preflight strips list/bold styles, so restore them here */}
              {message.role === 'assistant' ? (
                <div className="[&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                message.content
              )}
            </div>
            {message.sources && message.sources.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Based on: {message.sources.map((source) => source.name || source.type).join(', ')}
              </p>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex flex-col items-start">
            <div className="rounded-lg px-4 py-2 bg-light-grey text-gray-800 italic">Thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="formBox flex-grow border border-gray-300 rounded-md shadow-sm px-3 py-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about what to read next..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`bg-gray-700 text-white text-lg rounded-lg py-2 px-6 hover:shadow-lg ${
            isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChatWindow;
