import React, { useState, useMemo } from "react";
import styles from "./css/cart.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserNav from "./UserNav";

function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const frete = 5; // Valor fixo de entrega

  // Calcula o subtotal e total utilizando useMemo para evitar recomputações desnecessárias
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const total = useMemo(() => subtotal + frete, [subtotal, frete]);

  const handleQuantityChange = (id, delta) => {
    updateQuantity(id, delta);
  };

  const handleRemove = (id) => {
    removeItem(id);
    toast.info("Item removido do carrinho.");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Carrinho vazio.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <UserNav showBack={true} />
      <div className={styles.container}>
        <main className={styles.main}>
          <h2 className={styles.title}>Carrinho</h2>

          {cart.length === 0 ? (
            <p className={styles.empty}>
              Seu carrinho está vazio.{" "}
              <button
                className={styles.emptyLink}
                onClick={() => navigate("/")}
                aria-label="Voltar para a página inicial"
              >
                Voltar para o início
              </button>
            </p>
          ) : (
            cart.map((item) => (
              <div className={styles.cartCard} key={item.id}>
                <div className={styles.cartCardTop}>
                  <img
                    src={item.img}
                    alt={item.name}
                    className={styles.cartImg}
                  />
                  <div className={styles.cartInfo}>
                    <div className={styles.cartName}>{item.name}</div>
                    <div className={styles.cartKcal}>{item.kcal} Kcal</div>
                    <div className={styles.cartPrice}>
                      R$ {item.price.toFixed(2)}
                    </div>
                    <div className={styles.cartQty}>
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className={styles.qtyBtn}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className={styles.qtyBtn}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className={styles.removeBtn}
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.freteBar}>
                  Frete: R$ {frete.toFixed(2)}
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Entrega:</span>
                <span>R$ {frete.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className={styles.payBtn}>
                Continuar para Pagamento
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Cart;
