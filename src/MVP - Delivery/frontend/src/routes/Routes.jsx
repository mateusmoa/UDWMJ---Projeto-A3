import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserNav from '../components/UserNav';
import HomeUser from '../components/HomeUser';
import HomeIndex from '../components/HomeIndex';
import Login from '../components/Login';
import ProfileUser from '../components/ProfileUser';
import HomeRestaurant from '../components/HomeRestaurant';
import RegisterUser from '../components/RegisterUser';
import RegisterRestaurant from '../components/RegisterRestaurant';
import Cart from '../components/Cart';
import ProductList from "../components/ProductList";
import Checkout from "../components/Checkout";
import UserOrderHistory from "../components/UserOrderHistory";
import RestaurantDashboard from "../components/RestaurantDashboard";
import RestaurantProducts from "../components/RestaurantProducts";
import ProductDetails from "../components/ProductDetails";

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeIndex />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home-user" element={<HomeUser />} />
        <Route path="/profile-user" element={<ProfileUser />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/home-restaurant" element={<HomeRestaurant />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-restaurant" element={<RegisterRestaurant />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/historico" element={<UserOrderHistory userId={1} />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard restaurantId={1} />} />
        <Route path="/restaurant/products" element={<RestaurantProducts restaurantId={1} />} />
        <Route path="/restaurant/products/:id" element={<ProductDetails />} />
        
      </Routes>
    </>
  );
}

export default AppRoutes;
