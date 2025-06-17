import React from 'react';
import UserNav from './UserNav';

export default function UserLayout({ children }) {
  return (
    <>
      <UserNav />
      <main>
        {children}
      </main>
    </>
  );
}
