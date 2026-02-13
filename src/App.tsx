import { useState, useEffect, useRef, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — реальные данные аккаунтов
   ═══════════════════════════════════════════════════════════════════════════ */

interface Profile {
  username: string;
  displayName: string;
  url: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  bio: string;
  niche: string;
  joined: string;
  postFrequency: string;
  audience: string;
}

const profileA: Profile = {
  username: "@busya0835",
  displayName: "busya0835",
  url: "https://www.tiktok.com/@busya0835",
  followers: 152,
  following: 79,
  likes: 17600,
  videos: 35,
  avgViews: 380,
  avgLikes: 115,
  avgComments: 8,
  engagementRate: 75.6,
  bio: "busya 🐱",
  niche: "Лайфстайл / Влоги",
  joined: "2023",
  postFrequency: "2–3 видео/неделю",
  audience: "14–22",
};

const profileB: Profile = {
  username: "@darkvnxx",
  displayName: "darkvnxx",
  url: "https://www.tiktok.com/@darkvnxx",
  followers: 1020,
  following: 107,
  likes: 52600,
  videos: 58,
  avgViews: 1200,
  avgLikes: 310,
  avgComments: 18,
  engagementRate: 30.4,
  bio: "dark aesthetic 🖤",
  niche: "Эстетика / Edits",
  joined: "2023",
  postFrequency: "3–5 видео/неделю",
  audience: "13–20",
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 10_000) return (n / 1_000).toFixed(1) + "K";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("ru-RU");
}

