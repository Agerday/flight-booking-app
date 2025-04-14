import React from 'react';
import { InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const FormInput = ({
                       name,
                       label,
                       placeholder,
                       icon,
                       type = 'text',
                       validators = [],
                       isSelect = false,
                       options = [],
                       showAutofillWarning = false,
                       extraWarning = ''
                   }) => {
    const { control } = useFormContext();

    const buildValidationRules = () => {
        if (!validators.length) return {};
        return {
            validate: (value) => {
                for (const validator of validators) {
                    const result = validator(value);
                    if (result !== true) return result;
                }
                return true;
            }
        };
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={buildValidationRules()}
            render={({ field, fieldState }) => (
                <>
                    <>
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            fullWidth
                            label={label}
                            placeholder={placeholder}
                            type={type}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || ''}
                            select={isSelect}
                            InputProps={{
                                startAdornment: icon ? (
                                    <InputAdornment position="start">{icon}</InputAdornment>
                                ) : null,
                            }}
                        >
                            {isSelect &&
                                options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                        </TextField>

                        {showAutofillWarning && extraWarning && !fieldState.error && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'warning.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 0.5,
                                    ml: 1,
                                }}
                            >
                                <WarningAmberIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {extraWarning}
                            </Typography>
                        )}
                    </>
                </>
            )}
        />
    );
};

export default FormInput;
