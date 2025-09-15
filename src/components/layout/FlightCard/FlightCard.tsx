import React from 'react';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { flightClassThemes } from '@/types/constants';
import { Flight, FlightClass } from '@/types/booking.types';

interface FlightCardProps {
    flight: Flight;
    onSelect?: (selectedFlight: (Flight & { selectedClass: FlightClass; selectedPrice: number }) | null) => void;
    isSelected?: boolean;
    selectedClass?: FlightClass;
}

const FlightCard: React.FC<FlightCardProps> = ({
                                                   flight,
                                                   onSelect,
                                                   isSelected = false,
                                                   selectedClass,
                                               }) => {
    const logoPath = `/airline-logos/${flight.airline
        .toLowerCase()
        .replace(/\s+/g, '-')}.png`;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const calculateDuration = () => {
        const departure = new Date(flight.departureTime);
        const arrival = new Date(flight.arrivalTime);
        const diffMs = arrival.getTime() - departure.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <Card
            elevation={isSelected ? 6 : 2}
            sx={{
                position: 'relative',
                borderRadius: 2,
                border: isSelected ? '2px solid' : '1px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                overflow: 'visible',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {isSelected && (
                <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    label="SELECTED"
                    color="primary"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: '12px',
                        boxShadow: 1,
                        zIndex: 2,
                    }}
                />
            )}

            <CardContent sx={{ p: 2, flexGrow: 1 }}>
                {/* Header Section */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                            component="img"
                            src={logoPath}
                            alt={flight.airline}
                            sx={{ height: 24, width: 'auto' }}
                        />
                        <Typography variant="body1" fontWeight={600}>
                            {flight.airline}
                        </Typography>
                    </Stack>
                    <Chip
                        label={flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
                        size="small"
                        color={flight.stops === 0 ? 'success' : 'default'}
                        variant={flight.stops === 0 ? 'filled' : 'outlined'}
                    />
                </Stack>

                {/* Flight Details Section */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    {/* Departure */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.3 }}>
                            {formatTime(flight.departureTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {flight.from}
                        </Typography>
                    </Box>

                    {/* Flight Path */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            px: 1,
                        }}
                    >
                        <FlightTakeoffIcon sx={{ color: 'primary.main', fontSize: 20, mb: 0.3 }} />
                        <Box
                            sx={{
                                width: '100%',
                                height: 2,
                                backgroundColor: 'divider',
                                position: 'relative',
                                mb: 0.3,
                            }}
                        >
                            {flight.stops > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'text.secondary',
                                        border: '2px solid white',
                                    }}
                                />
                            )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            <AccessTimeIcon sx={{ fontSize: 11, verticalAlign: 'middle', mr: 0.3 }} />
                            {calculateDuration()}
                        </Typography>
                    </Box>

                    {/* Arrival */}
                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.3 }}>
                            {formatTime(flight.arrivalTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {flight.to}
                        </Typography>
                    </Box>
                </Stack>

                {/* Date */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(flight.departureTime)}
                    </Typography>
                </Stack>

                {/* Price Options */}
                <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    {Object.entries(flight.prices).map(([classType, price]) => {
                        const theme =
                            flightClassThemes[
                                classType as keyof typeof flightClassThemes
                                ];
                        const isThisClassSelected =
                            isSelected && selectedClass === classType;

                        return (
                            <Box
                                key={classType}
                                sx={{
                                    flex: 1,
                                    border: '1px solid',
                                    borderColor: isThisClassSelected ? 'primary.main' : 'divider',
                                    borderRadius: 1.5,
                                    p: 1,
                                    textAlign: 'center',
                                    backgroundColor: isThisClassSelected ? 'primary.light' : 'background.paper',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                {isThisClassSelected && (
                                    <CheckCircleIcon
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            color: 'primary.main',
                                            fontSize: 16,
                                            bgcolor: 'white',
                                            borderRadius: '50%',
                                        }}
                                    />
                                )}

                                <Chip
                                    label={theme.label}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        mb: 0.3,
                                        fontSize: '0.6rem',
                                        height: 18,
                                        borderColor: 'divider',
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    sx={{
                                        color: theme.color,
                                        mb: 0.3,
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {theme.emoji} {classType}
                                </Typography>

                                <Typography variant="subtitle1" fontWeight={700}>
                                    ${price.toFixed(2)}
                                </Typography>

                                <Button
                                    variant={isThisClassSelected ? "contained" : "outlined"}
                                    size="small"
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isThisClassSelected) {
                                            onSelect?.(null);
                                        } else {
                                            onSelect?.({
                                                ...flight,
                                                selectedClass: classType as FlightClass,
                                                selectedPrice: price,
                                            });
                                        }
                                    }}
                                    sx={{
                                        textTransform: "none",
                                        fontSize: "0.7rem",
                                        mt: 0.5,
                                    }}
                                >
                                    {isThisClassSelected ? "Unselect" : "Select"}
                                </Button>

                            </Box>
                        );
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default FlightCard;
