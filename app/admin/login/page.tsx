"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError("Неверный пароль");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] flex items-center justify-center px-6">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Вход в админку</h1>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-5 font-semibold">
            {error}
          </div>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full border rounded-2xl px-5 py-4 mb-5 outline-none focus:border-[#4f9d3a]"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#4f9d3a] text-white py-4 rounded-2xl font-bold"
        >
          Войти
        </button>
      </div>
    </main>
  );
}