import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { format } from "date-fns";
import FrostedCard from "@/components/layout/FrostedCard/FrostedCard";
import { TripType } from "@/types/booking.types";

interface Reservation {
    bookingReference: string;
    outboundFlight: any;
    returnFlight?: any;
    passengers: any[];
    totalPrice: number;
    search: { tripType: TripType };
    date: string;
}

const MyBookings: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        const savedBookings = localStorage.getItem("bookings");
        if (savedBookings) {
            setReservations(JSON.parse(savedBookings));
        }
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box textAlign="center" mb={6}>
                <Typography
                    variant="h3"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    🧳 My Bookings
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    All your trips, all in one place
                </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Booking list */}
            <AnimatePresence>
                {reservations.length > 0 ? (
                    <Stack spacing={4}>
                        {reservations.map((res, idx) => (
                            <motion.div
                                key={res.bookingReference}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                            >
                                <FrostedCard sx={{ p: 3 }}>
                                    <Stack spacing={2}>
                                        <Typography variant="h5" fontWeight={700} color="primary.main">
                                            Booking Ref: {res.bookingReference}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Booking Date: {format(new Date(res.date), "PPPpp")}
                                        </Typography>

                                        <Divider />

                                        {/* Outbound */}
                                        <Paper
                                            variant="outlined"
                                            sx={{ p: 2, borderRadius: 3, background: "#f9fafb" }}
                                        >
                                            <Typography variant="h6" fontWeight={600}>
                                                Outbound Flight
                                            </Typography>
                                            <Typography>
                                                {res.outboundFlight.from} → {res.outboundFlight.to}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Departure:{" "}
                                                {format(new Date(res.outboundFlight.departureTime), "PPpp")}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Arrival:{" "}
                                                {format(new Date(res.outboundFlight.arrivalTime), "PPpp")}
                                            </Typography>
                                        </Paper>

                                        {/* Return (if exists) */}
                                        {res.search.tripType === TripType.RETURN && res.returnFlight && (
                                            <Paper
                                                variant="outlined"
                                                sx={{ p: 2, borderRadius: 3, background: "#f9fafb" }}
                                            >
                                                <Typography variant="h6" fontWeight={600}>
                                                    Return Flight
                                                </Typography>
                                                <Typography>
                                                    {res.returnFlight.from} → {res.returnFlight.to}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Departure:{" "}
                                                    {format(new Date(res.returnFlight.departureTime), "PPpp")}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Arrival:{" "}
                                                    {format(new Date(res.returnFlight.arrivalTime), "PPpp")}
                                                </Typography>
                                            </Paper>
                                        )}

                                        {/* Passengers */}
                                        <Box>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                Passengers
                                            </Typography>
                                            {res.passengers.map((p, i) => (
                                                <Typography key={i}>
                                                    {p.firstName} {p.lastName} ({p.email})
                                                </Typography>
                                            ))}
                                        </Box>

                                        {/* Price */}
                                        <Box>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                Total Price
                                            </Typography>
                                            <Typography variant="h5" color="primary.main">
                                                €{res.totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </FrostedCard>
                            </motion.div>
                        ))}
                    </Stack>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            textAlign="center"
                            sx={{ py: 10 }}
                        >
                            <FlightTakeoffIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                No bookings yet
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mb={3}>
                                Start booking your next trip and it will appear here.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    px: 4,
                                    py: 1.5,
                                    background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
                                }}
                                onClick={() => (window.location.href = "/book")}
                            >
                                Book a Flight
                            </Button>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default MyBookings;
