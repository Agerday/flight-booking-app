import React, {useEffect} from 'react';
import {
    Button,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Select,
    Stack,
    Typography,
    Box,
} from '@mui/material';
import {keyframes} from '@emotion/react';

const pulse = keyframes`
    0% {
        box-shadow: 0 0 0px rgba(0, 0, 0, 0);
    }
    50% {
        box-shadow: 0 0 12px rgba(0, 200, 255, 0.5);
    }
    100% {
        box-shadow: 0 0 0px rgba(0, 0, 0, 0);
    }
`;

const ToggleCard = ({
                        icon,
                        title,
                        description,
                        price,
                        color = 'primary',
                        isSelected,
                        onToggle,
                        pulseTrigger,
                        dropdownOptions,
                        dropdownValue,
                        onDropdownChange,
                        dropdownLabel,
                    }) => {
    useEffect(() => {
        if (isSelected && dropdownOptions?.length > 0 && !dropdownValue) {
            onDropdownChange({target: {value: dropdownOptions[0].value}});
        }
    }, [isSelected, dropdownOptions, dropdownValue, onDropdownChange]);

    return (
        <Card
            sx={{
                borderRadius: 3,
                width: 280,
                minHeight: 320,
                border: isSelected ? `2px solid` : '1px solid #ccc',
                borderColor: isSelected ? `${color}.main` : '#ccc',
                boxShadow: isSelected ? 5 : 1,
                animation: pulseTrigger ? `${pulse} 0.5s ease` : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <CardContent sx={{flexGrow: 1}}>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6">
                            {icon} {title}
                        </Typography>
                        <Chip label={`€${price}`} size="small" color={color}/>
                    </Stack>

                    <Typography variant="body2" fontWeight={500}>
                        {description}
                    </Typography>

                    {isSelected && dropdownOptions?.length > 0 && (
                        <Box>
                            {dropdownLabel && (
                                <Typography
                                    variant="caption"
                                    sx={{fontStyle: 'italic', display: 'block', mt: 1}}
                                >
                                    {dropdownLabel}
                                </Typography>
                            )}
                            <Select
                                value={dropdownValue}
                                onChange={onDropdownChange}
                                fullWidth
                                size="small"
                                variant="outlined"
                            >
                                {dropdownOptions.map(({value, label, price}) => (
                                    <MenuItem key={value} value={value}>
                                        {label} – €{price}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    )}
                </Stack>
            </CardContent>

            <Box sx={{px: 2, pb: 2}}>
                <Button
                    onClick={onToggle}
                    fullWidth
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={color}
                    size="small"
                >
                    {isSelected ? 'Selected' : 'Select'}
                </Button>
            </Box>
        </Card>
    );
};

export default ToggleCard;
