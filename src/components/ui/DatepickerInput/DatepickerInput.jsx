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
    const {control} = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: validators.length
                    ? (value) => validators.map((v) => v(value)).filter(Boolean)[0]
                    : undefined,
            }}
            render={({field, fieldState}) => (
                <>
                    <DatePicker
                        label={label}
                        value={field.value || null}
                        onChange={(val) => {
                            field.onChange(val);
                            field.onBlur()
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                            },
                        }}
                    />
                    {showAutofillWarning && extraWarning && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'warning.main',
                                display: 'flex',
                                alignItems: 'center',
                                mt: 0.5,
                            }}
                        >
                            <WarningAmberIcon sx={{fontSize: 16, mr: 0.5}}/>
                            {extraWarning}
                        </Typography>
                    )}
                </>
            )}
        />
    );
};

export default DatePickerInput;
