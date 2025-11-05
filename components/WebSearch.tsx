
import React, { useState } from 'react';
import { getGroundedSearch } from '../services/geminiService';

const WebSearch: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Who won the latest F1 race?');
    const [result, setResult] = useState<string>('');
    const [sources, setSources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult('');
        setSources([]);

        try {
            const { text, sources } = await getGroundedSearch(prompt);
            setResult(text);
            setSources(sources);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="h-full flex flex-col gap-6">
            <div className="p-4 bg-gray-800/50 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Grounded Web Search</h2>
                <p className="text-sm text-gray-400 mt-1">Ask questions about recent events. Gemini will use Google Search to provide up-to-date answers with sources.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                 <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ask about something current..."
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
            <div className="flex-1 bg-gray-800/50 rounded-lg p-4 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {result && (
                    <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{result}</p>
                        {sources.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold">Sources:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    {sources.map((source, index) => source.web && (
                                        <li key={index}>
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                {source.web.title || source.web.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebSearch;
