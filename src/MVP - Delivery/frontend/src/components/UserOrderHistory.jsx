import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";

export default function UserOrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/orders/user/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Erro ao buscar pedidos", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar status manual (se ainda quiser manter)
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put("/api/orders/status", { orderId, status: newStatus });
      alert("Status atualizado!");
      fetchOrders();
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    }
  };

  // Função para quando a avaliação for enviada com sucesso
  const handleReviewSubmitted = () => {
    fetchOrders(); // Atualiza os pedidos para refletir avaliação feita
  };

  return (
    <div>
      <h2>Histórico de Pedidos</h2>

      {loading && <p>Carregando pedidos...</p>}

      {!loading && orders.length === 0 && <p>Nenhum pedido encontrado.</p>}

      {!loading && orders.map((order) => (
        <div key={order.id} className="border p-3 mb-4 rounded">
          <p><strong>Pedido #{order.id}</strong></p>
          <p>Data: {new Date(order.date).toLocaleString()}</p>
          <p>Status: {order.status}</p>

          {/* Botões para atualizar status (opcional) */}
          <button
            key={`btn-em-andamento-${order.id}`}
            disabled={order.status === 'em andamento'}
            onClick={() => updateStatus(order.id, 'em andamento')}
          >
            Em andamento
          </button>

          <button
            key={`btn-entregue-${order.id}`}
            disabled={order.status === 'entregue'}
            onClick={() => updateStatus(order.id, 'entregue')}
          >
            Entregue
          </button>

          <ul className="ml-4 list-disc">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.quantity}x {item.name} — R$ {item.price}
                {item.observation && <em> ({item.observation})</em>}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> R$ {order.total}</p>

          {/* Mostrar ReviewForm só se pedido entregue e não avaliado */}
          {order.status === 'entregue' && !order.reviewed && (
            <ReviewForm
              orderId={order.id}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}

          {/* Mensagem se já avaliado */}
          {order.status === 'entregue' && order.reviewed && (
            <p>Avaliação já enviada. Obrigado!</p>
          )}
        </div>
      ))}
    </div>
  );
}
