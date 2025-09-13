import {Box, Button, CircularProgress} from '@mui/material';
import {ArrowBack, ArrowForward, CheckCircle} from '@mui/icons-material';
import {useStepper} from "../../hooks/useStepper";

interface StepperNavigationProps {
    nextLabel?: string;
    previousLabel?: string;
    confirmLabel?: string;
    customNextButton?: React.ReactNode;
    customPreviousButton?: React.ReactNode;
    customConfirmButton?: React.ReactNode;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
                                                                        nextLabel = 'Next',
                                                                        previousLabel = 'Previous',
                                                                        confirmLabel = 'Confirm',
                                                                        customNextButton,
                                                                        customPreviousButton,
                                                                        customConfirmButton,
                                                                    }) => {
    const {
        canGoNext,
        canGoPrev,
        isValidating,
        nextStep,
        previousStep,
        isFirstStep,
        isLastStep,
    } = useStepper();

    const showPrevious = !isFirstStep();
    const showNext = !isLastStep();
    const showConfirm = isLastStep();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
            }}
        >
            <Box>
                {showPrevious && (
                    customPreviousButton || (
                        <Button
                            variant="outlined"
                            onClick={previousStep}
                            disabled={!canGoPrev}
                            startIcon={<ArrowBack/>}
                            size="large"
                        >
                            {previousLabel}
                        </Button>
                    )
                )}
            </Box>

            <Box>
                {showNext && (
                    customNextButton || (
                        <Button
                            id="next-step-btn"
                            variant="contained"
                            onClick={nextStep}
                            disabled={!canGoNext}
                            endIcon={
                                isValidating ? (
                                    <CircularProgress size={20} color="inherit"/>
                                ) : (
                                    <ArrowForward/>
                                )
                            }
                            size="large"
                        >
                            {isValidating ? 'Validating...' : nextLabel}
                        </Button>
                    )
                )}

                {showConfirm && (
                    customConfirmButton || (
                        <Button
                            variant="contained"
                            color="success"
                            disabled={!canGoNext}
                            startIcon={<CheckCircle/>}
                            size="large"
                        >
                            {confirmLabel}
                        </Button>
                    )
                )}
            </Box>
        </Box>
    );
};

export default StepperNavigation;