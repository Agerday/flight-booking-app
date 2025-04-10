import React, {useEffect, useRef} from 'react';
import {Box, Button, Card, CardContent, Chip, Divider, Stack, Typography,} from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckIcon from '@mui/icons-material/Check';
import {FormProvider, useForm} from 'react-hook-form';
import {useBookingForm} from '../../context/BookingFormContext';
import {assistanceTiers} from '../../app/constants/extraTiers';
import ToggleCard from "../../components/layout/ToggleCard/ToggledCard";

const ExtrasForm = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();

    const methods = useForm({
        defaultValues: {
            assistance: formData.extras.assistance || '',
            checkedBaggage: formData.extras.checkedBaggage || false,
            baggageWeight: formData.extras.baggageWeight || '',
            meals: formData.extras.meals || false,
            baggageInsurance: formData.extras.baggageInsurance || false,
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

    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    useEffect(() => {
        const subscription = watch((data) => {
            updateForm('extras', {...data});
        });
        return () => subscription.unsubscribe();
    }, [watch, updateForm]);

    const selectedTier = watched.assistance || 'normal';

    return (
        <FormProvider {...methods}>
            <Box sx={{mt: 4}}>
                <Typography variant="h5" align="center" gutterBottom>
                    ✨ Upgrade Your Support Level
                </Typography>
                <Typography variant="body2" align="center" mb={3}>
                    Choose the level of assistance for your trip. Premium tiers come with exclusive benefits.
                </Typography>

                {/* Assistance Tiers */}
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
                                        onClick={() => setValue('assistance', tier.id, {shouldValidate: true})}
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
                        {/*Checked Baggage*/}
                        <ToggleCard
                            icon="🧳"
                            title="Checked Baggage"
                            description="Bring more with you by choosing your baggage weight."
                            price={watched.baggageWeight || '20'}
                            color="info"
                            isSelected={watched.checkedBaggage}
                            pulseTrigger={watched.checkedBaggage && !last.current.checkedBaggage}
                            onToggle={() => {
                                const toggled = !watched.checkedBaggage;
                                setValue('checkedBaggage', toggled);
                                if (!toggled) setValue('baggageWeight', '');
                                last.current.checkedBaggage = toggled;
                            }}
                            dropdownLabel="Select your baggage weight:"
                            dropdownOptions={[
                                {value: '20', label: '20kg', price: 20},
                                {value: '25', label: '25kg', price: 25},
                                {value: '30', label: '30kg', price: 30},
                            ]}
                            dropdownValue={watched.baggageWeight}
                            onDropdownChange={(e) => setValue('baggageWeight', e.target.value)}
                        />

                        {/*Meal*/}
                        <ToggleCard
                            icon="🍽️"
                            title="Meal"
                            description="Enjoy a hot meal on board. Vegetarian and vegan options available."
                            price={12}
                            color="secondary"
                            isSelected={watched.meals}
                            pulseTrigger={watched.meals && !last.current.meals}
                            onToggle={() => {
                                const toggled = !watched.meals;
                                setValue('meals', toggled);
                                last.current.meals = toggled;
                            }}></ToggleCard>

                        {/*Baggage Insurance*/}
                        <ToggleCard
                            icon="🛡️"
                            title="Baggage Insurance"
                            description="Protect your baggage up to €1000 from loss or damage."
                            price={8}
                            color="warning"
                            isSelected={watched.baggageInsurance}
                            pulseTrigger={watched.baggageInsurance && !last.current.baggageInsurance}
                            onToggle={() => {
                                const toggled = !watched.baggageInsurance;
                                setValue('baggageInsurance', toggled);
                                last.current.baggageInsurance = toggled;
                            }}
                        />
                    </Stack>
                </Box>
            </Box>
        </FormProvider>
    );
};

export default ExtrasForm;
