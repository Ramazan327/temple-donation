import { prisma } from "@/lib/prisma";
import LogoutButton from "./logout-button";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const donations = await prisma.donation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const requests = await prisma.helpRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = donations.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
  <h1 className="text-4xl font-bold">
    Админ-панель
  </h1>

  <LogoutButton />
</div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow">
            <p className="text-gray-500 mb-2">Всего пожертвований</p>
            <h2 className="text-3xl font-bold">
              {total.toLocaleString("ru-RU")} ₽
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <p className="text-gray-500 mb-2">Количество платежей</p>
            <h2 className="text-3xl font-bold">{donations.length}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <p className="text-gray-500 mb-2">Заявки на помощь</p>
            <h2 className="text-3xl font-bold">{requests.length}</h2>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-6 shadow mb-10">
          <h2 className="text-2xl font-bold mb-6">Пожертвования</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 pr-4">Имя</th>
                  <th className="py-4 pr-4">Сумма</th>
                  <th className="py-4 pr-4">Анонимно</th>
                  <th className="py-4 pr-4">Дата</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="py-4 pr-4">
                      {donation.anonymous ? "Анонимно" : donation.name}
                    </td>
                    <td className="py-4 pr-4 font-bold">
                      {donation.amount.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="py-4 pr-4">
                      {donation.anonymous ? "Да" : "Нет"}
                    </td>
                    <td className="py-4 pr-4">
                      {new Date(donation.createdAt).toLocaleString("ru-RU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow">
          <h2 className="text-2xl font-bold mb-6">Заявки на помощь</h2>

          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-2xl p-5 bg-[#f6f7f4]"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h3 className="text-xl font-bold">{request.templeName}</h3>

                  <span className="bg-[#4f9d3a] text-white px-4 py-2 rounded-xl font-bold w-fit">
                    {request.amount.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <p className="text-gray-600 mb-2">
                  <b>Имя:</b> {request.applicantName}
                </p>

                <p className="text-gray-600 mb-2">
                  <b>Телефон:</b> {request.phone}
                </p>

                <p className="text-gray-600 mb-2">
                  <b>Описание:</b> {request.description}
                </p>

                <p className="text-gray-400 text-sm">
                  {new Date(request.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}