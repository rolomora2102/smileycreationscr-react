// src/components/HeroSlider/HeroSlider.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: 'https://smileycreations-seasonal-files.s3.us-east-1.amazonaws.com/FANTASMITAS.png', // Cambia esto con las rutas de tus imágenes
    title: 'Llego Halloween!!',
    text: '¡No te pierdas nuestros productos especiales de Halloween!',
    redirect: '/collecciones',
  },
//   {
//     image: '/path/to/customized.jpg',
//     title: 'Productos Personalizados',
//     redirect: '/personalizados',
//   },
//   {
//     image: '/path/to/offers.jpg',
//     title: 'Ofertas Especiales',
//     redirect: '/ofertas',
//   },
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Cambia de imagen cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const handleRedirect = (redirectPath) => {
    navigate(redirectPath);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '500px', s: '400px', md: '1000px' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentSlide ? 1 : 0,
            maskImage: `linear-gradient(to top, rgba(255, 230, 240, 0), rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 0))`, // Degradado radial para los bordes
            WebkitMaskImage: `linear-gradient(to top, rgba(255, 230, 240, 0, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 0))`, // Compatibilidad con Safari
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: '5%', md: '20%' },
              left: { xs: '2%', md: '10%' },
              right: { xs: '2%', md: '60%' },
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {slide.title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {slide.text}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => handleRedirect(slide.redirect)}
            >
              Ver más
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default HeroSlider;
