import React from 'react';
import {TextField, MenuItem, InputAdornment, Typography} from '@mui/material';
import {Controller, useFormContext} from 'react-hook-form';
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

    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: validators.length ? (value) =>
                    validators.map(v => v(value)).filter(Boolean)[0] : undefined }}
            render={({ field, fieldState }) => (
                <>
                    <TextField
                        {...field}
                        fullWidth
                        label={label}
                        placeholder={placeholder}
                        type={type}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        select={isSelect}
                        InputProps={{
                            startAdornment: icon ? (
                                <InputAdornment position="start">{icon}</InputAdornment>
                            ) : null
                        }}
                    >
                        {isSelect && options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {showAutofillWarning && extraWarning && (
                        <Typography
                            variant="caption"
                            sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', mt: 0.5 }}
                        >
                            <WarningAmberIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {extraWarning}
                        </Typography>
                    )}
                </>
            )}
        />
    );
};

export default FormInput;
