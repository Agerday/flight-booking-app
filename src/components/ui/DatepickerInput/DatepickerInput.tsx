import React from 'react';
import {Typography} from '@mui/material';
import {Control, Controller, FieldPath, FieldValues} from 'react-hook-form';
import {DatePicker} from '@mui/x-date-pickers';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type ValidationRule = (value: Date | null) => true | string;

interface DatePickerInputProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label: string;
    validators?: ValidationRule[];
    showAutofillWarning?: boolean;
    extraWarning?: string;
}

function DatePickerInput<T extends FieldValues>({
                                                    name,
                                                    control,
                                                    label,
                                                    validators = [],
                                                    showAutofillWarning = false,
                                                    extraWarning = ''
                                                }: DatePickerInputProps<T>) {
    const buildValidationRules = () => {
        if (!validators.length) return {};
        return {
            validate: (value: Date | null) => {
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
            render={({field, fieldState}) => (
                <>
                    <DatePicker
                        label={label}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(val: Date | null) => {
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
                            <WarningAmberIcon sx={{fontSize: 16, mr: 0.5}}/>
                            {extraWarning}
                        </Typography>
                    )}
                </>
            )}
        />
    );
}

export default DatePickerInput;