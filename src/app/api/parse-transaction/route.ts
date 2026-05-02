import { NextResponse } from "next/server";
import OpenAI from "openai";

function parseTransactionManually(text: string): {
  amount: number;
  category: string;
  merchant: string;
  type: "expense" | "income";
} {
  const lowerText = text.toLowerCase();
  let amount = 0;
  let type: "expense" | "income" = "expense";
  
  // Parse amount patterns
  const rbMatch = text.match(/(\d+)\s*rb/i);
  const jtMatch = text.match(/(\d+)\s*jt/i);
  const angkaMatch = text.match(/(\d{1,3}(?:\.\d{3})+|\d+)/);
  
  if (jtMatch) {
    amount = parseInt(jtMatch[1]) * 1000000;
  } else if (rbMatch) {
    amount = parseInt(rbMatch[1]) * 1000;
  } else if (angkaMatch) {
    amount = parseInt(angkaMatch[1].replace(/\./g, ""));
  }
  
  // Determine type
  if (lowerText.includes("gaji") || lowerText.includes("income") || lowerText.includes("pemasukan") || lowerText.includes("diterima")) {
    type = "income";
  }
  
  // Parse category
  let category = "lainnya";
  if (lowerText.includes("makan") || lowerText.includes("kopi") || lowerText.includes("food") || lowerText.includes("lunch") || lowerText.includes("lauk") || lowerText.includes("nasi")) {
    category = "makanan";
  } else if (lowerText.includes("minum") || lowerText.includes("drink") || lowerText.includes("tea") || lowerText.includes("coffee") || lowerText.includes("susu")) {
    category = "minuman";
  } else if (lowerText.includes("gojek") || lowerText.includes("grab") || lowerText.includes("ojol") || lowerText.includes("taxi") || lowerText.includes("transport") || lowerText.includes("bensin")) {
    category = "transport";
  } else if (lowerText.includes("belanja") || lowerText.includes("market") || lowerText.includes("super") || lowerText.includes("carrefour") || lowerText.includes("alfamart") || lowerText.includes("indomaret")) {
    category = "belanja";
  } else if (lowerText.includes("gaji") || lowerText.includes("salary") || lowerText.includes(" THR")) {
    category = "gaji";
  }
  
  // Parse merchant
  let merchant = "Unknown";
  const merchantPatterns = [
    { pattern: /di\s+([a-zA-Z]+)/i, extract: 1 },
    { pattern: /(?:ke|from|in)\s+([a-zA-Z]+)/i, extract: 1 },
  ];
  
  for (const { pattern, extract } of merchantPatterns) {
    const match = text.match(pattern);
    if (match) {
      merchant = match[extract];
      break;
    }
  }
  
  return { amount, category, merchant, type };
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback to manual parsing
      const result = parseTransactionManually(text);
      return NextResponse.json(result);
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `
Extract structured data from this Indonesian sentence:
"${text}"

Rules:
- Convert "50rb" to 50000
- Convert "1jt" to 1000000
- Category must be simple: makanan, transport, belanja, gaji, lainnya
- Type must be: expense or income

Return ONLY JSON (no explanation):
{
  "amount": number,
  "category": string,
  "merchant": string,
  "type": "expense" | "income"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let result = response.choices[0].message.content || "{}";

    // Fix JSON issue (kadang AI kasih ```json```)
    result = result.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error) {
    // Return a user-friendly error
    return NextResponse.json(
      { error: "Failed to parse transaction. Make sure OPENAI_API_KEY is set in .env.local" },
      { status: 500 }
    );
  }
}
