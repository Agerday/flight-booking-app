import React, {useEffect, useRef} from 'react';
import {Box, Button, Card, CardContent, Chip, Divider, Stack, Typography,} from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckIcon from '@mui/icons-material/Check';
import {FormProvider, useForm} from 'react-hook-form';
import {useBookingForm} from '../../context/BookingFormContext';
import {assistanceTiers} from '../../app/constants/extraTiers';
import {extrasPricing} from '../../app/constants/extrasPricing';
import ToggleCard from '../../components/layout/ToggleCard/ToggledCard';

const ExtrasStep = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();
    const methods = useForm({
        defaultValues: {
            ...formData.extras,
        },
        mode: 'onChange',
    });
    const {watch, setValue, formState: {isValid}} = methods;
    const watched = watch();
    const last = useRef({
        checkedBaggage: false,
        meals: false,
        baggageInsurance: false,
    });
    const selectedTier = watched.assistance?.type || 'normal';

    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    useEffect(() => {
        const subscription = watch(data => {
            updateForm('extras', {
                ...formData.extras,
                ...data
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, formData.extras, updateForm]);

    return (
        <FormProvider {...methods}>
            <Box sx={{mt: 4}}>
                <Typography variant="h5" align="center" gutterBottom>
                    ✨ Upgrade Your Support Level
                </Typography>
                <Typography variant="body2" align="center" mb={3}>
                    Choose the level of assistance for your trip. Premium tiers come with exclusive benefits.
                </Typography>

                <Stack direction={{xs: 'column', md: 'row'}} spacing={2} justifyContent="center">
                    {assistanceTiers.map((tier) => {
                        const isSelected = selectedTier === tier.id;
                        return (
                            <Card
                                key={tier.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    border: isSelected ? `2px solid` : '1px solid #ccc',
                                    borderColor: isSelected ? `${tier.color}.main` : '#ccc',
                                    boxShadow: isSelected ? 5 : 1,
                                    minWidth: 250,
                                    maxWidth: 300,
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
                            <CardContent sx={{flex: 1}}>
                                    <Stack spacing={1} alignItems="center">
                                        <Typography variant="h6">{tier.name}</Typography>
                                        <Typography variant="subtitle1" fontWeight={500}>
                                            €{tier.price}
                                        </Typography>
                                        {tier.popular && (
                                            <Chip
                                                label="Most Popular (Actual Scam)"
                                                color="success"
                                                size="small"
                                                icon={<FlashOnIcon/>}
                                                sx={{mt: 1}}
                                            />
                                        )}
                                        <Divider sx={{width: '100%', my: 1}}/>
                                        {tier.features.map((feature, i) => (
                                            <Stack
                                                key={i}
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                width="100%"
                                            >
                                                <CheckIcon fontSize="small" color="success"/>
                                                <Typography variant="body2">{feature}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </CardContent>

                                <Box sx={{p: 2}}>
                                    <Button
                                        onClick={() => {
                                            const current = watched.assistance;
                                            if (current?.type !== tier.id || current?.price !== tier.price) {
                                                setValue('assistance', {
                                                    type: tier.id,
                                                    price: tier.price,
                                                }, { shouldValidate: true });
                                            }
                                        }}
                                        variant={isSelected ? 'contained' : 'outlined'}
                                        color={tier.color === 'default' ? 'primary' : tier.color}
                                        fullWidth
                                    >
                                        {isSelected ? 'Selected' : 'Select'}
                                    </Button>
                                </Box>
                            </Card>
                        );
                    })}
                </Stack>

                {/* Extras Section */}
                <Box mt={5}>
                    <Typography variant="h6" gutterBottom textAlign="center">
                        ✈️ Additional Options
                    </Typography>

                    <Stack direction={{xs: 'column', md: 'row'}} spacing={2} justifyContent="center" mt={2}>
                        {/* Checked Baggage */}
                        <ToggleCard
                            icon="🧳"
                            title="Checked Baggage"
                            description="Bring more with you by choosing your baggage weight."
                            price={extrasPricing.checkedBaggage.weights[watched.checkedBaggage?.weight || extrasPricing.checkedBaggage.defaultWeight]}
                            color="info"
                            isSelected={watched.checkedBaggage?.selected === true}
                            pulseTrigger={watched.checkedBaggage?.selected && !last.current.checkedBaggage}
                            onToggle={() => {
                                const toggled = !watched.checkedBaggage?.selected;
                                const weight = toggled
                                    ? watched.checkedBaggage?.weight || extrasPricing.checkedBaggage.defaultWeight
                                    : '';
                                const price = toggled ? extrasPricing.checkedBaggage.weights[weight] : 0;
                                setValue('checkedBaggage', {selected: toggled, weight, price}, {shouldValidate: true});
                                last.current.checkedBaggage = toggled;
                            }}
                            dropdownLabel="Select your baggage weight:"
                            dropdownOptions={Object.entries(extrasPricing.checkedBaggage.weights).map(([val, price]) => ({
                                value: val,
                                label: `${val}kg`,
                                price,
                            }))}
                            dropdownValue={watched.checkedBaggage?.weight || extrasPricing.checkedBaggage.defaultWeight}
                            onDropdownChange={(e) => {
                                const weight = e.target.value;
                                const price = extrasPricing.checkedBaggage.weights[weight];
                                setValue('checkedBaggage', {
                                    ...watched.checkedBaggage,
                                    weight,
                                    price,
                                }, {shouldValidate: true});
                            }}
                        />

                        {/* Meal */}
                        <ToggleCard
                            icon="🍽️"
                            title="Meal"
                            description="Enjoy a hot meal on board. Vegetarian and vegan options available."
                            price={extrasPricing.meals}
                            color="secondary"
                            isSelected={watched.meals?.selected === true}
                            pulseTrigger={watched.meals?.selected && !last.current.meals}
                            onToggle={() => {
                                const toggled = !watched.meals?.selected;
                                const price = toggled ? extrasPricing.meals : 0;
                                setValue('meals', {selected: toggled, price}, {shouldValidate: true});
                                last.current.meals = toggled;
                            }}
                        />

                        {/* Baggage Insurance */}
                        <ToggleCard
                            icon="🛡️"
                            title="Baggage Insurance"
                            description="Protect your baggage up to €1000 from loss or damage."
                            price={extrasPricing.baggageInsurance}
                            color="warning"
                            isSelected={watched.baggageInsurance?.selected === true}
                            pulseTrigger={watched.baggageInsurance?.selected && !last.current.baggageInsurance}
                            onToggle={() => {
                                const toggled = !watched.baggageInsurance?.selected;
                                const price = toggled ? extrasPricing.baggageInsurance : 0;
                                setValue('baggageInsurance', {selected: toggled, price}, {shouldValidate: true});
                                last.current.baggageInsurance = toggled;
                            }}
                        />
                    </Stack>
                </Box>
            </Box>
        </FormProvider>
    );
};

export default ExtrasStep;
