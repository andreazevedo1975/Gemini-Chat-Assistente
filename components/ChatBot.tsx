// Fix: Add type definitions for Web Speech API to resolve "Cannot find name 'SpeechRecognition'".
// The Web Speech API is not a standard part of TypeScript's DOM typings.
interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
}

interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly length: number;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev ? `${prev} ${transcript}`.trim() : transcript);
            };

            recognition.onerror = (event) => {
                setError(`Speech recognition error: ${event.error}`);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const initializeChat = useCallback(() => {
        try {
            const API_KEY = process.env.API_KEY;
            if (!API_KEY) throw new Error("API_KEY not found");
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred during initialization.");
        }
    }, []);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);


    const sendMessage = async () => {
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await chatRef.current.sendMessage({ message: input });
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get response from Gemini.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setError(null); // Clear previous errors
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const MicIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
            <path d="M5.5 9.5a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5z" />
            <path d="M5 4a1 1 0 00-1 1v1a1 1 0 002 0V5a1 1 0 00-1-1zM15 4a1 1 0 00-1 1v1a1 1 0 002 0V5a1 1 0 00-1-1z" />
            <path fillRule="evenodd" d="M4 8a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M4 12a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
        </svg>
    );

    return (
        <div className="flex flex-col h-full bg-gray-800/50 rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Gemini Chat Assistant</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                           {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-lg px-4 py-2 rounded-lg bg-gray-700 text-gray-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask Gemini anything..."
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleMicClick}
                        disabled={!recognitionRef.current || isLoading}
                        className={`p-3 rounded-full transition-colors ${
                            isRecording
                                ? 'bg-red-600 text-white animate-pulse'
                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                        <MicIcon />
                    </button>
                    <button onClick={sendMessage} disabled={isLoading || !input.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;