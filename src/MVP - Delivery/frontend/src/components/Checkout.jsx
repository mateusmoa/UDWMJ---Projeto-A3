import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/checkout.module.css';

const Checkout = ({ cartItems = [], onFinish }) => {
  const [total, setTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Atualiza o total sempre que os itens do carrinho mudam
  useEffect(() => {
    const totalCalc = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalCalc);
  }, [cartItems]);

  // Auto-esconde o toast após 3 segundos
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleFinish = useCallback(async () => {
    if (cartItems.length === 0 || loading) return;

    setLoading(true);
    setError(null);

    const payload = {
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        observation: item.observation || '',
        price: item.price,
      })),
      payment_method: 'pix'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.order_id) {
        setShowToast(true);
        // Se onFinish for fornecido, executa-o, senão redireciona
        if (typeof onFinish === 'function') {
          onFinish(data.order_id);
        } else {
          navigate(`/status/${data.order_id}`);
        }
      } else {
        throw new Error(data.error || 'Erro ao processar pedido');
      }
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      setError('Falha ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [cartItems, loading, navigate, onFinish]);

  return (
    <div className={styles.checkoutContainer}>
      <h2 className={styles.title}>Resumo do Pedido</h2>

      {cartItems.length === 0 ? (
        <p className={styles.empty}>Seu carrinho está vazio.</p>
      ) : (
        <ul className={styles.itemList}>
          {cartItems.map(item => (
            <li key={item.id || item.name} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQuantity}>x{item.quantity}</span>
              </div>
              <div className={styles.itemPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>Total:</span>
        <span className={styles.totalValue}>R$ {total.toFixed(2)}</span>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <button
        className={styles.finishBtn}
        onClick={handleFinish}
        disabled={cartItems.length === 0 || loading}
      >
        {loading ? 'Finalizando...' : 'Confirmar Pedido'}
      </button>

      {showToast && (
        <div className={styles.toast}>
          Pedido confirmado! Redirecionando...
        </div>
      )}
    </div>
  );
};

export default Checkout;
