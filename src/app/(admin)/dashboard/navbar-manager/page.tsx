// src/app/dashboard/navbar-manager/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import NavbarManager from '@/components/NavbarManager';
import Alert from "@/components/alert";

export default function NavbarManagerPage() {
  const [alert, setAlert] = useState({ type: '', message: '', isVisible: false });

  const showAlert = (type, message) => {
    setAlert({ type, message, isVisible: true });
    setTimeout(() => setAlert({ type, message, isVisible: false }), 3000);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion de la Navbar</h1>
      {alert.isVisible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '', isVisible: false })}
        />
      )}
      <NavbarManager showAlert={showAlert} />
    </main>
  );
}
