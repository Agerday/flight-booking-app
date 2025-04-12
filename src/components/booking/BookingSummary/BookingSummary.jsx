import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShieldIcon from '@mui/icons-material/Shield';
import { useBookingForm } from '../../../context/BookingFormContext';
import { generatePriceSummary } from '../../../app/utils/priceSummaryGenerator';

const iconMap = {
    meals: <RestaurantIcon fontSize="small" />,
    baggageInsurance: <ShieldIcon fontSize="small" />,
    checkedBaggage: <LuggageIcon fontSize="small" />,
    assistance: <CheckIcon fontSize="small" color="info" />,
    insurance: <ShieldIcon fontSize="small" color="warning" />,
    seat: <CheckIcon fontSize="small" color="secondary" />,
    flight: <CheckIcon fontSize="small" color="success" />,
};

const BookingSummaryBox = () => {
    const { formData } = useBookingForm();
    const itemList = generatePriceSummary(formData, { icons: iconMap });
    const total = itemList.reduce((sum, item) => sum + item.price, 0);

    return (
        <Box display="flex" justifyContent="center" width="100%" mt={2}>
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    width: '100%',
                    maxWidth: 280,
                    px: 1.5,
                    py: 1,
                }}
            >
                <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                        ✈️ Booking Summary
                    </Typography>
                    <List disablePadding>
                        {itemList.map(({ label, price, icon }) => (
                            <ListItem
                                key={label}
                                sx={{
                                    py: 0.75,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Box display="flex" alignItems="flex-start" gap={1} flex={1} mr={1}>
                                    {icon}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '0.85rem',
                                            lineHeight: 1.2,
                                            wordBreak: 'break-word',
                                            whiteSpace: 'normal',
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={`€${price}`}
                                    color="info"
                                    size="small"
                                    sx={{ fontSize: '0.75rem', height: 22 }}
                                />
                            </ListItem>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <ListItem sx={{ py: 1, justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={500}>
                                Total
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontSize: '1rem' }}>
                                €{total}
                            </Typography>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BookingSummaryBox;
