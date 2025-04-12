import React from 'react';
import {Button, Card, Divider, Stack, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useBookingForm} from '../../context/BookingFormContext';

const ConfirmationStep = () => {
    const {formData} = useBookingForm();

    return (
        <>
            <CheckCircleIcon sx={{fontSize: 60, color: 'success.main', mb: 2}}/>

            <Typography variant="h4" fontWeight={600} gutterBottom color="success.main">
                Booking Confirmed!
            </Typography>

            <Typography variant="subtitle1" sx={{mb: 3}}>
                Thank you for your reservation. Below are your booking details:
            </Typography>

            <Divider sx={{my: 2}}/>

            <Stack spacing={1} textAlign="left" sx={{mb: 3}}>
                <Typography variant="body1"><strong>👤
                    Passenger:</strong> {formData.passenger.firstName} {formData.passenger.lastName}</Typography>
                <Typography variant="body1"><strong>📧 Email:</strong> {formData.passenger.email}</Typography>
                <Typography variant="body1"><strong>✈️ Airline:</strong> {formData.flight?.airline}</Typography>
                <Typography variant="body1"><strong>🛫
                    Departure:</strong> {new Date(formData.flight?.departureTime).toLocaleString()}</Typography>
                <Typography variant="body1"><strong>🛬
                    Arrival:</strong> {new Date(formData.flight?.arrivalTime).toLocaleString()}</Typography>
                <Typography variant="body1"><strong>💺 Seat:</strong> {formData.seat.row} {formData.seat.seat}
                </Typography>
                <Typography variant="body1"><strong>🎟️ Class:</strong> {formData.flight?.selectedClass?.toUpperCase()}
                </Typography>
            </Stack>

            <Divider sx={{my: 2}}/>

            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                A confirmation email has been sent to <strong>{formData.passenger.email}</strong>.
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => window.print()}
            >
                Print Confirmation
            </Button>
        </>
    );
};

export default ConfirmationStep;
