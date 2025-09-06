import React, {JSX, useEffect, useMemo} from "react";
import {Box, Card, CardContent, Chip, Divider, Fade, List, ListItem, Stack, Typography,} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LuggageIcon from "@mui/icons-material/Luggage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShieldIcon from "@mui/icons-material/Shield";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {calculateTotalPrice} from "../../../redux/slices/bookingSlice";
import {ANIMATION_DELAYS, CARD_STYLES, SPACING,} from "../../../types/summary.constants";
import FlightIcon from "@mui/icons-material/Flight";

interface BookingSummaryBoxProps {
    title?: string;
}

const CLASS_ICONS: Record<string, JSX.Element> = {
    economy: <FlightIcon sx={{ color: "#6c757d" }} fontSize="small" />,
    premium: (
        <AirlineSeatReclineExtraIcon sx={{ color: "#1976d2" }} fontSize="small" />
    ),
    business: (
        <WorkspacePremiumIcon sx={{ color: "#b8860b" }} fontSize="small" />
    ),
    first: <EmojiEventsIcon sx={{ color: "#6a1b9a" }} fontSize="small" />,
};

const EXTRA_ICONS = {
    meals: <RestaurantIcon fontSize="small"/>,
    baggageInsurance: <ShieldIcon fontSize="small"/>,
    checkedBaggage: <LuggageIcon fontSize="small"/>,
    assistance: <CheckIcon fontSize="small" color="info"/>,
    seat: <EventSeatIcon fontSize="small" color="secondary"/>,
} as const;

const formatClass = (className?: string) =>
    className ? className.charAt(0).toUpperCase() + className.slice(1) : "";

const BookingSummaryBox: React.FC<BookingSummaryBoxProps> = ({
                                                                 title = "Booking Summary",
                                                             }) => {
    const dispatch = useAppDispatch();
    const {data} = useAppSelector((state) => state.booking);

    const {search, outboundFlight, returnFlight, passengers, assistance, totalPrice} = data;

    const passengerExtrasAggregated = useMemo(() => {
        const aggregated = {
            checkedBaggage: 0,
            meals: 0,
            baggageInsurance: 0,
        };

        passengers.forEach((passenger) => {
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

    const totalSeatCosts = useMemo(
        () =>
            passengers.reduce(
                (total, passenger) => total + (passenger.seat?.price || 0),
                0
            ),
        [passengers]
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
                    width: "100%",
                    maxWidth: CARD_STYLES.MAX_WIDTH,
                    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                }}
            >
                <CardContent sx={{p: CARD_STYLES.PADDING}}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight={700}
                        textAlign="center"
                    >
                        {title}
                    </Typography>

                    <List disablePadding>
                        {/* Outbound Flight */}
                        {outboundFlight && (
                            <Fade in timeout={ANIMATION_DELAYS.OUTBOUND_FLIGHT}>
                                <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                    <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                        {CLASS_ICONS[outboundFlight.selectedClass?.toLowerCase() || "economy"]}
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
                                        {CLASS_ICONS[returnFlight.selectedClass?.toLowerCase() || "economy"]}
                                        <Typography variant="body2">
                                            Return | {formatClass(returnFlight.selectedClass)} x{search.passengerCount}
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

                        {/* Extras Section */}
                        {(assistance || totalSeatCosts > 0 || passengerExtrasAggregated.checkedBaggage > 0 || passengerExtrasAggregated.meals > 0 || passengerExtrasAggregated.baggageInsurance > 0) && (
                            <>
                                <Divider sx={{my: SPACING.DIVIDER_Y}}/>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Extras
                                </Typography>
                            </>
                        )}

                        {/* Assistance */}
                        {assistance && (
                            <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                    {EXTRA_ICONS.assistance}
                                    <Typography variant="body2">
                                        Assistance: {formatClass(assistance.type)}
                                    </Typography>
                                </Stack>
                                <Chip label={`€${assistance.price}`} size="small" color="info"/>
                            </ListItem>
                        )}

                        {/* Seat Selection */}
                        {totalSeatCosts > 0 && (
                            <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                    {EXTRA_ICONS.seat}
                                    <Typography variant="body2">
                                        Seat Selection ({passengers.filter((p) => p.seat?.price).length} seats)
                                    </Typography>
                                </Stack>
                                <Chip label={`€${totalSeatCosts}`} size="small" color="secondary"/>
                            </ListItem>
                        )}

                        {/* Checked Baggage */}
                        {passengerExtrasAggregated.checkedBaggage > 0 && (
                            <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                    {EXTRA_ICONS.checkedBaggage}
                                    <Typography variant="body2">
                                        Checked Baggage
                                        ({passengers.filter((p) => p.extras?.checkedBaggage?.selected).length} bags)
                                    </Typography>
                                </Stack>
                                <Chip label={`€${passengerExtrasAggregated.checkedBaggage}`} size="small" color="info"/>
                            </ListItem>
                        )}

                        {/* Meals */}
                        {passengerExtrasAggregated.meals > 0 && (
                            <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                    {EXTRA_ICONS.meals}
                                    <Typography variant="body2">
                                        Meals ({passengers.filter((p) => p.extras?.meals?.selected).length} meals)
                                    </Typography>
                                </Stack>
                                <Chip label={`€${passengerExtrasAggregated.meals}`} size="small" color="info"/>
                            </ListItem>
                        )}

                        {/* Baggage Insurance */}
                        {passengerExtrasAggregated.baggageInsurance > 0 && (
                            <ListItem sx={{py: SPACING.LIST_ITEM_Y, px: 0}}>
                                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                                    {EXTRA_ICONS.baggageInsurance}
                                    <Typography variant="body2">
                                        Baggage Insurance
                                        ({passengers.filter((p) => p.extras?.baggageInsurance?.selected).length} policies)
                                    </Typography>
                                </Stack>
                                <Chip label={`€${passengerExtrasAggregated.baggageInsurance}`} size="small"
                                      color="warning"/>
                            </ListItem>
                        )}

                        {/* Total */}
                        <Divider sx={{my: SPACING.DIVIDER_Y}}/>
                        <Fade in timeout={ANIMATION_DELAYS.TOTAL_SECTION}>
                            <ListItem sx={{py: SPACING.TOTAL_ITEM_Y, justifyContent: "space-between"}}>
                                <Typography variant="body1" fontWeight={600}>
                                    Total
                                </Typography>
                                <Typography variant="h5" color="primary" fontWeight={700}>
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
