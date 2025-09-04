import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography, Grid, Alert } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckIcon from '@mui/icons-material/Check';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateAssistance, updatePassenger, setStepValid, calculateTotalPrice } from '../../redux/slices/bookingSlice';
import { useStepper } from '../../hooks/useStepper';
import { BookingStep, type GlobalAssistance, type Passenger, type PassengerExtras } from '../../types';
import { assistanceTiers, extrasPricing } from '../../types/constants';

import PassengerNavigation from '../../components/booking/PassengerNavigation/PassengerNavigation';
import ToggleCard from '../../components/layout/ToggleCard/ToggledCard';

//
// Types
//
export type AssistanceType = 'normal' | 'gold' | 'premium';

interface ExtrasFormData {
    assistance?: GlobalAssistance;
    checkedBaggage?: PassengerExtras['checkedBaggage'];
    meals?: PassengerExtras['meals'];
    baggageInsurance?: PassengerExtras['baggageInsurance'];
}

interface ExtrasState {
    currentPassenger: Passenger;
    passengerCount: number;
    activePassengerIndex: number;
}

//
// Schema
//
const extrasSchema = z.object({
    assistance: z.object({
        type: z.enum(['normal', 'gold', 'premium']),
        price: z.number(),
    }).optional(),
    checkedBaggage: z.object({
        selected: z.boolean(),
        weight: z.string(),
        price: z.number(),
    }).optional(),
    meals: z.object({
        selected: z.boolean(),
        price: z.number(),
    }).optional(),
    baggageInsurance: z.object({
        selected: z.boolean(),
        price: z.number(),
    }).optional(),
});

//
// Custom hooks
//
const useExtrasState = (bookingData: any, activePassengerIndex: number): ExtrasState => {
    return useMemo(() => ({
        currentPassenger: bookingData.passengers[activePassengerIndex],
        passengerCount: bookingData.search.passengerCount,
        activePassengerIndex,
    }), [bookingData.passengers, bookingData.search.passengerCount, activePassengerIndex]);
};

const useFormSync = (methods: any, extrasState: ExtrasState, assistance: GlobalAssistance | null) => {
    useEffect(() => {
        if (!extrasState.currentPassenger) return;

        methods.setValue('assistance', assistance || undefined);
        methods.setValue('checkedBaggage', extrasState.currentPassenger.extras?.checkedBaggage || undefined);
        methods.setValue('meals', extrasState.currentPassenger.extras?.meals || undefined);
        methods.setValue('baggageInsurance', extrasState.currentPassenger.extras?.baggageInsurance || undefined);
    }, [methods, extrasState.currentPassenger, assistance]);
};

const useReduxSync = (watch: any, dispatch: any, activePassengerIndex: number) => {
    useEffect(() => {
        const subscription = watch((data: ExtrasFormData) => {
            // Update global assistance
            if (data.assistance?.type && typeof data.assistance.price === 'number') {
                dispatch(updateAssistance(data.assistance));
            }

            // Update passenger extras
            const passengerExtras: PassengerExtras = {
                checkedBaggage: data.checkedBaggage,
                meals: data.meals,
                baggageInsurance: data.baggageInsurance,
            };

            dispatch(updatePassenger({
                index: activePassengerIndex,
                passenger: { extras: passengerExtras },
            }));

            dispatch(calculateTotalPrice());
        });

        return () => subscription.unsubscribe();
    }, [watch, dispatch, activePassengerIndex]);
};

