import {InputAdornment, MenuItem, TextField, Typography} from '@mui/material';
import {Control, Controller, FieldPath, FieldValues} from 'react-hook-form';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface FormInputProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label: string;
    placeholder?: string;
    icon?: React.ReactNode;
    type?: string;
    isSelect?: boolean;
    options?: Array<{ label: string; value: string | number }>;
    showAutofillWarning?: boolean;
    extraWarning?: string;
    disabled?: boolean;
    inputProps?: Record<string, any>;
}

export function FormInput<T extends FieldValues>({
                                                     name,
                                                     control,
                                                     label,
                                                     placeholder,
                                                     icon,
                                                     type = 'text',
                                                     isSelect = false,
                                                     options = [],
                                                     showAutofillWarning = false,
                                                     extraWarning = '',
                                                     disabled = false,
                                                     inputProps,
                                                 }: FormInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <>
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        fullWidth
                        label={label}
                        placeholder={placeholder}
                        type={type}
                        disabled={disabled}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || ''}
                        select={isSelect}
                        onChange={(e) => {
                            if (type === 'number') {
                                const value = e.target.value;
                                const numValue = parseInt(value, 10);

                                if (inputProps?.min !== undefined && numValue < inputProps.min) {
                                    field.onChange(inputProps.min);
                                    return;
                                }
                                if (inputProps?.max !== undefined && numValue > inputProps.max) {
                                    field.onChange(inputProps.max);
                                    return;
                                }

                                field.onChange(isNaN(numValue) ? inputProps?.min || 1 : numValue);
                            } else {
                                field.onChange(e);
                            }
                        }}
                        InputProps={{
                            startAdornment: icon ? (
                                <InputAdornment position="start">{icon}</InputAdornment>
                            ) : undefined,
                        }}
                        inputProps={{
                            ...inputProps,
                            ...(type === 'number' && {
                                onKeyDown: (e: React.KeyboardEvent) => {
                                    if (
                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
                                        !/[0-9]/.test(e.key)
                                    ) {
                                        e.preventDefault();
                                    }
                                }
                            })
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
                            <WarningAmberIcon sx={{fontSize: 16, mr: 0.5}}/>
                            {extraWarning}
                        </Typography>
                    )}
                </>
            )}
        />
    );
}

export default FormInput;