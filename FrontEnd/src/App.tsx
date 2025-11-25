import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/HeaderComponent/header.tsx';
import Footer from './components/FooterComponent/footer.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';
<<<<<<< HEAD
import RegisterForm from './pages/Register/Register.tsx';
import LaptopPage from './pages/catalog/LaptopPage.tsx';
import footer from './components/FooterComponent/footer.tsx';
import Home from './pages/Home/Home.tsx';
import AccountPage from './pages/AccountManager/Account.tsx';
import WishlistPage from './pages/Wish/Wishlist.tsx';
=======
import ProductDetail from './pages/DetailProduct/DetailProductPage.tsx';
import Cart from './pages/Cart/Cart.tsx';
import Checkout from './pages/Payment/Checkout.tsx';
>>>>>>> origin/main
import './Global.css'


function App() {
  return (
    <Router>
      <Header />
<<<<<<< HEAD

       <main className="max-w-7xl mx-auto mt-6 px-4">
          <Routes>
            <Route path='/' element={<Home/ >}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/Phone" element={<Home />} />
            <Route path="/laptop" element={<LaptopPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/wish" element={<WishlistPage />} />
          </Routes>
        </main>

      {/* <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes> */}
      {/* <footer/> */}
=======
      <Routes>
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
>>>>>>> origin/main
    </Router>
  );
}

export default App
