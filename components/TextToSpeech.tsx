import React, { useState, useRef, useEffect } from 'react';
import { getTextToSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

const VOICES = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState<string>('Olá! Eu sou um modelo Gemini, pronto para falar o que penso.');
    const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
    const [speed, setSpeed] = useState<number>(1);
    const [pitch, setPitch] = useState<number>(0);
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
            const base64Audio = await getTextToSpeech(text, selectedVoice);
            if (!base64Audio || !audioContextRef.current) {
                throw new Error("Falha ao gerar dados de áudio.");
            }

            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            
            // Apply client-side effects
            source.playbackRate.value = speed;
            // Detune is in cents. 100 cents = 1 semitone.
            source.detune.value = pitch * 100;

            source.connect(audioContextRef.current.destination);
            source.start();
            setIsPlaying(true);
            
            source.onended = () => {
                setIsPlaying(false);
            };

            audioSourceRef.current = source;

        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full flex flex-col gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-white">Texto para Fala Personalizável</h2>
                <p className="text-sm text-gray-400 mt-1">Escolha uma voz, ajuste a velocidade e o tom, e converta texto em fala.</p>
            </div>
            
            <div className="flex-1 bg-gray-800/50 rounded-lg p-6 flex flex-col gap-4">
                <textarea
                    id="tts-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-3 w-full resize-none text-base leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Digite o que você quer ouvir..."
                    rows={6}
                />
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Voice Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Voz</label>
                        <select 
                            value={selectedVoice} 
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {VOICES.map(voice => (
                                <option key={voice} value={voice}>{voice}</option>
                            ))}
                        </select>
                    </div>

                    {/* Speed Control */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300 flex justify-between">
                            <span>Velocidade</span>
                            <span className="text-gray-400 text-xs">{speed.toFixed(1)}x</span>
                        </label>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="2.0" 
                            step="0.1" 
                            value={speed} 
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Pitch Control */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300 flex justify-between">
                            <span>Tom</span>
                            <span className="text-gray-400 text-xs">{pitch > 0 ? '+' : ''}{pitch} st</span>
                        </label>
                        <input 
                            type="range" 
                            min="-12" 
                            max="12" 
                            step="1" 
                            value={pitch} 
                            onChange={(e) => setPitch(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                
                <button
                    onClick={handleGenerateAndPlay}
                    disabled={isLoading || !text.trim()}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
                >
                    {isLoading ? 'Gerando...' : isPlaying ? 'Tocando...' : 'Gerar e Tocar'}
                </button>
            </div>
        </div>
    );
};

export default TextToSpeech;