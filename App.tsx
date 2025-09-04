import React, { useState, useCallback, useEffect } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { generateImage as generateImageService, editImage as editImageService } from './services/geminiService';
import { AppMode, AspectRatio, GeneratedImage } from './types';

interface GenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  numberOfImages: number;
}

function App() {
  // Core state
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<AppMode>(AppMode.CREATE);
  const [tab, setTab] = useState<'home' | 'gallery'>('home');
  
  // Generation Options
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [lastGenerationParams, setLastGenerationParams] = useState<GenerationParams | null>(null);

  // Image State
  const [originalImage, setOriginalImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGeneratedImages(null);
    setOriginalImage(null);
    setError(null);
    setPrompt('');
    if (mode === AppMode.EDIT) {
      setLastGenerationParams(null); // Clear consistency params when switching to edit
    }
  }, [mode]);

  const executeGeneration = useCallback(async (params: GenerationParams) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    try {
      const imagesB64 = await generateImageService(params.prompt, params.aspectRatio, params.numberOfImages);
      const imagesDataUrl = imagesB64.map(b64 => `data:image/jpeg;base64,${b64}`);
      setGeneratedImages(imagesDataUrl);
      const newGalleryImages: GeneratedImage[] = imagesDataUrl.map(dataUrl => ({
        id: self.crypto.randomUUID(),
        b64: dataUrl,
        prompt: params.prompt,
        favorite: false,
      }));
      setGallery(prev => [...newGalleryImages, ...prev]);
      setLastGenerationParams(params);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!prompt || isLoading) return;

    if (mode === AppMode.CREATE) {
      await executeGeneration({ prompt, aspectRatio, numberOfImages });

    } else if (mode === AppMode.EDIT && originalImage) {
        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);
        try {
            const result = await editImageService(prompt, originalImage);
            if (result.imageB64) {
              const imageDataUrl = `data:image/png;base64,${result.imageB64}`;
              setGeneratedImages([imageDataUrl]);
               const newGalleryImage: GeneratedImage = {
                 id: self.crypto.randomUUID(),
                 b64: imageDataUrl,
                 prompt: prompt,
                 favorite: false,
               };
               setGallery(prev => [newGalleryImage, ...prev]);
            } else {
               setError(result.text || "A edição não produziu uma imagem. Tente uma solicitação diferente.");
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
  }, [prompt, isLoading, mode, aspectRatio, originalImage, numberOfImages, executeGeneration]);

  const handleGenerateMore = useCallback(async () => {
    if (!lastGenerationParams || isLoading) return;
    await executeGeneration(lastGenerationParams);
  }, [lastGenerationParams, isLoading, executeGeneration]);
  
  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione um arquivo de imagem válido.");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setOriginalImage({ data: base64Data, mimeType: file.type });
        setGeneratedImages(null); 
        setError(null);
    };
    reader.onerror = () => {
        setError("Falha ao ler o arquivo de imagem.");
    }
    reader.readAsDataURL(file);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setGallery(prevGallery =>
      prevGallery.map(img =>
        img.id === id ? { ...img, favorite: !img.favorite } : img
      )
    );
  }, []);

  const handleDeleteImage = useCallback((id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.')) {
        setGallery(prevGallery => prevGallery.filter(img => img.id !== id));
    }
  }, []);


  const renderContent = () => {
    if (tab === 'gallery') {
      return (
        <Gallery 
          images={gallery} 
          onToggleFavorite={handleToggleFavorite}
          onDeleteImage={handleDeleteImage}
          onNavigateHome={() => setTab('home')}
        />
      );
    }
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <LeftPanel
          prompt={prompt}
          setPrompt={setPrompt}
          mode={mode}
          setMode={setMode}
          onGenerate={handleSubmit}
          isLoading={isLoading}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          isEditDisabled={mode === AppMode.EDIT && !originalImage}
          numberOfImages={numberOfImages}
          setNumberOfImages={setNumberOfImages}
        />
        <RightPanel
          generatedImages={generatedImages}
          originalImage={originalImage ? `data:${originalImage.mimeType};base64,${originalImage.data}` : null}
          isLoading={isLoading}
          error={error}
          mode={mode}
          onImageUpload={handleImageUpload}
          onClearImage={() => setOriginalImage(null)}
          onGenerateMore={handleGenerateMore}
          canGenerateMore={!!lastGenerationParams && mode === AppMode.CREATE}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
      <Header currentTab={tab} setTab={setTab} />
      <main className="flex-grow container mx-auto mt-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;