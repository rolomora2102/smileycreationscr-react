import React from 'react';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/admin/clientes" element={<AdminCustomers />} /> 
            <Route path="/producto/:id" element={<ProductDetails />} /> 
            <Route path="/clientes" element={<AdminCustomers />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
