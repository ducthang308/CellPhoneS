import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/HeaderComponent/header.tsx';
import Footer from './components/FooterComponent/footer.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';
import ProductDetail from './pages/DetailProduct/DetailProductPage.tsx';
import Cart from './pages/Cart/Cart.tsx';
import Checkout from './pages/Payment/Checkout.tsx';
import './Global.css'


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App
