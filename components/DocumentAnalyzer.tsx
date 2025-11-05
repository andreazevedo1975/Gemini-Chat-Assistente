
import React, { useState } from 'react';
import { analyzeDocument } from '../services/geminiService';
import { LOTTERY_ANALYSIS_TEXT } from '../constants';

const DocumentAnalyzer: React.FC = () => {
    const [documentText, setDocumentText] = useState<string>(LOTTERY_ANALYSIS_TEXT);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentMode, setCurrentMode] = useState<'quick' | 'deep' | null>(null);

    const handleAnalysis = async (useThinkingMode: boolean) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult('');
        setCurrentMode(useThinkingMode ? 'deep' : 'quick');

        try {
            const result = await analyzeDocument(documentText, useThinkingMode);
            setAnalysisResult(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
             <div className="p-4 bg-gray-800/50 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Document Analyzer</h2>
                <p className="text-sm text-gray-400 mt-1">Paste any text and let Gemini analyze it. Choose a quick summary or a deep analysis using thinking mode for complex topics.</p>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
                <div className="flex flex-col bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Document</h3>
                    <textarea
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-2 w-full resize-none text-sm leading-relaxed"
                        placeholder="Paste your document here..."
                    />
                </div>
                <div className="flex flex-col bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Analysis</h3>
                    <div className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-4 w-full overflow-y-auto prose prose-invert prose-sm max-w-none">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : error ? (
                            <p className="text-red-400">{error}</p>
                        ) : analysisResult ? (
                            <p className="whitespace-pre-wrap">{analysisResult}</p>
                        ) : (
                            <p className="text-gray-500">Analysis will appear here.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-end">
                 <button
                    onClick={() => handleAnalysis(false)}
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    {isLoading && currentMode === 'quick' ? 'Analyzing...' : 'Quick Summary'}
                </button>
                 <button
                    onClick={() => handleAnalysis(true)}
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                     {isLoading && currentMode === 'deep' ? 'Thinking...' : 'Deep Analysis (Thinking Mode)'}
                </button>
            </div>
        </div>
    );
};

export default DocumentAnalyzer;
