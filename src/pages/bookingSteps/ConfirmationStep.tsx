import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Alert, Box, Button, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import {AirlineSeatReclineNormal, CheckCircle, Download, Email, Flight, Person} from "@mui/icons-material";
import {QRCodeSVG as QRCode} from "qrcode.react";
import {format} from "date-fns";

import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useStepper} from "../../hooks/useStepper";
import {Flight as FlightType, Passenger, TripType} from "@/types/booking.types";
import FrostedCard from "../../components/layout/FrostedCard/FrostedCard";
import {generatePDF} from "@/utils/pdfGenerator";
import {resetBooking} from "@/redux/slices/bookingSlice";

type Notification = { message: string; type: "success" | "error" | "warning" | "info" };

const ConfirmationStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const {data: bookingData} = useAppSelector((state) => state.booking);
    const {setCanGoNext} = useStepper();
    const boardingPassRef = useRef<HTMLDivElement>(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const {search, outboundFlight, returnFlight, passengers, totalPrice} = bookingData;
    const isReturnTrip = search.tripType === TripType.RETURN;

    const bookingReference = useMemo(
        () => `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(-2).toUpperCase()}`,
        []
    );

    useEffect(() => {
        setCanGoNext(false);
    }, [setCanGoNext]);

    useEffect(() => {
        return () => {
            dispatch(resetBooking());
        };
    }, [dispatch]);

    const generateQRData = useCallback((passenger: Passenger, flight: FlightType) => ({
        name: `${passenger.firstName} ${passenger.lastName}`,
        flight: `${flight.airline} ${flight.id}`,
        from: flight.from,
        to: flight.to,
        seat: passenger.seat ? `${passenger.seat.row}${passenger.seat.letter}` : "TBA",
        departureTime: format(new Date(flight.departureTime), "dd/MM/yyyy HH:mm"),
        gate: `A${Math.floor(Math.random() * 20) + 1}`,
        bookingRef: bookingReference,
    }), [bookingReference]);

    const downloadBoardingPass = useCallback(async () => {
        if (!boardingPassRef.current) return;
        setIsDownloading(true);
        try {
            await generatePDF(boardingPassRef.current, "boarding-pass.pdf");
            setNotification({message: "PDF downloaded successfully ✅", type: "success"});
        } catch {
            setNotification({message: "Failed to generate PDF. Please try again.", type: "error"});
        } finally {
            setIsDownloading(false);
        }
    }, []);

    const renderBoardingPass = useCallback((passenger: Passenger, flight: FlightType, index: number, isReturn = false) => {
        const qrData = generateQRData(passenger, flight);
        return (
            <Paper key={`${passenger.id}-${flight.id}-${isReturn ? "return" : "outbound"}`} elevation={6} sx={{
                p: 3,
                borderRadius: 3,
                position: "relative",
                border: "1px solid",
                borderColor: "divider",
                background: "linear-gradient(135deg, #f8fafc, #ffffff)"
            }}>
                <Box sx={{position: "absolute", top: 16, right: 16}}><QRCode value={JSON.stringify(qrData)} size={80}
                                                                             level="M"/></Box>
                <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                    {isReturn ? "Return Flight" : "Outbound Flight"} – Passenger {index + 1}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                            <Person sx={{fontSize: 18, color: "text.secondary"}}/>
                            <Typography variant="body2" color="text.secondary">Passenger Name</Typography>
                        </Box>
                        <Typography variant="body1"
                                    fontWeight={600}>{passenger.firstName} {passenger.lastName}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                            <Email sx={{fontSize: 18, color: "text.secondary"}}/>
                            <Typography variant="body2" color="text.secondary">Email</Typography>
                        </Box>
                        <Typography variant="body1">{passenger.email}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                            <Flight sx={{fontSize: 18, color: "text.secondary"}}/>
                            <Typography variant="body2" color="text.secondary">Flight</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>{flight.airline} #{flight.id}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                            <AirlineSeatReclineNormal sx={{fontSize: 18, color: "text.secondary"}}/>
                            <Typography variant="body2" color="text.secondary">Seat</Typography>
                        </Box>
                        <Typography variant="body1"
                                    fontWeight={600}>{passenger.seat ? `${passenger.seat.row}${passenger.seat.letter}` : "TBA"}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>Route & Time</Typography>
                        <Typography variant="body1" fontWeight={500}>{flight.from} → {flight.to}</Typography>
                        <Typography variant="body2"
                                    color="text.secondary">Departure: {format(new Date(flight.departureTime), "PPpp")}</Typography>
                        <Typography variant="body2"
                                    color="text.secondary">Arrival: {format(new Date(flight.arrivalTime), "PPpp")}</Typography>
                    </Grid>
                </Grid>
                <Box sx={{mt: 2, pt: 2, borderTop: "1px dashed", borderColor: "divider", textAlign: "center"}}>
                    <Typography variant="caption" color="text.secondary">Booking Ref: {bookingReference} |
                        Gate: {qrData.gate}</Typography>
                </Box>
            </Paper>
        );
    }, [generateQRData, bookingReference]);

    if (!outboundFlight || passengers.length === 0) return <Box sx={{textAlign: "center", p: 4}}><Alert
        severity="error">Incomplete booking data. Please go back and complete your booking.</Alert></Box>;

    return (
        <Box sx={{maxWidth: 1000, mx: "auto"}}>
            <Box sx={{textAlign: "center", mb: 6}}>
                <CheckCircle sx={{fontSize: 90, color: "success.main", mb: 2}}/>
                <Typography variant="h3" fontWeight={700} gutterBottom>Booking Confirmed! 🎉</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>Your boarding passes are ready</Typography>
                <Typography variant="body1" color="text.secondary">Booking
                    Reference: <strong>{bookingReference}</strong></Typography>
            </Box>

            {notification && <Alert severity={notification.type} sx={{mb: 3}}
                                    onClose={() => setNotification(null)}>{notification.message}</Alert>}

            <FrostedCard sx={{mb: 4, p: 3}}>
                <Typography variant="h5" fontWeight={600} gutterBottom>Booking Summary</Typography>
                <Grid container spacing={2}>
                    <Grid size={6}><Typography variant="body2" color="text.secondary">Trip Type</Typography><Typography
                        variant="body1" fontWeight={500}>{isReturnTrip ? "Round Trip" : "One Way"}</Typography></Grid>
                    <Grid size={6}><Typography variant="body2" color="text.secondary">Passengers</Typography><Typography
                        variant="body1"
                        fontWeight={500}>{passengers.length} {passengers.length === 1 ? "person" : "people"}</Typography></Grid>
                    <Grid size={6}><Typography variant="body2" color="text.secondary">Total
                        Amount</Typography><Typography variant="h6" fontWeight={600}
                                                       color="primary.main">€{totalPrice.toFixed(2)}</Typography></Grid>
                    <Grid size={6}><Typography variant="body2" color="text.secondary">Booking
                        Date</Typography><Typography variant="body1"
                                                     fontWeight={500}>{format(new Date(), "PPP")}</Typography></Grid>
                </Grid>
            </FrostedCard>

            <Box sx={{mb: 4}}>
                <Typography variant="h5" fontWeight={600} gutterBottom>Boarding Passes</Typography>
                <Box ref={boardingPassRef}>
                    <Stack spacing={3}>
                        {passengers.map((p, i) => renderBoardingPass(p, outboundFlight, i))}
                        {isReturnTrip && returnFlight && passengers.map((p, i) => renderBoardingPass(p, returnFlight, i, true))}
                    </Stack>
                </Box>
            </Box>

            <Divider sx={{my: 4}}/>

            <Box sx={{textAlign: "center", mb: 4}}>
                <Button onClick={downloadBoardingPass} variant="contained" size="large" disabled={isDownloading}
                        startIcon={<Download/>}
                        sx={{minWidth: 260, borderRadius: 3, textTransform: "none", fontSize: 16, py: 1.5}}>
                    {isDownloading ? "Generating PDF..." : "Download Boarding Pass (PDF)"}
                </Button>
            </Box>

            <Alert severity="info" sx={{mt: 4}}>
                <Typography variant="subtitle2" gutterBottom>Important Information</Typography>
                <Typography variant="body2">
                    • Arrive at the airport 2h before domestic, 3h before international flights<br/>
                    • Check-in online 24h before flight<br/>
                    • Passport valid at least 6 months from travel<br/>
                    • Gate numbers announced 2h before departure
                </Typography>
            </Alert>
        </Box>
    );
};

export default ConfirmationStep;
