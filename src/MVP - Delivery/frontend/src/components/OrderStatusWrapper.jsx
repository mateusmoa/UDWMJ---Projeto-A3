import React from 'react';
import OrderStatus from './OrderStatus';
import styles from './css/orderStatusWrapper.module.css';

const OrderStatusWrapper = ({ orderId, additionalInfo }) => {
  return (
    <div className={styles.orderStatusWrapper}>
      <h1 className={styles.heading}>Rastreamento do Pedido</h1>
      <OrderStatus orderId={orderId} />

      {additionalInfo && (
        <div className={styles.additionalInfo}>
          <h2>Informações Adicionais</h2>
          <p>{additionalInfo}</p>
        </div>
      )}
    </div>
  );
};

export default OrderStatusWrapper;
