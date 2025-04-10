import React from 'react';
import { Button } from '@mui/material';

const PrimaryButton = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
                mt: 4,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default PrimaryButton;
