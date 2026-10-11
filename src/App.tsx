"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LAWS_DATABASE, LawItem } from "./lawsData";

export default function DadKarApp() {
  // Splash & Loading State
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Navigation states
  const [activeTab, setActiveTab] = useState<"home" | "calculators" | "laws" | "about">("home");
  const [calcType, setCalcType] = useState<"severance" | "unemployment" | "tamin" | "pension">("severance");

  // Modal print
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Tamin state
  const [taminWage, setTaminWage] = useState<string>("150000000");
  const [taminType, setTaminType] = useState<"mandatory" | "freelance_12" | "freelance_14" | "freelance_18" | "voluntary">("mandatory");

  // Unemployment state
  const [unempAvgWage, setUnempAvgWage] = useState<string>("180000000");
  const [unempMinWage, setUnempMinWage] = useState<string>("111000000");
  const [unempMonths, setUnempMonths] = useState<string>("36");
  const [unempDependents, setUnempDependents] = useState<number>(1);
  const [unempMarried, setUnempMarried] = useState<boolean>(true);

  // Severance state
  const [wageMode, setWageMode] = useState<"unified" | "detailed">("unified");
  const [unifiedWage, setUnifiedWage] = useState<string>("180000000");
  const [baseJobWage, setBaseJobWage] = useState<string>("120000000");
  const [rankWage, setRankWage] = useState<string>("30000000");
  const [baseYearsWage, setBaseYearsWage] = useState<string>("30000000");
  const [years, setYears] = useState<string>("5");
  const [months, setMonths] = useState<string>("6");
  const [days, setDays] = useState<string>("15");

  // Pension state
  const [pensionAvgWage, setPensionAvgWage] = useState<string>("220000000");
  const [pensionYears, setPensionYears] = useState<string>("30");

  // Laws filter
  const [searchLaw, setSearchLaw] = useState("");
  const [selectedLawCat, setSelectedLawCat] = useState<string>("all");

  // Helper formatters
  const formatNumber = (num: number | string) => {
    if (num === "" || isNaN(Number(num))) return "0";
    return Number(num).toLocaleString("fa-IR");
  };

  const parseNumber = (val: string) => {
    return val.replace(/,/g, "").replace(/[^0-9]/g, "");
  };

  // Calculations
  const calculatedTamin = useMemo(() => {
    const wage = Number(parseNumber(taminWage)) || 0;
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

  const calculatedUnemployment = useMemo(() => {
    const avg = Number(parseNumber(unempAvgWage)) || 0;
    const min = Number(parseNumber(unempMinWage)) || 0;
    const m = Number(unempMonths) || 0;

    let baseAmount = avg * 0.55;
    let dependentAddition = unempDependents * (min * 0.10);
    let totalMonthly = baseAmount + dependentAddition;

    if (totalMonthly < min) totalMonthly = min;
    const maxCeiling = avg * 0.80;
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
      floorApplied: totalMonthly === min
    };
  }, [unempAvgWage, unempMinWage, unempMonths, unempDependents, unempMarried]);

  const effectiveWage = useMemo(() => {
    if (wageMode === "unified") {
      return Number(parseNumber(unifiedWage)) || 0;
    }
    const b = Number(parseNumber(baseJobWage)) || 0;
    const r = Number(parseNumber(rankWage)) || 0;
    const y = Number(parseNumber(baseYearsWage)) || 0;
    return b + r + y;
  }, [wageMode, unifiedWage, baseJobWage, rankWage, baseYearsWage]);

  const calculatedSeverance = useMemo(() => {
    const y = Number(years) || 0;
    const m = Math.min(11, Math.max(0, Number(months) || 0));
    const d = Math.min(30, Math.max(0, Number(days) || 0));
    const totalEffectiveYears = y + (m / 12) + (d / 365);
    const totalSeverance = Math.round(effectiveWage * totalEffectiveYears);

    return {
      totalSeverance,
      totalEffectiveYears: totalEffectiveYears.toFixed(3),
      effectiveWage
    };
  }, [effectiveWage, years, months, days]);

  const calculatedPension = useMemo(() => {
    const avg = Number(parseNumber(pensionAvgWage)) || 0;
    const y = Math.min(35, Number(pensionYears) || 0);
    const monthlyPension = Math.round((avg / 30) * y);
    return { monthlyPension, cappedYears: y, avgWage: avg };
  }, [pensionAvgWage, pensionYears]);

  const filteredLaws = useMemo(() => {
    return LAWS_DATABASE.filter(item => {
      const matchCat = selectedLawCat === "all" || item.category === selectedLawCat;
      const matchSearch = item.title.includes(searchLaw) ||
                          item.subject.includes(searchLaw) ||
                          item.content.includes(searchLaw) ||
                          item.tags.some(t => t.includes(searchLaw));
      return matchCat && matchSearch;
    });
  }, [searchLaw, selectedLawCat]);

  const handlePrint = () => {
    window.print();
  };

  if (appLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
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
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            د
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">دادکار</h1>
            <p className="text-[11px] text-slate-400">دستیار تخصصی قوانین کار و تأمین اجتماعی</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("laws")}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
        >
          <span>بانک قوانین</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        {activeTab === "home" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 p-5 rounded-2xl">
              <h2 className="text-lg font-bold text-amber-400 mb-1">سامانه محاسبات حقوق و دستمزد</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                محاسبه برخط و دقیق سنوات، بیمه بیکاری، سهم بیمه و مستمری بازنشستگی بر اساس آخرین مقررات رسمی کشور.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => { setActiveTab("calculators"); setCalcType("severance"); }}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl text-right transition"
                >
                  <div className="text-amber-400 font-bold text-sm mb-1">محاسبه سنوات</div>
                  <div className="text-[11px] text-slate-400">ساده و تفکیکی (رأی ۱۲۵۳)</div>
                </button>
                <button
                  onClick={() => { setActiveTab("calculators"); setCalcType("unemployment"); }}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl text-right transition"
                >
                  <div className="text-blue-400 font-bold text-sm mb-1">بیمه بیکاری</div>
                  <div className="text-[11px] text-slate-400">مقرری ماهانه و استحقاق</div>
                </button>
                <button
                  onClick={() => { setActiveTab("calculators"); setCalcType("tamin"); }}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl text-right transition"
                >
                  <div className="text-emerald-400 font-bold text-sm mb-1">حق بیمه</div>
                  <div className="text-[11px] text-slate-400">اجباری، مشاغل آزاد و اختیاری</div>
                </button>
                <button
                  onClick={() => { setActiveTab("calculators"); setCalcType("pension"); }}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl text-right transition"
                >
                  <div className="text-purple-400 font-bold text-sm mb-1">مستمری بازنشستگی</div>
                  <div className="text-[11px] text-slate-400">ماده ۷۷ قانون تأمین اجتماعی</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calculators" && (
          <div className="space-y-4">
            {/* Calculator Selector Pills */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setCalcType("severance")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${calcType === "severance" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
              >
                سنوات
              </button>
              <button
                onClick={() => setCalcType("unemployment")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${calcType === "unemployment" ? "bg-blue-500 text-white font-bold shadow" : "text-slate-400 hover:text-white"}`}
              >
                بیکاری
              </button>
              <button
                onClick={() => setCalcType("tamin")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${calcType === "tamin" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
              >
                حق بیمه
              </button>
              <button
                onClick={() => setCalcType("pension")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${calcType === "pension" ? "bg-purple-500 text-white font-bold shadow" : "text-slate-400 hover:text-white"}`}
              >
                مستمری
              </button>
            </div>

            {/* Severance Calculator */}
            {calcType === "severance" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-amber-400 text-sm">محاسبه مزایای پایان کار (سنوات)</h3>
                  <div className="flex bg-slate-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      onClick={() => setWageMode("unified")}
                      className={`px-2 py-1 rounded-md transition ${wageMode === "unified" ? "bg-slate-700 text-white" : "text-slate-400"}`}
                    >
                      مزد کل
                    </button>
                    <button
                      onClick={() => setWageMode("detailed")}
                      className={`px-2 py-1 rounded-md transition ${wageMode === "detailed" ? "bg-slate-700 text-white" : "text-slate-400"}`}
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
                      value={formatNumber(unifiedWage)}
                      onChange={(e) => setUnifiedWage(parseNumber(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">مزد شغل ماهانه (تومان):</label>
                      <input
                        type="text"
                        value={formatNumber(baseJobWage)}
                        onChange={(e) => setBaseJobWage(parseNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-left font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">مزد رتبه ماهانه (تومان):</label>
                      <input
                        type="text"
                        value={formatNumber(rankWage)}
                        onChange={(e) => setRankWage(parseNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-left font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">پایه سنوات ماهانه (تومان):</label>
                      <input
                        type="text"
                        value={formatNumber(baseYearsWage)}
                        onChange={(e) => setBaseYearsWage(parseNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-left font-mono outline-none"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-mono outline-none"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-mono outline-none"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-center font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مزد مبنای ماهانه:</span>
                    <span className="font-mono text-white">{formatNumber(calculatedSeverance.effectiveWage)} تومان</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>سابقه مؤثر محاسبه:</span>
                    <span className="font-mono text-white">{calculatedSeverance.totalEffectiveYears} سال</span>
                  </div>
                  <div className="pt-2 border-t border-amber-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-amber-400">مبلغ کل سنوات:</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {formatNumber(calculatedSeverance.totalSeverance)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl text-xs font-bold text-amber-400 transition"
                >
                  چاپ و صدور صورت‌جلسه تسویه‌حساب رسمی
                </button>
              </div>
            )}

            {/* Unemployment Calculator */}
            {calcType === "unemployment" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-blue-400 text-sm border-b border-slate-800 pb-3">محاسبه بیمه بیکاری</h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">متوسط دستمزد ۹۰ روز آخر (تومان):</label>
                  <input
                    type="text"
                    value={formatNumber(unempAvgWage)}
                    onChange={(e) => setUnempAvgWage(parseNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">حداقل دستمزد سال جاری (تومان):</label>
                  <input
                    type="text"
                    value={formatNumber(unempMinWage)}
                    onChange={(e) => setUnempMinWage(parseNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">سابقه بیمه (ماه):</label>
                    <input
                      type="number"
                      value={unempMonths}
                      onChange={(e) => setUnempMonths(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">افراد تحت تکفل:</label>
                    <select
                      value={unempDependents}
                      onChange={(e) => setUnempDependents(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center outline-none"
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
                    className="rounded bg-slate-950 border-slate-800 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="married" className="text-xs text-slate-300 cursor-pointer">متأهل یا متکفل هستم</label>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مدت استحقاق دریافت مقرری:</span>
                    <span className="font-mono text-white font-bold">{calculatedUnemployment.durationMonths} ماه</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مقرری پایه (۵۵٪ متوسط مزد):</span>
                    <span className="font-mono text-white">{formatNumber(calculatedUnemployment.baseAmount)} تومان</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>افزایش بابت تکفل:</span>
                    <span className="font-mono text-white">{formatNumber(calculatedUnemployment.dependentAddition)} تومان</span>
                  </div>
                  <div className="pt-2 border-t border-blue-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-blue-400">مقرری ماهانه پرداختی:</span>
                    <span className="text-lg font-black text-blue-400 font-mono">
                      {formatNumber(calculatedUnemployment.monthly)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tamin Calculator */}
            {calcType === "tamin" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-emerald-400 text-sm border-b border-slate-800 pb-3">محاسبه حق بیمه تأمین اجتماعی</h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">مزد مشمول کسر بیمه (تومان):</label>
                  <input
                    type="text"
                    value={formatNumber(taminWage)}
                    onChange={(e) => setTaminWage(parseNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">نوع بیمه:</label>
                  <select
                    value={taminType}
                    onChange={(e) => setTaminType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
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
                    <span className="font-mono text-white font-bold">{formatNumber(calculatedTamin.employeeShare)} تومان</span>
                  </div>
                  {calculatedTamin.employerShare > 0 && (
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>سهم کارفرما:</span>
                      <span className="font-mono text-white font-bold">{formatNumber(calculatedTamin.employerShare)} تومان</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-emerald-400">مجموع حق بیمه ماهانه:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {formatNumber(calculatedTamin.total)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pension Calculator */}
            {calcType === "pension" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-purple-400 text-sm border-b border-slate-800 pb-3">محاسبه مستمری بازنشستگی (ماده ۷۷)</h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">میانگین دستمزد مشمول ۲ سال آخر (تومان):</label>
                  <input
                    type="text"
                    value={formatNumber(pensionAvgWage)}
                    onChange={(e) => setPensionAvgWage(parseNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-left font-mono outline-none"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center font-mono outline-none"
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
                      {formatNumber(calculatedPension.monthlyPension)} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Laws Database Tab */}
        {activeTab === "laws" && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">بانک مستندات و قوانین کار</h3>
              <input
                type="text"
                placeholder="جست‌وجو در متن مواد، عنوان یا موضوع..."
                value={searchLaw}
                onChange={(e) => setSearchLaw(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setSelectedLawCat("all")}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedLawCat === "all" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}
                >
                  همه
                </button>
                <button
                  onClick={() => setSelectedLawCat("labor")}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedLawCat === "labor" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}
                >
                  قانون کار
                </button>
                <button
                  onClick={() => setSelectedLawCat("tamin")}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedLawCat === "tamin" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}
                >
                  تأمین اجتماعی
                </button>
                <button
                  onClick={() => setSelectedLawCat("unemployment")}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedLawCat === "unemployment" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}
                >
                  بیمه بیکاری
                </button>
                <button
                  onClick={() => setSelectedLawCat("court")}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${selectedLawCat === "court" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}
                >
                  آرای دیوان
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLaws.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">موردی با این مشخصات یافت نشد.</div>
              ) : (
                filteredLaws.map((law) => (
                  <div key={law.id} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{law.title}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {law.year ? `تصویب: ${law.year}` : "مرجع رسمی"}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200">{law.subject}</div>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
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

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-400">درباره سامانه دادکار</h3>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              سامانه «دادکار» پلتفرم تخصصی محاسبات روابط کار، بیمه و حقوق است که با هدف ارتقای شفافیت حقوقی، استناد به متن منقح قوانین و پیشگیری از دعاوی میان کارگران و کارفرمایان توسعه یافته است.
            </p>
            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500 space-y-1">
              <div>نسخه: ۱.۴.۰ (پایگاه قوانین رسمی)</div>
              <div>تطبیق کامل با دادنامه‌های هیأت عمومی دیوان عدالت اداری</div>
            </div>
          </div>
        )}
      </main>

      {/* Print/Download Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
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
                <div className="text-base font-black">برگه رسمی محاسبه و تسویه‌حساب سنوات خدمت</div>
                <div className="text-[11px] text-slate-500 mt-1">تنظیم شده مطابق مواد ۲۴ و ۳۶ قانون کار و دادنامه ۱۲۵۳</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3 border-slate-200">
                <div>تاریخ صدور: {new Date().toLocaleDateString("fa-IR")}</div>
                <div>وضعیت: خاتمه خدمت / تسویه‌حساب</div>
                <div>سابقه خدمت: {years} سال و {months} ماه و {days} روز</div>
                <div>سابقه مؤثر: {calculatedSeverance.totalEffectiveYears} سال</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold border-b pb-1">
                  <span>شرح آیتم</span>
                  <span>مبلغ (تومان)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>مزد مبنای ماهانه لحاظ شده:</span>
                  <span className="font-mono">{formatNumber(calculatedSeverance.effectiveWage)}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-300">
                  <span>مبلغ قابل پرداخت پاداش پایان کار:</span>
                  <span className="font-mono">{formatNumber(calculatedSeverance.totalSeverance)} تومان</span>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-500">
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-2 flex justify-around items-center z-40">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${activeTab === "home" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          <span>داشبورد</span>
        </button>
        <button
          onClick={() => setActiveTab("calculators")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${activeTab === "calculators" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          <span>محاسبه‌گرها</span>
        </button>
        <button
          onClick={() => setActiveTab("laws")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${activeTab === "laws" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          <span>قوانین</span>
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${activeTab === "about" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          <span>درباره</span>
        </button>
      </nav>
    </div>
  );
}
