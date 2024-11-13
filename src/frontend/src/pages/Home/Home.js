// frontend/src/pages/Home/Home.js
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getFilteredProducts } from '../../services/productService';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ImagesURLObject } from '../../imagesURLs';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getFilteredProducts();
        setProducts(data.slice(0, 10)); // Solo toma los primeros 5 productos para el preview
      } catch (error) {
        console.error('Error obteniendo productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Preview de Productos */}
      <Box sx={{ width: '100%', mt: 1 }}>
        <Typography variant="h4" align="center" sx={{ mt: 2 }}>
          Productos Destacados
        </Typography>

        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <Box key={product.id} sx={{ padding: 1 }}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Slider>
        )}

        {/* Botón de Ver Más */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button sx={{ mt: 2 }} variant="contained" color="primary" component={Link} to="/productos">
            Ver Más
          </Button>
        </Box>
      </Box>
      {/* Hero de Producto Personalizado */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '500px', s: '400px', md: '800px' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            mt: 5,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${ImagesURLObject.custom_product_hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: `linear-gradient(to top, rgba(255, 230, 240, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 90%, rgba(255, 230, 240, 0))`,
            WebkitMaskImage: `linear-gradient(to bottom, rgba(255, 230, 240, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 85%, rgba(255, 230, 240, 0))`, // Compatibilidad con Safari
            transition: 'opacity 1s ease-in-out',
          }}
        >

        {/* Texto y botón sobre la imagen */}
        <Box sx={{
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
            Crea tu Producto Personalizado
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/producto-personalizado"
            sx={{ mt: 2 }}
          >
            Personaliza el Tuyo
          </Button>
          </Box>
        </Box>
      </Box>
      <Typography variant="h2" align="center" sx={{ fontStyle: "italic", mt: 2 }}>
          "El arte es el eco del alma"
        </Typography>
      {/* Hero de Ilustración Personalizada */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '500px', s: '400px', md: '800px' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            mt: 5,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${ImagesURLObject.custom_illustration_hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: `linear-gradient(to top, rgba(255, 230, 240, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 90%, rgba(255, 230, 240, 0))`,
            WebkitMaskImage: `linear-gradient(to bottom, rgba(255, 230, 240, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 85%, rgba(255, 230, 240, 0))`,
            transition: 'opacity 1s ease-in-out',
          }}
        >

        {/* Texto y botón sobre la imagen */}
        <Box sx={{
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
            Inventa tu Ilustración Personalizada
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/ilustracion-personalizada"
            sx={{ mt: 2 }}
          >
            Solicita tu Illustracion
          </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
