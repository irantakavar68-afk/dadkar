import React, { useState, useMemo } from 'react';
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
  DollarSign
} from 'lucide-react';

// موتور استاندارد تبدیل به PDF و چاپ برای وب‌ویو اندروید
const generatePdfOrPrint = (elementId: string, filename: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow?.document;
  if (!frameDoc) return;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
      <head>
        <title>${filename}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; direction: rtl; color: #0f172a; background: #fff; padding: 10px; }
          .report-card { border: 2px solid #0f172a; border-radius: 12px; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .highlight { background-color: #f1f5f9; font-weight: bold; }
          .disclaimer { margin-top: 24px; padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 11px; color: #475569; }
        </style>
      </head>
      <body>
        <div class="report-card">
          ${el.innerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    printFrame.contentWindow?.focus();
    printFrame.contentWindow?.print();
    setTimeout(() => document.body.removeChild(printFrame), 1000);
  }, 400);
};

// بانک اطلاعاتی جامع قوانین سورس اصلی
const LEGAL_ARTICLES = [
  {
    id: 'l-1',
    category: 'labor',
    title: 'ماده ۲۴ قانون کار',
    subtitle: 'حق سنوات پایان‌کار و پاداش خدمت',
    description: 'در صورت خاتمه قرارداد کار، کارفرما مکلف است به کارگری که مطابق قرارداد، یک سال یا بیشتر به کار اشتغال داشته است برای هر سال سابقه، بر اساس آخرین مزد، مبلغی معادل یک ماه مزد به عنوان مزایای پایان کار (سنوات) پرداخت نماید.',
    tags: ['سنوات', 'خاتمه کار', 'مزد ثابت']
  },
  {
    id: 'l-2',
    category: 'labor',
    title: 'ماده ۳۶ قانون کار',
    subtitle: 'تعریف مزد ثابت و مبنا',
    description: 'مزد ثابت، مجموع مزد شغل و مزایای ثابت پرداختی به تبع شغل است. مزایای رفاهی و انگیزشی مانند کمک هزینه مسکن، خواروبار و بن کارگری جزء مزد ثابت محاسبه نمی‌گردند مگر آنکه در کارگاه عرف قطعی و پرداخت مستمر باشد.',
    tags: ['مزد ثابت', 'مزد شغل', 'پایه سنوات']
  },
  {
    id: 'l-3',
    category: 'unemployment',
    title: 'ماده ۷ قانون بیمه بیکاری',
    subtitle: 'میزان و مدت پرداخت مقرری بیکاری',
    description: 'میزان مقرری روزانه بیمه‌شده بیکار معادل ۵۵٪ متوسط مزد یا حقوق روزانه بیمه‌شده است. به مقرری افراد متأهل یا متکفل، تا حداکثر ۴ نفر، به ازای هر یک ۱۰٪ حداقل دستمزد افزوده می‌شود. دریافتی نباید از حداقل دستمزد کمتر و از ۸۰٪ متوسط مزد بیشتر باشد.',
    tags: ['بیمه بیکاری', 'تکفل', 'مدت مقرری']
  },
  {
    id: 'l-4',
    category: 'tamin',
    title: 'ماده ۲۸ قانون تأمین اجتماعی',
    subtitle: 'نرخ و ماخذ حق بیمه تأمین اجتماعی',
    description: 'حق بیمه سهم کارگر ۷٪، سهم کارفرما ۲۰٪ به علاوه ۳٪ بیمه بیکاری (جمعاً ۲۳٪ کارفرما) و سهم دولت ۳٪ از کل دستمزد مبنای کسر حق بیمه است. در بیمه‌های صاحبان حرف و مشاغل آزاد نرخ‌های ۱۲٪، ۱۴٪ و ۱۸٪ و بیمه اختیاری ۲۷٪ اعمال می‌گردد.',
    tags: ['حق بیمه', 'سهم کارفرما', 'سهم کارگر', 'مشاغل آزاد']
  },
  {
    id: 'l-5',
    category: 'tamin',
    title: 'ماده ۷۷ قانون تأمین اجتماعی',
    subtitle: 'میزان مستمری بازنشستگی',
    description: 'میزان مستمری بازنشستگی عبارت است از یک سی‌ام متوسط مزد یا حقوق بیمه‌شده ضربدر سنوات پرداخت حق بیمه، مشروط بر آنکه از (۳۵/۳۰) سی و پنج سی‌ام متوسط مزد یا حقوق تجاوز ننماید. متوسط مزد بر مبنای مجموع مزد مشمول کسر حق بیمه در ۲ سال آخر تقسیم بر ۲۴ است.',
    tags: ['بازنشستگی', 'مستمری', 'سابقه بیمه']
  },
  {
    id: 'l-6',
    category: 'labor',
    title: 'دادنامه ۱۲۵۳ هیأت عمومی دیوان عدالت اداری',
    subtitle: 'احتساب کلیه مزایای به تبع شغل در سنوات',
    description: 'مزایایی که به مناسبت شغل و شرایط محیط کار پرداخت می‌شوند نظیر فوق‌العاده شغل، سختی کار، سرپرستی و حق جذب، جزء مزد مبنا بوده و در محاسبه مزایای پایان کار (سنوات) باید محاسبه گردند.',
    tags: ['دیوان عدالت اداری', 'فوق‌العاده شغل', 'سنوات']
  }
];

export default function DadKarApp() {
  // ناوبری و تب‌ها
  const [rootTab, setRootTab] = useState<'home' | 'calculators' | 'laws' | 'about'>('home');
  const [calcTab, setCalcTab] = useState<'severance' | 'unemployment' | 'tamin' | 'pension'>('severance');

  // جستجو و فیلتر قوانین
  const [searchQuery, setSearchQuery] = useState('');
  const [lawCategory, setLawCategory] = useState<'all' | 'labor' | 'unemployment' | 'tamin'>('all');

  // ابزارهای کمکی
  const sanitizeNumber = (val: string): number => {
    const cleaned = val.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const formatNumber = (num: number): string => num.toLocaleString('fa-IR');

  // -------------------------------------------------------------
  // ۱. سنوات پایان‌کار (منطق دقیق سورس اصلی)
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // ۲. بیمه بیکاری (منطق دقیق سورس اصلی: حداقل مزد مصوب + مدت زمان)
  // -------------------------------------------------------------
  const [unempAvgWage, setUnempAvgWage] = useState<number>(0);
  const [unempMinWage, setUnempMinWage] = useState<number>(7166184); // حداقل دستمزد پایه مصوب
  const [unempDependents, setUnempDependents] = useState<number>(0);
  const [unempInsuranceMonths, setUnempInsuranceMonths] = useState<number>(24);
  const [unempIsMarried, setUnempIsMarried] = useState<boolean>(true);

  const unempCalculation = useMemo(() => {
    if (unempAvgWage <= 0) return null;

    const baseAmount = Math.round(unempAvgWage * 0.55);
    const boundedDeps = Math.min(Math.max(unempDependents, 0), 4);
    // هر تحت تکفل: ۱۰ درصد حداقل دستمزد
    const dependentsBonus = Math.round(unempMinWage * 0.10 * boundedDeps);
    let calculatedTotal = baseAmount + dependentsBonus;

    // کف قانون: حداقل مزد مصوب
    if (calculatedTotal < unempMinWage) calculatedTotal = unempMinWage;
    // سقف قانون: ۸۰ درصد متوسط دستمزد شخص
    const maxAllowed = Math.round(unempAvgWage * 0.80);
    if (calculatedTotal > maxAllowed) calculatedTotal = maxAllowed;

    // محاسبه مدت پرداخت بر اساس جدول ماده ۷
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

  // -------------------------------------------------------------
  // ۳. حق بیمه تأمین اجتماعی (منطق دقیق سورس اصلی)
  // -------------------------------------------------------------
  const [taminWage, setTaminWage] = useState<number>(0);
  const [taminType, setTaminType] = useState<string>('compulsory');

  const taminCalculation = useMemo(() => {
    if (taminWage <= 0) return null;

    let workerRate = 7;
    let employerRate = 23; // ۲۰ بیمه + ۳ بیکاری
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

  // -------------------------------------------------------------
  // ۴. مستمری بازنشستگی (منطق دقیق ماده ۷۷ سورس اصلی)
  // -------------------------------------------------------------
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

  // فیلتر مقالات قوانین
  const filteredLaws = useMemo(() => {
    return LEGAL_ARTICLES.filter((item) => {
      const matchCategory = lawCategory === 'all' || item.category === lawCategory;
      const matchSearch =
        item.title.includes(searchQuery) ||
        item.subtitle.includes(searchQuery) ||
        item.description.includes(searchQuery) ||
        item.tags.some((t) => t.includes(searchQuery));
      return matchCategory && matchSearch;
    });
  }, [lawCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-cyan-500 selection:text-white" dir="rtl">
      
      {/* سربرگ اپلیکیشن */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-5 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">دادکار</h1>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded font-mono">v2.5</span>
            </div>
            <p className="text-[11px] text-slate-400">سامانه جامع محاسبات قانون کار و تأمین اجتماعی</p>
          </div>
        </div>

        {rootTab !== 'home' && (
          <button
            onClick={() => setRootTab('home')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700"
          >
            <span>صفحه اصلی</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* بدنه برنامه */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ======================================================== */}
        {/* ۱. صفحه اصلی (داشبورد با آیکن‌های متحرک و مواد قانونی) */}
        {/* ======================================================== */}
        {rootTab === 'home' && (
          <div className="space-y-6">
            <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl">
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/50">
                  مرجع تخصصی روابط کار
                </span>
                <h2 className="text-lg font-black text-white">سامانه هوشمند محاسبات دادکار</h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                  محاسبه دقیق سنوات، مقرری بیمه بیکاری، حق بیمه و مستمری بازنشستگی بر اساس آخرین بخشنامه‌ها و آرای وحدت رویه دیوان عدالت اداری.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* سنوات */}
              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('severance'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Clock className="w-7 h-7 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-cyan-400 transition-colors">
                  محاسبه سنوات
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۴ قانون کار
                </span>
              </button>

              {/* مستمری بازنشستگی */}
              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('pension'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <ShieldCheck className="w-7 h-7 text-emerald-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors">
                  مستمری بازنشستگی
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷۷ تأمین اجتماعی
                </span>
              </button>

              {/* مقرری بیکاری */}
              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('unemployment'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <UserMinus className="w-7 h-7 text-amber-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                  مقرری بیمه بیکاری
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷ قانون بیمه بیکاری
                </span>
              </button>

              {/* حق بیمه */}
              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('tamin'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
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

            {/* دسترسی سریع به قوانین */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">بانک مواد و مستندات قانونی</div>
                  <div className="text-[10px] text-slate-400">مشاهده متن کامل قوانین، آرا و بخشنامه‌ها</div>
                </div>
              </div>
              <button
                onClick={() => setRootTab('laws')}
                className="px-3 py-1.5 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium hover:bg-cyan-600/30 transition-colors"
              >
                مشاهده
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۲. بخش محاسبه‌گرها */}
        {/* ======================================================== */}
        {rootTab === 'calculators' && (
          <div className="space-y-5">
            {/* سربرگ انتخاب محاسبه‌گر */}
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
              <button
                onClick={() => setCalcTab('severance')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'severance' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                سنوات
              </button>
              <button
                onClick={() => setCalcTab('unemployment')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'unemployment' ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                بیمه بیکاری
              </button>
              <button
                onClick={() => setCalcTab('tamin')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'tamin' ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                حق بیمه
              </button>
              <button
                onClick={() => setCalcTab('pension')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'pension' ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                مستمری
              </button>
            </div>

            {/* ۲.۱ ماژول سنوات */}
            {calcTab === 'severance' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> محاسبه سنوات پایان‌کار (ماده ۲۴ قانون کار)
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSevMode('simple')}
                      className={`py-2 text-xs rounded-xl border transition-all ${
                        sevMode === 'simple' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      مزد مبنای یکپارچه
                    </button>
                    <button
                      type="button"
                      onClick={() => setSevMode('itemized')}
                      className={`py-2 text-xs rounded-xl border transition-all ${
                        sevMode === 'itemized' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      اقلام تفکیکی (رأی ۱۲۵۳)
                    </button>
                  </div>

                  {sevMode === 'simple' ? (
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">آخرین مزد ثابت ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={sevMonthlyWage ? sevMonthlyWage.toLocaleString() : ''}
                        onChange={(e) => setSevMonthlyWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۵,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">مزد شغل ماهانه (تومان):</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sevJobWage ? sevJobWage.toLocaleString() : ''}
                          onChange={(e) => setSevJobWage(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">مزد رتبه یا پست (تومان):</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sevRankWage ? sevRankWage.toLocaleString() : ''}
                          onChange={(e) => setSevRankWage(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">پایه سنوات تجمیعی ماهانه (تومان):</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sevBaseSanavat ? sevBaseSanavat.toLocaleString() : ''}
                          onChange={(e) => setSevBaseSanavat(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* تفکیک سابقه دقیق کارکرد */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">سال:</label>
                      <input
                        type="number"
                        min="0"
                        value={sevYears}
                        onChange={(e) => setSevYears(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">ماه (۰-۱۱):</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={sevMonths}
                        onChange={(e) => setSevMonths(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">روز (۰-۳۰):</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={sevDays}
                        onChange={(e) => setSevDays(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>سابقه مؤثر محاسباتی:</span>
                      <span className="font-mono text-cyan-400">{formatNumber(sevCalculation.effectiveYears)} سال</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>مزد ماهانه مؤثر:</span>
                      <span className="font-mono">{formatNumber(sevCalculation.effectiveMonthly)} تومان</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                      <span>کل سنوات پایان‌کار:</span>
                      <span className="text-base text-cyan-400 font-black">{formatNumber(sevCalculation.totalAmount)} تومان</span>
                    </div>
                  </div>
                </div>

                {/* فیش رسمی چاپی سنوات */}
                <div id="slip-severance" className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="header">
                    <div>
                      <div className="text-base font-black">فیش رسمی محاسبه سنوات پایان‌کار</div>
                      <div className="text-[11px] text-slate-600">استناد قانونی: ماده ۲۴ قانون کار و دادنامه ۱۲۵۳ دیوان عدالت</div>
                    </div>
                    <div className="text-left text-[10px] text-slate-500 font-mono">
                      <div>سامانه دادکار</div>
                      <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="row">
                      <span>مزد ماهانه مبنای سنوات:</span>
                      <span className="font-mono">{formatNumber(sevCalculation.effectiveMonthly)} تومان</span>
                    </div>
                    <div className="row">
                      <span>مدت کارکرد دقیق:</span>
                      <span>{sevYears} سال و {sevMonths} ماه و {sevDays} روز</span>
                    </div>
                    <div className="row">
                      <span>ضریب سابقه مؤثر:</span>
                      <span className="font-mono">{sevCalculation.effectiveYears}</span>
                    </div>
                    <div className="row highlight">
                      <span>مبلغ کل سنوات متعلقه:</span>
                      <span className="font-mono text-sm">{formatNumber(sevCalculation.totalAmount)} تومان</span>
                    </div>
                  </div>

                  <div className="disclaimer">
                    <strong>سلب مسئولیت قانونی:</strong> این گزارش صرفاً جنبه محاسبه فنی و محاسباتی داشته و صدور آن به منزله تسویه‌حساب نهایی بدون امضای طرفین محسوب نمی‌گردد.
                  </div>
                </div>

                <button
                  onClick={() => generatePdfOrPrint('slip-severance', 'فیش_سنوات_دادکار')}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 shadow-lg shadow-black/40"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ فیش یا ذخیره PDF سنوات</span>
                </button>
              </div>
            )}

            {/* ۲.۲ ماژول بیمه بیکاری */}
            {calcTab === 'unemployment' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <UserMinus className="w-4 h-4" /> محاسبه مقرری بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">متوسط مزد یا حقوق ۹۰ روز پایانی (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={unempAvgWage ? unempAvgWage.toLocaleString() : ''}
                        onChange={(e) => setUnempAvgWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۲,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">حداقل دستمزد مصوب سال جاری (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={unempMinWage ? unempMinWage.toLocaleString() : ''}
                        onChange={(e) => setUnempMinWage(sanitizeNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">تعداد افراد تکفل (حداکثر ۴):</label>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          value={unempDependents}
                          onChange={(e) => setUnempDependents(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">کل سابقه بیمه (ماه):</label>
                        <input
                          type="number"
                          min="6"
                          value={unempInsuranceMonths}
                          onChange={(e) => setUnempInsuranceMonths(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="marriedCheck"
                        checked={unempIsMarried}
                        onChange={(e) => setUnempIsMarried(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                      />
                      <label htmlFor="marriedCheck" className="text-xs text-slate-300">
                        متقاضی متأهل یا متکفل است (برای محاسبه جدول مدت زمان)
                      </label>
                    </div>
                  </div>

                  {unempCalculation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>مقرری پایه (۵۵٪ متوسط دستمزد):</span>
                        <span className="font-mono">{formatNumber(unempCalculation.baseAmount)} تومان</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>فوق‌العاده افراد تکفل (۱۰٪ حداقل مزد):</span>
                        <span className="font-mono">{formatNumber(unempCalculation.dependentsBonus)} تومان</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>مدت استحقاق قانونی:</span>
                        <span className="font-mono text-amber-400 font-bold">{unempCalculation.durationMonths} ماه</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                        <span>مقرری خالص ماهانه:</span>
                        <span className="text-base text-amber-400 font-black">{formatNumber(unempCalculation.totalMonthly)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* فیش رسمی بیمه بیکاری */}
                {unempCalculation && (
                  <>
                    <div id="slip-unemp" className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 space-y-4">
                      <div className="header">
                        <div>
                          <div className="text-base font-black">برآورد رسمی مقرری ماهانه بیمه بیکاری</div>
                          <div className="text-[11px] text-slate-600">استناد قانونی: ماده ۷ قانون بیمه بیکاری</div>
                        </div>
                        <div className="text-left text-[10px] text-slate-500 font-mono">
                          <div>سامانه دادکار</div>
                          <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="row">
                          <span>متوسط دستمزد ۹۰ روز پایانی:</span>
                          <span className="font-mono">{formatNumber(unempAvgWage)} تومان</span>
                        </div>
                        <div className="row">
                          <span>افراد تکفل / افزایش مربوطه:</span>
                          <span>{unempDependents} نفر ({formatNumber(unempCalculation.dependentsBonus)} تومان)</span>
                        </div>
                        <div className="row">
                          <span>مدت مجاز برقراری مقرری:</span>
                          <span className="font-mono font-bold">{unempCalculation.durationMonths} ماه</span>
                        </div>
                        <div className="row highlight">
                          <span>مقرری ماهانه مصوب:</span>
                          <span className="font-mono text-sm">{formatNumber(unempCalculation.totalMonthly)} تومان</span>
                        </div>
                        <div className="row">
                          <span>کل پرداختی در طول دوره:</span>
                          <span className="font-mono">{formatNumber(unempCalculation.totalPeriodAmount)} تومان</span>
                        </div>
                      </div>

                      <div className="disclaimer">
                        <strong>توجه:</strong> برقراری مقرری قطعی منوط به معرفی اداره تعاون، کار و رفاه اجتماعی و تأیید شعبه تأمین اجتماعی مربوطه می‌باشد.
                      </div>
                    </div>

                    <button
                      onClick={() => generatePdfOrPrint('slip-unemp', 'فیش_بیمه_بیکاری_دادکار')}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/30 shadow-lg shadow-black/40"
                    >
                      <Printer className="w-4 h-4" />
                      <span>چاپ فیش یا ذخیره PDF مقرری بیکاری</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ۲.۳ ماژول حق بیمه */}
            {calcTab === 'tamin' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> محاسبه سهم و نرخ‌های حق بیمه (ماده ۲۸ تأمین اجتماعی)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">نوع بیمه و نرخ مصوب:</label>
                      <select
                        value={taminType}
                        onChange={(e) => setTaminType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="compulsory">بیمه اجباری قانون کار (۳۰٪ = ۷٪ کارگر + ۲۳٪ کارفرما)</option>
                        <option value="freelance_12">مشاغل آزاد و زنان خانه‌دار ۱۲٪ (بازنشستگی و فوت پس از بازنشستگی)</option>
                        <option value="freelance_14">مشاغل آزاد و زنان خانه‌دار ۱۴٪ (بازنشستگی و فوت قبل و بعد بازنشستگی)</option>
                        <option value="freelance_18">مشاغل آزاد و زنان خانه‌دار ۱۸٪ (کامل: بازنشستگی، فوت، ازکارافتادگی)</option>
                        <option value="optional_27">بیمه اختیاری ۲۷٪ (خدمات کامل درمان و کلیه تعهدات)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">دستمزد مبنای کسر حق بیمه ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={taminWage ? taminWage.toLocaleString() : ''}
                        onChange={(e) => setTaminWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۰,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {taminCalculation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>سهم بیمه‌شده ({taminCalculation.workerRate}٪):</span>
                        <span className="font-mono text-indigo-400 font-bold">{formatNumber(taminCalculation.workerShare)} تومان</span>
                      </div>
                      {taminCalculation.employerRate > 0 && (
                        <div className="flex justify-between items-center text-xs text-slate-300">
                          <span>سهم کارفرما ({taminCalculation.employerRate}٪):</span>
                          <span className="font-mono">{formatNumber(taminCalculation.employerShare)} تومان</span>
                        </div>
                      )}
                      {taminCalculation.govRate > 0 && (
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>کمک دولت ({taminCalculation.govRate}٪):</span>
                          <span className="font-mono">{formatNumber(taminCalculation.govShare)} تومان</span>
                        </div>
                      )}
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                        <span>مجموع قابل پرداخت:</span>
                        <span className="text-base text-cyan-400 font-black">{formatNumber(taminCalculation.totalPayment)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {taminCalculation && (
                  <>
                    <div id="slip-tamin" className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 space-y-4">
                      <div className="header">
                        <div>
                          <div className="text-base font-black">گزارش تفکیکی محاسبه حق بیمه تأمین اجتماعی</div>
                          <div className="text-[11px] text-slate-600">استناد قانونی: ماده ۲۸ قانون تأمین اجتماعی</div>
                        </div>
                        <div className="text-left text-[10px] text-slate-500 font-mono">
                          <div>سامانه دادکار</div>
                          <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="row">
                          <span>دستمزد مبنای محاسبه:</span>
                          <span className="font-mono">{formatNumber(taminWage)} تومان</span>
                        </div>
                        <div className="row">
                          <span>سهم کسر شده از بیمه‌شده ({taminCalculation.workerRate}٪):</span>
                          <span className="font-mono">{formatNumber(taminCalculation.workerShare)} تومان</span>
                        </div>
                        <div className="row">
                          <span>سهم پرداختی کارفرما ({taminCalculation.employerRate}٪):</span>
                          <span className="font-mono">{formatNumber(taminCalculation.employerShare)} تومان</span>
                        </div>
                        <div className="row highlight">
                          <span>مجموع واریزی به سازمان تأمین اجتماعی:</span>
                          <span className="font-mono text-sm">{formatNumber(taminCalculation.totalPayment)} تومان</span>
                        </div>
                      </div>

                      <div className="disclaimer">
                        <strong>توضیح:</strong> مهلت پرداخت حق بیمه هر ماه، حداکثر تا آخرین روز ماه بعد می‌باشد.
                      </div>
                    </div>

                    <button
                      onClick={() => generatePdfOrPrint('slip-tamin', 'فیش_حق_بیمه_دادکار')}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-xs flex items-center justify-center gap-2 border border-indigo-500/30 shadow-lg shadow-black/40"
                    >
                      <Printer className="w-4 h-4" />
                      <span>چاپ فیش یا ذخیره PDF حق بیمه</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ۲.۴ ماژول مستمری بازنشستگی */}
            {calcTab === 'pension' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> برآورد مستمری بازنشستگی (ماده ۷۷ تأمین اجتماعی)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">میانگین دستمزد ماهانه ۲ سال آخر بیمه‌پردازی (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={penAvgWage ? penAvgWage.toLocaleString() : ''}
                        onChange={(e) => setPenAvgWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۸,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">سابقه پرداخت حق بیمه (سال):</label>
                      <input
                        type="number"
                        min="1"
                        max="35"
                        value={penYears}
                        onChange={(e) => setPenYears(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">حداکثر سابقه قابل اعمال در ضریب ماده ۷۷، ۳۵ سال است.</p>
                    </div>
                  </div>

                  {penCalculation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>ضریب سابقه استحقاقی:</span>
                        <span className="font-mono text-emerald-400">{penCalculation.effectiveYears} / ۳۰</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                        <span>مستمری برآوردی ماهانه:</span>
                        <span className="text-base text-emerald-400 font-black">{formatNumber(penCalculation.monthlyPension)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {penCalculation && (
                  <>
                    <div id="slip-pension" className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 space-y-4">
                      <div className="header">
                        <div>
                          <div className="text-base font-black">برآورد رسمی مستمری ماهانه بازنشستگی</div>
                          <div className="text-[11px] text-slate-600">استناد قانونی: ماده ۷۷ قانون تأمین اجتماعی</div>
                        </div>
                        <div className="text-left text-[10px] text-slate-500 font-mono">
                          <div>سامانه دادکار</div>
                          <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="row">
                          <span>متوسط دستمزد ۲ سال پایانی:</span>
                          <span className="font-mono">{formatNumber(penAvgWage)} تومان</span>
                        </div>
                        <div className="row">
                          <span>سنوات پرداخت حق بیمه:</span>
                          <span className="font-mono">{penCalculation.effectiveYears} سال</span>
                        </div>
                        <div className="row highlight">
                          <span>مستمری ماهانه تقریبی:</span>
                          <span className="font-mono text-sm">{formatNumber(penCalculation.monthlyPension)} تومان</span>
                        </div>
                      </div>

                      <div className="disclaimer">
                        <strong>سلب مسئولیت:</strong> مبلغ دقیق پس از برقراری پرونده بازنشستگی، اعمال مزایای جانبی عائله‌مندی، بن معیشت و کسر ماده ۸۹ توسط شعبه صادر می‌شود.
                      </div>
                    </div>

                    <button
                      onClick={() => generatePdfOrPrint('slip-pension', 'فیش_مستمری_دادکار')}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/30 shadow-lg shadow-black/40"
                    >
                      <Printer className="w-4 h-4" />
                      <span>چاپ فیش یا ذخیره PDF مستمری</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ۳. بخش قوانین و مقررات مهم (سورس اصلی) */}
        {/* ======================================================== */}
        {rootTab === 'laws' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="جستجو در مواد قانونی، کلیدواژه‌ها یا عناوین..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-9 pl-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setLawCategory('all')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'all' ? 'bg-cyan-600 border-cyan-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  همه قوانین
                </button>
                <button
                  onClick={() => setLawCategory('labor')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'labor' ? 'bg-cyan-600 border-cyan-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  قانون کار
                </button>
                <button
                  onClick={() => setLawCategory('tamin')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'tamin' ? 'bg-cyan-600 border-cyan-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  تأمین اجتماعی
                </button>
                <button
                  onClick={() => setLawCategory('unemployment')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'unemployment' ? 'bg-cyan-600 border-cyan-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  بیمه بیکاری
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLaws.map((law) => (
                <div key={law.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">{law.title}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                      {law.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{law.subtitle}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-justify">{law.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {law.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۴. صفحه درباره دادکار */}
        {/* ======================================================== */}
        {rootTab === 'about' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">سامانه تخصصی دادکار</h3>
                  <p className="text-[11px] text-slate-400">مرجع محاسباتی کارشناسان منابع انسانی و روابط کار</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                این نرم‌افزار به منظور تسهیل محاسبات پیچیده روابط کار، اجرای صحیح احکام دیوان عدالت اداری در خصوص مزد مبنا و رعایت نص صریح قوانین موضوعه طراحی شده است. کلیه مبالغ بر پایه واحد پول رایج (تومان) پردازش می‌شوند.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* فوتر و منوی ناوبری ثابت پایینی (Bottom Navigation) */}
      {/* ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-2 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          
          <button
            onClick={() => setRootTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'home' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">داشبورد</span>
          </button>

          <button
            onClick={() => setRootTab('calculators')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'calculators' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-5 h-5 mb-1" />
            <span className="text-[10px]">محاسبه‌گرها</span>
          </button>

          <button
            onClick={() => setRootTab('laws')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'laws' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px]">قوانین</span>
          </button>

          <button
            onClick={() => setRootTab('about')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'about' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-5 h-5 mb-1" />
            <span className="text-[10px]">درباره ما</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
