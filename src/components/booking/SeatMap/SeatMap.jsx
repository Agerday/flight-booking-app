import React, { useEffect, useMemo, useState } from 'react';
import { Box, Fade, Grid, Paper, Slide, Stack, Tooltip, Typography } from '@mui/material';

const rows = 12;
const leftSeats = ['A', 'B', 'C'];
const rightSeats = ['D', 'E', 'F'];

const seatClasses = {
    business: { rows: [1, 2], price: 150, color: '#8e44ad' },
    premium: { rows: [3, 4, 5, 6], price: 100, color: '#2980b9' },
    economy: { rows: [7, 8, 9, 10, 11, 12], price: 50, color: '#27ae60' },
};

const SeatMap = ({ onSeatSelect, selectedSeat, reservedSeatIds, allowedClass }) => {
    const allSeats = useMemo(() => {
        const seats = [];
        for (let row = 1; row <= rows; row++) {
            for (let seat of [...leftSeats, ...rightSeats]) {
                seats.push(`${row}${seat}`);
            }
        }
        return seats;
    }, []);

    const [bookedSeats, setBookedSeats] = useState([]);
    const [lastBookedSeat, setLastBookedSeat] = useState(null);

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
            setLastBookedSeat(next);
            setTimeout(() => setLastBookedSeat(null), 1500);
        }, 10000);
        return () => clearInterval(interval);
    }, [allSeats, bookedSeats, reservedSeatIds]);

    const getSeatClass = (row) => {
        for (const [className, { rows }] of Object.entries(seatClasses)) {
            if (rows.includes(row)) return className;
        }
        return 'economy';
    };

    const visibleRows = allowedClass
        ? seatClasses[allowedClass]?.rows || []
        : Array.from({ length: rows }, (_, i) => i + 1);

    const renderSeat = (row, seat) => {
        const seatId = `${row}${seat}`;
        const seatClass = getSeatClass(row);
        const { price, color } = seatClasses[seatClass];
        const isBooked = bookedSeats.includes(seatId) || reservedSeatIds.includes(seatId);
        const isSelected = selectedSeat?.id === seatId;
        const isJustBooked = seatId === lastBookedSeat;

        const handleClick = () => {
            if (isBooked) return;
            onSeatSelect({
                id: seatId,
                row,
                seat,
                class: seatClass,
                price,
            });
        };

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
                            backgroundColor: isBooked
                                ? isJustBooked
                                    ? '#FFD700'
                                    : '#ccc'
                                : isSelected
                                    ? color
                                    : `${color}33`,
                            color: isBooked || isSelected ? 'white' : 'black',
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

    const renderSeatColumn = (seatGroup) =>
        seatGroup.map((seat) => (
            <Grid key={seat}>
                <Grid container direction="column" spacing={1} alignItems="center">
                    {visibleRows.map((row) => (
                        <Grid key={`${row}${seat}`}>{renderSeat(row, seat)}</Grid>
                    ))}
                </Grid>
            </Grid>
        ));

    const LegendBox = ({ label, color }) => (
        <Stack direction="row" spacing={1} alignItems="center">
            <Box
                sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '20% 20% 5% 5%',
                    backgroundColor: color,
                    border: '1px solid #ccc',
                }}
            />
            <Typography variant="body2">{label}</Typography>
        </Stack>
    );

    return (
        <Box sx={{ px: 2 }}>
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
                    <Box sx={{ fontSize: 20 }}>⚠️</Box>
                    <Typography variant="body2">
                        Seats are booking fast! Reserve yours now.
                    </Typography>
                </Stack>
            </Slide>

            <Typography variant="body2" color="text.secondary" textAlign="center" mt={1} mb={2}>
                Showing seats for <strong>{allowedClass}</strong> class
            </Typography>

            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid>
                    <Grid container direction="column" spacing={1} alignItems="flex-end">
                        {visibleRows.map((row) => (
                            <Grid key={`rowNum-${row}`}>
                                <Typography variant="caption" sx={{ opacity: 0.6, minWidth: 20 }}>
                                    {row}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {renderSeatColumn(leftSeats)}
                <Grid>
                    <Box sx={{ width: 24 }} />
                </Grid>
                {renderSeatColumn(rightSeats)}
            </Grid>

            <Stack direction="row" spacing={3} mt={4} justifyContent="center">
                {Object.entries(seatClasses).map(([key, val]) => (
                    <LegendBox key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} color={val.color} />
                ))}
                <LegendBox label="Booked" color="#ccc" />
            </Stack>
        </Box>
    );
};

export default SeatMap;
