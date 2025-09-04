import React, { useCallback, useRef, useState, useEffect } from 'react';
import { AppMode } from '../types';

interface RightPanelProps {
  generatedImages: string[] | null;
  originalImage: string | null;
  isLoading: boolean;
  error: string | null;
  mode: AppMode;
  onImageUpload: (file: File) => void;
  onClearImage: () => void;
  onGenerateMore: () => void;
  canGenerateMore: boolean;
}

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mb-4"></div>
    <h2 className="font-orbitron text-xl font-semibold text-brand-light">Processando sua imagem...</h2>
    <p className="text-brand-gray mt-1">A IA está trabalhando. Isso pode levar um momento.</p>
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082a.75.75 0 01.75.75v5.714c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75h5.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6-6m0 0l-6 6m6-6v12a6 6 0 01-12 0v-3" />
    </svg>
    <h2 className="font-orbitron text-2xl font-bold text-brand-light">Bem-vindo ao AI Image Studio</h2>
    <p className="text-brand-gray mt-2 max-w-md">Descreva o que você imagina no painel à esquerda e veja a mágica acontecer.</p>
  </div>
);

const ImageUpload: React.FC<{ onImageUpload: (file: File) => void }> = ({ onImageUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) onImageUpload(event.target.files[0]);
    };
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files?.[0]) onImageUpload(event.dataTransfer.files[0]);
    }, [onImageUpload]);
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-brand-dark rounded-lg bg-brand-darker/50" onDrop={handleDrop} onDragOver={handleDragOver}>
            <input type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} className="hidden" />
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
            <h2 className="font-orbitron text-2xl font-bold text-brand-light">Modo de Edição</h2>
            <p className="text-brand-gray mt-2 max-w-md">Arraste e solte uma imagem, ou{' '}<button onClick={() => inputRef.current?.click()} className="text-brand-accent font-semibold hover:underline">clique para carregar</button>.</p>
        </div>
    );
};

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-brand-error/10 border border-brand-error/50 rounded-lg">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-error mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <h2 className="text-xl font-semibold text-brand-light">Ocorreu um Erro</h2>
      <p className="text-brand-error/80 mt-1 max-w-md">{message}</p>
    </div>
);


export const RightPanel: React.FC<RightPanelProps> = ({ generatedImages, originalImage, isLoading, error, mode, onImageUpload, onClearImage, onGenerateMore, canGenerateMore }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (generatedImages && generatedImages.length > 0) {
      setSelectedImage(generatedImages[0]);
    } else if (originalImage) {
        setSelectedImage(originalImage);
    } else {
        setSelectedImage(null);
    }
  }, [generatedImages, originalImage]);

  const handleDownload = () => {
    if (!selectedImage) return;
    const a = document.createElement('a');
    a.href = selectedImage;
    a.download = `nanobanana-ai-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    
    if (selectedImage) {
      return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center relative group gap-4">
            <div className="flex-grow w-full flex items-center justify-center overflow-hidden">
                <img src={selectedImage} alt="AI Result" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
            </div>
            { (generatedImages && generatedImages.length > 1) &&
                <div className="flex-shrink-0 flex gap-2 p-2 bg-brand-darker/50 rounded-lg">
                    {generatedImages.map((img, index) => (
                        <img key={index} src={img} onClick={() => setSelectedImage(img)} className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-colors ${selectedImage === img ? 'border-brand-accent' : 'border-transparent hover:border-brand-gray'}`}/>
                    ))}
                </div>
            }
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {mode === AppMode.EDIT && originalImage && (
                    <button onClick={onClearImage} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors" aria-label="Limpar imagem"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                )}
                {canGenerateMore && !isLoading && (
                    <button onClick={onGenerateMore} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors" aria-label="Gerar mais como esta">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 12A8 8 0 1013 5.24M20 4v5h-5" />
                        </svg>
                    </button>
                )}
                 <button onClick={handleDownload} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors" aria-label="Baixar imagem"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
            </div>
        </div>
      );
    }
    
    if (mode === AppMode.EDIT) return <ImageUpload onImageUpload={onImageUpload} />;
    return <InitialState />;
  };

  return (
    <main className="w-full md:w-2/3 lg:w-3/4 bg-brand-dark/70 backdrop-blur-lg border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 min-h-[60vh] md:min-h-0">
      <div className="w-full h-full">{renderContent()}</div>
    </main>
  );
};