import React from 'react';
import {Typography} from '@mui/material';
import {Controller, useFormContext} from 'react-hook-form';
import {DatePicker} from '@mui/x-date-pickers';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DatePickerInput = ({
                             name,
                             label,
                             validators = [],
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
                    <DatePicker
                        label={label}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(val) => {
                            field.onChange(val);
                            field.onBlur();
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message || '',
                            }
                        }}
                    />

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
            )}
        />
    );
};

export default DatePickerInput;
