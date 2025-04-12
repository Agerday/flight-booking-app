import React from 'react';
import {Box, Container} from '@mui/material';
import FrostedCard from "../FrostedCard/FrostedCard";

const CenteredPageLayout = ({ children, background, useCard = true }) => {
    const Wrapper = useCard ? FrostedCard : React.Fragment;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Container maxWidth="md">
                <Wrapper sx={{ p: 4 }}>
                    {children}
                </Wrapper>
            </Container>
        </Box>
    );
};

export default CenteredPageLayout;
