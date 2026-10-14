import React, { useState, useMemo, useEffect } from "react";
// افزودن فونت رسمی وزیر (Vazirmatn) به صورت سراسری
const vazirFontStyles = `
  @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
  * {
    font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
`;

import { 
  Calculator, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  Search, 
  Calendar, 
  Clock, 
  DollarSign, 
  Info, 
  ShieldAlert, 
  Award, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  Home, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Scale,
  Phone,
  User,
  HeartHandshake,
  Percent,
  Briefcase,
  Coins
} from "lucide-react";
import { LAWS_DATABASE as rawLaws } from "./lawsData";

// تضمین کامل ایمنی بارگذاری دیتابیس
const SAFE_LAWS_DATABASE: any[] = Array.isArray(rawLaws) ? rawLaws : [];

// --- انواع تب‌ها ---
type TabType = "home" | "calc" | "laws" | "faq" | "templates" | "about";
type CalcCategory = 
  | "severance" 
  | "overtime" 
  | "shift" 
  | "leave" 
  | "night" 
  | "sanavat" 
  | "insurance_compulsory" 
  | "insurance_freelance" 
  | "unemployment_benefit" 
  | "pension";

export default function DadKarApp() {
  // Splash & Loading State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(10);

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [activeCalc, setActiveCalc] = useState<CalcCategory>("insurance_compulsory");

    // State و تنظیمات اسلایدر صفحه اصلی
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const homeSlides = [
    {
      id: "calc",
      badge: "سامانه محاسبات هوشمند",
      title: "محاسبه دقیق دستمزد و مطالبات",
      desc: "محاسبه آنی سنوات خدمت، اضافه‌کاری، شب‌کاری، نوبت‌کاری و حق بیمه‌های اجباری، اختیاری و زنان خانه‌دار بر اساس آخرین مصوبات.",
      btnText: "ورود به بخش محاسبات",
      targetTab: "calc" as TabType,
      gradient: "from-blue-700 via-indigo-700 to-slate-900",
      badgeBg: "bg-blue-500/20 text-cyan-200 border-blue-400/30",
    },
    {
      id: "laws",
      badge: "پایگاه جامع قوانین",
      title: "دسترسی به ۳۰۳ ماده قانون کار و تأمین اجتماعی",
      desc: "جستجوی پیشرفته و طبقه‌بندی موضوعی تمام فصول قانون کار جمهوری اسلامی ایران، آیین‌نامه‌ها و قوانین مرتبط بیمه‌ای.",
      btnText: "مشاهده متن قوانین",
      targetTab: "laws" as TabType,
      gradient: "from-emerald-700 via-teal-800 to-slate-900",
      badgeBg: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    },
    {
      id: "templates",
      badge: "مخزن اسناد و قراردادها",
      title: "قالب‌های آماده فرم‌ها و قراردادهای کار",
      desc: "مجموعه کاربردی انواع قراردادهای موقت، دائمی، پروژه‌ای، تسویه‌حساب نهایی و فرم‌های اداری با امکان کپی مستقیم.",
      btnText: "دانلود و کپی قالب‌ها",
      targetTab: "templates" as TabType,
      gradient: "from-amber-600 via-orange-700 to-slate-900",
      badgeBg: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    },
    {
      id: "about",
      badge: "پشتیبانی و ارتباط",
      title: "مشاوره و پشتیبانی حقوق کار",
      desc: "توسعه‌یافته توسط سید حسین حجازی. آماده دریافت نظرات سازنده و ارائه مشاوره‌های تخصصی روابط کار و امور اجتماعی.",
      btnText: "اطلاعات تماس و پشتیبانی",
      targetTab: "about" as TabType,
      gradient: "from-purple-700 via-violet-800 to-slate-900",
      badgeBg: "bg-purple-500/20 text-purple-200 border-purple-400/30",
    },
  ];

  useEffect(() => {
    if (activeTab !== "home") return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [activeTab, homeSlides.length]);


  // Calculator Inputs
  const [baseSalary, setBaseSalary] = useState<number>(100000000); // 100,000,000 Rials (10M Toman)
  const [years, setYears] = useState<number>(1);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10);
  const [shiftType, setShiftType] = useState<"morning-evening" | "morning-night" | "evening-night" | "rotational">("morning-evening");
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(5);
  const [dependents, setDependents] = useState<number>(1); // افراد تحت تکفل برای بیمه بیکاری
  const [unemploymentMonths, setUnemploymentMonths] = useState<number>(24); // سابقه پرداخت حق بیمه (ماه)
  const [insuranceYears, setInsuranceYears] = useState<number>(30); // سابقه بیمه برای بازنشستگی

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayLimit, setDisplayLimit] = useState<number>(25);
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");

  // Splash Screen Simulation
  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingProgress(45), 400);
    const timer2 = setTimeout(() => setLoadingProgress(85), 900);
    const timer3 = setTimeout(() => {
      setLoadingProgress(100);
      setIsLoading(false);
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    setDisplayLimit(25);
  }, [searchQuery, selectedCategory]);

  // ریال به فرمت خوانا
  const formatRial = (amount: number) => {
    return Math.round(amount).toLocaleString("fa-IR") + " ریال";
  };

  // --- موتور جامع محاسبات ---
  const calculations = useMemo(() => {
    const dailyWage = baseSalary / 30;
    const hourlyWage = baseSalary / 220;

    // ۱. حق سنوات
    const totalDays = (years * 365) + (months * 30) + days;
    const severancePay = (dailyWage * 30) * (totalDays / 365);

    // ۲. اضافه‌کاری
    const overtimeHourlyRate = hourlyWage * 1.4;
    const overtimePay = overtimeHourlyRate * hours;

    // ۳. نوبت‌کاری
    let shiftMultiplier = 0.1;
    if (shiftType === "morning-night") shiftMultiplier = 0.225;
    if (shiftType === "evening-night") shiftMultiplier = 0.225;
    if (shiftType === "rotational") shiftMultiplier = 0.15;
    const shiftPay = baseSalary * shiftMultiplier;

    // ۴. مانده مرخصی
    const leavePay = dailyWage * unworkedLeaveDays;

    // ۵. شب‌کاری
    const nightHourlyRate = hourlyWage * 0.35;
    const nightPay = nightHourlyRate * hours;

    // ۶. پایه سنوات
    const sanavatMonthlyBase = 2100000;
    const totalSanavat = years > 0 ? (sanavatMonthlyBase * years) : 0;

    // ۷. حق بیمه اجباری تأمین اجتماعی (ماده ۲۸ قانون تأمین اجتماعی و ماده ۵ بیمه بیکاری)
    const empWorkerShare = baseSalary * 0.07; // سهم کارگر ۷٪
    const empEmployerShare = baseSalary * 0.20; // سهم کارفرما ۲۰٪
    const empUnemploymentShare = baseSalary * 0.03; // بیمه بیکاری کارفرما ۳٪
    const totalCompulsoryInsurance = baseSalary * 0.30; // مجموع ۳۰٪

    // ۸. حق بیمه اختیاری و مشاغل آزاد (خویش‌فرما)
    const voluntary27 = baseSalary * 0.27; // اختیاری ۲۷٪
    const free12 = baseSalary * 0.12; // مشاغل آزاد بازنشستگی ۱۲٪
    const free14 = baseSalary * 0.14; // بازنشستگی و فوت ۱۴٪
    // خط ۱۴۳ فعلی:
    const free18 = baseSalary * 0.18; // بازنشستگی، فوت و ازکارافتادگی ۱۸٪
    
    // بعد از خط ۱۴۳ این خطوط را اضافه کنید:
    const housewives12 = baseSalary * 0.12; // بیمه زنان خانه‌دار - نرخ ۱۲٪
    const housewives14 = baseSalary * 0.14; // بیمه زنان خانه‌دار - نرخ ۱۴٪
    const housewives18 = baseSalary * 0.18; // بیمه زنان خانه‌دار - نرخ ۱۸٪


    // ۹. مقرری و مدت استحقاق بیمه بیکاری (جدول ماده ۷ قانون بیمه بیکاری)
    const minLegalWageMonthly = 71661840; // حداقل دستمزد پایه قانونی تقریبی ماهانه
    const baseUnemploymentDaily = dailyWage * 0.55;
    const dependentBonusDaily = (minLegalWageMonthly / 30) * 0.10 * Math.min(dependents, 4);
    let totalUnemploymentDaily = baseUnemploymentDaily + dependentBonusDaily;

    // سقف مقرری ۸۰٪ متوسط دستمزد و کف آن نباید از حداقل دستمزد کمتر باشد
    if (totalUnemploymentDaily > dailyWage * 0.80) {
      totalUnemploymentDaily = dailyWage * 0.80;
    }
    if (totalUnemploymentDaily < minLegalWageMonthly / 30) {
      totalUnemploymentDaily = minLegalWageMonthly / 30;
    }
    const unemploymentMonthlyPay = totalUnemploymentDaily * 30;

    // محاسبه مدت استحقاق بیمه بیکاری بر اساس جدول قانونی (بر حسب ماه)
    const isMarriedOrDependent = dependents > 0;
    let unemploymentDurationMonths = 0;
    let unemploymentEligible = true;

    if (unemploymentMonths < 6) {
      unemploymentDurationMonths = 0;
      unemploymentEligible = false;
    } else if (unemploymentMonths <= 24) {
      unemploymentDurationMonths = isMarriedOrDependent ? 12 : 6;
    } else if (unemploymentMonths <= 120) {
      unemploymentDurationMonths = isMarriedOrDependent ? 18 : 12;
    } else if (unemploymentMonths <= 180) {
      unemploymentDurationMonths = isMarriedOrDependent ? 26 : 14;
    } else if (unemploymentMonths <= 240) {
      unemploymentDurationMonths = isMarriedOrDependent ? 36 : 18;
    } else {
      unemploymentDurationMonths = isMarriedOrDependent ? 50 : 36;
    }


    // ۱۰. مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی: (متوسط دستمزد * سابقه) / ۳۰)
    const pensionMonthlyPay = (baseSalary * Math.min(insuranceYears, 35)) / 30;

    return {
      dailyWage,
      hourlyWage,
      severancePay,
      overtimePay,
      overtimeHourlyRate,
      shiftPay,
      shiftMultiplier: shiftMultiplier * 100,
      leavePay,
      nightPay,
      nightHourlyRate,
      totalSanavat,
      empWorkerShare,
      empEmployerShare,
      empUnemploymentShare,
      totalCompulsoryInsurance,
      voluntary27,
      free12,
      free14,
      free18,
      housewives12,
      housewives14,
      housewives18,
      unemploymentMonthlyPay,
      unemploymentDurationMonths,
      unemploymentEligible,
      pensionMonthlyPay
    };
  }, [baseSalary, years, months, days, hours, shiftType, unworkedLeaveDays, dependents, unemploymentMonths, ]);

  // فیلتر قوانین
  const filteredLaws = useMemo(() => {
    if (!SAFE_LAWS_DATABASE || !Array.isArray(SAFE_LAWS_DATABASE)) return [];
    const q = searchQuery.trim().toLowerCase();
    return SAFE_LAWS_DATABASE.filter((law: any) => {
      if (!law) return false;
      const matchesCategory = selectedCategory === "all" || law.category === selectedCategory;
      const title = (law.title || "").toLowerCase();
      const subject = (law.subject || "").toLowerCase();
      const content = (law.content || "").toLowerCase();
      const tags = Array.isArray(law.tags) ? law.tags : [];
      const matchesSearch = q === "" || 
        title.includes(q) || subject.includes(q) || content.includes(q) ||
        tags.some((t: string) => typeof t === "string" && t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // پرسش و پاسخ
  const FAQ_DATABASE = [
    {
      id: "f1",
      category: "insurance",
      question: "حق بیمه کارگر چند درصد است و چه بخش‌هایی را شامل می‌شود؟",
      answer: "مجموع حق بیمه مشمولین قانون کار ۳۰ درصد است که ۷ درصد سهم کارگر بوده و از حقوق کسر می‌شود، ۲۰ درصد سهم کارفرما و ۳ درصد سهم بیمه بیکاری است که پرداخت آن تماماً بر عهده کارفرما می‌باشد.",
      lawRef: "ماده ۲۸ قانون تأمین اجتماعی و ماده ۵ قانون بیمه بیکاری"
    },
    {
      id: "f2",
      category: "unemployment",
      question: "مقرری بیمه بیکاری چگونه محاسبه می‌شود و سقف آن چقدر است؟",
      answer: "میزان مقرری روزانه ۵۵٪ متوسط مزد روزانه است. به ازای هر نفر تحت تکفل (تا حداکثر ۴ نفر) ۱۰ درصد حداقل دستمزد اضافه می‌شود، مشروط بر اینکه مجموع از ۸۰ درصد متوسط دستمزد فراتر نرود.",
      lawRef: "ماده ۷ قانون بیمه بیکاری"
    },
    {
      id: "f3",
      category: "pension",
      question: "فرمول محاسبه مستمری بازنشستگی تأمین اجتماعی چیست؟",
      answer: "طبق ماده ۷۷ قانون تأمین اجتماعی، مستمری برابر است با یک سی‌ام متوسط دستمزد دو سال آخر ضرب در سنوات پرداخت حق بیمه (حداکثر سقف محاسبه سنوات ۳۵ سال است).",
      lawRef: "ماده ۷۷ قانون تأمین اجتماعی"
    },
    {
      id: "f4",
      category: "severance",
      question: "آیا سنوات به قراردادهای کمتر از یک سال تعلق می‌گیرد؟",
      answer: "بله، طبق ماده ۲۴ قانون کار و دادنامه ۱۶۸ دیوان عدالت اداری، کارگر به نسبت ایام کارکرد استحقاق دریافت سنوات پایان خدمت را دارد.",
      lawRef: "ماده ۲۴ قانون کار"
    }
  ];

  const filteredFaq = useMemo(() => {
    return FAQ_DATABASE.filter(f => {
      const matchCat = faqCategory === "all" || f.category === faqCategory;
      const matchQuery = faqSearch.trim() === "" ||
        f.question.includes(faqSearch) || f.answer.includes(faqSearch) || f.lawRef.includes(faqSearch);
      return matchCat && matchQuery;
    });
  }, [faqCategory, faqSearch]);

  // قالب‌های کاربردی
  const TEMPLATES_DATABASE = [
    {
      id: "t1",
      title: "قرارداد کار موقت قانونی",
      description: "تنظیم‌شده بر مبنای ماده ۱۰ قانون کار و استانداردهای مصوب روابط کار.",
      tags: ["قرارداد", "کار موقت"],
      content: `بسمه تعالی\nقرارداد کار موقت\nاین قرارداد فی‌مابین کارفرما: .................... و کارگر: .................... با مشخصات مندرج منعقد گردید.\nمدت قرارداد: از تاریخ ............ لغایت ............ \nمزد و مزایا: طبق مصوبات شورای عالی کار و شرایط توافق‌شده کارگاه.\nنسخ قرارداد در دو نسخه تنظیم و اعتبار یکسان دارد.`
    },
    {
      id: "t2",
      title: "دادخواست مطالبه حقوق، سنوات و الزام به بیمه",
      description: "فرم استاندارد ثبت دادخواست در سامانه جامع روابط کار.",
      tags: ["دادخواست", "بیمه", "سنوات"],
      content: `ریاست محترم هیات تشخیص اداره کار\nبا سلام؛ اینجانب .................... بدین‌وسیله به استحضار می‌رساند در کارگاه .................... اشتغال داشته و تقاضای صدور حکم بر الزام کارفرما به واریز حق بیمه طبق ماده ۱۴۸ قانون کار و پرداخت معوقات مزدی و سنوات پایان خدمت را دارم.`
    }
  ];

  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATABASE.filter(t => {
      return templateSearch.trim() === "" ||
        t.title.includes(templateSearch) ||
        t.description.includes(templateSearch);
    });
  }, [templateSearch]);

  // --- صفحه اسپلش و لودینگ اولیه ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex flex-col items-center justify-center p-6 text-white select-none" dir="rtl">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-36 h-36 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/30 flex items-center justify-center animate-bounce duration-1000">
            <div className="w-full h-full bg-slate-900/60 backdrop-blur-md rounded-[22px] flex items-center justify-center">
              <Scale className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 mb-2">
          دادکـــــار
        </h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide mb-10 text-center">
          سامانه هوشمند قوانین کار، سنوات و تأمین اجتماعی
        </p>

        {/* لودینگ بار شیک و نئونی */}
        <div className="w-64 bg-slate-800/80 rounded-full h-2.5 p-0.5 border border-slate-700/50 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <span className="text-[11px] text-cyan-300/80 font-mono mt-3">
          در حال بارگذاری پایگاه داده و ماژول‌ها... {loadingProgress}٪
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/80 text-slate-900 font-sans antialiased pb-28" dir="rtl">
      <style>{vazirFontStyles}</style>
      
      {/* هدر بالا */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/25">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl text-slate-800 tracking-tight">دادکار</h1>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">نسخه ۴.۰</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">دستیار تخصصی حقوق کار و تأمین اجتماعی</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("about")}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>ارتباط با ما</span>
          </button>
        </div>
      </header>

      {/* بخش بدنه اصلی */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-5">

        {/* ======================= ۱. داشبورد صفحه اصلی (HOME) ======================= */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-in fade-in duration-300">
                       {/* بنر اسلایدری ۴ گانه منطبق بر منوهای اصلی */}
            <div className="relative overflow-hidden rounded-3xl text-white shadow-xl min-h-[220px]">
              {homeSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-700 bg-gradient-to-br ${slide.gradient} ${
                    index === currentSlide ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md ${slide.badgeBg}`}>
                        {slide.badge}
                      </span>
                      <span className="text-xs text-white/60 font-mono">
                        {index + 1} / {homeSlides.length}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black tracking-tight">{slide.title}</h2>
                    <p className="text-xs text-slate-200 leading-relaxed max-w-xl line-clamp-2">
                      {slide.desc}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-3 mt-1 border-t border-white/10">
                    <button
                      onClick={() => setActiveTab(slide.targetTab)}
                      className="inline-flex items-center gap-1.5 bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-xl shadow hover:bg-slate-100 active:scale-95 transition"
                    >
                      <span>{slide.btnText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5" dir="ltr">
                      {homeSlides.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentSlide(dotIdx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dotIdx === currentSlide ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                          }`}
                          aria-label={`Slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* بخش گرید کارت‌ها (آیتم‌ها در باکس‌های بسیار شیک با آیکون و متن زیر آن) */}
            <div>
              <h3 className="text-sm font-black text-slate-700 mb-3.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                دسترسی سریع به بخش‌ها و امکانات
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: "calc_insurance",
                    title: "حق بیمه و سهم‌ها",
                    desc: "سهم ۷٪ کارگر، ۲۰٪ کارفرما و ۳٪ بیکاری",
                    icon: ShieldCheck,
                    color: "from-blue-500 to-cyan-500",
                    action: () => { setActiveTab("calc"); setActiveCalc("insurance_compulsory"); }
                  },
                  {
                    id: "calc_unemp",
                    title: "مقرری بیمه بیکاری",
                    desc: "فرمول ۵۵٪ ماده ۷ و افراد تحت تکفل",
                    icon: Coins,
                    color: "from-emerald-500 to-teal-600",
                    action: () => { setActiveTab("calc"); setActiveCalc("unemployment_benefit"); }
                  },
                  {
                    id: "calc_pension",
                    title: "مستمری بازنشستگی",
                    desc: "محاسبه ماده ۷۷ با سنوات و میانگین مزد",
                    icon: Award,
                    color: "from-purple-500 to-indigo-600",
                    action: () => { setActiveTab("calc"); setActiveCalc("pension"); }
                  },
                  {
                    id: "calc_severance",
                    title: "حق سنوات پایان کار",
                    desc: "ماده ۲۴ به نسبت سال، ماه و روز خدمت",
                    icon: Calendar,
                    color: "from-amber-500 to-orange-600",
                    action: () => { setActiveTab("calc"); setActiveCalc("severance"); }
                  },
                  {
                    id: "laws_db",
                    title: "مخزن جامع قوانین",
                    desc: "۳۰۳ ماده قانون کار، تأمین اجتماعی و دیوان",
                    icon: BookOpen,
                    color: "from-indigo-600 to-blue-700",
                    action: () => setActiveTab("laws")
                  },
                  {
                    id: "templates_box",
                    title: "قالب‌ها و دادخواست‌ها",
                    desc: "نمونه قراردادها، تسویه‌حساب و شکایات",
                    icon: FileText,
                    color: "from-rose-500 to-pink-600",
                    action: () => setActiveTab("templates")
                  }
                ].map((box) => {
                  const Icon = box.icon;
                  return (
                    <div
                      key={box.id}
                      onClick={box.action}
                      className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${box.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                          {box.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {box.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* کارت ارتباط با ما در صفحه اصلی */}
            <div 
              onClick={() => setActiveTab("about")}
              className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 flex items-center justify-between cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">پشتیبانی و توسعه‌دهنده</h4>
                  <p className="text-xs text-slate-300">سید حسین حجازی • ۰۹۱۳۸۰۰۳۲۱۶</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
            </div>
          </div>
        )}

        {/* ======================= ۲. ماژول کامل محاسبات (CALCULATOR) ======================= */}
        {activeTab === "calc" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* انتخاب نوع محاسبه به صورت دکمه‌های اسکرول‌شونده مدرن */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
              {[
                { id: "insurance_compulsory", label: "حق بیمه اجباری (۳۰٪)" },
                { id: "unemployment_benefit", label: "مقرری بیمه بیکاری" },
                { id: "pension", label: "مستمری بازنشستگی" },
                { id: "insurance_freelance", label: "بیمه اختیاری و آزاد" },
                { id: "severance", label: "حق سنوات" },
                { id: "overtime", label: "اضافه‌کاری" },
                { id: "shift", label: "نوبت‌کاری" },
                { id: "leave", label: "مانده مرخصی" },
                { id: "night", label: "شب‌کاری" },
                { id: "sanavat", label: "پایه سنوات" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCalc(item.id as CalcCategory)}
                  className={`px-3.5 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
                    activeCalc === item.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* کارت ورود دستمزد: پشتیبانی از تایپ عددی مستقیم تا سقف ۱۰ میلیارد ریال (۱ میلیارد تومان) + اسلایدر */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  مزد مبنا / حقوق ماهانه مشمول (سقف ۵۰۰,۰۰۰,۰۰۰ ریال):
                </label>
                <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={baseSalary ? baseSalary.toLocaleString("fa-IR") : ""}
                  onChange={(e) => {
                    // تبدیل ارقام فارسی و حذف کاماها
                    const rawVal = e.target.value
                      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
                      .replace(/[^0-9]/g, "");
                    const num = Number(rawVal);
                    const maxLimit = 10000000000; // ۱۰ میلیارد ریال معادل ۱ میلیارد تومان
                    if (num <= maxLimit) {
                      setBaseSalary(num);
                    } else {
                      setBaseSalary(maxLimit);
                    }
                  }}
                  className="w-full bg-slate-900 text-emerald-400 font-black text-xl rounded-xl p-3 text-center outline-none border border-slate-700 focus:border-emerald-500 transition"
                />

                  <span className="text-xs text-slate-500 font-bold">ریال</span>
                </div>
              </div>

              <input
                type="range"
                min={10000000}
                max={10000000000}
                step={10000000}
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">مزد روزانه (۳۰ روز):</div>
                  <div className="text-xs font-black text-slate-800 mt-1">{formatRial(calculations.dailyWage)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">مزد ساعتی (۲۲۰ ساعت):</div>
                  <div className="text-xs font-black text-slate-800 mt-1">{formatRial(calculations.hourlyWage)}</div>
                </div>
              </div>
            </div>

            {/* بخش جزئیات محاسبه فعال */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
              
              {/* ۱. حق بیمه اجباری ۳۰ درصد */}
              {activeCalc === "insurance_compulsory" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    محاسبه تفکیکی حق بیمه اجباری تأمین اجتماعی (ماده ۲۸)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                      <span className="text-[11px] text-blue-700 font-bold">سهم کارگر (۷ درصد):</span>
                      <div className="text-lg font-black text-blue-900 mt-1">{formatRial(calculations.empWorkerShare)}</div>
                      <p className="text-[10px] text-blue-600 mt-1">کسر از حقوق ماهانه کارگر</p>
                    </div>
                    <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                      <span className="text-[11px] text-indigo-700 font-bold">سهم کارفرما (۲۰ درصد):</span>
                      <div className="text-lg font-black text-indigo-900 mt-1">{formatRial(calculations.empEmployerShare)}</div>
                      <p className="text-[10px] text-indigo-600 mt-1">تعهد کارفرما برای بازنشستگی و درمان</p>
                    </div>
                    <div className="p-4 bg-cyan-50/70 border border-cyan-100 rounded-2xl">
                      <span className="text-[11px] text-cyan-700 font-bold">بیمه بیکاری (۳ درصد):</span>
                      <div className="text-lg font-black text-cyan-900 mt-1">{formatRial(calculations.empUnemploymentShare)}</div>
                      <p className="text-[10px] text-cyan-600 mt-1">پرداخت تماماً بر عهده کارفرما</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">مجموع کل حق بیمه واریزی به شعبه (۳۰٪):</span>
                    <span className="text-lg font-black text-cyan-300">{formatRial(calculations.totalCompulsoryInsurance)}</span>
                  </div>
                </div>
              )}

            {/* ۲. مقرری و مدت بیمه بیکاری */}
            {activeCalc === "unemployment_benefit" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-slate-800 text-sm">محاسبه مدت و مقرری ماهیانه بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      سابقه پرداخت حق بیمه (ماه):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="480"
                      value={unemploymentMonths}
                      onChange={(e) => setUnemploymentMonths(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-blue-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      معادل تقریبی {(unemploymentMonths / 12).toFixed(1)} سال سابقه
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      تعداد افراد تحت تکفل قانونی:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={dependents}
                      onChange={(e) => setDependents(Math.min(4, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-blue-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {dependents > 0 ? "محاسبه بر مبنای جدول متأهل / متکفل" : "محاسبه بر مبنای جدول مجرد"}
                    </span>
                  </div>
                </div>

                {!calculations.unemploymentEligible ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-700 font-bold space-y-1">
                    <p>⚠️ عدم احراز حداقل سابقه قانونی:</p>
                    <p className="font-normal text-rose-600 leading-relaxed">
                      طبق ماده ۷ قانون بیمه بیکاری، شرط برقراری مقرری، داشتن حداقل ۶ ماه سابقه پرداخت حق بیمه قبل از بیکاری است.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4">
                      <span className="text-xs text-emerald-700 font-bold block mb-1">مدت زمان استحقاق دریافت مقرری:</span>
                      <p className="text-xl font-black text-emerald-800">
                        {calculations.unemploymentDurationMonths} <span className="text-xs font-bold text-emerald-600">ماه</span>
                      </p>
                      <span className="text-[11px] text-emerald-600 mt-1 block">
                        (بر اساس سابقه و وضعیت تکفل)
                      </span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4">
                      <span className="text-xs text-blue-700 font-bold block mb-1">مبلغ تخمینی مقرری ماهانه:</span>
                      <p className="text-xl font-black text-blue-800">
                        {formatRial(calculations.unemploymentMonthlyPay)}
                      </p>
                      <span className="text-[11px] text-blue-600 mt-1 block">
                        (۵۵٪ دستمزد + تکفل، سقف ۸۰٪)
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-[11px] text-slate-500 leading-relaxed">
                  💡 مطابق بندهای «الف» و «ب» ماده ۷: جمع کل مدت پرداخت مقرری برای مجردین حداکثر ۳۶ ماه و برای متأهلین یا متکفلین حداکثر ۵۰ ماه است و میزان مقرری روزانه نباید از ۸۰٪ متوسط مزد بیشتر و از حداقل مزد کمتر باشد.
                </div>
              </div>
            )}


              {/* ۳. مستمری بازنشستگی */}
              {activeCalc === "pension" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    محاسبه مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      تعداد سال‌های سابقه پرداخت حق بیمه (مثلاً ۳۰ سال):
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="35"
                      value={insuranceYears}
                      onChange={(e) => setInsuranceYears(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                    <span className="text-xs text-purple-800 font-bold">میزان مستمری بازنشستگی ماهانه:</span>
                    <div className="text-2xl font-black text-purple-900 mt-1">{formatRial(calculations.pensionMonthlyPay)}</div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    * فرمول قانونی: (متوسط دستمزد ۲ سال آخر × سنوات سابقه) تقسیم بر ۳۰.
                  </p>
                </div>
              )}

              {/* ۴. بیمه اختیاری و مشاغل آزاد */}
              {activeCalc === "insurance_freelance" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Percent className="w-5 h-5 text-indigo-600" />
                    حق بیمه اختیاری و صاحبان حرف و مشاغل آزاد
                  </h3>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-slate-50 rounded-2xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-slate-800">بیمه اختیاری (۲۷٪)</div>
                        <div className="text-[10px] text-slate-500">شامل بازنشستگی، فوت، ازکارافتادگی و درمان کامل</div>
                      </div>
                      <span className="font-black text-sm text-blue-700">{formatRial(calculations.voluntary27)}</span>
                    </div>
                    
                    <div className="p-3 bg-slate-50 rounded-2xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-slate-800">مشاغل آزاد (۱۲٪)</div>
                        <div className="text-[10px] text-slate-500">فقط بازنشستگی و فوت بعد از بازنشستگی</div>
                      </div>
                      <span className="font-black text-sm text-slate-700">{formatRial(calculations.free12)}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-slate-800">مشاغل آزاد (۱۴٪)</div>
                        <div className="text-[10px] text-slate-500">بازنشستگی و فوت قبل و بعد از بازنشستگی</div>
                      </div>
                      <span className="font-black text-sm text-slate-700">{formatRial(calculations.free14)}</span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-200">مشاغل آزاد تعهد کامل (۱۸٪)</div>
                          <div className="text-xs text-slate-400">بازنشستگی، فوت و ازکارافتادگی کلی</div>
                        </div>
                        <div className="font-black text-amber-400">{formatRial(calculations.free18)}</div>
                      </div>
                    </div>
      
                    {/* بخش قوانین و محاسبات بیمه زنان خانه‌دار */}
                    <div className="mt-4 p-4 rounded-xl bg-pink-950/20 border border-pink-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-pink-400">بیمه زنان خانه‌دار (مبتنی بر مشاغل آزاد)</span>
                        <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">شرایط سنی ۱۸ تا ۵۰ سال</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        متقاضیان بین ۱۸ تا ۵۰ سال بدون سابقه قبلی مجاز به ثبت‌نام هستند. در صورت داشتن سابقه معادل مازاد سنی، شرط حداکثر سن ۵۰ سال تعدیل می‌گردد. سرانه درمان به ازای هر نفر جداگانه محاسبه می‌شود.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-pink-500/20">
                          <div className="text-xs text-slate-400 mb-1">نرخ ۱۲٪ (بازنشستگی)</div>
                          <div className="font-black text-pink-400">{formatRial(calculations.housewives12)}</div>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-pink-500/20">
                          <div className="text-xs text-slate-400 mb-1">نرخ ۱۴٪ (بازنشستگی + فوت قبل از آن)</div>
                          <div className="font-black text-pink-400">{formatRial(calculations.housewives14)}</div>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-pink-500/20">
                          <div className="text-xs text-slate-400 mb-1">نرخ ۱۸٪ (بازنشستگی + فوت + ازکارافتادگی)</div>
                          <div className="font-black text-pink-400">{formatRial(calculations.housewives18)}</div>
                        </div>
                      </div>
                    </div>
      
                  </div>
                )}


              {/* ۵. حق سنوات پایان خدمت */}
              {activeCalc === "severance" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    محاسبه حق سنوات پایان خدمت (ماده ۲۴ قانون کار)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 mb-1 block">سال:</label>
                      <input
                        type="number"
                        min="0"
                        value={years}
                        onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 border rounded-xl font-bold text-center bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 mb-1 block">ماه:</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={months}
                        onChange={(e) => setMonths(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 border rounded-xl font-bold text-center bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 mb-1 block">روز:</label>
                      <input
                        type="number"
                        min="0"
                        max="29"
                        value={days}
                        onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 border rounded-xl font-bold text-center bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <span className="text-xs text-blue-800 font-bold">مبلغ کل حق سنوات استحقاقی:</span>
                    <div className="text-2xl font-black text-blue-900 mt-1">{formatRial(calculations.severancePay)}</div>
                  </div>
                </div>
              )}

              {/* ۶. اضافه‌کاری */}
              {activeCalc === "overtime" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    محاسبه فوق‌العاده اضافه‌کاری (ماده ۵۹)
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">ساعات اضافه‌کاری:</label>
                    <input
                      type="number"
                      min="1"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                    />
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <span className="text-xs text-emerald-800 font-bold">مبلغ اضافه‌کاری (ضریب ۱.۴):</span>
                    <div className="text-2xl font-black text-emerald-900 mt-1">{formatRial(calculations.overtimePay)}</div>
                  </div>
                </div>
              )}

              {/* ۷. نوبت‌کاری */}
              {activeCalc === "shift" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Layers className="w-5 h-5 text-blue-600" />
                    محاسبه نوبت‌کاری (ماده ۵۶)
                  </h3>
                  <select
                    value={shiftType}
                    onChange={(e: any) => setShiftType(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="morning-evening">صبح و عصر (۱۰ درصد)</option>
                    <option value="rotational">صبح، عصر و شب (۱۵ درصد)</option>
                    <option value="morning-night">صبح و شب (۲۲.۵ درصد)</option>
                    <option value="evening-night">عصر و شب (۲۲.۵ درصد)</option>
                  </select>
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                    <span className="text-xs text-purple-800 font-bold">مبلغ نوبت‌کاری ماهانه ({calculations.shiftMultiplier}٪):</span>
                    <div className="text-2xl font-black text-purple-900 mt-1">{formatRial(calculations.shiftPay)}</div>
                  </div>
                </div>
              )}

              {/* ۸. مانده مرخصی */}
              {activeCalc === "leave" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    بازخرید مانده مرخصی (مواد ۶۴ و ۶۶)
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">تعداد روزهای مانده مرخصی:</label>
                    <input
                      type="number"
                      min="0"
                      value={unworkedLeaveDays}
                      onChange={(e) => setUnworkedLeaveDays(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                    />
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <span className="text-xs text-amber-800 font-bold">مبلغ بازخرید مرخصی:</span>
                    <div className="text-2xl font-black text-amber-900 mt-1">{formatRial(calculations.leavePay)}</div>
                  </div>
                </div>
              )}

              {/* ۹. شب‌کاری */}
              {activeCalc === "night" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    فوق‌العاده شب‌کاری (ماده ۵۸)
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">ساعات کار شبانه (۲۲ تا ۶ صبح):</label>
                    <input
                      type="number"
                      min="1"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                    />
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <span className="text-xs text-indigo-800 font-bold">فوق‌العاده شب‌کاری (۳۵٪ مازاد):</span>
                    <div className="text-2xl font-black text-indigo-900 mt-1">{formatRial(calculations.nightPay)}</div>
                  </div>
                </div>
              )}

              {/* ۱۰. پایه سنوات */}
              {activeCalc === "sanavat" && (
                <div className="space-y-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    پایه سنوات تجمیعی ماهانه
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">تعداد سال سابقه کارگاه:</label>
                    <input
                      type="number"
                      min="0"
                      value={years}
                      onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                    />
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                    <span className="text-xs text-rose-800 font-bold">مبلغ تخمینی پایه سنوات ماهانه:</span>
                    <div className="text-2xl font-black text-rose-900 mt-1">{formatRial(calculations.totalSanavat)}</div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================= ۳. مخزن قوانین (LAWS) ======================= */}
        {activeTab === "laws" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در ۳۰۳ ماده قانون، آرای دیوان و بخشنامه‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {[
                { id: "all", label: "همه قوانین" },
                { id: "labor", label: "قانون کار" },
                { id: "tamin", label: "تأمین اجتماعی" },
                { id: "unemployment", label: "بیمه بیکاری" },
                { id: "court", label: "آرای دیوان عدالت" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredLaws.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 shadow-xs border border-slate-200">
                موردی یافت نشد.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLaws.slice(0, displayLimit).map((law) => (
                  <div key={law.id} className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/90 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-slate-800 text-sm">{law.title}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                        {law.subject}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed text-justify">
                      {law.content}
                    </p>
                                     {/* برچسب‌ها / هشتگ‌ها با قابلیت کلیک و فیلتر آنی */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
                    {law.tags && law.tags.map((tag: string, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory("all");
                          setSearchQuery(tag);
                        }}
                        title={`مشاهده تمام موارد با برچسب #${tag}`}
                        className="text-[10px] bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-2.5 py-0.5 rounded-full font-bold transition-colors cursor-pointer border border-blue-100/80 active:scale-95"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  </div>
                ))}

                {filteredLaws.length > displayLimit && (
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 25)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>نمایش موارد بیشتر</span>
                    <span className="bg-blue-500 text-[10px] px-2 py-0.5 rounded-full">
                      {filteredLaws.length - displayLimit} مورد باقی‌مانده
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================= ۴. پرسش و پاسخ (FAQ) ======================= */}
        {activeTab === "faq" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در پرسش و پاسخ‌های کاربردی..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <div className="space-y-3">
              {filteredFaq.map((f) => (
                <div key={f.id} className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-2">
                  <div className="flex items-start gap-2 text-slate-800 font-black text-sm">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <h4>{f.question}</h4>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed text-justify pr-6">
                    {f.answer}
                  </p>
                  <div className="pr-6 pt-1">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold inline-block">
                      مستند: {f.lawRef}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= ۵. قالب‌ها و متون (TEMPLATES) ======================= */}
        {activeTab === "templates" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در قراردادها و دادخواست‌ها..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <div className="space-y-3">
              {filteredTemplates.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4>{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{t.description}</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap select-all">
                    {t.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= ۶. درباره ما و ارتباط با ما (ABOUT) ======================= */}
        {activeTab === "about" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Scale className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">سامانه حقوقی و محاسباتی دادکار</h3>
                <p className="text-xs text-slate-500 mt-1">توسعه‌یافته با استانداردهای نوین فناوری و قوانین کار</p>
              </div>

              <div className="pt-4 border-t border-slate-100 max-w-sm mx-auto space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-right space-y-2">
                  <div className="text-xs text-slate-500 font-bold">صاحب امتیاز و مدیر توسعه:</div>
                  <div className="text-base font-black text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>سید حسین حجازی</span>
                  </div>
                </div>

                <a 
                  href="tel:09138003216"
                  className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2 text-right">
                    <Phone className="w-5 h-5 text-cyan-300" />
                    <div>
                      <div className="text-[11px] text-cyan-100 font-medium">شماره تماس مستقیم و پشتیبانی:</div>
                      <div className="text-base font-black tracking-wider">۰۹۱۳۸۰۰۳۲۱۶</div>
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-xl font-bold backdrop-blur-xs">تماس</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================= فوتر ناوبری شناور با طراحی جدید ======================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 py-2.5 px-4 shadow-xl">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {[
            { id: "home", label: "خانه", icon: Home },
            { id: "calc", label: "محاسبات", icon: Calculator },
            { id: "laws", label: "قوانین", icon: BookOpen },
            { id: "templates", label: "قالب‌ها", icon: FileText },
            { id: "about", label: "ارتباط", icon: UserCheck }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                  isActive ? "text-blue-600 font-black scale-105" : "text-slate-400 font-bold hover:text-slate-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
