import React from 'react';
import {useTheme} from '@mui/material/styles';
import BookingStepper from '../BookingStepper/BookingStepper';
import BookingSummaryBox from '../../components/booking/BookingSummary/BookingSummary';
import {useBookingForm} from '../../context/BookingFormContext';

const BookingPage = () => {
    const { formData } = useBookingForm();
    const theme = useTheme();

    const hasSummary = !!formData.flight?.id;

    return (
        <div
            style={{
                ...theme.backgrounds.beachCover,
                minHeight: '100vh',
                padding: '2rem',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                    maxWidth: '1200px',
                    gap: '1.5rem',
                    transform: hasSummary ? 'translateX(12rem)' : 'none',
                    transition: 'transform 0.3s ease',
                }}
            >
                {/* Stepper */}
                <div style={{ flexGrow: 1 }}>
                    <BookingStepper />
                </div>

                {/* Summary */}
                {hasSummary && (
                    <div
                        style={{
                            width: '250px',
                            minWidth: '250px',
                            position: 'sticky',
                            top: 40,
                            flexShrink: 0,
                        }}
                    >
                        <BookingSummaryBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
