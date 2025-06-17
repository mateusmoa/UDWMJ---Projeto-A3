import React, { useEffect, useState } from 'react';
import styles from './css/restaurantDashboard.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RestaurantDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('restaurantToken');
      try {
        const [dashboardRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5000/api/restaurants/dashboard', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:5000/api/restaurants/orders', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);
        
        const dashboardData = await dashboardRes.json();
        const ordersData = await ordersRes.json();
        
        if (dashboardRes.ok && ordersRes.ok) {
          setDashboard(dashboardData);
          setOrders(ordersData);
        } else {
          toast.error('Erro ao carregar o dashboard');
        }
      } catch (err) {
        toast.error('Erro na conexão com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    const token = localStorage.getItem('restaurantToken');
    try {
      const res = await fetch('http://localhost:5000/api/restaurants/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status })
      });

      if (res.ok) {
        toast.success('Status atualizado com sucesso!');
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
        setSelectedStatus(null);
      } else {
        const errorData = await res.json();
        toast.error(`Erro: ${errorData.message || 'Não foi possível atualizar o status'}`);
      }
    } catch (err) {
      toast.error('Erro ao atualizar o status');
    }
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1 className={styles.title}>Dashboard do Restaurante</h1>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <h3>Faturamento Total</h3>
          <p>R$ {dashboard.totalRevenue.toFixed(2)}</p>
        </div>
        <div className={styles.metric}>
          <h3>Faturamento Semanal</h3>
          <p>R$ {dashboard.weeklyRevenue.toFixed(2)}</p>
        </div>
        <div className={styles.metric}>
          <h3>Pedidos</h3>
          <p>Total: {dashboard.orderStats.total}</p>
          <p className={styles.entregue}>Entregues: {dashboard.orderStats.entregues}</p>
          <p className={styles.cancelado}>Cancelados: {dashboard.orderStats.cancelados}</p>
          <p className={styles.atrasado}>Atrasados: {dashboard.orderStats.atrasados}</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Últimos Pedidos</h2>
      <div className={styles.orders}>
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <p><strong>Cliente:</strong> {order.client}</p>
              <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={styles[order.status]}>{order.status}</span>
              </p>
              <p>
                <strong>Data:</strong> {new Date(order.date).toLocaleDateString()}
              </p>
              <select
                value={
                  selectedStatus?.id === order.id
                    ? selectedStatus.status
                    : order.status
                }
                onChange={(e) =>
                  setSelectedStatus({ id: order.id, status: e.target.value })
                }
              >
                <option value="pendente">Pendente</option>
                <option value="preparando">Preparando</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
                <option value="atrasado">Atrasado</option>
              </select>
              <button
                onClick={() =>
                  handleStatusUpdate(
                    order.id,
                    selectedStatus?.status || order.status
                  )
                }
              >
                Atualizar Status
              </button>
            </div>
          ))
        )}
      </div>

      <h2 className={styles.sectionTitle}>Últimas Avaliações</h2>
      <div className={styles.reviews}>
        {dashboard.reviews.length === 0 ? (
          <p>Nenhuma avaliação encontrada.</p>
        ) : (
          dashboard.reviews.map((review, idx) => (
            <div key={idx} className={styles.reviewCard}>
              <p>
                <strong>{review.user_name}</strong> - {review.rating} estrelas
              </p>
              <p>{review.comment}</p>
              <p>
                <em>{new Date(review.date).toLocaleDateString()}</em>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
