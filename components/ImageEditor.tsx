
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    };
};


const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Add a retro filter');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOriginalImageFile(file);
            setOriginalImage(URL.createObjectURL(file));
            setEditedImage(null);
        }
    };

    const handleSubmit = async () => {
        if (!prompt || !originalImageFile) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const imagePart = await fileToGenerativePart(originalImageFile);
            const result = await editImage(prompt, imagePart);
            if(result) {
                setEditedImage(result);
            } else {
                setError("Failed to generate edited image. The model might not have returned an image.");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="p-4 bg-gray-800/50 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Gemini Image Editor</h2>
                <p className="text-sm text-gray-400 mt-1">Upload an image and tell Gemini how to change it.</p>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
                <div className="flex flex-col bg-gray-800/50 rounded-lg p-4 gap-4">
                    <h3 className="font-semibold text-lg">Original</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg bg-gray-900/50">
                        {originalImage ? (
                            <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <p className="text-gray-500">Upload an image to start</p>
                        )}
                    </div>
                     <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <div className="flex flex-col bg-gray-800/50 rounded-lg p-4 gap-4">
                    <h3 className="font-semibold text-lg">Edited</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg bg-gray-900/50 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                            </div>
                        )}
                        {editedImage ? (
                            <img src={editedImage} alt="Edited" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <p className="text-gray-500">Your edited image will appear here</p>
                        )}
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Make the sky purple"
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !originalImageFile}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </div>
    );
};

export default ImageEditor;
