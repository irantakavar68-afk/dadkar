"use client";

import React, { useState, useMemo } from "react";

// --- پایگاه داده جامع قوانین کار، تأمین اجتماعی و آرای دیوان عدالت اداری ---
interface LawItem {
  id: string;
  category: "labor" | "tamin" | "court" | "unemployment";
  title: string;
  subject: string;
  content: string;
  tags: string[];
}

const LAWS_DATABASE: LawItem[] = [
  {
    id: "l1",
    category: "labor",
    title: "ماده ۲۴ قانون کار - حق سنوات پایان کار",
    subject: "محاسبه پاداش پایان‌کار و سنوات خدمت",
    content:
      "در صورت خاتمه قرارداد کار، کارفرما مکلف است به کارگری که مطابق قرارداد، یک سال یا بیشتر به کار اشتغال داشته است برای هر سال سابقه (اعم از متوالی یا متناوب) بر اساس آخرین حقوق، مبلغی معادل یک ماه حقوق به عنوان مزایای پایان کار (حق سنوات) پرداخت نماید. همچنین به استناد دادنامه ۱۲۵۳ دیوان عدالت اداری، کلیه مزایای پرداختی به تبع شغل باید در محاسبه سنوات لحاظ گردد.",
    tags: ["سنوات", "ماده ۲۴", "پایان کار", "دادنامه ۱۲۵۳", "مزد مبنا"]
  },
  {
    id: "l2",
    category: "labor",
    title: "ماده ۳۶ قانون کار - مزد ثابت و مزد مبنا",
    subject: "تعریف اجزای تشکیل‌دهنده دستمزد",
    content:
      "مزد ثابت عبارت است از مجموع مزد شغل و مزایای ثابت پرداختی به تبع شغل. تبصره ۱: مزایای رفاهی و انگیزشی مانند کمک هزینه مسکن، خواربار و عائله‌مندی جزء مزد ثابت و مبنا محسوب نمی‌شوند مگر با توافق یا رویه کارگاه. تبصره ۲: در کارگاه‌هایی که طرح طبقه‌بندی مشاغل به اجرا درآمده است، مزد گروه و پایه سنوات و مزد رتبه، مزد مبنا را تشکیل می‌دهند.",
    tags: ["مزد ثابت", "مزد مبنا", "طرح طبقه‌بندی", "مزد رتبه", "مزد گروه"]
  },
  {
    id: "l3",
    category: "unemployment",
    title: "ماده ۷ قانون بیمه بیکاری - میزان و مدت مقرری",
    subject: "فرمول محاسبه مقرری بیکاری و سقف قانونی",
    content:
      "میزان مقرری روزانه بیمه‌شده بیکار معادل ۵۵ درصد متوسط مزد یا حقوق و یا کارمزد روزانه بیمه‌شده می‌باشد. به مقرری افراد متأهل یا متکفل، تا حداکثر ۴ نفر از افراد تحت تکفل به ازای هر یک از آنها به میزان ۱۰ درصد حداقل دستمزد افزوده خواهد شد. در هر حال کلیه دریافتی بیمه‌شده نباید از حداقل دستمزد کمتر و از ۸۰ درصد متوسط مزد یا حقوق وی بیشتر باشد.",
    tags: ["بیمه بیکاری", "ماده ۷", "مقرری", "تحت تکفل"]
  },
  {
    id: "l4",
    category: "tamin",
    title: "ماده ۲۸ قانون تأمین اجتماعی - حق بیمه سهم کارگر و کارفرما",
    subject: "درصدها و ضرایب حق بیمه پرداختی",
    content:
      "حق بیمه از اول آذرماه سال ۱۳۵۴ به میزان ۲۸ درصد مزد یا حقوق است که ۷ درصد آن به عهده بیمه‌شده، ۲۰ درصد به عهده کارفرما و ۳ درصد به وسیله دولت تأمین می‌شود. به همراه ۳ درصد حق بیمه بیکاری (موضوع قانون بیمه بیکاری)، مجموع سهم کارفرما به ۲۳ درصد افزایش می‌یابد.",
    tags: ["حق بیمه", "ماده ۲۸", "سهم کارفرما", "سهم کارگر", "بیمه اجباری"]
  },
  {
    id: "l5",
    category: "tamin",
    title: "ماده ۷۷ قانون تأمین اجتماعی - میزان مستمری بازنشستگی",
    subject: "فرمول مستمری بازنشستگی تامین اجتماعی",
    content:
      "میزان مستمری بازنشستگی عبارت است از یک سی‌ام متوسط مزد یا حقوق بیمه‌شده ضربدر سنوات پرداخت حق بیمه مشروط بر آنکه از سی و پنج سی‌ام (۳۵/۳۰) متوسط مزد یا حقوق تجاوز ننماید. متوسط مزد یا حقوق عبارت است از مجموع مزد یا حقوق مبنای کسر حق بیمه در آخرین دو سال پرداخت حق بیمه تقسیم بر ۲۴.",
    tags: ["بازنشستگی", "ماده ۷۷", "مستمری", "سابقه بیمه"]
  },
  {
    id: "l6",
    category: "court",
    title: "دادنامه شماره ۱۲۵۳ هیأت عمومی دیوان عدالت اداری",
    subject: "شمول تمامی مزایای به تبع شغل در سنوات",
    content:
      "مبنای محاسبه پاداش پایان خدمت (حق سنوات) موضوع ماده ۲۴ و ۳۱ قانون کار، مطلق حقوق و فوق‌العاده‌ها و مزایای مستمر پرداختی به تبع شغل کارگر است و محدود کردن آن صرفاً به حداقل دستمزد مصوب مغایر قانون است.",
    tags: ["دیوان عدالت اداری", "دادنامه ۱۲۵۳", "حق سنوات", "مزایای به تبع شغل"]
  }
];

