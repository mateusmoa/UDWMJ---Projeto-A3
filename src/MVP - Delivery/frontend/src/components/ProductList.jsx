import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./css/homeUser.module.css";

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <section className={styles.section}>
      <strong className={styles.sectionHeader}>🍔 Produtos disponíveis</strong>

      <div className={styles.productGrid}>
        {products.map((prod) => (
          <div
            key={prod.id}
            className={`${styles.card} ${prod.promo_price ? styles.hasPromo : ""}`}
            onClick={() => onAddToCart(prod)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAddToCart(prod)}
          >
            <img src={prod.img} alt={prod.name} onError={(e) => (e.target.src = "/img/no-image.png")} />
            <div className={styles.cardTitle}>{prod.name}</div>
            <div className={styles.cardDesc}>{prod.description}</div>
            <div className={styles.cardPrice}>
              {prod.promo_price ? (
                <>
                  <span className={styles.oldPrice}>R$ {prod.price.toFixed(2)}</span>
                  <span className={styles.promoPrice}>R$ {prod.promo_price.toFixed(2)}</span>
                </>
              ) : (
                <>R$ {prod.price.toFixed(2)}</>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
