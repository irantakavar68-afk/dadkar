import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  HeartHandshake, 
  FileText, 
  Printer, 
  Copy, 
  Download, 
  RotateCcw, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';

// ==========================================
// توابع کمکی تبدیل و فرمت اعداد
// ==========================================
const toPersianDigits = (n: number | string): string => {
  if (n === null || n === undefined || n === '') return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fa-IR').format(Math.round(num));
};

const parsePersianOrFormattedNumber = (val: string): number => {
  if (!val) return 0;
  const standard = val
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/,/g, '')
    .replace(/،/g, '')
    .trim();
  const parsed = parseFloat(standard);
  return isNaN(parsed) ? 0 : parsed;
};

// ==========================================
// کامپوننت اصلی DadKar
// ==========================================
export default function DadKarApp() {
  const [activeTab, setActiveTab] = useState<'severance' | 'unemployment' | 'housewife' | 'receipt'>('severance');

  // نرخ‌های مبنا سال ۱۴۰۳ (قابل تغییر توسط کاربر)
  const [baseDailyWage, setBaseDailyWage] = useState<number>(2388728); // ریال
  const [housingAllowance, setHousingAllowance] = useState<number>(9000000); // بن و مسکن
  const [maritalBonus, setMaritalBonus] = useState<number>(5000000); // حق تاهل

  // ۱. متغیرهای سنوات و پاداش پایان خدمت
  const [sevYears, setSevYears] = useState<number>(1);
  const [sevMonths, setSevMonths] = useState<number>(0);
  const [sevDays, setSevDays] = useState<number>(0);
  const [lastMonthlySalary, setLastMonthlySalary] = useState<number>(71661840);
  const [unusedLeaveDays, setUnusedLeaveDays] = useState<number>(0);

  // ۲. متغیرهای بیمه بیکاری
  const [unempAvgSalary, setUnempAvgSalary] = useState<number>(85000000);
  const [dependentsCount, setDependentsCount] = useState<number>(0);
  const [insuranceRecordMonths, setInsuranceRecordMonths] = useState<number>(24);
  const [isMarried, setIsMarried] = useState<boolean>(false);

  // ۳. متغیرهای بیمه زنان خانه‌دار (سازمان تأمین اجتماعی)
  // ۱۲٪: بازنشستگی و فوت بعد از بازنشستگی
  // ۱۴٪: بازنشستگی و فوت قبل و بعد از بازنشستگی
  // ۱۸٪: بازنشستگی، فوت و ازکارافتادگی
  const [housewifeRate, setHousewifeRate] = useState<12 | 14 | 18>(14);
  const [housewifeBaseWage, setHousewifeBaseWage] = useState<number>(71661840);
  const [includeHealthInsurance, setIncludeHealthInsurance] = useState<boolean>(true);
  const healthInsuranceFixedCost = 1195000; // سرانه درمان مصوب به ریال

  // اعلان کپی شدن
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // تغییر دهنده هوشمند ورودی‌های مبالغ
  const handleMoneyInputChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setter(0);
      return;
    }
    const parsed = parsePersianOrFormattedNumber(raw);
    setter(parsed);
  };

  // ------------------------------------------
  // محاسبات سنوات (ماده ۲۴ قانون کار)
  // ------------------------------------------
  const severanceResults = useMemo(() => {
    const totalDaysWorked = (sevYears * 365) + (sevMonths * 30) + sevDays;
    const dailyWage = lastMonthlySalary / 30;
    
    // حق سنوات = (کارکرد کل روزانه / ۳۶۵) * آخرین حقوق ماهیانه
    const baseSeverance = (totalDaysWorked / 365) * lastMonthlySalary;
    
    // بازخرید مانده مرخصی (ماده ۶۶ و ۷۱ قانون کار)
    const unusedLeavePay = unusedLeaveDays * dailyWage;
    
    // پاداش و عیدی مصوب (۶۰ روز حقوق پایه به ازای هر سال کارکرد مشروط به عدم تجاوز از ۹۰ روز حداقل دستمزد)
    const annualBonus = (totalDaysWorked / 365) * (lastMonthlySalary * 2);

    return {
      totalDaysWorked,
      baseSeverance,
      unusedLeavePay,
      annualBonus,
      totalPayable: baseSeverance + unusedLeavePay
    };
  }, [sevYears, sevMonths, sevDays, lastMonthlySalary, unusedLeaveDays]);

  // ------------------------------------------
  // محاسبات بیمه بیکاری (قانون بیمه بیکاری ماده ۷)
  // ------------------------------------------
  const unemploymentResults = useMemo(() => {
    // ۵۵ درصد متوسط مزد یا حقوق روزانه (متوسط ۹۰ روز آخر)
    let benefitPercentage = 0.55;
    // به ازای هر تکفل ۱۰ درصد (حداکثر تا ۴ نفر یعنی حداکثر ۴۰ درصد مازاد مشروط به سقف ۸۰ درصد)
    const depBonus = Math.min(dependentsCount, 4) * 0.10;
    benefitPercentage += depBonus;

    if (benefitPercentage > 0.80) benefitPercentage = 0.80;

    let calculatedMonthly = unempAvgSalary * benefitPercentage;
    const legalMinWage = 71661840; // حداقل دستمزد سال جاری

    // مقرری نباید از حداقل دستمزد کمتر باشد
    if (calculatedMonthly < legalMinWage) {
      calculatedMonthly = legalMinWage;
    }

    // تعیین مدت زمان دریافت مقرری بر اساس سابقه و تاهل (جدول ماده ۷)
    let maxDurationMonths = 0;
    if (insuranceRecordMonths >= 6 && insuranceRecordMonths <= 24) {
      maxDurationMonths = isMarried ? 12 : 6;
    } else if (insuranceRecordMonths >= 25 && insuranceRecordMonths <= 120) {
      maxDurationMonths = isMarried ? 18 : 12;
    } else if (insuranceRecordMonths >= 121 && insuranceRecordMonths <= 180) {
      maxDurationMonths = isMarried ? 26 : 14;
    } else if (insuranceRecordMonths >= 181 && insuranceRecordMonths <= 240) {
      maxDurationMonths = isMarried ? 36 : 18;
    } else if (insuranceRecordMonths > 240) {
      maxDurationMonths = isMarried ? 50 : 36;
    }

    return {
      monthlyBenefit: calculatedMonthly,
      maxDurationMonths,
      totalExpectedBenefit: calculatedMonthly * maxDurationMonths
    };
  }, [unempAvgSalary, dependentsCount, insuranceRecordMonths, isMarried]);

  // ------------------------------------------
  // محاسبات بیمه زنان خانه‌دار
  // ------------------------------------------
  const housewifeResults = useMemo(() => {
    // سهم بیمه متقاضی بر اساس نرخ انتخابی (۱۲٪، ۱۴٪، ۱۸٪)
    // دولت نیز ۲٪ کمک نقدی مطابق ضوابط پرداخت می‌نماید
    const pensionShare = housewifeBaseWage * (housewifeRate / 100);
    const healthShare = includeHealthInsurance ? healthInsuranceFixedCost : 0;
    const totalMonthly = pensionShare + healthShare;

    let coverageDescription = '';
    if (housewifeRate === 12) {
      coverageDescription = 'شامل بازنشستگی و فوت پس از دوران بازنشستگی (مناسب افراد بدون افراد تحت تکفل)';
    } else if (housewifeRate === 14) {
      coverageDescription = 'شامل بازنشستگی و پرداخت مستمری فوت قبل و بعد از بازنشستگی به بازماندگان';
    } else {
      coverageDescription = 'کامل‌ترین پوشش: بازنشستگی، فوت قبل و بعد از بازنشستگی، و ازکارافتادگی کلی';
    }

    return {
      pensionShare,
      healthShare,
      totalMonthly,
      coverageDescription
    };
  }, [housewifeRate, housewifeBaseWage, includeHealthInsurance]);

  // ------------------------------------------
  // ساخت متن فیش برای ذخیره، کپی و چاپ
  // ------------------------------------------
  const receiptText = useMemo(() => {
    const now = new Date().toLocaleDateString('fa-IR');
    let content = `=====================================\n`;
    content += `        فیش محاسبات رسمی «دادکار»       \n`;
    content += `         تاریخ محاسبه: ${now}         \n`;
    content += `=====================================\n\n`;

    if (activeTab === 'severance') {
      content += `[ گزارش محاسبه سنوات و مطالبات کارگری ]\n`;
      content += `سابقه کارکرد: ${sevYears} سال و ${sevMonths} ماه و ${sevDays} روز\n`;
      content += `آخرین حقوق مبنا: ${formatNumber(lastMonthlySalary)} ریال\n`;
      content += `مانده مرخصی: ${unusedLeaveDays} روز\n`;
      content += `-------------------------------------\n`;
      content += `مبلغ سنوات پایان خدمت: ${formatNumber(severanceResults.baseSeverance)} ریال\n`;
      content += `مبلغ مانده مرخصی: ${formatNumber(severanceResults.unusedLeavePay)} ریال\n`;
      content += `پاداش سنواتی تقریبی: ${formatNumber(severanceResults.annualBonus)} ریال\n`;
      content += `-------------------------------------\n`;
      content += `جمع کل مطالبات سنوات و مرخصی: ${formatNumber(severanceResults.totalPayable)} ریال\n`;
    } else if (activeTab === 'unemployment') {
      content += `[ گزارش محاسبه مقرری بیمه بیکاری ]\n`;
      content += `متوسط دستمزد مبنا: ${formatNumber(unempAvgSalary)} ریال\n`;
      content += `سابقه بیمه: ${insuranceRecordMonths} ماه (${(insuranceRecordMonths / 12).toFixed(1)} سال)\n`;
      content += `وضعیت تاهل / تکفل: ${isMarried ? 'متاهل' : 'مجرد'} (${dependentsCount} نفر تحت تکفل)\n`;
      content += `-------------------------------------\n`;
      content += `مقرری مصوب ماهیانه: ${formatNumber(unemploymentResults.monthlyBenefit)} ریال\n`;
      content += `حداکثر طول دوره پرداخت: ${unemploymentResults.maxDurationMonths} ماه\n`;
      content += `کل عایدی پیش‌بینی شده: ${formatNumber(unemploymentResults.totalExpectedBenefit)} ریال\n`;
    } else if (activeTab === 'housewife') {
      content += `[ گزارش حق بیمه زنان خانه‌دار تأمین اجتماعی ]\n`;
      content += `دستمزد انتخابی ماهانه: ${formatNumber(housewifeBaseWage)} ریال\n`;
      content += `نرخ انتخابی بیمه: ${toPersianDigits(housewifeRate)} درصد\n`;
      content += `خدمات درمانی سرانه: ${includeHealthInsurance ? 'فعال' : 'غیرفعال'}\n`;
      content += `-------------------------------------\n`;
      content += `سهم بازنشستگی/مستمری: ${formatNumber(housewifeResults.pensionShare)} ریال\n`;
      content += `سهم سرانه درمان: ${formatNumber(housewifeResults.healthShare)} ریال\n`;
      content += `-------------------------------------\n`;
      content += `مبلغ نهایی پرداختی در ماه: ${formatNumber(housewifeResults.totalMonthly)} ریال\n`;
      content += `پوشش: ${housewifeResults.coverageDescription}\n`;
    }

    content += `\n=====================================\n`;
    content += `محاسبه شده با دادکار (منطبق با قوانین کار و تامین اجتماعی)\n`;
    return content;
  }, [
    activeTab, 
    sevYears, 
    sevMonths, 
    sevDays, 
    lastMonthlySalary, 
    unusedLeaveDays, 
    severanceResults, 
    unempAvgSalary, 
    insuranceRecordMonths, 
    isMarried, 
    dependentsCount, 
    unemploymentResults, 
    housewifeBaseWage, 
    housewifeRate, 
    includeHealthInsurance, 
    housewifeResults
  ]);

  // اکشن کپی به کلیپ‌بورد
  const handleCopyReceipt = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(receiptText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = receiptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch {
      alert('خطا در کپی متن. متن را به صورت دستی کپی کنید.');
    }
  };

  // اکشن دانلود به عنوان فایل txt
  const handleDownloadReceipt = () => {
    const element = document.createElement("a");
    const file = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `DadKar_Receipt_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // اکشن چاپ فیش با مکانیزم ضد کرش وب‌ویو اندروید
  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('پنجره چاپ مسدود شد. از دکمه کپی فیش استفاده کنید.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8">
        <title>فیش دادکار</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 25px; line-height: 1.8; color: #1e293b; }
          .container { border: 2px dashed #94a3b8; padding: 20px; border-radius: 12px; max-width: 500px; margin: 0 auto; }
          h2 { text-align: center; color: #0f172a; margin-top: 0; }
          pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; background: #f8fafc; padding: 15px; border-radius: 8px; }
          .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>سامانه دادکار - نتیجه محاسبات</h2>
          <pre>${receiptText}</pre>
          <div class="footer">تولید شده توسط نرم‌افزار دادکار</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* هدر بالایی با افکت نئونی ملایم */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                دادکار <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">نسخه حرفه‌ای</span>
              </h1>
              <p className="text-xs text-slate-400">مرجع هوشمند محاسبات قانون کار و تأمین اجتماعی</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('receipt')}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>مشاهده فیش</span>
          </button>
        </div>
      </header>

      {/* ناوبری تب‌ها (پویا و مینیمال) */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('severance')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === 'severance'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>سنوات و مرخصی</span>
          </button>

          <button
            onClick={() => setActiveTab('unemployment')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === 'unemployment'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>بیمه بیکاری</span>
          </button>

          <button
            onClick={() => setActiveTab('housewife')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === 'housewife'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>بیمه زنان خانه‌دار</span>
          </button>
        </div>
      </div>

      {/* بدنه اصلی فرم‌ها و کارت‌ها */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1 flex flex-col gap-6">

        {/* ======================================================== */}
        {/* ۱. تب سنوات و پایان خدمت */}
        {/* ======================================================== */}
        {activeTab === 'severance' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            {/* ورودی‌ها */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    مدت سابقه کاری مشمول
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">سال</label>
                    <input 
                      type="number" 
                      min="0"
                      value={sevYears || ''}
                      onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-center outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">ماه</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="11"
                      value={sevMonths || ''}
                      onChange={(e) => setSevMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-center outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">روز</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="29"
                      value={sevDays || ''}
                      onChange={(e) => setSevDays(Math.max(0, Math.min(29, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm text-center outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-400 block mb-1.5">آخرین حقوق ماهیانه ثابت / مبنا (ریال)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formatNumber(lastMonthlySalary)}
                      onChange={handleMoneyInputChange(setLastMonthlySalary)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm text-left font-mono tracking-wider outline-none transition pl-10"
                    />
                    <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    معادل: {toPersianDigits(formatNumber(Math.round(lastMonthlySalary / 10)))} تومان
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">تعداد روزهای مرخصی ذخیره (استفاده‌نشده)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={unusedLeaveDays || ''}
                    onChange={(e) => setUnusedLeaveDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm outline-none transition"
                    placeholder="مثلاً ۹ روز"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">حداکثر سقف مجاز انتقال مرخصی هر سال ۹ روز طبق ماده ۶۶ قانون کار است.</p>
                </div>
              </div>
            </div>

            {/* کارت خلاصه نتایج سنوات */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">جمع کل سنوات و مطالبات</span>
                  <div className="text-2xl font-black text-white mt-1 mb-4 font-mono">
                    {formatNumber(severanceResults.totalPayable)} <span className="text-xs font-normal text-slate-400">ریال</span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>حق سنوات خدمت:</span>
                      <span className="font-mono font-medium">{formatNumber(severanceResults.baseSeverance)} ریال</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>بازخرید مانده مرخصی:</span>
                      <span className="font-mono font-medium">{formatNumber(severanceResults.unusedLeavePay)} ریال</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>پاداش و عیدی تقریبی سالانه:</span>
                      <span className="font-mono font-medium text-cyan-300">{formatNumber(severanceResults.annualBonus)} ریال</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex gap-2">
                  <button 
                    onClick={() => setActiveTab('receipt')}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2.5 text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    صدور و پرینت فیش نهایی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۲. تب بیمه بیکاری */}
        {/* ======================================================== */}
        {activeTab === 'unemployment' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">متوسط دستمزد روزانه/ماهانه ۹۰ روز آخر (ریال)</label>
                  <input 
                    type="text" 
                    value={formatNumber(unempAvgSalary)}
                    onChange={handleMoneyInputChange(setUnempAvgSalary)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm font-mono tracking-wider outline-none transition"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    معادل: {toPersianDigits(formatNumber(Math.round(unempAvgSalary / 10)))} تومان
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">سابقه پرداخت حق بیمه (بر حسب ماه)</label>
                  <input 
                    type="number" 
                    min="6"
                    value={insuranceRecordMonths || ''}
                    onChange={(e) => setInsuranceRecordMonths(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm outline-none transition"
                    placeholder="مثلاً ۲۴ ماه"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداقل سابقه الزامی ۶ ماه است.
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300">وضعیت تاهل یا سرپرستی خانواده:</span>
                  <button
                    type="button"
                    onClick={() => setIsMarried(!isMarried)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isMarried 
                        ? 'bg-cyan-950 border-cyan-700 text-cyan-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {isMarried ? 'متاهل / متکفل' : 'مجرد'}
                  </button>
                </div>

                {isMarried && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">تعداد افراد تحت تکفل (حداکثر ۴ نفر)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="4"
                      value={dependentsCount}
                      onChange={(e) => setDependentsCount(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm outline-none transition"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      به ازای هر نفر ۱۰٪ اضافه می‌گردد (تا سقف مقرر در قانون بیمه بیکاری).
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* کارت نتایج بیکاری */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">مقرری مصوب ماهیانه</span>
                  <div className="text-2xl font-black text-white mt-1 mb-2 font-mono">
                    {formatNumber(unemploymentResults.monthlyBenefit)} <span className="text-xs font-normal text-slate-400">ریال</span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>مدت پرداخت مقرری:</span>
                      <span className="font-mono font-bold text-cyan-400">{unemploymentResults.maxDurationMonths} ماه</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>کل دریافتی در طول دوره:</span>
                      <span className="font-mono font-medium">{formatNumber(unemploymentResults.totalExpectedBenefit)} ریال</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex gap-2">
                  <button 
                    onClick={() => setActiveTab('receipt')}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2.5 text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    صدور و پرینت فیش نهایی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۳. تب بیمه زنان خانه‌دار */}
        {/* ======================================================== */}
        {activeTab === 'housewife' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">انتخاب نرخ بیمه زنان خانه‌دار (مصوب تأمین اجتماعی)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { rate: 12, label: '۱۲ درصد', sub: 'بازنشستگی و فوت پس از آن' },
                      { rate: 14, label: '۱۴ درصد', sub: 'فوت قبل و بعد بازنشستگی' },
                      { rate: 18, label: '۱۸ درصد', sub: 'کامل + ازکارافتادگی' }
                    ].map((item) => (
                      <button
                        key={item.rate}
                        type="button"
                        onClick={() => setHousewifeRate(item.rate as 12 | 14 | 18)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          housewifeRate === item.rate 
                            ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="font-bold text-sm">{item.label}</span>
                        <span className="text-[10px] leading-tight text-slate-400">{item.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">مبنای دستمزد انتخابی ماهانه (ریال)</label>
                  <input 
                    type="text" 
                    value={formatNumber(housewifeBaseWage)}
                    onChange={handleMoneyInputChange(setHousewifeBaseWage)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-sm font-mono tracking-wider outline-none transition"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    حداقل دستمزد مصوب سال جاری یا میانگین دلخواه طبق بخشنامه تأمین اجتماعی.
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-200 block">پوشش درمان (دفترچه درمانی)</span>
                    <span className="text-[11px] text-slate-500">
                      سرانه مصوب ماهانه درمان: {formatNumber(healthInsuranceFixedCost)} ریال
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeHealthInsurance(!includeHealthInsurance)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      includeHealthInsurance 
                        ? 'bg-cyan-950 border-cyan-700 text-cyan-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {includeHealthInsurance ? 'فعال' : 'غیرفعال'}
                  </button>
                </div>
              </div>
            </div>

            {/* کارت نتایج زنان خانه‌دار */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">حق بیمه ماهیانه پرداختی</span>
                  <div className="text-2xl font-black text-white mt-1 mb-2 font-mono">
                    {formatNumber(housewifeResults.totalMonthly)} <span className="text-xs font-normal text-slate-400">ریال</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {housewifeResults.coverageDescription}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>سهم بازنشستگی و فوت:</span>
                      <span className="font-mono font-medium">{formatNumber(housewifeResults.pensionShare)} ریال</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>سرانه درمان:</span>
                      <span className="font-mono font-medium">{formatNumber(housewifeResults.healthShare)} ریال</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex gap-2">
                  <button 
                    onClick={() => setActiveTab('receipt')}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2.5 text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    صدور و پرینت فیش نهایی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ۴. تب فیش محاسبات رسمی (بدون نیاز به پاپ‌آپ مسدود شونده) */}
        {/* ======================================================== */}
        {activeTab === 'receipt' && (
          <div className="max-w-2xl mx-auto w-full space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="font-bold text-base text-white">فیش رسمی محاسبات دادکار</h3>
                  <p className="text-xs text-slate-400">آماده برای چاپ، خروجی متنی و نگهداری اسناد</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReceipt}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    title="کپی در کلیپ‌بورد"
                  >
                    <Copy className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={handleDownloadReceipt}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    title="دانلود فایل متن"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={handlePrintReceipt}
                    className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-lg shadow-cyan-600/30"
                    title="پرینت مستقیم"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* پیش‌نمایش برگه فیش */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {receiptText}
              </div>

              {copiedNotification && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-slate-950 font-bold px-4 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  متن فیش با موفقیت کپی شد
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setActiveTab('severance')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  بازگشت به بخش محاسبات
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* فوتر مینیمال */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-[11px] text-slate-600">
        سامانه حقوق و دستمزد و تأمین اجتماعی دادکار &bull; منطبق بر آخرین بخشنامه‌ها
      </footer>
    </div>
  );
}
