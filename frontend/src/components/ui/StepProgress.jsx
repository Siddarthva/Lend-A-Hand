import React from 'react';
import { Check } from 'lucide-react';

const StepProgress = ({ steps, currentStep, className = '' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {steps.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/40'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                    }`}
                            >
                                {isCompleted ? <Check size={14} /> : stepNum}
                            </div>
                            <span
                                className={`text-xs mt-1.5 font-medium whitespace-nowrap hidden sm:block ${isActive
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : isCompleted
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1 transition-colors duration-300 ${stepNum < currentStep
                                        ? 'bg-green-400'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepProgress;
