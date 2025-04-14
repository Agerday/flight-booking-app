import React, {useEffect, useMemo} from 'react';
import {Container, FormControlLabel, Grid, IconButton, Radio, RadioGroup, Typography} from '@mui/material';
import {FlightLand, FlightTakeoff, People} from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FormInput from '../../components/ui/FormInput/FormInput';
import {useBookingForm} from '../../context/BookingFormContext';
import {searchFormSchema} from '../../app/validationSchemas/searchFormSchema';
import {getAvailableDepartureDates, getFilteredLocations} from '../../app/utils/flightUtils';
import mockFlights from '../../data/mockFlights';
import {required} from '../../app/utils/validators';
import { isSameDay } from 'date-fns';


const SearchFlightStep = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();
    const methods = useForm({
        defaultValues: {
            ...formData.initialInfos
        },
        mode: 'onChange',
    });

    const {
        control, setValue, watch,
        formState: {isValid}
    } = methods;
    const {origin, destination, departure, tripType} = watch();

    const {
        from: fromList,
        to: toList
    } = useMemo(() => getFilteredLocations(mockFlights, origin, destination), [origin, destination]);

    const originOptions = fromList.map(label => ({label, value: label}));
    const destinationOptions = toList.map(label => ({label, value: label}));
    const availableDates = useMemo(() =>
            getAvailableDepartureDates(mockFlights, origin, destination),
        [origin, destination]
    );
    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    useEffect(() => {
        const subscription = watch(data => {
            updateForm('initialInfos', {
                ...formData.initialInfos,
                ...data
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, formData.initialInfos, updateForm]);

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom fontWeight={600}>
                ✈️ Find Your Dream Destination
            </Typography>

            <FormProvider {...methods}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>

                        {/*First Row*/}
                        <Grid size={3.5}>
                            <FormInput
                                name="origin"
                                label="From *"
                                icon={<FlightTakeoff/>}
                                isSelect
                                validators={searchFormSchema.origin}
                                options={originOptions}
                            />
                        </Grid>

                        <Grid size={1} sx={{alignSelf: 'center', textAlign: 'center'}}>
                            <IconButton
                                aria-label="swap"
                                onClick={() => {
                                    setValue('origin', destination);
                                    setValue('destination', origin);
                                }}
                            >
                                <SwapHorizIcon/>
                            </IconButton>
                        </Grid>

                        <Grid size={3.5}>
                            <FormInput
                                name="destination"
                                label="To *"
                                icon={<FlightLand/>}
                                isSelect
                                validators={searchFormSchema.destination}
                                options={destinationOptions}
                            />
                        </Grid>

                        <Grid size={4} sx={{alignSelf: 'center', textAlign: 'center'}}>
                            <RadioGroup
                                row
                                value={tripType}
                                onChange={(e) => setValue('tripType', e.target.value)}
                            >
                                <FormControlLabel value="oneway" control={<Radio/>} label="One-way"/>
                                <FormControlLabel value="return" control={<Radio/>} label="Return"/>
                            </RadioGroup>
                        </Grid>

                        {/*Second Row*/}
                        <Grid size={4}>
                            <Controller
                                name="departure"
                                control={control}
                                rules={{validate: required}}
                                render={({field, fieldState}) => (
                                    <DatePicker
                                        label="Departure Date *"
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={!origin || !destination}
                                        shouldDisableDate={(date) =>
                                            origin && destination && !availableDates.some((d) => isSameDay(d, date))
                                        }
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!fieldState.error,
                                                helperText: fieldState.error?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {tripType === 'return' && (
                            <Grid size={4}>
                                <Controller
                                    name="returnDate"
                                    control={control}
                                    rules={{validate: searchFormSchema.returnDate({tripType})[0]}}
                                    render={({field, fieldState}) => (
                                        <DatePicker
                                            label="Return Date *"
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={!origin || !destination}
                                            shouldDisableDate={(date) => !departure || new Date(date) <= new Date(departure)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        {/*Third Row*/}
                        <Grid size={4}>
                            <FormInput
                                name="passengers"
                                label="Passengers *"
                                type="number"
                                icon={<People/>}
                                validators={searchFormSchema.passengers}
                                inputProps={{min: 0}}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </FormProvider>
        </Container>
    );
};

export default SearchFlightStep;
