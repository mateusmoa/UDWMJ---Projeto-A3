import React from 'react';
import RestaurantNav from './RestaurantNav';
import styles from './css/restaurantLayout.module.css';

function RestaurantLayout({ children }) {
  return (
    <div className={styles.container}>
      <RestaurantNav />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

export default RestaurantLayout;
