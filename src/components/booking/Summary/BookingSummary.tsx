import React, {useEffect, useMemo} from 'react';
import {Box, Card, CardContent, Chip, Divider, Fade, List, ListItem, Stack, Typography} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShieldIcon from '@mui/icons-material/Shield';
import {useAppDispatch, useAppSelector} from '../../../redux/hooks';
import {calculateTotalPrice} from '../../../redux/slices/bookingSlice';
import {ANIMATION_DELAYS, CARD_STYLES, SPACING} from '../../../types/summary.constants';

interface BookingSummaryBoxProps {
    title?: string;
}

const ICONS = {
    meals: <RestaurantIcon fontSize="small"/>,
    baggageInsurance: <ShieldIcon fontSize="small"/>,
    checkedBaggage: <LuggageIcon fontSize="small"/>,
    assistance: <CheckIcon fontSize="small" color="info"/>,
    seat: <CheckIcon fontSize="small" color="secondary"/>,
    flight: <CheckIcon fontSize="small" color="success"/>,
} as const;

const formatClass = (className?: string) =>
    className ? className.charAt(0).toUpperCase() + className.slice(1) : '';

const BookingSummaryBox: React.FC<BookingSummaryBoxProps> = ({
                                                                 title = "Booking Summary"
                                                             }) => {
    const dispatch = useAppDispatch();
    const {data} = useAppSelector((state) => state.booking);

    const {search, outboundFlight, returnFlight, passengers, assistance, totalPrice} = data;

    // Memoized passenger extras aggregation
    const passengerExtrasAggregated = useMemo(() => {
        const aggregated = {
            checkedBaggage: 0,
            meals: 0,
            baggageInsurance: 0,
        };

        passengers.forEach(passenger => {
            if (passenger.extras?.checkedBaggage?.selected && passenger.extras.checkedBaggage.price) {
                aggregated.checkedBaggage += passenger.extras.checkedBaggage.price;
            }
            if (passenger.extras?.meals?.selected && passenger.extras.meals.price) {
                aggregated.meals += passenger.extras.meals.price;
            }
            if (passenger.extras?.baggageInsurance?.selected && passenger.extras.baggageInsurance.price) {
                aggregated.baggageInsurance += passenger.extras.baggageInsurance.price;
            }
        });

        return aggregated;
    }, [passengers]);

    // Calculate total seat costs
    const totalSeatCosts = useMemo(() =>
        passengers.reduce((total, passenger) =>
            total + (passenger.seat?.price || 0), 0
        ), [passengers]
    );

    useEffect(() => {
        dispatch(calculateTotalPrice());
    }, [dispatch, outboundFlight, returnFlight, passengers, assistance, search.passengerCount]);

    return (
        <Box display="flex" justifyContent="center" width="100%" mt={3}>
            <Card
                sx={{
                    borderRadius: CARD_STYLES.BORDER_RADIUS,
                    boxShadow: CARD_STYLES.SHADOW,
                    width: '100%',
                    maxWidth: CARD_STYLES.MAX_WIDTH,
                    background: 'linear-gradient(135deg, #ffffff, #f4f6f9)',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <CardContent sx={{p: CARD_STYLES.PADDING}}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight={700}
                        textAlign="center"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        {title}
                    </Typography>

                    <List disablePadding>
                        {/* Outbound Flight */}
                        {outboundFlight && (
                            <Fade in timeout={ANIMATION_DELAYS.OUTBOUND_FLIGHT}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.flight}
                                        <Typography variant="body2">
                                            Flight
                                            | {formatClass(outboundFlight.selectedClass)} x{search.passengerCount}
                                        </Typography>
                                    </Stack>
                                    <Chip
                                        label={`€${(outboundFlight.selectedPrice || 0) * search.passengerCount}`}
                                        size="small"
                                        color="success"
                                    />
                                </ListItem>
                            </Fade>
                        )}

                        {/* Return Flight */}
                        {returnFlight && (
                            <Fade in timeout={ANIMATION_DELAYS.RETURN_FLIGHT}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.flight}
                                        <Typography variant="body2">
                                            Return Flight
                                            | {formatClass(returnFlight.selectedClass)} x{search.passengerCount}
                                        </Typography>
                                    </Stack>
                                    <Chip
                                        label={`€${(returnFlight.selectedPrice || 0) * search.passengerCount}`}
                                        size="small"
                                        color="success"
                                    />
                                </ListItem>
                            </Fade>
                        )}

                        {/* Global Assistance */}
                        {assistance && (
                            <Fade in timeout={ANIMATION_DELAYS.SHARED_ITEMS_BASE}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.assistance}
                                        <Typography variant="body2">
                                            Assistance: {formatClass(assistance.type)}
                                        </Typography>
                                    </Stack>
                                    <Chip label={`€${assistance.price}`} size="small" color="info"/>
                                </ListItem>
                            </Fade>
                        )}

                        {/* Seat Selection Total */}
                        {totalSeatCosts > 0 && (
                            <Fade in timeout={ANIMATION_DELAYS.SHARED_ITEMS_BASE + ANIMATION_DELAYS.STAGGER}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.seat}
                                        <Typography variant="body2">
                                            Seat Selection ({passengers.filter(p => p.seat?.price).length} seats)
                                        </Typography>
                                    </Stack>
                                    <Chip label={`€${totalSeatCosts}`} size="small" color="secondary"/>
                                </ListItem>
                            </Fade>
                        )}

                        {/* Aggregated Passenger Extras */}
                        {passengerExtrasAggregated.checkedBaggage > 0 && (
                            <Fade in timeout={ANIMATION_DELAYS.SHARED_ITEMS_BASE + 2 * ANIMATION_DELAYS.STAGGER}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.checkedBaggage}
                                        <Typography variant="body2">
                                            Checked Baggage
                                            ({passengers.filter(p => p.extras?.checkedBaggage?.selected).length} bags)
                                        </Typography>
                                    </Stack>
                                    <Chip label={`€${passengerExtrasAggregated.checkedBaggage}`} size="small"
                                          color="info"/>
                                </ListItem>
                            </Fade>
                        )}

                        {passengerExtrasAggregated.meals > 0 && (
                            <Fade in timeout={ANIMATION_DELAYS.SHARED_ITEMS_BASE + 3 * ANIMATION_DELAYS.STAGGER}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.meals}
                                        <Typography variant="body2">
                                            Meals ({passengers.filter(p => p.extras?.meals?.selected).length} meals)
                                        </Typography>
                                    </Stack>
                                    <Chip label={`€${passengerExtrasAggregated.meals}`} size="small" color="info"/>
                                </ListItem>
                            </Fade>
                        )}

                        {passengerExtrasAggregated.baggageInsurance > 0 && (
                            <Fade in timeout={ANIMATION_DELAYS.SHARED_ITEMS_BASE + 4 * ANIMATION_DELAYS.STAGGER}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {ICONS.baggageInsurance}
                                        <Typography variant="body2">
                                            Baggage Insurance
                                            ({passengers.filter(p => p.extras?.baggageInsurance?.selected).length} policies)
                                        </Typography>
                                    </Stack>
                                    <Chip label={`€${passengerExtrasAggregated.baggageInsurance}`} size="small"
                                          color="warning"/>
                                </ListItem>
                            </Fade>
                        )}

                        <Divider sx={{my: SPACING.DIVIDER_Y}}/>

                        {/* Total */}
                        <Fade in timeout={ANIMATION_DELAYS.TOTAL_SECTION}>
                            <ListItem sx={{py: SPACING.TOTAL_ITEM_Y, justifyContent: 'space-between'}}>
                                <Typography variant="body2" fontWeight={600}>
                                    Total
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    €{totalPrice}
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