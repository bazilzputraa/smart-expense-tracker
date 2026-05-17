"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ParsedTransaction {
  amount: number;
  category: string;
  merchant: string;
  type: "expense" | "income";
}

interface TransactionInputProps {
  onTransactionAdded?: (transaction: ParsedTransaction & { note: string }) => void;
}

export default function TransactionInput({ onTransactionAdded }: TransactionInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedTransaction | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/parse-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memproses transaksi");
      }

      setResult(data);

      if (onTransactionAdded) {
        onTransactionAdded({ ...data, note: text });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Contoh: Gaji bulan ini 10jt atau Beli kopi 25rb"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 h-11 text-base bg-gray-50 border-gray-200 focus:border-amber-400 rounded-lg"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !text.trim()}
            className="h-11 px-5 font-semibold rounded-lg shrink-0 bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-sm">🌀</span> Memproses...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                🔍 Analisis
              </span>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="mt-3 p-4 bg-amber-50/80 border border-amber-100 rounded-lg">
          <p className="text-xs font-medium text-amber-700 mb-2 flex items-center gap-1">
            <span>✅</span> Hasil Analisis
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500">Jumlah</p>
              <p className="text-sm font-bold text-gray-800">{formatCurrency(result.amount)}</p>
            </div>
            <div className={`rounded-lg p-2.5 ${result.type === "expense" ? "bg-rose-50" : "bg-emerald-50"}`}>
              <p className="text-[10px] text-gray-500">Jenis</p>
              <p className="text-sm font-semibold text-gray-800">
                {result.type === "expense" ? "💸 Pengeluaran" : "📥 Pemasukan"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500">Kategori</p>
              <p className="text-sm font-semibold text-gray-700">
                {getCategoryEmoji(result.category)} {result.category}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500">Merchant</p>
              <p className="text-sm font-semibold text-gray-700">{result.merchant}</p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
        <span>💡</span> Tips: Ketik &quot;gaji&quot; untuk pemasukan, &quot;beli&quot; untuk pengeluaran
      </p>
    </div>
  );
}
