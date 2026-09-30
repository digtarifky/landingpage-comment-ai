// src/app/api/demo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const globalForDemoLimits = globalThis as typeof globalThis & {
  demoRateLimits?: Map<string, { count: number; expiresAt: number }>;
};
const demoRateLimits = (globalForDemoLimits.demoRateLimits ??= new Map());
const DEMO_LIMIT = 5;
const DEMO_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const body = await req.json();
    const { scenarioText, tone } = body;

    if (!scenarioText || !tone) {
      return NextResponse.json({ error: 'Parameter tidak lengkap' }, { status: 400 });
    }

    const now = Date.now();
    const rateRecord = demoRateLimits.get(ip);
    if (rateRecord && rateRecord.expiresAt <= now) demoRateLimits.delete(ip);

    if (rateRecord && rateRecord.expiresAt > now && rateRecord.count >= DEMO_LIMIT) {
      return NextResponse.json(
        { error: 'Batas percobaan demo tercapai (5x). Beli lisensi seumur hidup untuk akses penuh tanpa batas!' },
        { status: 429 }
      );
    }

    if (demoRateLimits.size > 1000) {
      for (const [address, limit] of demoRateLimits) {
        if (limit.expiresAt <= now) demoRateLimits.delete(address);
      }
    }
    demoRateLimits.set(ip, {
      count: rateRecord && rateRecord.expiresAt > now ? rateRecord.count + 1 : 1,
      expiresAt: rateRecord && rateRecord.expiresAt > now ? rateRecord.expiresAt : now + DEMO_WINDOW_MS,
    });

    // 2. Eksekusi Model Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
      Anda adalah asisten AI toko online penjual Facebook Marketplace dan Messenger.
      Tugas: Buat 1 rekomendasi balasan chat yang singkat, persuasif, maksimal 2 kalimat.
      Gaya Balasan: ${tone}
      Pesan Calon Pembeli: "${scenarioText}"

      Kembalikan HANYA format JSON baku berikut:
      {"reply": "teks balasan Anda"}
    `;

    const result = await model.generateContent(prompt);
    const parsedData = JSON.parse(result.response.text());

    return NextResponse.json({ success: true, reply: parsedData.reply });
  } catch (error) {
    console.error('Demo API Error:', error);
    return NextResponse.json({ error: 'Gagal memproses simulasi balasan AI' }, { status: 500 });
  }
}