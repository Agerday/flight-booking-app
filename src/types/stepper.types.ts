export interface Step {
    id: string;
    label: string;
    description?: string;
    optional?: boolean;
}

export interface StepperState {
    steps: Step[];
    currentStepId: string;
    canGoNext: boolean;
    canGoPrev: boolean;
    isValidating: boolean;
}

export interface StepperContextType extends StepperState {
    goToStep: (stepId: string) => void;
    nextStep: () => void;
    getCurrentStep: () => void;
    previousStep: () => void;
    setCanGoNext: (canGo: boolean) => void;
    setValidating: (validating: boolean) => void;
    getCurrentStepIndex: () => number;
    getStepIndex: (stepId: string) => number;
    isFirstStep: () => boolean;
    isLastStep: () => boolean;
}

export interface StepperProviderProps {
    steps: Step[];
    initialStep?: string;
    onStepChange?: (currentStep: string, previousStep: string) => void;
    onComplete?: () => void;
    children: React.ReactNode;
}