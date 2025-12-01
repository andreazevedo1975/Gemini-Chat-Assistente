import React, { useState } from 'react';
import ChatBot from './components/ChatBot';
import ImageEditor from './components/ImageEditor';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import WebSearch from './components/WebSearch';
import TextToSpeech from './components/TextToSpeech';
import QuickQA from './components/QuickQA';

type Feature = 'CHAT' | 'IMAGE_EDIT' | 'DOC_ANALYZE' | 'WEB_SEARCH' | 'TTS' | 'QUICK_QA';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('CHAT');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'CHAT': return <ChatBot />;
      case 'IMAGE_EDIT': return <ImageEditor />;
      case 'DOC_ANALYZE': return <DocumentAnalyzer />;
      case 'WEB_SEARCH': return <WebSearch />;
      case 'TTS': return <TextToSpeech />;
      case 'QUICK_QA': return <QuickQA />;
      default: return <ChatBot />;
    }
  };

  // Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  const NavItem: React.FC<{ feature: Feature; label: string; icon: React.ReactNode }> = ({ feature, label, icon }) => (
    <button
      onClick={() => setActiveFeature(feature)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        activeFeature === feature
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 space-y-2 flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-6 px-2">Suíte Gemini</h1>
        <nav className="flex-grow">
          <NavItem feature="CHAT" label="Assistente de Chat" icon={<ChatIcon />} />
          <NavItem feature="IMAGE_EDIT" label="Editor de Imagens" icon={<ImageIcon />} />
          <NavItem feature="DOC_ANALYZE" label="Analisador de Docs" icon={<DocumentIcon />} />
          <NavItem feature="WEB_SEARCH" label="Busca na Web" icon={<SearchIcon />} />
          <NavItem feature="TTS" label="Texto para Fala" icon={<SpeakerIcon />} />
          <NavItem feature="QUICK_QA" label="Perguntas Rápidas" icon={<LightningIcon />} />
        </nav>
        <div className="text-xs text-gray-500 text-center">Criado com Gemini</div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        {renderFeature()}
      </main>
    </div>
  );
};

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l4 4A1 1 0 0115.707 7.5H12a2 2 0 01-2-2V4H6zm2 6a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const SpeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9 9 0 0119 10a9 9 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7 7 0 0017 10a7 7 0 00-2.343-5.657 1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5 5 0 0115 10a5 5 0 01-1.757 3.536 1 1 0 11-1.415-1.415A3 3 0 0013 10a3 3 0 00-.757-2.121 1 1 0 010-1.415z" clipRule="evenodd" /></svg>;
const LightningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;

export default App;