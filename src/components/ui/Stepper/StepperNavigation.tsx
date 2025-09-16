import { useStepper } from "@/hooks/useStepper";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";

interface StepperNavigationProps {
    nextLabel?: string;
    previousLabel?: string;
    confirmLabel?: string;
    customNextButton?: React.ReactNode;
    customPreviousButton?: React.ReactNode;
    customConfirmButton?: React.ReactNode;
    hideNextButton?: boolean;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
                                                                        nextLabel = "Next",
                                                                        previousLabel = "Previous",
                                                                        confirmLabel = "Confirm",
                                                                        customNextButton,
                                                                        customPreviousButton,
                                                                        customConfirmButton,
                                                                        hideNextButton = false,
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

    const onGoHome = () => {
        window.location.href = "/"; // redirect to home page
    };

    const showPrevious = !isFirstStep() && !isLastStep(); // hide previous on last step
    const showNext = !isLastStep() && !hideNextButton;
    const showConfirm = isLastStep();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            <Box>
                {showPrevious &&
                    (customPreviousButton || (
                        <Button
                            variant="outlined"
                            onClick={previousStep}
                            disabled={!canGoPrev}
                            startIcon={<ArrowBack />}
                            size="large"
                        >
                            {previousLabel}
                        </Button>
                    ))}
            </Box>

            <Box>
                {showNext &&
                    (customNextButton || (
                        <Button
                            id="next-step-btn"
                            variant="contained"
                            onClick={nextStep}
                            disabled={!canGoNext}
                            endIcon={
                                isValidating ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <ArrowForward />
                                )
                            }
                            size="large"
                        >
                            {isValidating ? "Validating..." : nextLabel}
                        </Button>
                    ))}

                {showConfirm &&
                    (customConfirmButton || (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ArrowForward />}
                            size="large"
                            onClick={onGoHome}
                        >
                            Go back to Home Page
                        </Button>
                    ))}
            </Box>
        </Box>
    );
};
