import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, MicrophoneIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

// Type definition for the SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isSpeechRecognitionSupported]);

  useEffect(() => {
    if (disabled && isRecording) {
      recognitionRef.current?.stop();
    }
  }, [disabled, isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleMicClick = () => {
    if (disabled || !recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setInput(''); // Clear input before starting a new recording
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-200">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isRecording ? 'Listening...' : 'Ask about your account...'}
        disabled={disabled}
        className="flex-grow px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        aria-label="Chat input"
      />
      {isSpeechRecognitionSupported && (
        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled}
          className={`ml-3 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-blue-500'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording with microphone'}
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>
      )}
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="ml-3 flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};