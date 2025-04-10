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
    Grid,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useForm, FormProvider } from 'react-hook-form';
import { useBookingForm } from '../../context/BookingFormContext';
import { assistanceTiers } from '../../app/constants/extraTiers';

const ExtrasForm = () => {
    const { formData, updateForm, updateStepValidity, currentStep } = useBookingForm();

    const methods = useForm({
        defaultValues: {
            assistance: formData.extras.assistance || '',
            checkedBaggage: formData.extras.checkedBaggage || false,
            meals: formData.extras.meals || false,
            insurance: formData.extras.insurance || '',
            baggageInsurance: formData.extras.baggageInsurance || false,
            baggageWeight: formData.extras.baggageWeight || '',
        },
        mode: 'onChange',
    });

    const { watch, setValue, formState: { isValid } } = methods;

    const watched = watch();

    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    // ✅ Sync extras to global formData only on change (no loop)
    useEffect(() => {
        const subscription = watch((data) => {
            updateForm('extras', { ...data });
        });
        return () => subscription.unsubscribe();
    }, [watch, updateForm]);

    const selectedTier = watched.assistance || 'normal';

    return (
        <FormProvider {...methods}>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    ✨ Upgrade Your Support Level
                </Typography>
                <Typography variant="body2" align="center" mb={3}>
                    Choose the level of assistance for your trip. Premium tiers come with exclusive benefits.
                </Typography>

                {/* Assistance Cards */}
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
                                                label="Most Popular (Actual Scam)"
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

                {/* Extras Section */}
                <Box mt={5}>
                    <Typography variant="h6" gutterBottom textAlign="center">
                        ✈️ Additional Options
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {/* Checked Baggage */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={watched.checkedBaggage}
                                            onChange={(e) => setValue('checkedBaggage', e.target.checked)}
                                        />
                                    }
                                    label={
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography>Add Checked Baggage</Typography>
                                            <Chip label="From €20" size="small" variant="outlined" color="info" />
                                        </Stack>
                                    }
                                />
                                {watched.checkedBaggage && (
                                    <select
                                        value={watched.baggageWeight}
                                        onChange={(e) => setValue('baggageWeight', e.target.value)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid #ccc',
                                            maxWidth: '200px',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        <option value="">Select weight</option>
                                        <option value="20">20kg – €20</option>
                                        <option value="25">25kg – €25</option>
                                        <option value="30">30kg – €30</option>
                                    </select>
                                )}
                            </Stack>
                        </Grid>

                        {/* Meals */}
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={watched.meals}
                                        onChange={(e) => setValue('meals', e.target.checked)}
                                    />
                                }
                                label={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography>Add Meals</Typography>
                                        <Chip
                                            label="€12"
                                            icon={<span role="img" aria-label="meal">🍽️</span>}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    </Stack>
                                }
                            />
                            {watched.meals && (
                                <Typography variant="caption" sx={{ ml: 4, fontStyle: 'italic' }}>
                                    Includes vegetarian and vegan options.
                                </Typography>
                            )}
                        </Grid>

                        {/* Baggage Insurance */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={watched.baggageInsurance}
                                        onChange={(e) => setValue('baggageInsurance', e.target.checked)}
                                    />
                                }
                                label={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography>Baggage Insurance</Typography>
                                        <Chip
                                            label="€8"
                                            icon={<span role="img" aria-label="shield">🛡️</span>}
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                        />
                                    </Stack>
                                }
                            />
                            {watched.baggageInsurance && (
                                <Typography variant="caption" sx={{ ml: 4, fontStyle: 'italic' }}>
                                    Covers up to €1000 for lost/damaged luggage.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </FormProvider>
    );
};

export default ExtrasForm;
