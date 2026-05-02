"use client";

import { useState } from "react";
import TransactionInput from "../components/forms/transaction-input";
import TransactionList from "../components/forms/transaction-list";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  type: "expense" | "income";
  note: string;
  created_at: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleTransactionAdded = (transaction: { amount: number; category: string; merchant: string; type: "expense" | "income"; note: string }) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: transaction.amount,
      category: transaction.category,
      merchant: transaction.merchant,
      type: transaction.type,
      note: transaction.note,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // Calculate savings progress
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-1/3 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating emojis */}
        <div className="absolute top-20 right-1/4 text-4xl animate-bounce opacity-30">💰</div>
        <div className="absolute top-40 left-1/3 text-3xl animate-bounce delay-300 opacity-30">🐷</div>
        <div className="absolute bottom-40 right-1/2 text-3xl animate-bounce delay-500 opacity-30">✨</div>
        <div className="absolute top-1/2 left-20 text-2xl animate-bounce delay-700 opacity-30">🌟</div>
      </div>

      <div className="relative max-w-3xl mx-auto p-6 pb-20">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-semibold text-white">🎯 Smart Savings Tracker</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Piggy 💎
          </h1>
          <p className="text-white/90 text-lg font-medium">
            Yuk, menabung dengan cara yang lebih menyenangkan! 🎉
          </p>
        </header>

        {/* Savings Progress Card */}
        {transactions.length > 0 && (
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-white/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Tabungan 💰</p>
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(savings)}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${savingsRate >= 20 ? 'text-yellow-300' : savingsRate >= 10 ? 'text-white' : 'text-pink-200'}`}>
                    {savingsRate}%
                  </div>
                  <p className="text-white/70 text-xs">tingkat menabung</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-300 to-green-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-3 text-xs text-white/70">
                <span>💚 Target: 20%</span>
                <span>🎉 Hebat: 50%+</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="space-y-6">
          <TransactionInput onTransactionAdded={handleTransactionAdded} />
          <TransactionList transactions={transactions} />
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/60 text-sm">
          <p>✨ Dibuat dengan ❤️ • Gratis untuk Portofolio!</p>
        </footer>
      </div>
    </div>
  );
}
