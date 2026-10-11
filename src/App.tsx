"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  BookOpen,
  FileText,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Percent,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Award,
  Sparkles,
  Printer,
  ChevronDown,
  Building,
  UserCheck,
  Calendar,
  Clock,
  PhoneCall,
  Scale
} from "lucide-react";

// ساختار داده قوانین و مستندات قانونی
interface LawArticle {
  id: string;
  category: "labor" | "tamin" | "unemployment";
  title: string;
  article: string;
  summary: string;
  fullText: string;
  keyPoints: string[];
}

export default function DadKarApp() {
  // تب فعال
  const [activeTab, setActiveTab] = useState<"home" | "calculators" | "laws" | "about">("home");
  const [calcTab, setCalcTab] = useState<"severance" | "unemployment" | "tamin" | "pension">("severance");

  // باز کردن جزئیات ماده قانونی در مودال
  const [selectedLaw, setSelectedLaw] = useState<LawArticle | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // --- وضعیت ماشین‌حساب‌ها ---
  // ۱. متغیرهای حق بیمه
  const [taminWage, setTaminWage] = useState<string>("12000000");
  const [taminType, setTaminType] = useState<"mandatory" | "freelance_12" | "freelance_14" | "freelance_18" | "voluntary">("mandatory");

  // ۲. متغیرهای بیمه بیکاری
  const [unempAvgWage, setUnempAvgWage] = useState<string>("15000000");
  const [unempDepCount, setUnempDepCount] = useState<number>(1);
  const [unempRecordMonths, setUnempRecordMonths] = useState<number>(36);
  const [unempIsMarried, setUnempIsMarried] = useState<boolean>(true);
  const [unempMinWage, setUnempMinWage] = useState<string>("7166184"); // حداقل دستمزد پایه ۱۴۰۳

  // ۳. متغیرهای سنوات و پاداش پایان خدمت
  const [sevCalcType, setSevCalcType] = useState<"simple" | "detailed">("simple");
  const [sevMonthlyWage, setSevMonthlyWage] = useState<string>("20000000");
  const [sevJobWage, setSevJobWage] = useState<string>("12000000");
  const [sevRankWage, setSevRankWage] = useState<string>("3000000");
  const [sevBaseSanavat, setSevBaseSanavat] = useState<string>("2000000");
  const [sevYears, setSevYears] = useState<number>(3);
  const [sevMonths, setSevMonths] = useState<number>(6);
  const [sevDays, setSevDays] = useState<number>(0);

  // ۴. متغیرهای بازنشستگی
  const [penAvgWage, setPenAvgWage] = useState<string>("30000000");
  const [penYears, setPenYears] = useState<number>(30);

  // فیلتر قوانین
  const [lawSearch, setLawSearch] = useState<string>("");
  const [lawFilter, setLawFilter] = useState<string>("all");

  // --- توابع فرمت‌بندی و ورودی مبالغ بدون باگ ---
  const formatToman = (num: number) => {
    return Math.round(num).toLocaleString("fa-IR") + " تومان";
  };

  const formatNumberWithCommas = (val: string | number) => {
    if (!val && val !== 0) return "";
    const cleanStr = String(val).replace(/[^0-9]/g, "");
    if (!cleanStr) return "";
    return parseInt(cleanStr, 10).toLocaleString("fa-IR");
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const raw = e.target.value;
    // تبدیل ارقام فارسی و عربی به انگلیسی
    const normalized = raw
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    // حذف هر کاراکتر غیر عددی
    const cleanDigits = normalized.replace(/[^0-9]/g, "");
    setter(cleanDigits);
  };

  // --- محاسبات ۱: حق بیمه تأمین اجتماعی ---
  const taminResult = useMemo(() => {
    const wage = parseInt(taminWage, 10) || 0;
    let workerRate = 0.07;
    let employerRate = 0.20;
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
    } else if (taminType === "voluntary") {
      workerRate = 0.27;
      employerRate = 0;
      unempRate = 0;
    }

    const workerShare = wage * workerRate;
    const employerShare = wage * employerRate;
    const unempShare = wage * unempRate;
    const total = workerShare + employerShare + unempShare;

    return {
      wage,
      workerShare,
      employerShare,
      unempShare,
      total,
      workerRatePercent: Math.round(workerRate * 100),
      employerRatePercent: Math.round((employerRate + unempRate) * 100),
      totalRatePercent: Math.round((workerRate + employerRate + unempRate) * 100)
    };
  }, [taminWage, taminType]);

  // --- محاسبات ۲: بیمه بیکاری ---
  const unempResult = useMemo(() => {
    const avgWage = parseInt(unempAvgWage, 10) || 0;
    const minWage = parseInt(unempMinWage, 10) || 0;
    const isMarriedOrDep = unempIsMarried || unempDepCount > 0;
    
    let maxMonths = 0;
    const rec = unempRecordMonths;

    if (!isMarriedOrDep) {
      if (rec >= 6 && rec <= 24) maxMonths = 6;
      else if (rec <= 120) maxMonths = 12;
      else if (rec <= 180) maxMonths = 18;
      else if (rec <= 240) maxMonths = 26;
      else if (rec > 240) maxMonths = 36;
    } else {
      if (rec >= 6 && rec <= 24) maxMonths = 12;
      else if (rec <= 120) maxMonths = 18;
      else if (rec <= 180) maxMonths = 26;
      else if (rec <= 240) maxMonths = 36;
      else if (rec > 240) maxMonths = 50;
    }

    let basePay = avgWage * 0.55;
    const validDepCount = Math.min(unempDepCount, 4);
    const depBonus = avgWage * (validDepCount * 0.10);
    let totalMonthly = basePay + depBonus;

    if (totalMonthly < minWage) totalMonthly = minWage;
    const maxAllowed = avgWage * 0.80;
    if (totalMonthly > maxAllowed) totalMonthly = maxAllowed;

    return {
      monthlyPayment: totalMonthly,
      maxMonths,
      totalPaymentSum: totalMonthly * maxMonths,
      depBonusAmount: depBonus,
      validDepCount
    };
  }, [unempAvgWage, unempDepCount, unempRecordMonths, unempIsMarried, unempMinWage]);

  // --- محاسبات ۳: سنوات خدمت (ماده ۲۴ قانون کار) ---
  const sevResult = useMemo(() => {
    let monthlyBase = 0;
    if (sevCalcType === "simple") {
      monthlyBase = parseInt(sevMonthlyWage, 10) || 0;
    } else {
      const jw = parseInt(sevJobWage, 10) || 0;
      const rw = parseInt(sevRankWage, 10) || 0;
      const bs = parseInt(sevBaseSanavat, 10) || 0;
      monthlyBase = jw + rw + bs;
    }

    const dailyWage = monthlyBase / 30;
    const totalDaysWorked = (sevYears * 365) + (sevMonths * 30.416) + sevDays;
    const totalSeverance = (totalDaysWorked / 365) * (dailyWage * 30);
    const yearlyPadasheNoroozMin = monthlyBase * 2;
    const yearlyPadasheNoroozMax = monthlyBase * 3;

    return {
      monthlyBase,
      dailyWage,
      totalSeverance,
      totalYearsDecimal: (totalDaysWorked / 365).toFixed(2),
      yearlyEydiMin: yearlyPadasheNoroozMin,
      yearlyEydiMax: yearlyPadasheNoroozMax
    };
  }, [sevCalcType, sevMonthlyWage, sevJobWage, sevRankWage, sevBaseSanavat, sevYears, sevMonths, sevDays]);

  // --- محاسبات ۴: مستمری بازنشستگی (ماده ۷۷ تأمین اجتماعی) ---
  const penResult = useMemo(() => {
    const avgWage = parseInt(penAvgWage, 10) || 0;
    const calculatedPension = (avgWage * penYears) / 30;
    return {
      calculatedPension,
      percentage: Math.round((penYears / 30) * 100)
    };
  }, [penAvgWage, penYears]);

  // بانک جامع قوانین و مقررات
  const lawsData: LawArticle[] = [
    {
      id: "law-24",
      category: "labor",
      title: "ماده ۲۴ قانون کار (حق سنوات پایان کار)",
      article: "ماده ۲۴",
      summary: "پرداخت پاداش پایان خدمت به ازای هر سال سابقه کار معادل یک ماه آخرین حقوق.",
      fullText: "در صورت خاتمه قرارداد کار، کار معین یا مدت موقت، کارفرما مکلف است به کارگری که مطابق قرارداد، یک سال یا بیشتر، به کار اشتغال داشته است برای هر سال سابقه، اعم از متوالی یا متناوب بر اساس آخرین حقوق مبلغی معادل یک ماه حقوق به عنوان مزایای پایان کار (حق سنوات) به وی پرداخت نماید.",
      keyPoints: [
        "مبنای محاسبه آخرین مزد ثابت یا مزد مبنا است.",
        "برای سوابق کمتر از یک سال نیز به نسبت کارکرد سنوات تعلق می‌گیرد.",
        "ترک کار توسط کارگر نیز طبق دادنامه دیوان عدالت اداری مانع دریافت سنوات نیست."
      ]
    },
    {
      id: "law-34",
      category: "labor",
      title: "ماده ۳۴ قانون کار (تعریف حق‌السعی و دستمزد)",
      article: "ماده ۳۴",
      summary: "تعریف کلیه دریافت‌های قانونی کارگر شامل مزد، حقوق، کمک عائله‌مندی، پاداش و...",
      fullText: "کلیه دریافت‌های قانونی که کارگر به اعتبار قرارداد کار اعم از مزد یا حقوق، کمک عائله‌مندی، هزینه‌های مسکن، خواربار، ایاب و ذهاب، مزایای غیرنقدی، پاداش افزایش تولید، سود سالانه و نظایر آنها دریافت می‌نماید را حق‌السعی می‌نامند.",
      keyPoints: [
        "حق‌السعی مفهومی عام‌تر از مزد ثابت است.",
        "مزایای رفاهی و انگیزه‌ای جزء حق‌السعی محسوب می‌شوند."
      ]
    },
    {
      id: "law-unemp-7",
      category: "unemployment",
      title: "ماده ۷ قانون بیمه بیکاری (میزان و مدت مقرری)",
      article: "ماده ۷",
      summary: "تعیین حداقل و حداکثر مدت و مبلغ پرداختی مقرری بیمه بیکاری بر اساس سابقه و تکفل.",
      fullText: "مدت پرداخت مقرری بیمه بیکاری و میزان آن به شرح زیر است: الف) جمع مدت پرداخت مقرری از زمان برخورداری از مزایای بیمه بیکاری برای مجردین حداکثر ۳۶ ماه و برای متأهلین یا متکفلین حداکثر ۵۰ ماه بر اساس سابقه کلی پرداخت حق بیمه می‌باشد. ب) میزان مقرری روزانه بیمه‌شده بیکار معادل ۵۵٪ متوسط مزد یا حقوق و یا کارمزد روزانه بیمه‌شده می‌باشد. به مقرری افراد متأهل یا متکفل، تا ۴ نفر به ازای هر یک از آنها ۱۰٪ حداقل دستمزد افزوده خواهد شد.",
      keyPoints: [
        "مقرری نباید از حداقل دستمزد مصوب شورای عالی کار کمتر باشد.",
        "مجموع دریافتی نباید از ۸۰٪ متوسط مزد بیمه‌شده تجاوز کند.",
        "مدت دریافت مقرری جزء سوابق پرداخت حق بیمه برای بازنشستگی محاسبه می‌گردد."
      ]
    },
    {
      id: "law-tamin-28",
      category: "tamin",
      title: "ماده ۲۸ قانون تأمین اجتماعی (نرخ حق بیمه)",
      article: "ماده ۲۸",
      summary: "نرخ حق بیمه معادل ۳۰٪ دستمزد شامل سهم کارگر، کارفرما و دولت.",
      fullText: "حق بیمه ۳۰ درصد مزد یا حقوق است که ۷ درصد آن به عهده بیمه‌شده، ۲۰ درصد به عهده کارفرما و ۳ درصد به وسیله دولت تأمین خواهد شد. به علاوه، ۳ درصد نیز بابت حق بیمه بیکاری تماماً توسط کارفرما پرداخت می‌گردد (مجموعاً ۲۳ درصد سهم کارفرما).",
      keyPoints: [
        "سهم کسر شونده از کارگر مقطوعاً ۷٪ است.",
        "کارفرما علاوه بر ۲۰٪ موظف به پرداخت ۳٪ بیمه بیکاری نیز هست (مجموعاً ۲۳٪).",
        "عدم کسر یا عدم واریز توسط کارفرما رافع مسئولیت سازمان تأمین اجتماعی در ارائه خدمات نیست."
      ]
    },
    {
      id: "law-tamin-77",
      category: "tamin",
      title: "ماده ۷۷ قانون تأمین اجتماعی (فرمول مستمری بازنشستگی)",
      article: "ماده ۷۷",
      summary: "فرمول دقیق محاسبه مستمری بر اساس متوسط دستمزد ۲ سال آخر ضرب در سنوات.",
      fullText: "میزان مستمری بازنشستگی عبارت است از یک سی‌ام متوسط مزد یا حقوق بیمه‌شده ضربدر سنوات پرداخت حق بیمه، مشروط بر آنکه از سی و پنج سی‌ام (۳۵/۳۰) تجاوز ننماید. متوسط مزد یا حقوق عبارت است از مجموع مزد یا حقوق بیمه‌شده که بر اساس آن حق بیمه پرداخت گردیده ظرف آخرین دو سال پرداخت حق بیمه تقسیم بر ۲۴.",
      keyPoints: [
        "مبنای میانگین، ۲۴ ماه پایانی سابقه بیمه‌پردازی است.",
        "حداکثر سابقه ملاک برای محاسبه ۳۵ سال است.",
        "مستمری تعیین‌شده نباید از حداقل حقوق مصوب همان سال کمتر باشد."
      ]
    }
  ];

  const filteredLaws = useMemo(() => {
    return lawsData.filter((item) => {
      const matchCategory = lawFilter === "all" || item.category === lawFilter;
      const matchSearch =
        item.title.toLowerCase().includes(lawSearch.toLowerCase()) ||
        item.summary.toLowerCase().includes(lawSearch.toLowerCase()) ||
        item.article.toLowerCase().includes(lawSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [lawsData, lawSearch, lawFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* هدر اپلیکیشن */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                دادکار
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-2 py-0.5 rounded-full">
                  نگارش ۱۴۰۳
                </span>
              </h1>
              <p className="text-xs text-slate-400">مرجع محاسبات قانون کار و تأمین اجتماعی</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("about")}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="راهنما و درباره ما"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* محتوای اصلی تب‌ها */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 pb-28">
        {/* تب ۱: صفحه نخست */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* کارت خوش‌آمدگویی و مشخصات نسخه */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 p-6 shadow-2xl">
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  محیط ابری امن و مستقل دادکار
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  دستیار هوشمند حقوقی و مالی کارگران و کارفرمایان
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  محاسبه آنلاین سنوات، مقرری بیمه بیکاری، سهم ۲۳٪ و ۷٪ بیمه تأمین اجتماعی، و مستمری بازنشستگی مطابق با آخرین بخشنامه‌ها و دادنامه‌های دیوان عدالت اداری.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setActiveTab("calculators");
                      setCalcTab("severance");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                  >
                    <Calculator className="w-4 h-4" />
                    شروع محاسبات
                  </button>
                  <button
                    onClick={() => setActiveTab("laws")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700 active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    بانک مواد قانونی
                  </button>
                </div>
              </div>
            </div>

            {/* دسترسی سریع به ۴ ابزار اصلی */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setActiveTab("calculators");
                  setCalcTab("severance");
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-right flex flex-col justify-between group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-100 block">محاسبه سنوات</span>
                  <span className="text-xs text-slate-400">ماده ۲۴ قانون کار</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("calculators");
                  setCalcTab("unemployment");
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-right flex flex-col justify-between group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-100 block">بیمه بیکاری</span>
                  <span className="text-xs text-slate-400">مقرری و مدت زمان</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("calculators");
                  setCalcTab("tamin");
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-right flex flex-col justify-between group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-100 block">حق بیمه ۳۰٪</span>
                  <span className="text-xs text-slate-400">سهم کارفرما و بیمه‌شده</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("calculators");
                  setCalcTab("pension");
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-right flex flex-col justify-between group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-100 block">مستمری بازنشستگی</span>
                  <span className="text-xs text-slate-400">فرمول ماده ۷۷</span>
                </div>
              </button>
            </div>

            {/* کارت نکات کلیدی و تغییرات اخیر قوانین */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                نکات مهم حقوقی در سال ۱۴۰۳
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>سنوات به ازای خدمت زیر یک سال:</strong> طبق رأی وحدت رویه دیوان عدالت اداری، کارگران با قرارداد موقت کمتر از یک سال نیز به نسبت ایام کارکرد مستحق دریافت پاداش سنوات پایان خدمت هستند.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>سقف بیمه بیکاری:</strong> حداقل مقرری نباید از حداقل دستمزد مصوب سال کمتر باشد و مجموع آن نباید از ۸۰٪ متوسط دستمزد ۲ ماه قبل از بیکاری تجاوز نماید.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>مبنای کسر بیمه:</strong> حق بیمه بر کلیه مزایای مستمر نقدی از جمله حق مسکن و بن خواربار تعلق می‌گیرد.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* تب ۲: ماشین‌حساب‌ها */}
        {activeTab === "calculators" && (
          <div className="space-y-6">
            {/* ناوبری زیر‌مجموعه‌های محاسباتی */}
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto gap-1">
              <button
                onClick={() => setCalcTab("severance")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  calcTab === "severance"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Award className="w-4 h-4" />
                پاداش سنوات
              </button>
              <button
                onClick={() => setCalcTab("unemployment")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  calcTab === "unemployment"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                بیمه بیکاری
              </button>
              <button
                onClick={() => setCalcTab("tamin")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  calcTab === "tamin"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Percent className="w-4 h-4" />
                حق بیمه (۳۰٪)
              </button>
              <button
                onClick={() => setCalcTab("pension")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  calcTab === "pension"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                مستمری بازنشستگی
              </button>
            </div>

            {/* بخش ۱: ماشین‌حساب پاداش پایان خدمت (سنوات) */}
            {calcTab === "severance" && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      محاسبه سنوات پایان کار (ماده ۲۴ قانون کار)
                    </h3>
                    <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setSevCalcType("simple")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          sevCalcType === "simple" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        ساده
                      </button>
                      <button
                        onClick={() => setSevCalcType("detailed")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          sevCalcType === "detailed" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        مزد مبنا (طرح طبقه‌بندی)
                      </button>
                    </div>
                  </div>

                  {sevCalcType === "simple" ? (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        آخرین حقوق پایه ماهیانه (تومان):
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumberWithCommas(sevMonthlyWage)}
                        onChange={(e) => handlePriceInputChange(e, setSevMonthlyWage)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-left text-sm text-emerald-400 font-mono tracking-wider outline-none"
                        placeholder="مثال: ۲۰,۰۰۰,۰۰۰"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          مزد شغل ماهیانه (تومان):
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumberWithCommas(sevJobWage)}
                          onChange={(e) => handlePriceInputChange(e, setSevJobWage)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-left text-xs text-emerald-400 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          مزد رتبه/پایه (تومان):
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumberWithCommas(sevRankWage)}
                          onChange={(e) => handlePriceInputChange(e, setSevRankWage)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-left text-xs text-emerald-400 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          پایه سنوات تجمیعی (تومان):
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumberWithCommas(sevBaseSanavat)}
                          onChange={(e) => handlePriceInputChange(e, setSevBaseSanavat)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-left text-xs text-emerald-400 font-mono outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* سابقه خدمت */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">مدت سابقه کارکرد:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">سال:</span>
                        <input
                          type="number"
                          value={sevYears}
                          onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm text-slate-100 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">ماه:</span>
                        <input
                          type="number"
                          value={sevMonths}
                          onChange={(e) => setSevMonths(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm text-slate-100 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">روز:</span>
                        <input
                          type="number"
                          value={sevDays}
                          onChange={(e) => setSevDays(Math.min(29, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm text-slate-100 font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* نتیجه محاسبه سنوات */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      نتیجه رسمی برآورد سنوات
                    </span>
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      صدور فاکتور رسمی
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">مجموع پاداش پایان خدمت قابل پرداخت:</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                      {formatToman(sevResult.totalSeverance)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block">مزد روزانه مبنا:</span>
                      <span className="font-mono text-slate-200">{formatToman(sevResult.dailyWage)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">معادل کل سابقه:</span>
                      <span className="font-mono text-slate-200">{sevResult.totalYearsDecimal} سال</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">عیدی سالانه (حداقل ۲ ماه):</span>
                      <span className="font-mono text-slate-200">{formatToman(sevResult.yearlyEydiMin)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">سقف عیدی (حداکثر ۳ ماه):</span>
                      <span className="font-mono text-slate-200">{formatToman(sevResult.yearlyEydiMax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* بخش ۲: ماشین‌حساب بیمه بیکاری */}
            {calcTab === "unemployment" && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    محاسبه مقرری و مدت بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        میانگین حقوق مشمول بیمه در ۹۰ روز قبل از بیکاری:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumberWithCommas(unempAvgWage)}
                        onChange={(e) => handlePriceInputChange(e, setUnempAvgWage)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-left text-sm text-blue-400 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        سابقه کلی پرداخت حق بیمه (به ماه):
                      </label>
                      <input
                        type="number"
                        value={unempRecordMonths}
                        onChange={(e) => setUnempRecordMonths(Math.max(6, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center text-sm text-slate-100 font-mono outline-none"
                        placeholder="مثال: ۳۶"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">وضعیت تأهل و تکفل:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setUnempIsMarried(true)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border ${
                            unempIsMarried
                              ? "bg-blue-500/20 border-blue-500 text-blue-400"
                              : "border-slate-800 text-slate-400"
                          }`}
                        >
                          متأهل / متکفل
                        </button>
                        <button
                          onClick={() => setUnempIsMarried(false)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border ${
                            !unempIsMarried
                              ? "bg-blue-500/20 border-blue-500 text-blue-400"
                              : "border-slate-800 text-slate-400"
                          }`}
                        >
                          مجرد
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        تعداد افراد تحت تکفل (حداکثر ۴ نفر مشمول افزایش):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={unempDepCount}
                        onChange={(e) => setUnempDepCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-center text-sm text-slate-100 font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* نتایج بیمه بیکاری */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/30 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                      برآورد مقرری ماهانه و سقف مجاز
                    </span>
                    <span className="text-xs text-slate-400">
                      مدت استحقاق: <strong className="text-white">{unempResult.maxMonths} ماه</strong>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">مقرری خالص ماهانه قابل دریافت:</span>
                    <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                      {formatToman(unempResult.monthlyPayment)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block">پایه ۵۵٪ حقوق متوسط:</span>
                      <span className="font-mono text-slate-200">
                        {formatToman((parseInt(unempAvgWage, 10) || 0) * 0.55)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">افزایش تکفل ({unempResult.validDepCount} نفر):</span>
                      <span className="font-mono text-slate-200">{formatToman(unempResult.depBonusAmount)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">مجموع دریافتی کل دوره ({unempResult.maxMonths} ماه):</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {formatToman(unempResult.totalPaymentSum)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* بخش ۳: ماشین‌حساب تفکیک حق بیمه تامین اجتماعی */}
            {calcTab === "tamin" && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Percent className="w-5 h-5 text-emerald-400" />
                    محاسبه تفکیکی حق بیمه تأمین اجتماعی (ماده ۲۸)
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      دستمزد مشمول کسر بیمه در ماه (تومان):
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatNumberWithCommas(taminWage)}
                      onChange={(e) => handlePriceInputChange(e, setTaminWage)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-left text-sm text-emerald-400 font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">نوع بیمه و نرخ قرارداد:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setTaminType("mandatory")}
                        className={`p-3 rounded-xl border text-right transition-all flex justify-between items-center ${
                          taminType === "mandatory"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <span>اجباری قانون کار (۳۰٪ کامل)</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">۷٪ کارگر + ۲۳٪ کارفرما</span>
                      </button>

                      <button
                        onClick={() => setTaminType("freelance_12")}
                        className={`p-3 rounded-xl border text-right transition-all flex justify-between items-center ${
                          taminType === "freelance_12"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <span>مشاغل آزاد (۱۲٪ بازنشستگی)</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">فقط بازنشستگی</span>
                      </button>

                      <button
                        onClick={() => setTaminType("freelance_14")}
                        className={`p-3 rounded-xl border text-right transition-all flex justify-between items-center ${
                          taminType === "freelance_14"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <span>مشاغل آزاد (۱۴٪ بازنشستگی و فوت)</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">بازنشستگی + فوت</span>
                      </button>

                      <button
                        onClick={() => setTaminType("freelance_18")}
                        className={`p-3 rounded-xl border text-right transition-all flex justify-between items-center ${
                          taminType === "freelance_18"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <span>مشاغل آزاد (۱۸٪ کامل با ازکارافتادگی)</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">کامل مشاغل آزاد</span>
                      </button>

                      <button
                        onClick={() => setTaminType("voluntary")}
                        className={`p-3 rounded-xl border text-right transition-all flex justify-between items-center col-span-1 sm:col-span-2 ${
                          taminType === "voluntary"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <span>بیمه اختیاری (۲۷٪ مستقیم شخص)</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">بدون بیمه بیکاری</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* کارت تفکیک مبالغ کسر شونده */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-emerald-400 font-bold">مجموع کل حق بیمه واریزی ماهانه</span>
                    <span className="text-xs font-mono text-slate-400">نرخ: {taminResult.totalRatePercent}٪</span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {formatToman(taminResult.total)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 block mb-1">
                        سهم کسر از کارگر ({taminResult.workerRatePercent}٪):
                      </span>
                      <span className="font-mono text-emerald-300 font-bold text-sm">
                        {formatToman(taminResult.workerShare)}
                      </span>
                    </div>

                    {taminType === "mandatory" && (
                      <>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block mb-1">سهم پایه کارفرما (۲۰٪):</span>
                          <span className="font-mono text-slate-200 text-sm">
                            {formatToman(taminResult.employerShare)}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block mb-1">سهم بیمه بیکاری کارفرما (۳٪):</span>
                          <span className="font-mono text-slate-200 text-sm">
                            {formatToman(taminResult.unempShare)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* بخش ۴: ماشین‌حساب مستمری بازنشستگی */}
            {calcTab === "pension" && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    تخمین مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        متوسط دستمزد مشمول بیمه در ۲۴ ماه آخر:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumberWithCommas(penAvgWage)}
                        onChange={(e) => handlePriceInputChange(e, setPenAvgWage)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-left text-sm text-purple-400 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        سابقه پرداخت حق بیمه (سال):
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="35"
                        value={penYears}
                        onChange={(e) => setPenYears(Math.min(35, Math.max(1, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center text-sm text-slate-100 font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/30 p-5 space-y-4 shadow-xl">
                  <span className="text-xs text-purple-400 font-bold block">
                    مستمری برآوردی ماه اول بر اساس سابقه و میانگین
                  </span>

                  <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                    {formatToman(penResult.calculatedPension)}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                    فرمول: (میانگین دستمزد ۲ سال آخر × تعداد سال‌های پرداخت حق بیمه) تقسیم بر ۳۰. ضریب دریافتی شما معادل{" "}
                    <strong className="text-purple-300">{penResult.percentage}٪</strong> میانگین دستمزد دو سال پایانی خواهد بود.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* تب ۳: بانک قوانین کار و تأمین اجتماعی */}
        {activeTab === "laws" && (
          <div className="space-y-4">
            {/* جستجو و فیلتر */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="جستجو در مواد قانون کار، بیمه و آراء وحدت رویه..."
                  value={lawSearch}
                  onChange={(e) => setLawSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setLawFilter("all")}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    lawFilter === "all" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400"
                  }`}
                >
                  همه قوانین
                </button>
                <button
                  onClick={() => setLawFilter("labor")}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    lawFilter === "labor" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400"
                  }`}
                >
                  قانون کار
                </button>
                <button
                  onClick={() => setLawFilter("unemployment")}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    lawFilter === "unemployment" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400"
                  }`}
                >
                  بیمه بیکاری
                </button>
                <button
                  onClick={() => setLawFilter("tamin")}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    lawFilter === "tamin" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400"
                  }`}
                >
                  تأمین اجتماعی
                </button>
              </div>
            </div>

            {/* لیست کارتی مواد قانونی */}
            <div className="space-y-3">
              {filteredLaws.length > 0 ? (
                filteredLaws.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLaw(item)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {item.article}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.summary}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  ماده قانونی با این عبارت یافت نشد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* تب ۴: درباره نرم‌افزار و راهنما */}
        {activeTab === "about" && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">سامانه هوشمند دادکار</h3>
                  <p className="text-xs text-slate-400">نسخه ابری نسخه پایدار ۱.۰.۰</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                سامانه «دادکار» با هدف رفع ابهامات مالی و محاسباتی کارگران، کارشناسان منابع انسانی و کارفرمایان مطابق با قوانین مصوب اداره تعاون، کار و رفاه اجتماعی و سازمان تأمین اجتماعی جمهوری اسلامی ایران طراحی شده است.
              </p>
              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span>سال ملاک محاسبات پایه:</span>
                  <span className="text-slate-200 font-mono">۱۴۰۳</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span>وضعیت اتصال آنلاین:</span>
                  <span className="text-emerald-400 font-medium">مستقل و آماده به کار</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>توسعه و زیرساخت:</span>
                  <span className="text-slate-200">React + Capacitor Engine</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* مودال فاکتور و صورت‌حساب رسمی سنوات */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                برگه رسمی تسویه‌حساب پاداش سنوات
              </h4>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                بستن
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">مبنای دستمزد ماهانه:</span>
                <span className="font-mono text-slate-200">{formatToman(sevResult.monthlyBase)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">سابقه کار محاسبه‌شده:</span>
                <span className="font-mono text-slate-200">
                  {sevYears} سال و {sevMonths} ماه و {sevDays} روز
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">مزد روزانه:</span>
                <span className="font-mono text-slate-200">{formatToman(sevResult.dailyWage)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-200">خالص سنوات قانونی:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {formatToman(sevResult.totalSeverance)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                چاپ یا ذخیره PDF
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال جزئیات متن کامل ماده قانونی */}
      {selectedLaw && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                {selectedLaw.article}
              </span>
              <button
                onClick={() => setSelectedLaw(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                بستن
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              <h3 className="font-bold text-sm text-white">{selectedLaw.title}</h3>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                {selectedLaw.fullText}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-200 block text-xs">نکات کلیدی و تفسیری:</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                  {selectedLaw.keyPoints.map((point, index) => (
                    <li key={index} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedLaw(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors mt-2"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* نوار ناوبری ثابت پایین اپلیکیشن */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-6 py-2.5 shadow-2xl">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "home" ? "text-emerald-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-bold">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab("calculators")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "calculators" ? "text-emerald-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px] font-bold">محاسبات</span>
          </button>

          <button
            onClick={() => setActiveTab("laws")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "laws" ? "text-emerald-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold">بانک قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "about" ? "text-emerald-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] font-bold">درباره ما</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
