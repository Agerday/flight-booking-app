import React from 'react';
import {Button} from '@mui/material';

const SecondaryButton = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            variant="outlined"
            size="large"
            fullWidth
            sx={{
                mt: 4,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: 'rgba(0, 125, 255, 0.04)',
                    borderColor: 'primary.dark',
                    color: 'primary.dark',
                    transform: 'translateY(-1px)',
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default SecondaryButton;
