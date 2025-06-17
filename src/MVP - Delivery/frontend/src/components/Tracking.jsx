import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./css/tracking.module.css";

export default function Tracking() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const statusLabel = {
    pendente: "🕓 Aguardando confirmação",
    preparo: "👨‍🍳 Em preparo",
    entrega: "🚗 Saiu para entrega",
    entregue: "✅ Entregue",
  };

  // Função de busca encapsulada com useCallback para evitar recriações desnecessárias
  const fetchOrder = useCallback(async () => {
    try {
      const res = await axios.get("/api/tracking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (error) {
      console.error("Erro ao buscar tracking:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return <p className={styles.loading}>Carregando pedido...</p>;
  }

  if (!order) {
    return <p className={styles.empty}>Nenhum pedido em andamento.</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Status do Pedido</h2>
      <div className={styles.card}>
        <p>
          <strong>Status:</strong> {statusLabel[order.status] || order.status}
        </p>
        <p>
          <strong>Produtos:</strong> {order.produtos}
        </p>
        <p>
          <strong>Total:</strong> R$ {order.total.toFixed(2)}
        </p>
        <p>
          <strong>Pagamento:</strong> {order.payment_method}
        </p>
        <p>
          <strong>Data:</strong> {new Date(order.date).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
