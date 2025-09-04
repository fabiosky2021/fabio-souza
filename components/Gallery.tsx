import React, { useState, useMemo } from 'react';
import { GeneratedImage } from '../types';

interface GalleryProps {
    images: GeneratedImage[];
    onToggleFavorite: (id: string) => void;
    onDeleteImage: (id: string) => void;
    onNavigateHome: () => void;
}

const EmptyGallery: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => (
    <div className="text-center py-16 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-brand-gray mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <h3 className="font-orbitron text-2xl text-brand-accent">Sua galeria está vazia</h3>
        <p className="text-brand-gray mt-2 mb-6">Gere algumas imagens para vê-las aparecerem aqui!</p>
        <button onClick={onNavigateHome} className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary-hover shadow-glow-primary">
            Criar Primeira Imagem
        </button>
    </div>
);

const ImageModal: React.FC<{
    image: GeneratedImage;
    onClose: () => void;
    onToggleFavorite: (id: string) => void;
    onDeleteImage: (id: string) => void;
}> = ({ image, onClose, onToggleFavorite, onDeleteImage }) => {

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = image.b64;
        a.download = `nanobanana-ai-${image.prompt.substring(0, 20).replace(/\s/g, '_')}-${image.id.substring(0, 4)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleShare = () => {
        alert("Recurso de compartilhamento em breve!");
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex-grow flex items-center justify-center overflow-hidden rounded-lg bg-brand-darker">
                   <img src={image.b64} alt={image.prompt} className="max-w-full max-h-[75vh] object-contain"/>
                </div>
                <div className="flex-shrink-0 md:w-1/3 flex flex-col">
                    <h3 className="font-orbitron text-xl text-brand-accent mb-2">Prompt</h3>
                    <div className="bg-brand-darker p-3 rounded-lg text-brand-gray text-sm mb-4 h-48 overflow-y-auto">
                        <p>{image.prompt}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                         <button onClick={handleDownload} className="bg-brand-darker hover:bg-brand-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download</button>
                         <button onClick={handleShare} className="bg-brand-darker hover:bg-brand-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.862 13.045 9 12.733 9 12c0-.733-.138-1.045-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>Compart.</button>
                         <button onClick={() => onToggleFavorite(image.id)} className={`font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${image.favorite ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-brand-darker hover:bg-brand-dark text-white'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={image.favorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>Favorito</button>
                         <button onClick={() => { onDeleteImage(image.id); onClose(); }} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>Excluir</button>
                    </div>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-brand-gray hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
        </div>
    );
};

export const Gallery: React.FC<GalleryProps> = ({ images, onToggleFavorite, onDeleteImage, onNavigateHome }) => {
    const [filter, setFilter] = useState<'all' | 'favorites'>('all');
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

    const filteredImages = useMemo(() => {
        if (filter === 'favorites') {
            return images.filter(img => img.favorite);
        }
        return images;
    }, [images, filter]);

    const FilterButton: React.FC<{label: string, value: 'all' | 'favorites'}> = ({label, value}) => (
        <button onClick={() => setFilter(value)} className={`font-semibold py-2 px-4 rounded-lg text-sm transition-colors ${filter === value ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white' : 'bg-brand-darker hover:bg-brand-dark text-brand-gray'}`}>
            {label}
        </button>
    );

    if (images.length === 0) {
        return <EmptyGallery onNavigateHome={onNavigateHome} />;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="font-orbitron text-3xl text-brand-accent">Sua Galeria</h1>
                <div className="flex gap-2 bg-brand-darker p-1 rounded-lg">
                   <FilterButton label="Todas" value="all" />
                   <FilterButton label="Favoritas" value="favorites" />
                </div>
            </div>
            {filteredImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map(image => (
                        <div key={image.id} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer" onClick={() => setSelectedImage(image)}>
                            <img src={image.b64} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                               <p className="text-white text-xs line-clamp-2 mb-2">{image.prompt}</p>
                               <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(image.id);}} className={`ml-auto text-xl transition-colors ${image.favorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-white/70 hover:text-white'}`}>
                                   {image.favorite ? '★' : '☆'}
                               </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <h2 className="font-orbitron text-2xl text-brand-accent">Nenhuma favorita encontrada</h2>
                    <p className="text-brand-gray mt-2">Clique na estrela para adicionar imagens às suas favoritas.</p>
                </div>
            )}
             {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} onToggleFavorite={onToggleFavorite} onDeleteImage={onDeleteImage} />}
        </div>
    );
};