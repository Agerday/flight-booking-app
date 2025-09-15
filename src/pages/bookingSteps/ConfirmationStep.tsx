import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, Divider, Grid, Paper, Stack, Typography,} from '@mui/material';
import {
    AccessTime,
    AirlineSeatReclineNormal,
    CalendarToday,
    CheckCircle,
    Download,
    Email,
    Flight,
    Person,
} from '@mui/icons-material';
import {QRCodeSVG as QRCode} from 'qrcode.react';
import {format} from 'date-fns';

import {useAppSelector} from '@/redux/hooks';
import {useStepper} from '../../hooks/useStepper';
import {Flight as FlightType, Passenger, TripType} from '@/types/booking.types';
import FrostedCard from '../../components/layout/FrostedCard/FrostedCard';

interface BoardingPassData {
    name: string;
    flight: string;
    from: string;
    to: string;
    seat: string;
    departureTime: string;
    gate: string;
    bookingRef: string;
}

interface ConfirmationError {
    message: string;
    type: 'warning' | 'error';
}

const ConfirmationStep: React.FC = () => {
    const {data: bookingData} = useAppSelector((state) => state.booking);
    const {setCanGoNext} = useStepper();
    const boardingPassRef = useRef<HTMLDivElement>(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<ConfirmationError | null>(null);

    const {search, outboundFlight, returnFlight, passengers, totalPrice} = bookingData;
    const isReturnTrip = search.tripType === TripType.RETURN;

    const bookingReference = React.useMemo(() => {
        return `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(-2).toUpperCase()}`;
    }, []);

    useEffect(() => {
        setCanGoNext(false);
    }, [setCanGoNext]);

    const generateQRData = useCallback((
        passenger: Passenger,
        flight: FlightType,
        isReturn: boolean = false
    ): BoardingPassData => {
        const seatDisplay = passenger.seat
            ? `${passenger.seat.row}${passenger.seat.letter}`
            : 'TBA';

        return {
            name: `${passenger.firstName} ${passenger.lastName}`,
            flight: `${flight.airline} ${flight.id}`,
            from: flight.from,
            to: flight.to,
            seat: seatDisplay,
            departureTime: format(new Date(flight.departureTime), 'dd/MM/yyyy HH:mm'),
            gate: `A${Math.floor(Math.random() * 20) + 1}`,
            bookingRef: bookingReference,
        };
    }, [bookingReference]);

    const downloadBoardingPass = useCallback(async () => {
        if (!boardingPassRef.current) return;

        setIsDownloading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const element = boardingPassRef.current;
            console.log('Generating PDF for:', element);

            setError({
                message: 'PDF download simulated successfully! In production, this would generate a real PDF.',
                type: 'warning'
            });
        } catch (err) {
            setError({
                message: 'Failed to generate boarding pass PDF. Please try again.',
                type: 'error'
            });
        } finally {
            setIsDownloading(false);
        }
    }, []);

    const renderFlightSummary = useCallback((flight: FlightType, isReturn: boolean = false) => (
        <FrostedCard key={`${flight.id}-${isReturn ? 'return' : 'outbound'}`} sx={{mb: 3}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <Flight sx={{mr: 1, color: 'primary.main'}}/>
                <Typography variant="h6" fontWeight={600}>
                    {isReturn ? 'Return Flight' : 'Outbound Flight'}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        Airline
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {flight.airline}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        Flight Number
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {flight.id}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        From
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {flight.from}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        To
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {flight.to}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        Departure
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <CalendarToday sx={{fontSize: 16}}/>
                        <Typography variant="body1" fontWeight={500}>
                            {format(new Date(flight.departureTime), 'PPP')}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5}}>
                        <AccessTime sx={{fontSize: 16}}/>
                        <Typography variant="body1" fontWeight={500}>
                            {format(new Date(flight.departureTime), 'HH:mm')}
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        Arrival
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <CalendarToday sx={{fontSize: 16}}/>
                        <Typography variant="body1" fontWeight={500}>
                            {format(new Date(flight.arrivalTime), 'PPP')}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5}}>
                        <AccessTime sx={{fontSize: 16}}/>
                        <Typography variant="body1" fontWeight={500}>
                            {format(new Date(flight.arrivalTime), 'HH:mm')}
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        Class
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {flight.selectedClass || 'Economy'}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                        Price per person
                    </Typography>
                    <Typography variant="body1" fontWeight={500} color="primary.main">
                        €{flight.selectedPrice || 0}
                    </Typography>
                </Grid>
            </Grid>
        </FrostedCard>
    ), []);

    const renderBoardingPass = useCallback((passenger: Passenger, flight: FlightType, index: number, isReturn: boolean = false) => {
        const qrData = generateQRData(passenger, flight, isReturn);
        const seatDisplay = passenger.seat
            ? `${passenger.seat.row}${passenger.seat.letter}`
            : 'To be assigned';

        return (
            <Paper
                key={`${passenger.id}-${flight.id}-${isReturn ? 'return' : 'outbound'}`}
                elevation={6}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{position: 'absolute', top: 16, right: 16}}>
                    <QRCode
                        value={JSON.stringify(qrData)}
                        size={80}
                        level="M"
                    />
                </Box>

                <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                    {isReturn ? 'Return Flight' : 'Outbound Flight'} - Passenger {index + 1}
                </Typography>

                <Grid container spacing={2} sx={{mt: 1}}>
                    <Grid size={6}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                            <Person sx={{fontSize: 18, color: 'text.secondary'}}/>
                            <Typography variant="body2" color="text.secondary">
                                Passenger Name
                            </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                            {passenger.firstName} {passenger.lastName}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                            <Email sx={{fontSize: 18, color: 'text.secondary'}}/>
                            <Typography variant="body2" color="text.secondary">
                                Email
                            </Typography>
                        </Box>
                        <Typography variant="body1">
                            {passenger.email}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                            <Flight sx={{fontSize: 18, color: 'text.secondary'}}/>
                            <Typography variant="body2" color="text.secondary">
                                Flight
                            </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                            {flight.airline} #{flight.id}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                            <AirlineSeatReclineNormal sx={{fontSize: 18, color: 'text.secondary'}}/>
                            <Typography variant="body2" color="text.secondary">
                                Seat
                            </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                            {seatDisplay}
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                            Route & Time
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {flight.from} → {flight.to}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Departure: {format(new Date(flight.departureTime), 'PPpp')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Arrival: {format(new Date(flight.arrivalTime), 'PPpp')}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px dashed',
                    borderColor: 'divider',
                    textAlign: 'center'
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Booking Reference: {bookingReference} | Gate: {qrData.gate}
                    </Typography>
                </Box>
            </Paper>
        );
    }, [generateQRData, bookingReference]);

    if (!outboundFlight || passengers.length === 0) {
        return (
            <Box sx={{textAlign: 'center', p: 4}}>
                <Alert severity="error">
                    Incomplete booking data. Please go back and complete your booking.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 900, mx: 'auto'}}>
            {/* Success Header */}
            <Box sx={{textAlign: 'center', mb: 6}}>
                <CheckCircle sx={{fontSize: 80, color: 'success.main', mb: 2}}/>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Booking Confirmed! 🎉
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Your boarding passes are ready
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Booking Reference: <strong>{bookingReference}</strong>
                </Typography>
            </Box>

            {error && (
                <Alert
                    severity={error.type}
                    sx={{mb: 3}}
                    onClose={() => setError(null)}
                >
                    {error.message}
                </Alert>
            )}

            {/* Booking Summary */}
            <FrostedCard sx={{mb: 4}}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Booking Summary
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Trip Type
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {isReturnTrip ? 'Round Trip' : 'One Way'}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Passengers
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {passengers.length} {passengers.length === 1 ? 'person' : 'people'}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Total Amount
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="primary.main">
                            €{totalPrice.toFixed(2)}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                            Booking Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {format(new Date(), 'PPP')}
                        </Typography>
                    </Grid>
                </Grid>
            </FrostedCard>

            {/* Flight Details */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Flight Details
            </Typography>

            {renderFlightSummary(outboundFlight)}
            {isReturnTrip && returnFlight && renderFlightSummary(returnFlight, true)}

            {/* Boarding Passes */}
            <Box sx={{mb: 4}}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Boarding Passes
                </Typography>

                <Box ref={boardingPassRef}>
                    <Stack spacing={3}>
                        {/* Outbound Flight Boarding Passes */}
                        {passengers.map((passenger, index) =>
                            renderBoardingPass(passenger, outboundFlight, index, false)
                        )}

                        {/* Return Flight Boarding Passes */}
                        {isReturnTrip && returnFlight && passengers.map((passenger, index) =>
                            renderBoardingPass(passenger, returnFlight, index, true)
                        )}
                    </Stack>
                </Box>
            </Box>

            <Divider sx={{my: 4}}/>

            {/* Download Button */}
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Button
                    onClick={downloadBoardingPass}
                    variant="contained"
                    size="large"
                    disabled={isDownloading}
                    startIcon={<Download/>}
                    sx={{minWidth: 250}}
                >
                    {isDownloading ? 'Generating PDF...' : 'Download Boarding Pass (PDF)'}
                </Button>
            </Box>

            {/* Important Information */}
            <Alert severity="info" sx={{mt: 4}}>
                <Typography variant="subtitle2" gutterBottom>
                    Important Information
                </Typography>
                <Typography variant="body2">
                    • Please arrive at the airport at least 2 hours before domestic flights and 3 hours before
                    international flights
                    <br/>
                    • Check-in online 24 hours before your flight
                    <br/>
                    • Ensure your passport is valid for at least 6 months from travel date
                    <br/>
                    • Gate numbers will be announced 2 hours before departure
                </Typography>
            </Alert>
        </Box>
    );
};

export default ConfirmationStep;