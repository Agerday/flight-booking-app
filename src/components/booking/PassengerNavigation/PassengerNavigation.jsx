import React from 'react';
import {Button, Stack} from '@mui/material';

const PassengerNavigation = ({
                                 activeIndex,
                                 maxIndex,
                                 onNext,
                                 onPrev,
                             }) => {
    if (maxIndex <= 1) return null;

    return (
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            {activeIndex > 0 && (
                <Button variant="outlined" onClick={onPrev}>
                    ⬅️ Previous Passenger
                </Button>
            )}
            {activeIndex < maxIndex - 1 && (
                <Button variant="outlined" onClick={onNext}>
                    Next Passenger ➡️
                </Button>
            )}
        </Stack>
    );
};

export default PassengerNavigation;
