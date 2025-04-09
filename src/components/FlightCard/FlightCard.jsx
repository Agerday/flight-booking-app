import React from 'react';
import {Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography,} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {flightClassThemes} from "../../app/constants/flightClassThemes";


const FlightCard = ({flight, onSelect}) => {
    const logoPath = `/airline-logos/${flight.airline.toLowerCase().replace(/\s+/g, '-')}.png`;

    const priceBoxes = Object.entries(flight.prices).map(([classType, price]) => {
        const theme = flightClassThemes[classType];

        return (
            <Grid item xs={12} sm={4} key={classType}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 1.2,
                        borderRadius: 2,
                        textAlign: 'center',
                        border: `1px solid`,
                        borderColor: theme.color,
                        backgroundColor: 'background.paper',
                        transition: '0.2s ease all',
                        '&:hover': {
                            transform: 'scale(1.015)',
                            boxShadow: 4,
                        },
                    }}
                >
                    <Chip
                        label={theme.label}
                        color="default"
                        variant="outlined"
                        size="small"
                        sx={{mb: 0.5, fontSize: '0.65rem'}}
                    />
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={theme.color}
                        textTransform="capitalize"
                    >
                        {theme.emoji} {classType}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{mt: 0.5, color: theme.color, fontWeight: 600}}
                    >
                        ${price.toFixed(2)}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            mt: 1,
                            fontSize: '0.7rem',
                            px: 1.5,
                            py: 0.4,
                            color: theme.color,
                            borderColor: theme.color,
                            textTransform: 'none',
                        }}
                        onClick={() =>
                            onSelect?.({
                                ...flight,
                                selectedClass: classType,
                                selectedPrice: price,
                            })
                        }
                    >
                        Select
                    </Button>
                </Paper>
            </Grid>
        );
    });


    return (
        <Card
            elevation={5}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%', // 👈 THIS is key
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                },
            }}
        >z

            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                    <Box component="img" src={logoPath} alt={flight.airline} sx={{height: 32}}/>
                    <Typography variant="h6" color="primary">
                        {flight.airline}
                    </Typography>
                </Stack>

                <Divider sx={{mb: 2}}/>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 1}}>
                    <Typography><strong>From:</strong> {flight.from}</Typography>
                    <FlightTakeoffIcon sx={{color: 'primary.main'}}/>
                    <Typography><strong>To:</strong> {flight.to}</Typography>
                    <FlightLandIcon sx={{color: 'secondary.main'}}/>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 1}}>
                    <CalendarMonthIcon color="action"/>
                    <Typography>{new Date(flight.departureTime).toLocaleDateString()}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{mb: 2}}>
                    <Typography><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleTimeString()}
                    </Typography>
                    <Typography><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleTimeString()}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    Stops: {flight.stops}
                </Typography>

                <Grid container spacing={1} alignItems="stretch">
                    {priceBoxes}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default FlightCard;
