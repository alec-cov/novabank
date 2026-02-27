import React, { createContext, useContext, useState } from 'react';

const BankContext = createContext();

export const BankProvider = ({ children }) => {
  // Datos del Usuario
  const [user, setUser] = useState({
    name: 'Alec Isaac',
    lastLogin: '17/12/2025 10:30 AM',
  });

  // Datos de Cuentas
  const [accounts, setAccounts] = useState([
    { id: '1', type: 'Débito', alias: 'Nómina', number: '**1234', balance: 11692.00, isBlocked: false },
    { id: '2', type: 'Débito', alias: 'Ahorro Meta', number: '**5678', balance: 49612.50, isBlocked: false },
    { id: '3', type: 'Crédito', alias: 'Tarjeta Oro', number: '**9012', balance: -503500.00, limit: 50000, isBlocked: false },
  ]);

  // Datos de Movimientos
  const [transactions, setTransactions] = useState([
    { id: 't1', accountId: '1', date: '15/12/2025', description: 'Compra OXXO', amount: -45.00 },
    { id: 't2', accountId: '1', date: '14/12/2025', description: 'Depósito Nómina', amount: 15000.00 },
    { id: 't3', accountId: '3', date: '10/12/2025', description: 'Uber Trip', amount: -150.00 },
  ]);

  // Pagos y transferencias
  const processTransaction = (accountId, amount, description) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    }));

    // Registrar movimiento en el historial
    const newTx = {
      id: Date.now().toString(),
      accountId,
      date: new Date().toLocaleDateString('es-MX'),
      description: description,
      amount: -amount, 
    };

    setTransactions(prev => [newTx, ...prev]); 
  };

  // Bloqueo de tarjeta
  const toggleCardBlock = (accountId) => {
    setAccounts(prevAccounts => prevAccounts.map(acc => {
        if (acc.id === accountId) {
            return { ...acc, isBlocked: !acc.isBlocked };
        }
        return acc;
    }));
  };

  // ÚLTIMO ACCESO
  const updateLoginDate = () => {
    const now = new Date();

    const formattedDate = now.toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }); 

    setUser(prev => ({ ...prev, lastLogin: formattedDate }));
  };

  return (
    <BankContext.Provider value={{ 
        user, 
        accounts, 
        transactions, 
        processTransaction, 
        toggleCardBlock,
        updateLoginDate 
    }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => useContext(BankContext);