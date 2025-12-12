import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/HeaderComponent/header.tsx';
import Footer from './components/FooterComponent/footer.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';

import RegisterForm from './pages/Register/Register.tsx';
import LaptopPage from './pages/catalog/LaptopPage.tsx';
import Home from './pages/Home/Home.tsx';
import AccountPage from './pages/AccountManager/Account.tsx';
import Shopping_cardPage from './pages/WishlistPage/WishlistPage.tsx';

import ProductDetail from './pages/DetailProduct/DetailProductPage.tsx';
import Checkout from './pages/Payment/Checkout.tsx';
import CartPage from './pages/CartPage/CartPage.tsx';
import OrderHistoryPage from './pages/OrderHistory/OrderHistoryPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import './Global.css'

localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwOTg3NjU0MzIxIiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImlhdCI6MTc2NTUzODAwMCwiZXhwIjoxNzY1NTc0MDAwfQ.3Az5Y2FcRwkev21eeqxRsefSPhmBRg2Im6ARHhx7TfM");

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, width: '100%', paddingTop: 150 }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/laptop" element={<LaptopPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/Shopping_card" element={<Shopping_cardPage />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/check-out" element={<Checkout />} />
            <Route path="/cartShop" element={<CartPage />} />
            <Route path="/historyOrder" element={<OrderHistoryPage />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
