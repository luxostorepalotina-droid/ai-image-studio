
import React from 'react';
import type { Mode, CreateFunction, EditFunction, Resolution } from '../types';
import { FunctionCard } from './FunctionCard';
import { UploadArea } from './UploadArea';

interface LeftPanelProps {
    prompt: string;
    setPrompt: (value: string) => void;
    mode: Mode;
    onModeChange: (mode: Mode) => void;
    activeCreateFunction: CreateFunction;
    onActiveCreateFunctionChange: (func: CreateFunction) => void;
    activeEditFunction: EditFunction;
    onActiveEditFunctionChange: (func: EditFunction) => void;
    onImageUpload: (file: File, index: 1 | 2) => void;
    image1Preview: string | null;
    image2Preview: string | null;
    onGenerate: () => void;
    isLoading: boolean;
    resolution: Resolution;
    onResolutionChange: (resolution: Resolution) => void;
}

const createFunctions: { key: CreateFunction; icon: string; name: string }[] = [
    { key: 'free', icon: '✨', name: 'Prompt' },
    { key: 'sticker', icon: '🏷️', name: 'Adesivos' },
    { key: 'text', icon: '📝', name: 'Logo' },
    { key: 'comic', icon: '💭', name: 'HQ' },
];

const editFunctions: { key: EditFunction; icon: string; name: string; requiresTwo?: boolean }[] = [
    { key: 'add-remove', icon: '➕', name: 'Adicionar' },
    { key: 'retouch', icon: '🎯', name: 'Retoque' },
    { key: 'style', icon: '🎨', name: 'Estilo' },
    { key: 'compose', icon: '🖼️', name: 'Unir', requiresTwo: true },
];

const resolutionOptions: { key: Resolution; name: string }[] = [
    { key: 'standard', name: 'Padrão' },
    { key: 'high', name: 'Alta (2x)' },
    { key: 'ultra', name: 'Ultra (4x)' },
];

export const LeftPanel: React.FC<LeftPanelProps> = ({
    prompt,
    setPrompt,
    mode,
    onModeChange,
    activeCreateFunction,
    onActiveCreateFunctionChange,
    activeEditFunction,
    onActiveEditFunctionChange,
    onImageUpload,
    image1Preview,
    image2Preview,
    onGenerate,
    isLoading,
    resolution,
    onResolutionChange,
}) => {
    const isTwoImageMode = mode === 'edit' && activeEditFunction === 'compose';

    return (
        <div className="left-panel md:w-1/3 bg-brand-primary p-6 rounded-lg flex flex-col gap-6 h-full">
            <header>
                <h1 className="panel-title text-3xl font-bold">🎨 AI Image Studio</h1>
                <p className="panel-subtitle text-brand-subtle">Gerador profissional de imagens</p>
            </header>

            <div className="prompt-section">
                <div className="section-title text-lg font-semibold mb-2">💭 Descreva sua ideia</div>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="prompt-input w-full h-24 p-3 bg-brand-secondary rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none resize-none"
                    placeholder="Descreva a imagem que você deseja criar..."
                />
            </div>

            <div className="mode-toggle flex gap-2">
                <button onClick={() => onModeChange('create')} className={`mode-btn flex-1 py-2 rounded-md transition-colors ${mode === 'create' ? 'bg-brand-accent text-white' : 'bg-brand-secondary hover:bg-gray-700'}`}>
                    Criar
                </button>
                <button onClick={() => onModeChange('edit')} className={`mode-btn flex-1 py-2 rounded-md transition-colors ${mode === 'edit' ? 'bg-brand-accent text-white' : 'bg-brand-secondary hover:bg-gray-700'}`}>
                    Editar
                </button>
            </div>

            {mode === 'create' && (
                <>
                    <div id="createFunctions" className="functions-section">
                        <div className="section-title text-lg font-semibold mb-2">✨ Estilo Criativo</div>
                        <div className="functions-grid grid grid-cols-2 gap-3">
                            {createFunctions.map((func) => (
                                <FunctionCard
                                    key={func.key}
                                    icon={func.icon}
                                    name={func.name}
                                    isActive={activeCreateFunction === func.key}
                                    onClick={() => onActiveCreateFunctionChange(func.key)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="resolution-section">
                        <div className="section-title text-lg font-semibold mb-2">🖼️ Resolução</div>
                        <div className="flex gap-2">
                            {resolutionOptions.map((res) => (
                                <button
                                    key={res.key}
                                    onClick={() => onResolutionChange(res.key)}
                                    className={`mode-btn flex-1 py-2 rounded-md transition-colors text-sm ${resolution === res.key ? 'bg-brand-accent text-white' : 'bg-brand-secondary hover:bg-gray-700'}`}
                                >
                                    {res.name}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-brand-subtle mt-2">Resoluções mais altas podem levar mais tempo e consumir mais recursos.</p>
                    </div>
                </>
            )}
            
            {mode === 'edit' && (
                 <div id="editFunctions" className="functions-section">
                    <div className="section-title text-lg font-semibold mb-2">🔧 Ferramentas de Edição</div>
                    <div className="functions-grid grid grid-cols-2 gap-3">
                         {editFunctions.map((func) => (
                            <FunctionCard
                                key={func.key}
                                icon={func.icon}
                                name={func.name}
                                isActive={activeEditFunction === func.key}
                                onClick={() => onActiveEditFunctionChange(func.key)}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            <div className="dynamic-content flex-grow">
                {mode === 'edit' && isTwoImageMode && (
                     <div id="twoImagesSection" className="functions-section flex flex-col gap-4">
                        <div className="text-lg font-semibold">📸 Duas Imagens Necessárias</div>
                        <div className="flex gap-4">
                            <UploadArea id="1" onImageUpload={onImageUpload} imagePreview={image1Preview} label="Primeira Imagem" dual={true}/>
                            <UploadArea id="2" onImageUpload={onImageUpload} imagePreview={image2Preview} label="Segunda Imagem" dual={true}/>
                        </div>
                    </div>
                )}
                {mode === 'edit' && !isTwoImageMode && (
                    <UploadArea id="1" onImageUpload={onImageUpload} imagePreview={image1Preview} />
                )}
            </div>


            <button
                id="generateBtn"
                onClick={onGenerate}
                disabled={isLoading}
                className="generate-btn w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="spinner w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                    <span className="btn-text">🚀 Gerar Imagem</span>
                )}
            </button>
        </div>
    );
};
