
import React from 'react';

interface RightPanelProps {
    isLoading: boolean;
    generatedImageUrl: string | null;
    error: string | null;
    onEditCurrentImage: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isLoading, generatedImageUrl, error, onEditCurrentImage }) => {

    const downloadImage = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = `ai-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div id="loadingContainer" className="loading-container flex flex-col items-center justify-center text-center h-full">
                    <div className="loading-spinner w-16 h-16 border-8 border-t-transparent border-brand-accent rounded-full animate-spin"></div>
                    <div className="loading-text text-xl mt-4">Gerando sua imagem...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-full text-center text-red-400 p-4">
                    <div className="bg-red-900/50 p-6 rounded-lg">
                        <p className="text-2xl mb-2">😕</p>
                        <p className="font-semibold">Ocorreu um Erro</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            );
        }

        if (generatedImageUrl) {
            return (
                <div id="imageContainer" className="image-container relative w-full h-full group">
                    <img id="generatedImage" src={generatedImageUrl} alt="Generated Art" className="generated-image w-full h-full object-contain rounded-lg" />
                    <div className="image-actions absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onEditCurrentImage} title="Editar" className="action-btn bg-black/50 hover:bg-black/80 text-white p-3 rounded-full text-xl transition-colors">
                            ✏️
                        </button>
                        <button onClick={downloadImage} title="Download" className="action-btn bg-black/50 hover:bg-black/80 text-white p-3 rounded-full text-xl transition-colors">
                            💾
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div id="resultPlaceholder" className="result-placeholder flex flex-col items-center justify-center text-center h-full text-brand-subtle">
                <div className="result-placeholder-icon text-8xl mb-4">🎨</div>
                <div className="text-2xl">Sua obra de arte aparecerá aqui</div>
            </div>
        );
    };

    return (
        <div className="right-panel hidden md:flex md:w-2/3 bg-brand-primary p-6 rounded-lg items-center justify-center">
            {renderContent()}
        </div>
    );
};
