import React, { createContext, useCallback, useContext, useReducer } from 'react';
import { StepperContextType, StepperProviderProps, StepperState } from '@/types/stepper.types';

type StepperAction =
    | { type: 'GO_TO_STEP'; payload: string }
    | { type: 'SET_CAN_GO_NEXT'; payload: boolean }
    | { type: 'SET_VALIDATING'; payload: boolean }
    | { type: 'RESET_STEP'; payload: string };

const stepperReducer = (state: StepperState, action: StepperAction): StepperState => {
    switch (action.type) {
        case 'GO_TO_STEP':
            const stepExists = state.steps.some(step => step.id === action.payload);
            if (!stepExists) return state;

            return {
                ...state,
                currentStepId: action.payload,
            };

        case 'SET_CAN_GO_NEXT':
            return {
                ...state,
                canGoNext: action.payload,
            };

        case 'SET_VALIDATING':
            return {
                ...state,
                isValidating: action.payload,
            };

        case 'RESET_STEP':
            return {
                ...state,
                steps: state.steps.map(step =>
                    step.id === action.payload
                        ? { ...step, data: undefined }
                        : step
                ),
            };

        default:
            return state;
    }
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider: React.FC<StepperProviderProps> = ({
                                                                    steps,
                                                                    initialStep,
                                                                    onStepChange,
                                                                    children,
                                                                }) => {
    const initialStepId = initialStep || steps[0]?.id;

    const initialState: StepperState = {
        steps,
        currentStepId: initialStepId,
        canGoNext: false,
        canGoPrev: false,
        isValidating: false,
    };

    const [state, dispatch] = useReducer(stepperReducer, initialState);

    const getCurrentStepIndex = useCallback(() => {
        return state.steps.findIndex(step => step.id === state.currentStepId);
    }, [state.steps, state.currentStepId]);

    const getStepIndex = useCallback((stepId: string) => {
        return state.steps.findIndex(step => step.id === stepId);
    }, [state.steps]);

    const isFirstStep = useCallback(() => {
        return getCurrentStepIndex() === 0;
    }, [getCurrentStepIndex]);

    const isLastStep = useCallback(() => {
        return getCurrentStepIndex() === state.steps.length - 1;
    }, [getCurrentStepIndex, state.steps.length]);

    const currentIndex = getCurrentStepIndex();
    const canGoPrev = currentIndex > 0 && !state.isValidating;
    const canGoNext = state.canGoNext && !state.isValidating && currentIndex < state.steps.length - 1;

    const goToStep = useCallback((stepId: string) => {
        const previousStep = state.currentStepId;
        dispatch({ type: 'GO_TO_STEP', payload: stepId });
        onStepChange?.(stepId, previousStep);
    }, [state.currentStepId, onStepChange]);

    const nextStep = useCallback(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < state.steps.length && canGoNext) {
            goToStep(state.steps[nextIndex].id);
        }
    }, [currentIndex, state.steps, canGoNext, goToStep]);

    const getCurrentStep = useCallback(() => {
        return state.steps.find(step => step.id === state.currentStepId) || null;
    }, [state.steps, state.currentStepId]);

    const previousStep = useCallback(() => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0 && canGoPrev) {
            if (prevIndex === 0) {
                dispatch({ type: 'RESET_STEP', payload: state.currentStepId });
            }
            goToStep(state.steps[prevIndex].id);
        }
    }, [currentIndex, state.steps, canGoPrev, goToStep, state.currentStepId]);

    const setCanGoNext = useCallback((canGo: boolean) => {
        dispatch({ type: 'SET_CAN_GO_NEXT', payload: canGo });
    }, []);

    const setValidating = useCallback((validating: boolean) => {
        dispatch({ type: 'SET_VALIDATING', payload: validating });
    }, []);

    const contextValue: StepperContextType = {
        ...state,
        canGoNext,
        canGoPrev,
        goToStep,
        nextStep,
        getCurrentStep,
        previousStep,
        setCanGoNext,
        setValidating,
        getCurrentStepIndex,
        getStepIndex,
        isFirstStep,
        isLastStep,
    };

    return (
        <StepperContext.Provider value={contextValue}>
            {children}
        </StepperContext.Provider>
    );
};

export const useStepper = (): StepperContextType => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error('useStepper must be used within a StepperProvider');
    }
    return context;
};