import React, {useEffect, useMemo} from "react";
import {
    Container,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import {CalendarMonth, FlightLand, FlightTakeoff, People} from "@mui/icons-material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Controller, useForm} from "react-hook-form";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {isSameDay} from "date-fns";
import {zodResolver} from "@hookform/resolvers/zod";

import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {setStepValid, updateSearchData} from "../../redux/slices/bookingSlice";
import {FlightSearchFormData, flightSearchSchema} from "../../schemas/flightSearchSchema";
import {getAvailableDepartureDates, getFilteredLocations} from "../../utils/flightSearch.utils";
import {FormInput} from "../../components/ui/FormInput/FormInput";
import {mockFlights} from "../../data/mockFlights";
import {BookingStep, TripType} from "../../types";
import {useStepper} from "../../hooks/useStepper";

const FlightSearchStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const bookingData = useAppSelector((state) => state.booking.data);

    const {
        control,
        setValue,
        watch,
        formState: {isValid},
    } = useForm<FlightSearchFormData>({
        resolver: zodResolver(flightSearchSchema),
        defaultValues: {
            origin: bookingData.search.origin || "",
            destination: bookingData.search.destination || "",
            departure: bookingData.search.departureDate
                ? new Date(bookingData.search.departureDate)
                : new Date(),
            returnDate: bookingData.search.returnDate
                ? new Date(bookingData.search.returnDate)
                : undefined,
            tripType: bookingData.search.tripType ?? TripType.ONE_WAY,
            passengerNumber: bookingData.search.passengerCount || 1,
        },
        mode: "onChange",
    });

    const {origin, destination, departure, tripType} = watch();

    const {origins, destinations} = useMemo(
        () => getFilteredLocations(mockFlights, origin, destination),
        [origin, destination]
    );

    const availableDates = useMemo(
        () => getAvailableDepartureDates(mockFlights, origin, destination),
        [origin, destination]
    );

    const canSelectDepartureDate = (date: Date): boolean => {
        if (!origin || !destination) return false;
        return availableDates.some((d) => isSameDay(d, date));
    };

    const canSelectReturnDate = (date: Date): boolean => {
        if (!departure || !origin || !destination) return false;

        const dayAfterDeparture = new Date(departure);
        dayAfterDeparture.setDate(departure.getDate() + 1);
        if (date < dayAfterDeparture) return false;

        const returnFlights = getAvailableDepartureDates(mockFlights, destination, origin);
        return returnFlights.some((d) => isSameDay(d, date));
    };

    useEffect(() => {
        setCanGoNext(isValid);
        dispatch(setStepValid({step: BookingStep.SEARCH, isValid}));
    }, [isValid, setCanGoNext, dispatch]);

    useEffect(() => {
        const subscription = watch((data) => {
            dispatch(
                updateSearchData({
                    origin: data.origin || "",
                    destination: data.destination || "",
                    departureDate: data.departure ? data.departure.toISOString() : new Date().toISOString(),
                    returnDate: data.returnDate ? data.returnDate.toISOString() : undefined,
                    tripType: (data.tripType as TripType) ?? TripType.ONE_WAY,
                    passengerCount: data.passengerNumber || 1,
                })
            );
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    const handleSwapLocations = () => {
        setValue("origin", destination);
        setValue("destination", origin);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom fontWeight={600} sx={{mb: 4}}>
                Find Your Dream Destination
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={3}>
                    {/* ORIGIN + SWAP + DESTINATION section */}
                    <Grid size={12}>
                        <Grid container spacing={2} sx={{alignItems: "center"}}>
                            {/* Origin select */}
                            <Grid size={5}>
                                <FormInput
                                    name="origin"
                                    control={control}
                                    label="From *"
                                    icon={<FlightTakeoff/>}
                                    isSelect
                                    options={origins}
                                />
                            </Grid>

                            {/* Swap origin/destination button */}
                            <Grid size={2} sx={{textAlign: "center"}}>
                                <IconButton
                                    onClick={handleSwapLocations}
                                    size="large"
                                    sx={{
                                        bgcolor: "primary.light",
                                        color: "primary.contrastText",
                                        "&:hover": {
                                            bgcolor: "primary.main",
                                        },
                                    }}
                                >
                                    <SwapHorizIcon/>
                                </IconButton>
                            </Grid>

                            {/* Destination select */}
                            <Grid size={5}>
                                <FormInput
                                    name="destination"
                                    control={control}
                                    label="To *"
                                    icon={<FlightLand/>}
                                    isSelect
                                    options={destinations}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Trip type */}
                    <Grid size={12} sx={{justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                            Trip Type
                        </Typography>
                        <RadioGroup
                            value={tripType}
                            onChange={(e) =>
                                setValue("tripType", e.target.value as TripType, {
                                    shouldValidate: true,
                                })
                            }
                            row
                            sx={{gap: 3}}
                        >
                            <FormControlLabel
                                value={TripType.ONE_WAY}
                                control={<Radio/>}
                                label="One-way"
                            />
                            <FormControlLabel
                                value={TripType.RETURN}
                                control={<Radio/>}
                                label="Return"
                            />
                        </RadioGroup>
                    </Grid>

                    {/* Departure / Return dates */}
                    <Grid size={12}>
                        <Grid container spacing={2}>
                            {/* Departure date */}
                            <Grid size={6}>
                                <Controller
                                    name="departure"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <DatePicker
                                            label="Departure Date *"
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={!origin || !destination}
                                            shouldDisableDate={(date) => !canSelectDepartureDate(date)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message,
                                                    InputProps: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CalendarMonth/>
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Return date */}
                            {tripType === TripType.RETURN && (
                                <Grid size={6}>
                                    <Controller
                                        name="returnDate"
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <DatePicker
                                                label="Return Date *"
                                                value={field.value || null}
                                                onChange={field.onChange}
                                                disabled={!origin || !destination}
                                                shouldDisableDate={(date) => !canSelectReturnDate(date)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!fieldState.error,
                                                        helperText: fieldState.error?.message,
                                                        InputProps: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CalendarMonth/>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {/* Passenger count */}
                    <Grid size={6}>
                        <FormInput
                            name="passengerNumber"
                            control={control}
                            label="Passengers *"
                            type="number"
                            icon={<People/>}
                            min={1}
                            max={9}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </Container>
    );
};

export default FlightSearchStep;
