import React from 'react';
import { Grid, Paper, Tooltip, Typography, Stack, Box } from '@mui/material';

const rows = 12;
const leftSeats = ['A', 'B', 'C'];
const rightSeats = ['D', 'E', 'F'];

const seatClasses = {
    business: { rows: [1, 2], price: 150, color: '#8e44ad' },
    premium: { rows: [3, 4, 5, 6], price: 100, color: '#2980b9' },
    economy: { rows: [7, 8, 9, 10, 11, 12], price: 50, color: '#27ae60' },
};

const bookedSeats = ['1A', '2C', '4D', '8D', '8E', '8F', '9A', '9E', '9F', '4D', '5E', '6F'];

const getSeatClass = (row) => {
    for (const [className, { rows }] of Object.entries(seatClasses)) {
        if (rows.includes(row)) return className;
    }
    return 'economy';
};

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

const SeatMap = ({ onSeatSelect, selectedSeat }) => {
    const renderSeat = (row, seat) => {
        const seatId = `${row}${seat}`;
        const seatClass = getSeatClass(row);
        const { price, color } = seatClasses[seatClass];
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeat?.id === seatId;

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
                <Paper
                    onClick={() =>
                        !isBooked &&
                        onSeatSelect({
                            id: seatId,
                            row,
                            seat,
                            class: seatClass,
                            price,
                        })
                    }
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
                            ? '#ccc'
                            : isSelected
                                ? color
                                : `${color}33`,
                        color: isBooked || isSelected ? 'white' : 'black',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: !isBooked && !isSelected ? `${color}66` : undefined,
                        },
                    }}
                >
                    {seatId}
                </Paper>
            </Tooltip>
        );
    };

    const renderSeatColumn = (seatGroup) =>
        seatGroup.map((seat) => (
            <Grid item key={seat}>
                <Grid container direction="column" spacing={1} alignItems="center">
                    {Array.from({ length: rows }, (_, i) => {
                        const row = i + 1;
                        return (
                            <Grid item key={`${row}${seat}`}>
                                {renderSeat(row, seat)}
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        ));

    return (
        <>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                    p: 2,
                }}
            >
                {renderSeatColumn(leftSeats)}
                <Grid item>
                    <Box sx={{ width: 24 }} />
                </Grid>
                {renderSeatColumn(rightSeats)}
            </Grid>

            <Stack direction="row" spacing={3} mt={3} justifyContent="center">
                {Object.entries(seatClasses).map(([key, val]) => (
                    <LegendBox key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} color={val.color} />
                ))}
                <LegendBox label="Booked" color="#ccc" />
            </Stack>
        </>
    );
};

export default SeatMap;
