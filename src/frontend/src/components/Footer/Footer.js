import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2024 SmileyCreations by Danii.O
      </Typography>
    </Box>
  );
}

export default Footer;
