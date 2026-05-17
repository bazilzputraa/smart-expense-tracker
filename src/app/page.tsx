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

function SavingsRing({ rate, size = 72 }: { rate: number; size?: number }) {
  const r = size * 0.42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(Math.max(rate, 0), 100) / 100);
  const strokeWidth = size * 0.08;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-emerald-400 transition-all duration-700"
      />
    </svg>
  );
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

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;
  const hasTransactions = transactions.length > 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#f5f3f0]">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

          {/* Brand */}
          <div className="md:col-span-2 bg-white rounded-xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🐷</span>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-800">
                Piggy
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Yuk, menabung dengan cara yang lebih menyenangkan!
            </p>
          </div>

          {/* Savings rate */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className={hasTransactions ? "text-emerald-500" : "text-gray-300"}>
                <SavingsRing rate={savingsRate} size={72} />
              </div>
              <div className="text-center">
                <span className={`text-2xl font-bold font-heading ${hasTransactions ? "text-gray-800" : "text-gray-300"}`}>
                  {savingsRate}%
                </span>
                <p className="text-xs text-gray-400 mt-0.5">tingkat menabung</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="md:col-span-3 grid grid-cols-3 gap-3 md:gap-4">
            {/* Income */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">📥</span>
                <p className="text-xs font-medium text-gray-500">Pemasukan</p>
              </div>
              <p className="font-heading text-sm md:text-base font-bold text-emerald-700 truncate">
                {hasTransactions ? fmt(totalIncome) : "—"}
              </p>
            </div>

            {/* Expense */}
            <div className="bg-gradient-to-br from-rose-50/80 to-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">💸</span>
                <p className="text-xs font-medium text-gray-500">Pengeluaran</p>
              </div>
              <p className="font-heading text-sm md:text-base font-bold text-rose-600 truncate">
                {hasTransactions ? fmt(totalExpense) : "—"}
              </p>
            </div>

            {/* Balance */}
            <div className="bg-gradient-to-br from-amber-50/80 to-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">💰</span>
                <p className="text-xs font-medium text-gray-500">Saldo</p>
              </div>
              <p className={`font-heading text-sm md:text-base font-bold truncate ${savings >= 0 ? "text-amber-700" : "text-rose-600"}`}>
                {hasTransactions ? fmt(savings) : "—"}
              </p>
            </div>
          </div>

          {/* Transaction Input */}
          <div className="md:col-span-3 bg-white rounded-xl p-5 md:p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <span>✏️</span> Catat Transaksi
            </h2>
            <TransactionInput onTransactionAdded={handleTransactionAdded} />
          </div>

          {/* Transaction List */}
          <div className="md:col-span-3 bg-white rounded-xl p-5 md:p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <span>📊</span> Riwayat Transaksi
            </h2>
            <TransactionList transactions={transactions} />
          </div>

        </div>

        <footer className="text-center mt-6 text-gray-400 text-xs">
          <p>© 2026 Piggy • Saving Apps</p>
        </footer>
      </div>
    </div>
  );
}
