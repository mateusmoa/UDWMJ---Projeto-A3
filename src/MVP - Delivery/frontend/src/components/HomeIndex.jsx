import React from 'react';
import { Link } from 'react-router-dom';
import styles from './css/homeIndex.module.css';
import smallLogo from './img/logoh.png';
import mainLogo from './img/logo.png';

const HomeIndex = () => {
  return (
    <div className={styles.container}>
      {/* Cabeçalho com logo pequeno e botão de login */}
      <header className={styles.header}>
        <img src={smallLogo} alt="NutriFood COMIDA SAUDÁVEL" className={styles.smallLogo} />
        <Link to="/login" className={styles.loginButton}>Entrar</Link>
      </header>

      {/* Conteúdo centralizado */}
      <main className={styles.mainContent}>
        <img src={mainLogo} alt="NutriFood" className={styles.mainLogo} />
        <h1 className={styles.title}>Bem‑Vindo ao NutriFood</h1>
        <p className={styles.subtitle}>Seu aplicativo de nutrição e alimentação saudável</p>
        <p className={styles.description}>Escolha uma opção para continuar:</p>
        <div className={styles.buttonContainer}>
          <Link to="/register-user" className={styles.button}>Cadastro Usuário</Link>
          <Link to="/register-restaurant" className={styles.button}>Cadastro Restaurantes</Link>
        </div>
      </main>
    </div>
  );
};

export default HomeIndex;
