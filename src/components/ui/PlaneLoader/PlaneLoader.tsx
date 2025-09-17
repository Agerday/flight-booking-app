import React from "react";
import { Box } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { keyframes } from "@emotion/react";

const rotate = keyframes`
  0% { transform: rotate(0deg) translateX(0) rotate(0deg); }
  25% { transform: rotate(90deg) translateX(50px) rotate(-90deg); }
  50% { transform: rotate(180deg) translateX(50px) rotate(-180deg); }
  75% { transform: rotate(270deg) translateX(50px) rotate(-270deg); }
  100% { transform: rotate(360deg) translateX(0) rotate(-360deg); }
`;

const PlaneLoader: React.FC = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            position="relative"
        >
            <Box
                sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                }}
            >
                <AirplanemodeActiveIcon
                    color="primary"
                    sx={{
                        fontSize: 40,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        animation: `${rotate} 2s linear infinite`,
                    }}
                />
            </Box>
        </Box>
    );
};

export default PlaneLoader;
