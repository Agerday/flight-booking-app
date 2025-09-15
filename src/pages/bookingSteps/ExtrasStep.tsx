import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Box, Button, Card, CardContent, Chip, Divider, Paper, Stack, Typography,} from '@mui/material';
import {Check, FlashOn, Luggage, Restaurant, Security,} from '@mui/icons-material';

import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {calculateTotalPrice, setStepValid, updateAssistance, updatePassenger} from '@/redux/slices/bookingSlice';
import {useStepper} from '../../hooks/useStepper';
import {BookingStep, GlobalAssistance, PassengerExtras} from '@/types/booking.types';
import {assistanceTiers, extrasPricing} from '@/types/constants';

import FrostedCard from '../../components/layout/FrostedCard/FrostedCard';
import PassengerNavigation from '../../components/booking/PassengerNavigation/PassengerNavigation';
import ToggleCard from '../../components/layout/ToggleCard/ToggledCard';

const ExtrasStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const {data: bookingData} = useAppSelector((state) => state.booking);

    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    const {passengers, assistance: globalAssistance, search} = bookingData;
    const passengerCount = search.passengerCount;
    const currentPassenger = passengers[activePassengerIndex];

    useEffect(() => {
        setCanGoNext(true);
        dispatch(setStepValid({step: BookingStep.EXTRAS, isValid: true}));
    }, [setCanGoNext, dispatch]);

    useEffect(() => {
        dispatch(calculateTotalPrice());
    }, [dispatch, globalAssistance, passengers]);

    const handleSelectAssistance = useCallback((tierId: string) => {
        const tier = assistanceTiers.find(t => t.id === tierId);
        if (!tier) return;

        const assistance: GlobalAssistance = {
            type: tier.id as GlobalAssistance['type'],
            price: tier.price
        };
        dispatch(updateAssistance(assistance));
    }, [dispatch]);

    const updateCurrentPassengerExtras = useCallback((extras: Partial<PassengerExtras>) => {
        if (!currentPassenger) return;

        const updatedExtras: PassengerExtras = {
            ...currentPassenger.extras,
            ...extras
        };

        dispatch(updatePassenger({
            index: activePassengerIndex,
            passenger: {extras: updatedExtras}
        }));
    }, [dispatch, activePassengerIndex, currentPassenger]);

    const handleToggleBaggage = useCallback(() => {
        const current = currentPassenger?.extras?.checkedBaggage;
        const wasSelected = current?.selected || false;

        if (wasSelected) {
            updateCurrentPassengerExtras({
                checkedBaggage: undefined
            });
        } else {
            const defaultWeight = '20';
            updateCurrentPassengerExtras({
                checkedBaggage: {
                    selected: true,
                    weight: defaultWeight,
                    price: extrasPricing.checkedBaggage.weights[defaultWeight]
                }
            });
        }
    }, [currentPassenger, updateCurrentPassengerExtras]);

    const handleChangeBaggageWeight = useCallback((weight: string) => {
        const price = extrasPricing.checkedBaggage.weights[weight as keyof typeof extrasPricing.checkedBaggage.weights];
        updateCurrentPassengerExtras({
            checkedBaggage: {
                selected: true,
                weight,
                price
            }
        });
    }, [updateCurrentPassengerExtras]);

    const handleToggleMeals = useCallback(() => {
        const current = currentPassenger?.extras?.meals;
        const wasSelected = current?.selected || false;

        updateCurrentPassengerExtras({
            meals: wasSelected
                ? undefined
                : {selected: true, price: extrasPricing.meals}
        });
    }, [currentPassenger, updateCurrentPassengerExtras]);

    const handleToggleInsurance = useCallback(() => {
        const current = currentPassenger?.extras?.baggageInsurance;
        const wasSelected = current?.selected || false;

        updateCurrentPassengerExtras({
            baggageInsurance: wasSelected
                ? undefined
                : {selected: true, price: extrasPricing.baggageInsurance}
        });
    }, [currentPassenger, updateCurrentPassengerExtras]);

    if (!currentPassenger) {
        return (
            <Box sx={{textAlign: 'center', p: 4}}>
                <Alert severity="error">
                    No passenger information found. Please complete passenger details first.
                </Alert>
            </Box>
        );
    }

    const currentExtras = currentPassenger.extras || {};

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight={600}>
                ✨ Enhance Your Journey
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Optional extras to make your trip more comfortable
            </Typography>
            <Divider sx={{my: 3}}/>

            {/* Global Assistance */}
            <FrostedCard sx={{mb: 4}}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                    🎯 Support Level
                </Typography>

                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                    {assistanceTiers.map((tier) => {
                        const isSelected = globalAssistance?.type === tier.id;

                        return (
                            <Card
                                key={tier.id}
                                sx={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    border: 2,
                                    borderColor: isSelected ? `${tier.color}.main` : 'divider',
                                    transition: 'all 0.2s',
                                    '&:hover': {transform: 'translateY(-2px)'}
                                }}
                                onClick={() => handleSelectAssistance(tier.id)}
                            >
                                <CardContent>
                                    <Stack spacing={2} alignItems="center">
                                        <Box sx={{textAlign: 'center'}}>
                                            <Typography variant="h6">{tier.name}</Typography>
                                            <Typography variant="h4" color="primary">
                                                €{tier.price}
                                            </Typography>
                                            <Chip
                                                label="Popular"
                                                color="success"
                                                size="small"
                                                icon={<FlashOn/>}
                                            />
                                        </Box>

                                        <Stack spacing={0.5} sx={{width: '100%'}}>
                                            {tier.features.slice(0, 3).map((feature, idx) => (
                                                <Box key={idx} sx={{display: 'flex', gap: 1}}>
                                                    <Check fontSize="small" color="success"/>
                                                    <Typography variant="body2">{feature}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>

                                        <Button
                                            fullWidth
                                            variant={isSelected ? 'contained' : 'outlined'}
                                            color={tier.color as any}
                                        >
                                            {isSelected ? 'Selected' : 'Select'}
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            </FrostedCard>

            {/* Per-Passenger Extras */}
            <FrostedCard>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" fontWeight={600}>
                        🎒 Passenger Extras
                    </Typography>
                    {passengerCount > 1 && (
                        <Typography variant="body2" color="text.secondary">
                            {currentPassenger.firstName} {currentPassenger.lastName}
                            ({activePassengerIndex + 1}/{passengerCount})
                        </Typography>
                    )}
                </Box>

                <Stack spacing={2}>
                    <ToggleCard
                        icon={<Luggage/>}
                        title="Checked Baggage"
                        description="Add extra luggage"
                        price={currentExtras.checkedBaggage?.price || 0}
                        isSelected={currentExtras.checkedBaggage?.selected || false}
                        onToggle={handleToggleBaggage}
                        color="info"
                        dropdownLabel="Weight"
                        dropdownOptions={Object.entries(extrasPricing.checkedBaggage.weights).map(([weight, price]) => ({
                            value: weight,
                            label: `${weight}kg - €${price}`,
                            price
                        }))}
                        dropdownValue={currentExtras.checkedBaggage?.weight || '20'}
                        onDropdownChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | any) =>
                            handleChangeBaggageWeight(e.target ? e.target.value : e)
                        }
                    />

                    <ToggleCard
                        icon={<Restaurant/>}
                        title="In-Flight Meal"
                        description="Enjoy a delicious meal"
                        price={extrasPricing.meals}
                        isSelected={currentExtras.meals?.selected || false}
                        onToggle={handleToggleMeals}
                        color="secondary"
                    />

                    <ToggleCard
                        icon={<Security/>}
                        title="Baggage Insurance"
                        description="Protect your belongings"
                        price={extrasPricing.baggageInsurance}
                        isSelected={currentExtras.baggageInsurance?.selected || false}
                        onToggle={handleToggleInsurance}
                        color="warning"
                    />
                </Stack>

                {passengerCount > 1 && (
                    <Box sx={{mt: 3}}>
                        <PassengerNavigation
                            activeIndex={activePassengerIndex}
                            maxIndex={passengerCount}
                            onNext={() => setActivePassengerIndex(Math.min(activePassengerIndex + 1, passengerCount - 1))}
                            onPrev={() => setActivePassengerIndex(Math.max(activePassengerIndex - 1, 0))}
                        />
                    </Box>
                )}
            </FrostedCard>

            {/* Summary */}
            {(globalAssistance || Object.keys(currentExtras).length > 0) && (
                <Paper sx={{mt: 3, p: 2, bgcolor: 'primary.50'}}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Selected Extras
                    </Typography>
                    <Stack spacing={0.5}>
                        {globalAssistance && (
                            <Typography variant="body2">
                                • {assistanceTiers.find(t => t.id === globalAssistance.type)?.name} Support:
                                €{globalAssistance.price}
                            </Typography>
                        )}
                        {currentExtras.checkedBaggage?.selected && (
                            <Typography variant="body2">
                                • Baggage ({currentExtras.checkedBaggage.weight}kg):
                                €{currentExtras.checkedBaggage.price}
                            </Typography>
                        )}
                        {currentExtras.meals?.selected && (
                            <Typography variant="body2">
                                • Meal: €{currentExtras.meals.price}
                            </Typography>
                        )}
                        {currentExtras.baggageInsurance?.selected && (
                            <Typography variant="body2">
                                • Insurance: €{currentExtras.baggageInsurance.price}
                            </Typography>
                        )}
                    </Stack>
                </Paper>
            )}
        </Box>
    );
};

export default ExtrasStep;