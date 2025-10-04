
import React from 'react';

interface MobileModalProps {
    imageUrl: string | null;
    onClose: () => void;
    onEdit: () => void;
    onNewImage: () => void;
}

export const MobileModal: React.FC<MobileModalProps> = ({ imageUrl, onClose, onEdit, onNewImage }) => {
    
    const downloadImage = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black/80 z-50 flex flex-col p-4" onClick={onClose}>
            <div className="modal-content flex-grow flex flex-col bg-brand-secondary rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex-grow p-4 flex items-center justify-center">
                    {imageUrl && <img id="modalImage" src={imageUrl} alt="Generated Art" className="modal-image max-w-full max-h-full object-contain rounded-md" />}
                </div>
                <div id="modal-actions" className="modal-actions grid grid-cols-3 gap-2 p-2 bg-brand-primary">
                     <button onClick={onEdit} className="modal-btn edit bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors">✏️ Editar</button>
                    <button onClick={downloadImage} className="modal-btn download bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition-colors">💾 Salvar</button>
                    <button onClick={onNewImage} className="modal-btn new bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold py-3 rounded-md transition-colors">✨ Nova Imagem</button>
                </div>
            </div>
        </div>
    );
};
