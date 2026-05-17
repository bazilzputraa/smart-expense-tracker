"use client";

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

  const recentTransactions = transactions.slice(0, 10);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3 opacity-60">📝</div>
        <p className="text-gray-500 font-medium text-sm">Belum ada transaksi</p>
        <p className="text-gray-400 text-xs mt-0.5">Catat transaksi pertamamu di atas!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {recentTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
                transaction.type === "expense" ? "bg-rose-100" : "bg-emerald-100"
              }`}
            >
              {transaction.type === "expense" ? "💸" : "📥"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {getCategoryEmoji(transaction.category)} {transaction.merchant}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {transaction.note}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p
              className={`text-sm font-bold ${
                transaction.type === "expense" ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {transaction.type === "expense" ? "−" : "+"}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-[10px] text-gray-400">{formatDate(transaction.created_at)}</p>
          </div>
        </div>
      ))}

      {transactions.length > 10 && (
        <p className="text-center text-gray-400 text-xs pt-2">
          +{transactions.length - 10} transaksi lainnya
        </p>
      )}
    </div>
  );
}
