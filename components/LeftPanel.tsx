import React from 'react';
import { AppMode, AspectRatio } from '../types';

interface LeftPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onGenerate: () => void;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  isEditDisabled: boolean;
  numberOfImages: number;
  setNumberOfImages: (num: number) => void;
}

const aspectRatios: { label: string, value: AspectRatio }[] = [
    { label: '1:1', value: '1:1' },
    { label: '3:4', value: '3:4' },
    { label: '4:3', value: '4:3' },
    { label: '9:16', value: '9:16' },
    { label: '16:9', value: '16:9' },
];

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="space-y-2">
        <label className="block font-semibold text-sm text-brand-accent">{label}</label>
        {children}
    </div>
);

export const LeftPanel: React.FC<LeftPanelProps> = (props) => {
  const {
    prompt, setPrompt, mode, setMode, onGenerate, isLoading,
    aspectRatio, setAspectRatio, isEditDisabled, numberOfImages,
    setNumberOfImages
  } = props;

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (!isLoading && prompt.trim() && !(mode === AppMode.EDIT && isEditDisabled)) onGenerate();
    }
  };

  const buttonText = mode === AppMode.CREATE ? 'Gerar Imagem' : 'Aplicar Edição';
  const isButtonDisabled = isLoading || !prompt.trim() || (mode === AppMode.EDIT && isEditDisabled);

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-brand-dark/70 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl space-y-6">
      <header>
        <h1 className="font-orbitron text-2xl font-bold text-brand-accent">AI Image Studio</h1>
        <p className="text-md text-brand-gray">Gerador profissional de imagens</p>
      </header>

      <div className="flex-grow flex flex-col space-y-4">
        <InputGroup label={mode === AppMode.CREATE ? "Descreva sua ideia" : "Descreva a edição"}>
            <textarea
                id="prompt"
                className="w-full flex-grow bg-brand-darker border-2 border-brand-dark rounded-lg p-3 text-brand-light placeholder-brand-gray/50 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                placeholder={mode === AppMode.CREATE ? "Um cavalo caminhando em uma ilha bonita..." : "Adicione um chapéu de festa no gato..."}
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                rows={mode === AppMode.CREATE ? 8 : 4}
            />
        </InputGroup>

        {mode === AppMode.CREATE && (
            <div className="space-y-4">
                <InputGroup label="Proporção da Imagem">
                    <div className="grid grid-cols-5 gap-2">
                        {aspectRatios.map(({ label, value }) => (
                            <button key={value} onClick={() => setAspectRatio(value)} className={`font-semibold py-2 px-1 rounded-md transition-colors duration-200 text-xs ${aspectRatio === value ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white' : 'bg-brand-darker hover:bg-brand-dark'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </InputGroup>

                <InputGroup label={`Número de Imagens: ${numberOfImages}`}>
                   <input type="range" min="1" max="4" value={numberOfImages} onChange={(e) => setNumberOfImages(parseInt(e.target.value))} className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                </InputGroup>
            </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 bg-brand-darker p-1 rounded-lg">
        <button onClick={() => setMode(AppMode.CREATE)} className={`mode-btn ${mode === AppMode.CREATE ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white' : 'hover:bg-brand-dark'} rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-200`}>
          Criar
        </button>
        <button onClick={() => setMode(AppMode.EDIT)} className={`mode-btn ${mode === AppMode.EDIT ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white' : 'hover:bg-brand-dark'} rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-200`}>
          Editar
        </button>
      </div>

      <button onClick={onGenerate} disabled={isButtonDisabled} className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary-hover disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center shadow-glow-primary">
        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><span className="mr-2">{buttonText}</span><i className="fas fa-bolt"></i></>}
      </button>
    </aside>
  );
};