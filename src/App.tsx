"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LAWS_DATABASE, LawItem } from "./lawsData";

// تبدیل امن ارقام فارسی و عربی به انگلیسی
const toEnglishDigits = (str: string): string => {
  return str
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
};

// جداسازی سه‌رقمی با کاما برای نمایش در اینپوت
const formatNumberWithCommas = (num: number | string): string => {
  if (num === "" || num === null || num === undefined) return "";
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export default function DadKarApp() {
  // وضعیت لودینگ و اسپلش ورودی
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // ناوبری تب‌های اصلی
  const [activeTab, setActiveTab] = useState<"home" | "calculators" | "laws" | "about">("home");
  const [calcType, setCalcType] = useState<"severance" | "unemployment" | "tamin" | "pension">("severance");

  // مودال چاپ و خروجی رسمی سنوات
  const [showPrintModal, setShowPrintModal] = useState(false);

  // استیت‌های محاسبه‌گر سنوات
  const [wageMode, setWageMode] = useState<"unified" | "detailed">("unified");
  const [unifiedWage, setUnifiedWage] = useState<number>(180000000);
  const [baseJobWage, setBaseJobWage] = useState<number>(120000000);
  const [rankWage, setRankWage] = useState<number>(30000000);
  const [baseYearsWage, setBaseYearsWage] = useState<number>(30000000);
  const [years, setYears] = useState<string>("5");
  const [months, setMonths] = useState<string>("6");
  const [days, setDays] = useState<string>("15");

  // استیت‌های محاسبه‌گر بیمه بیکاری
  const [unempAvgWage, setUnempAvgWage] = useState<number>(180000000);
  const [unempMinWage, setUnempMinWage] = useState<number>(111000000);
  const [unempMonths, setUnempMonths] = useState<string>("36");
  const [unempDependents, setUnempDependents] = useState<number>(1);
  const [unempMarried, setUnempMarried] = useState<boolean>(true);

  // استیت‌های محاسبه‌گر تأمین اجتماعی
  const [taminWage, setTaminWage] = useState<number>(150000000);
  const [taminType, setTaminType] = useState<"mandatory" | "freelance_12" | "freelance_14" | "freelance_18" | "voluntary">("mandatory");

  // استیت‌های محاسبه‌گر مستمری بازنشستگی
  const [pensionAvgWage, setPensionAvgWage] = useState<number>(220000000);
  const [pensionYears, setPensionYears] = useState<string>("30");

  // جستجو و فیلتر بانک قوانین
  const [searchLaw, setSearchLaw] = useState("");
  const [selectedLawCat, setSelectedLawCat] = useState<string>("all");

  // ایندکس قانون تصادفی برای داشبورد صفحه اول
  const [randomLawIndex, setRandomLawIndex] = useState<number>(0);

  useEffect(() => {
    if (LAWS_DATABASE && LAWS_DATABASE.length > 0) {
      setRandomLawIndex(Math.floor(Math.random() * LAWS_DATABASE.length));
    }
  }, []);

  const handleNextRandomLaw = () => {
    if (LAWS_DATABASE && LAWS_DATABASE.length > 0) {
      setRandomLawIndex((prev) => (prev + 1) % LAWS_DATABASE.length);
    }
  };

  // هندلر یکپارچه اینپوت‌های پولی بدون قفل شدن روی یک رقم
  const handleMoneyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number) => void
  ) => {
    const rawEnglish = toEnglishDigits(e.target.value);
    const cleanNumbersOnly = rawEnglish.replace(/[^0-9]/g, "");
    setter(cleanNumbersOnly ? parseInt(cleanNumbersOnly, 10) : 0);
  };

  // فرمت‌کننده برای خروجی‌های کارتی
  const formatTomanDisplay = (num: number) => {
    return Number(num || 0).toLocaleString("fa-IR");
  };

  // محاسبات سنوات
  const effectiveWage = useMemo(() => {
    if (wageMode === "unified") {
      return unifiedWage || 0;
    }
    return (baseJobWage || 0) + (rankWage || 0) + (baseYearsWage || 0);
  }, [wageMode, unifiedWage, baseJobWage, rankWage, baseYearsWage]);

  const calculatedSeverance = useMemo(() => {
    const y = Number(years) || 0;
    const m = Math.min(11, Math.max(0, Number(months) || 0));
    const d = Math.min(30, Math.max(0, Number(days) || 0));
    const totalEffectiveYears = y + m / 12 + d / 365;
    const totalSeverance = Math.round(effectiveWage * totalEffectiveYears);

    return {
      totalSeverance,
      totalEffectiveYears: totalEffectiveYears.toFixed(3),
      effectiveWage,
    };
  }, [effectiveWage, years, months, days]);

  // محاسبات بیمه بیکاری
  const calculatedUnemployment = useMemo(() => {
    const avg = unempAvgWage || 0;
    const min = unempMinWage || 0;
    const m = Number(unempMonths) || 0;

    const baseAmount = avg * 0.55;
    const dependentAddition = unempDependents * (min * 0.1);
    let totalMonthly = baseAmount + dependentAddition;

    if (totalMonthly < min) totalMonthly = min;
    const maxCeiling = avg * 0.8;
    if (totalMonthly > maxCeiling) totalMonthly = maxCeiling;

    let durationMonths = 0;
    if (m >= 6 && m <= 24) durationMonths = unempMarried ? 12 : 6;
    else if (m >= 25 && m <= 120) durationMonths = unempMarried ? 18 : 12;
    else if (m >= 121 && m <= 180) durationMonths = unempMarried ? 26 : 14;
    else if (m >= 181 && m <= 240) durationMonths = unempMarried ? 36 : 18;
    else if (m >= 241) durationMonths = unempMarried ? 50 : 36;

    return {
      monthly: Math.round(totalMonthly),
      durationMonths,
      baseAmount: Math.round(baseAmount),
      dependentAddition: Math.round(dependentAddition),
      ceilingApplied: totalMonthly === maxCeiling,
      floorApplied: totalMonthly === min,
    };
  }, [unempAvgWage, unempMinWage, unempMonths, unempDependents, unempMarried]);

  // محاسبات حق بیمه تأمین اجتماعی
  const calculatedTamin = useMemo(() => {
    const wage = taminWage || 0;
    let employeeRate = 0;
    let employerRate = 0;
    let govtRate = 0;

    switch (taminType) {
      case "mandatory":
        employeeRate = 0.07;
        employerRate = 0.23;
        govtRate = 0.03;
        break;
      case "freelance_12":
        employeeRate = 0.12;
        govtRate = 0.02;
        break;
      case "freelance_14":
        employeeRate = 0.14;
        govtRate = 0.02;
        break;
      case "freelance_18":
        employeeRate = 0.18;
        govtRate = 0.02;
        break;
      case "voluntary":
        employeeRate = 0.27;
        break;
    }

    const employeeShare = Math.round(wage * employeeRate);
    const employerShare = Math.round(wage * employerRate);
    const govtShare = Math.round(wage * govtRate);
    const total = employeeShare + employerShare + govtShare;

    return { employeeShare, employerShare, govtShare, total, wage };
  }, [taminWage, taminType]);

  // محاسبات مستمری بازنشستگی
  const calculatedPension = useMemo(() => {
    const avg = pensionAvgWage || 0;
    const y = Math.min(35, Number(pensionYears) || 0);
    const monthlyPension = Math.round((avg / 30) * y);
    return { monthlyPension, cappedYears: y, avgWage: avg };
  }, [pensionAvgWage, pensionYears]);

  // فیلتر بانک قوانین
  const filteredLaws = useMemo(() => {
    return LAWS_DATABASE.filter((item) => {
      const matchCat = selectedLawCat === "all" || item.category === selectedLawCat;
      const matchSearch =
        item.title.includes(searchLaw) ||
        item.subject.includes(searchLaw) ||
        item.content.includes(searchLaw) ||
        item.tags.some((t) => t.includes(searchLaw));
      return matchCat && matchSearch;
    });
  }, [searchLaw, selectedLawCat]);

  const activeRandomLaw = LAWS_DATABASE[randomLawIndex] || LAWS_DATABASE[0];

  const handlePrint = () => {
    window.print();
  };

  if (appLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black tracking-widest text-amber-400">دادکار</span>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-400 tracking-wider font-light animate-pulse">
          در حال بارگذاری پایگاه جامع محاسبات و قوانین کار...
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 selection:bg-amber-500 selection:text-slate-950">
      {/* هدر بالایی با افکت گلس‌مورفیسم */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" />
              <path d="m3 7 9-4 9 4" />
              <path d="M6 10l-3 6h6l-3-6" />
              <path d="M18 10l-3 6h6l-3-6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-wide">دادکار</h1>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-mono">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400">سامانه هوشمند محاسبات حقوقی و بیمه‌ای</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("laws")}
          className="text-xs bg-slate-800/90 hover:bg-slate-700/90 text-amber-400 px-3.5 py-1.5 rounded-xl border border-amber-500/20 transition flex items-center gap-1.5 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          <span>بانک قوانین</span>
        </button>
      </header>

      {/* محتوای اصلی */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-5">
        {/* ۱. صفحه اصلی (داشبورد پویا و مدرن) */}
        {activeTab === "home" && (
          <div className="space-y-5 animate-fadeIn">
            {/* بنر هیرو با جلوه نوری */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/20 p-6 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  مستند به قانون کار و آرای هیأت عمومی دیوان
                </div>
                <h2 className="text-xl font-black text-white leading-tight">
                  محاسبات دقیق کار و بیمه، <br />
                  <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                    سریع، قانونی و بی‌نقص
                  </span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  دادکار با پوشش کامل فرمول‌های مصوب، سنوات پایان خدمت، مقرری بیمه بیکاری، سهم بیمه تأمین اجتماعی و مستمری بازنشستگی را منطبق بر آخرین رویه‌های رسمی محاسبه می‌کند.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("calculators");
                      setCalcType("severance");
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 text-center"
                  >
                    شروع محاسبه سنوات
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("laws");
                    }}
                    className="px-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs py-2.5 rounded-xl border border-slate-700 transition"
                  >
                    جستجوی مواد
                  </button>
                </div>
              </div>
            </div>

            {/* کارت‌های تعاملی ۴گانه */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-300 tracking-wide">ابزارهای محاسباتی</h3>
                <span className="text-[10px] text-slate-500">انتخاب جهت محاسبه آنلاین</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* سنوات */}
                <button
                  onClick={() => {
                    setActiveTab("calculators");
                    setCalcType("severance");
                  }}
                  className="group relative text-right p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition duration-200 flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">ماده ۲۴</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">پاداش سنوات</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">ساده و تفکیکی (رأی ۱۲۵۳)</p>
                  </div>
                </button>

                {/* بیمه بیکاری */}
                <button
                  onClick={() => {
                    setActiveTab("calculators");
                    setCalcType("unemployment");
                  }}
                  className="group relative text-right p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-850 transition duration-200 flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">ماده ۷</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">بیمه بیکاری</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">مدت و مقرری ماهانه</p>
                  </div>
                </button>

                {/* حق بیمه */}
                <button
                  onClick={() => {
                    setActiveTab("calculators");
                    setCalcType("tamin");
                  }}
                  className="group relative text-right p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition duration-200 flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">ماده ۲۸</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">حق بیمه</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">اجباری، مشاغل آزاد و اختیاری</p>
                  </div>
                </button>

                {/* مستمری بازنشستگی */}
                <button
                  onClick={() => {
                    setActiveTab("calculators");
                    setCalcType("pension");
                  }}
                  className="group relative text-right p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-850 transition duration-200 flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">ماده ۷۷</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition">بازنشستگی</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">میانگین دو سال آخر</p>
                  </div>
                </button>
              </div>
            </div>

            {/* بخش گزیده تصادفی قوانین */}
            {activeRandomLaw && (
              <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">نکته حقوقی روز</span>
                  </div>
                  <button
                    onClick={handleNextRandomLaw}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                  >
                    <span>ماده بعدی</span>
                    <span>↺</span>
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-400/90">{activeRandomLaw.title}</div>
                  <div className="text-[11px] text-slate-300 font-medium">{activeRandomLaw.subject}</div>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                    {activeRandomLaw.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ۲. بخش محاسبه‌گرها */}
        {activeTab === "calculators" && (
          <div className="space-y-4 animate-fadeIn">
            {/* انتخاب‌گر نوع محاسبه‌گر */}
            <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setCalcType("severance")}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  calcType === "severance" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                سنوات
              </button>
              <button
                onClick={() => setCalcType("unemployment")}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  calcType === "unemployment" ? "bg-blue-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                بیکاری
              </button>
              <button
                onClick={() => setCalcType("tamin")}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  calcType === "tamin" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                حق بیمه
              </button>
              <button
                onClick={() => setCalcType("pension")}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  calcType === "pension" ? "bg-purple-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                مستمری
              </button>
            </div>

            {/* الف) محاسبه‌گر سنوات */}
            {calcType === "severance" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-amber-400 text-sm">محاسبه پاداش پایان خدمت (سنوات)</h3>
                  <div className="flex bg-slate-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      onClick={() => setWageMode("unified")}
                      className={`px-2.5 py-1 rounded-md transition ${wageMode === "unified" ? "bg-slate-700 text-white font-bold" : "text-slate-400"}`}
                    >
                      مزد کل
                    </button>
                    <button
                      onClick={() => setWageMode("detailed")}
                      className={`px-2.5 py-1 rounded-md transition ${wageMode === "detailed" ? "bg-slate-700 text-white font-bold" : "text-slate-400"}`}
                    >
                      تفکیکی (رأی ۱۲۵۳)
                    </button>
                  </div>
                </div>

                {wageMode === "unified" ? (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">مزد ماهانه مبنا (تومان):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      value={formatNumberWithCommas(unifiedWage)}
                      onChange={(e) => handleMoneyInputChange(e, setUnifiedWage)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none text-amber-300 font-bold"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">مزد شغل ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={formatNumberWithCommas(baseJobWage)}
                        onChange={(e) => handleMoneyInputChange(e, setBaseJobWage)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-left font-mono outline-none text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">مزد رتبه ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={formatNumberWithCommas(rankWage)}
                        onChange={(e) => handleMoneyInputChange(e, setRankWage)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-left font-mono outline-none text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">پایه سنوات ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={formatNumberWithCommas(baseYearsWage)}
                        onChange={(e) => handleMoneyInputChange(e, setBaseYearsWage)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-left font-mono outline-none text-slate-100"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-300 mb-1">سابقه خدمت:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-0.5">سال</span>
                      <input
                        type="number"
                        min="0"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-mono outline-none text-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-0.5">ماه</span>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-mono outline-none text-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-0.5">روز</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-mono outline-none text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مزد مبنای ماهانه:</span>
                    <span className="font-mono text-white font-bold">{formatTomanDisplay(calculatedSeverance.effectiveWage)} تومان</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>سابقه مؤثر محاسبه:</span>
                    <span className="font-mono text-white">{calculatedSeverance.totalEffectiveYears} سال</span>
                  </div>
                  <div className="pt-2 border-t border-amber-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-amber-400">مبلغ کل سنوات:</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {formatTomanDisplay(calculatedSeverance.totalSeverance)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl text-xs font-bold text-amber-400 transition flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>چاپ و صدور صورت‌جلسه تسویه‌حساب رسمی</span>
                </button>
              </div>
            )}

            {/* ب) محاسبه‌گر بیمه بیکاری */}
            {calcType === "unemployment" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-blue-400 text-sm border-b border-slate-800 pb-3">محاسبه مقرری بیمه بیکاری</h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">متوسط دستمزد ۹۰ روز آخر (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={formatNumberWithCommas(unempAvgWage)}
                    onChange={(e) => handleMoneyInputChange(e, setUnempAvgWage)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none text-blue-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">حداقل دستمزد سال جاری (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={formatNumberWithCommas(unempMinWage)}
                    onChange={(e) => handleMoneyInputChange(e, setUnempMinWage)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none text-blue-300 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">سابقه پرداخت بیمه (ماه):</label>
                    <input
                      type="number"
                      value={unempMonths}
                      onChange={(e) => setUnempMonths(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center font-mono outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">افراد تحت تکفل:</label>
                    <select
                      value={unempDependents}
                      onChange={(e) => setUnempDependents(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center outline-none text-white"
                    >
                      <option value={0}>بدون تکفل</option>
                      <option value={1}>۱ نفر</option>
                      <option value={2}>۲ نفر</option>
                      <option value={3}>۳ نفر</option>
                      <option value={4}>۴ نفر و بیشتر</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="married"
                    checked={unempMarried}
                    onChange={(e) => setUnempMarried(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="married" className="text-xs text-slate-300 cursor-pointer select-none">
                    متأهل یا متکفل هستم
                  </label>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مدت استحقاق دریافت مقرری:</span>
                    <span className="font-mono text-white font-bold">{calculatedUnemployment.durationMonths} ماه</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مقرری پایه (۵۵٪ متوسط مزد):</span>
                    <span className="font-mono text-white">{formatTomanDisplay(calculatedUnemployment.baseAmount)} تومان</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>افزایش بابت افراد تکفل:</span>
                    <span className="font-mono text-white">{formatTomanDisplay(calculatedUnemployment.dependentAddition)} تومان</span>
                  </div>
                  <div className="pt-2 border-t border-blue-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-blue-400">مقرری ماهانه پرداختی:</span>
                    <span className="text-lg font-black text-blue-400 font-mono">
                      {formatTomanDisplay(calculatedUnemployment.monthly)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ج) محاسبه‌گر حق بیمه تأمین اجتماعی */}
            {calcType === "tamin" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-emerald-400 text-sm border-b border-slate-800 pb-3">محاسبه نرخ و مبلغ حق بیمه</h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">مزد مشمول کسر بیمه (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={formatNumberWithCommas(taminWage)}
                    onChange={(e) => handleMoneyInputChange(e, setTaminWage)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none text-emerald-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">نوع پوشش بیمه‌ای:</label>
                  <select
                    value={taminType}
                    onChange={(e) => setTaminType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none text-white"
                  >
                    <option value="mandatory">اجباری کارگری (۳۰٪: کارگر ۷٪ + کارفرما ۲۳٪)</option>
                    <option value="freelance_12">مشاغل آزاد ۱۲٪ (بازنشستگی و فوت بعد بازنشستگی)</option>
                    <option value="freelance_14">مشاغل آزاد ۱۴٪ (بازنشستگی و فوت قبل/بعد)</option>
                    <option value="freelance_18">مشاغل آزاد ۱۸٪ (بازنشستگی، فوت و ازکارافتادگی)</option>
                    <option value="voluntary">بیمه اختیاری (۲۷٪ کامل)</option>
                  </select>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>سهم بیمه‌شده:</span>
                    <span className="font-mono text-white font-bold">{formatTomanDisplay(calculatedTamin.employeeShare)} تومان</span>
                  </div>
                  {calculatedTamin.employerShare > 0 && (
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>سهم کارفرما:</span>
                      <span className="font-mono text-white font-bold">{formatTomanDisplay(calculatedTamin.employerShare)} تومان</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-emerald-400">مجموع حق بیمه ماهانه:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {formatTomanDisplay(calculatedTamin.total)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* د) محاسبه‌گر مستمری بازنشستگی */}
            {calcType === "pension" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-purple-400 text-sm border-b border-slate-800 pb-3">محاسبه مستمری بازنشستگی (ماده ۷۷)</h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">میانگین دستمزد مشمول ۲ سال آخر (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={formatNumberWithCommas(pensionAvgWage)}
                    onChange={(e) => handleMoneyInputChange(e, setPensionAvgWage)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none text-purple-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">سابقه پرداخت حق بیمه (سال):</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={pensionYears}
                    onChange={(e) => setPensionYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center font-mono outline-none text-white"
                  />
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>سابقه مؤثر لحاظ‌شده:</span>
                    <span className="font-mono text-white font-bold">{calculatedPension.cappedYears} سال</span>
                  </div>
                  <div className="pt-2 border-t border-purple-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-purple-400">مستمری ماهانه برآوردی:</span>
                    <span className="text-lg font-black text-purple-400 font-mono">
                      {formatTomanDisplay(calculatedPension.monthlyPension)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ۳. بخش بانک قوانین */}
        {activeTab === "laws" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">پایگاه جامع قوانین کار و بیمه</h3>
              <input
                type="text"
                placeholder="جستجو در عنوان، موضوع یا متن ماده..."
                value={searchLaw}
                onChange={(e) => setSearchLaw(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500 text-white"
              />
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setSelectedLawCat("all")}
                  className={`px-3 py-1 rounded-xl shrink-0 transition font-medium ${
                    selectedLawCat === "all" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  همه موارد
                </button>
                <button
                  onClick={() => setSelectedLawCat("labor")}
                  className={`px-3 py-1 rounded-xl shrink-0 transition font-medium ${
                    selectedLawCat === "labor" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  قانون کار
                </button>
                <button
                  onClick={() => setSelectedLawCat("tamin")}
                  className={`px-3 py-1 rounded-xl shrink-0 transition font-medium ${
                    selectedLawCat === "tamin" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  تأمین اجتماعی
                </button>
                <button
                  onClick={() => setSelectedLawCat("unemployment")}
                  className={`px-3 py-1 rounded-xl shrink-0 transition font-medium ${
                    selectedLawCat === "unemployment" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  بیمه بیکاری
                </button>
                <button
                  onClick={() => setSelectedLawCat("court")}
                  className={`px-3 py-1 rounded-xl shrink-0 transition font-medium ${
                    selectedLawCat === "court" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  آرای دیوان
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLaws.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">موردی با این عبارت یافت نشد.</div>
              ) : (
                filteredLaws.map((law) => (
                  <div key={law.id} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{law.title}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {law.year ? `تصویب ${law.year}` : "مرجع رسمی"}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">{law.subject}</div>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                      {law.content}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {law.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ۴. درباره دادکار */}
        {activeTab === "about" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-amber-400">سامانه جامع محاسبات حقوقی دادکار</h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              سامانه «دادکار» با هدف ارائه یک استاندارد مرجع در زمینه محاسبات اداری و کارگاهی روابط کار، سنوات خدمت، مقرری بیکاری و حقوق بازنشستگی منطبق با آرای هیأت عمومی دیوان عدالت اداری طراحی شده است.
            </p>
            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500 space-y-1">
              <div>نسخه: ۱.۴.۲ (اصلاحیه ساختار ورودی‌ها و استنادهای قانونی)</div>
              <div>تطبیق کامل با دادنامه ۱۲۵۳ دیوان عدالت اداری</div>
            </div>
          </div>
        )}
      </main>

      {/* مودال رسمی چاپ و صدور فیش سنوات */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-amber-400">برگه رسمی تسویه‌حساب مزایای پایان کار</h4>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div id="print-area" className="bg-white text-slate-900 p-6 rounded-xl space-y-4 text-xs font-sans">
              <div className="text-center border-b pb-3 border-slate-200">
                <div className="text-base font-black">برگه رسمی تسویه‌حساب پاداش سنوات خدمت</div>
                <div className="text-[11px] text-slate-500 mt-1">تنظیم شده بر اساس مواد ۲۴ و ۳۶ قانون کار و رأی وحدت رویه ۱۲۵۳ دیوان عدالت</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3 border-slate-200">
                <div>تاریخ تنظیم: {new Date().toLocaleDateString("fa-IR")}</div>
                <div>وضعیت: خاتمه خدمت / تسویه نهایی</div>
                <div>سابقه واقعی: {years} سال و {months} ماه و {days} روز</div>
                <div>سابقه مؤثر: {calculatedSeverance.totalEffectiveYears} سال</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold border-b pb-1">
                  <span>شرح آیتم</span>
                  <span>مبلغ (تومان)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>مزد مبنای ماهانه لحاظ شده:</span>
                  <span className="font-mono">{formatTomanDisplay(calculatedSeverance.effectiveWage)}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-300">
                  <span>مبلغ قابل پرداخت پاداش پایان کار:</span>
                  <span className="font-mono">{formatTomanDisplay(calculatedSeverance.totalSeverance)} تومان</span>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-500">
                <div className="border-t pt-2">امضاء و اثر انگشت کارگر</div>
                <div className="border-t pt-2">مهر و امضاء کارفرما</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl font-bold text-xs transition"
              >
                چاپ / ذخیره PDF
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs transition"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* منوی ثابت پایین صفحه (Bottom Navigation) */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-6 py-2.5 flex justify-around items-center z-40">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            activeTab === "home" ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>داشبورد</span>
        </button>

        <button
          onClick={() => setActiveTab("calculators")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            activeTab === "calculators" ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="16" y1="14" x2="16" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
          <span>محاسبات</span>
        </button>

        <button
          onClick={() => setActiveTab("laws")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            activeTab === "laws" ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          <span>قوانین</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            activeTab === "about" ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>درباره</span>
        </button>
      </nav>
    </div>
  );
}
