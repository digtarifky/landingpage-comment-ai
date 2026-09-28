// src/app/api/demo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const body = await req.json();
    const { scenarioText, tone } = body;

    if (!scenarioText || !tone) {
      return NextResponse.json({ error: 'Parameter tidak lengkap' }, { status: 400 });
    }

    // 1. Cek Batas Percobaan IP di Database Supabase
    const rateRecord = await prisma.demoRateLimit.findUnique({
      where: { ipAddress: ip },
    });

    if (rateRecord && rateRecord.requestCount >= 5) {
      return NextResponse.json(
        { error: 'Batas percobaan demo tercapai (5x). Beli lisensi seumur hidup untuk akses penuh tanpa batas!' },
        { status: 429 }
      );
    }

    // Update atau buat catatan limit IP
    if (rateRecord) {
      await prisma.demoRateLimit.update({
        where: { ipAddress: ip },
        data: { requestCount: { increment: 1 } },
      });
    } else {
      await prisma.demoRateLimit.create({
        data: { ipAddress: ip, requestCount: 1 },
      });
    }

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