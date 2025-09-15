import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography,} from '@mui/material';
import {FilterValue, SelectFilter} from "@/types/filter.types";
import React from "react";

interface SelectFilterSectionProps {
    filter: SelectFilter;
    value: FilterValue | FilterValue[];
    onChange: (value: FilterValue | FilterValue[]) => void;
    dense?: boolean;
}

const SelectFilterSection: React.FC<SelectFilterSectionProps> = ({
                                                                     filter,
                                                                     value,
                                                                     onChange,
                                                                     dense = false,
                                                                 }) => {
    const handleChange = (event: any) => {
        const newValue = event.target.value;
        onChange(filter.multiple ? newValue : newValue);
    };

    const currentValue = filter.multiple
        ? (Array.isArray(value) ? value : [])
        : (value || '');

    return (
        <Box>
            <FormControl fullWidth size={dense ? 'small' : 'medium'}>
                <InputLabel>{filter.label}</InputLabel>
                <Select
                    multiple={filter.multiple}
                    value={currentValue}
                    onChange={handleChange}
                    input={<OutlinedInput label={filter.label}/>}
                    renderValue={filter.multiple ? (selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {(selected as FilterValue[]).map((value) => {
                                const option = filter.options.find(o => o.value === value);
                                return (
                                    <Chip
                                        key={String(value)}
                                        label={option?.label || String(value)}
                                        size="small"
                                    />
                                );
                            })}
                        </Box>
                    ) : undefined}
                >
                    {filter.placeholder && (
                        <MenuItem value="" disabled>
                            <em>{filter.placeholder}</em>
                        </MenuItem>
                    )}
                    {filter.options.map(option => (
                        <MenuItem
                            key={String(option.value)}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                {option.icon}
                                <Typography variant={dense ? 'caption' : 'body2'}>
                                    {option.label}
                                </Typography>
                                {option.count !== undefined && (
                                    <Chip
                                        label={option.count}
                                        size="small"
                                        variant="outlined"
                                        sx={{ml: 'auto'}}
                                    />
                                )}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default SelectFilterSection;