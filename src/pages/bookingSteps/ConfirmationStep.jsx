import React, {useRef} from 'react';
import {Box, Button, Divider, Paper, Stack, Typography,} from '@mui/material';
import {useBookingForm} from '../../context/BookingFormContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {QRCodeSVG as QRCode} from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import {format} from 'date-fns';

const ConfirmationStep = () => {
    const {formData} = useBookingForm();
    const ref = useRef();

    const flight = formData.flight;
    const passengers = formData.passengers;

    const downloadPDF = () => {
        const element = ref.current;

        const options = {
            margin: 0.5,
            filename: 'boarding-pass.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait'},
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <Box
            sx={{
                minHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                px: 2,
                textAlign: 'center',
            }}
        >
            <CheckCircleIcon sx={{fontSize: 60, color: 'success.main', mb: 1}}/>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                Your boarding passes are ready 🎉
            </Typography>

            <Stack spacing={4} width="100%" maxWidth={700} ref={ref}>
                {passengers.map((passenger, index) => {
                    const seat = passenger.seat;
                    const qrData = JSON.stringify({
                        name: `${passenger.firstName} ${passenger.lastName}`,
                        flight: `${flight?.airline} ${flight?.id}`,
                        from: flight?.from,
                        to: flight?.to,
                        seat: `${seat?.row}${seat?.seat}`,
                    });

                    return (
                        <Paper
                            key={index}
                            elevation={6}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                position: 'relative',
                                background: 'linear-gradient(135deg, #f4f6f8, #fff)',
                            }}
                        >
                            <Box position="absolute" top={8} right={8}>
                                <QRCode value={qrData} size={80}/>
                            </Box>

                            <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                                Passenger {index + 1}
                            </Typography>

                            <Typography>
                                <strong>Name:</strong> {passenger.firstName} {passenger.lastName}
                            </Typography>
                            <Typography>
                                <strong>Email:</strong> {passenger.email}
                            </Typography>
                            <Typography>
                                <strong>Flight:</strong> {flight?.airline} #{flight?.id}
                            </Typography>
                            <Typography>
                                <strong>Route:</strong> {flight?.from} → {flight?.to}
                            </Typography>
                            <Typography>
                                <strong>Departure:</strong>{' '}
                                {flight?.departureTime ? format(new Date(flight.departureTime), 'PPpp') : ''}
                            </Typography>
                            <Typography>
                                <strong>Arrival:</strong>{' '}
                                {flight?.arrivalTime ? format(new Date(flight.arrivalTime), 'PPpp') : ''}
                            </Typography>
                            <Typography>
                                <strong>Seat:</strong> {seat?.row}{seat?.seat} — {seat?.class} class
                            </Typography>
                        </Paper>
                    );
                })}
            </Stack>

            <Divider sx={{width: '100%', maxWidth: 500, my: 5}}/>

            <Button onClick={downloadPDF} variant="contained" color="primary">
                📄 Download Boarding Pass (PDF)
            </Button>
        </Box>
    );
};

export default ConfirmationStep;