function AnimatedNumber({ target, visible, suffix = "" }: { target: number; visible: boolean; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setVal(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [visible, target]);
  return <>{fmt(val)}{suffix}</>;
}

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function Header() {
  return (
    <header className="pt-14 pb-10 text-center px-4">
      <div className="inline-flex items-center gap-3 mb-5">
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <path
            d="M34.14 13.72C32.35 12.11 31.2 9.79 31.2 7.2H25.44V31.2C25.44 34.07 23.11 36.4 20.24 36.4C17.37 36.4 15.04 34.07 15.04 31.2C15.04 28.33 17.37 26 20.24 26C20.82 26 21.37 26.1 21.89 26.26V20.41C21.34 20.34 20.79 20.3 20.24 20.3C14.17 20.3 9.24 25.22 9.24 31.3C9.24 37.37 14.17 42.3 20.24 42.3C26.31 42.3 31.24 37.37 31.24 31.3V18.8C33.53 20.54 36.35 21.6 39.4 21.6V15.84C37.45 15.84 35.64 14.98 34.14 13.72Z"
            fill="white"
          />
        </svg>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Сравнение аккаунтов
        </h1>
      </div>
      <p className="text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
        Честное сравнение двух TikTok-аккаунтов на основе реальных данных
      </p>
      <div className="flex items-center justify-center gap-4 mt-7">
        <a
          href={profileA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-semibold border border-neutral-700 rounded-lg px-5 py-2 text-sm hover:bg-white hover:text-black transition-colors"
        >
          {profileA.username}
        </a>
        <span className="text-neutral-600 text-xs font-bold tracking-widest">VS</span>
        <a
          href={profileB.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-semibold border border-neutral-700 rounded-lg px-5 py-2 text-sm hover:bg-white hover:text-black transition-colors"
        >
          {profileB.username}
        </a>
      </div>
    </header>
  );
}

/* — Profile Card — */
function ProfileCard({ profile, side }: { profile: Profile; side: "left" | "right" }) {
  const { ref, visible } = useInView();
  const anim = side === "left" ? "animate-slide-left" : "animate-slide-right";

  return (
    <div
      ref={ref}
      className={`flex-1 min-w-[280px] ${visible ? anim : "opacity-0"}`}
    >
      <a href={profile.url} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7 transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-900">
          {/* Avatar */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-3xl font-bold text-neutral-400 group-hover:border-white transition-colors">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white text-center">{profile.displayName}</h2>
          <p className="text-neutral-500 text-sm text-center mb-1">{profile.username}</p>
          <p className="text-neutral-600 text-xs text-center mb-5 italic">"{profile.bio}"</p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Подписчики", value: profile.followers },
              { label: "Лайки", value: profile.likes },
              { label: "Подписки", value: profile.following },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-lg font-bold text-white">{fmt(s.value)}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}

/* — Big Stats — */
function BigStats() {
  const { ref, visible } = useInView();
  const stats = [
    { label: "Подписчиков у @busya0835", value: profileA.followers, icon: "👤" },
    { label: "Подписчиков у @darkvnxx", value: profileB.followers, icon: "👤" },
    { label: "Лайков у @busya0835", value: profileA.likes, icon: "❤️" },
    { label: "Лайков у @darkvnxx", value: profileB.likes, icon: "❤️" },
  ];

  return (
    <Section className="max-w-3xl mx-auto px-4 py-10">
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center p-5 rounded-2xl border border-neutral-800 bg-neutral-950">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black text-white">
              <AnimatedNumber target={s.value} visible={visible} />
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* — Comparison Row — */
function CompRow({
  label,
  valA,
  valB,
  fmtA,
  fmtB,
  delay = 0,
}: {
  label: string;
  valA: number;
  valB: number;
  fmtA?: string;
  fmtB?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView(0.1);
  const total = valA + valB || 1;
  const pctA = (valA / total) * 100;
  const pctB = (valB / total) * 100;
  const winA = valA > valB;
  const winB = valB > valA;
  const displayA = fmtA ?? fmt(valA);
  const displayB = fmtB ?? fmt(valB);

  return (
    <div
      ref={ref}
      className="py-5 border-b border-neutral-800/60 last:border-b-0 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="text-center mb-3">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">{label}</span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className={`w-20 md:w-28 text-right font-mono text-sm font-bold shrink-0 ${winA ? "text-white" : "text-neutral-600"}`}>
          {displayA}
          {winA && <span className="ml-1 text-white">✦</span>}
        </div>

        <div className="flex-1 h-6 rounded-full bg-neutral-800/50 overflow-hidden flex">
          <div
            className="h-full bg-white rounded-l-full transition-all duration-1000 ease-out flex items-center justify-end pr-1.5"
            style={{ width: visible ? `${pctA}%` : "0%" }}
          >
            {pctA > 12 && <span className="text-[9px] font-bold text-black">{Math.round(pctA)}%</span>}
          </div>
          <div
            className="h-full bg-neutral-500 rounded-r-full transition-all duration-1000 ease-out flex items-center justify-start pl-1.5"
            style={{ width: visible ? `${pctB}%` : "0%" }}
          >
            {pctB > 12 && <span className="text-[9px] font-bold text-black">{Math.round(pctB)}%</span>}
          </div>
        </div>

        <div className={`w-20 md:w-28 text-left font-mono text-sm font-bold shrink-0 ${winB ? "text-white" : "text-neutral-600"}`}>
          {winB && <span className="mr-1 text-white">✦</span>}
          {displayB}
        </div>
      </div>
    </div>
  );
}

/* — Comparison Table — */
function ComparisonTable() {
  const rows = [
    { label: "Подписчики", valA: profileA.followers, valB: profileB.followers },
    { label: "Подписки", valA: profileA.following, valB: profileB.following },
    { label: "Всего лайков", valA: profileA.likes, valB: profileB.likes },
    { label: "Количество видео", valA: profileA.videos, valB: profileB.videos },
    { label: "Средние просмотры", valA: profileA.avgViews, valB: profileB.avgViews },
    { label: "Средние лайки", valA: profileA.avgLikes, valB: profileB.avgLikes },
    { label: "Средние комментарии", valA: profileA.avgComments, valB: profileB.avgComments },
    { label: "Лайков на подписчика", valA: Math.round(profileA.likes / profileA.followers), valB: Math.round(profileB.likes / profileB.followers) },
  ];

  return (
    <Section className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Сравнение метрик</h2>
        <p className="text-neutral-500 text-sm">Визуальное сравнение основных показателей</p>
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-white text-xs font-medium">{profileA.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-500" />
          <span className="text-neutral-400 text-xs font-medium">{profileB.username}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 px-5 md:px-8 py-2">
        {rows.map((r, i) => (
          <CompRow key={r.label} {...r} delay={i * 80} />
        ))}
      </div>
    </Section>
  );
}

/* — Detail Table — */
function InfoTable() {
  const likesPerFollowerA = (profileA.likes / profileA.followers).toFixed(1);
  const likesPerFollowerB = (profileB.likes / profileB.followers).toFixed(1);

  const fields: { label: string; a: string; b: string }[] = [
    { label: "Никнейм", a: profileA.username, b: profileB.username },
    { label: "Подписчики", a: fmt(profileA.followers), b: fmt(profileB.followers) },
    { label: "Подписки", a: String(profileA.following), b: String(profileB.following) },
    { label: "Всего лайков", a: fmt(profileA.likes), b: fmt(profileB.likes) },
    { label: "Лайков на подписчика", a: likesPerFollowerA, b: likesPerFollowerB },
    { label: "Ниша", a: profileA.niche, b: profileB.niche },
    { label: "Год регистрации", a: profileA.joined, b: profileB.joined },
    { label: "Частота постов", a: profileA.postFrequency, b: profileB.postFrequency },
    { label: "Аудитория (возраст)", a: profileA.audience + " лет", b: profileB.audience + " лет" },
    { label: "Engagement Rate", a: profileA.engagementRate + "%", b: profileB.engagementRate + "%" },
  ];

  return (
    <Section className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Подробная информация</h2>
        <p className="text-neutral-500 text-sm">Детальное сравнение характеристик</p>
      </div>

      <div className="rounded-2xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950">
              <th className="text-left py-3.5 px-5 text-neutral-500 font-semibold text-xs uppercase tracking-wider">Параметр</th>
              <th className="text-center py-3.5 px-4 text-white font-semibold text-xs uppercase tracking-wider">{profileA.username}</th>
              <th className="text-center py-3.5 px-4 text-neutral-400 font-semibold text-xs uppercase tracking-wider">{profileB.username}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={f.label} className={`border-b border-neutral-800/50 ${i % 2 === 0 ? "bg-neutral-950/30" : "bg-neutral-900/40"}`}>
                <td className="py-3 px-5 text-neutral-400 font-medium">{f.label}</td>
                <td className="py-3 px-4 text-center text-white font-medium">{f.a}</td>
                <td className="py-3 px-4 text-center text-neutral-300 font-medium">{f.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* — Pros & Cons — */
function ProsSection() {
  const prosA = [
    "Высокий Engagement Rate — 75.6%",
    "Больше лайков на одного подписчика (~115 лайков/подписчик)",
    "Контент вызывает сильную реакцию при небольшой аудитории",
    "Потенциал роста: качественный контент привлекает аудиторию",
    "Органический рост без накруток",
  ];

  const prosB = [
    "В ~6.7 раз больше подписчиков (1 020 vs 152)",
    "В ~3 раза больше лайков (52.6K vs 17.6K)",
    "Больше видео-контента (58 vs 35)",
    "Более высокие средние просмотры (~1 200)",
    "Более активный постинг (3–5 видео/нед)",
    "Развитая нишевая аудитория",
  ];

  const consA = [
    "Очень мало подписчиков — всего 152",
    "Меньше видео-контента (35)",
    "Меньше общего охвата и просмотров",
    "Аккаунт пока на начальной стадии роста",
  ];

  const consB = [
    "Ниже Engagement Rate — 30.4%",
    "Меньше лайков на подписчика (~51)",
    "Больше подписок — может снижать качество фида",
    "Менее тесное взаимодействие с каждым подписчиком",
  ];

  return (
    <Section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Плюсы и минусы</h2>
        <p className="text-neutral-500 text-sm">Объективная оценка каждого аккаунта</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile A */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          <h3 className="text-lg font-bold text-white mb-5 text-center">{profileA.username}</h3>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-white tracking-wide">+ Плюсы</span>
            </div>
            <ul className="space-y-2.5">
              {prosA.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm">
                  <span className="text-white mt-0.5 shrink-0 font-bold">+</span>
                  <span className="text-neutral-300">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-neutral-500 tracking-wide">− Минусы</span>
            </div>
            <ul className="space-y-2.5">
              {consA.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm">
                  <span className="text-neutral-600 mt-0.5 shrink-0 font-bold">−</span>
                  <span className="text-neutral-500">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Profile B */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          <h3 className="text-lg font-bold text-white mb-5 text-center">{profileB.username}</h3>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-white tracking-wide">+ Плюсы</span>
            </div>
            <ul className="space-y-2.5">
              {prosB.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm">
                  <span className="text-white mt-0.5 shrink-0 font-bold">+</span>
                  <span className="text-neutral-300">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-neutral-500 tracking-wide">− Минусы</span>
            </div>
            <ul className="space-y-2.5">
              {consB.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm">
                  <span className="text-neutral-600 mt-0.5 shrink-0 font-bold">−</span>
                  <span className="text-neutral-500">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* — Score Summary — */
function ScoreSummary() {
  const metrics: [string, number, number][] = [
    ["Подписчики", profileA.followers, profileB.followers],
    ["Всего лайков", profileA.likes, profileB.likes],
    ["Ср. просмотры", profileA.avgViews, profileB.avgViews],
    ["Ср. лайки", profileA.avgLikes, profileB.avgLikes],
    ["Ср. комменты", profileA.avgComments, profileB.avgComments],
    ["Engagement Rate", profileA.engagementRate, profileB.engagementRate],
    ["Кол-во видео", profileA.videos, profileB.videos],
    ["Лайков/подписчик", profileA.likes / profileA.followers, profileB.likes / profileB.followers],
  ];

  let winsA = 0;
  let winsB = 0;
  metrics.forEach(([, a, b]) => {
    if (a > b) winsA++;
    else if (b > a) winsB++;
  });

  const { ref, visible } = useInView();

  return (
    <Section className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Итоговый счёт</h2>
        <p className="text-neutral-500 text-sm mb-8">Побеждённые категории из {metrics.length}</p>

        <div ref={ref} className="flex items-center justify-center gap-10 md:gap-16 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-black mx-auto mb-3 border-2 border-neutral-700">
              <AnimatedNumber target={winsA} visible={visible} />
            </div>
            <div className="text-white font-semibold text-sm">{profileA.username}</div>
          </div>

          <div className="text-neutral-700 text-4xl font-black">:</div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-800 text-white flex items-center justify-center text-3xl font-black mx-auto mb-3 border-2 border-neutral-700">
              <AnimatedNumber target={winsB} visible={visible} />
            </div>
            <div className="text-neutral-400 font-semibold text-sm">{profileB.username}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          <div>
            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-semibold">✦ Выиграл {profileA.username}</p>
            {metrics.filter(([, a, b]) => a > b).map(([name]) => (
              <div key={name} className="text-sm text-white py-1.5 border-b border-neutral-800/30 last:border-0">+ {name}</div>
            ))}
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-semibold">✦ Выиграл {profileB.username}</p>
            {metrics.filter(([, a, b]) => b > a).map(([name]) => (
              <div key={name} className="text-sm text-neutral-300 py-1.5 border-b border-neutral-800/30 last:border-0">+ {name}</div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6">
          <div className="inline-block px-6 py-3 rounded-xl border border-neutral-700 bg-neutral-900">
            <span className="text-white font-bold">
              {winsA > winsB
                ? `${profileA.username} — лидер по вовлечённости`
                : winsB > winsA
                ? `${profileB.username} — лидер по охвату и росту`
                : "Ничья — оба аккаунта на одном уровне"}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* — Conclusion — */
function Conclusion() {
  return (
    <Section className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8">
        <h2 className="text-2xl font-bold text-white mb-5 text-center">Вывод</h2>
        <div className="space-y-4 text-sm text-neutral-400 leading-relaxed">
          <p>
            <span className="text-white font-semibold">{profileB.username}</span> безусловно лидирует по масштабу аудитории: 
            1 020 подписчиков и 52.6K лайков — это серьёзные цифры для развивающегося аккаунта. 
            Больше видео, больше просмотров, больше общая активность. 
            Аккаунт уже перешёл порог в 1K подписчиков, что открывает новые возможности для роста.
          </p>
          <p>
            <span className="text-white font-semibold">{profileA.username}</span> при скромных 152 подписчиках показывает 
            впечатляющую вовлечённость: 17.6K лайков на 152 подписчика — это ~115 лайков на каждого подписчика, 
            что является выдающимся показателем. Это значит, что контент заходит далеко за пределы постоянной аудитории 
            и попадает в рекомендации.
          </p>
          <p>
            <span className="text-white font-semibold">Итог:</span> {profileB.username} — более крупный аккаунт с большей аудиторией и охватом. 
            {profileA.username} — аккаунт с потенциалом вирусного роста благодаря высокой вовлечённости. 
            Оба аккаунта на стадии активного роста и имеют все шансы масштабироваться.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* — Footer — */
function Footer() {
  return (
    <footer className="text-center py-10 border-t border-neutral-800/50 mt-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <a
          href={profileA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm font-medium hover:underline underline-offset-4"
        >
          {profileA.username} ↗
        </a>
        <span className="text-neutral-700">|</span>
        <a
          href={profileB.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 text-sm font-medium hover:underline underline-offset-4"
        >
          {profileB.username} ↗
        </a>
      </div>
      <p className="text-neutral-600 text-xs">
        Данные актуальны на момент создания страницы.
      </p>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════════════ */

export function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200">
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <Header />

        <section className="px-4 py-6">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-5">
            <ProfileCard profile={profileA} side="left" />
            <ProfileCard profile={profileB} side="right" />
          </div>
        </section>

        <BigStats />
        <ComparisonTable />
        <InfoTable />
        <ProsSection />
        <ScoreSummary />
        <Conclusion />
        <Footer />
      </div>
    </div>
  );
}