//
// Component
//
const ExtrasStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const { setCanGoNext } = useStepper();
    const { data: bookingData } = useAppSelector((state) => state.booking);

    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const lastSelection = useRef({ checkedBaggage: false, meals: false, baggageInsurance: false });

    const extrasState = useExtrasState(bookingData, activePassengerIndex);

    const methods = useForm<ExtrasFormData>({
        resolver: zodResolver(extrasSchema),
        defaultValues: {
            assistance: bookingData.assistance || undefined,
            checkedBaggage: undefined,
            meals: undefined,
            baggageInsurance: undefined,
        },
        mode: 'onChange',
    });

    const { watch, setValue } = methods;
    const watchedData = watch();

    useFormSync(methods, extrasState, bookingData.assistance);
    useReduxSync(watch, dispatch, activePassengerIndex);

    // Update stepper state
    useEffect(() => {
        const canProceed = true; // extras are optional
        setCanGoNext(canProceed);
        dispatch(setStepValid({ step: BookingStep.EXTRAS, isValid: canProceed }));
    }, [setCanGoNext, dispatch]);

    //
    // Handlers
    //
    const handleTierSelect = useCallback((tierId: AssistanceType, tierPrice: number) => {
        setValue('assistance', { type: tierId, price: tierPrice }, { shouldValidate: true });
    }, [setValue]);

    const handleBaggageToggle = useCallback(() => {
        const toggled = !watchedData.checkedBaggage?.selected;
        const weight = toggled
            ? watchedData.checkedBaggage?.weight || extrasPricing.checkedBaggage.defaultWeight
            : extrasPricing.checkedBaggage.defaultWeight;
        const price = toggled
            ? extrasPricing.checkedBaggage.weights[weight as keyof typeof extrasPricing.checkedBaggage.weights]
            : 0;

        setValue('checkedBaggage', { selected: toggled, weight, price }, { shouldValidate: true });
        lastSelection.current.checkedBaggage = toggled;
    }, [setValue, watchedData.checkedBaggage]);

    const handleBaggageWeightChange = useCallback((value: string) => {
        const price = extrasPricing.checkedBaggage.weights[value as keyof typeof extrasPricing.checkedBaggage.weights];

        setValue('checkedBaggage', {
            selected: watchedData.checkedBaggage?.selected || false,
            weight: value,
            price,
        }, { shouldValidate: true });
    }, [setValue, watchedData.checkedBaggage]);

    const handleMealsToggle = useCallback(() => {
        const toggled = !watchedData.meals?.selected;
        const price = toggled ? extrasPricing.meals : 0;

        setValue('meals', { selected: toggled, price }, { shouldValidate: true });
        lastSelection.current.meals = toggled;
    }, [setValue, watchedData.meals]);

    const handleInsuranceToggle = useCallback(() => {
        const toggled = !watchedData.baggageInsurance?.selected;
        const price = toggled ? extrasPricing.baggageInsurance : 0;

        setValue('baggageInsurance', { selected: toggled, price }, { shouldValidate: true });
        lastSelection.current.baggageInsurance = toggled;
    }, [setValue, watchedData.baggageInsurance]);

    const handleNavigation = useCallback((direction: 'next' | 'prev') => {
        setActivePassengerIndex(prev =>
            direction === 'next' && prev < extrasState.passengerCount - 1 ? prev + 1 :
                direction === 'prev' && prev > 0 ? prev - 1 : prev
        );
    }, [extrasState.passengerCount]);

    //
    // Early return
    //
    if (extrasState.passengerCount <= 0 || !extrasState.currentPassenger) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Alert severity="error">
                    No passenger information found. Please go back and enter passenger details.
                </Alert>
            </Box>
        );
    }

    //
    // Render
    //
    const selectedTier = watchedData.assistance?.type || 'normal';

    return (
        <FormProvider {...methods}>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                    Upgrade Your Support Level
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    Choose the level of assistance for your trip. Premium tiers come with exclusive benefits.
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    {assistanceTiers.map((tier) => {
                        const isSelected = selectedTier === tier.id;

                        return (
                            <Grid key={tier.id} size={4}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        border: isSelected ? '2px solid' : '1px solid #ccc',
                                        borderColor: isSelected ? `${tier.color}.main` : '#ccc',
                                        boxShadow: isSelected ? 5 : 1,
                                        minHeight: 300,
                                        borderRadius: 3,
                                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                        },
                                        ...(tier.id === 'premium' && !isSelected && {
                                            animation: 'blingBling 1.2s ease-in-out infinite',
                                        }),
                                        '@keyframes blingBling': {
                                            '0%': { boxShadow: '0 0 0px rgba(255, 215, 0, 0.0)' },
                                            '50%': { boxShadow: '0 0 10px 3px rgba(255, 215, 0, 0.6)' },
                                            '100%': { boxShadow: '0 0 0px rgba(255, 215, 0, 0.0)' },
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flex: 1 }}>
                                        <Stack spacing={1} alignItems="center">
                                            <Typography variant="h6">{tier.name}</Typography>
                                            <Typography variant="subtitle1" fontWeight={500}>
                                                €{tier.price}
                                            </Typography>
                                            {(
                                                <Chip
                                                    label="Most Popular"
                                                    color="success"
                                                    size="small"
                                                    icon={<FlashOnIcon />}
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                            <Divider sx={{ width: '100%', my: 1 }} />
                                            {tier.features.map((feature, index) => (
                                                <Stack key={index} direction="row" spacing={1} alignItems="center" width="100%">
                                                    <CheckIcon fontSize="small" color="success" />
                                                    <Typography variant="body2">{feature}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </CardContent>

                                    <Box sx={{ p: 2 }}>
                                        <Button
                                            onClick={() => handleTierSelect(tier.id as AssistanceType, tier.price)}
                                            variant={isSelected ? 'contained' : 'outlined'}
                                            color={tier.color === 'default' ? 'primary' : (tier.color as any)}
                                            fullWidth
                                        >
                                            {isSelected ? 'Selected' : 'Select'}
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Typography variant="h5" textAlign="center" sx={{ mt: 5, mb: 3 }} fontWeight={500}>
                    Additional Options
                </Typography>

                <Typography variant="h6" textAlign="center" color="text.secondary" gutterBottom>
                    Passenger {activePassengerIndex + 1} of {extrasState.passengerCount}
                    <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                        ({extrasState.currentPassenger.firstName} {extrasState.currentPassenger.lastName})
                    </Typography>
                </Typography>

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid size={4}>
                        <ToggleCard
                            icon="🧳"
                            title="Checked Baggage"
                            description="Bring more with you by choosing your baggage weight."
                            price={extrasPricing.checkedBaggage.weights[watchedData.checkedBaggage?.weight as keyof typeof extrasPricing.checkedBaggage.weights || extrasPricing.checkedBaggage.defaultWeight]}
                            color="info"
                            isSelected={watchedData.checkedBaggage?.selected === true}
                            pulseTrigger={watchedData.checkedBaggage?.selected && !lastSelection.current.checkedBaggage}
                            onToggle={handleBaggageToggle}
                            dropdownLabel="Select your baggage weight:"
                            dropdownOptions={Object.entries(extrasPricing.checkedBaggage.weights).map(([weight, price]) => ({
                                value: weight,
                                label: `${weight}kg`,
                                price,
                            }))}
                            dropdownValue={watchedData.checkedBaggage?.weight || extrasPricing.checkedBaggage.defaultWeight}
                            onDropdownChange={handleBaggageWeightChange}
                        />
                    </Grid>

                    <Grid size={4}>
                        <ToggleCard
                            icon="🍽️"
                            title="Meal"
                            description="Enjoy a hot meal on board. Vegetarian and vegan options available."
                            price={extrasPricing.meals}
                            color="secondary"
                            isSelected={watchedData.meals?.selected === true}
                            pulseTrigger={watchedData.meals?.selected && !lastSelection.current.meals}
                            onToggle={handleMealsToggle}
                        />
                    </Grid>

                    <Grid size={4}>
                        <ToggleCard
                            icon="🛡️"
                            title="Baggage Insurance"
                            description="Protect your baggage up to €1000 from loss or damage."
                            price={extrasPricing.baggageInsurance}
                            color="warning"
                            isSelected={watchedData.baggageInsurance?.selected === true}
                            pulseTrigger={watchedData.baggageInsurance?.selected && !lastSelection.current.baggageInsurance}
                            onToggle={handleInsuranceToggle}
                        />
                    </Grid>
                </Grid>

                {extrasState.passengerCount > 1 && (
                    <Box sx={{ mt: 4 }}>
                        <PassengerNavigation
                            activeIndex={activePassengerIndex}
                            maxIndex={extrasState.passengerCount}
                            onNext={() => handleNavigation('next')}
                            onPrev={() => handleNavigation('prev')}
                        />
                    </Box>
                )}
            </Box>
        </FormProvider>
    );
};

export default ExtrasStep;
