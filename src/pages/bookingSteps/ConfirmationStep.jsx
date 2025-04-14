import React, {useRef} from 'react';
import {Box, Button, Divider, Typography,} from '@mui/material';
import {useBookingForm} from '../../context/BookingFormContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {QRCodeSVG as QRCode} from 'qrcode.react';
import html2canvas from 'html2canvas';
import {format} from "date-fns";

const ConfirmationStep = () => {
    const {formData} = useBookingForm();
    const ref = useRef();

    const {passenger, flight, seat} = formData;

    const downloadBoardingPass = async () => {
        const element = ref.current;
        const canvas = await html2canvas(element);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'boarding-pass.png';
        link.href = dataUrl;
        link.click();
    };

    const qrData = JSON.stringify({
        name: `${passenger.firstName} ${passenger.lastName}`,
        flight: `${flight?.airline} ${flight?.id}`,
        from: flight?.from,
        to: flight?.to,
        seat: `${seat.row}${seat.seat}`,
    });

    return (
        <Box
            ref={ref}
            sx={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 4,
                textAlign: 'center',
            }}
        >
            <CheckCircleIcon sx={{fontSize: 50, color: 'green', mb: 1}}/>
            <Typography variant="h4" gutterBottom>
                Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
                Your boarding pass is ready 🎉
            </Typography>

            <Divider sx={{width: '100%', maxWidth: 500, my: 2}}/>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    justifyContent: 'space-between',
                    alignItems: {xs: 'center', sm: 'flex-start'},
                    width: '100%',
                    maxWidth: 600,
                    gap: 3,
                    mb: 2,
                }}
            >
                <Box textAlign="left">
                    <Typography><strong>Passenger:</strong> {passenger.firstName} {passenger.lastName}</Typography>
                    <Typography><strong>Email:</strong> {passenger.email}</Typography>
                    <Typography><strong>Flight:</strong> {flight?.airline} #{flight?.id}</Typography>
                    <Typography><strong>From:</strong> {flight?.from}</Typography>
                    <Typography><strong>To:</strong> {flight?.to}</Typography>
                    <Typography>
                        <strong>Departure:</strong>{' '}
                        {flight?.departureTime ? format(new Date(flight.departureTime), 'PPpp') : ''}
                    </Typography>
                    <Typography>
                        <strong>Arrival:</strong>{' '}
                        {flight?.arrivalTime ? format(new Date(flight.arrivalTime), 'PPpp') : ''}
                    </Typography>
                    <Typography><strong>Seat:</strong> {seat.row} {seat.seat}</Typography>
                </Box>

                <Box display="flex" justifyContent="center" alignItems="center">
                    <QRCode value={qrData} size={100}/>
                </Box>
            </Box>

            <Divider sx={{width: '100%', maxWidth: 500, my: 2}}/>

            <Button variant="contained" color="primary" onClick={downloadBoardingPass}>
                Download Boarding Pass
            </Button>
        </Box>
    );
};

export default ConfirmationStep;
