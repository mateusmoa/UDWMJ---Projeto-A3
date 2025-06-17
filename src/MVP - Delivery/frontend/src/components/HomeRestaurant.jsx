import React, { useState, useEffect } from 'react';
import styles from './css/homeRestaurant.module.css';
import logo from './img/logo.png';
import profileIcon from './img/profileRestaurant.png';
import settingsIcon from './img/settings.png';
import editIcon from './img/edit.png';

function HomeRestaurant() {
  const [isOpen, setIsOpen] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    // Buscar perfil do restaurante
    const fetchRestaurantProfile = async () => {
      const token = localStorage.getItem('restaurantToken');
      try {
        const response = await fetch('http://localhost:5000/api/restaurants/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setRestaurant(data);
        } else {
          setProfileError(data.message || 'Falha ao buscar perfil.');
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setProfileError('Erro ao conectar com o servidor.');
      } finally {
        setProfileLoading(false);
      }
    };

    // Buscar dados do dashboard
    const fetchDashboard = async () => {
      const token = localStorage.getItem('restaurantToken');
      try {
        const response = await fetch('http://localhost:5000/api/restaurants/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setDashboard(data);
        } else {
          setDashboardError(data.message || 'Falha ao buscar dashboard.');
        }
      } catch (error) {
        console.error('Erro ao buscar dashboard:', error);
        setDashboardError('Erro ao conectar com o servidor.');
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchRestaurantProfile();
    fetchDashboard();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header/Nav */}
      <header className={styles.headerNav}>
        <div className={styles.headerLeft}>
          <img src={logo} alt="NutriFood" className={styles.logo} />
        </div>
        <div className={styles.headerRight}>
          <button
            className={`${styles.statusBtn} ${isOpen ? styles.open : styles.closed}`}
            onClick={() => setIsOpen(prev => !prev)}
          >
            {isOpen ? 'Aberto' : 'Fechado'}
            <span
              className={styles.statusDot}
              style={{ background: isOpen ? '#3ec300' : '#c30000' }}
            ></span>
          </button>
          <div className={styles.headerIcons}>
            <img src={profileIcon} className={styles.icon} title="Perfil" alt="Perfil" />
            <img src={settingsIcon} className={styles.icon} title="Configurações" alt="Configurações" />
          </div>
        </div>
      </header>

      {/* Saudação */}
      <section className={styles.welcomeSection}>
        {profileLoading ? (
          <h1 className={styles.welcome}>Carregando...</h1>
        ) : profileError ? (
          <h1 className={styles.welcome}>Erro ao carregar perfil</h1>
        ) : (
          <h1 className={styles.welcome}>
            Bem Vindo<br />
            <span className={styles.restaurantName}>
              {restaurant?.name || '(nome do rest.)'}
            </span>!
          </h1>
        )}
        <img src={logo} alt="NutriFood" className={styles.headerLogo} />
      </section>

      {/* Faturamento */}
      <section className={styles.faturamentoSection}>
        <div>
          <span className={styles.faturamentoLabel}>Faturamento Semanal:</span>
          <span className={styles.faturamentoValue}>
            {dashboardLoading
              ? 'Carregando...'
              : dashboard?.faturamentoSemanal
              ? `R$ ${dashboard.faturamentoSemanal}`
              : 'R$ 00,00'}
          </span>
        </div>
        <div>
          <span className={styles.faturamentoLabel}>Faturamento Total:</span>
          <span className={styles.faturamentoValue}>
            {dashboardLoading
              ? 'Carregando...'
              : dashboard?.faturamentoTotal
              ? `R$ ${dashboard.faturamentoTotal}`
              : 'R$ 00,00'}
          </span>
        </div>
      </section>

      {/* Pedidos */}
      <section className={styles.pedidosSection}>
        <h2 className={styles.sectionTitle}>Pedidos:</h2>
        {dashboardLoading ? (
          <p>Carregando pedidos...</p>
        ) : dashboard?.orders && dashboard.orders.length > 0 ? (
          dashboard.orders.map(order => (
            <div key={order.id} className={styles.pedidoItem}>
              <div>
                <b>#{order.id}</b>
                <span className={styles.pedidoData}>
                  {order.time} | {order.date}
                </span>
              </div>
              <div className={styles.pedidoValores}>
                <span>
                  Valor: <b>R$ {order.value.toFixed(2)}</b>
                </span>
                <span>
                  Status: <b>{order.status}</b>
                </span>
                <span className={styles.arrow}>&#8250;</span>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum pedido encontrado.</p>
        )}
        <div className={styles.verTodos}>Ver todos...</div>
      </section>

      {/* Cardápio */}
      <section className={styles.cardapioSection}>
        <div className={styles.cardapioHeader}>
          <h2 className={styles.sectionTitle}>Cardápio:</h2>
          <img src={editIcon} className={styles.icon} title="Adicionar/Editar" alt="Menu" />
        </div>
        {dashboardLoading ? (
          <p>Carregando cardápio...</p>
        ) : dashboard?.menu && dashboard.menu.length > 0 ? (
          dashboard.menu.map(item => (
            <div key={item.id} className={styles.cardapioItem}>
              <span>{item.name}</span>
              <span>Prep.: R$ {item.preparationPrice.toFixed(2)}</span>
              <img src={editIcon} className={styles.icon} title="Editar" alt="Editar" />
            </div>
          ))
        ) : (
          <p>Nenhum item cadastrado.</p>
        )}
        <div className={styles.verTodos}>Ver todos...</div>
      </section>

      {/* Resultados Semanais */}
      <section className={styles.resultadosSection}>
        <h2 className={styles.sectionTitle}>Resultados Semanais</h2>
        {dashboardLoading ? (
          <p>Carregando resultados...</p>
        ) : (
          <div className={styles.resultadosBox}>
            <div>
              Score Semanal de Avaliações: <b>{dashboard?.reviewScore || 'N/A'}</b>
            </div>
            <div>
              Pedidos Totais: <b>{dashboard?.totalOrders || '0'}</b>
            </div>
            <div>
              Pedidos Atrasados: <b>{dashboard?.lateOrders || '0'}</b>
            </div>
            <div>
              Pedidos Cancelados: <b>{dashboard?.canceledOrders || '0'}</b>
            </div>
            <div>
              Pedidos Retornados: <b>{dashboard?.returnedOrders || '0'}</b>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomeRestaurant;
