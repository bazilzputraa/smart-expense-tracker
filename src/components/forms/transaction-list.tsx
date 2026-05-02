"use client";

import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  type: "expense" | "income";
  note: string;
  created_at: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
}

export default function TransactionList({ transactions = [] }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      makanan: "🍔",
      minuman: "🥤",
      transport: "🚗",
      belanja: "🛒",
      gaji: "💰",
      lainnya: "📦",
    };
    return emojis[category.toLowerCase()] || "📦";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate totals
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get recent transactions (last 10)
  const recentTransactions = transactions.slice(0, 10);

  return (
    <Card className="w-full shadow-2xl border-0 overflow-hidden" style={{ borderRadius: '1.5rem' }}>
      <CardContent className="p-0">
        {/* Header with Stats */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📊</span>
            <CardTitle className="text-xl text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Riwayat Transaksi
            </CardTitle>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            {/* Income */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm">📥</span>
                <p className="text-xs text-white/80">Pemasukan</p>
              </div>
              <p className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {formatCurrency(totalIncome)}
              </p>
            </div>
            
            {/* Expense */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm">💸</span>
                <p className="text-xs text-white/80">Pengeluaran</p>
              </div>
              <p className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="p-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 font-medium text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Belum ada transaksi
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Catat transaksi pertamamu di atas! ✨
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                      transaction.type === "expense" 
                        ? "bg-red-100" 
                        : "bg-green-100"
                    }`}>
                      {transaction.type === "expense" ? "💸" : "📥"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {getCategoryEmoji(transaction.category)} {transaction.merchant}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.note} • {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right font-bold ${
                    transaction.type === "expense" ? "text-red-500" : "text-green-600"
                  }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span className="text-xs mr-1">
                      {transaction.type === "expense" ? "-" : "+"}
                    </span>
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
              
              {transactions.length > 10 && (
                <p className="text-center text-gray-400 text-sm pt-2">
                  +{transactions.length - 10} transaksi lainnya
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
