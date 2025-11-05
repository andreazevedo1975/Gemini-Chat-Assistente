
import React, { useState } from 'react';
import { getQuickResponse } from '../services/geminiService';

const QuickQA: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('What are three fun facts about the ocean?');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult('');
        
        try {
            const response = await getQuickResponse(prompt);
            setResult(response);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="h-full flex flex-col gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-white">Quick Q&A (Low-Latency)</h2>
                <p className="text-sm text-gray-400 mt-1">Experience fast responses for quick questions, powered by gemini-flash-lite.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                 <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ask a quick question..."
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    {isLoading ? 'Thinking...' : 'Get Answer'}
                </button>
            </div>
            <div className="flex-1 bg-gray-800/50 rounded-lg p-6 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {result && (
                    <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickQA;
