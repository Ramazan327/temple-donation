"use client";
import { useEffect, useState } from "react";
type Donation = {
  id: number;
  name: string | null;
  anonymous: boolean;
  amount: number;
  createdAt: string;
};
export default function Home() {
  const [templeName, setTempleName] = useState("");
const [applicantName, setApplicantName] = useState("");
const [phone, setPhone] = useState("");
const [requestAmount, setRequestAmount] = useState("");
const [description, setDescription] = useState("");
const [requestSent, setRequestSent] = useState(false);
const [requestError, setRequestError] = useState("");
const [requestLoading, setRequestLoading] = useState(false);

async function handleHelpRequest() {
  setRequestError("");
  setRequestSent(false);

  if (!templeName || !applicantName || !phone || !requestAmount || !description) {
    setRequestError("Заполните все поля заявки");
    return;
  }

  if (Number(requestAmount) <= 0) {
    setRequestError("Укажите корректную сумму");
    return;
  }

  try {
    setRequestLoading(true);

    const res = await fetch("/api/help-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templeName,
        applicantName,
        phone,
        amount: Number(requestAmount),
        description,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setRequestError(data.error || "Не удалось отправить заявку");
      return;
    }

    setTempleName("");
    setApplicantName("");
    setPhone("");
    setRequestAmount("");
    setDescription("");
    setRequestSent(true);
  } catch {
    setRequestError("Не удалось отправить заявку");
  } finally {
    setRequestLoading(false);
  }
}
 const goal = 300000;

 const [donationError, setDonationError] = useState("");
const [donationSuccess, setDonationSuccess] = useState("");
const [donationLoading, setDonationLoading] = useState(false);
const [donationAmount, setDonationAmount] = useState("");
const [donorName, setDonorName] = useState("");
const [anonymous, setAnonymous] = useState(true);
const [donations, setDonations] = useState<Donation[]>([]);const [totalCollected, setTotalCollected] = useState(0);
const remaining = Math.max(goal - totalCollected, 0);
const percent = Math.min(Math.round((totalCollected / goal) * 100), 100);
async function loadDonations() {
  const res = await fetch("/api/donations");
  const data = await res.json();

  setDonations(data.donations);
  setTotalCollected(data.total);
}

useEffect(() => {
  async function fetchDonations() {
    await loadDonations();
  }

  fetchDonations();
}, []);

async function handleDonate() {
  const amount = Number(donationAmount);

  setDonationError("");
  setDonationSuccess("");

  if (!amount || amount <= 0) {
    setDonationError("Введите сумму пожертвования");
    return;
  }

  if (!anonymous && !donorName.trim()) {
    setDonationError("Введите имя или выберите анонимное пожертвование");
    return;
  }

  try {
    setDonationLoading(true);

    await fetch("/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        name: donorName.trim(),
        anonymous,
      }),
    });

    setDonationAmount("");
    setDonorName("");
    setAnonymous(true);
    setDonationSuccess("Спасибо! Пожертвование добавлено.");

    await loadDonations();
  } catch {
    setDonationError("Не удалось отправить пожертвование");
  } finally {
    setDonationLoading(false);
  }
}
  return (
    <main className="bg-[#f6f7f4] min-h-screen text-[#1f2933]">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
    <div>
      <h1 className="text-lg sm:text-2xl font-bold">Название организации</h1>
      <p className="text-xs sm:text-sm text-gray-500">Помогаем храмам и людям</p>
    </div>

    <nav className="hidden lg:flex gap-8 font-medium">
      <a href="#about">О сборе</a>
      <a href="#donations">Пожертвования</a>
      <a href="#company">О нас</a>
      <a href="#request">Заявка</a>
      <a href="#contacts">Контакты</a>
    </nav>

    <a
      href="#donate"
      className="text-sm sm:text-base bg-[#4f9d3a] text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-[#448b32] transition"
    >
      Помочь
    </a>
  </div>
</header>

      {/* HERO */}
<section id="donate" className="px-4 sm:px-6 py-8 lg:py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1.7fr_0.8fr] gap-6 lg:gap-8">
    {/* PHOTO + INFO */}
    <div className="relative rounded-[26px] lg:rounded-[34px] overflow-hidden min-h-[720px] sm:min-h-[620px] lg:min-h-[680px] shadow-xl">
      <img
        src="/orig.jpg"
        alt="Храм"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute inset-0 z-10 flex items-end p-4 sm:p-6 lg:p-8">
        <div className="w-full bg-black/45 backdrop-blur-md border border-white/20 rounded-[24px] lg:rounded-[30px] p-5 sm:p-7 lg:p-9 shadow-2xl text-white">
          <span className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4">
            Благотворительный сбор
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-4">
            Ежемесячный сбор на содержание Свято-Троицкого храма
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed mb-6">
            Благодаря вашей поддержке храм может ежедневно принимать прихожан,
            проводить богослужения и сохранять духовные традиции православной общины.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <p className="text-white/70 mb-1">Собрано</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-[#6fd65f]">
                {totalCollected.toLocaleString("ru-RU")} ₽
              </h3>
            </div>

            <div>
              <p className="text-white/70 mb-1">Осталось</p>
              <h3 className="text-2xl lg:text-3xl font-bold">
                {remaining.toLocaleString("ru-RU")} ₽
              </h3>
            </div>

            <div>
              <p className="text-white/70 mb-1">Необходимо</p>
              <h3 className="text-2xl lg:text-3xl font-bold">
                {goal.toLocaleString("ru-RU")} ₽
              </h3>
            </div>
          </div>

          <div className="h-4 bg-white/25 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[#4f9d3a]"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-white/70">Прогресс сбора</p>
            <p className="text-2xl font-bold text-[#6fd65f]">{percent}%</p>
          </div>
        </div>
      </div>
    </div>

    {/* DONATION FORM */}
    <div className="bg-white rounded-[26px] lg:rounded-[34px] p-5 sm:p-8 lg:p-10 shadow-xl">
      <h2 className="text-2xl lg:text-3xl font-bold mb-6">Пожертвовать</h2>

      <p className="font-medium mb-4">Выберите сумму</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {[100, 300, 500, 1000, 5000].map((amount) => (
          <button
            key={amount}
            onClick={() => setDonationAmount(String(amount))}
            className={`border rounded-2xl py-4 font-semibold transition ${
              donationAmount === String(amount)
                ? "border-[#4f9d3a] bg-[#eef7eb] text-[#4f9d3a]"
                : "hover:border-[#4f9d3a] hover:text-[#4f9d3a]"
            }`}
          >
            {amount.toLocaleString("ru-RU")} ₽
          </button>
        ))}
      </div>

      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        placeholder="Введите сумму"
        className="w-full border rounded-2xl px-5 py-4 mb-5 outline-none focus:border-[#4f9d3a]"
      />

      <label className="font-medium block mb-3">Ваше имя</label>

      <input
        type="text"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        disabled={anonymous}
        placeholder="Имя"
        className="w-full border rounded-2xl px-5 py-4 mb-5 outline-none focus:border-[#4f9d3a] disabled:bg-gray-100"
      />

      <label className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="w-5 h-5"
        />
        <span>Пожертвовать анонимно</span>
      </label>
{donationError && (
  <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-5 font-semibold">
    {donationError}
  </div>
)}

{donationSuccess && (
  <div className="bg-[#eef7eb] text-[#4f9d3a] rounded-2xl p-4 mb-5 font-semibold">
    {donationSuccess}
  </div>
)}
      <button
  onClick={handleDonate}
  disabled={donationLoading}
  className="w-full bg-[#4f9d3a] text-white py-5 rounded-2xl text-lg lg:text-xl font-bold hover:bg-[#448b32] transition disabled:opacity-60 disabled:cursor-not-allowed"
>
  {donationLoading ? "Отправляем..." : "Помочь сейчас"}
</button> 

      <p className="text-center text-gray-400 text-sm mt-6">
        Безопасная оплата через ЮKassa
      </p>

      <div className="mt-6 flex justify-center gap-4 text-gray-500 font-bold">
        <span>ЮKassa</span>
        <span>МИР</span>
      </div>
    </div>
  </div>
</section>
{/* WHERE MONEY GOES */}
<section id="about" className="px-6 py-16">
  <div className="max-w-7xl mx-auto">
    <div className="mb-10">
      <p className="text-[#4f9d3a] font-bold mb-3">На что идут средства</p>

      <h2 className="text-4xl lg:text-5xl font-bold">
        Ваша помощь поддерживает жизнь храма
      </h2>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          icon: "⛪",
          title: "Богослужения",
          text: "Поддержка регулярных служб в субботние, воскресные и праздничные дни.",
        },
        {
          icon: "💡",
          title: "Коммунальные расходы",
          text: "Оплата электричества, отопления, воды и других необходимых расходов.",
        },
        {
          icon: "🌿",
          title: "Благоустройство",
          text: "Уход за территорией храма, уборка и поддержание порядка.",
        },
        {
          icon: "🤝",
          title: "Приходская жизнь",
          text: "Развитие общины, помощь прихожанам и проведение приходских мероприятий.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-[28px] p-7 shadow-lg hover:-translate-y-2 transition"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#eef7eb] flex items-center justify-center text-3xl mb-6">
            {item.icon}
          </div>

          <h3 className="text-2xl font-bold mb-4">{item.title}</h3>

          <p className="text-gray-600 leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
{/* DONATIONS */}
<section id="donations" className="px-4 sm:px-6 py-14 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="mb-10">
      <p className="text-[#4f9d3a] font-bold mb-3">
        Поддержка прихода
      </p>

      <h2 className="text-4xl lg:text-5xl font-bold">
        Последние пожертвования
      </h2>

      <p className="text-gray-600 mt-4 max-w-2xl">
        Благодарим всех, кто помогает Свято-Троицкому храму
        села Кощаково сохранять и развивать приходскую жизнь.
      </p>
    </div>

    <div className="bg-[#f7f8f5] rounded-[32px] p-8 shadow-lg">
      <div className="space-y-4">
        {donations.map((donation) => (
  <div key={donation.id} className="bg-white rounded-2xl px-5 py-4 flex items-center border border-gray-100">
    <div className="flex items-center gap-2">

      <div>
        <p className="font-semibold text-lg truncate">
          {donation.anonymous ? "Анонимно" : donation.name}
        </p>
      </div>
    </div>

    <div className="ml-auto bg-[#4f9d3a] text-white px-5 py-3 rounded-xl font-bold whitespace-nowrap text-lg min-w-[130px] text-center">
      {donation.amount.toLocaleString("ru-RU")} ₽
    </div>
  </div>
))}
      </div>
    </div>
  </div>
</section>
{/* ABOUT TEMPLE */}
<section id="company" className="px-4 sm:px-6 py-14 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-[34px] p-6 lg:p-10 shadow-xl">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div>
          <p className="text-[#4f9d3a] font-bold mb-3">О храме</p>

          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Свято-Троицкий храм села Кощаково
          </h2>

          <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              До революции в селе Кощаково действовала деревянная церковь
              Живоначальной Троицы, построенная в 1751 году, которая не
              сохранилась до наших дней.
            </p>

            <p>
              В начале XX века в селе началось строительство каменного храма,
              но в связи с революцией оно так и не было завершено. Служивший
              в селе священник отец Василий был расстрелян 28 февраля 1930 года.
            </p>

            <p>
              Нынешний каменный храм Живоначальной Троицы был построен в 1994
              году силами прихожан. Первым настоятелем возрожденного храма стал
              отец Игорь Петрущенков.
            </p>

            <p>
              С 1995 года в храме совершаются регулярные богослужения в
              субботние, воскресные и праздничные дни.
            </p>
          </div>
        </div>

        {/* IMAGE */}
        <div className="hidden lg:block relative rounded-[28px] overflow-hidden min-h-[520px] shadow-lg">
  <img
    src="/image-info.webp"
    alt="Свято-Троицкий храм"
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>
      </div>
    </div>
  </div>
</section>
{/* ABOUT COMPANY */}
<section id="about-company" className="px-4 sm:px-6 py-14 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="bg-[#f6f7f4] rounded-[34px] p-6 lg:p-12 shadow-xl">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
        {/* LOGO PLACEHOLDER */}
<div className="hidden lg:flex bg-white rounded-[30px] p-10 min-h-[420px] flex-col items-center justify-center text-center shadow-lg">
          <div className="w-28 h-28 rounded-full bg-[#eef7eb] flex items-center justify-center text-5xl mb-6">
            🤲
          </div>

          <h3 className="text-[#4f9d3a] text-lg font-semibold mb-3">
            Название организации
          </h3>

          <p className="text-gray-500 leading-relaxed">
            Логотип и официальное название будут добавлены позже
          </p>
        </div>

        {/* TEXT */}
        <div>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
            О нашей организации
          </p>

          <h2 className="hidden lg:block text-4xl lg:text-5xl font-bold mb-6">
  Помогаем храмам собирать средства открыто и удобно
</h2>

          <p className="hidden lg:block text-gray-600 text-lg leading-relaxed mb-8">
            Наша организация создаёт удобную платформу для поддержки храмов,
            приходов и благотворительных инициатив. Мы помогаем людям быстро
            и безопасно сделать пожертвование, а храмам — прозрачно показывать
            ход сбора и рассказывать, на какие нужды направляется помощь.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "Прозрачность",
                text: "Показываем сумму сбора, последние пожертвования и цель помощи.",
              },
              {
                title: "Удобство",
                text: "Пожертвование можно сделать быстро с телефона или по QR-коду.",
              },
              {
                title: "Поддержка",
                text: "Помогаем храмам оформлять сборы и принимать заявки на помощь.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h3 className="text-xl font-bold mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* HELP REQUEST */}
<section id="request" className="px-4 sm:px-6 py-14 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
      <div>
        <p className="text-[#4f9d3a] font-bold mb-3">Заявка на помощь</p>

        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Нужна помощь для храма?
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Оставьте заявку, если храму нужна помощь в сборе средств.
          Мы свяжемся с вами, уточним детали и рассмотрим возможность
          размещения сбора на сайте.
        </p>

        
      </div>

      <div className="bg-white rounded-[34px] p-8 lg:p-10 shadow-xl">
        <h3 className="text-3xl font-bold mb-6">
          Оставить заявку
        </h3>

        {requestSent && (
          <div className="bg-[#eef7eb] text-[#4f9d3a] rounded-2xl p-4 mb-5 font-semibold">
            Заявка отправлена. Мы свяжемся с вами после рассмотрения.
          </div>
        )}
        {requestError && (
  <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-5 font-semibold">
    {requestError}
  </div>
)}

        <input
          value={templeName}
          onChange={(e) => setTempleName(e.target.value)}
          type="text"
          placeholder="Название храма / проекта"
          className="w-full border rounded-2xl px-5 py-4 mb-4 outline-none focus:border-[#4f9d3a]"
        />

        <input
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
          type="text"
          placeholder="Ваше имя"
          className="w-full border rounded-2xl px-5 py-4 mb-4 outline-none focus:border-[#4f9d3a]"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="Номер телефона"
          className="w-full border rounded-2xl px-5 py-4 mb-4 outline-none focus:border-[#4f9d3a]"
        />

        <input
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
          type="number"
          placeholder="Необходимая сумма"
          className="w-full border rounded-2xl px-5 py-4 mb-4 outline-none focus:border-[#4f9d3a]"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опишите, на что нужна помощь"
          rows={5}
          className="w-full border rounded-2xl px-5 py-4 mb-6 outline-none focus:border-[#4f9d3a] resize-none"
        />

        <button
  onClick={handleHelpRequest}
  disabled={requestLoading}
  className="w-full bg-[#4f9d3a] text-white py-5 rounded-2xl text-lg font-bold hover:bg-[#448b32] transition disabled:opacity-60 disabled:cursor-not-allowed"
>
  {requestLoading ? "Отправляем..." : "Отправить заявку"}
</button>

        <p className="text-gray-400 text-sm text-center mt-5">
          Отправляя заявку, вы соглашаетесь на обработку контактных данных.
        </p>
      </div>
    </div>
  </div>
</section>
{/* FOOTER */}
<footer id="contacts" className="bg-[#1f1f1f] text-white px-6 py-16">
  <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
    <div>
      <h3 className="text-3xl font-bold mb-4">
        Название организации
      </h3>

      <p className="text-gray-400 leading-relaxed">
        Платформа для поддержки храмов, приходов и благотворительных
        инициатив.
      </p>
    </div>

    <div>
      <h4 className="text-xl font-bold mb-4">Навигация</h4>

      <ul className="space-y-3 text-gray-400">
        <li><a href="#donate" className="hover:text-white">Пожертвовать</a></li>
        <li><a href="#about" className="hover:text-white">На что идут средства</a></li>
        <li><a href="#donations" className="hover:text-white">Пожертвования</a></li>
        <li><a href="#request" className="hover:text-white">Оставить заявку</a></li>
      </ul>
    </div>

    <div>
      <h4 className="text-xl font-bold mb-4">Храм</h4>

      <ul className="space-y-3 text-gray-400">
        <li>Свято-Троицкий храм</li>
        <li>село Кощаково</li>
        <li>Пестречинский район</li>
        <li>Республика Татарстан</li>
      </ul>
    </div>

    <div>
      <h4 className="text-xl font-bold mb-4">Контакты</h4>

      <ul className="space-y-3 text-gray-400">
        <li>с. Кощаково, ул. Декабристов, 3А</li>
        <li>+7 (843) 258-73-34</li>
        <li>Настоятель: о. Ярослав Петрущенков</li>
      </ul>
    </div>
  </div>

  <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4 text-gray-500">
    <p>© 2026 Название организации. Все права защищены.</p>

    <div className="flex gap-6">
      <a href="#" className="hover:text-white">
        Политика конфиденциальности
      </a>

      <a href="#" className="hover:text-white">
        Публичная оферта
      </a>
    </div>
  </div>
</footer>
    </main>
  );
}