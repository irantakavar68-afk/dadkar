import React, { useState, useMemo, useEffect } from 'react';
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
  UserCheck, 
  Info, 
  ArrowRight, 
  Sparkles,
  HeartHandshake,
  Briefcase,
  AlertTriangle
} from 'lucide-react';

// ===================================================================
// ابزارهای پردازش ارقام و واحد پول (تماماً به «تومان»)
// ===================================================================
const toFaDigits = (n: number | string): string => {
  if (n === null || n === undefined || n === '') return '';
  const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => fa[parseInt(x, 10)]);
};

const formatToman = (val: number): string => {
  return new Intl.NumberFormat('fa-IR').format(Math.round(val));
};

const sanitizeToEnglishNumber = (raw: string): number => {
  if (!raw) return 0;
  const standard = raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[^0-9]/g, '');
  const parsed = parseInt(standard, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// حداقل دستمزد روزانه و ماهانه سال ۱۴۰۳ (به تومان)
const MIN_MONTHLY_WAGE_1403 = 7166184; // حداقل حقوق ماهیانه مصوب (تومان)
const HEALTH_TARIFF_1403 = 119500;     // سرانه درمان هر نفر در ماه (تومان)

export default function DadKarApp() {
  // ۱. وضعیت اسپلش اسکرین و پیام خوش‌آمد
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);

  // ۲. ناوبری و تب فعال
  const [activeTab, setActiveTab] = useState<'dashboard' | 'severance' | 'insurance' | 'unemployment'>('dashboard');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [copiedBadge, setCopiedBadge] = useState<boolean>(false);

  // ۳. استیت ورودی‌های پولی (رشته‌ای برای عدم تداخل با تایپ کاربر)
  // سنوات
  const [salaryInput, setSalaryInput] = useState<string>('12000000');
  const [sevYears, setSevYears] = useState<number>(1);
  const [sevMonths, setSevMonths] = useState<number>(2);
  const [sevDays, setSevDays] = useState<number>(15);
  const [leaveDays, setLeaveDays] = useState<number>(5);

  // حق بیمه (آبشاری)
  const [insuranceSalaryInput, setInsuranceSalaryInput] = useState<string>('10000000');
  const [insuranceType, setInsuranceType] = useState<
    'labor_standard' | 'housewife_12' | 'housewife_14' | 'housewife_18' | 'optional_27'
  >('housewife_14');
  const [withHealthCard, setWithHealthCard] = useState<boolean>(true);

  // بیمه بیکاری
  const [unempSalaryInput, setUnempSalaryInput] = useState<string>('11500000');
  const [insMonths, setInsMonths] = useState<number>(36);
  const [isMarried, setIsMarried] = useState<boolean>(true);
  const [dependents, setDependents] = useState<number>(2);

  // کنترل اسپلش اسکرین در بارگذاری اولیه
  useEffect(() => {
    const timer = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowSplash(false), 400);
          return 100;
        }
        return prev + 5;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  // هندلر تمیز ورودی‌های پولی
  const handleMoneyChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const num = sanitizeToEnglishNumber(rawVal);
    setter(num === 0 ? '' : num.toString());
  };

  // -------------------------------------------------------------------
  // محاسبات سنوات و مطالبات کارگری (ماده ۲۴ و ۷۱ قانون کار)
  // -------------------------------------------------------------------
  const severanceCalc = useMemo(() => {
    const monthlySalary = sanitizeToEnglishNumber(salaryInput);
    const dailyWage = monthlySalary / 30;
    const totalDaysWorked = (sevYears * 365) + (sevMonths * 30) + sevDays;
    
    // سنوات پایان کار: به ازای هر ۳۶۵ روز معادل ۱ ماه آخرین مزد
    const severancePay = (totalDaysWorked / 365) * monthlySalary;
    
    // مانده مرخصی ذخیره شده
    const leavePay = leaveDays * dailyWage;

    // پاداش و عیدی مصوب (۶۰ روز پایه حقوق به ازای یک سال سابقه)
    const bonusPay = (totalDaysWorked / 365) * (monthlySalary * 2);

    return {
      monthlySalary,
      dailyWage,
      totalDaysWorked,
      severancePay,
      leavePay,
      bonusPay,
      totalSum: severancePay + leavePay
    };
  }, [salaryInput, sevYears, sevMonths, sevDays, leaveDays]);

  // -------------------------------------------------------------------
  // محاسبات انواع حق بیمه (اجباری کارگری، زنان خانه‌دار، اختیاری)
  // -------------------------------------------------------------------
  const insuranceCalc = useMemo(() => {
    const wage = sanitizeToEnglishNumber(insuranceSalaryInput);
    let workerShare = 0;
    let employerShare = 0;
    let govtShare = 0;
    let healthShare = 0;
    let totalMonthlyPay = 0;
    let title = '';
    let description = '';

    switch (insuranceType) {
      case 'labor_standard':
        title = 'بیمه اجباری کارگری (مشمولین قانون کار)';
        workerShare = wage * 0.07; // ۷ درصد سهم بیمه‌شده
        employerShare = wage * 0.23; // ۲۰ درصد کارفرما + ۳ درصد بیمه بیکاری
        totalMonthlyPay = workerShare;
        description = 'شامل تمامی تعهدات کوتاه‌مدت، بلندمدت، درمان رایگان ملکی تأمین اجتماعی و بیمه بیکاری.';
        break;

      case 'housewife_12':
        title = 'بیمه زنان خانه‌دار (نرخ ۱۲٪)';
        workerShare = wage * 0.12;
        govtShare = wage * 0.02; // ۲ درصد سهم دولت
        healthShare = withHealthCard ? HEALTH_TARIFF_1403 : 0;
        totalMonthlyPay = workerShare + healthShare;
        description = 'شامل بازنشستگی و فوت بعد از بازنشستگی. فاقد غرامت دستمزد ایام بیماری و فوت قبل از بازنشستگی.';
        break;

      case 'housewife_14':
        title = 'بیمه زنان خانه‌دار (نرخ ۱۴٪)';
        workerShare = wage * 0.14;
        govtShare = wage * 0.02;
        healthShare = withHealthCard ? HEALTH_TARIFF_1403 : 0;
        totalMonthlyPay = workerShare + healthShare;
        description = 'شامل بازنشستگی و پرداخت مستمری فوت قبل و بعد از بازنشستگی به بازماندگان واجد شرایط.';
        break;

      case 'housewife_18':
        title = 'بیمه زنان خانه‌دار (نرخ ۱۸٪ - کامل‌ترین)';
        workerShare = wage * 0.18;
        govtShare = wage * 0.02;
        healthShare = withHealthCard ? HEALTH_TARIFF_1403 : 0;
        totalMonthlyPay = workerShare + healthShare;
        description = 'شامل بازنشستگی، فوت قبل و بعد از موعد، و ازکارافتادگی کلی غیرناشی از کار.';
        break;

      case 'optional_27':
        title = 'بیمه اختیاری تأمین اجتماعی (۲۷٪)';
        workerShare = wage * 0.27;
        govtShare = wage * 0.02;
        healthShare = 0; // درمان درون نرخ ۲۷٪ گنجانده شده است
        totalMonthlyPay = workerShare;
        description = 'شامل مستمری بازنشستگی، فوت، ازکارافتادگی و کلیه خدمات درمانی کامل بدون نیاز به سرانه مجزا.';
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
  // محاسبات بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)
  // -------------------------------------------------------------------
  const unempCalc = useMemo(() => {
    const avgSalary = sanitizeToEnglishNumber(unempSalaryInput);
    
    // پایه: ۵۵ درصد متوسط ۹۰ روز آخر
    let rate = 0.55;
    // به ازای هر تکفل ۱۰ درصد (حداکثر تا ۴ نفر یعنی ۴۰ درصد)
    const depBonus = Math.min(dependents, 4) * 0.10;
    rate += depBonus;
    if (rate > 0.80) rate = 0.80; // حداکثر سقف قانونی ۸۰ درصد است

    let monthlyBenefit = avgSalary * rate;
    
    // مقرری نباید از حداقل دستمزد مصوب کمتر باشد
    if (monthlyBenefit < MIN_MONTHLY_WAGE_1403) {
      monthlyBenefit = MIN_MONTHLY_WAGE_1403;
    }

    // جدول ماه‌های تعلق بر اساس سابقه و تاهل
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

  // عملیات چاپ رسمی در صفحه استاندارد
  const handleDirectPrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    let summary = `سامانه رسمی دادکار\nگزارش برآورد محاسبات قانونی\n`;
    if (activeTab === 'severance') {
      summary += `حق سنوات: ${formatToman(severanceCalc.severancePay)} تومان\nمانده مرخصی: ${formatToman(severanceCalc.leavePay)} تومان\nجمع کل: ${formatToman(severanceCalc.totalSum)} تومان`;
    } else if (activeTab === 'insurance') {
      summary += `نوع بیمه: ${insuranceCalc.title}\nحق بیمه ماهیانه: ${formatToman(insuranceCalc.totalMonthlyPay)} تومان`;
    } else if (activeTab === 'unemployment') {
      summary += `مقرری ماهانه بیکاری: ${formatToman(unempCalc.monthlyBenefit)} تومان\nمدت پرداخت: ${unempCalc.monthsDuration} ماه`;
    }
    navigator.clipboard.writeText(summary);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  // ===================================================================
  // رندر اسپلش اسکرین متحرک
  // ===================================================================
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-36 h-36 rounded-full bg-cyan-500/20 blur-2xl animate-pulse"></div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 transform transition hover:scale-105">
            <Calculator className="w-12 h-12 text-white animate-bounce" />
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2 mb-2">
          <span>دادکــار</span>
          <span className="text-xs font-normal text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-950/50">
            نسخه حقوقی ۱۴۰۳
          </span>
        </h1>
        <p className="text-sm text-slate-400 mb-8 text-center max-w-xs leading-relaxed">
          سامانه هوشمند محاسبات کارگری، بازنشستگی و حق بیمه تأمین اجتماعی
        </p>

        {/* پروگرس بار */}
        <div className="w-64 bg-slate-900 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden mb-4">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-150"
            style={{ width: `${splashProgress}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono text-cyan-400 mb-6">{toFaDigits(splashProgress)}٪</span>

        <button 
          onClick={() => setShowSplash(false)}
          className="text-xs text-slate-500 hover:text-slate-300 transition underline underline-offset-4"
        >
          ورود مستقیم به برنامه
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black pb-24">
      {/* هدر ثابت شیشه‌ای */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">دادکار</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800/60 px-1.5 py-0.2 rounded font-mono">
                  تومان
                </span>
              </div>
              <span className="text-[11px] text-slate-400">محاسبات رسمی کار و بیمه</span>
            </div>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3.5 py-2 rounded-xl shadow-lg shadow-cyan-900/30 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ گزارش رسمی</span>
          </button>
        </div>
      </header>

      {/* ناحیه محتوا */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col gap-6">

        {/* ======================================================== */}
        {/* ۱. داشبورد اصلی (باکس‌های شکیل متحرک جهت جذب مخاطب) */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  بروزرسانی شده با بخشنامه‌های ۱۴۰۳
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                  مرجع تخصصی حقوق کار، حق بیمه و سنوات پایان خدمت
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  سامانه دادکار به منظور ایجاد شفافیت و رفع ابهامات مالی و بیمه‌ای کارگران، کارفرمایان و بانوان گرامی طراحی گردیده است.
                </p>
              </div>
              <div className="absolute left-[-20px] bottom-[-20px] w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* کارت‌های ۳ گانه اصلی برای دسترسی سریع */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* سنوات */}
              <div 
                onClick={() => setActiveTab('severance')}
                className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">محاسبه سنوات و مرخصی</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    محاسبه پاداش پایان خدمت، مانده مرخصی استفاده‌نشده و عیدی طبق ماده ۲۴ و ۷۱ قانون کار.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400">
                  <span>شروع محاسبه</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-4px] transition" />
                </div>
              </div>

              {/* حق بیمه‌ها و زنان خانه‌دار */}
              <div 
                onClick={() => setActiveTab('insurance')}
                className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition">حق بیمه و زنان خانه‌دار</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    منوی انتخاب بیمه کارگری، نرخ‌های ۱۲٪، ۱۴٪، ۱۸٪ زنان خانه‌دار و اختیاری همراه با سرانه درمان.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400">
                  <span>بررسی نرخ‌ها</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-4px] transition" />
                </div>
              </div>

              {/* بیمه بیکاری */}
              <div 
                onClick={() => setActiveTab('unemployment')}
                className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition">مقرری بیمه بیکاری</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    برآورد دقیق مدت زمان دریافت و مبلغ ماهانه مقرری با اعمال شرایط تاهل و تعداد افراد تحت تکفل.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400">
                  <span>محاسبه دوره</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-4px] transition" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۲. بخش سنوات و مطالبات کارگری */}
        {/* ======================================================== */}
        {activeTab === 'severance' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>سابقه کارکرد تجمیعی</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">سال</label>
                    <input 
                      type="number"
                      min="0"
                      value={sevYears || ''}
                      onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-center font-bold text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ماه</label>
                    <input 
                      type="number"
                      min="0"
                      max="11"
                      value={sevMonths || ''}
                      onChange={(e) => setSevMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-center font-bold text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">روز</label>
                    <input 
                      type="number"
                      min="0"
                      max="29"
                      value={sevDays || ''}
                      onChange={(e) => setSevDays(Math.max(0, Math.min(29, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-center font-bold text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                    آخرین حقوق ثابت ماهانه (به تومان):
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={salaryInput ? Number(salaryInput).toLocaleString('fa-IR') : ''}
                      onChange={handleMoneyChange(setSalaryInput)}
                      placeholder="مثال: ۱۲,۰۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-base text-left font-mono font-bold text-cyan-400 outline-none pl-16 transition"
                    />
                    <span className="absolute left-3 top-3 text-xs text-slate-500 font-sans">تومان</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    مزد ثابت شامل مزد شغل و مزایای مستمر پرداختی به ازای کار عادی است.
                  </span>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-300 block mb-1">تعداد روزهای مانده مرخصی استحقاقی:</label>
                  <input 
                    type="number"
                    min="0"
                    value={leaveDays || ''}
                    onChange={(e) => setLeaveDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداکثر سقف مجاز انتقال مرخصی برای هر سال، ۹ روز قانونی است.
                  </span>
                </div>
              </div>
            </div>

            {/* کارت نتایج محاسبات سنوات */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">جمع کل مطالبات سنوات</span>
                  <div className="text-3xl font-black text-white mt-1 font-mono">
                    {formatToman(severanceCalc.totalSum)}
                    <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>حق سنوات خدمت:</span>
                    <span className="font-mono font-bold text-white">{formatToman(severanceCalc.severancePay)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مبلغ بازخرید مرخصی:</span>
                    <span className="font-mono font-bold text-white">{formatToman(severanceCalc.leavePay)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-slate-400">
                    <span>پاداش عیدی تقریبی سالانه:</span>
                    <span className="font-mono text-cyan-300">{formatToman(severanceCalc.bonusPay)} تومان</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40"
                >
                  <FileText className="w-4 h-4" />
                  مشاهده و چاپ سند رسمی
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۳. بخش حق بیمه‌ها و بیمه زنان خانه‌دار (منوی آبشاری) */}
        {/* ======================================================== */}
        {activeTab === 'insurance' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>انتخاب نوع بیمه تأمین اجتماعی</span>
                </div>

                {/* منوی آبشاری جامع */}
                <div>
                  <label className="text-xs text-slate-300 block mb-2 font-medium">
                    دسته‌بندی و نرخ حق بیمه:
                  </label>
                  <select 
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-3 outline-none cursor-pointer"
                  >
                    <option value="labor_standard">بیمه اجباری کارگری (مجموعاً ۳۰٪ با تفکیک سهم کارگر و کارفرما)</option>
                    <option value="housewife_12">بیمه زنان خانه‌دار (۱۲٪ - بازنشستگی و فوت بعد بازنشستگی)</option>
                    <option value="housewife_14">بیمه زنان خانه‌دار (۱۴٪ - بازنشستگی و فوت قبل و بعد)</option>
                    <option value="housewife_18">بیمه زنان خانه‌دار (۱۸٪ - جامع‌ترین: فوت، بازنشستگی، ازکارافتادگی)</option>
                    <option value="optional_27">بیمه اختیاری تأمین اجتماعی (۲۷٪ نرخ کامل)</option>
                  </select>
                </div>

                {/* مبلغ دستمزد مبنا */}
                <div className="pt-2">
                  <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                    مبنای دستمزد اعلامی در ماه (به تومان):
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={insuranceSalaryInput ? Number(insuranceSalaryInput).toLocaleString('fa-IR') : ''}
                      onChange={handleMoneyChange(setInsuranceSalaryInput)}
                      placeholder="مثال: ۱۰,۰۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-base text-left font-mono font-bold text-indigo-400 outline-none pl-16 transition"
                    />
                    <span className="absolute left-3 top-3 text-xs text-slate-500 font-sans">تومان</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداقل دستمزد مجاز برای بیمه در سال ۱۴۰۳ برابر با {formatToman(MIN_MONTHLY_WAGE_1403)} تومان است.
                  </span>
                </div>

                {/* وضعیت دفترچه و سرانه درمان */}
                {(insuranceType.startsWith('housewife_')) && (
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">پوشش خدمات درمانی (دفترچه)</span>
                      <span className="text-[11px] text-slate-500">
                        سرانه مصوب ماهانه درمان: {formatToman(HEALTH_TARIFF_1403)} تومان برای هر نفر
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWithHealthCard(!withHealthCard)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        withHealthCard 
                          ? 'bg-indigo-950 border-indigo-700 text-indigo-300' 
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {withHealthCard ? 'دارد (افزودن سرانه)' : 'ندارد (بدون درمان)'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* کارت خروجی محاسبات بیمه */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                    {insuranceType === 'labor_standard' ? 'سهم پرداختی ماهانه بیمه‌شده (کارگر)' : 'مبلغ کل پرداختی ماهیانه'}
                  </span>
                  <div className="text-3xl font-black text-white mt-1 font-mono">
                    {formatToman(insuranceCalc.totalMonthlyPay)}
                    <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {insuranceCalc.description}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  {insuranceType === 'labor_standard' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span>سهم کارگر (۷ درصد):</span>
                        <span className="font-mono font-bold text-indigo-300">{formatToman(insuranceCalc.workerShare)} تومان</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>سهم کارفرما + بیکاری (۲۳ درصد):</span>
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
                          <span>سرانه خدمات درمانی:</span>
                          <span className="font-mono font-bold text-white">{formatToman(insuranceCalc.healthShare)} تومان</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-slate-500 pt-1">
                        <span>کمک نقدی دولت (۲ درصد):</span>
                        <span className="font-mono">{formatToman(insuranceCalc.govtShare)} تومان</span>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40"
                >
                  <FileText className="w-4 h-4" />
                  مشاهده و چاپ سند رسمی
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
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>شرایط احراز مقرری بیمه بیکاری</span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                    متوسط دستمزد ماهیانه ۹۰ روز آخر (به تومان):
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={unempSalaryInput ? Number(unempSalaryInput).toLocaleString('fa-IR') : ''}
                      onChange={handleMoneyChange(setUnempSalaryInput)}
                      placeholder="مثال: ۱۱,۵۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-base text-left font-mono font-bold text-emerald-400 outline-none pl-16 transition"
                    />
                    <span className="absolute left-3 top-3 text-xs text-slate-500 font-sans">تومان</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">مدت سابقه پرداخت حق بیمه (ماه):</label>
                  <input 
                    type="number"
                    min="6"
                    value={insMonths || ''}
                    onChange={(e) => setInsMonths(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداقل سابقه لازم برای شمول ماده ۷ قانون بیمه بیکاری، ۶ ماه می‌باشد.
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300">وضعیت تاهل یا تکفل:</span>
                  <button
                    type="button"
                    onClick={() => setIsMarried(!isMarried)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isMarried 
                        ? 'bg-emerald-950 border-emerald-700 text-emerald-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {isMarried ? 'متاهل / دارای افراد تحت تکفل' : 'مجرد بدون تکفل'}
                  </button>
                </div>

                {isMarried && (
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">تعداد افراد تحت تکفل قانونی (حداکثر ۴ نفر):</label>
                    <input 
                      type="number"
                      min="0"
                      max="4"
                      value={dependents}
                      onChange={(e) => setDependents(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* کارت نتایج بیکاری */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">مقرری برآوردی در هر ماه</span>
                  <div className="text-3xl font-black text-white mt-1 font-mono">
                    {formatToman(unempCalc.monthlyBenefit)}
                    <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    محاسبه شده بر مبنای ضریب قانونی {toFaDigits(unempCalc.ratePercentage)}٪
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>مدت پرداخت مجاز:</span>
                    <span className="font-mono font-bold text-emerald-300">{toFaDigits(unempCalc.monthsDuration)} ماه</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>کل دریافتی در کل دوره:</span>
                    <span className="font-mono font-bold text-white">{formatToman(unempCalc.totalPayout)} تومان</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <FileText className="w-4 h-4" />
                  مشاهده و چاپ سند رسمی
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* ۵. منوی ثابت و شناور فوتر (طراحی ارگونومیک موبایل) */}
      {/* ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2.5">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'dashboard' ? 'text-cyan-400 bg-cyan-950/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4 mb-1" />
            <span className="text-[10px]">داشبورد</span>
          </button>

          <button
            onClick={() => setActiveTab('severance')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'severance' ? 'text-cyan-400 bg-cyan-950/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-1" />
            <span className="text-[10px]">سنوات</span>
          </button>

          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'insurance' ? 'text-indigo-400 bg-indigo-950/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span className="text-[10px]">حق بیمه</span>
          </button>

          <button
            onClick={() => setActiveTab('unemployment')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'unemployment' ? 'text-emerald-400 bg-emerald-950/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-1" />
            <span className="text-[10px]">بیکاری</span>
          </button>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* ۶. مودال شکیل گزارش رسمی چاپی (آماده برای چاپ و صدور) */}
      {/* ======================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
            
            {/* نوار بالایی مودال */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-sm sm:text-base text-white">سند رسمی گزارش محاسباتی دادکار</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  title="کپی خلاصه"
                >
                  <Copy className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={handleDirectPrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/30"
                >
                  <Printer className="w-4 h-4" />
                  چاپ نهایی
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-400 border border-slate-800 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* برگه سفید استاندارد شبیه‌ساز پرینت رسمی سازمان */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 font-sans shadow-inner border border-slate-300 text-xs sm:text-sm leading-relaxed" id="printable-area">
              
              {/* هدر فیش */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
                <div>
                  <h4 className="text-base sm:text-lg font-black tracking-tight text-slate-900">سامانه محاسبات حقوقی «دادکار»</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">برگه استعلام و برآورد تعهدات قانونی کار و تأمین اجتماعی</p>
                </div>
                <div className="text-left font-mono text-[11px] text-slate-600">
                  <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                  <div>کد پیگیری: DK-{Date.now().toString().slice(-6)}</div>
                  <div className="font-bold text-cyan-800">واحد: تومان</div>
                </div>
              </div>

              {/* جدول جزئیات گزارش */}
              <div className="space-y-4 my-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                    خلاصه وضعیت پرونده استعلام‌شده
                  </div>

                  {activeTab === 'severance' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-600">سابقه کارکرد قطعی:</span>
                        <span className="font-bold">{sevYears} سال و {sevMonths} ماه و {sevDays} روز</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">حقوق مبنای ماهانه:</span>
                        <span className="font-mono font-bold">{formatToman(severanceCalc.monthlySalary)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">مبلغ حق سنوات:</span>
                        <span className="font-mono font-bold text-blue-700">{formatToman(severanceCalc.severancePay)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">مانده مرخصی ({leaveDays} روز):</span>
                        <span className="font-mono font-bold">{formatToman(severanceCalc.leavePay)} تومان</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black text-slate-950">
                        <span>جمع کل مطالبات تسویه‌حساب:</span>
                        <span className="font-mono text-cyan-800">{formatToman(severanceCalc.totalSum)} تومان</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'insurance' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-600">نوع بیمه انتخابی:</span>
                        <span className="font-bold text-indigo-900">{insuranceCalc.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">دستمزد اعلامی مبنا:</span>
                        <span className="font-mono font-bold">{formatToman(insuranceCalc.wage)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">سهم پرداختی متقاضی/بیمه‌شده:</span>
                        <span className="font-mono font-bold text-blue-700">{formatToman(insuranceCalc.workerShare)} تومان</span>
                      </div>
                      {insuranceCalc.healthShare > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">سرانه خدمات درمانی:</span>
                          <span className="font-mono font-bold">{formatToman(insuranceCalc.healthShare)} تومان</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black text-slate-950">
                        <span>مبلغ نهایی پرداخت ماهانه:</span>
                        <span className="font-mono text-indigo-800">{formatToman(insuranceCalc.totalMonthlyPay)} تومان</span>
                      </div>
                    </div>
                  )}

                  {(activeTab === 'unemployment' || activeTab === 'dashboard') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-600">متوسط حقوق ۹۰ روز آخر:</span>
                        <span className="font-mono font-bold">{formatToman(unempCalc.avgSalary)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">سابقه بیمه‌پردازی معتبر:</span>
                        <span className="font-bold">{insMonths} ماه</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">طول دوره تعلق مقرری:</span>
                        <span className="font-bold text-emerald-800">{unempCalc.monthsDuration} ماه</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black text-slate-950">
                        <span>مقرری مصوب ماهانه:</span>
                        <span className="font-mono text-emerald-800">{formatToman(unempCalc.monthlyBenefit)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* سلب مسئولیت و عبارت اطلاع‌رسانی الزامی */}
              <div className="mt-6 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900 leading-normal">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>تذکر حقوقی:</strong> این گزارش صرفاً جهت برآورد و افزایش آگاهی حقوقی و بیمه‌ای تهیه شده است و رای قطعی مطالبات منوط به احراز در مراجع حل اختلاف اداره کار و شعب سازمان تأمین اجتماعی خواهد بود.
                </span>
              </div>

              {/* فوتر سند */}
              <div className="mt-6 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                <span>تولید شده توسط نرم‌افزار دادکار (نسخه ابری)</span>
                <span>امضا و تایید سامانه دادکار ✓</span>
              </div>
            </div>

            {copiedBadge && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg">
                متن فیش کپی شد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
