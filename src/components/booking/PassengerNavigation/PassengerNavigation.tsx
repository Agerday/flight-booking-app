import React from 'react';
import { Box, Button, IconButton, Typography, Chip, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

interface PassengerNavigationProps {
    activeIndex: number;
    maxIndex: number;
    onNext: () => void;
    onPrev: () => void;
    disabled?: boolean;
    completionStatus?: { [index: number]: boolean };
    onNavigateToIndex?: (index: number) => void;
}

const PassengerNavigation: React.FC<PassengerNavigationProps> = ({
                                                                     activeIndex,
                                                                     maxIndex,
                                                                     onNext,
                                                                     onPrev,
                                                                     disabled = false,
                                                                     completionStatus = {},
                                                                     onNavigateToIndex,
                                                                 }) => {
    const isFirstPassenger = activeIndex === 0;
    const isLastPassenger = activeIndex === maxIndex - 1;

    const completedCount = Object.keys(completionStatus).filter(
        key => completionStatus[parseInt(key)]
    ).length;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            {/* Previous Button */}
            <Button
                variant="outlined"
                onClick={onPrev}
                disabled={disabled || isFirstPassenger}
                startIcon={<ChevronLeft />}
                sx={{ minWidth: 120 }}
            >
                Previous
            </Button>

            {/* Center Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Quick Navigation Dots */}
                {onNavigateToIndex && (
                    <Stack direction="row" spacing={1} alignItems="center">
                        {Array.from({ length: maxIndex }, (_, index) => (
                            <IconButton
                                key={index}
                                size="small"
                                onClick={() => onNavigateToIndex(index)}
                                disabled={disabled}
                                sx={{
                                    p: 0.5,
                                    color: index === activeIndex ? 'primary.main' : 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                {completionStatus[index] ? (
                                    <CheckCircle
                                        sx={{
                                            fontSize: 20,
                                            color: index === activeIndex ? 'primary.main' : 'success.main',
                                        }}
                                    />
                                ) : (
                                    <RadioButtonUnchecked
                                        sx={{
                                            fontSize: 20,
                                            color: index === activeIndex ? 'primary.main' : 'text.disabled',
                                        }}
                                    />
                                )}
                            </IconButton>
                        ))}
                    </Stack>
                )}

                {/* Current Position Text */}
                <Box sx={{ textAlign: 'center', minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                        Passenger
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                        {activeIndex + 1} of {maxIndex}
                    </Typography>
                    <Chip
                        label={`${completedCount}/${maxIndex} Complete`}
                        size="small"
                        color={completedCount === maxIndex ? 'success' : 'default'}
                        sx={{ mt: 0.5 }}
                    />
                </Box>
            </Box>

            {/* Next Button */}
            <Button
                variant="contained"
                onClick={onNext}
                disabled={disabled || isLastPassenger}
                endIcon={<ChevronRight />}
                sx={{ minWidth: 120 }}
                color={completionStatus[activeIndex] ? 'primary' : 'inherit'}
            >
                {isLastPassenger ? 'Last' : 'Next'}
            </Button>
        </Box>
    );
};

export default PassengerNavigation;