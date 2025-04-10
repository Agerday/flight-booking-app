import React from 'react';
import {
    Typography,
    Box,
    Stack,
    Divider,
    Grid,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const FlightSummary = ({ flight }) => {
    if (!flight) return null;

    const logoPath = `/airline-logos/${flight.airline.toLowerCase().replace(/\s+/g, '-')}.png`;

    return (
        <Box sx={{ p: 3 }}>
            {/* Airline header */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box
                    component="img"
                    src={logoPath}
                    alt={flight.airline}
                    sx={{ height: 50, width: 50, borderRadius: '50%' }}
                />
                <Typography variant="h6" color="primary">
                    {flight.airline}
                </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Main Grid: 2 columns */}
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FlightTakeoffIcon color="action" />
                            <Typography><strong>From:</strong> {flight.from}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <FlightLandIcon color="action" />
                            <Typography><strong>To:</strong> {flight.to}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon color="action" />
                            <Typography><strong>Stops:</strong> {flight.stops}</Typography>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Stack spacing={2}>
                        <Typography>
                            <strong>Departure:</strong><br />
                            {new Date(flight.departureTime).toLocaleString()}
                        </Typography>
                        <Typography>
                            <strong>Arrival:</strong><br />
                            {new Date(flight.arrivalTime).toLocaleString()}
                        </Typography>
                        <Typography variant="h6" color="success.main">
                            <MonetizationOnIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            ${flight.price}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FlightSummary;
