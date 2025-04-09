import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Fade } from '@mui/material';

const PageWrapper = ({ children }) => {
    const location = useLocation();

    return (
        <Fade in={true} timeout={400} key={location.pathname}>
            <Box sx={{ width: '100%' }}>
                {children}
            </Box>
        </Fade>
    );
};

export default PageWrapper;
