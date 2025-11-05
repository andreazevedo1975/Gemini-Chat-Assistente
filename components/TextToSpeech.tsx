
import React, { useState, useRef, useEffect } from 'react';
import { getTextToSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState<string>('Hello! I am a Gemini model, ready to speak my mind.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    useEffect(() => {
        // Initialize AudioContext on first user interaction (or component mount)
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        return () => {
            audioContextRef.current?.close();
        }
    }, []);

    const handleGenerateAndPlay = async () => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        setError(null);
        
        if (isPlaying && audioSourceRef.current) {
            audioSourceRef.current.stop();
            setIsPlaying(false);
        }

        try {
            const base64Audio = await getTextToSpeech(text);
            if (!base64Audio || !audioContextRef.current) {
                throw new Error("Failed to generate audio data.");
            }

            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
            setIsPlaying(true);
            
            source.onended = () => {
                setIsPlaying(false);
            };

            audioSourceRef.current = source;

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full flex flex-col gap-6 max-w-2xl mx-auto">
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-white">Text to Speech</h2>
                <p className="text-sm text-gray-400 mt-1">Convert text into natural-sounding speech with Gemini.</p>
            </div>
            
            <div className="flex-1 bg-gray-800/50 rounded-lg p-6 flex flex-col gap-4">
                <label htmlFor="tts-input" className="font-semibold">Enter Text</label>
                <textarea
                    id="tts-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-3 w-full resize-none text-base leading-relaxed"
                    placeholder="Type what you want to hear..."
                    rows={8}
                />
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button
                    onClick={handleGenerateAndPlay}
                    disabled={isLoading || !text.trim()}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                    {isLoading ? 'Generating...' : isPlaying ? 'Playing...' : 'Generate and Play'}
                </button>
            </div>
        </div>
    );
};

export default TextToSpeech;
