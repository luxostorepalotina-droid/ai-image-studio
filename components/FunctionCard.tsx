
import React from 'react';

interface FunctionCardProps {
    icon: string;
    name: string;
    isActive: boolean;
    onClick: () => void;
}

export const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`function-card flex flex-col items-center justify-center gap-2 p-4 rounded-lg cursor-pointer transition-all duration-200
                ${isActive ? 'bg-brand-accent text-white ring-2 ring-brand-accent-hover' : 'bg-brand-secondary hover:bg-gray-700'}`}
        >
            <div className="text-2xl">{icon}</div>
            <div>{name}</div>
        </div>
    );
};
