import React, {useEffect, useMemo, useState} from 'react';
import {Box, Fade, Grid, Paper, Slide, Stack, Tooltip, Typography} from '@mui/material';
import {FlightClass, Seat} from "@/types/booking.types";

interface SeatMapProps {
    onSeatSelect: (seat: Seat) => void;
    selectedSeat: Seat | null;
    reservedSeatIds: string[];
    allowedClass: FlightClass;
}

interface SeatClass {
    rows: number[];
    price: number;
    color: string;
}

const rows = 20;
const leftSeats = ['A', 'B', 'C'];
const rightSeats = ['D', 'E', 'F'];

const seatClasses: Record<FlightClass, SeatClass> = {
    [FlightClass.BUSINESS]: {rows: [1, 2, 3], price: 150, color: '#8e44ad'},
    [FlightClass.PREMIUM]: {rows: [4, 5, 6, 7, 8], price: 100, color: '#2980b9'},
    [FlightClass.ECONOMY]: {
        rows: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        price: 50,
        color: '#27ae60',
    },
};

const SeatMap: React.FC<SeatMapProps> = ({
                                             onSeatSelect,
                                             selectedSeat,
                                             reservedSeatIds,
                                             allowedClass,
                                         }) => {
    const allSeats = useMemo(() => {
        const seats: string[] = [];
        for (let row = 1; row <= rows; row++) {
            for (const seat of [...leftSeats, ...rightSeats]) {
                seats.push(`${row}${seat}`);
            }
        }
        return seats;
    }, []);

    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [justBooked, setJustBooked] = useState<string | null>(null);

    // initial booking (25% pre-filled)
    useEffect(() => {
        const shuffled = [...allSeats].sort(() => 0.5 - Math.random());
        setBookedSeats(shuffled.slice(0, Math.floor(allSeats.length * 0.25)));
    }, [allSeats]);

    useEffect(() => {
        const interval = setInterval(() => {
            const freeSeats = allSeats.filter(
                (s) => !bookedSeats.includes(s) && !reservedSeatIds.includes(s)
            );
            if (freeSeats.length === 0) return;

            const next = freeSeats[Math.floor(Math.random() * freeSeats.length)];
            setBookedSeats((prev) => [...prev, next]);
            setJustBooked(next);

            setTimeout(() => setJustBooked(null), 2000);
        }, 15000);

        return () => clearInterval(interval);
    }, [allSeats, bookedSeats, reservedSeatIds]);

    const getSeatClass = (row: number): FlightClass => {
        for (const [className, {rows}] of Object.entries(seatClasses)) {
            if (rows.includes(row)) return className as FlightClass;
        }
        return FlightClass.ECONOMY;
    };

    const visibleRows = seatClasses[allowedClass]?.rows ?? Array.from({length: rows}, (_, i) => i + 1);

    const renderSeat = (row: number, seat: string) => {
        const seatId = `${row}${seat}`;
        const seatClass = getSeatClass(row);
        const {price, color} = seatClasses[seatClass];
        const isBooked = bookedSeats.includes(seatId) || reservedSeatIds.includes(seatId);
        const isSelected = selectedSeat?.id === seatId;
        const isJustBooked = seatId === justBooked;

        const handleClick = () => {
            if (isBooked) return;
            onSeatSelect({
                id: seatId,
                row: row.toString(),
                letter: seat,
                class: seatClass,
                price,
            });
        };

        let backgroundColor = `${color}33`;
        let textColor = 'black';

        if (isBooked) {
            backgroundColor = isJustBooked ? '#FFD700' : '#ccc';
            textColor = 'white';
        } else if (isSelected) {
            backgroundColor = color;
            textColor = 'white';
        }

        return (
            <Tooltip
                title={
                    isBooked
                        ? 'Already Booked'
                        : `${seatClass.charAt(0).toUpperCase() + seatClass.slice(1)} Class - $${price}`
                }
                arrow
                key={seatId}
            >
                <Fade in timeout={400}>
                    <Paper
                        onClick={handleClick}
                        elevation={isSelected ? 6 : 1}
                        sx={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20% 20% 5% 5%',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            backgroundColor,
                            color: textColor,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            boxShadow: isSelected ? `0 0 10px ${color}` : 'none',
                            '&:hover': {
                                backgroundColor: !isBooked && !isSelected ? `${color}66` : undefined,
                                boxShadow: !isBooked && !isSelected ? `0 0 6px ${color}` : undefined,
                            },
                        }}
                    >
                        {seatId}
                    </Paper>
                </Fade>
            </Tooltip>
        );
    };

    return (
        <Box sx={{px: 2}}>
            <Slide direction="down" in timeout={600}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeeba',
                        color: '#856404',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        fontWeight: 500,
                        mb: 2,
                    }}
                >
                    <Box sx={{fontSize: 20}}>⚠️</Box>
                    <Typography variant="body2">
                        Seats are booking fast! Reserve yours now.
                    </Typography>
                </Stack>
            </Slide>

            <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{mt: 1, mb: 2}}
            >
                Showing seats for <strong>{allowedClass}</strong> class
            </Typography>

            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid container direction="column" spacing={1} alignItems="center">
                    {visibleRows.map((row) => (
                        <Grid
                            key={`row-${row}`}
                            container
                            spacing={1}
                            justifyContent="center"
                            alignItems="center"
                        >
                            {/* Left seats */}
                            {leftSeats.map((seat) => renderSeat(row, seat))}

                            {/* Aisle */}
                            <Box sx={{ width: 24 }} />

                            {/* Right seats */}
                            {rightSeats.map((seat) => renderSeat(row, seat))}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default SeatMap;
