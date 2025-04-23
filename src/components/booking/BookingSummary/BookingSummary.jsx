import React from 'react';
import {Box, Card, CardContent, Chip, Divider, Fade, List, ListItem, Stack, Typography,} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShieldIcon from '@mui/icons-material/Shield';
import {useSelector} from 'react-redux';
import {generatePriceSummary} from '../../../app/utils/priceSummaryGenerator';

const iconMap = {
    meals: <RestaurantIcon fontSize="small"/>,
    baggageInsurance: <ShieldIcon fontSize="small"/>,
    checkedBaggage: <LuggageIcon fontSize="small"/>,
    assistance: <CheckIcon fontSize="small" color="info"/>,
    insurance: <ShieldIcon fontSize="small" color="warning"/>,
    seat: <CheckIcon fontSize="small" color="secondary"/>,
    flight: <CheckIcon fontSize="small" color="success"/>,
};

const BookingSummaryBox = () => {
    const formData = useSelector((state) => state.booking.formData);
    const summary = generatePriceSummary(formData, {icons: iconMap});

    const passengerCount = formData.initialInfos.passengerNumber;
    const selectedClass = formData.flight.selectedClass;
    const classLabel = selectedClass?.charAt(0).toUpperCase() + selectedClass?.slice(1);
    const flightBasePrice = formData.flight?.prices?.[selectedClass] || 0;
    const flightTotal = flightBasePrice * passengerCount;

    const returnFlight = formData.selectedReturnFlight;
    const returnClass = returnFlight?.selectedClass || '';
    const returnLabel = returnClass.charAt(0).toUpperCase() + returnClass.slice(1);
    const returnBasePrice = returnFlight?.prices?.[returnClass] || 0;
    const returnFlightTotal = returnBasePrice * passengerCount;

    const sharedItems = summary
        .filter((item) => item.scope === 'global')
        .filter((item) => item.label !== 'Flight'); // prevent duplicate

    const perPassengerItems = summary.filter((item) => item.scope === 'passenger');

    const total = summary.reduce((sum, item) => sum + item.price, 0);

    const getItemsForPassenger = (index) =>
        perPassengerItems.filter((item) => item.passengerIndex === index);

    return (
        <Box display="flex" justifyContent="center" width="100%" mt={3}>
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: 8,
                    width: '100%',
                    maxWidth: 340,
                    background: 'linear-gradient(135deg, #ffffff, #f4f6f9)',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <CardContent sx={{p: 3}}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight={700}
                        textAlign="center"
                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1}}
                    >
                        🧾 Booking Summary
                    </Typography>

                    <List disablePadding>
                        {/* Outbound Flight */}
                        <Fade in timeout={300}>
                            <ListItem sx={{py: 0.75, px: 0}}>
                                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                    {iconMap.flight}
                                    <Typography variant="body2">
                                        Flight | {classLabel} x{passengerCount}
                                    </Typography>
                                </Stack>
                                <Chip label={`€${flightTotal}`} size="small" color="success"/>
                            </ListItem>
                        </Fade>

                        {/* Return Flight */}
                        {returnFlight?.id && (
                            <Fade in timeout={350}>
                                <ListItem sx={{py: 0.75, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {iconMap.flight}
                                        <Typography variant="body2">
                                            Return Flight | {returnLabel} x{passengerCount}
                                        </Typography>
                                    </Stack>
                                    <Chip label={`€${returnFlightTotal}`} size="small" color="success"/>
                                </ListItem>
                            </Fade>
                        )}

                        {/* Shared extras */}
                        {sharedItems.map(({label, price, icon}, i) => (
                            <Fade in timeout={400 + i * 100} key={`shared-${label}-${i}`}>
                                <ListItem sx={{py: 0.75, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {icon}
                                        <Typography variant="body2">{label}</Typography>
                                    </Stack>
                                    <Chip label={`€${price}`} size="small" color="info"/>
                                </ListItem>
                            </Fade>
                        ))}

                        {/* Per-passenger extras */}
                        {passengerCount > 1 && <Divider sx={{my: 1}}/>}

                        {Array.from({length: passengerCount}).map((_, idx) => (
                            <Box key={`passenger-${idx}`}>
                                {passengerCount > 1 && (
                                    <Fade in timeout={500 + idx * 100}>
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            color="primary"
                                            mt={1}
                                            mb={0.5}
                                        >
                                            👤 Passenger {idx + 1}
                                        </Typography>
                                    </Fade>
                                )}

                                {getItemsForPassenger(idx).map(({label, price, icon}, i) => (
                                    <Fade in timeout={600 + i * 100} key={`p${idx}-${label}-${i}`}>
                                        <ListItem sx={{py: 0.5, px: 0}}>
                                            <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                                {icon}
                                                <Typography variant="body2">{label}</Typography>
                                            </Stack>
                                            <Chip label={`€${price}`} size="small" color="default"/>
                                        </ListItem>
                                    </Fade>
                                ))}
                            </Box>
                        ))}

                        <Divider sx={{my: 2}}/>

                        <Fade in timeout={800}>
                            <ListItem sx={{py: 1, justifyContent: 'space-between'}}>
                                <Typography variant="body2" fontWeight={600}>
                                    Total
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    €{total}
                                </Typography>
                            </ListItem>
                        </Fade>
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BookingSummaryBox;
