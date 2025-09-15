import {Box, FormControlLabel, Radio, RadioGroup, Typography} from "@mui/material";
import {FilterValue, RadioFilter} from "@/types/filter.types";
import React from "react";


interface RadioFilterSectionProps {
    filter: RadioFilter;
    value: FilterValue;
    onChange: (value: FilterValue) => void;
    dense?: boolean;
}

const RadioFilterSection: React.FC<RadioFilterSectionProps> = ({
                                                                   filter,
                                                                   value,
                                                                   onChange,
                                                                   dense = false,
                                                               }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const option = filter.options.find(o => String(o.value) === newValue);
        onChange(option?.value || newValue);
    };

    return (
        <Box>
            {filter.label && (
                <Typography variant={dense ? 'body2' : 'subtitle2'} fontWeight={500} sx={{mb: 1}}>
                    {filter.label}
                </Typography>
            )}
            <RadioGroup
                value={String(value || '')}
                onChange={handleChange}
            >
                {filter.options.map(option => (
                    <FormControlLabel
                        key={String(option.value)}
                        value={String(option.value)}
                        control={
                            <Radio
                                size={dense ? 'small' : 'medium'}
                                disabled={option.disabled}
                                sx={{color: option.color}}
                            />
                        }
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                {option.icon}
                                <Typography variant={dense ? 'caption' : 'body2'}>
                                    {option.label}
                                </Typography>
                            </Box>
                        }
                        sx={{mb: dense ? 0.5 : 1}}
                    />
                ))}
            </RadioGroup>
        </Box>
    );
};

export default RadioFilterSection;