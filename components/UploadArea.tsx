
import React, { useCallback, useRef } from 'react';

interface UploadAreaProps {
    id: string;
    onImageUpload: (file: File, index: 1 | 2) => void;
    imagePreview: string | null;
    label?: string;
    dual?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ id, onImageUpload, imagePreview, label, dual = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(event.target.files[0], id === '1' ? 1 : 2);
        }
    };

    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onImageUpload(event.dataTransfer.files[0], id === '1' ? 1 : 2);
        }
    }, [id, onImageUpload]);
    

    if (imagePreview) {
        return (
            <div className={`relative ${dual ? 'w-1/2' : 'w-full'} h-48 group`}>
                <img src={imagePreview} alt="Preview" className="image-preview w-full h-full object-cover rounded-lg" />
                 <button 
                    onClick={handleAreaClick}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                 >
                    Trocar Imagem
                 </button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        );
    }

    return (
        <div
            onClick={handleAreaClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`upload-area ${dual ? 'w-1/2' : 'w-full'} h-48 flex flex-col items-center justify-center p-4 bg-brand-secondary border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:border-brand-accent transition-colors`}
        >
            <input
                type="file"
                ref={fileInputRef}
                id={`imageUpload${id}`}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="text-4xl">📁</div>
            <div className="mt-2 text-center">{label || 'Clique ou arraste uma imagem'}</div>
            <div className="upload-text text-xs text-brand-subtle mt-1 text-center">{dual ? 'Clique para selecionar' : 'PNG, JPG, WebP (máx. 10MB)'}</div>
        </div>
    );
};
