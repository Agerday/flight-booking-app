import React, {useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import SeatMap from '../../components/booking/SeatMap/SeatMap';
import {useBookingForm} from '../../context/BookingFormContext';

const SeatSelectionStep = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();
    const handleSeatSelect = (seat) => {
        updateForm('selectedSeatInfo', seat);
    };

    useEffect(() => {
        updateStepValidity(currentStep, !!formData.selectedSeatInfo);
    }, [currentStep, formData.selectedSeatInfo, updateStepValidity]);


    return (
        <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
                ✈️ Select Your Seat
            </Typography>
            <SeatMap
                selectedSeat={formData.selectedSeatInfo}
                onSeatSelect={handleSeatSelect}
            />

            {formData.selectedSeatInfo && (
                <Typography mt={3} variant="h6" color="primary">
                    You selected <strong>{formData.selectedSeatInfo.id}</strong> —{' '}
                    <em>{formData.selectedSeatInfo.class} class</em> — $
                    {formData.selectedSeatInfo.price}
                </Typography>
            )}
        </Box>
    );
};

export default SeatSelectionStep;
