
import React, { useState, useCallback } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { MobileModal } from './components/MobileModal';
import { generateImageFromText, editImageWithAI } from './services/geminiService';
import type { Mode, CreateFunction, EditFunction, Resolution } from './types';
import { fileToBase64 } from './utils/file';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState<Mode>('create');
    const [activeCreateFunction, setActiveCreateFunction] = useState<CreateFunction>('free');
    const [activeEditFunction, setActiveEditFunction] = useState<EditFunction>('add-remove');
    const [resolution, setResolution] = useState<Resolution>('standard');
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image1Preview, setImage1Preview] = useState<string | null>(null);
    const [image2Preview, setImage2Preview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const resetImages = () => {
        setImage1(null);
        setImage2(null);
        setImage1Preview(null);
        setImage2Preview(null);
    };

    const handleImageUpload = (file: File, imageIndex: 1 | 2) => {
        if (imageIndex === 1) {
            setImage1(file);
            setImage1Preview(URL.createObjectURL(file));
        } else {
            setImage2(file);
            setImage2Preview(URL.createObjectURL(file));
        }
    };
    
    const handleModeChange = useCallback((newMode: Mode) => {
        setMode(newMode);
        resetImages();
        setGeneratedImageUrl(null);
        setError(null);
    }, []);

    const handleCreateFunctionChange = useCallback((func: CreateFunction) => {
        setActiveCreateFunction(func);
    }, []);

    const handleEditFunctionChange = useCallback((func: EditFunction) => {
        setActiveEditFunction(func);
        resetImages();
    }, []);

    const generateImage = useCallback(async () => {
        if (isLoading) return;
        if (!prompt && mode === 'create') {
            setError('Por favor, descreva sua ideia.');
            return;
        }
        if (mode === 'edit' && !image1) {
            setError('Por favor, envie uma imagem para editar.');
            return;
        }
        if (mode === 'edit' && activeEditFunction === 'compose' && !image2) {
            setError('A função "Unir" requer duas imagens.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            let resultUrl: string;
            if (mode === 'create') {
                let fullPrompt = `${prompt} (${activeCreateFunction} style)`;
                if (resolution === 'high') {
                    fullPrompt += ', em alta resolução';
                } else if (resolution === 'ultra') {
                    fullPrompt += ', em altíssima resolução, 4k';
                }
                resultUrl = await generateImageFromText(fullPrompt);
            } else {
                if (!image1) throw new Error("Imagem principal não encontrada para edição.");
                
                const image1Base64 = await fileToBase64(image1);
                const image2Base64 = image2 ? await fileToBase64(image2) : undefined;
                
                resultUrl = await editImageWithAI(prompt, activeEditFunction, image1Base64, image1.type, image2Base64, image2?.type);
            }
            setGeneratedImageUrl(resultUrl);
            if (window.innerWidth < 768) {
                setIsModalOpen(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, prompt, mode, activeCreateFunction, activeEditFunction, image1, image2, resolution]);
    
    const editCurrentImage = useCallback(async () => {
        if (!generatedImageUrl) return;

        try {
            const response = await fetch(generatedImageUrl);
            const blob = await response.blob();
            const file = new File([blob], "edited-image.png", { type: blob.type });

            setMode('edit');
            setActiveEditFunction('add-remove');
            handleImageUpload(file, 1);
            setGeneratedImageUrl(null);
            if (isModalOpen) setIsModalOpen(false);
        } catch (e) {
            setError("Falha ao carregar imagem para edição.");
        }
    }, [generatedImageUrl, isModalOpen]);

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 h-full">
                <LeftPanel
                    prompt={prompt}
                    setPrompt={setPrompt}
                    mode={mode}
                    onModeChange={handleModeChange}
                    activeCreateFunction={activeCreateFunction}
                    onActiveCreateFunctionChange={handleCreateFunctionChange}
                    activeEditFunction={activeEditFunction}
                    onActiveEditFunctionChange={handleEditFunctionChange}
                    resolution={resolution}
                    onResolutionChange={setResolution}
                    onImageUpload={handleImageUpload}
                    image1Preview={image1Preview}
                    image2Preview={image2Preview}
                    onGenerate={generateImage}
                    isLoading={isLoading}
                />
                <RightPanel
                    isLoading={isLoading}
                    generatedImageUrl={generatedImageUrl}
                    error={error}
                    onEditCurrentImage={editCurrentImage}
                />
                {isModalOpen && (
                    <MobileModal
                        imageUrl={generatedImageUrl}
                        onClose={() => setIsModalOpen(false)}
                        onEdit={editCurrentImage}
                        onNewImage={() => {
                            setIsModalOpen(false);
                            setGeneratedImageUrl(null);
                            setPrompt('');
                            resetImages();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
