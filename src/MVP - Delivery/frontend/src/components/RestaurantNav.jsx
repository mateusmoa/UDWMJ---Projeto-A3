import React from 'react';
import { FaHome, FaChartLine, FaList, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './css/restaurantNav.module.css';

function RestaurantNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken');
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <img
          src="/img/restaurant-logo.png"
          alt="NutriFood Restaurante"
          className={styles.logo}
        />
        <span className={styles.title}>NutriFood Restaurante</span>
      </div>
      <ul className={styles.navList}>
        <li onClick={() => navigate('/home-restaurant')}>
          <FaHome className={styles.icon} />
          <span>Home</span>
        </li>
        <li onClick={() => navigate('/restaurant/dashboard')}>
          <FaChartLine className={styles.icon} />
          <span>Dashboard</span>
        </li>
        <li onClick={() => navigate('/restaurant/products')}>
          <FaList className={styles.icon} />
          <span>Produtos</span>
        </li>
        <li onClick={handleLogout}>
          <FaSignOutAlt className={styles.icon} />
          <span>Sair</span>
        </li>
      </ul>
    </nav>
  );
}

export default RestaurantNav;
