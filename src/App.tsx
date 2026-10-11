import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  UserMinus, 
  Clock, 
  Printer, 
  RotateCcw, 
  ChevronLeft, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

// بارگذاری داینامیک html2pdf برای تبدیل قطعی به PDF در اندروید و مرورگر
const loadHtml2Pdf = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve((window as any).html2pdf);
    script.onerror = () => reject(new Error('خطا در بارگذاری موتور PDF'));
    document.body.appendChild(script);
  });
};

type ActiveTab = 'dashboard' | 'severance' | 'pension' | 'unemployment' | 'insurance';

export default function DadKarApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // پاکسازی و فرمت اعداد (تومان)
  const sanitizeNumber = (val: string): number => {
    const cleaned = val.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('fa-IR');
  };

  // --- وضعیت‌های سنوات (ماده ۲۴ و دیوان عدالت اداری) ---
  const [sevMode, setSevMode] = useState<'base' | 'itemized'>('base');
  const [sevBaseSalary, setSevBaseSalary] = useState<number>(0);
  const [sevJobBonus, setSevJobBonus] = useState<number>(0);
  const [sevHardship, setSevHardship] = useState<number>(0);
  const [sevMonths, setSevMonths] = useState<number>(12);
  const [sevResult, setSevResult] = useState<number | null>(null);

  // --- وضعیت‌های مستمری بازنشستگی (ماده ۷۷ تأمین اجتماعی) ---
  const [penAvgSalary, setPenAvgSalary] = useState<number>(0); // میانگین دستمزد ۲ سال آخر
  const [penYears, setPenYears] = useState<number>(30); // سابقه پرداخت حق بیمه
  const [penResult, setPenResult] = useState<number | null>(null);

  // --- وضعیت‌های مقرری بیمه بیکاری (ماده ۷ قانون بیمه بیکاری) ---
  const [unempAvgSalary, setUnempAvgSalary] = useState<number>(0); // میانگین ۹۰ روز آخر
  const [unempDependents, setUnempDependents] = useState<number>(0); // تعداد افراد تکفل
  const [unempResult, setUnempResult] = useState<{ base: number; extra: number; total: number } | null>(null);

  // --- وضعیت‌های حق بیمه (ماده ۲۸ تأمین اجتماعی و انواع بیمه) ---
  const [insSalary, setInsSalary] = useState<number>(0);
  const [insType, setInsType] = useState<string>('labor');
  const [insResult, setInsResult] = useState<{
    workerShare: number;
    workerRate: number;
    employerShare: number;
    employerRate: number;
    govShare: number;
    govRate: number;
    total: number;
  } | null>(null);

  // محاسبات سنوات
  const calculateSeverance = () => {
    const wagePerMonth = sevMode === 'base' 
      ? sevBaseSalary 
      : (sevBaseSalary + sevJobBonus + sevHardship);
    const total = Math.round((wagePerMonth / 12) * sevMonths);
    setSevResult(total);
  };

  // محاسبات مستمری (ماده ۷۷: (سابقه * میانگین دستمزد) / ۳۰)
  const calculatePension = () => {
    if (penAvgSalary <= 0 || penYears <= 0) return;
    const cappedYears = Math.min(penYears, 35);
    const monthlyPension = Math.round((cappedYears * penAvgSalary) / 30);
    setPenResult(monthlyPension);
  };

  // محاسبات بیمه بیکاری (۵۵٪ حقوق پایه + ۱۰٪ به ازای هر تحت تکفل تا سقف ۴ نفر، مشروط به عدم تجاوز از ۸۰٪ و عدم سقوط زیر حداقل)
  const calculateUnemployment = () => {
    if (unempAvgSalary <= 0) return;
    const baseAmount = Math.round(unempAvgSalary * 0.55);
    const validDeps = Math.min(Math.max(unempDependents, 0), 4);
    const extraAmount = Math.round(unempAvgSalary * (validDeps * 0.10));
    let total = baseAmount + extraAmount;
    
    // سقف قانونی: حداکثر ۸۰ درصد میانگین دستمزد
    const maxAllowed = Math.round(unempAvgSalary * 0.80);
    if (total > maxAllowed) total = maxAllowed;

    setUnempResult({
      base: baseAmount,
      extra: extraAmount,
      total: total
    });
  };

  // محاسبات حق بیمه بر اساس درصدها
  const calculateInsurance = () => {
    if (insSalary <= 0) return;

    let workerRate = 0;
    let employerRate = 0;
    let govRate = 0;

    switch (insType) {
      case 'labor': // قانون کار: ۷٪ کارگر، ۲۳٪ کارفرما (۲۰ بیمه + ۳ بیکاری)
        workerRate = 7;
        employerRate = 23;
        govRate = 3;
        break;
      case 'housewife_12': // ۱۲٪ بازنشستگی و فوت بعد بازنشستگی
        workerRate = 12;
        employerRate = 0;
        govRate = 2; // کمک دولت
        break;
      case 'housewife_14': // ۱۴٪ بازنشستگی و فوت قبل و بعد بازنشستگی
        workerRate = 14;
        employerRate = 0;
        govRate = 2;
        break;
      case 'housewife_18': // ۱۸٪ کامل (بازنشستگی، فوت، ازکارافتادگی)
        workerRate = 18;
        employerRate = 0;
        govRate = 2;
        break;
      case 'optional_27': // اختیاری ۲۷٪
        workerRate = 27;
        employerRate = 0;
        govRate = 0;
        break;
      default:
        break;
    }

    const workerShare = Math.round(insSalary * (workerRate / 100));
    const employerShare = Math.round(insSalary * (employerRate / 100));
    const govShare = Math.round(insSalary * (govRate / 100));

    setInsResult({
      workerShare,
      workerRate,
      employerShare,
      employerRate,
      govShare,
      govRate,
      total: workerShare + employerShare
    });
  };

  // خروجی PDF قطعی و پایدار
  const handlePrintOrPdf = async () => {
    const element = document.getElementById('report-document');
    if (!element) return;

    setPdfGenerating(true);
    try {
      const html2pdf = await loadHtml2Pdf();
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `DadKar_Report_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.warn('Fallback to standard window.print()', err);
      window.print();
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12 selection:bg-cyan-500 selection:text-white" dir="rtl">
      
      {/* هدر بالایی */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white">دادکار</h1>
            <p className="text-[10px] text-slate-400">سامانه محاسبات حقوق و تأمین اجتماعی</p>
          </div>
        </div>

        {activeTab !== 'dashboard' && (
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            <span>بازگشت</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* بخش اصلی */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        
        {/* --- ۱. داشبورد --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
              <h2 className="text-sm font-bold text-slate-200 mb-1">پنل تخصصی دادکار</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                برای انجام محاسبات قانونی، بخش مورد نظر خود را انتخاب نمایید. کلیه ضرایب منطبق بر قوانین مصوب سال جاری محاسبه می‌شوند.
              </p>
            </div>

            {/* گرید باکس‌ها با آیکن‌های متحرک */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* سنوات */}
              <button
                onClick={() => setActiveTab('severance')}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-cyan-400 transition-colors">
                  محاسبه سنوات
                </span>
                <span className="mt-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۴ قانون کار
                </span>
              </button>

              {/* مستمری */}
              <button
                onClick={() => setActiveTab('pension')}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-emerald-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors">
                  مستمری بازنشستگی
                </span>
                <span className="mt-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷۷ تأمین اجتماعی
                </span>
              </button>

              {/* بیمه بیکاری */}
              <button
                onClick={() => setActiveTab('unemployment')}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <UserMinus className="w-7 h-7 text-amber-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                  مقرری بیمه بیکاری
                </span>
                <span className="mt-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷ بیمه بیکاری
                </span>
              </button>

              {/* حق بیمه */}
              <button
                onClick={() => setActiveTab('insurance')}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <Calculator className="w-7 h-7 text-indigo-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-indigo-400 transition-colors">
                  محاسبه حق بیمه
                </span>
                <span className="mt-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۸ تأمین اجتماعی
                </span>
              </button>

            </div>
          </div>
        )}

        {/* --- ۲. ماژول سنوات --- */}
        {activeTab === 'severance' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> محاسبه پاداش پایان خدمت (سنوات)
              </h3>

              {/* شیوه محاسبه */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSevMode('base')}
                  className={`py-2 text-xs rounded-xl border transition-all ${
                    sevMode === 'base'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-850 border-slate-700 text-slate-400'
                  }`}
                >
                  مزد مبنا / ثابت
                </button>
                <button
                  type="button"
                  onClick={() => setSevMode('itemized')}
                  className={`py-2 text-xs rounded-xl border transition-all ${
                    sevMode === 'itemized'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-850 border-slate-700 text-slate-400'
                  }`}
                >
                  اقلام کامل (رأی دیوان)
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {sevMode === 'base' ? 'حقوق ماهانه (تومان):' : 'مزد شغل ماهانه (تومان):'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={sevBaseSalary ? sevBaseSalary.toLocaleString() : ''}
                    onChange={(e) => setSevBaseSalary(sanitizeNumber(e.target.value))}
                    placeholder="مثال: ۱۰,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {sevMode === 'itemized' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">فوق‌العاده پست یا شغل (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={sevJobBonus ? sevJobBonus.toLocaleString() : ''}
                        onChange={(e) => setSevJobBonus(sanitizeNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">فوق‌العاده سختی کار / شرایط محیط (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={sevHardship ? sevHardship.toLocaleString() : ''}
                        onChange={(e) => setSevHardship(sanitizeNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs text-slate-300 mb-1">مدت کارکرد (ماه):</label>
                  <input
                    type="number"
                    min="1"
                    value={sevMonths}
                    onChange={(e) => setSevMonths(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={calculateSeverance}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-cyan-600/20"
                >
                  محاسبه سنوات
                </button>
              </div>

              {sevResult !== null && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                    <span>مبلغ کل سنوات متعلقه:</span>
                    <span className="text-base font-black text-cyan-400">{formatNumber(sevResult)} تومان</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    بر مبنای ماده ۲۴ قانون کار (به ازای هر سال سابقه، یک ماه آخرین حقوق).
                  </p>
                </div>
              )}
            </div>

            {sevResult !== null && (
              <ReportSlipView 
                title="فیش رسمی محاسبه سنوات پایان خدمت"
                reference="ماده ۲۴ و ۳۱ قانون کار جمهوری اسلامی ایران"
                data={[
                  { label: 'روش محاسبه', value: sevMode === 'base' ? 'مزد مبنا/ثابت' : 'اقلام کامل (رأی دیوان عدالت اداری)' },
                  { label: 'حقوق مبنای محاسبه', value: `${formatNumber(sevMode === 'base' ? sevBaseSalary : sevBaseSalary + sevJobBonus + sevHardship)} تومان` },
                  { label: 'مدت کارکرد', value: `${sevMonths} ماه` },
                  { label: 'مبلغ قابل پرداخت سنوات', value: `${formatNumber(sevResult)} تومان`, highlight: true }
                ]}
                onGeneratePdf={handlePrintOrPdf}
                isGenerating={pdfGenerating}
              />
            )}
          </div>
        )}

        {/* --- ۳. ماژول مستمری بازنشستگی --- */}
        {activeTab === 'pension' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> محاسبه مستمری بازنشستگی
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">میانگین دستمزد ماهانه ۲ سال آخر (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={penAvgSalary ? penAvgSalary.toLocaleString() : ''}
                    onChange={(e) => setPenAvgSalary(sanitizeNumber(e.target.value))}
                    placeholder="مثال: ۱۵,۰۰۰,۰۰۰"
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
                  <p className="text-[10px] text-slate-500 mt-1">حداکثر سابقه قابل احتساب در ضریب ماده ۷۷، ۳۵ سال می‌باشد.</p>
                </div>

                <button
                  onClick={calculatePension}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20"
                >
                  محاسبه مستمری ماهانه
                </button>
              </div>

              {penResult !== null && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                    <span>مستمری برآوردی ماهانه:</span>
                    <span className="text-base font-black text-emerald-400">{formatNumber(penResult)} تومان</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    فرمول: (میانگین دستمزد ۲۴ ماه آخر × سنوات پرداخت حق بیمه) تقسیم بر ۳۰.
                  </p>
                </div>
              )}
            </div>

            {penResult !== null && (
              <ReportSlipView 
                title="برآورد رسمی مستمری بازنشستگی"
                reference="ماده ۷۷ قانون تأمین اجتماعی"
                data={[
                  { label: 'میانگین دستمزد ۲ سال آخر', value: `${formatNumber(penAvgSalary)} تومان` },
                  { label: 'سابقه مبنای محاسبه', value: `${penYears} سال` },
                  { label: 'ضریب محاسبه', value: `${penYears}/30` },
                  { label: 'مستمری ماهانه تقریبی', value: `${formatNumber(penResult)} تومان`, highlight: true }
                ]}
                onGeneratePdf={handlePrintOrPdf}
                isGenerating={pdfGenerating}
              />
            )}
          </div>
        )}

        {/* --- ۴. ماژول بیمه بیکاری --- */}
        {activeTab === 'unemployment' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                <UserMinus className="w-4 h-4" /> محاسبه مقرری بیمه بیکاری
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">متوسط مزد/حقوق ۹۰ روز قبل از بیکاری (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={unempAvgSalary ? unempAvgSalary.toLocaleString() : ''}
                    onChange={(e) => setUnempAvgSalary(sanitizeNumber(e.target.value))}
                    placeholder="مثال: ۱۲,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">تعداد افراد تحت تکفل (حداکثر ۴ نفر):</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={unempDependents}
                    onChange={(e) => setUnempDependents(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">به ازای هر نفر تحت تکفل ۱۰٪ اضافه می‌شود (تا سقف مجموع ۸۰٪ دستمزد).</p>
                </div>

                <button
                  onClick={calculateUnemployment}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-amber-600/20"
                >
                  محاسبه مقرری ماهانه
                </button>
              </div>

              {unempResult !== null && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>مقرری پایه (۵۵٪):</span>
                    <span>{formatNumber(unempResult.base)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>افزایش عائله‌مندی:</span>
                    <span>{formatNumber(unempResult.extra)} تومان</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-amber-400">
                    <span>مجموع مقرری ماهانه:</span>
                    <span className="text-base">{formatNumber(unempResult.total)} تومان</span>
                  </div>
                </div>
              )}
            </div>

            {unempResult !== null && (
              <ReportSlipView 
                title="فیش رسمی مقرری ماهانه بیمه بیکاری"
                reference="ماده ۷ قانون بیمه بیکاری"
                data={[
                  { label: 'متوسط دستمزد ۹۰ روز پایانی', value: `${formatNumber(unempAvgSalary)} تومان` },
                  { label: 'سهم پایه مقرری (۵۵٪)', value: `${formatNumber(unempResult.base)} تومان` },
                  { label: 'تعداد تحت تکفل و فوق‌العاده', value: `${unempDependents} نفر (${formatNumber(unempResult.extra)} تومان)` },
                  { label: 'مجموع خالص مقرری ماهانه', value: `${formatNumber(unempResult.total)} تومان`, highlight: true }
                ]}
                onGeneratePdf={handlePrintOrPdf}
                isGenerating={pdfGenerating}
              />
            )}
          </div>
        )}

        {/* --- ۵. ماژول حق بیمه --- */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> تفکیک سهم و نرخ‌های حق بیمه
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">نوع بیمه و نرخ مصوب:</label>
                  <select
                    value={insType}
                    onChange={(e) => setInsType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="labor">اجباری مشمولین قانون کار (۳۰٪ = ۷٪ کارگر + ۲۳٪ کارفرما)</option>
                    <option value="housewife_12">زنان خانه‌دار و مشاغل آزاد ۱۲٪ (بازنشستگی و فوت بعد بازنشستگی)</option>
                    <option value="housewife_14">زنان خانه‌دار و مشاغل آزاد ۱۴٪ (بازنشستگی و فوت قبل و بعد بازنشستگی)</option>
                    <option value="housewife_18">زنان خانه‌دار و مشاغل آزاد ۱۸٪ (کامل: بازنشستگی، فوت و ازکارافتادگی)</option>
                    <option value="optional_27">بیمه اختیاری ۲۷٪ (پوشش کامل خدمات درمانی و تعهدات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">دستمزد مبنای کسر حق بیمه (تومان):</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={insSalary ? insSalary.toLocaleString() : ''}
                    onChange={(e) => setInsSalary(sanitizeNumber(e.target.value))}
                    placeholder="مثال: ۱۱,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={calculateInsurance}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20"
                >
                  محاسبه سهم بیمه
                </button>
              </div>

              {insResult !== null && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>سهم بیمه‌شده ({insResult.workerRate}٪):</span>
                    <span className="font-bold text-indigo-400">{formatNumber(insResult.workerShare)} تومان</span>
                  </div>
                  {insResult.employerRate > 0 && (
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>سهم کارفرما ({insResult.employerRate}٪):</span>
                      <span>{formatNumber(insResult.employerShare)} تومان</span>
                    </div>
                  )}
                  {insResult.govRate > 0 && (
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>کمک دولت ({insResult.govRate}٪):</span>
                      <span>{formatNumber(insResult.govShare)} تومان</span>
                    </div>
                  )}
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                    <span>مجموع واریزی به تأمین اجتماعی:</span>
                    <span className="text-base text-cyan-400">{formatNumber(insResult.total)} تومان</span>
                  </div>
                </div>
              )}
            </div>

            {insResult !== null && (
              <ReportSlipView 
                title="گزارش تفکیکی محاسبه حق بیمه"
                reference="ماده ۲۸ قانون تأمین اجتماعی"
                data={[
                  { label: 'حقوق مبنای کسر حق بیمه', value: `${formatNumber(insSalary)} تومان` },
                  { label: `سهم بیمه‌شده (${insResult.workerRate}٪)`, value: `${formatNumber(insResult.workerShare)} تومان` },
                  { label: `سهم کارفرما (${insResult.employerRate}٪)`, value: `${formatNumber(insResult.employerShare)} تومان` },
                  { label: 'مجموع حق بیمه پرداختی', value: `${formatNumber(insResult.total)} تومان`, highlight: true }
                ]}
                onGeneratePdf={handlePrintOrPdf}
                isGenerating={pdfGenerating}
              />
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// کامپوننت فیش رسمی با طراحی متناسب برای خروجی چاپی و دانلود PDF
interface ReportSlipProps {
  title: string;
  reference: string;
  data: { label: string; value: string; highlight?: boolean }[];
  onGeneratePdf: () => void;
  isGenerating: boolean;
}

function ReportSlipView({ title, reference, data, onGeneratePdf, isGenerating }: ReportSlipProps) {
  return (
    <div className="space-y-3">
      {/* سند قابل پرینت / ذخیره */}
      <div 
        id="report-document" 
        className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200"
      >
        {/* سربرگ سازمانی فیش */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
          <div>
            <h4 className="text-base font-black text-slate-900">{title}</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">استناد قانونی: {reference}</p>
          </div>
          <div className="text-left text-[10px] text-slate-500 font-mono">
            <div>سامانه: دادکار</div>
            <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
          </div>
        </div>

        {/* جدول اقلام */}
        <div className="space-y-2 mb-6">
          {data.map((row, idx) => (
            <div 
              key={idx} 
              className={`flex justify-between items-center py-2 px-3 rounded-lg text-xs ${
                row.highlight 
                  ? 'bg-slate-100 font-black text-slate-950 border border-slate-300' 
                  : 'border-b border-slate-100 text-slate-700'
              }`}
            >
              <span>{row.label}</span>
              <span className="font-mono">{row.value}</span>
            </div>
          ))}
        </div>

        {/* سلب مسئولیت حقوقی */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed">
          <div className="flex items-center gap-1 font-bold text-slate-800 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-700" />
            <span>توجه و سلب مسئولیت قانونی:</span>
          </div>
          این برگه صرفاً یک شبیه‌سازی محاسباتی بر اساس مستندات ابرازی و مقررات جاری قانون کار و تأمین اجتماعی است و فاقد جنبه رأی قطعی یا سند ثبتی اداری تلقی می‌گردد.
        </div>
      </div>

      {/* دکمه عملیات صدور قطعی */}
      <button
        onClick={onGeneratePdf}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 text-cyan-400 font-bold py-3 rounded-xl text-xs transition-colors border border-cyan-500/30 shadow-lg shadow-black/40"
      >
        <Printer className="w-4 h-4" />
        <span>{isGenerating ? 'در حال تبدیل و ایجاد سند PDF...' : 'چاپ مستقیم یا ذخیره فیش (PDF)'}</span>
      </button>
    </div>
  );
}
