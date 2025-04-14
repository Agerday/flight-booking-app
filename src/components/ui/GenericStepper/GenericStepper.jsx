import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CenteredPageLayout from '../../layout/CenteredPageLayout/CenteredPageLayout';

const shouldHideButton = (config, currentStep) => {
    if (typeof config === 'boolean') return config;
    return !!config[currentStep];
};

const GenericStepper = ({
                            currentStep,
                            onNext,
                            onBack,
                            renderMap,
                            disableNext = false,
                            customLabels = {},
                            hideNextButton = {},
                            hidePreviousButton = {},
                            background = undefined,
                            useCardWrapper = true,
                        }) => {
    const label = customLabels[currentStep] || 'Next';
    const nextHidden = shouldHideButton(hideNextButton, currentStep);
    const prevHidden = shouldHideButton(hidePreviousButton, currentStep);

    return (
        <CenteredPageLayout background={background} useCard={useCardWrapper}>
            {/* Back Button */}
            {!prevHidden && typeof onBack === 'function' && (
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBackIosNewIcon />
                </IconButton>
            )}

            {/* Step Content */}
            <Box sx={{ mb: nextHidden ? 0 : 4 }}>
                {renderMap[currentStep]}
            </Box>

            {/* Next Button */}
            {!nextHidden && (
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
