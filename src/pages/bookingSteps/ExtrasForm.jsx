import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Divider,
    Chip,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useBookingForm } from '../../context/BookingFormContext';
import { assistanceTiers } from '../../app/constants/extraTiers';
import { useForm, FormProvider } from 'react-hook-form';

const ExtrasForm = () => {
    const { formData, updateForm, updateStepValidity, currentStep } = useBookingForm();

    const methods = useForm({
        defaultValues: {
            assistance: formData.extras.assistance || '',
            checkedBaggage: formData.extras.checkedBaggage || false,
            meals: formData.extras.meals || false,
            insurance: formData.extras.insurance || '',
            baggageInsurance: formData.extras.baggageInsurance || false,
        },
        mode: 'onChange',
    });

    const { watch, setValue, formState: { isValid } } = methods;
    const watchAll = watch();

    useEffect(() => {
        updateForm('extras', { ...watchAll });
    }, [watchAll, updateForm]);

    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    const selectedTier = watchAll.assistance || 'normal';

    return (
        <FormProvider {...methods}>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    ✨ Upgrade Your Support Level
                </Typography>
                <Typography variant="body2" align="center" mb={3}>
                    Choose the level of assistance for your trip. Premium tiers come with exclusive benefits.
                </Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="center">
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
                                    position: 'relative',
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent sx={{ flex: 1 }}>
                                    <Stack spacing={1} alignItems="center">
                                        <Typography variant="h6">{tier.name}</Typography>
                                        <Typography variant="subtitle1" fontWeight={500}>
                                            €{tier.price}
                                        </Typography>
                                        {tier.popular && (
                                            <Chip
                                                label="Most Popular"
                                                color="success"
                                                size="small"
                                                icon={<FlashOnIcon />}
                                                sx={{ mt: 1 }}
                                            />
                                        )}
                                        <Divider sx={{ width: '100%', my: 1 }} />
                                        {tier.features.map((feature, i) => (
                                            <Stack
                                                key={i}
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                width="100%"
                                            >
                                                <CheckIcon fontSize="small" color="success" />
                                                <Typography variant="body2">{feature}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </CardContent>

                                <Box sx={{ p: 2 }}>
                                    <Button
                                        onClick={() => setValue('assistance', tier.id, { shouldValidate: true })}
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

                {/* Other Extras */}
                <Box mt={5}>
                    <Typography variant="h6" gutterBottom textAlign="center">
                        ✈️ Additional Options
                    </Typography>
                    <FormGroup row sx={{ justifyContent: 'center' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={watchAll.checkedBaggage}
                                    onChange={(e) => setValue('checkedBaggage', e.target.checked)}
                                />
                            }
                            label="Add Checked Baggage"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={watchAll.meals}
                                    onChange={(e) => setValue('meals', e.target.checked)}
                                />
                            }
                            label="Add Meals"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={watchAll.baggageInsurance}
                                    onChange={(e) => setValue('baggageInsurance', e.target.checked)}
                                />
                            }
                            label="Baggage Insurance"
                        />
                    </FormGroup>
                </Box>
            </Box>
        </FormProvider>
    );
};

export default ExtrasForm;
