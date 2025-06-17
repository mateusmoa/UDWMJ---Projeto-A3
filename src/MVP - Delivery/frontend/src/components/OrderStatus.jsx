import React, { useEffect, useState } from 'react';
import styles from './css/orderStatus.module.css';

const statusStages = ['Recebido', 'Preparando', 'Em transporte', 'Entregue'];

const statusMap = {
  pendente: 'Recebido',
  recebido: 'Recebido',
  preparando: 'Preparando',
  transporte: 'Em transporte',
  entregue: 'Entregue',
};

const OrderStatus = ({ orderId }) => {
  const [status, setStatus] = useState('Recebido');
  const [isDelivered, setIsDelivered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}/status`);
        if (!response.ok) {
          throw new Error('Erro ao buscar status');
        }
        const data = await response.json();
        const mappedStatus = statusMap[data.status?.toLowerCase()] || 'Recebido';
        setStatus(mappedStatus);
        setIsDelivered(mappedStatus === 'Entregue');
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);
  }, [orderId]);

  const currentIndex = statusStages.indexOf(status);

  return (
    <div className={styles.statusContainer}>
      <h2>Status do Pedido</h2>

      {loading && <p>Carregando status...</p>}
      {error && <p className={styles.errorMessage}>Erro: {error}</p>}

      <ul className={styles.statusList}>
        {statusStages.map((stage, index) => (
          <li
            key={stage}
            className={`${styles.statusItem} ${
              index <= currentIndex ? styles.active : ''
            }`}
          >
            {stage}
          </li>
        ))}
      </ul>

      {isDelivered && (
        <p className={styles.finalMessage}>Pedido entregue com sucesso! 🍽️</p>
      )}
    </div>
  );
};

export default OrderStatus;
