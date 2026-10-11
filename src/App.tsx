"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Scale,
  Calculator,
  BookOpen,
  Info,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  HelpCircle,
  Share2,
  Calendar,
  Layers,
  Search,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X
} from "lucide-react";

// ==========================================
// انواع داده (Type Definitions)
// ==========================================
type ActiveTab = "home" | "calculators" | "laws" | "about";
type CalculatorType = "severance" | "unemployment" | "social_security" | "pension";
type SeveranceFormula = "simple" | "itemized";

interface LawItem {
  id: string;
  category: "labor" | "social_security" | "unemployment" | "bylaws" | "rulings";
  title: string;
  subject: string;
  year: number; // سال تصویب
  revisionsCount: number; // تعداد دفعات ویرایش و اصلاح
  lastAmendedYear?: number; // سال آخرین بازنگری/استفساریه
  content: string;
  executiveSummary: string; // خلاصه کاربردی
  referenceSource: string; // مرجع و مستند قانونی
  tags: string[];
}

// ==========================================
// دیتابیس جامع قوانین و مقررات با سال و ویرایش
// ==========================================
const LAWS_DATABASE: LawItem[] = [
  {
    id: "law-24",
    category: "labor",
    title: "ماده ۲۴ قانون کار",
    subject: "حق سنوات پایان‌کار (پاداش خدمت)",
    year: 1369,
    revisionsCount: 3,
    lastAmendedYear: 1401,
    content: "در صورت خاتمه قرارداد کار، کارفرما مکلف است به کارگری که مطابق قرارداد یک سال یا بیشتر به کار اشتغال داشته، برای هر سال سابقه معادل یک ماه آخرین حقوق را به عنوان مزایای پایان کار پرداخت نماید. برای سوابق کمتر از یک سال نیز به نسبت مدت کارکرد محاسبه می‌گردد.",
    executiveSummary: "مبنای محاسبه سنوات کلیه کارگران دائم و موقت، آخرین حقوق دریافتی است و به ازای هر سال کارکرد کامل معادل ۳۰ روز مزد پرداخت می‌شود.",
    referenceSource: "قانون کار مصوب مجمع تشخیص مصلحت نظام - ۲۹ آبان ۱۳۶۹",
    tags: ["سنوات", "پایان کار", "خاتمه خدمت", "ماده ۲۴"]
  },
  {
    id: "law-36",
    category: "labor",
    title: "ماده ۳۶ قانون کار",
    subject: "تعریف مزد ثابت و مبنای محاسبه سنوات",
    year: 1369,
    revisionsCount: 4,
    lastAmendedYear: 1402,
    content: "مزد ثابت، مجموع مزد شغل و مزایای ثابت پرداختی به تبع شغل است. مزایای به تبع شغل، مزایایی هستند که بر اساس نوع شغل یا محیط کار مانند فوق‌العاده سختی کار، سرپرستی و حق جذب پرداخت می‌شوند.",
    executiveSummary: "در کارگاه‌های فاقد طرح طبقه‌بندی مشاغل، فوق‌العاده‌های ثابت پرداختی جزو مزد ثابت محسوب و باید در فرمول سنوات لحاظ گردند.",
    referenceSource: "قانون کار جمهوری اسلامی ایران",
    tags: ["مزد ثابت", "مزد مبنا", "حق جذب", "ماده ۳۶"]
  },
  {
    id: "ruling-1253",
    category: "rulings",
    title: "دادنامه ۱۲۵۳ دیوان عدالت اداری",
    subject: "شمول مزایای رفاهی و انگیزشی در سنوات",
    year: 1399,
    revisionsCount: 2,
    lastAmendedYear: 1401,
    content: "بر اساس رای وحدت رویه شماره ۱۲۵۳، مزایای رفاهی و انگیزشی (بن کارگری، حق مسکن، حق اولاد و پاداش افزایش تولید) در صورتی که مستمر باشند و طبق عرف کارگاه پرداخت شوند، در شمول آخرین حقوق موضوع ماده ۲۴ قرار می‌گیرند.",
    executiveSummary: "این رای دیوان ملاک محاسبه سنوات را از مزد پایه صرف فراتر برده و کلیه دریافتی‌های مستمر را در محاسبه حقوق پایان‌کار معتبر می‌داند.",
    referenceSource: "هیئت عمومی دیوان عدالت اداری - دادنامه شماره ۱۲۵۳",
    tags: ["دیوان عدالت اداری", "رای وحدت رویه", "سنوات تجمیعی", "مزایای رفاهی"]
  },
  {
    id: "law-7-unemp",
    category: "unemployment",
    title: "ماده ۷ قانون بیمه بیکاری",
    subject: "مدت و میزان مقرری بیمه بیکاری",
    year: 1369,
    revisionsCount: 2,
    lastAmendedYear: 1384,
    content: "مدت پرداخت مقرری بیمه بیکاری برای مجردین از ۶ ماه تا ۳۶ ماه و برای متأهلین یا متکفلین از ۱۲ ماه تا ۵۰ ماه بر اساس سابقه پرداخت حق بیمه متغیر است. میزان مقرری معادل ۵۵٪ متوسط مزد و برای متأهلین تا حداکثر ۸۰٪ قابل افزایش است.",
    executiveSummary: "مقرری پرداختی نباید از حداقل دستمزد مصوب شورای عالی کار در سال مربوطه کمتر و از ۸۰ درصد متوسط دستمزد بیمه‌شده بیشتر باشد.",
    referenceSource: "قانون بیمه بیکاری مصوب ۲۶ شهریور ۱۳۶۹",
    tags: ["بیمه بیکاری", "مقرری", "مدت پرداخت", "ماده ۷"]
  },
  {
    id: "law-28-ss",
    category: "social_security",
    title: "ماده ۲۸ قانون تأمین اجتماعی",
    subject: "نرخ و ترکیب حق بیمه اجباری",
    year: 1354,
    revisionsCount: 5,
    lastAmendedYear: 1398,
    content: "حق بیمه ۳۰ درصد مزد یا حقوق است که ۷ درصد آن به عهده بیمه‌شده، ۲۰ درصد به عهده کارفرما و ۳ درصد به وسیله دولت تأمین می‌شود.",
    executiveSummary: "سهم کل حق بیمه اجباری کارگری ۳۰٪ دستمزد مشمول بیمه است (۷٪ کارگر، ۲۳٪ کارفرما شامل ۳٪ بیمه بیکاری).",
    referenceSource: "قانون تأمین اجتماعی مصوب تیرماه ۱۳۵۴ با اصلاحات بعدی",
    tags: ["حق بیمه", "تأمین اجتماعی", "سهم کارفرما", "سهم کارگر"]
  },
  {
    id: "law-77-ss",
    category: "social_security",
    title: "ماده ۷۷ قانون تأمین اجتماعی",
    subject: "نحوه محاسبه مستمری بازنشستگی",
    year: 1354,
    revisionsCount: 3,
    lastAmendedYear: 1395,
    content: "میزان مستمری بازنشستگی عبارت است از یک سی‌ام متوسط مزد یا حقوق بیمه‌شده ضربدر سنوات پرداخت حق بیمه، مشروط بر آنکه از سی و پنج سی‌ام تجاوز ننماید. متوسط مزد یا حقوق، عبارت از مجموع حقوق بیمه‌شده در آخرین دو سال اشتغال تقسیم بر ۲۴ است.",
    executiveSummary: "مبنای محاسبه حقوق بازنشستگی میانگین دستمزد مشمول کسر حق بیمه در ۲۴ ماه آخر اشتغال ضربدر تعداد سال‌های پرداخت حق بیمه تقسیم بر ۳۰ است.",
    referenceSource: "قانون تأمین اجتماعی و ماده ۳۱ قانون برنامه پنجم توسعه",
    tags: ["بازنشستگی", "مستمری", "میانگین دو سال", "ماده ۷۷"]
  },
  {
    id: "law-27-labor",
    category: "labor",
    title: "ماده ۲۷ قانون کار",
    subject: "شرایط و ضوابط اخراج و قصور کارگر",
    year: 1369,
    revisionsCount: 1,
    content: "هرگاه کارگر در انجام وظایف محوله قصور ورزد یا آیین‌نامه‌های انضباطی کارگاه را پس از تذکرات کتبی نقض نماید، کارفرما در صورت اعلام نظر مثبت شورای اسلامی کار حق فسخ قرارداد و پرداخت سنوات را دارد.",
    executiveSummary: "اخراج کارگر نیازمند تذکرات مکتوب قبلی و جلب موافقت تشکل کارگری کارگاه یا هیئت تشخیص اداره کار است.",
    referenceSource: "قانون کار - فصل دوم",
    tags: ["اخراج", "قصور کارگر", "فسخ قرارداد", "کمیته انضباطی"]
  },
  {
    id: "law-41-labor",
    category: "labor",
    title: "ماده ۴۱ قانون کار",
    subject: "تعیین حداقل دستمزد سالیانه",
    year: 1369,
    revisionsCount: 1,
    content: "شورای عالی کار همه ساله موظف است میزان حداقل مزد کارگران را برای نقاط مختلف کشور یا صنایع مختلف بر اساس درصد تورم اعلامی بانک مرکزی و سبد معیشت خانوار تعیین نماید.",
    executiveSummary: "حداقل دستمزد توافقی در هر قرارداد نمی‌تواند از نرخ مصوب شورای عالی کار کمتر باشد؛ در غیر این صورت باطل است.",
    referenceSource: "قانون کار - فصل سوم",
    tags: ["حداقل دستمزد", "شورای عالی کار", "تورم", "معیشت"]
  },
  {
    id: "law-148-labor",
    category: "labor",
    title: "ماده ۱۴۸ قانون کار",
    subject: "الزام کارفرما به بیمه نمودن کارگران",
    year: 1369,
    revisionsCount: 2,
    lastAmendedYear: 1390,
    content: "کارفرمایان کارگاه‌های مشمول این قانون مکلفند بر اساس قانون تأمین اجتماعی، نسبت به بیمه نمودن کارگران واحد خود اقدام نمایند. تخلف از این امر مستوجب جریمه نقدی و پرداخت حق بیمه معوقه است.",
    executiveSummary: "عدم ارسال لیست بیمه حتی با رضایت کتبی کارگر تخلف قطعی و غیرقابل سلب است.",
    referenceSource: "قانون کار و ماده ۱۸۳ ضمانت اجرای کیفری",
    tags: ["بیمه اجباری", "جریمه کارفرما", "تأمین اجتماعی", "ماده ۱۴۸"]
  }
];

