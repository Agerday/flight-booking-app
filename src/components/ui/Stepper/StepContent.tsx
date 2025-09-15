import {useStepper} from "../../../hooks/useStepper";

interface StepContentProps {
    stepId: string;
    children: React.ReactNode;
}

export const StepContent: React.FC<StepContentProps> = ({stepId, children}) => {
    const {currentStepId} = useStepper();

    if (currentStepId !== stepId) {
        return null;
    }

    return <>{children}</>;
};

export default StepContent;