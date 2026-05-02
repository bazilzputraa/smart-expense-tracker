"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

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

  const getTypeIcon = (type: string) => {
    return type === "expense" ? "💸" : "📥";
  };

  const getTypeLabel = (type: string) => {
    return type === "expense" ? "Pengeluaran" : "Pemasukan";
  };

  const getTypeGradient = (type: string) => {
    return type === "expense" 
      ? "from-red-500 to-pink-500" 
      : "from-green-500 to-teal-500";
  };

  return (
    <Card className="w-full shadow-2xl border-0 overflow-hidden" style={{ borderRadius: '1.5rem' }}>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-white/80 text-sm font-semibold ml-1">
                ✏️ Catat Transaksi
              </label>
              <Input
                placeholder="Contoh: Gaji bulan ini 10jt atau Beli kopi 25rb"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-14 text-lg bg-white/90 border-2 border-white/20 focus:border-pink-400 transition-all rounded-2xl mt-2"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !text.trim()}
              className="h-14 text-lg font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🌀</span> Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🔍 Analisis & Simpan
                </span>
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="px-6 pb-6">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 text-sm font-medium">
              ⚠️ {error}
            </div>
          </div>
        )}

        {result && (
          <div className="px-6 pb-6">
            <div className="p-5 bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl border-2 border-yellow-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Hasil Analisis
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Amount */}
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 font-medium">Jumlah</p>
                  <p className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {formatCurrency(result.amount)}
                  </p>
                </div>
                
                {/* Type */}
                <div className={`p-4 bg-gradient-to-r ${getTypeGradient(result.type)} rounded-2xl shadow-sm`}>
                  <p className="text-xs text-white/80">Jenis</p>
                  <p className="text-lg font-bold text-white">
                    {getTypeIcon(result.type)} {getTypeLabel(result.type)}
                  </p>
                </div>
                
                {/* Category */}
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 font-medium">Kategori</p>
                  <p className="font-semibold text-gray-700">
                    {getCategoryEmoji(result.category)} {result.category}
                  </p>
                </div>
                
                {/* Merchant */}
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 font-medium">Merchant</p>
                  <p className="font-semibold text-gray-700">{result.merchant}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tips */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>💡</span>
            <span>Tips: Ketik "gaji" untuk pemasukan, "beli" untuk pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
