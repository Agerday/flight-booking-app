import {Paper, SxProps, Theme} from '@mui/material';
import React from 'react';

interface Props {
    children: React.ReactNode;
    sx?: SxProps<Theme>;
}

const FrostedCard = ({
                         children,
                         sx,
                         ...rest
                     }: Props) => {
    return (
        <Paper
            elevation={6}
            sx={{
                p: 3,
                borderRadius: 3,
                mb: 4,
                backdropFilter: 'blur(6px)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Paper>
    );
};

export default FrostedCard;
