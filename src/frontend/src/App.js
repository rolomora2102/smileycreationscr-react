import React, { useRef } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './styles/theme';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import { CartProvider } from './contexts/CartContext';
import AdminCustomers from './pages/AdminCustomers/AdminCustomers';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Products from './pages/Products/Products';
import CustomProduct from './pages/CustomProduct/CustomerProduct';
import CustomIllustration from './pages/CustomIllustration/CustomIllustration';

function App() {
  const footerRef = useRef(null);

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <CssBaseline />
        <Router>
          <Navbar scrollToFooter={scrollToFooter} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/producto-personalizado" element={<CustomProduct />} />
            <Route path="/ilustracion-personalizada" element={<CustomIllustration />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/admin/clientes" element={<AdminCustomers />} /> 
            <Route path="/producto/:id" element={<ProductDetails />} /> 
            <Route path="/clientes" element={<AdminCustomers />} />
          </Routes>
          <Footer ref={footerRef} />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
