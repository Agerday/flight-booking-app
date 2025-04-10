import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    TextField,
    MenuItem,
    InputAdornment,
    IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const FormInput = ({
                       name,
                       label,
                       type = 'text',
                       icon,
                       isSelect = false,
                       isDate = false,
                       options = [],
                       validators = [],
                       placeholder,
                       showAutofillWarning = false,
                       extraWarning = '',
                   }) => {
    const {
        register,
        getValues,
        setValue,
        formState: { errors },
    } = useFormContext();

    const validateFn = (value) => {
        for (let validate of validators) {
            const result = validate(value);
            if (result !== true) return result;
        }
        return true;
    };

    const value = getValues(name);

    return (
        <TextField
            {...register(name, { validate: validateFn })}
            label={label}
            type={type}
            fullWidth
            value={value || ''}
            onChange={(e) => {
                let val = e.target.value;
                if (type === 'number') {
                    val = Math.max(1, Number(val));
                }
                setValue(name, val, { shouldValidate: true });
            }}
            error={!!errors[name]}
            helperText={errors[name]?.message || extraWarning}
            placeholder={placeholder}
            select={isSelect}
            InputLabelProps={isDate ? { shrink: true } : undefined}
            InputProps={{
                startAdornment: icon ? (
                    <InputAdornment position="start">{icon}</InputAdornment>
                ) : null,
                endAdornment: isSelect && value ? (
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            onClick={() => setValue(name, '', { shouldValidate: true })}
                            sx={{ pr: 3 }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
        >
            {isSelect &&
                options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
        </TextField>
    );
};

export default FormInput;
