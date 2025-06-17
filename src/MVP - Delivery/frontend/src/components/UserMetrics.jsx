import { useEffect, useState } from "react";
import axios from "axios";

export default function UserMetrics({ userId }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios.get(`/api/metrics/${userId}`).then(res => setMetrics(res.data));
  }, [userId]);

  if (!metrics) return <p>Carregando métricas...</p>;

  return (
    <div>
      <h2>Métricas Semanais</h2>
      <p>Calorias Consumidas: {metrics.totalCalories} Kcal</p>
      <p>Refeições Solicitadas: {metrics.totalMeals} Itens</p>
      <p>Proteínas Consumidas: {metrics.totalProteins}g</p>
      <p>Gasto Total: R$ {metrics.totalSpent.toFixed(2)}</p>
    </div>
  );
}
