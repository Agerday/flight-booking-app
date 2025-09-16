import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography} from '@mui/material';
import {Check, FlashOn, Luggage, Restaurant, Security} from '@mui/icons-material';

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
    const { setCanGoNext } = useStepper();
    const { data: bookingData } = useAppSelector(state => state.booking);

    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const { passengers, assistance: globalAssistance, search } = bookingData;
    const passengerCount = search.passengerCount;
    const currentPassenger = passengers[activePassengerIndex];

    // Step validation
    useEffect(() => {
        setCanGoNext(true);
        dispatch(setStepValid({ step: BookingStep.EXTRAS, isValid: true }));
    }, [setCanGoNext, dispatch]);

    // Recalculate total price
    useEffect(() => {
        dispatch(calculateTotalPrice());
    }, [dispatch, globalAssistance, passengers]);

    // Assistance selection
    const handleSelectAssistance = useCallback(
        (tierId: string) => {
            const tier = assistanceTiers.find(t => t.id === tierId);
            if (!tier) return;
            dispatch(updateAssistance({ type: tier.id as GlobalAssistance['type'], price: tier.price }));
        },
        [dispatch]
    );

    // Update current passenger extras
    const updateCurrentPassengerExtras = useCallback(
        (extras: Partial<PassengerExtras>) => {
            if (!currentPassenger) return;
            dispatch(updatePassenger({ index: activePassengerIndex, passenger: { extras: { ...currentPassenger.extras, ...extras } } }));
        },
        [dispatch, activePassengerIndex, currentPassenger]
    );

    // Toggle extras
    const handleToggleBaggage = useCallback(() => {
        const selected = currentPassenger?.extras?.checkedBaggage?.selected;
        if (selected) updateCurrentPassengerExtras({ checkedBaggage: undefined });
        else {
            const defaultWeight = '20';
            updateCurrentPassengerExtras({
                checkedBaggage: { selected: true, weight: defaultWeight, price: extrasPricing.checkedBaggage.weights[defaultWeight] },
            });
        }
    }, [currentPassenger, updateCurrentPassengerExtras]);

    const handleChangeBaggageWeight = useCallback(
        (weight: string) => {
            const price = extrasPricing.checkedBaggage.weights[weight as keyof typeof extrasPricing.checkedBaggage.weights];
            updateCurrentPassengerExtras({ checkedBaggage: { selected: true, weight, price } });
        },
        [updateCurrentPassengerExtras]
    );

    const handleToggleMeals = useCallback(() => {
        const selected = currentPassenger?.extras?.meals?.selected;
        updateCurrentPassengerExtras({ meals: selected ? undefined : { selected: true, price: extrasPricing.meals } });
    }, [currentPassenger, updateCurrentPassengerExtras]);

    const handleToggleInsurance = useCallback(() => {
        const selected = currentPassenger?.extras?.baggageInsurance?.selected;
        updateCurrentPassengerExtras({ baggageInsurance: selected ? undefined : { selected: true, price: extrasPricing.baggageInsurance } });
    }, [currentPassenger, updateCurrentPassengerExtras]);

    if (!currentPassenger)
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Alert severity="error">No passenger information found. Please complete passenger details first.</Alert>
            </Box>
        );

    const currentExtras = currentPassenger.extras || {};

    return (
        <Box>
            {/* Header */}
            <Typography variant="h4" gutterBottom fontWeight={600}>
                ✨ Enhance Your Journey
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Optional extras to make your trip more comfortable
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Global Assistance */}
            <FrostedCard sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                    🎯 Support Level
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {assistanceTiers.map(tier => {
                        const isSelected = globalAssistance?.type === tier.id;
                        return (
                            <Card
                                key={tier.id}
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    minHeight: 260,
                                    borderRadius: 3,
                                    border: 0,
                                    background: isSelected ? `linear-gradient(145deg, ${tier.color}.light, ${tier.color}.main)` : 'background.paper',
                                    boxShadow: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 10,
                                        background: `linear-gradient(145deg, ${tier.color}.light, ${tier.color}.main)`,
                                    },
                                }}
                                onClick={() => handleSelectAssistance(tier.id)}
                            >
                                <CardContent>
                                    <Stack spacing={2} alignItems="center">
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" fontWeight={700}>
                                                {tier.name}
                                            </Typography>
                                            <Typography variant="h4" color="primary" fontWeight={700}>
                                                €{tier.price}
                                            </Typography>
                                            {tier.popular && (
                                                <Chip
                                                    label="Best choice ! (Actual scam)"
                                                    color="success"
                                                    size="small"
                                                    icon={<FlashOn />}
                                                    sx={{ mt: 1, fontWeight: 600 }}
                                                />
                                            )}
                                        </Box>
                                        <Stack spacing={1} sx={{ width: '100%' }}>
                                            {tier.features.slice(0, 3).map((feature, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Check fontSize="small" color="success" />
                                                    <Typography variant="body2">{feature}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                                <Box sx={{ p: 2 }}>
                                    <Button
                                        fullWidth
                                        variant={isSelected ? 'contained' : 'outlined'}
                                        color={tier.color as any}
                                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 600 }}
                                    >
                                        {isSelected ? 'Selected' : 'Select'}
                                    </Button>
                                </Box>
                            </Card>
                        );
                    })}
                </Stack>
            </FrostedCard>

            {/* Passenger Extras */}
            <FrostedCard>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight={600}>
                        🎒 Passenger Extras
                    </Typography>
                    {passengerCount > 1 && (
                        <Typography variant="body2" color="text.secondary">
                            {currentPassenger.firstName} {currentPassenger.lastName} ({activePassengerIndex + 1}/{passengerCount})
                        </Typography>
                    )}
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {[
                        {
                            icon: <Luggage fontSize="large" color="info" />,
                            title: 'Checked Baggage',
                            description: 'Add extra luggage',
                            price: currentExtras.checkedBaggage?.price || 0,
                            isSelected: currentExtras.checkedBaggage?.selected,
                            onToggle: handleToggleBaggage,
                            dropdownLabel: 'Weight',
                            dropdownOptions: Object.entries(extrasPricing.checkedBaggage.weights).map(([w, p]) => ({
                                value: w,
                                label: `${w}kg - €${p}`,
                                price: p,
                            })),
                            dropdownValue: currentExtras.checkedBaggage?.weight || '20',
                            onDropdownChange: (e: any) => handleChangeBaggageWeight(e.target ? e.target.value : e),
                            color: 'info',
                        },
                        {
                            icon: <Restaurant fontSize="large" color="secondary" />,
                            title: 'In-Flight Meal',
                            description: 'Enjoy a delicious meal',
                            price: extrasPricing.meals,
                            isSelected: currentExtras.meals?.selected,
                            onToggle: handleToggleMeals,
                            color: 'secondary',
                        },
                        {
                            icon: <Security fontSize="large" color="warning" />,
                            title: 'Baggage Insurance',
                            description: 'Protect your belongings',
                            price: extrasPricing.baggageInsurance,
                            isSelected: currentExtras.baggageInsurance?.selected,
                            onToggle: handleToggleInsurance,
                            color: 'warning',
                        },
                    ].map((extra, idx) => (
                        <ToggleCard
                            key={idx}
                            {...extra}
                            sx={{
                                flex: 1,
                                minHeight: 260,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderRadius: 3,
                                boxShadow: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 },
                            }}
                        />
                    ))}
                </Stack>

                {passengerCount > 1 && (
                    <Box sx={{ mt: 3 }}>
                        <PassengerNavigation
                            activeIndex={activePassengerIndex}
                            maxIndex={passengerCount}
                            onNext={() => setActivePassengerIndex(Math.min(activePassengerIndex + 1, passengerCount - 1))}
                            onPrev={() => setActivePassengerIndex(Math.max(activePassengerIndex - 1, 0))}
                        />
                    </Box>
                )}
            </FrostedCard>
        </Box>
    );
};

export default ExtrasStep;