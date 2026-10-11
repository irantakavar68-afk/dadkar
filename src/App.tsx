"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  ShieldCheck,
  UserMinus,
  Clock,
  Printer,
  ChevronLeft,
  FileText,
  AlertCircle,
  Home,
  BookOpen,
  Info,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  DollarSign,
  Download,
  Share2,
  Heart,
  Baby,
  Briefcase,
  AlertTriangle,
  Flame,
  FileSpreadsheet,
  Scale,
  Sparkles,
  ChevronDown
} from 'lucide-react';

// تابع چاپ و دانلود قطعی PDF برای اندروید وب‌ویو و وب (دست‌نخورده)
const executePrintAndDownload = (slipHtmlId: string, docTitle: string) => {
  const el = document.getElementById(slipHtmlId);
  if (!el) return;

  const content = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <title>${docTitle}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        * { box-sizing: border-box; }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          direction: rtl;
          background: #ffffff;
          color: #0f172a;
          margin: 0;
          padding: 10px;
        }
        .slip-container {
          border: 2px solid #0f172a;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          background: #ffffff;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .gold-seal {
          border: 2px dashed #b45309;
          color: #b45309;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          transform: rotate(-8deg);
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .data-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12.5px;
        }
        .data-table tr.highlight-row {
          background-color: #f8fafc;
          font-weight: bold;
        }
        .data-table tr.highlight-row td {
          border-top: 1.5px solid #0f172a;
          border-bottom: 1.5px solid #0f172a;
          font-size: 14px;
        }
        .disclaimer-box {
          margin-top: 20px;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 12px;
          font-size: 10.5px;
          color: #475569;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="slip-container">
        ${el.innerHTML}
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  
  const printWin = window.open(blobUrl, '_blank');
  if (!printWin) {
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${docTitle}.html`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};

interface LawItemExtended {
  id: string;
  category: 'termination' | 'marriage' | 'maternity' | 'wages' | 'leave' | 'safety' | 'tamin' | 'unemployment';
  title: string;
  subtitle: string;
  year: number; // سال تصویب رسمی
  revisionsCount: number; // تعداد دفعات اصلاح/استفساریه
  lastAmendedYear?: number; // سال آخرین بازنگری
  description: string; // متن رسمی و منقح
  executiveSummary: string; // خلاصه کاربردی و قابل فهم
  tags: string[];
}

// پایگاه داده قوانین با حفظ نام و ساختار COMPREHENSIVE_LAWS به همراه فیلدهای سال و ویرایش
const COMPREHENSIVE_LAWS: LawItemExtended[] = [
  {
    id: 'law-27',
    category: 'termination',
    title: 'ماده ۲۷ قانون کار',
    subtitle: 'قصور در انجام وظایف و فسخ قرارداد (اخراج موجه)',
    year: 1369,
    revisionsCount: 1,
    lastAmendedYear: 1369,
    description: 'هرگاه کارگر در انجام وظایف محوله قصور ورزد و یا آیین‌نامه‌های انضباطی کارگاه را پس از تذکرات کتبی نقض نماید، کارفرما حق دارد با جلب موافقت تشکل کارگری کارگاه (شورای اسلامی کار یا انجمن صنفی) و پرداخت مطالبات معوقه و حق سنوات به ازای هر سال یک ماه، قرارداد کار را فسخ نماید.',
    executiveSummary: 'اخراج کارگر نیازمند تذکرات مکتوب قبلی، آیین‌نامه انضباطی مصوب و موافقت شورای اسلامی کارگاه یا هیئت تشخیص است.',
    tags: ['اخراج', 'قصور کارگر', 'فسخ قرارداد', 'آیین‌نامه انضباطی']
  },
  {
    id: 'law-20',
    category: 'termination',
    title: 'ماده ۲۰ قانون کار',
    subtitle: 'تعلیق قرارداد و بازگشت به کار',
    year: 1369,
    revisionsCount: 1,
    lastAmendedYear: 1369,
    description: 'در مواردی نظیر توقیف کارگر که منتهی به حکم محکومیت نگردد یا خدمت نظام وظیفه، قرارداد کار به حالت تعلیق درمی‌آید. کارگر پس از رفع مانع تعلیق مکلف است ظرف ۳۰ روز خود را به کارفرما معرفی کند؛ امتناع کارفرما از پذیرش وی در حکم اخراج غیرقانونی است.',
    executiveSummary: 'پس از پایان خدمت سربازی یا رفع توقیف بی‌گناه، کارفرما موظف به پذیرش مجدد کارگر است.',
    tags: ['تعلیق کار', 'سربازی', 'بازگشت به کار', 'اخراج غیرقانونی']
  },
  {
    id: 'law-24',
    category: 'termination',
    title: 'ماده ۲۴ قانون کار',
    subtitle: 'حق سنوات پایان‌کار الزامی (پاداش خدمت)',
    year: 1369,
    revisionsCount: 3,
    lastAmendedYear: 1401,
    description: 'در صورت خاتمه قرارداد کار، کارفرما مکلف است به کارگری که مطابق قرارداد، یک سال یا بیشتر اشتغال داشته است، برای هر سال سابقه بر اساس آخرین مزد دریافتی، معادل یک ماه مزد به عنوان مزایای پایان کار (حق سنوات) پرداخت نماید. سنوات برای کمتر از یک سال نیز به تناسب ماه و روز کارکرد تعلق می‌گیرد.',
    executiveSummary: 'مبنای سنوات، آخرین حقوق دریافتی به ازای هر سال ۳۰ روز است و به کارکردهای کمتر از یک سال نیز تعلق می‌گیرد.',
    tags: ['سنوات', 'پاداش خدمت', 'خاتمه کار']
  },
  {
    id: 'law-85-tamin',
    category: 'marriage',
    title: 'ماده ۸۵ قانون تأمین اجتماعی',
    subtitle: 'کمک‌هزینه ازدواج (هدیه پیوند زناشویی)',
    year: 1354,
    revisionsCount: 2,
    lastAmendedYear: 1392,
    description: 'به بیمه‌شده زن یا مرد که برای اولین بار ازدواج می‌کند مبلغی معادل یک ماه متوسط مزد یا حقوق به عنوان کمک‌هزینه ازدواج پرداخت می‌گردد؛ مشروط بر آنکه در تاریخ عقد رابطه استخدامی برقرار بوده و در ۵ سال پیش از ازدواج، حداقل حق بیمه ۷۲۰ روز کار را پرداخته باشد.',
    executiveSummary: 'هدیه ازدواج تأمین اجتماعی معادل یک ماه حقوق مشروط به داشتن ۷۲۰ روز بیمه در ۵ سال قبل از عقد است.',
    tags: ['کمک‌هزینه ازدواج', 'هدیه ازدواج', '۷۲۰ روز بیمه', 'عقد دائم']
  },
  {
    id: 'law-67-tamin',
    category: 'maternity',
    title: 'ماده ۶۷ قانون تأمین اجتماعی',
    subtitle: 'غرامت دستمزد ایام بارداری و مرخصی زایمان',
    year: 1354,
    revisionsCount: 4,
    lastAmendedYear: 1400,
    description: 'بیمه‌شده زن در صورت داشتن سابقه پرداخت حق بیمه ۶۰ روز کار در طول یک سال قبل از زایمان، از کمک بارداری و غرامت دستمزد معادل دو سوم آخرین مزد بهره‌مند می‌شود. مدت مرخصی زایمان برابر قانون جوانی جمعیت ۹ ماه است.',
    executiveSummary: 'مدت مرخصی زایمان ۹ ماه با دریافت دو سوم دستمزد توسط تأمین اجتماعی پرداخت می‌شود.',
    tags: ['مرخصی زایمان', 'کمک بارداری', 'غرامت دستمزد', '۹ ماه مرخصی']
  },
  {
    id: 'law-36-kar',
    category: 'wages',
    title: 'ماده ۳۶ قانون کار',
    subtitle: 'تعریف مزد ثابت و مبنای محاسبه سایر مزایا',
    year: 1369,
    revisionsCount: 2,
    lastAmendedYear: 1401,
    description: 'مزد ثابت عبارت است از مجموع مزد شغل و مزایای ثابت پرداختی به تبع شغل. در کارگاه‌هایی که طرح طبقه‌بندی مشاغل اجرا شده است، مزد رتبه و پایه سنوات جزء مزد مبنا به شمار می‌آیند.',
    executiveSummary: 'مزایای مستمر پرداختی به تبع شغل باید در کلیه محاسبات اضافه کاری، نوبت کاری و سنوات لحاظ شود.',
    tags: ['مزد مبنا', 'مزد شغل', 'پایه سنوات', 'طبقه‌بندی مشاغل']
  },
  {
    id: 'law-60-tamin',
    category: 'safety',
    title: 'ماده ۶۰ قانون تأمین اجتماعی',
    subtitle: 'تعریف حادثه ناشی از کار',
    year: 1354,
    revisionsCount: 1,
    lastAmendedYear: 1354,
    description: 'حوادث ناشی از کار حوادثی است که در حین انجام وظیفه و به سبب آن برای بیمه‌شده اتفاق می‌افتد. رفت و برگشت مستقیم بین منزل و محل کارگاه نیز مشمول این ماده می‌باشد.',
    executiveSummary: 'حوادث حین کار و مسیر مستقیم تردد منزل به کارگاه، بدون نیاز به سابقه بیمه قبلی تحت پوشش ۱۰۰٪ درمان و غرامت است.',
    tags: ['حادثه ناشی از کار', 'مسیر رفت و برگشت', 'درمان رایگان']
  },
  {
    id: 'law-7-unemp',
    category: 'unemployment',
    title: 'ماده ۷ قانون بیمه بیکاری',
    subtitle: 'میزان، شرایط و جدول مدت زمان مقرری بیکاری',
    year: 1369,
    revisionsCount: 2,
    lastAmendedYear: 1384,
    description: 'میزان مقرری بیمه بیکاری معادل ۵۵٪ متوسط دستمزد ۹۰ روز آخر است و به ازای هر تحت تکفل (تا ۴ نفر) ۱۰٪ حداقل دستمزد افزوده می‌شود. مدت مقرری با توجه به سابقه از ۶ تا ۵۰ ماه متغیر است.',
    executiveSummary: 'مقرری بیمه بیکاری بین ۶ تا ۵۰ ماه بر حسب سابقه پرداخت می‌شود و حداقل آن دستمزد قانونی مصوب سال است.',
    tags: ['بیمه بیکاری', 'ماده ۷', 'مدت مقرری', '۵۵ درصد']
  },
  {
    id: 'law-28-tamin',
    category: 'tamin',
    title: 'ماده ۲۸ قانون تأمین اجتماعی',
    subtitle: 'نسبت‌های حق بیمه و مسئولیت پرداخت',
    year: 1354,
    revisionsCount: 4,
    lastAmendedYear: 1398,
    description: 'حق بیمه معادل ۳۰٪ دستمزد است: ۷٪ سهم بیمه‌شده، ۲۰٪ سهم کارفرما، ۳٪ بیمه بیکاری و ۳٪ سهم دولت. کارفرما مسئول پرداخت سهم خود و کسر سهم کارگر از حقوق و ارسال لیست است.',
    executiveSummary: 'کل حق بیمه کارگری ۳۰٪ است که ۷٪ آن سهم کارگر و ۲۳٪ سهم کارفرما است.',
    tags: ['ماده ۲۸', 'حق بیمه ۳۰ درصد', 'سهم کارفرما', 'ارسال لیست']
  },
  {
    id: 'law-77-tamin',
    category: 'tamin',
    title: 'ماده ۷۷ قانون تأمین اجتماعی',
    subtitle: 'فرمول مستمری بازنشستگی',
    year: 1354,
    revisionsCount: 3,
    lastAmendedYear: 1395,
    description: 'مستمری بازنشستگی معادل یک سی‌ام متوسط مزد یا حقوق بیمه‌شده ضربدر سنوات پرداخت حق بیمه است. متوسط مزد عبارت است از مجموع مزد مشمول کسر حق بیمه در ۲ سال آخر تقسیم بر ۲۴.',
    executiveSummary: 'فرمول بازنشستگی: (میانگین دستمزد ۲ سال آخر اشتغال ضربدر سابقه خدمت به سال) تقسیم بر ۳۰.',
    tags: ['ماده ۷۷', 'فرمول بازنشستگی', 'میانگین ۲ سال آخر']
  },
  {
    id: 'law-1253-divan',
    category: 'termination',
    title: 'دادنامه ۱۲۵۳ هیأت عمومی دیوان عدالت اداری',
    subtitle: 'الزام به احتساب کلیه مزایای شغلی در پاداش سنوات',
    year: 1399,
    revisionsCount: 2,
    lastAmendedYear: 1401,
    description: 'بر اساس این رأی وحدت رویه، کلیه مزایایی که به تبع شغل و شرایط محیط پرداخت می‌گردد از قبیل فوق‌العاده شغل، حق سرپرستی، حق جذب و سختی کار، جزء مزد مبنا محسوب شده و کسر کردن آنها از محاسبه سنوات مغایر با قانون کار است.',
    executiveSummary: 'پاداش پایان خدمت باید بر مبنای کل مزایای ثابت شغلی محاسبه شود نه فقط مزد پایه خام.',
    tags: ['دیوان عدالت اداری', 'دادنامه ۱۲۵۳', 'فوق‌العاده شغل در سنوات']
  }
];

export default function DadKarApp() {
  // ۱. اضافه شدن استیت‌های انیمیشن اسپلش و لودینگ
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStage, setLoadingStage] = useState<string>('بارگذاری هسته سیستم...');

  const [rootTab, setRootTab] = useState<'home' | 'calculators' | 'laws' | 'about'>('home');
  const [calcTab, setCalcTab] = useState<'severance' | 'unemployment' | 'tamin' | 'pension'>('severance');

  // استیت آکاردئون نمایش متن کامل قوانین
  const [expandedLawId, setExpandedLawId] = useState<string | null>(null);

  // جستجو و فیلتر قوانین
  const [searchQuery, setSearchQuery] = useState('');
  const [lawCategory, setLawCategory] = useState<'all' | 'termination' | 'marriage' | 'maternity' | 'wages' | 'leave' | 'safety' | 'tamin' | 'unemployment'>('all');

  // اجرای پروسس لودینگ در ورود اولیه اپ
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        if (prev === 25) setLoadingStage('آماده‌سازی پایگاه جامع قوانین کار...');
        if (prev === 60) setLoadingStage('پیکربندی موتورهای محاسباتی دیوان عدالت...');
        if (prev === 85) setLoadingStage('تأیید ماژول‌های صدور فیش رسمی...');
        return prev + 5;
      });
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const sanitizeNumber = (val: string): number => {
    const cleaned = val.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const formatNumber = (num: number): string => num.toLocaleString('fa-IR');

  // ۱. سنوات (فرمول قطعی و دست‌نخورده شما)
  const [sevMode, setSevMode] = useState<'simple' | 'itemized'>('simple');
  const [sevMonthlyWage, setSevMonthlyWage] = useState<number>(0);
  const [sevJobWage, setSevJobWage] = useState<number>(0);
  const [sevRankWage, setSevRankWage] = useState<number>(0);
  const [sevBaseSanavat, setSevBaseSanavat] = useState<number>(0);
  const [sevYears, setSevYears] = useState<number>(1);
  const [sevMonths, setSevMonths] = useState<number>(0);
  const [sevDays, setSevDays] = useState<number>(0);

  const sevCalculation = useMemo(() => {
    const effectiveMonthly = sevMode === 'simple'
      ? sevMonthlyWage
      : (sevJobWage + sevRankWage + sevBaseSanavat);

    const boundedMonths = Math.min(Math.max(sevMonths, 0), 11);
    const boundedDays = Math.min(Math.max(sevDays, 0), 30);
    const effectiveYears = sevYears + (boundedMonths / 12) + (boundedDays / 365);
    const totalAmount = Math.round(effectiveMonthly * effectiveYears);

    return {
      effectiveMonthly,
      effectiveYears: Number(effectiveYears.toFixed(3)),
      totalAmount
    };
  }, [sevMode, sevMonthlyWage, sevJobWage, sevRankWage, sevBaseSanavat, sevYears, sevMonths, sevDays]);

  // ۲. بیمه بیکاری (فرمول قطعی و دست‌نخورده شما)
  const [unempAvgWage, setUnempAvgWage] = useState<number>(0);
  const [unempMinWage, setUnempMinWage] = useState<number>(7166184);
  const [unempDependents, setUnempDependents] = useState<number>(0);
  const [unempInsuranceMonths, setUnempInsuranceMonths] = useState<number>(24);
  const [unempIsMarried, setUnempIsMarried] = useState<boolean>(true);

  const unempCalculation = useMemo(() => {
    if (unempAvgWage <= 0) return null;

    const baseAmount = Math.round(unempAvgWage * 0.55);
    const boundedDeps = Math.min(Math.max(unempDependents, 0), 4);
    const dependentsBonus = Math.round(unempMinWage * 0.10 * boundedDeps);
    let calculatedTotal = baseAmount + dependentsBonus;

    if (calculatedTotal < unempMinWage) calculatedTotal = unempMinWage;
    const maxAllowed = Math.round(unempAvgWage * 0.80);
    if (calculatedTotal > maxAllowed) calculatedTotal = maxAllowed;

    let durationMonths = 0;
    const m = unempInsuranceMonths;
    if (m >= 6 && m <= 24) durationMonths = unempIsMarried ? 12 : 6;
    else if (m >= 25 && m <= 120) durationMonths = unempIsMarried ? 18 : 12;
    else if (m >= 121 && m <= 180) durationMonths = unempIsMarried ? 26 : 18;
    else if (m >= 181 && m <= 240) durationMonths = unempIsMarried ? 36 : 24;
    else if (m >= 241) durationMonths = unempIsMarried ? 50 : 36;

    return {
      baseAmount,
      dependentsBonus,
      totalMonthly: calculatedTotal,
      durationMonths,
      totalPeriodAmount: calculatedTotal * durationMonths
    };
  }, [unempAvgWage, unempMinWage, unempDependents, unempInsuranceMonths, unempIsMarried]);

  // ۳. حق بیمه (فرمول قطعی و دست‌نخورده شما)
  const [taminWage, setTaminWage] = useState<number>(0);
  const [taminType, setTaminType] = useState<string>('compulsory');

  const taminCalculation = useMemo(() => {
    if (taminWage <= 0) return null;

    let workerRate = 7;
    let employerRate = 23;
    let govRate = 3;

    if (taminType === 'freelance_12') {
      workerRate = 12;
      employerRate = 0;
      govRate = 2;
    } else if (taminType === 'freelance_14') {
      workerRate = 14;
      employerRate = 0;
      govRate = 2;
    } else if (taminType === 'freelance_18') {
      workerRate = 18;
      employerRate = 0;
      govRate = 2;
    } else if (taminType === 'optional_27') {
      workerRate = 27;
      employerRate = 0;
      govRate = 0;
    }

    const workerShare = Math.round(taminWage * (workerRate / 100));
    const employerShare = Math.round(taminWage * (employerRate / 100));
    const govShare = Math.round(taminWage * (govRate / 100));

    return {
      workerRate,
      employerRate,
      govRate,
      workerShare,
      employerShare,
      govShare,
      totalPayment: workerShare + employerShare
    };
  }, [taminWage, taminType]);

  // ۴. مستمری بازنشستگی (فرمول قطعی و دست‌نخورده شما)
  const [penAvgWage, setPenAvgWage] = useState<number>(0);
  const [penYears, setPenYears] = useState<number>(30);

  const penCalculation = useMemo(() => {
    if (penAvgWage <= 0 || penYears <= 0) return null;
    const effectiveYears = Math.min(Math.max(penYears, 1), 35);
    const monthlyPension = Math.round((penAvgWage / 30) * effectiveYears);
    return {
      effectiveYears,
      monthlyPension
    };
  }, [penAvgWage, penYears]);

  // فیلتر قوانین بر اساس متن، تگ، و سال تصویب
  const filteredLaws = useMemo(() => {
    return COMPREHENSIVE_LAWS.filter((item) => {
      const matchCategory = lawCategory === 'all' || item.category === lawCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.year.toString().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [lawCategory, searchQuery]);

  // ==========================================
  // صفحه لودینگ و اسپلش متحرک
  // ==========================================
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none overflow-hidden" dir="rtl">
        <div className="absolute w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* لوگو انیمیشنی دادکار با هاله نور */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <Calculator className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-amber-400/20 animate-ping pointer-events-none" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>دادکـار</span>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-normal">نسخه تخصصی</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 mb-8">سامانه هوشمند محاسبات روابط کار و قوانین موضوعه</p>

        {/* نوار پیشرفت متحرک */}
        <div className="w-64 max-w-[85vw] space-y-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-150"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>{loadingStage}</span>
            <span className="font-mono text-amber-400 font-bold">{loadingProgress}٪</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-amber-500 selection:text-black" dir="rtl">
      
      {/* هدر دست‌نخورده */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
            <Calculator className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">دادکار</h1>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">نسخه حرفه‌ای حقوقی</span>
            </div>
            <p className="text-[11px] text-slate-400">سامانه محاسبات تخصصی قانون کار و قوانین موضوعه</p>
          </div>
        </div>

        {rootTab !== 'home' && (
          <button
            onClick={() => setRootTab('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs text-slate-200 transition-colors border border-slate-700 shadow-sm"
          >
            <span>داشبورد</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ۱. صفحه داشبورد */}
        {rootTab === 'home' && (
          <div className="space-y-6">
            <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 shadow-2xl">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-700/50">
                  مرجع استنادی روابط کار
                </span>
                <h2 className="text-lg font-black text-white">سامانه هوشمند و فیش‌های رسمی دادکار</h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                  انجام دقیق‌ترین محاسبات حقوقی به همراه صدور فیش با سربرگ استاندارد، مهر تأیید دیجیتال و دسترسی به جامع‌ترین پایگاه مواد قانونی روابط کار و تأمین اجتماعی.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('severance'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Clock className="w-7 h-7 text-amber-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                  محاسبه سنوات
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۴ قانون کار
                </span>
              </button>

              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('pension'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <ShieldCheck className="w-7 h-7 text-emerald-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors">
                  مستمری بازنشستگی
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷۷ تأمین اجتماعی
                </span>
              </button>

              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('unemployment'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <UserMinus className="w-7 h-7 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-cyan-400 transition-colors">
                  مقرری بیمه بیکاری
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷ بیمه بیکاری
                </span>
              </button>

              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('tamin'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <Calculator className="w-7 h-7 text-indigo-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-indigo-400 transition-colors">
                  محاسبه حق بیمه
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۸ تأمین اجتماعی
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ۲. بخش محاسبه‌گرها (با حفظ استایل‌ها و فیش حقوقی) */}
        {rootTab === 'calculators' && (
          <div className="space-y-6">
            <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 gap-1 overflow-x-auto">
              <button
                onClick={() => setCalcTab('severance')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  calcTab === 'severance' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                سنوات پایان‌کار
              </button>
              <button
                onClick={() => setCalcTab('pension')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  calcTab === 'pension' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                مستمری بازنشستگی
              </button>
              <button
                onClick={() => setCalcTab('unemployment')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  calcTab === 'unemployment' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                بیمه بیکاری
              </button>
              <button
                onClick={() => setCalcTab('tamin')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  calcTab === 'tamin' ? 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                حق بیمه
              </button>
            </div>

            {/* سنوات */}
            {calcTab === 'severance' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">روش محاسبه سنوات</span>
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        onClick={() => setSevMode('simple')}
                        className={`px-3 py-1 rounded-lg ${sevMode === 'simple' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'}`}
                      >
                        مزد مبنا (ساده)
                      </button>
                      <button
                        onClick={() => setSevMode('itemized')}
                        className={`px-3 py-1 rounded-lg ${sevMode === 'itemized' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'}`}
                      >
                        تفکیکی (رای ۱۲۵۳)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">سال سابقه</label>
                      <input
                        type="number"
                        min="0"
                        value={sevYears}
                        onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-sm font-mono text-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">ماه کارکرد</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={sevMonths}
                        onChange={(e) => setSevMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-sm font-mono text-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">روز کارکرد</label>
                      <input
                        type="number"
                        min="0"
                        max="29"
                        value={sevDays}
                        onChange={(e) => setSevDays(Math.max(0, Math.min(29, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-sm font-mono text-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {sevMode === 'simple' ? (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">آخرین حقوق ماهیانه (تومان)</label>
                      <input
                        type="text"
                        value={sevMonthlyWage ? formatNumber(sevMonthlyWage) : ''}
                        onChange={(e) => setSevMonthlyWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۵,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-amber-400 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">مزد شغل ماهانه (تومان)</label>
                        <input
                          type="text"
                          value={sevJobWage ? formatNumber(sevJobWage) : ''}
                          onChange={(e) => setSevJobWage(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">مزد رتبه ماهانه (تومان)</label>
                        <input
                          type="text"
                          value={sevRankWage ? formatNumber(sevRankWage) : ''}
                          onChange={(e) => setSevRankWage(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">پایه سنوات تجمیعی ماهانه (تومان)</label>
                        <input
                          type="text"
                          value={sevBaseSanavat ? formatNumber(sevBaseSanavat) : ''}
                          onChange={(e) => setSevBaseSanavat(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* پیش‌نمایش فیش رسمی سنوات جهت چاپ اختصاصی وب‌ویو */}
                <div id="severance-slip-container" className="p-6 rounded-2xl bg-white text-slate-900 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
                    <div>
                      <h3 className="text-base font-black">صورت‌حساب پاداش پایان‌خدمت (سنوات)</h3>
                      <p className="text-[11px] text-slate-600">تنظیم شده مطابق ماده ۲۴ و ۳۶ قانون کار جمهوری اسلامی ایران</p>
                    </div>
                    <div className="gold-seal">
                      <span>دادکـار</span>
                      <span>معتبر رسمی</span>
                    </div>
                  </div>

                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td>مدت کارکرد معتبر:</td>
                        <td className="text-left font-mono font-bold">{sevYears} سال و {sevMonths} ماه و {sevDays} روز ({sevCalculation.effectiveYears} سال)</td>
                      </tr>
                      <tr>
                        <td>روش محاسبه اعمال‌شده:</td>
                        <td className="text-left font-bold">{sevMode === 'simple' ? 'مزد مبنای یکپارچه' : 'تفکیکی بر اساس دادنامه ۱۲۵۳ دیوان عدالت اداری'}</td>
                      </tr>
                      <tr>
                        <td>مزد ماهانه مبنای محاسبه:</td>
                        <td className="text-left font-mono font-bold">{formatNumber(sevCalculation.effectiveMonthly)} تومان</td>
                      </tr>
                      <tr className="highlight-row">
                        <td>مبلغ خالص پاداش سنوات پایان‌کار:</td>
                        <td className="text-left font-mono text-emerald-800 text-base">{formatNumber(sevCalculation.totalAmount)} تومان</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="disclaimer-box">
                    این فیش بر اساس اطلاعات اعلامی متقاضی و منطبق بر آخرین ضوابط منقح قانون کار و آرای وحدت رویه دیوان عدالت اداری صادر گردیده است.
                  </div>
                </div>

                <button
                  onClick={() => executePrintAndDownload('severance-slip-container', 'فیش_رسمی_سنوات_دادکار')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>دانلود نسخه رسمی و چاپ فیش A4 (سازگار با اندروید)</span>
                </button>
              </div>
            )}

            {/* بیمه بیکاری */}
            {calcTab === 'unemployment' && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">میانگین حقوق مشمول بیمه در ۹۰ روز آخر (تومان)</label>
                  <input
                    type="text"
                    value={unempAvgWage ? formatNumber(unempAvgWage) : ''}
                    onChange={(e) => setUnempAvgWage(sanitizeNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">سابقه پرداخت بیمه (ماه)</label>
                    <input
                      type="number"
                      min="6"
                      value={unempInsuranceMonths}
                      onChange={(e) => setUnempInsuranceMonths(Math.max(6, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-sm font-mono text-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">تعداد افراد تحت تکفل</label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={unempDependents}
                      onChange={(e) => setUnempDependents(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-sm font-mono text-cyan-400"
                    />
                  </div>
                </div>

                {unempCalculation && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>مدت پرداخت مقرری:</span>
                      <span className="font-bold text-cyan-400">{unempCalculation.durationMonths} ماه</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                      <span className="text-white">مقرری ماهانه:</span>
                      <span className="text-cyan-400 font-mono">{formatNumber(unempCalculation.totalMonthly)} تومان</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* حق بیمه */}
            {calcTab === 'tamin' && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">دستمزد مشمول کسر حق بیمه (تومان)</label>
                  <input
                    type="text"
                    value={taminWage ? formatNumber(taminWage) : ''}
                    onChange={(e) => setTaminWage(sanitizeNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-indigo-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">نوع بیمه</label>
                  <select
                    value={taminType}
                    onChange={(e) => setTaminType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-indigo-300"
                  >
                    <option value="compulsory">اجباری کارگری (۳۰٪)</option>
                    <option value="freelance_12">مشاغل آزاد - بازنشستگی (۱۲٪)</option>
                    <option value="freelance_14">مشاغل آزاد - بازنشستگی و فوت (۱۴٪)</option>
                    <option value="freelance_18">مشاغل آزاد - کامل (۱۸٪)</option>
                    <option value="optional_27">بیمه اختیاری (۲۷٪)</option>
                  </select>
                </div>

                {taminCalculation && (
                  <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">سهم کارگر:</span>
                      <span className="font-mono text-indigo-400 font-bold">{formatNumber(taminCalculation.workerShare)} تومان</span>
                    </div>
                    {taminCalculation.employerShare > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">سهم کارفرما (با بیمه بیکاری):</span>
                        <span className="font-mono text-indigo-400 font-bold">{formatNumber(taminCalculation.employerShare)} تومان</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-800">
                      <span className="text-white">مجموع واریزی:</span>
                      <span className="text-indigo-400 font-mono">{formatNumber(taminCalculation.totalPayment)} تومان</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* بازنشستگی */}
            {calcTab === 'pension' && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">میانگین دستمزد ۲ سال آخر اشتغال (تومان)</label>
                  <input
                    type="text"
                    value={penAvgWage ? formatNumber(penAvgWage) : ''}
                    onChange={(e) => setPenAvgWage(sanitizeNumber(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-left text-sm font-mono text-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">سنوات پرداخت حق بیمه (سال)</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={penYears}
                    onChange={(e) => setPenYears(Math.max(1, Math.min(35, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-sm font-mono text-emerald-400"
                  />
                </div>

                {penCalculation && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-white">مستمری بازنشستگی ماهانه:</span>
                      <span className="text-emerald-400 font-mono text-base">{formatNumber(penCalculation.monthlyPension)} تومان</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ۳. بانک جامع قوانین (با اضافه شدن سال، تعداد ویرایش و خلاصه کاربردی) */}
        {rootTab === 'laws' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="جستجو در قوانین، مواد، سال تصویب و کلیدواژه‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* دسته‌بندی موضوعی قوانین */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                { id: 'all', label: 'همه مراجع' },
                { id: 'termination', label: 'خاتمه و اخراج' },
                { id: 'wages', label: 'مزد و ساعت کار' },
                { id: 'maternity', label: 'بارداری و مادران' },
                { id: 'marriage', label: 'ازدواج' },
                { id: 'safety', label: 'حوادث و ایمنی' },
                { id: 'unemployment', label: 'بیمه بیکاری' },
                { id: 'tamin', label: 'تأمین اجتماعی' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setLawCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    lawCategory === c.id
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* کارت‌های قوانین منطبق با درخواست */}
            <div className="space-y-3">
              {filteredLaws.map((item) => {
                const isExpanded = expandedLawId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-amber-400">{item.title}</h4>
                        <p className="text-xs text-slate-200 font-semibold mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    {/* اطلاعات سال تصویب، ویرایش و آخرین بازنگری */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                        <Calendar className="w-3 h-3" />
                        سال تصویب: {item.year}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                        <Layers className="w-3 h-3" />
                        تعداد ویرایش: {item.revisionsCount} بار
                      </span>
                      {item.lastAmendedYear && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          (آخرین بازنگری: {item.lastAmendedYear})
                        </span>
                      )}
                    </div>

                    {/* خلاصه روان و کاربردی ماده */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-amber-400 font-bold block mb-1">خلاصه کاربردی:</span>
                      {item.executiveSummary}
                    </div>

                    {/* متن کامل رسمی */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 leading-relaxed bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-300 font-bold block mb-1">متن مصوب و منقح قانون:</span>
                        {item.description}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setExpandedLawId(isExpanded ? null : item.id)}
                        className="text-[11px] text-amber-400 flex items-center gap-0.5 font-bold hover:underline"
                      >
                        <span>{isExpanded ? 'بستن متن' : 'متن کامل ماده'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ۴. درباره دادکار */}
        {rootTab === 'about' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white">درباره سامانه تخصصی دادکار</h3>
            <p>
              دادکار با هدف ایجاد شفافیت کامل در روابط کارگری و کارفرمایی طراحی شده است. کلیه فرمول‌ها بر مبنای قوانین موضوعه کشور، مصوبات شورای عالی کار و دادنامه‌های هیأت عمومی دیوان عدالت اداری تنظیم شده‌اند.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
              <div>نسخه: DadKar Professional 4.0</div>
              <div>محیط اجرا: بهینه‌سازی‌شده برای Capacitor و وب‌ویو اندروید</div>
            </div>
          </div>
        )}
      </main>

      {/* منوی ثابت پایین صفحه (دست‌نخورده) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 px-6 py-2.5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setRootTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              rootTab === 'home' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>داشبورد</span>
          </button>

          <button
            onClick={() => setRootTab('calculators')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              rootTab === 'calculators' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>محاسبات</span>
          </button>

          <button
            onClick={() => setRootTab('laws')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              rootTab === 'laws' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>بانک قوانین</span>
          </button>

          <button
            onClick={() => setRootTab('about')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              rootTab === 'about' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-5 h-5" />
            <span>درباره</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