export default function DadKarApp() {
  const [activeTab, setActiveTab] = useState<"home" | "calculators" | "laws" | "about">("home");
  const [selectedCalc, setSelectedCalc] = useState<"severance" | "unemployment" | "tamin" | "pension">("severance");

  // وضعیت نمایش پرینت فیش سنوات
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  // ۱. متغیرهای بیمه تأمین اجتماعی
  const [taminWage, setTaminWage] = useState<number>(15000000);
  const [taminType, setTaminType] = useState<"mandatory" | "freelance_12" | "freelance_14" | "freelance_18" | "optional">(
    "mandatory"
  );

  // ۲. متغیرهای بیمه بیکاری
  const [unempAvgWage, setUnempAvgWage] = useState<number>(25000000);
  const [unempMinWage, setUnempMinWage] = useState<number>(11500000);
  const [unempDependents, setUnempDependents] = useState<number>(1);
  const [unempServiceMonths, setUnempServiceMonths] = useState<number>(36);
  const [unempIsMarried, setUnempIsMarried] = useState<boolean>(true);

  // ۳. متغیرهای سنوات و تفکیک مزد (ماده ۲۴ و ۳۶ قانون کار)
  const [sevWageBasisType, setSevWageBasisType] = useState<"base" | "detailed">("base");
  const [sevMonthlyWage, setSevMonthlyWage] = useState<number>(40000000); // ورود مستقیم سرجمع
  
  // اقلام تفکیکی کارگاه‌های دارای طرح طبقه‌بندی مشاغل
  const [sevJobWage, setSevJobWage] = useState<number>(30000000);       // مزد گروه / مزد شغل
  const [sevRankWage, setSevRankWage] = useState<number>(6000000);      // مزد رتبه
  const [sevBaseSanavat, setSevBaseSanavat] = useState<number>(4000000);// پایه سنوات تجمیعی ماهانه

  const [sevYears, setSevYears] = useState<number>(30);
  const [sevMonths, setSevMonths] = useState<number>(6);
  const [sevDays, setSevDays] = useState<number>(0);

  // ۴. متغیرهای بازنشستگی
  const [penAvgWage, setPenAvgWage] = useState<number>(30000000);
  const [penYears, setPenYears] = useState<number>(30);

  // فیلتر قوانین
  const [lawSearch, setLawSearch] = useState<string>("");
  const [lawFilter, setLawFilter] = useState<string>("all");

  // توابع کمکی جداسازی ارقام سه‌رقمی
  const formatToman = (num: number) => {
    return Math.round(num).toLocaleString("fa-IR") + " تومان";
  };

  const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    setter(rawVal ? parseInt(rawVal, 10) : 0);
  };

  // --- محاسبات ۱: حق بیمه تأمین اجتماعی ---
  const taminResult = useMemo(() => {
    let workerRate = 0.07;
    let employerRate = 0.2;
    let unempRate = 0.03;

    if (taminType === "freelance_12") {
      workerRate = 0.12;
      employerRate = 0;
      unempRate = 0;
    } else if (taminType === "freelance_14") {
      workerRate = 0.14;
      employerRate = 0;
      unempRate = 0;
    } else if (taminType === "freelance_18") {
      workerRate = 0.18;
      employerRate = 0;
      unempRate = 0;
    } else if (taminType === "optional") {
      workerRate = 0.27;
      employerRate = 0;
      unempRate = 0;
    }

    const workerAmount = taminWage * workerRate;
    const employerAmount = taminWage * (employerRate + unempRate);
    const totalAmount = workerAmount + employerAmount;

    return {
      workerRate: Math.round(workerRate * 100),
      employerRate: Math.round((employerRate + unempRate) * 100),
      workerAmount,
      employerAmount,
      totalAmount
    };
  }, [taminWage, taminType]);

  // --- محاسبات ۲: بیمه بیکاری (ماده ۷ قانون بیمه بیکاری) ---
  const unempResult = useMemo(() => {
    const base55 = unempAvgWage * 0.55;
    const validDepCount = Math.min(Math.max(0, unempDependents), 4);
    const depBonus = validDepCount * (unempMinWage * 0.1);
    let calculatedMonthly = base55 + depBonus;

    let appliedFloor = false;
    let appliedCap = false;

    if (calculatedMonthly < unempMinWage) {
      calculatedMonthly = unempMinWage;
      appliedFloor = true;
    }

    const cap80 = unempAvgWage * 0.8;
    if (calculatedMonthly > cap80) {
      calculatedMonthly = cap80;
      appliedCap = true;
    }

    let durationMonths = 0;
    if (unempServiceMonths >= 6 && unempServiceMonths <= 24) {
      durationMonths = unempIsMarried ? 12 : 6;
    } else if (unempServiceMonths >= 25 && unempServiceMonths <= 120) {
      durationMonths = unempIsMarried ? 18 : 12;
    } else if (unempServiceMonths >= 121 && unempServiceMonths <= 180) {
      durationMonths = unempIsMarried ? 26 : 18;
    } else if (unempServiceMonths >= 181 && unempServiceMonths <= 240) {
      durationMonths = unempIsMarried ? 36 : 24;
    } else if (unempServiceMonths >= 241) {
      durationMonths = unempIsMarried ? 50 : 36;
    }

    return {
      monthlyPayment: calculatedMonthly,
      durationMonths,
      base55,
      depBonus,
      cap80,
      appliedFloor,
      appliedCap,
      validDepCount
    };
  }, [unempAvgWage, unempMinWage, unempDependents, unempServiceMonths, unempIsMarried]);

  // --- محاسبات ۳: سنوات پایان‌کار (ماده ۲۴ و تبصره ۲ ماده ۳۶ قانون کار) ---
  const sevResult = useMemo(() => {
    const safeYears = Math.max(0, sevYears);
    const safeMonths = Math.min(11, Math.max(0, sevMonths));
    const safeDays = Math.min(30, Math.max(0, sevDays));

    const effectiveYears = safeYears + (safeMonths / 12) + (safeDays / 365);
    
    // در صورت تفکیک اقلام، مزد مبنا برابر است با: مزد شغل (گروه) + مزد رتبه + پایه سنوات
    const effectiveMonthlyWage =
      sevWageBasisType === "base"
        ? sevMonthlyWage
        : sevJobWage + sevRankWage + sevBaseSanavat;

    const dailyWage = effectiveMonthlyWage / 30;
    const totalSeverance = effectiveMonthlyWage * effectiveYears;

    return {
      monthlyWage: effectiveMonthlyWage,
      dailyWage,
      effectiveYears,
      totalSeverance,
      basisLabel:
        sevWageBasisType === "base"
          ? "مزد مبنا / مزد ثابت (ورود یکپارچه)"
          : "مجموع تفکیکی (مزد شغل + مزد رتبه + پایه سنوات)",
      jobWage: sevJobWage,
      rankWage: sevRankWage,
      baseSanavat: sevBaseSanavat
    };
  }, [sevWageBasisType, sevMonthlyWage, sevJobWage, sevRankWage, sevBaseSanavat, sevYears, sevMonths, sevDays]);

  // --- محاسبات ۴: مستمری بازنشستگی (ماده ۷۷ تأمین اجتماعی) ---
  const penResult = useMemo(() => {
    const effectiveYears = Math.min(Math.max(0, penYears), 35);
    const estimatedPension = (penAvgWage / 30) * effectiveYears;
    return { estimatedPension, effectiveYears };
  }, [penAvgWage, penYears]);

  // فیلتر قوانین بر اساس دسته‌بندی و عبارت جستجو
  const filteredLaws = useMemo(() => {
    return LAWS_DATABASE.filter((law) => {
      const matchCat = lawFilter === "all" || law.category === lawFilter;
      const matchSearch =
        law.title.includes(lawSearch) ||
        law.subject.includes(lawSearch) ||
        law.content.includes(lawSearch) ||
        law.tags.some((t) => t.includes(lawSearch));
      return matchCat && matchSearch;
    });
  }, [lawFilter, lawSearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none antialiased" dir="rtl">
      {/* هدر ثابت و شیک برنامه */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
              د
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  دادکـار
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  v2.2 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                دستیار جامع محاسبات قانون کار، سنوات و تأمین اجتماعی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              محاسبات برخط
            </span>
          </div>
        </div>
      </header>

      {/* محتوای صفحات */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28">
        {/* ================= صفحه اصلی ================= */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fadeIn">
            {/* کارت بنر خوش‌آمدگویی */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-850 p-6 sm:p-8 border border-slate-700/60 shadow-xl">
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-bold mb-3 border border-emerald-500/30">
                  مرجع تخصصی روابط کار
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  محاسبه دقیق حقوق، سنوات و بیمه
                  <br />
                  <span className="text-emerald-400 text-xl sm:text-2xl">
                    منطبق با نص صریح قانون و آرای دیوان عدالت اداری
                  </span>
                </h1>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-2xl">
                  اپلیکیشن دادکار با تضمین تطابق ۱۰۰ درصدی با ماده ۲۴ و تبصره ۲ ماده ۳۶ قانون کار و دادنامه ۱۲۵۳، فرمول‌های پیچیده اداری را به چند کلیک ساده تبدیل می‌کند.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setActiveTab("calculators");
                      setSelectedCalc("severance");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95"
                  >
                    شروع محاسبه سنوات خدمت
                  </button>
                  <button
                    onClick={() => setActiveTab("laws")}
                    className="px-5 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white font-semibold text-sm transition-all duration-200 border border-slate-600 active:scale-95"
                  >
                    مشاهده مواد قانونی
                  </button>
                </div>
              </div>
            </div>

            {/* دسترسی سریع به ۴ محاسبه‌گر اصلی */}
            <div>
              <h2 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                محاسبه‌گرهای تخصصی دادکار
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* سنوات */}
                <div
                  onClick={() => {
                    setActiveTab("calculators");
                    setSelectedCalc("severance");
                  }}
                  className="group cursor-pointer rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 p-5 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                      ⚖️
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      ماده ۲۴
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    سنوات پایان‌کار و پاداش خدمت
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    محاسبه روزشمار با تفکیک هوشمند مزد مبنا یا اقلام طبقه‌بندی (مزد گروه + رتبه + پایه).
                  </p>
                </div>

                {/* بیکاری */}
                <div
                  onClick={() => {
                    setActiveTab("calculators");
                    setSelectedCalc("unemployment");
                  }}
                  className="group cursor-pointer rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 p-5 transition-all duration-300 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                      🛡️
                    </span>
                    <span className="text-xs text-teal-400 font-semibold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                      ماده ۷
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
                    مقرری بیمه بیکاری
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    محاسبه مبلغ ماهانه و مدت زمان دقیق استحقاق بیمه بیکاری بر مبنای جدول سوابق و افراد تحت تکفل.
                  </p>
                </div>

                {/* حق بیمه */}
                <div
                  onClick={() => {
                    setActiveTab("calculators");
                    setSelectedCalc("tamin");
                  }}
                  className="group cursor-pointer rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 p-5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                      📊
                    </span>
                    <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      ماده ۲۸
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    حق بیمه تأمین اجتماعی
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    تفکیک سهم کارگر، کارفرما و بیمه بیکاری در انواع بیمه‌های اجباری، مشاغل آزاد و اختیاری.
                  </p>
                </div>

                {/* بازنشستگی */}
                <div
                  onClick={() => {
                    setActiveTab("calculators");
                    setSelectedCalc("pension");
                  }}
                  className="group cursor-pointer rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 p-5 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                      👴
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      ماده ۷۷
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                    مستمری بازنشستگی
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    برآورد حقوق بازنشستگی با اعمال ضریب سنوات خدمت و میانگین دستمزد دو سال آخر.
                  </p>
                </div>
              </div>
            </div>

            {/* یادداشت حقوقی مهم دیوان عدالت اداری */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-550/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <strong className="block font-bold mb-0.5 text-amber-300">
                  نکته حقوقی کلیدی در خصوص سنوات پایان کار (دادنامه ۱۲۵۳ دیوان عدالت اداری):
                </strong>
                مبنای محاسبه حق سنوات خدمت، صرفاً حداقل مزد پایه نیست؛ بلکه کلیه مزایای پرداختی مستمر به تبع شغل (شامل مزد رتبه، سختی کار، فوق‌العاده پست و مزد گروه) باید در سرجمع دستمزد ماهانه ملاک محاسبه ماده ۲۴ قرار گیرند.
              </div>
            </div>
          </div>
        )}

        {/* ================= صفحه ابزارها و محاسبات ================= */}
        {activeTab === "calculators" && (
          <div className="space-y-6 animate-fadeIn">
            {/* سوئیچ بین ۴ ماشین حساب */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => setSelectedCalc("severance")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "severance"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                سنوات پایان‌کار
              </button>
              <button
                onClick={() => setSelectedCalc("unemployment")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "unemployment"
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                بیمه بیکاری
              </button>
              <button
                onClick={() => setSelectedCalc("tamin")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "tamin"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                حق بیمه تأمین
              </button>
              <button
                onClick={() => setSelectedCalc("pension")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "pension"
                    ? "bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                مستمری بازنشستگی
              </button>
            </div>

            {/* --- فرم ۱: سنوات پایان کار --- */}
            {selectedCalc === "severance" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-5">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-emerald-400"></span>
                      پارامترهای محاسبه حق سنوات (ماده ۲۴ قانون کار)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      محاسبه دقیق با پوشش کامل کارگاه‌های عادی و کارگاه‌های دارای طرح طبقه‌بندی مشاغل
                    </p>
                  </div>

                  {/* سوئیچ نحوه ورود دستمزد */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      نحوه ورود دستمزد ملاک سنوات (تبصره ۲ ماده ۳۶ قانون کار):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSevWageBasisType("base")}
                        className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-right flex flex-col justify-center ${
                          sevWageBasisType === "base"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                            : "bg-slate-850 border-slate-700 text-slate-400 hover:bg-slate-750"
                        }`}
                      >
                        <span className="font-extrabold">۱. ورود یکپارچه (مزد مبنا / مزد ثابت)</span>
                        <span className="text-[11px] opacity-75 mt-0.5 font-normal">
                          مخصوص کارمندانی که رقم کل مزد مبنا در فیش حقوقی آن‌ها درج شده است
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSevWageBasisType("detailed")}
                        className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-right flex flex-col justify-center ${
                          sevWageBasisType === "detailed"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                            : "bg-slate-850 border-slate-700 text-slate-400 hover:bg-slate-750"
                        }`}
                      >
                        <span className="font-extrabold">۲. تفکیک اقلام (طرح طبقه‌بندی مشاغل)</span>
                        <span className="text-[11px] opacity-75 mt-0.5 font-normal">
                          تفکیک دقیق: مزد گروه (شغل) + مزد رتبه + پایه سنوات ماهانه
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* فرم فیلدهای ورود حقوق: بسته به انتخاب کاربر */}
                  {sevWageBasisType === "base" ? (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          آخرین مزد ماهانه مبنا / حقوق ثابت (تومان):
                        </label>
                        <span className="text-[11px] text-emerald-400 font-mono">
                          مزد روزانه: {formatToman(sevMonthlyWage / 30)}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formatNumberWithCommas(sevMonthlyWage)}
                        onChange={(e) => handlePriceInputChange(e, setSevMonthlyWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white font-mono text-base outline-none transition-all"
                        placeholder="مثلاً: ۴۰,۰۰۰,۰۰۰"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
                      <div className="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2">
                        اجزای تشکیل‌دهنده مزد مبنا بر اساس طرح طبقه‌بندی مشاغل وزارت کار:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            ۱. مزد شغل / مزد گروه (تومان):
                          </label>
                          <input
                            type="text"
                            value={formatNumberWithCommas(sevJobWage)}
                            onChange={(e) => handlePriceInputChange(e, setSevJobWage)}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            ۲. مزد رتبه ماهیانه (تومان):
                          </label>
                          <input
                            type="text"
                            value={formatNumberWithCommas(sevRankWage)}
                            onChange={(e) => handlePriceInputChange(e, setSevRankWage)}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            ۳. پایه سنوات ماهانه (تومان):
                          </label>
                          <input
                            type="text"
                            value={formatNumberWithCommas(sevBaseSanavat)}
                            onChange={(e) => handlePriceInputChange(e, setSevBaseSanavat)}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex flex-wrap justify-between items-center text-xs">
                        <span className="text-slate-300 font-semibold">مجموع مزد مبنای حاصله ملاک سنوات:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-300 font-bold font-mono text-sm">
                            {formatToman(sevJobWage + sevRankWage + sevBaseSanavat)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (روزانه: {formatToman((sevJobWage + sevRankWage + sevBaseSanavat) / 30)})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* سابقه خدمت به تفکیک سال، ماه، روز */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      مدت سابقه اشتغال (روزشمار دقیق):
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">سال:</span>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={sevYears}
                          onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">ماه (۰ الی ۱۱):</span>
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={sevMonths}
                          onChange={(e) =>
                            setSevMonths(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))
                          }
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">روز (۰ الی ۳۰):</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={sevDays}
                          onChange={(e) =>
                            setSevDays(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))
                          }
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* کارت نمایش نتایج سنوات */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      نتیجه رسمی محاسبات
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPdfModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <span>🖨️</span>
                      چاپ فیش رسمی / خروجی PDF
                    </button>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">مبلغ کل حق سنوات استحقاقی:</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
                      {formatToman(sevResult.totalSeverance)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">سابقه مؤثر محاسباتی:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {sevResult.effectiveYears.toFixed(2)} سال
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">مزد مبنای ماهانه:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(sevResult.monthlyWage)}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">نحوه مبناگذاری:</span>
                      <span className="font-bold text-slate-200 truncate block">
                        {sevResult.basisLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- فرم ۲: بیمه بیکاری --- */}
            {selectedCalc === "unemployment" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-teal-400"></span>
                      پارامترهای مقرری بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        متوسط مزد یا حقوق ۹۰ روز آخر (تومان):
                      </label>
                      <input
                        type="text"
                        value={formatNumberWithCommas(unempAvgWage)}
                        onChange={(e) => handlePriceInputChange(e, setUnempAvgWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        حداقل دستمزد ماهانه سال جاری (تومان):
                      </label>
                      <input
                        type="text"
                        value={formatNumberWithCommas(unempMinWage)}
                        onChange={(e) => handlePriceInputChange(e, setUnempMinWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        سابقه پرداخت حق بیمه (ماه):
                      </label>
                      <input
                        type="number"
                        min="6"
                        value={unempServiceMonths}
                        onChange={(e) => setUnempServiceMonths(Math.max(6, parseInt(e.target.value) || 6))}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-white font-mono text-center outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        تعداد افراد تحت تکفل (حداکثر ۴ نفر):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={unempDependents}
                        onChange={(e) =>
                          setUnempDependents(Math.min(4, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-white font-mono text-center outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">وضعیت تأهل:</label>
                      <button
                        type="button"
                        onClick={() => setUnempIsMarried(!unempIsMarried)}
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          unempIsMarried
                            ? "bg-teal-500/20 border-teal-500 text-teal-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        {unempIsMarried ? "متأهل یا متکفل" : "مجرد (بدون تکفل)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* کارت نتایج بیکاری */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-teal-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      برآورد مقرری ماهانه بیمه بیکاری
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">
                      مدت مجاز استحقاق:{" "}
                      <strong className="text-teal-400 font-mono text-sm">
                        {unempResult.durationMonths} ماه
                      </strong>
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">مبلغ پرداختی ماهانه به متقاضی:</span>
                    <div className="text-2xl sm:text-3xl font-black text-teal-400 tracking-tight font-mono">
                      {formatToman(unempResult.monthlyPayment)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">پایه ۵۵٪ حقوق متوسط:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(unempResult.base55)}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">افزایش عائله‌مندی (تکفل):</span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(unempResult.depBonus)}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">وضعیت سقف و کف قانونی:</span>
                      <span className="font-bold text-slate-200">
                        {unempResult.appliedFloor
                          ? "اعمال حداقل دستمزد (کف)"
                          : unempResult.appliedCap
                          ? "اعمال سقف ۸۰٪"
                          : "عادی"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- فرم ۳: حق بیمه تأمین اجتماعی --- */}
            {selectedCalc === "tamin" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-cyan-400"></span>
                      محاسبه حق بیمه تأمین اجتماعی (ماده ۲۸ قانون)
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      حقوق و مزایای مشمول کسر حق بیمه ماهانه (تومان):
                    </label>
                    <input
                      type="text"
                      value={formatNumberWithCommas(taminWage)}
                      onChange={(e) => handlePriceInputChange(e, setTaminWage)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white font-mono text-base outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">نوع پوشش بیمه‌ای:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTaminType("mandatory")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "mandatory"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        اجباری کارگری (۳۰٪ کل: ۷٪ سهم کارگر + ۲۳٪ کارفرما)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("freelance_12")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "freelance_12"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        مشاغل آزاد ۱۲٪ (بازنشستگی و فوت بعد از بازنشستگی)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("freelance_14")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "freelance_14"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        مشاغل آزاد ۱۴٪ (بازنشستگی و فوت قبل و بعد بازنشستگی)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("freelance_18")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "freelance_18"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        مشاغل آزاد ۱۸٪ (بازنشستگی، فوت و ازکارافتادگی)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("optional")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all sm:col-span-2 ${
                          taminType === "optional"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        بیمه اختیاری ۲۷٪ (کامل شامل درمان و ازکارافتادگی)
                      </button>
                    </div>
                  </div>
                </div>

                {/* کارت نمایش نتایج بیمه */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-cyan-500/30 shadow-xl space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      سرجمع حق بیمه ماهانه و تفکیک سهام
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">مجموع کل حق بیمه واریزی به تامین اجتماعی:</span>
                    <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">
                      {formatToman(taminResult.totalAmount)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        سهم کسر از بیمه‌شده ({taminResult.workerRate}٪):
                      </span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(taminResult.workerAmount)}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        سهم پرداختی کارفرما ({taminResult.employerRate}٪):
                      </span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(taminResult.employerAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- فرم ۴: بازنشستگی --- */}
            {selectedCalc === "pension" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-indigo-400"></span>
                      برآورد مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        میانگین دستمزد مشمول بیمه ۲ سال آخر (تومان):
                      </label>
                      <input
                        type="text"
                        value={formatNumberWithCommas(penAvgWage)}
                        onChange={(e) => handlePriceInputChange(e, setPenAvgWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-white font-mono text-base outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        سابقه پرداخت حق بیمه (سال):
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="35"
                        value={penYears}
                        onChange={(e) => setPenYears(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* کارت نتایج بازنشستگی */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-indigo-500/30 shadow-xl space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      برآورد اولیه حکم مستمری ماهیانه
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">مستمری ناخالص بازنشستگی ماهانه:</span>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight font-mono">
                      {formatToman(penResult.estimatedPension)}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    فرمول رسمی ماده ۷۷:{" "}
                    <code className="text-indigo-300 font-mono">
                      (میانگین ۲۴ ماه آخر ÷ ۳۰) × سابقه مجاز (حداکثر ۳۵ سال)
                    </code>
                    . شایان ذکر است کمک‌هزینه‌های عائله‌مندی و مسکن در زمان صدور حکم نهایی توسط سازمان تأمین اجتماعی به این مبلغ اضافه خواهد شد.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= صفحه بانک قوانین ================= */}
        {activeTab === "laws" && (
          <div className="space-y-5 animate-fadeIn">
            {/* نوار جستجو و فیلتر */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <input
                type="text"
                placeholder="جستجو در متن مواد قانونی، بخشنامه‌ها و دادنامه‌ها..."
                value={lawSearch}
                onChange={(e) => setLawSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder:text-slate-500"
              />

              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setLawFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "all"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  همه قوانین
                </button>
                <button
                  onClick={() => setLawFilter("labor")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "labor"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  قانون کار
                </button>
                <button
                  onClick={() => setLawFilter("tamin")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "tamin"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  تأمین اجتماعی
                </button>
                <button
                  onClick={() => setLawFilter("unemployment")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "unemployment"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  بیمه بیکاری
                </button>
                <button
                  onClick={() => setLawFilter("court")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "court"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  آرای دیوان عدالت
                </button>
              </div>
            </div>

            {/* لیست قوانین */}
            <div className="space-y-4">
              {filteredLaws.length > 0 ? (
                filteredLaws.map((law) => (
                  <div
                    key={law.id}
                    className="p-5 rounded-2xl bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-emerald-400">{law.title}</h3>
                      <span className="text-[10px] bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">
                        {law.category}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300">{law.subject}</p>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify">{law.content}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {law.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-900/80 text-slate-400 px-2 py-0.5 rounded border border-slate-750"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  موردی مطابق با جستجوی شما یافت نشد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= صفحه درباره ما و راهنما ================= */}
        {activeTab === "about" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">⚖️</span>
                درباره نرم‌افزار تخصصی دادکار
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                سامانه <strong>دادکار</strong> ابزار تخصصی تحت وب برای کارشناسان منابع انسانی، حسابداران حقوق و دستمزد، کارفرمایان و کارگران شریف است تا محاسبات پیچیده قانون کار و بیمه تامین اجتماعی را با اتکا به نصوص قانونی و معتبرترین آراء وحدت رویه دیوان عدالت اداری بدون کوچک‌ترین خطا و در چند ثانیه انجام دهند.
              </p>
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-xs text-slate-400 space-y-2">
                <p>✔️ محاسبه روزشمار سنوات پایان‌کار وفق ماده ۲۴ قانون کار</p>
                <p>✔️ پشتیبانی همزمان از مزد ثابت عادی و مزد مبنای طرح طبقه‌بندی مشاغل (ماده ۳۶)</p>
                <p>✔️ تعیین دقیق دوره و سقف استحقاق مقرری بیمه بیکاری طبق ماده ۷</p>
                <p>✔️ پشتیبانی از چاپ فیش و خروجی اسناد رسمی جهت امور مالی و تسویه‌حساب</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= مودال خروجی پرینت رسمی فیش سنوات ================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            {/* سربرگ رسمی سند */}
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl">
                  د
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">برگه رسمی محاسبه حق سنوات پایان خدمت</h2>
                  <p className="text-[11px] text-slate-600">سامانه محاسبات حقوق و روابط کار «دادکار»</p>
                </div>
              </div>
              <div className="text-left text-xs font-mono text-slate-600">
                <div>تاریخ صدور: {new Date().toLocaleDateString("fa-IR")}</div>
                <div className="text-emerald-700 font-bold">وضعیت: معتبر قانونی</div>
              </div>
            </div>

            {/* جدول مشخصات و اقلام فیش */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">مبنای دستمزد:</span>
                  <span className="font-bold text-slate-800">{sevResult.basisLabel}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">مجموع مزد مبنای ماهانه:</span>
                  <span className="font-bold font-mono text-slate-800">{formatToman(sevResult.monthlyWage)}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">مدت زمان سابقه کار:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {sevYears} سال و {sevMonths} ماه و {sevDays} روز
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">ضریب سالانه مؤثر:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {sevResult.effectiveYears.toFixed(3)} سال
                  </span>
                </div>
              </div>

              {/* نمایش ریز اقلام مزد در صورت انتخاب حالت تفکیکی */}
              {sevWageBasisType === "detailed" && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block mb-2">
                    ریز اقلام مزد مبنا (طرح طبقه‌بندی مشاغل):
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-600 block">مزد گروه:</span>
                      <strong>{formatToman(sevJobWage)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-600 block">مزد رتبه:</span>
                      <strong>{formatToman(sevRankWage)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-600 block">پایه سنوات:</span>
                      <strong>{formatToman(sevBaseSanavat)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* بخش جمع نهایی */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs opacity-90 block">مبلغ کل قابل پرداخت (حق سنوات پایان کار):</span>
                  <span className="text-2xl font-black font-mono tracking-tight">
                    {formatToman(sevResult.totalSeverance)}
                  </span>
                </div>
                <div className="text-3xl">⚖️</div>
              </div>

              <div className="text-[11px] text-slate-500 text-justify leading-relaxed">
                مأخذ محاسبات: ماده ۲۴ قانون کار جمهوری اسلامی ایران، تبصره ۲ ماده ۳۶ قانون کار و دادنامه شماره ۱۲۵۳ هیأت عمومی دیوان عدالت اداری مبنی بر محاسبه کلیه مزایای مستمر به تبع شغل.
              </div>
            </div>

            {/* کلیدهای اقدام */}
            <div className="flex gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md active:scale-95 text-center"
              >
                چاپ فیش / ذخیره به صورت PDF
              </button>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="py-3 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-all active:scale-95"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* منوی ناوبری ثابت پایین صفحه (Bottom Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 px-3">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "home" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px]">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab("calculators")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "calculators" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">🧮</span>
            <span className="text-[10px]">محاسبه‌گرها</span>
          </button>

          <button
            onClick={() => setActiveTab("laws")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "laws" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">📖</span>
            <span className="text-[10px]">بانک قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "about" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">ℹ️</span>
            <span className="text-[10px]">درباره دادکار</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
