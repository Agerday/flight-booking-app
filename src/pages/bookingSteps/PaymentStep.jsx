import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Divider,
} from '@mui/material';
import { useBookingForm } from '../../context/BookingFormContext';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShieldIcon from '@mui/icons-material/Shield';
import PaymentPage from "../../components/PaymentPage/PaymentPage";
import {enrichExtras} from "../../app/utils/enrichExtras";

const iconMap = {
    meals: <RestaurantIcon fontSize="small" />,
    baggageInsurance: <ShieldIcon fontSize="small" />,
    checkedBaggage: <LuggageIcon fontSize="small" />,
    assistance: <CheckIcon fontSize="small" color="info" />,
    insurance: <ShieldIcon fontSize="small" color="warning" />,
};

const PaymentStep = () => {
    const { formData, updateStepValidity, currentStep } = useBookingForm();
    const enrichedExtras = enrichExtras(formData.extras);

    const itemList = [];

    if (formData.selectedOutboundFlight?.selectedPrice) {
        const f = formData.selectedOutboundFlight;
        itemList.push({
            label: `Flight: ${f.from} → ${f.to} (${f.selectedClass})`,
            price: f.selectedPrice,
            icon: <CheckIcon fontSize="small" color="success" />,
        });
    }

    Object.entries(enrichedExtras).forEach(([key, val]) => {
        if (val?.price > 0) {
            const label = key === 'assistance'
                ? `Assistance Tier: ${val.type}`
                : key === 'checkedBaggage'
                    ? `Checked Baggage (${val.weight}kg)`
                    : key.charAt(0).toUpperCase() + key.slice(1);

            itemList.push({
                label,
                price: val.price,
                icon: iconMap[key] || <CheckIcon fontSize="small" color="success" />,
            });
        }
    });

    const total = itemList.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
        updateStepValidity(currentStep, true);
    }, [updateStepValidity, currentStep]);

    return (
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                    💳 Complete Your Payment
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    You're almost there! Just one step away from takeoff.
                </Typography>
                <PaymentPage totalAmount={total} />
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            ✈️ Booking Summary
                        </Typography>
                        <List disablePadding>
                            {itemList.map(({ label, price, icon }) => (
                                <ListItem key={label} sx={{ py: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {icon}
                                                <span>{label}</span>
                                            </Box>
                                        }
                                    />
                                    <Chip label={`€${price}`} color="info" size="small" />
                                </ListItem>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <ListItem sx={{ py: 1 }}>
                                <ListItemText primary="Total" />
                                <Typography variant="h6" color="primary">
                                    €{total}
                                </Typography>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PaymentStep;
