import React from 'react';
import {Button, Stack} from '@mui/material';

interface PassengerNavigationProps {
    activeIndex: number;
    maxIndex: number;
    onNext: () => void;
    onPrev: () => void;
    disabled?: boolean;
}

const PassengerNavigation: React.FC<PassengerNavigationProps> = ({
                                                                     activeIndex,
                                                                     maxIndex,
                                                                     onNext,
                                                                     onPrev,
                                                                     disabled = false,
                                                                 }) => {
    if (maxIndex <= 1) return null;

    const canGoPrev = activeIndex > 0;
    const canGoNext = activeIndex < maxIndex - 1;

    return (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{mt: 2}}>
            {canGoPrev && (
                <Button
                    variant="outlined"
                    onClick={onPrev}
                    disabled={disabled}
                >
                    ← Previous Passenger
                </Button>
            )}
            {canGoNext && (
                <Button
                    variant="outlined"
                    onClick={onNext}
                    disabled={disabled}
                >
                    Next Passenger →
                </Button>
            )}
        </Stack>
    );
};

export default PassengerNavigation;