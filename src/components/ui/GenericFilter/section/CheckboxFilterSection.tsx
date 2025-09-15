import React from 'react';
import {Box, Checkbox, Chip, FormControlLabel, FormGroup, Typography,} from '@mui/material';
import {CheckboxFilter, FilterValue} from '@/types/filter.types';

interface CheckboxFilterSectionProps {
    filter: CheckboxFilter;
    value: FilterValue[];
    onChange: (value: FilterValue[]) => void;
    dense?: boolean;
}

const CheckboxFilterSection: React.FC<CheckboxFilterSectionProps> = ({
                                                                         filter,
                                                                         value = [],
                                                                         onChange,
                                                                         dense = false,
                                                                     }) => {
    const handleToggle = (optionValue: FilterValue) => {
        const currentValues = Array.isArray(value) ? value : [];
        const updated = currentValues.includes(optionValue)
            ? currentValues.filter(v => v !== optionValue)
            : [...currentValues, optionValue];
        onChange(updated);
    };

    return (
        <Box>
            {filter.label && (
                <Typography variant={dense ? 'body2' : 'subtitle2'} fontWeight={500} sx={{mb: 1}}>
                    {filter.label}
                </Typography>
            )}
            <FormGroup>
                {filter.options.map(option => (
                    <FormControlLabel
                        key={String(option.value)}
                        control={
                            <Checkbox
                                checked={value.includes(option.value)}
                                onChange={() => handleToggle(option.value)}
                                size={dense ? 'small' : 'medium'}
                                disabled={option.disabled}
                                sx={{color: option.color}}
                            />
                        }
                        label={
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                opacity: option.disabled ? 0.5 : 1,
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                    {option.icon}
                                    <Typography variant={dense ? 'caption' : 'body2'}>
                                        {option.label}
                                    </Typography>
                                </Box>
                                {option.count !== undefined && (
                                    <Chip
                                        label={option.count}
                                        size="small"
                                        variant="outlined"
                                        sx={{height: dense ? 18 : 20, minWidth: 28}}
                                    />
                                )}
                            </Box>
                        }
                        sx={{
                            width: '100%',
                            mr: 0,
                            mb: dense ? 0.5 : 1,
                            '& .MuiFormControlLabel-label': {
                                flexGrow: 1,
                                ml: 1,
                            }
                        }}
                    />
                ))}
            </FormGroup>
        </Box>
    );
};

export default CheckboxFilterSection;