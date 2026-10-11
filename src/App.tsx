import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Copy, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Coins, 
  Layers, 
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Award,
  Sliders,
  DollarSign,
  Download,
  Info,
  ChevronDown
} from 'lucide-react';

// ===================================================================
// توابع فرمت و پاک‌سازی ارقام (تماماً بر پایه تومان)
// ===================================================================
const toFaDigits = (n: number | string): string => {
  if (n === null || n === undefined || n === '') return '';
  const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => fa[parseInt(x, 10)]);
};

const formatToman = (val: number): string => {
  return new Intl.NumberFormat('fa-IR').format(Math.round(val));
};

const sanitizeNumber = (raw: string): number => {
  if (!raw) return 0;
  const standard = raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[^0-9]/g, '');
  const parsed = parseInt(standard, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// ثابت‌های قانونی سال ۱۴۰۳
const MIN_MONTHLY_WAGE_1403 = 7166184; // حداقل دستمزد پایه مصوب (تومان)
const HEALTH_TARIFF_1403 = 119500;     // سرانه درمان هر نفر در ماه (تومان)

export default function DadKarApp() {
  // ۱. کنترل اسپلش‌اسکرین سینمایی
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);

  // ۲. ناوبری و وضعیت
  const [activeTab, setActiveTab] = useState<'dashboard' | 'severance' | 'insurance' | 'unemployment'>('dashboard');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [copiedBadge, setCopiedBadge] = useState<boolean>(false);
  const printIframeRef = useRef<HTMLIFrameElement>(null);

  // ۳. متغیرهای سنوات: انتخاب دو مدل (مزد مبنای یکجا VS تفکیک آیتم‌های فیش حقوقی)
  const [severanceModel, setSeveranceModel] = useState<'lump_sum' | 'itemized'>('itemized');
  const [lumpSumSalary, setLumpSumSalary] = useState<string>('12000000');
  
  // آیتم‌های تفکیکی فیش حقوقی (مشمول ماده ۲۴ و دادنامه دیوان عدالت اداری)
  const [baseJobWage, setBaseJobWage] = useState<string>('8500000');      // مزد شغل / رتبه
  const [baseSeniorityPay, setBaseSeniorityPay] = useState<string>('900000'); // پایه سنوات تجمیعی
  const [responsibilityPay, setResponsibilityPay] = useState<string>('1500000'); // حق جذب یا سرپرستی
  const [hardshipPay, setHardshipPay] = useState<string>('800000');      // فوق‌العاده شرایط محیط کار / سختی کار
  
  // سابقه کار و مرخصی
  const [sevYears, setSevYears] = useState<number>(2);
  const [sevMonths, setSevMonths] = useState<number>(4);
  const [sevDays, setSevDays] = useState<number>(10);
  const [leaveDays, setLeaveDays] = useState<number>(7);

  // ۴. متغیرهای حق بیمه (آبشاری کامل)
  const [insuranceSalaryInput, setInsuranceSalaryInput] = useState<string>('11000000');
  const [insuranceType, setInsuranceType] = useState<
    'labor_standard' | 'housewife_12' | 'housewife_14' | 'housewife_18' | 'optional_27'
  >('housewife_14');
  const [withHealthCard, setWithHealthCard] = useState<boolean>(true);

  // ۵. متغیرهای بیمه بیکاری
  const [unempSalaryInput, setUnempSalaryInput] = useState<string>('12500000');
  const [insMonths, setInsMonths] = useState<number>(36);
  const [isMarried, setIsMarried] = useState<boolean>(true);
  const [dependents, setDependents] = useState<number>(2);

  // انیمیشن اسپلش
  useEffect(() => {
    const timer = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowSplash(false), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // هندلر تایپ هوشمند و رفع باگ ۳ رقم
  const handleMoneyInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanNum = sanitizeNumber(val);
    setter(cleanNum === 0 ? '' : cleanNum.toString());
  };

  // -------------------------------------------------------------------
  // محاسبات سنوات (هردو مدل: یکپارچه و تفکیکی دیوان عدالت اداری)
  // -------------------------------------------------------------------
  const severanceCalc = useMemo(() => {
    let effectiveMonthlySalary = 0;

    if (severanceModel === 'lump_sum') {
      effectiveMonthlySalary = sanitizeNumber(lumpSumSalary);
    } else {
      // جمع اقلام مستمر به‌تبع شغل طبق رای دیوان عدالت اداری
      effectiveMonthlySalary = 
        sanitizeNumber(baseJobWage) + 
        sanitizeNumber(baseSeniorityPay) + 
        sanitizeNumber(responsibilityPay) + 
        sanitizeNumber(hardshipPay);
    }

    const dailyWage = effectiveMonthlySalary / 30;
    const totalDaysWorked = (sevYears * 365) + (sevMonths * 30) + sevDays;
    
    // حق سنوات پایان کار بر پایه سال ۳۶۵ روزه
    const severancePay = (totalDaysWorked / 365) * effectiveMonthlySalary;
    
    // بازخرید ایام مرخصی استحقاقی
    const leavePay = leaveDays * dailyWage;

    // پاداش عیدی مصوب (۶۰ روز پایه حقوق سالانه)
    const annualBonus = (totalDaysWorked / 365) * (effectiveMonthlySalary * 2);

    return {
      effectiveMonthlySalary,
      dailyWage,
      totalDaysWorked,
      severancePay,
      leavePay,
      annualBonus,
      grandTotal: severancePay + leavePay
    };
  }, [severanceModel, lumpSumSalary, baseJobWage, baseSeniorityPay, responsibilityPay, hardshipPay, sevYears, sevMonths, sevDays, leaveDays]);

  // -------------------------------------------------------------------
  // محاسبات انواع حق بیمه تأمین اجتماعی
  // -------------------------------------------------------------------
  const insuranceCalc = useMemo(() => {
    const wage = sanitizeNumber(insuranceSalaryInput);
    let workerShare = 0;
    let employerShare = 0;
    let govtShare = 0;
    let healthShare = 0;
    let totalMonthlyPay = 0;
    let title = '';
    let description = '';

    switch (insuranceType) {
      case 'labor_standard':
        title = 'بیمه اجباری کارگری (مجموعاً ۳۰٪ قانون کار)';
        workerShare = wage * 0.07;
        employerShare = wage * 0.23;
        totalMonthlyPay = workerShare;
        description = 'شامل پوشش بازنشستگی، ازکارافتادگی، فوت، درمان مستقیم تأمین اجتماعی و بیمه بیکاری.';
        break;

      case 'housewife_12':
        title = 'بیمه زنان خانه‌دار (نرخ ۱۲٪)';
        workerShare = wage * 0.12;
        govtShare = wage * 0.02;
        healthShare = withHealthCard ? HEALTH_TARIFF_1403 : 0;
        totalMonthlyPay = workerShare + healthShare;
        description = 'شامل مستمری بازنشستگی و فوت پس از بازنشستگی (ویژه افراد فاقد تکفل).';
        break;

      case 'housewife_14':
        title = 'بیمه زنان خانه‌دار (نرخ ۱۴٪)';
        workerShare = wage * 0.14;
        govtShare = wage * 0.02;
        healthShare = withHealthCard ? HEALTH_TARIFF_1403 : 0;
        totalMonthlyPay = workerShare + healthShare;
        description = 'شامل بازنشستگی و مستمری فوت قبل و بعد از بازنشستگی به بازماندگان قانونی.';
        break;

      case 'housewife_18':
        title = 'بیمه زنان خانه‌دار (نرخ ۱۸٪ - کامل)';
        workerShare = wage * 0.18;
        govtShare = wage * 0.02;
        healthShare = withHealthCard ? HEALTH_TARIFF_1403 : 0;
        totalMonthlyPay = workerShare + healthShare;
        description = 'کامل‌ترین پوشش: بازنشستگی، فوت قبل و بعد، و ازکارافتادگی کلی.';
        break;

      case 'optional_27':
        title = 'بیمه اختیاری تأمین اجتماعی (۲۷٪)';
        workerShare = wage * 0.27;
        govtShare = wage * 0.02;
        healthShare = 0; // سرانه درمان در دل نرخ ۲۷٪ است
        totalMonthlyPay = workerShare;
        description = 'شامل تمام تعهدات بلندمدت و دفترچه درمانی بدون سرانه مجزا.';
        break;
    }

    return {
      wage,
      title,
      workerShare,
      employerShare,
      govtShare,
      healthShare,
      totalMonthlyPay,
      description
    };
  }, [insuranceSalaryInput, insuranceType, withHealthCard]);

  // -------------------------------------------------------------------
  // محاسبات بیمه بیکاری
  // -------------------------------------------------------------------
  const unempCalc = useMemo(() => {
    const avgSalary = sanitizeNumber(unempSalaryInput);
    let rate = 0.55;
    const depBonus = Math.min(dependents, 4) * 0.10;
    rate += depBonus;
    if (rate > 0.80) rate = 0.80;

    let monthlyBenefit = avgSalary * rate;
    if (monthlyBenefit < MIN_MONTHLY_WAGE_1403) {
      monthlyBenefit = MIN_MONTHLY_WAGE_1403;
    }

    let monthsDuration = 0;
    if (insMonths >= 6 && insMonths <= 24) monthsDuration = isMarried ? 12 : 6;
    else if (insMonths >= 25 && insMonths <= 120) monthsDuration = isMarried ? 18 : 12;
    else if (insMonths >= 121 && insMonths <= 180) monthsDuration = isMarried ? 26 : 14;
    else if (insMonths >= 181 && insMonths <= 240) monthsDuration = isMarried ? 36 : 18;
    else if (insMonths > 240) monthsDuration = isMarried ? 50 : 36;

    return {
      avgSalary,
      ratePercentage: Math.round(rate * 100),
      monthlyBenefit,
      monthsDuration,
      totalPayout: monthlyBenefit * monthsDuration
    };
  }, [unempSalaryInput, insMonths, isMarried, dependents]);

  // -------------------------------------------------------------------
  // سیستم چاپ ایزوله با Iframe (ضد بلاک در اندروید و وب‌ویو)
  // -------------------------------------------------------------------
  const executePrint = () => {
    const printContent = document.getElementById('official-slip-document');
    if (!printContent) return;

    const iframe = printIframeRef.current;
    if (!iframe) {
      window.print();
      return;
    }

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8">
        <title>گزارش رسمی دادکار</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
        <style>
          * { box-sizing: border-box; font-family: 'Vazirmatn', Tahoma, sans-serif !important; }
          body { margin: 0; padding: 25px; background: #fff; color: #0f172a; font-size: 13px; line-height: 1.7; }
          .document-wrap { border: 2px solid #0f172a; border-radius: 12px; padding: 24px; position: relative; }
          .watermark { position: absolute; top: 40%; left: 25%; font-size: 70px; color: rgba(15,23,42,0.04); transform: rotate(-25deg); font-weight: 900; pointer-events: none; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 18px; font-weight: 900; margin: 0; color: #0f172a; }
          .meta-info { font-size: 11px; text-align: left; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .data-table th, .data-table td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; }
          .data-table th { background: #f1f5f9; text-align: right; font-weight: 700; }
          .total-box { margin-top: 16px; background: #f8fafc; border: 1.5px solid #0f172a; padding: 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 800; }
          .legal-notice { margin-top: 20px; border: 1px dashed #d97706; background: #fffbeb; padding: 12px; border-radius: 8px; font-size: 11px; color: #92400e; }
          .signatures { display: flex; justify-content: space-between; margin-top: 35px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; }
          @media print {
            body { padding: 0; }
            .document-wrap { border: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="document-wrap">
          <div class="watermark">DADKAR OFFICIAL</div>
          ${printContent.innerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 400);
  };

  const handleCopySlip = () => {
    let txt = `سند گزارش محاسباتی دادکار\nواحد: تومان\nتاریخ: ${new Date().toLocaleDateString('fa-IR')}\n`;
    if (activeTab === 'severance') {
      txt += `مدل محاسبه: ${severanceModel === 'itemized' ? 'تفکیکی آیتم‌های مزد' : 'مزد مبنای یکجا'}\n`;
      txt += `مبنای ماهانه: ${formatToman(severanceCalc.effectiveMonthlySalary)} تومان\n`;
      txt += `حق سنوات خدمت: ${formatToman(severanceCalc.severancePay)} تومان\n`;
      txt += `مانده مرخصی: ${formatToman(severanceCalc.leavePay)} تومان\n`;
      txt += `جمع کل مطالبات: ${formatToman(severanceCalc.grandTotal)} تومان\n`;
    } else if (activeTab === 'insurance') {
      txt += `عنوان بیمه: ${insuranceCalc.title}\n`;
      txt += `مبلغ پرداختی ماهانه: ${formatToman(insuranceCalc.totalMonthlyPay)} تومان\n`;
    } else if (activeTab === 'unemployment') {
      txt += `مقرری ماهانه بیکاری: ${formatToman(unempCalc.monthlyBenefit)} تومان\n`;
      txt += `طول دوره: ${unempCalc.monthsDuration} ماه\n`;
    }
    txt += `\nتذکر: این گزارش صرفاً جهت آگاهی است.`;
    navigator.clipboard.writeText(txt);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  // ===================================================================
  // رندر اسپلش اسکرین خاص و مدرن
  // ===================================================================
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070b14] flex flex-col items-center justify-center p-6 text-white select-none overflow-hidden font-['Vazirmatn']">
        <div className="absolute w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[90px] delay-1000 animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 p-[2px] shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-spin-slow">
              <div className="w-full h-full bg-[#070b14] rounded-3xl flex items-center justify-center">
                <Calculator className="w-12 h-12 text-cyan-400 animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            دادکـــــار
          </h1>
          <div className="h-0.5 w-12 bg-gradient-to-r from-cyan-500 to-indigo-500 mb-3 rounded-full"></div>
          <p className="text-xs text-slate-400 font-medium mb-8 text-center tracking-wide">
            سامانه فوق‌تخصصی محاسبات قانون کار و بیمه تأمین اجتماعی
          </p>

          <div className="w-60 bg-slate-900/80 rounded-full h-2 p-[2px] border border-slate-800 backdrop-blur-md overflow-hidden mb-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-100"
              style={{ width: `${splashProgress}%` }}
            ></div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 tracking-wider">
            {toFaDigits(splashProgress)}٪
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Vazirmatn',Tahoma,sans-serif] selection:bg-cyan-500 selection:text-black pb-28">
      {/* Iframe مخفی برای فرمان پرینت مستقیم بدون باگ */}
      <iframe ref={printIframeRef} className="hidden" title="print-frame" />

      {/* هدر بالایی با افکت بلور تیره */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1d]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">دادکار</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-full font-mono font-bold">
                  تومان
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">مرجع محاسبات رسمی کار و تأمین اجتماعی</span>
            </div>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-cyan-950/50 transition active:scale-95 border border-cyan-400/30"
          >
            <Printer className="w-4 h-4" />
            <span>صدور فیش رسمی</span>
          </button>
        </div>
      </header>

      {/* بخش بدنه محتوا */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col gap-6">

        {/* ======================================================== */}
        {/* ۱. داشبورد (باکس‌های خفن و جذاب جهت بالا بردن زمان حضور کاربر) */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#0e1629] via-[#0b1220] to-[#111c33] border border-cyan-900/30 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs px-3 py-1 rounded-full mb-3 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                  بروزرسانی شده با آخرین بخشنامه‌های سال ۱۴۰۳
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                  محاسبات دقیق تسویه‌حساب، سنوات و حق بیمه
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  سیستم هوشمند دادکار بر اساس موازین رسمی اداره کار و آرای وحدت رویه دیوان عدالت اداری، تمامی حقوق قانونی شما را با بالاترین دقت تفکیک و ارزیابی می‌کند.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('severance')}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/30"
                  >
                    <span>محاسبه دو مدل سنوات</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('insurance')}
                    className="bg-slate-800/80 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
                  >
                    بیمه زنان خانه‌دار و اختیاری
                  </button>
                </div>
              </div>
            </div>

            {/* کارت‌های سه‌گانه داشبورد */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab('severance')}
                className="group cursor-pointer bg-[#0c1222]/90 hover:bg-[#10182f] border border-slate-800/80 hover:border-cyan-500/60 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl relative flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition"></div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition shadow-lg shadow-cyan-950/80">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-cyan-300 transition">سنوات پایان خدمت (۲ مدل)</h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    امکان محاسبه بر اساس مزد ثابت یکجا و یا تفکیک آیتم‌های فیش حقوقی (مزد شغل، سرپرستی، سنوات تجمیعی).
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>شروع محاسبه</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-4px] transition" />
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('insurance')}
                className="group cursor-pointer bg-[#0c1222]/90 hover:bg-[#10182f] border border-slate-800/80 hover:border-indigo-500/60 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl relative flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition"></div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition shadow-lg shadow-indigo-950/80">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition">حق بیمه‌ها و زنان خانه‌دار</h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    منوی آبشاری انواع بیمه تأمین اجتماعی شامل نرخ‌های ۱۲٪، ۱۴٪، ۱۸٪ زنان خانه‌دار، اختیاری و کارگری.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400">
                  <span>انتخاب طرح بیمه</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-4px] transition" />
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('unemployment')}
                className="group cursor-pointer bg-[#0c1222]/90 hover:bg-[#10182f] border border-slate-800/80 hover:border-emerald-500/60 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl relative flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition"></div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition shadow-lg shadow-emerald-950/80">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition">مقرری بیمه بیکاری</h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    محاسبه زمان و مبالغ ماهانه طبق ماده ۷ قانون بیمه بیکاری با اعمال حق عائله‌مندی و سوابق بیمه‌پردازی.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>برآورد مقرری</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-4px] transition" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۲. بخش سنوات (با پشتیبانی کامل از هر دو مدل مزد مبنا و تفکیکی) */}
        {/* ======================================================== */}
        {activeTab === 'severance' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                
                {/* سوییچ انتخاب دو مدل محاسبه */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    روش تعیین حقوق مبنای محاسبه سنوات:
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setSeveranceModel('itemized')}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition ${
                        severanceModel === 'itemized' 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      تفکیک آیتم‌های فیش حقوقی
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeveranceModel('lump_sum')}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition ${
                        severanceModel === 'lump_sum' 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      مزد ثابت یکجا (ماده ۲۴)
                    </button>
                  </div>
                </div>

                {/* ورودی مدل ۱: مزد یکجا */}
                {severanceModel === 'lump_sum' ? (
                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5 font-bold">
                      آخرین حقوق ثابت / مزد مبنای ماهانه (تومان):
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={lumpSumSalary ? Number(lumpSumSalary).toLocaleString('fa-IR') : ''}
                        onChange={handleMoneyInput(setLumpSumSalary)}
                        placeholder="مثال: ۱۲,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl px-4 py-3 text-base text-left font-mono font-black text-cyan-400 outline-none pl-16 transition"
                      />
                      <span className="absolute left-3 top-3.5 text-xs text-slate-500 font-bold">تومان</span>
                    </div>
                  </div>
                ) : (
                  /* ورودی مدل ۲: تفکیک اقلام مشمول سنوات (آرای دیوان عدالت اداری) */
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-2">
                      <Sliders className="w-4 h-4" />
                      <span>اقلام مشمول محاسبه سنوات (مزد مبنای تفکیکی)</span>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">مزد رتبه / شغل پایه ماهانه (تومان):</label>
                      <input 
                        type="text"
                        value={baseJobWage ? Number(baseJobWage).toLocaleString('fa-IR') : ''}
                        onChange={handleMoneyInput(setBaseJobWage)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-left font-mono font-bold text-slate-200 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">پایه سنوات تجمیعی (تومان):</label>
                        <input 
                          type="text"
                          value={baseSeniorityPay ? Number(baseSeniorityPay).toLocaleString('fa-IR') : ''}
                          onChange={handleMoneyInput(setBaseSeniorityPay)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-left font-mono font-bold text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">حق جذب / مسئولیت (تومان):</label>
                        <input 
                          type="text"
                          value={responsibilityPay ? Number(responsibilityPay).toLocaleString('fa-IR') : ''}
                          onChange={handleMoneyInput(setResponsibilityPay)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-left font-mono font-bold text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">فوق‌العاده سختی کار / شرایط محیط کار (تومان):</label>
                      <input 
                        type="text"
                        value={hardshipPay ? Number(hardshipPay).toLocaleString('fa-IR') : ''}
                        onChange={handleMoneyInput(setHardshipPay)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-left font-mono font-bold text-slate-200 outline-none"
                      />
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                      <span>مزد مبنای کل تجمیع‌شده:</span>
                      <span className="font-mono font-bold text-cyan-400">
                        {formatToman(severanceCalc.effectiveMonthlySalary)} تومان
                      </span>
                    </div>
                  </div>
                )}

                {/* سوابق کارکرد */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 pb-2 text-xs font-bold text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>مدت دقیق سابقه خدمت مشمول</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">سال</label>
                      <input 
                        type="number"
                        min="0"
                        value={sevYears || ''}
                        onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm text-center font-bold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">ماه</label>
                      <input 
                        type="number"
                        min="0"
                        max="11"
                        value={sevMonths || ''}
                        onChange={(e) => setSevMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm text-center font-bold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">روز</label>
                      <input 
                        type="number"
                        min="0"
                        max="29"
                        value={sevDays || ''}
                        onChange={(e) => setSevDays(Math.max(0, Math.min(29, parseInt(e.target.value) || 0)))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm text-center font-bold text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* مانده مرخصی */}
                <div>
                  <label className="text-xs text-slate-300 block mb-1.5 font-bold">تعداد روزهای مانده مرخصی استحقاقی:</label>
                  <input 
                    type="number"
                    min="0"
                    value={leaveDays || ''}
                    onChange={(e) => setLeaveDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    طبق ماده ۶۶ قانون کار، سقف انتقال سالانه ۹ روز است اما مطالبات ایام اشتغال تسویه می‌شود.
                  </span>
                </div>
              </div>
            </div>

            {/* کارت نتایج محاسبات سنوات */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-b from-[#0c1222] via-[#0c1222] to-cyan-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl sticky top-20">
                <div className="border-b border-slate-800/80 pb-4 mb-4">
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">جمع کل تسویه‌حساب و سنوات</span>
                  <div className="text-3xl font-black text-white mt-1.5 font-mono">
                    {formatToman(severanceCalc.grandTotal)}
                    <span className="text-xs font-normal text-slate-400 mr-2">تومان</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>مبلغ حق سنوات قانونی:</span>
                    <span className="font-mono font-bold text-white">{formatToman(severanceCalc.severancePay)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>بازخرید مانده مرخصی:</span>
                    <span className="font-mono font-bold text-white">{formatToman(severanceCalc.leavePay)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-800 text-slate-400">
                    <span>پاداش عیدی سالانه تقریبی:</span>
                    <span className="font-mono text-cyan-300 font-bold">{formatToman(severanceCalc.annualBonus)} تومان</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl py-3.5 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  صدور و چاپ سند تسویه‌حساب
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۳. بخش حق بیمه‌ها و زنان خانه‌دار (منوی آبشاری) */}
        {/* ======================================================== */}
        {activeTab === 'insurance' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-black text-white">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>انتخاب طرح و نرخ بیمه تأمین اجتماعی</span>
                </div>

                {/* منوی آبشاری دسته‌بندی حق بیمه‌ها */}
                <div>
                  <label className="text-xs text-slate-300 block mb-2 font-bold">
                    نوع بیمه‌پردازی و تعهدات:
                  </label>
                  <div className="relative">
                    <select 
                      value={insuranceType}
                      onChange={(e) => setInsuranceType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm rounded-2xl px-4 py-3.5 outline-none cursor-pointer appearance-none"
                    >
                      <option value="housewife_14">بیمه زنان خانه‌دار (۱۴٪ - بازنشستگی و فوت قبل و بعد)</option>
                      <option value="housewife_18">بیمه زنان خانه‌دار (۱۸٪ - جامع‌ترین: بازنشستگی، فوت، ازکارافتادگی)</option>
                      <option value="housewife_12">بیمه زنان خانه‌دار (۱۲٪ - بازنشستگی و فوت پس از آن)</option>
                      <option value="labor_standard">بیمه اجباری کارگری (مجموع ۳۰٪ با تفکیک سهم کارگر و کارفرما)</option>
                      <option value="optional_27">بیمه اختیاری تأمین اجتماعی (۲۷٪ نرخ کامل درمان و مستمری)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute left-4 top-4 pointer-events-none" />
                  </div>
                </div>

                {/* دستمزد مبنای انتخابی */}
                <div>
                  <label className="text-xs text-slate-300 block mb-1.5 font-bold">
                    دستمزد اعلامی ماهیانه به سازمان (تومان):
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={insuranceSalaryInput ? Number(insuranceSalaryInput).toLocaleString('fa-IR') : ''}
                      onChange={handleMoneyInput(setInsuranceSalaryInput)}
                      placeholder="مثال: ۱۱,۰۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-2xl px-4 py-3 text-base text-left font-mono font-black text-indigo-400 outline-none pl-16 transition"
                    />
                    <span className="absolute left-3 top-3.5 text-xs text-slate-500 font-bold">تومان</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداقل دستمزد قانونی مبنا در سال ۱۴۰۳ برابر با {formatToman(MIN_MONTHLY_WAGE_1403)} تومان می‌باشد.
                  </span>
                </div>

                {/* تاگل سرانه درمان در زنان خانه‌دار */}
                {insuranceType.startsWith('housewife_') && (
                  <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">دفترچه و خدمات درمانی ملکی</span>
                      <span className="text-[11px] text-slate-400">
                        سرانه مصوب ماهانه: {formatToman(HEALTH_TARIFF_1403)} تومان برای هر نفر
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWithHealthCard(!withHealthCard)}
                      className={`px-4 py-2 rounded-xl text-xs font-black border transition ${
                        withHealthCard 
                          ? 'bg-indigo-950 border-indigo-700 text-indigo-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {withHealthCard ? 'دارد (افزودن سرانه)' : 'ندارد (بدون درمان)'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* کارت نتایج بیمه */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-b from-[#0c1222] via-[#0c1222] to-indigo-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl sticky top-20">
                <div className="border-b border-slate-850 pb-4 mb-4">
                  <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                    {insuranceType === 'labor_standard' ? 'سهم ماهیانه کارگر (۷ درصد)' : 'حق بیمه ماهانه پرداختی'}
                  </span>
                  <div className="text-3xl font-black text-white mt-1.5 font-mono">
                    {formatToman(insuranceCalc.totalMonthlyPay)}
                    <span className="text-xs font-normal text-slate-400 mr-2">تومان</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {insuranceCalc.description}
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  {insuranceType === 'labor_standard' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span>سهم کارگر (۷٪):</span>
                        <span className="font-mono font-bold text-indigo-300">{formatToman(insuranceCalc.workerShare)} تومان</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>سهم کارفرما + بیکاری (۲۳٪):</span>
                        <span className="font-mono font-bold text-slate-400">{formatToman(insuranceCalc.employerShare)} تومان</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span>حق بیمه پایه سهم متقاضی:</span>
                        <span className="font-mono font-bold text-indigo-300">{formatToman(insuranceCalc.workerShare)} تومان</span>
                      </div>
                      {insuranceCalc.healthShare > 0 && (
                        <div className="flex justify-between items-center">
                          <span>سرانه مصوب درمان:</span>
                          <span className="font-mono font-bold text-white">{formatToman(insuranceCalc.healthShare)} تومان</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-slate-500 pt-1">
                        <span>یارانه نقدی دولت (۲٪):</span>
                        <span className="font-mono">{formatToman(insuranceCalc.govtShare)} تومان</span>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-3.5 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  صدور فیش رسمی نرخ بیمه
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۴. بخش بیمه بیکاری */}
        {/* ======================================================== */}
        {activeTab === 'unemployment' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-black text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>احراز شرایط ماده ۷ قانون بیمه بیکاری</span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5 font-bold">
                    میانگین دستمزد ماهیانه ۹۰ روز آخر اشتغال (تومان):
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={unempSalaryInput ? Number(unempSalaryInput).toLocaleString('fa-IR') : ''}
                      onChange={handleMoneyInput(setUnempSalaryInput)}
                      placeholder="مثال: ۱۲,۵۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-2xl px-4 py-3 text-base text-left font-mono font-black text-emerald-400 outline-none pl-16 transition"
                    />
                    <span className="absolute left-3 top-3.5 text-xs text-slate-500 font-bold">تومان</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-bold">سابقه پرداخت حق بیمه (بر حسب ماه):</label>
                  <input 
                    type="number"
                    min="6"
                    value={insMonths || ''}
                    onChange={(e) => setInsMonths(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm font-bold text-white outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداقل سابقه الزامی ۶ ماه بیمه‌پردازی مستمر می‌باشد.
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">وضعیت تاهل و تکفل:</span>
                  <button
                    type="button"
                    onClick={() => setIsMarried(!isMarried)}
                    className={`px-4 py-2 rounded-xl text-xs font-black border transition ${
                      isMarried 
                        ? 'bg-emerald-950 border-emerald-700 text-emerald-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isMarried ? 'متاهل / دارای تحت تکفل' : 'مجرد بدون تکفل'}
                  </button>
                </div>

                {isMarried && (
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-bold">تعداد افراد تحت تکفل قانونی (حداکثر ۴ نفر):</label>
                    <input 
                      type="number"
                      min="0"
                      max="4"
                      value={dependents}
                      onChange={(e) => setDependents(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm font-bold text-white outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* کارت نتایج بیکاری */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-b from-[#0c1222] via-[#0c1222] to-emerald-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl sticky top-20">
                <div className="border-b border-slate-850 pb-4 mb-4">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">مقرری برآوردی هر ماه</span>
                  <div className="text-3xl font-black text-white mt-1.5 font-mono">
                    {formatToman(unempCalc.monthlyBenefit)}
                    <span className="text-xs font-normal text-slate-400 mr-2">تومان</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    نرخ استحقاقی محاسبه‌شده: {toFaDigits(unempCalc.ratePercentage)}٪ میانگین دستمزد
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>حداکثر مدت دوره پرداخت:</span>
                    <span className="font-mono font-bold text-emerald-300">{toFaDigits(unempCalc.monthsDuration)} ماه</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>کل دریافتی در طول کل دوره:</span>
                    <span className="font-mono font-bold text-white">{formatToman(unempCalc.totalPayout)} تومان</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-3.5 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  صدور فیش بیمه بیکاری
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* ۵. منوی شکیل فوتر (پویا، ارگونومیک و مینیمال) */}
      {/* ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#080d1a]/85 backdrop-blur-xl border-t border-slate-850 px-4 py-2.5">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${
              activeTab === 'dashboard' ? 'text-cyan-400 bg-cyan-950/50 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4 mb-1" />
            <span className="text-[10px]">داشبورد</span>
          </button>

          <button
            onClick={() => setActiveTab('severance')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${
              activeTab === 'severance' ? 'text-cyan-400 bg-cyan-950/50 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-1" />
            <span className="text-[10px]">سنوات</span>
          </button>

          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${
              activeTab === 'insurance' ? 'text-indigo-400 bg-indigo-950/50 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span className="text-[10px]">حق بیمه</span>
          </button>

          <button
            onClick={() => setActiveTab('unemployment')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${
              activeTab === 'unemployment' ? 'text-emerald-400 bg-emerald-950/50 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-1" />
            <span className="text-[10px]">بیکاری</span>
          </button>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* ۶. مودال فوق‌العاده شکیل صدور گزارش و پرینت استاندارد */}
      {/* ======================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-slate-100 shadow-2xl relative my-6">
            
            {/* نوار ابزار مودال */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-sm sm:text-base text-white">سند چاپی رسمی دادکار</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySlip}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition"
                  title="کپی متن فیش"
                >
                  <Copy className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={executePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  چاپ مستقیم سند
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* قالب برگه رسمی چاپی (تحویل مستقیم به پرینتر) */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 font-['Vazirmatn',Tahoma] shadow-xl border border-slate-200" id="official-slip-document">
              
              {/* هدر سند */}
              <div className="header flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <h4 className="title text-base sm:text-lg font-black tracking-tight text-slate-900">
                    سامانه محاسبات حقوقی و بیمه‌ای «دادکار»
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    برگه رسمی برآورد و استعلام تعهدات قانون کار و تأمین اجتماعی
                  </p>
                </div>
                <div className="meta-info text-left font-mono text-[11px] text-slate-700 space-y-0.5">
                  <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                  <div>کد پیگیری: DK-{Date.now().toString().slice(-7)}</div>
                  <div className="font-bold text-cyan-900">واحد مبالغ: تومان</div>
                </div>
              </div>

              {/* جداول و اطلاعات سند */}
              <div className="my-4 space-y-3">
                {activeTab === 'severance' && (
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      موضوع: تسویه‌حساب پایان خدمت کارگری (روش {severanceModel === 'itemized' ? 'تفکیکی آیتم‌های مزد' : 'مزد ثابت یکجا'})
                    </div>
                    <table className="data-table w-full border-collapse text-xs">
                      <tbody>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right w-1/2">سابقه کارکرد تجمیعی</th>
                          <td className="border p-2 font-bold">{sevYears} سال و {sevMonths} ماه و {sevDays} روز</td>
                        </tr>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right">حقوق مبنای محاسبه ماهانه</th>
                          <td className="border p-2 font-mono font-bold">{formatToman(severanceCalc.effectiveMonthlySalary)} تومان</td>
                        </tr>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right">مبلغ حق سنوات پایان خدمت</th>
                          <td className="border p-2 font-mono font-bold text-blue-900">{formatToman(severanceCalc.severancePay)} تومان</td>
                        </tr>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right">بازخرید مانده مرخصی ({leaveDays} روز)</th>
                          <td className="border p-2 font-mono font-bold">{formatToman(severanceCalc.leavePay)} تومان</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="total-box mt-3 bg-slate-100 border-2 border-slate-900 p-3 rounded-lg flex justify-between items-center text-xs sm:text-sm font-black">
                      <span>جمع کل مطالبات تسویه‌حساب و سنوات:</span>
                      <span className="font-mono text-cyan-950 text-base">{formatToman(severanceCalc.grandTotal)} تومان</span>
                    </div>
                  </div>
                )}

                {activeTab === 'insurance' && (
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      موضوع: استعلام حق بیمه ماهانه تأمین اجتماعی ({insuranceCalc.title})
                    </div>
                    <table className="data-table w-full border-collapse text-xs">
                      <tbody>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right w-1/2">دستمزد اعلامی مبنا در ماه</th>
                          <td className="border p-2 font-mono font-bold">{formatToman(insuranceCalc.wage)} تومان</td>
                        </tr>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right">سهم پرداختی متقاضی/بیمه‌شده</th>
                          <td className="border p-2 font-mono font-bold text-blue-900">{formatToman(insuranceCalc.workerShare)} تومان</td>
                        </tr>
                        {insuranceCalc.healthShare > 0 && (
                          <tr>
                            <th className="border p-2 bg-slate-100 text-right">سرانه خدمات درمانی (دفترچه)</th>
                            <td className="border p-2 font-mono font-bold">{formatToman(insuranceCalc.healthShare)} تومان</td>
                          </tr>
                        )}
                        {insuranceCalc.employerShare > 0 && (
                          <tr>
                            <th className="border p-2 bg-slate-100 text-right">سهم پرداختی کارفرما (۲۳٪)</th>
                            <td className="border p-2 font-mono font-bold">{formatToman(insuranceCalc.employerShare)} تومان</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div className="total-box mt-3 bg-slate-100 border-2 border-slate-900 p-3 rounded-lg flex justify-between items-center text-xs sm:text-sm font-black">
                      <span>مبلغ نهایی پرداخت ماهانه:</span>
                      <span className="font-mono text-indigo-950 text-base">{formatToman(insuranceCalc.totalMonthlyPay)} تومان</span>
                    </div>
                  </div>
                )}

                {(activeTab === 'unemployment' || activeTab === 'dashboard') && (
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      موضوع: برآورد مقرری بیمه بیکاری طبق ماده ۷ قانون بیمه بیکاری
                    </div>
                    <table className="data-table w-full border-collapse text-xs">
                      <tbody>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right w-1/2">میانگین دستمزد ۹۰ روز آخر</th>
                          <td className="border p-2 font-mono font-bold">{formatToman(unempCalc.avgSalary)} تومان</td>
                        </tr>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right">سابقه بیمه‌پردازی ثبت‌شده</th>
                          <td className="border p-2 font-bold">{insMonths} ماه</td>
                        </tr>
                        <tr>
                          <th className="border p-2 bg-slate-100 text-right">حداکثر طول دوره تعلق مقرری</th>
                          <td className="border p-2 font-bold text-emerald-900">{unempCalc.monthsDuration} ماه</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="total-box mt-3 bg-slate-100 border-2 border-slate-900 p-3 rounded-lg flex justify-between items-center text-xs sm:text-sm font-black">
                      <span>مقرری برآوردی هر ماه:</span>
                      <span className="font-mono text-emerald-950 text-base">{formatToman(unempCalc.monthlyBenefit)} تومان</span>
                    </div>
                  </div>
                )}
              </div>

              {/* سلب مسئولیت و تذکر قانونی الزامی */}
              <div className="legal-notice mt-5 p-3 rounded-xl border border-amber-300 bg-amber-50 text-[11px] text-amber-900 leading-normal flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>تذکر حقوقی:</strong> اطلاعات و ارقام مندرج در این برگه صرفاً به‌منظور افزایش آگاهی، برآورد و محاسبات اولیه حقوقی و بیمه‌ای تهیه شده است و رای نهایی مطالبات و سوابق منوط به تایید مراجع حل اختلاف اداره کار و شعب رسمی سازمان تأمین اجتماعی خواهد بود.
                </span>
              </div>

              {/* امضا و تایید */}
              <div className="signatures mt-6 pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
                <span>تولید شده از بستر ابری سامانه دادکار</span>
                <span className="font-bold text-slate-700">مهر و تایید سیستمی سامانه دادکار ✓</span>
              </div>
            </div>

            {copiedBadge && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2 rounded-full shadow-2xl animate-bounce">
                خلاصه گزارش کپی شد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
