import {Box} from '@mui/material';
import {StepperNavigation} from './StepperNavigation';
import {StepperProviderProps} from "../../types/stepper.types";
import {StepperProvider} from "../../context/StepperContext";
import CenteredPageLayout from '../layout/CenteredPageLayout/CenteredPageLayout';

interface StepperProps extends Omit<StepperProviderProps, 'children'> {
    children: React.ReactNode;
    showNavigation?: boolean;
    nextLabel?: string;
    previousLabel?: string;
    confirmLabel?: string;
    customNextButton?: React.ReactNode;
    customPreviousButton?: React.ReactNode;
    customConfirmButton?: React.ReactNode;
}

const Stepper: React.FC<StepperProps> = ({
                                             children,
                                             showNavigation = true,
                                             nextLabel,
                                             previousLabel,
                                             confirmLabel,
                                             customNextButton,
                                             customPreviousButton,
                                             customConfirmButton,
                                             ...providerProps
                                         }) => {
    return (
        <StepperProvider {...providerProps}>
            <CenteredPageLayout>
                <Box sx={{minHeight: "400px"}}>
                    {children}
                </Box>

                {showNavigation && (
                    <StepperNavigation
                        nextLabel={nextLabel}
                        previousLabel={previousLabel}
                        confirmLabel={confirmLabel}
                        customNextButton={customNextButton}
                        customPreviousButton={customPreviousButton}
                        customConfirmButton={customConfirmButton}
                    />
                )}
            </CenteredPageLayout>
        </StepperProvider>
    );
};

export default Stepper;