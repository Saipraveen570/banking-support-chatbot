import React, { useState, useEffect, useRef } from 'react';
import { Message, Author } from './types';
import { startChat, sendMessage } from './services/geminiService';
import { findFaqAnswer } from './services/faqService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { BotIcon, TrashIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    author: Author.BOT,
    text: "Hello! I'm your virtual assistant from Starlight Bank. How can I help you today?",
  };

  useEffect(() => {
    startChat();
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    const newUserMessage: Message = { author: Author.USER, text: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    const faqResult = await findFaqAnswer(userInput);

    if (faqResult) {
      // If an FAQ answer is found, display it with suggestions
      setTimeout(() => {
        const botMessage: Message = {
          author: Author.BOT,
          text: faqResult.answer,
          suggestions: faqResult.relatedQuestions,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // If no FAQ match, call the Gemini API
    try {
      const botResponse = await sendMessage(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          author: Author.BOT,
          text: botResponse.text,
          accounts: botResponse.accounts,
        },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { author: Author.BOT, text: "I'm sorry, an unexpected error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    startChat();
    setMessages([initialMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center">
          <BotIcon className="w-8 h-8 text-indigo-500 mr-3" />
          <h1 className="text-xl font-bold text-gray-800">Starlight Bank Support</h1>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          aria-label="Clear chat"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </header>
      
      <main ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div key={index}>
              <ChatMessage message={msg} />
              {/* Render suggestions only for the last message, if it's from the bot and has suggestions */}
              {index === messages.length - 1 &&
               msg.author === Author.BOT &&
               msg.suggestions &&
               msg.suggestions.length > 0 &&
               !isLoading && (
                <div className="flex justify-start">
                  <div className="ml-11"> {/* Aligns with bot message bubble (w-8 icon + gap-3) */}
                    <SuggestedQuestions
                      suggestions={msg.suggestions}
                      onQuestionClick={handleSendMessage}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 my-4 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <BotIcon className="w-5 h-5" />
              </div>
              <div className="max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md bg-white text-gray-800 rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">Typing</span>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
