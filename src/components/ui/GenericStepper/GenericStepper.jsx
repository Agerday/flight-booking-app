import React from 'react';
import {Box, Button, IconButton} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CenteredPageLayout from "../../layout/CenteredPageLayout/CenteredPageLayout";

const GenericStepper = ({
                            currentStep,
                            onNext,
                            onBack,
                            renderMap,
                            disableNext = false,
                            customLabels = {},
                            hideNextButton = {},
                            background = undefined,
                            useCardWrapper = true,
                            firstStepKey = null,
                        }) => {
    const isFirstStep = currentStep === firstStepKey;
    const label = customLabels[currentStep] || 'Next';
    const shouldHideButton = typeof hideNextButton === 'boolean'
        ? hideNextButton
        : !!hideNextButton[currentStep];

    return (
        <CenteredPageLayout background={background} useCard={useCardWrapper}>
            {/* Back Button */}
            {!isFirstStep && typeof onBack === 'function' && (
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBackIosNewIcon />
                </IconButton>
            )}

            {/* Step Content */}
            <Box sx={{ mb: shouldHideButton ? 0 : 4 }}>
                {renderMap[currentStep]}
            </Box>

            {/* Next Button */}
            {!shouldHideButton && (
                <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={disableNext}
                    size="large"
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        minHeight: 56,
                    }}
                >
                    {label}
                </Button>
            )}
        </CenteredPageLayout>
    );
};

export default GenericStepper;
