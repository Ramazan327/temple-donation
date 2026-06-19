import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  await sendTelegramMessage(
    "✅ Тестовое сообщение с сайта храма"
  );

  return NextResponse.json({
    success: true,
  });
}