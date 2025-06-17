// HomeUser.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UserNav from './UserNav';
import PromoList from './PromoList';
import ProductList from './ProductList';
import styles from './css/homeUser.module.css';

export default function HomeUser({ user }) {
  return (
    <div className={styles.container}>
      <UserNav showBack={false} />
      <header className={styles.header}>
        <h1>Bem-vindo, {user?.name || 'Usuário'}!</h1>
        <p>Confira as melhores promoções e nossas recomendações.</p>
      </header>
      <nav className={styles.navLinks}>
        <Link to="/search" className={styles.link}>Buscar Alimentos e Restaurantes</Link>
        <Link to="/cart" className={styles.link}>Meu Carrinho</Link>
        <Link to="/tracking" className={styles.link}>Acompanhar Pedido</Link>
      </nav>
      <section className={styles.section}>
        <h2>Promoções</h2>
        <PromoList />
      </section>
      <section className={styles.section}>
        <h2>Recomendações</h2>
        <ProductList />
      </section>
    </div>
  );
}
