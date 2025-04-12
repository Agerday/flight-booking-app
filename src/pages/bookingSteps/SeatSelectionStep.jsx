import React, {useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import SeatMap from '../../components/booking/SeatMap/SeatMap';
import {useBookingForm} from '../../context/BookingFormContext';

const SeatSelectionStep = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();
    const handleSeatSelect = (seat) => {
        updateForm('seat', seat);
    };

    useEffect(() => {
        updateStepValidity(currentStep, !!formData.seat);
    }, [currentStep, formData.seat, updateStepValidity]);


    return (
        <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
                ✈️ Select Your Seat
            </Typography>
            <SeatMap
                selectedSeat={formData.seat}
                onSeatSelect={handleSeatSelect}
            />

            {formData.seat && (
                <Typography mt={3} variant="h6" color="primary">
                    You selected <strong>{formData.seat.id}</strong> —{' '}
                    <em>{formData.seat.class} class</em> — $
                    {formData.seat.price}
                </Typography>
            )}
        </Box>
    );
};

export default SeatSelectionStep;
