import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendTelegramMessage } from "@/lib/telegram";


export async function GET() {
  const requests = await prisma.helpRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(requests);
}

export async function POST(req: Request) {
    const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0] ||
  req.headers.get("x-real-ip") ||
  "unknown";

const limit = rateLimit(`help-request:${ip}`, 3, 60 * 60 * 1000);

if (!limit.success) {
  return NextResponse.json(
    { error: "Слишком много заявок. Попробуйте позже." },
    { status: 429 }
  );
}
  const body = await req.json();
  const templeName = String(body.templeName || "").trim();
const applicantName = String(body.applicantName || "").trim();
const phone = String(body.phone || "").trim();
const description = String(body.description || "").trim();
const amount = Number(body.amount);

if (
  templeName.length < 3 ||
  templeName.length > 120
) {
  return NextResponse.json(
    { error: "Некорректное название храма" },
    { status: 400 }
  );
}

if (
  applicantName.length < 2 ||
  applicantName.length > 60
) {
  return NextResponse.json(
    { error: "Некорректное имя" },
    { status: 400 }
  );
}

if (
  phone.length < 10 ||
  phone.length > 20
) {
  return NextResponse.json(
    { error: "Некорректный телефон" },
    { status: 400 }
  );
}

if (
  description.length < 10 ||
  description.length > 1000
) {
  return NextResponse.json(
    { error: "Описание должно быть от 10 до 1000 символов" },
    { status: 400 }
  );
}

if (
  !Number.isFinite(amount) ||
  amount < 1000 ||
  amount > 50000000
) {
  return NextResponse.json(
    { error: "Некорректная сумма" },
    { status: 400 }
  );
}
const phoneRegex = /^[0-9+\-\s()]+$/;

if (!phoneRegex.test(phone)) {
  return NextResponse.json(
    { error: "Некорректный номер телефона" },
    { status: 400 }
  );
}

  const request = await prisma.helpRequest.create({
    data: {
      templeName: body.templeName,
      applicantName: body.applicantName,
      phone: body.phone,
      amount: Number(body.amount),
      description: body.description,
    },
  });

  await sendTelegramMessage(
  `📩 Новая заявка на помощь\n\n` +
    `Храм: ${templeName}\n` +
    `Имя: ${applicantName}\n` +
    `Телефон: ${phone}\n` +
    `Сумма: ${amount.toLocaleString("ru-RU")} ₽\n\n` +
    `Описание: ${description}`
);

  return NextResponse.json(request);
}