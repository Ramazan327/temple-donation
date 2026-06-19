import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0] ||
  req.headers.get("x-real-ip") ||
  "unknown";

const limit = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);

if (!limit.success) {
  return NextResponse.json(
    { error: "Слишком много попыток входа. Попробуйте позже." },
    { status: 429 }
  );
}
  const body = await req.json();

  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Неверный пароль" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", process.env.ADMIN_SECRET || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}