import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const donations = await prisma.donation.findMany({
  where: {
    createdAt: {
      gte: startOfMonth,
      lt: startOfNextMonth,
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 10,
});

  const total = donations.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return NextResponse.json({
    donations,
    total,
  });
}

export async function POST(req: Request) {
    const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0] ||
  req.headers.get("x-real-ip") ||
  "unknown";

const limit = rateLimit(`donation:${ip}`, 5, 60 * 1000);

if (!limit.success) {
  return NextResponse.json(
    { error: "Слишком много попыток. Попробуйте позже." },
    { status: 429 }
  );
}
  const body = await req.json();
  const amount = Number(body.amount);
const name = String(body.name || "").trim();
const anonymous = Boolean(body.anonymous);

if (!Number.isFinite(amount) || amount < 10 || amount > 1000000) {
  return NextResponse.json(
    { error: "Некорректная сумма" },
    { status: 400 }
  );
}

if (!anonymous) {
  if (name.length < 2 || name.length > 50) {
    return NextResponse.json(
      { error: "Имя должно содержать от 2 до 50 символов" },
      { status: 400 }
    );
  }
}

  const donation = await prisma.donation.create({
    data: {
      amount,
  name: anonymous ? null : name,
  anonymous,
    },
  });

  await sendTelegramMessage(
  `💚 Новое пожертвование\n\n` +
    `Имя: ${anonymous ? "Анонимно" : name}\n` +
    `Сумма: ${amount.toLocaleString("ru-RU")} ₽`
);

  return NextResponse.json(donation);
}