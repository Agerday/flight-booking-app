import React, {useEffect} from 'react';
import {Grid, Typography,} from '@mui/material';
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
    seat: <CheckIcon fontSize="small" color="secondary"/>,
    flight: <CheckIcon fontSize="small" color="success"/>,
};

const PaymentStep = () => {
    const {formData, updateStepValidity, currentStep, setCurrentStep} = useBookingForm();
    const itemList = generatePriceSummary(formData, {icons: iconMap});
    const total = itemList.reduce((sum, item) => sum + item.price, 0);
    const {next} = useStepNavigation(BookingSteps.PAYMENT, setCurrentStep);

    useEffect(() => {
        updateStepValidity(currentStep, true);
    }, [updateStepValidity, currentStep]);

    return (
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            <Grid size={6}>
                <Typography variant="h5" gutterBottom>
                    💳 Complete Your Payment
                </Typography>
                <Typography variant="body2" sx={{mb: 2}}>
                    You're almost there! Just one step away from takeoff.
                </Typography>
                <PaymentPage totalAmount={total} onSubmit={next}/>
            </Grid>
        </Grid>
    );
};

export default PaymentStep;
