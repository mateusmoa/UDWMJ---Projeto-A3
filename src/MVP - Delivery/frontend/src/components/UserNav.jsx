import React from 'react';
import styles from './css/userNav.module.css';
import logo from './img/logoh.png';
import { FaChevronLeft, FaSearch, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function UserNav({ showBack = false, onBack }) {
  const navigate = useNavigate();

  return (
    <nav className={styles.headerNav}>
      <div className={styles.headerLeft}>
        {showBack ? (
          <button className={styles.iconButton} onClick={onBack || (() => navigate(-1))} title="Voltar">
            <FaChevronLeft size={28} />
          </button>
        ) : (
          <span style={{ width: 40 }}></span>
        )}
        <img src={logo} alt="NutriFood" className={styles.logo} />
        <span className={styles.logoSubtitle}>COMIDA SAUDÁVEL</span>
      </div>
      <div className={styles.headerIcons}>
        <button className={styles.iconButton} title="Buscar" onClick={() => navigate('/buscar')}>
          <FaSearch size={28} />
        </button>
        <button className={styles.iconButton} title="Perfil" onClick={() => navigate('/profile-user')}>
          <FaUserCircle size={32} />
        </button>
        <button className={styles.iconButton} title="Carrinho" onClick={() => navigate('/cart')}>
          <FaShoppingCart size={32} />
        </button>
      </div>
    </nav>
  );
}

export default UserNav;