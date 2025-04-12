import React, {useEffect} from 'react';
import {Box, Card, CardContent, Chip, Divider, Grid, List, ListItem, ListItemText, Typography,} from '@mui/material';
import {useBookingForm} from '../../context/BookingFormContext';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShieldIcon from '@mui/icons-material/Shield';
import PaymentPage from '../PaymentPage/PaymentPage';
import {generatePriceSummary} from '../../app/utils/priceSummaryGenerator';
import {useStepNavigation} from "../../hooks/useStepNavigation";
import {BookingSteps} from "../../app/constants/bookingSteps";

const iconMap = {
    meals: <RestaurantIcon fontSize="small"/>,
    baggageInsurance: <ShieldIcon fontSize="small"/>,
    checkedBaggage: <LuggageIcon fontSize="small"/>,
    assistance: <CheckIcon fontSize="small" color="info"/>,
    insurance: <ShieldIcon fontSize="small" color="warning"/>,
    selectedSeat: <CheckIcon fontSize="small" color="secondary"/>,
    selectedOutboundFlight: <CheckIcon fontSize="small" color="success"/>,
};

const PaymentStep = () => {
    const {formData, updateStepValidity, currentStep, setCurrentStep} = useBookingForm();
    const itemList = generatePriceSummary(formData, {icons: iconMap});
    const total = itemList.reduce((sum, item) => sum + item.price, 0);
    const {next} = useStepNavigation(BookingSteps.PAYMENT, setCurrentStep);

    useEffect(() => {
        updateStepValidity(currentStep, true);
    }, [updateStepValidity, currentStep]);

    const customLabels = {
        selectedOutboundFlight: formData.selectedOutboundFlight
            ? `Flight: ${formData.selectedOutboundFlight.from} → ${formData.selectedOutboundFlight.to} (${formData.selectedOutboundFlight.selectedClass})`
            : 'Flight',

        selectedSeatInfo: formData.seating?.selectedSeat
            ? `Seat: ${formData.seating.selectedSeat.id} (${formData.seating.selectedSeat.class})`
            : 'Seat',
    };

    return (
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                    💳 Complete Your Payment
                </Typography>
                <Typography variant="body2" sx={{mb: 2}}>
                    You're almost there! Just one step away from takeoff.
                </Typography>
                <PaymentPage totalAmount={total} onSubmit={next} />
            </Grid>

            <Grid item xs={12} md={4}>
                <Box sx={{position: 'sticky', top: 32}}>
                    <Card sx={{borderRadius: 3, boxShadow: 4}}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                ✈️ Booking Summary
                            </Typography>
                            <List disablePadding>
                                {itemList.map(({label, price, icon}) => (
                                    <ListItem key={label} sx={{py: 1}}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    {icon}
                                                    <span>{customLabels[label] || label}</span>
                                                </Box>
                                            }
                                        />
                                        <Chip label={`€${price}`} color="info" size="small"/>
                                    </ListItem>
                                ))}
                                <Divider sx={{my: 1}}/>
                                <ListItem sx={{py: 1}}>
                                    <ListItemText primary="Total"/>
                                    <Typography variant="h6" color="primary">
                                        €{total}
                                    </Typography>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );
};

export default PaymentStep;