export default function DadKarApp() {
  // ==========================================
  // وضعیت‌های عمومی و انیمیشن لودینگ
  // ==========================================
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [selectedCalc, setSelectedCalc] = useState<CalculatorType>("severance");

  // ==========================================
  // وضعیت‌های ورودی‌های محاسباتی
  // ==========================================
  const [sevFormula, setSevFormula] = useState<SeveranceFormula>("simple");
  const [years, setYears] = useState<number>(3);
  const [months, setMonths] = useState<number>(4);
  const [days, setDays] = useState<number>(15);
  const [baseSalary, setBaseSalary] = useState<string>("15000000");
  const [jobAllowance, setJobAllowance] = useState<string>("2000000");
  const [welfareAllowance, setWelfareAllowance] = useState<string>("3500000");

  const [unempMonths, setUnempMonths] = useState<number>(36);
  const [isMarried, setIsMarried] = useState<boolean>(true);
  const [dependents, setDependents] = useState<number>(2);
  const [avgSalary90Days, setAvgSalary90Days] = useState<string>("18000000");

  const [insSalary, setInsSalary] = useState<string>("16000000");
  const [insType, setInsType] = useState<"compulsory" | "freelance_12" | "freelance_14" | "freelance_18" | "optional">("compulsory");

  const [penYears, setPenYears] = useState<number>(30);
  const [lastYearAvgSalary, setLastYearAvgSalary] = useState<string>("22000000");
  const [prevYearAvgSalary, setPrevYearAvgSalary] = useState<string>("18000000");

  // ==========================================
  // وضعیت‌های بخش بانک قوانین
  // ==========================================
  const [lawSearch, setLawSearch] = useState<string>("");
  const [selectedLawCategory, setSelectedLawCategory] = useState<string>("all");
  const [activeLawModal, setActiveLawModal] = useState<LawItem | null>(null);

  // ==========================================
  // شبیه‌سازی لودینگ حرفه‌ای در شروع اپ
  // ==========================================
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // ابزار قالب‌بندی اعداد
  const parseNum = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    return clean ? parseInt(clean, 10) : 0;
  };

  const formatNumber = (val: number | string) => {
    const num = typeof val === "string" ? parseNum(val) : val;
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const handlePriceInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
    setter(digitsOnly);
  };

  // ==========================================
  // موتورهای محاسباتی
  // ==========================================
  // ۱. محاسبه سنوات
  const severanceCalc = useMemo(() => {
    const base = parseNum(baseSalary);
    const job = parseNum(jobAllowance);
    const welfare = parseNum(welfareAllowance);

    const totalDays = years * 365 + months * 30 + days;
    const effectiveYearFraction = totalDays / 365;

    let wageForCalc = base;
    if (sevFormula === "itemized") {
      wageForCalc = base + job + welfare;
    }

    const totalSeverance = Math.round(wageForCalc * effectiveYearFraction);

    return {
      totalDays,
      effectiveYearFraction: effectiveYearFraction.toFixed(2),
      wageForCalc,
      totalSeverance
    };
  }, [years, months, days, baseSalary, jobAllowance, welfareAllowance, sevFormula]);

  // ۲. محاسبه بیمه بیکاری
  const unempCalc = useMemo(() => {
    const avg = parseNum(avgSalary90Days);
    let allowedDurationMonths = 0;

    if (isMarried || dependents > 0) {
      if (unempMonths < 24) allowedDurationMonths = 12;
      else if (unempMonths <= 120) allowedDurationMonths = 18;
      else if (unempMonths <= 180) allowedDurationMonths = 26;
      else if (unempMonths <= 240) allowedDurationMonths = 36;
      else allowedDurationMonths = 50;
    } else {
      if (unempMonths < 24) allowedDurationMonths = 6;
      else if (unempMonths <= 120) allowedDurationMonths = 12;
      else if (unempMonths <= 180) allowedDurationMonths = 18;
      else if (unempMonths <= 240) allowedDurationMonths = 26;
      else allowedDurationMonths = 36;
    }

    const baseRate = 0.55;
    const depBonus = Math.min(dependents * 0.1, 0.25);
    const effectiveRate = Math.min(baseRate + (isMarried ? depBonus : 0), 0.8);
    const monthlyBenefit = Math.round(avg * effectiveRate);

    return {
      allowedDurationMonths,
      effectiveRate: Math.round(effectiveRate * 100),
      monthlyBenefit,
      totalBenefit: monthlyBenefit * allowedDurationMonths
    };
  }, [unempMonths, isMarried, dependents, avgSalary90Days]);

  // ۳. محاسبه حق بیمه تأمین اجتماعی
  const insuranceCalc = useMemo(() => {
    const salary = parseNum(insSalary);
    let workerShare = 0;
    let employerShare = 0;
    let unempShare = 0;
    let total = 0;

    switch (insType) {
      case "compulsory":
        workerShare = Math.round(salary * 0.07);
        employerShare = Math.round(salary * 0.20);
        unempShare = Math.round(salary * 0.03);
        total = workerShare + employerShare + unempShare;
        break;
      case "freelance_12":
        workerShare = Math.round(salary * 0.12);
        total = workerShare;
        break;
      case "freelance_14":
        workerShare = Math.round(salary * 0.14);
        total = workerShare;
        break;
      case "freelance_18":
        workerShare = Math.round(salary * 0.18);
        total = workerShare;
        break;
      case "optional":
        workerShare = Math.round(salary * 0.27);
        total = workerShare;
        break;
    }

    return { workerShare, employerShare, unempShare, total };
  }, [insSalary, insType]);

  // ۴. محاسبه مستمری بازنشستگی
  const pensionCalc = useMemo(() => {
    const y1 = parseNum(lastYearAvgSalary);
    const y2 = parseNum(prevYearAvgSalary);
    const twoYearAvg = Math.round((y1 + y2) / 2);
    const cappedYears = Math.min(penYears, 35);
    const monthlyPension = Math.round((twoYearAvg * cappedYears) / 30);

    return {
      twoYearAvg,
      cappedYears,
      monthlyPension
    };
  }, [penYears, lastYearAvgSalary, prevYearAvgSalary]);

  // فیلتر قوانین
  const filteredLaws = useMemo(() => {
    return LAWS_DATABASE.filter((law) => {
      const matchCategory = selectedLawCategory === "all" || law.category === selectedLawCategory;
      const matchSearch =
        law.title.includes(lawSearch) ||
        law.subject.includes(lawSearch) ||
        law.content.includes(lawSearch) ||
        law.year.toString().includes(lawSearch) ||
        law.tags.some((t) => t.includes(lawSearch));
      return matchCategory && matchSearch;
    });
  }, [lawSearch, selectedLawCategory]);

  // ==========================================
  // متد چاپ امن مبتنی بر ساخت سند جدید (Web-Safe)
  // ==========================================
  const handleSafeExport = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8">
        <title>گزارش رسمی محاسبات دادکار</title>
        <style>
          body { font-family: system-ui, Tahoma, sans-serif; background: #fff; color: #1e293b; padding: 24px; direction: rtl; }
          .header { border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 20px; font-weight: bold; color: #b45309; }
          .badge { background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; }
          .row:last-child { border-bottom: none; font-weight: bold; }
          .total { font-size: 18px; color: #047857; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">سامانه حقوقی و کارگری دادکار</div>
          <div class="badge">برگه رسمی محاسبه سنوات</div>
        </div>
        <div class="card">
          <div class="row"><span>مدت اشتغال:</span><span>${years} سال و ${months} ماه و ${days} روز</span></div>
          <div class="row"><span>مزد ماهانه مبنای محاسبه:</span><span>${formatNumber(severanceCalc.wageForCalc)} تومان</span></div>
          <div class="row"><span>روش محاسبه:</span><span>${sevFormula === "itemized" ? "مزد تجمیعی (رای ۱۲۵۳ دیوان)" : "مزد مبنا (ساده)"}</span></div>
          <div class="row"><span class="total">مبلغ خالص پاداش پایان کار:</span><span class="total">${formatNumber(severanceCalc.totalSeverance)} تومان</span></div>
        </div>
        <div class="footer">تولید شده توسط نرم‌افزار دادکار | استناد به ماده ۲۴ و ۳۶ قانون کار جمهوری اسلامی ایران</div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, "_blank");
    if (win) {
      win.focus();
    } else {
      alert("لطفاً اجازه باز شدن پاپ‌آپ را در مرورگر فعال کنید.");
    }
  };

  // ==========================================
  // نمای اسپلش‌اسکرین و لودینگ متحرک
  // ==========================================
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
        {/* نورهای پس‌زمینه پویا */}
        <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -top-20 -right-20 animate-pulse pointer-events-none" />
        <div className="absolute w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -bottom-10 -left-10 animate-pulse pointer-events-none" />

        {/* جعبه لوگوی متحرک */}
        <div className="relative flex items-center justify-center mb-8">
          {/* حلقه هاله نورانی چرخان */}
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-400/40 animate-spin absolute" />
          <div className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center bg-slate-900/90 shadow-2xl shadow-amber-500/20 backdrop-blur-md">
            <Scale className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* عنوان و تایپوگرافی */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent mb-2">
          دادکـار
        </h1>
        <p className="text-xs text-slate-400 tracking-wider mb-8">
          سامانه هوشمند محاسبات قانون کار و تأمین اجتماعی
        </p>

        {/* نوار لودینگ و درصد */}
        <div className="w-64 max-w-[80vw]">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-150 ease-out shadow-sm shadow-amber-400/50"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
            <span>در حال بارگذاری موتور محاسباتی...</span>
            <span className="font-mono text-amber-400">{loadingProgress}٪</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // رابط کاربری اصلی نرم‌افزار
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-amber-500/30">
      {/* هدر بالایی با تم لوکس */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
              دادکار
            </h1>
            <p className="text-[10px] text-slate-400">دستیار قانون کار و تأمین اجتماعی</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("laws")}
            className="flex items-center gap-1 text-xs bg-slate-800/80 hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>بانک قوانین ({LAWS_DATABASE.length})</span>
          </button>
        </div>
      </header>

      {/* محتوای اصلی بر اساس تب فعال */}
      <main className="max-w-md mx-auto px-4 pt-4">
        {/* تب ۱: داشبورد اصلی */}
        {activeTab === "home" && (
          <div className="space-y-4">
            {/* کارت خوش‌آمدگویی و بنر اطلاعاتی */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-amber-500/30 shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    ویرایش تخصصی ۱۴۰۳
                  </span>
                  <h2 className="text-lg font-bold text-slate-100 mt-2">
                    محاسبات سریع و مستندات کارگری
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-5">
                    دسترسی هم‌زمان به موتورهای محاسباتی دیوان عدالت اداری، ماده ۲۴ قانون کار و آخرین آرای هیئت عمومی.
                  </p>
                </div>
              </div>
            </div>

            {/* کارت‌های میانبر محاسبه‌گرها */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedCalc("severance"); setActiveTab("calculators"); }}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-right transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">محاسبه سنوات</h3>
                <p className="text-[11px] text-slate-400 mt-1">ماده ۲۴ و رای ۱۲۵۳</p>
              </button>

              <button
                onClick={() => { setSelectedCalc("unemployment"); setActiveTab("calculators"); }}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-right transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">بیمه بیکاری</h3>
                <p className="text-[11px] text-slate-400 mt-1">ماده ۷ (۶ تا ۵۰ ماه)</p>
              </button>

              <button
                onClick={() => { setSelectedCalc("social_security"); setActiveTab("calculators"); }}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 text-right transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">حق بیمه تأمین اجتماعی</h3>
                <p className="text-[11px] text-slate-400 mt-1">اجباری، آزاد، اختیاری</p>
              </button>

              <button
                onClick={() => { setSelectedCalc("pension"); setActiveTab("calculators"); }}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 text-right transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">مستمری بازنشستگی</h3>
                <p className="text-[11px] text-slate-400 mt-1">ماده ۷۷ (میانگین ۲ سال)</p>
              </button>
            </div>
          </div>
        )}

        {/* تب ۲: محاسبه‌گرها */}
        {activeTab === "calculators" && (
          <div className="space-y-4">
            {/* انتخابگر نوع محاسبه */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto">
              <button
                onClick={() => setSelectedCalc("severance")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCalc === "severance" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400"
                }`}
              >
                سنوات پایان‌کار
              </button>
              <button
                onClick={() => setSelectedCalc("unemployment")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCalc === "unemployment" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400"
                }`}
              >
                بیمه بیکاری
              </button>
              <button
                onClick={() => setSelectedCalc("social_security")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCalc === "social_security" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-slate-400"
                }`}
              >
                حق بیمه
              </button>
              <button
                onClick={() => setSelectedCalc("pension")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCalc === "pension" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400"
                }`}
              >
                بازنشستگی
              </button>
            </div>

            {/* فرم ۱: سنوات */}
            {selectedCalc === "severance" && (
              <div className="space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-300">روش محاسبه</span>
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        onClick={() => setSevFormula("simple")}
                        className={`px-2 py-1 rounded ${sevFormula === "simple" ? "bg-amber-500/30 text-amber-300" : "text-slate-400"}`}
                      >
                        ساده (مزد مبنا)
                      </button>
                      <button
                        onClick={() => setSevFormula("itemized")}
                        className={`px-2 py-1 rounded ${sevFormula === "itemized" ? "bg-amber-500/30 text-amber-300" : "text-slate-400"}`}
                      >
                        تجمیعی (رای ۱۲۵۳)
                      </button>
                    </div>
                  </div>

                  {/* سابقه اشتغال */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">سال</label>
                      <input
                        type="number"
                        min="0"
                        value={years}
                        onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">ماه</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={months}
                        onChange={(e) => setMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">روز</label>
                      <input
                        type="number"
                        min="0"
                        max="29"
                        value={days}
                        onChange={(e) => setDays(Math.max(0, Math.min(29, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-center text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* دستمزد پایه */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">آخرین حقوق پایه ماهیانه (تومان)</label>
                    <input
                      type="text"
                      value={formatNumber(baseSalary)}
                      onChange={handlePriceInput(setBaseSalary)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* اقلام مازاد در صورت انتخاب روش تجمیعی */}
                  {sevFormula === "itemized" && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">فوق‌العاده شغل و سرپرستی (تومان)</label>
                        <input
                          type="text"
                          value={formatNumber(jobAllowance)}
                          onChange={handlePriceInput(setJobAllowance)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">مزایای مستمر رفاهی (بن، مسکن و...) (تومان)</label>
                        <input
                          type="text"
                          value={formatNumber(welfareAllowance)}
                          onChange={handlePriceInput(setWelfareAllowance)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* نتیجه محاسبه سنوات */}
                <div className="bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مدت مؤثر کارکرد:</span>
                    <span className="font-semibold text-slate-200">{severanceCalc.effectiveYearFraction} سال ({severanceCalc.totalDays} روز)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>مبنای محاسبه هر سال:</span>
                    <span className="font-semibold text-slate-200">{formatNumber(severanceCalc.wageForCalc)} تومان</span>
                  </div>
                  <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center">
                    <span className="text-sm font-bold text-amber-300">مبلغ پاداش سنوات:</span>
                    <span className="text-lg font-extrabold text-amber-400">{formatNumber(severanceCalc.totalSeverance)} تومان</span>
                  </div>
                  <button
                    onClick={handleSafeExport}
                    className="w-full mt-2 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>صدور برگه رسمی سنوات (چاپ و PDF)</span>
                  </button>
                </div>
              </div>
            )}

            {/* فرم ۲: بیمه بیکاری */}
            {selectedCalc === "unemployment" && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">سابقه پرداخت بیمه (ماه)</label>
                  <input
                    type="number"
                    min="6"
                    value={unempMonths}
                    onChange={(e) => setUnempMonths(Math.max(6, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-center text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-slate-300">وضعیت تأهل و تکفل</span>
                  <button
                    onClick={() => setIsMarried(!isMarried)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      isMarried ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {isMarried ? "متأهل یا متکفل" : "مجرد"}
                  </button>
                </div>
                {isMarried && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">تعداد افراد تحت تکفل</label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={dependents}
                      onChange={(e) => setDependents(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-center text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">میانگین دستمزد ۹۰ روز آخر (تومان)</label>
                  <input
                    type="text"
                    value={formatNumber(avgSalary90Days)}
                    onChange={handlePriceInput(setAvgSalary90Days)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>مدت مجاز دریافت مقرری:</span>
                    <span className="font-bold text-emerald-400">{unempCalc.allowedDurationMonths} ماه</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>درصد استحقاق از متوسط مزد:</span>
                    <span className="font-bold text-emerald-400">{unempCalc.effectiveRate}٪</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                    <span className="text-emerald-300">مقرری ماهانه:</span>
                    <span className="text-emerald-400">{formatNumber(unempCalc.monthlyBenefit)} تومان</span>
                  </div>
                </div>
              </div>
            )}

            {/* فرم ۳: حق بیمه */}
            {selectedCalc === "social_security" && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">نوع بیمه</label>
                  <select
                    value={insType}
                    onChange={(e: any) => setInsType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="compulsory">اجباری کارگری (۳۰٪)</option>
                    <option value="freelance_12">مشاغل آزاد (۱۲٪ بازنشستگی)</option>
                    <option value="freelance_14">مشاغل آزاد (۱۴٪ بازنشستگی و فوت)</option>
                    <option value="freelance_18">مشاغل آزاد (۱۸٪ کامل)</option>
                    <option value="optional">بیمه اختیاری (۲۷٪)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">مزد مشمول کسر حق بیمه ماهانه (تومان)</label>
                  <input
                    type="text"
                    value={formatNumber(insSalary)}
                    onChange={handlePriceInput(setInsSalary)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-blue-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  {insType === "compulsory" && (
                    <>
                      <div className="flex justify-between">
                        <span>سهم کارگر (۷٪):</span>
                        <span className="text-blue-400 font-semibold">{formatNumber(insuranceCalc.workerShare)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span>سهم کارفرما (۲۰٪):</span>
                        <span className="text-blue-400 font-semibold">{formatNumber(insuranceCalc.employerShare)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span>بیمه بیکاری (۳٪):</span>
                        <span className="text-blue-400 font-semibold">{formatNumber(insuranceCalc.unempShare)} تومان</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-800">
                    <span className="text-blue-300">مجموع پرداختی:</span>
                    <span className="text-blue-400">{formatNumber(insuranceCalc.total)} تومان</span>
                  </div>
                </div>
              </div>
            )}

            {/* فرم ۴: بازنشستگی */}
            {selectedCalc === "pension" && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">سابقه پرداخت حق بیمه (سال)</label>
                  <input
                    type="number"
                    min="10"
                    max="35"
                    value={penYears}
                    onChange={(e) => setPenYears(Math.max(10, Math.min(35, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-center text-sm text-purple-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">میانگین حقوق مشمول بیمه در سال آخر (تومان)</label>
                  <input
                    type="text"
                    value={formatNumber(lastYearAvgSalary)}
                    onChange={handlePriceInput(setLastYearAvgSalary)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-purple-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">میانگین حقوق مشمول بیمه در سال ماقبل آخر (تومان)</label>
                  <input
                    type="text"
                    value={formatNumber(prevYearAvgSalary)}
                    onChange={handlePriceInput(setPrevYearAvgSalary)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left text-sm text-purple-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>میانگین دستمزد ۲ سال آخر:</span>
                    <span className="font-semibold text-purple-400">{formatNumber(pensionCalc.twoYearAvg)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-800">
                    <span className="text-purple-300">مستمری بازنشستگی ماهانه:</span>
                    <span className="text-purple-400">{formatNumber(pensionCalc.monthlyPension)} تومان</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* تب ۳: بانک جامع قوانین با فیلد سال و تعداد ویرایش */}
        {activeTab === "laws" && (
          <div className="space-y-3">
            {/* جستجوگر */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="جستجو در ماده‌ها، سال تصویب، کلمات کلیدی..."
                value={lawSearch}
                onChange={(e) => setLawSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* دسته‌بندی قوانین */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                { id: "all", label: "همه" },
                { id: "labor", label: "قانون کار" },
                { id: "social_security", label: "تأمین اجتماعی" },
                { id: "unemployment", label: "بیمه بیکاری" },
                { id: "rulings", label: "آرای دیوان" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedLawCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                    selectedLawCategory === c.id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* فهرست کارت‌های قوانین با برچسب‌های سال و تعداد ویرایش */}
            <div className="space-y-2.5">
              {filteredLaws.map((law) => (
                <div
                  key={law.id}
                  onClick={() => setActiveLawModal(law)}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-300">{law.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">{law.subject}</p>
                    </div>
                  </div>

                  {/* بج‌های اطلاعاتی سال تصویب و ویرایش */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                      <Calendar className="w-2.5 h-2.5" />
                      تصویب: {law.year}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                      <Layers className="w-2.5 h-2.5" />
                      ویرایش: {law.revisionsCount} بار
                    </span>
                    {law.lastAmendedYear && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        (آخرین بازنگری: {law.lastAmendedYear})
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-4 pt-1">
                    {law.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تب ۴: درباره سامانه */}
        {activeTab === "about" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs leading-5 text-slate-300">
            <h3 className="font-bold text-amber-300 text-sm">درباره سامانه حقوقی دادکار</h3>
            <p>
              دادکار نرم‌افزاری تحت وب و بهینه‌سازی‌شده برای محیط‌های موبایل و وب‌ویو Capacitor است که با رویکرد ارائه محاسبات مستند، استاندارد و شفاف قوانین کار، تأمین اجتماعی و بیمه بیکاری طراحی گردیده است.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-semibold block">مشخصات نسخه:</span>
              <p className="text-slate-400">نسخه: DadKar Pro 3.0</p>
              <p className="text-slate-400">بانک اطلاعاتی: منطبق بر آخرین استفساریه‌ها و دادنامه‌های دیوان عدالت اداری</p>
            </div>
          </div>
        )}
      </main>

      {/* مودال مشاهده کامل جزئیات قانون */}
      {activeLawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-amber-300">{activeLawModal.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeLawModal.subject}</p>
              </div>
              <button
                onClick={() => setActiveLawModal(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* برچسب‌های سال، ویرایش و مرجع */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                سال تصویب رسمی: {activeLawModal.year}
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                تعداد ویرایش‌ها و استفساریه‌ها: {activeLawModal.revisionsCount} بار
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1">متن رسمی قانون:</span>
              <p className="text-xs leading-6 text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 text-justify">
                {activeLawModal.content}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-400 block mb-1">خلاصه کاربردی و تفسیری:</span>
              <p className="text-xs leading-5 text-slate-300 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                {activeLawModal.executiveSummary}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
              <span>مرجع استناد: </span>
              <span className="text-slate-300">{activeLawModal.referenceSource}</span>
            </div>
          </div>
        </div>
      )}

      {/* ناوبری ثابت پایین صفحه (Bottom Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-amber-500/20 px-4 py-2">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === "home" ? "text-amber-400 font-semibold" : "text-slate-400"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>خانه</span>
          </button>

          <button
            onClick={() => setActiveTab("calculators")}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === "calculators" ? "text-amber-400 font-semibold" : "text-slate-400"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>محاسبه‌گرها</span>
          </button>

          <button
            onClick={() => setActiveTab("laws")}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === "laws" ? "text-amber-400 font-semibold" : "text-slate-400"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>بانک قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === "about" ? "text-amber-400 font-semibold" : "text-slate-400"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>درباره</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
