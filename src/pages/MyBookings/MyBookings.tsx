import React, {useEffect, useState} from "react";
import {Box, Button, Chip, Container, Divider, Paper, Stack, Typography,} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import {format} from "date-fns";
import FrostedCard from "@/components/layout/FrostedCard/FrostedCard";
import {BookingData, TripType} from "@/types/booking.types";

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<BookingData[]>([]);

    useEffect(() => {
        const savedBookings = localStorage.getItem("bookings");
        if (savedBookings) setBookings(JSON.parse(savedBookings));
    }, []);

    return (
        <Container maxWidth="lg" sx={{py: 6}}>
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

            <Divider sx={{my: 4}}/>

            <AnimatePresence>
                {bookings.length > 0 ? (
                    <Stack spacing={4}>
                        {bookings.map((booking, idx) => (
                            <motion.div
                                key={booking.search.origin + idx}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{duration: 0.4, delay: idx * 0.1}}
                            >
                                <FrostedCard sx={{p: 4}}>
                                    <Stack spacing={3}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                                Booking Reference: {booking.search.origin}-{booking.search.destination}
                                            </Typography>
                                            <Typography variant="h6" color="secondary.main" fontWeight={600}>
                                                €{booking.totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Stack direction={{xs: "column", md: "row"}} spacing={2}>
                                            <Chip
                                                label={booking.search.tripType === TripType.RETURN ? "Round Trip" : "One Way"}
                                                color="primary"/>
                                            <Chip
                                                label={`${booking.passengers.length} Passenger${booking.passengers.length > 1 ? "s" : ""}`}
                                                color="secondary"/>
                                        </Stack>

                                        {/* Flights */}
                                        {[booking.outboundFlight, booking.returnFlight].map((flight, i) =>
                                            flight ? (
                                                <Paper
                                                    key={i}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        background: "#f9fafb",
                                                        boxShadow: 1,
                                                    }}
                                                >
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {i === 0 ? "Outbound Flight" : "Return Flight"}
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={500}>
                                                        {flight.from} → {flight.to}
                                                    </Typography>
                                                    <Stack direction="row" spacing={2} mt={1}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Dep: {format(new Date(flight.departureTime), "PPpp")}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Arr: {format(new Date(flight.arrivalTime), "PPpp")}
                                                        </Typography>
                                                        {flight.selectedClass && flight.selectedPrice && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {flight.selectedClass} (€{flight.selectedPrice})
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Paper>
                                            ) : null
                                        )}

                                        {/* Passengers & Extras */}
                                        <Box>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                Passengers
                                            </Typography>
                                            <Stack spacing={1}>
                                                {booking.passengers.map((p, i) => (
                                                    <Paper
                                                        key={i}
                                                        sx={{p: 2, borderRadius: 2, background: "#f3f4f6"}}
                                                        elevation={0}
                                                    >
                                                        <Typography fontWeight={500}>
                                                            {p.firstName} {p.lastName} ({p.email})
                                                        </Typography>
                                                        {p.seat && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Seat: {p.seat.row}{p.seat.letter} ({p.seat.class})
                                                            </Typography>
                                                        )}
                                                        <Stack direction="row" spacing={1} mt={0.5}>
                                                            {p.extras?.checkedBaggage?.selected && (
                                                                <Chip
                                                                    label={`Baggage ${p.extras.checkedBaggage.weight}kg`}
                                                                    size="small"
                                                                    color="info"
                                                                />
                                                            )}
                                                            {p.extras?.meals?.selected && (
                                                                <Chip label="Meal" size="small" color="success"/>
                                                            )}
                                                            {p.extras?.baggageInsurance?.selected && (
                                                                <Chip label="Insurance" size="small" color="warning"/>
                                                            )}
                                                        </Stack>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        </Box>

                                        {/* Global Assistance */}
                                        {booking.assistance && (
                                            <Box>
                                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                                    Assistance
                                                </Typography>
                                                <Chip
                                                    label={`${booking.assistance.type} (€${booking.assistance.price.toFixed(2)})`}
                                                    color="secondary"
                                                />
                                            </Box>
                                        )}
                                    </Stack>
                                </FrostedCard>
                            </motion.div>
                        ))}
                    </Stack>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            textAlign="center"
                            sx={{py: 10}}
                        >
                            <FlightTakeoffIcon sx={{fontSize: 80, color: "grey.400", mb: 2}}/>
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
