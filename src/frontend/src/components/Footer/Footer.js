import React from 'react';
import { Box, Typography, IconButton, Link as MuiLink, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = React.forwardRef((props, ref) => (
  <Box
      ref={ref} // Usa la referencia aquí
      component="footer"
      sx={{
        py: 4,
        px: 2,
        textAlign: 'center',
        backgroundColor: '#FFE6F0',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        borderTop: '1px solid #F4A7B9',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F48FB1' }}>
        SmileyCreations by Danii.O
      </Typography>
      
      <Stack direction="row" spacing={4} sx={{ mt: 1, mb: 2 }}>
        <MuiLink href="/" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>
          Inicio
        </MuiLink>
        <MuiLink href="/productos" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>
          Productos
        </MuiLink>
        <MuiLink href="/producto-personalizado" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>
          Personalizados
        </MuiLink>
        <MuiLink href="/ilustraciones" color="inherit" underline="hover" sx={{ fontSize: '0.9rem' }}>
          Ilustraciones
        </MuiLink>
      </Stack>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton
          component="a"
          href="https://www.instagram.com/smileycreationscr/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#F48FB1' }}
        >
          <InstagramIcon fontSize="large" />
        </IconButton>
        <IconButton
          component="a"
          href="https://wa.me/50688725425"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#25D366' }}
        >
          <WhatsAppIcon fontSize="large" />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        © 2024 SmileyCreations by Danii.O. Todos los derechos reservados.
      </Typography>
    </Box>
));

export default Footer;
