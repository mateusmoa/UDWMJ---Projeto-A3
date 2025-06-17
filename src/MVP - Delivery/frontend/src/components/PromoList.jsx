import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./css/promoList.module.css"; // ajuste o caminho conforme a localização real

export default function PromoList() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    axios.get('/api/promotions')
      .then(res => setPromos(res.data))
      .catch(err => console.error("Erro ao buscar promoções:", err));
  }, []);

  return (
    <div className={styles.container}>
      {promos.map((promo) => (
        <div key={promo.promo_id} className={styles.card}>
          <img src={promo.img} alt={promo.name} className={styles.image} />
          <div className={styles.cardTitle}>{promo.name}</div>
          <div className={styles.cardPrice}>
            <span className={styles.oldPrice}>R$ {promo.price.toFixed(2)}</span>
            <span className={styles.promoPrice}>R$ {promo.promo_price.toFixed(2)}</span>
          </div>
          <div className={styles.cardDesc}>{promo.kcal} kcal</div>
        </div>
      ))}
    </div>
  );
}
