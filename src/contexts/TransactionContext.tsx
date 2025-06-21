
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  btcAmount?: number;
  txHash?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  balance: number;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateBalance: (newBalance: number) => void;
  updateTransactionStatus: (transactionId: string, status: 'completed' | 'failed') => void;
  getAllTransactions: () => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadUserTransactions();
    loadUserBalance();

    // Listen for balance updates from admin panel
    const handleBalanceUpdate = (event: CustomEvent) => {
      const currentUser = localStorage.getItem('capitalengine_user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.id === event.detail.userId) {
          setBalance(event.detail.newBalance);
        }
      }
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);

    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, []);

  const loadUserTransactions = () => {
    const currentUser = localStorage.getItem('capitalengine_user');
    if (!currentUser) {
      setTransactions([]);
      return;
    }

    const userData = JSON.parse(currentUser);
    const globalTransactions = localStorage.getItem('capitalengine_all_transactions');
    
    if (globalTransactions) {
      const allTransactions: Transaction[] = JSON.parse(globalTransactions);
      // Filter transactions to only show current user's transactions
      const userTransactions = allTransactions.filter(transaction => 
        transaction.userId === userData.id
      );
      setTransactions(userTransactions);
    } else {
      setTransactions([]);
    }
  };

  const loadUserBalance = () => {
    const currentUser = localStorage.getItem('capitalengine_user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setBalance(userData.balance || 0);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const currentUser = localStorage.getItem('capitalengine_user');
    let userInfo = {};
    
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      userInfo = {
        userId: userData.id,
        userEmail: userData.email,
        userName: userData.name
      };
    }

    const newTransaction: Transaction = {
      ...transaction,
      ...userInfo,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    
    // Add to user's transaction list
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    // Store globally for admin access
    const globalTransactions = localStorage.getItem('capitalengine_all_transactions');
    const allTransactions = globalTransactions ? JSON.parse(globalTransactions) : [];
    const updatedAllTransactions = [newTransaction, ...allTransactions];
    localStorage.setItem('capitalengine_all_transactions', JSON.stringify(updatedAllTransactions));

    // Dispatch event for admin panel to catch new transactions
    const transactionEvent = new CustomEvent('newTransaction', { 
      detail: { 
        transaction: newTransaction,
        allTransactions: updatedAllTransactions,
        timestamp: new Date().toISOString()
      } 
    });
    
    // Dispatch multiple times to ensure admin panel catches it
    window.dispatchEvent(transactionEvent);
    setTimeout(() => window.dispatchEvent(transactionEvent), 100);
    setTimeout(() => window.dispatchEvent(transactionEvent), 500);
    
    console.log('New transaction event dispatched for admin panel sync:', newTransaction);
  };

  const updateTransactionStatus = (transactionId: string, status: 'completed' | 'failed') => {
    // Update user's transactions
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, status } : transaction
    );
    setTransactions(updatedTransactions);

    // Update global transactions
    const globalTransactions = localStorage.getItem('capitalengine_all_transactions');
    if (globalTransactions) {
      const allTransactions = JSON.parse(globalTransactions);
      const updatedAllTransactions = allTransactions.map((transaction: Transaction) =>
        transaction.id === transactionId ? { ...transaction, status } : transaction
      );
      localStorage.setItem('capitalengine_all_transactions', JSON.stringify(updatedAllTransactions));
    }

    // If it's a completed deposit, update user balance
    if (status === 'completed') {
      const transaction = updatedTransactions.find(t => t.id === transactionId);
      if (transaction && transaction.type === 'deposit') {
        const newBalance = balance + transaction.amount;
        setBalance(newBalance);
        
        // Update user data
        const currentUser = localStorage.getItem('capitalengine_user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userData.balance = newBalance;
          localStorage.setItem('capitalengine_user', JSON.stringify(userData));
        }
      }
    }
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
    
    // Update user data
    const currentUser = localStorage.getItem('capitalengine_user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      userData.balance = newBalance;
      localStorage.setItem('capitalengine_user', JSON.stringify(userData));
    }
  };

  const getAllTransactions = (): Transaction[] => {
    const globalTransactions = localStorage.getItem('capitalengine_all_transactions');
    return globalTransactions ? JSON.parse(globalTransactions) : [];
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      balance,
      addTransaction,
      updateBalance,
      updateTransactionStatus,
      getAllTransactions,
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
