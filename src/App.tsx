import React, { useState, useMemo, useEffect } from "react";
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
  AlertCircle
} from "lucide-react";
import { LAWS_DATABASE, LawItem } from "./lawsData";

// --- Types ---
type TabType = "calc" | "laws" | "faq" | "templates";
type CalcType = "severance" | "overtime" | "shift" | "leave" | "night" | "sanavat";

export default function DadKarApp() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>("calc");
  const [activeCalc, setActiveCalc] = useState<CalcType>("severance");

  // Calculator States
  const [baseSalary, setBaseSalary] = useState<number>(100000000); // 10 million Toman
  const [years, setYears] = useState<number>(1);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10);
  const [shiftType, setShiftType] = useState<"morning-evening" | "morning-night" | "evening-night" | "rotational">("morning-evening");
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(5);

  // Laws Library States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayLimit, setDisplayLimit] = useState<number>(25);

  // FAQ States
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState("");

  // Template Search State
  const [templateSearch, setTemplateSearch] = useState("");

  // Reset display limit when search or category changes to preserve UI responsiveness
  useEffect(() => {
    setDisplayLimit(25);
  }, [searchQuery, selectedCategory]);

  // Format numbers to IRR currency style
  const formatToman = (amount: number) => {
    return Math.round(amount).toLocaleString("fa-IR") + " ریال";
  };

  // --- Calculations Logic ---
  const calculations = useMemo(() => {
    const dailyWage = baseSalary / 30;
    const hourlyWage = baseSalary / 220; // Standard 220 hours per month in Iran Labor Law

    // 1. حق سنوات (پایان کار)
    const totalDays = (years * 365) + (months * 30) + days;
    const severancePay = (dailyWage * 30) * (totalDays / 365);

    // 2. اضافه‌کاری (40% مازاد بر مزد ساعت)
    const overtimeHourlyRate = hourlyWage * 1.4;
    const overtimePay = overtimeHourlyRate * hours;

    // 3. نوبت‌کاری
    let shiftMultiplier = 0.1; // صبح و عصر 10%
    if (shiftType === "morning-night") shiftMultiplier = 0.225; // صبح و شب 22.5%
    if (shiftType === "evening-night") shiftMultiplier = 0.225; // عصر و شب 22.5%
    if (shiftType === "rotational") shiftMultiplier = 0.15; // صبح، عصر و شب 15%
    const shiftPay = baseSalary * shiftMultiplier;

    // 4. مانده مرخصی (بر اساس مزد روزانه و سنوات حق مسکن/بن به ازای هر روز مرخصی استفاده نشده)
    const leavePay = dailyWage * unworkedLeaveDays;

    // 5. شب‌کاری (35% مازاد بر مزد ساعت عادی برای کارگران غیرنوبتی)
    const nightHourlyRate = hourlyWage * 0.35;
    const nightPay = nightHourlyRate * hours;

    // 6. پایه سنوات (تجمیع سنوات تجمیعی ماهانه بر اساس سال اشتغال)
    const sanavatMonthlyBase = 2100000; // پایه سنوات روزانه 70,000 ریال به طور تقریبی ماهانه 2,100,000 ریال
    const totalSanavat = years > 0 ? (sanavatMonthlyBase * years) : 0;

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
      totalSanavat
    };
  }, [baseSalary, years, months, days, hours, shiftType, unworkedLeaveDays]);

  // --- FAQ Data ---
  const FAQ_DATABASE = [
    {
      id: "f1",
      category: "severance",
      question: "آیا به کارگر با قرارداد کمتر از یک سال حق سنوات تعلق می‌گیرد؟",
      answer: "بله، طبق ماده ۲۴ قانون کار و آرای وحدت رویه دیوان عدالت اداری، کارگر به نسبت مدت کارکرد خود در طول سال، استحقاق دریافت سنوات پایان خدمت بر مبنای آخرین مزد دریافتی را دارد.",
      lawRef: "ماده ۲۴ قانون کار و دادنامه ۱۶۸ دیوان عدالت اداری"
    },
    {
      id: "f2",
      category: "contracts",
      question: "آیا کارفرما می‌تواند تسویه‌حساب سفید امضا بگیرد؟",
      answer: "خیر، طبق دادنامه ۱۲۴۳ هیات عمومی دیوان عدالت اداری، برگه‌های تسویه‌حساب صوری، کلی و سفیدامضا فاقد اعتبار قانونی بوده و بدون ارائه اسناد مثبته واریز بانکی پذیرفته نمی‌شوند.",
      lawRef: "دادنامه ۱۲۴۳ دیوان عدالت اداری"
    },
    {
      id: "f3",
      category: "tamin",
      question: "مهلت مراجعه برای دریافت مقرری بیمه بیکاری چقدر است؟",
      answer: "بیمه‌شده بیکار مکلف است ظرف حداکثر ۳۰ روز از تاریخ بیکاری غیرارادی مراتب را به اداره تعاون، کار و رفاه اجتماعی اعلام کند. پس از ۳۰ روز با عذر موجه و تایید هیات حل اختلاف تا ۳ ماه امکان‌پذیر است.",
      lawRef: "ماده ۶ قانون بیمه بیکاری"
    },
    {
      id: "f4",
      category: "leave",
      question: "میزان مرخصی استحقاقی سالانه و سقف ذخیره آن چقدر است؟",
      answer: "مرخصی استحقاقی سالانه ۲۶ روز کاری (یک ماه با احتساب ۴ جمعه) است. طبق ماده ۶۶ قانون کار، کارگر نمی‌تواند بیش از ۹ روز از مرخصی سالانه خود را برای سال بعد ذخیره کند.",
      lawRef: "مواد ۶۴ و ۶۶ قانون کار"
    },
    {
      id: "f5",
      category: "overtime",
      question: "حداکثر سقف مجاز اضافه‌کاری در قانون کار چقدر است؟",
      answer: "طبق ماده ۵۹ قانون کار، ارجاع کار اضافی با رضایت کارگر و پرداخت ۴۰ درصد فوق‌العاده مجاز است و مدت آن نباید از ۴ ساعت در روز تجاوز کند (مگر در موارد استثنایی کارگاه).",
      lawRef: "ماده ۵۹ قانون کار"
    }
  ];

  // --- Templates Data ---
  const TEMPLATES_DATABASE = [
    {
      id: "t1",
      title: "قرارداد کار موقت (استاندارد وزارت کار)",
      description: "فرمت استاندارد شامل مشخصات طرفین، مدت، موضوع قرارداد، حقوق و مزایا مطابق با ماده ۱۰ قانون کار.",
      tags: ["قرارداد", "کار موقت", "استخدام"],
      content: `بسمه تعالی
قرارداد کار موقت
این قرارداد به موجب ماده (۱۰) قانون کار جمهوری اسلامی ایران منعقد می‌گردد:
۱. مشخصات طرفین:
کارفرما: .................... فرزند: .................... کد ملی: .................... نشانی: ....................
کارگر: .................... فرزند: .................... کد ملی: .................... نشانی: ....................
۲. نوع قرارداد: موقت از تاریخ ............ لغایت ............ به مدت ............ ماه/سال.
۳. موضوع کار: اشتغال در سمت/شغل .................... با شرح وظایف ابلاغی کارگاه.
۴. ساعات کار: طبق مقررات ماده ۵۱ قانون کار ۴۴ ساعت در هفته.
۵. مزد و مزایا:
- مزد روزانه/ماهانه: .................... ریال
- حق مسکن و بن خواربار: طبق مصوبات شورای عالی کار
- پایه سنوات: مطابق مقررات اداره کار
این قرارداد در ۲ نسخه تنظیم و به امضای طرفین رسید.`
    },
    {
      id: "t2",
      title: "فرم دادخواست مطالبه مطالبات و حق بیمه (اداره کار)",
      description: "متن نمونه جهت ثبت دادخواست در سامانه جامع روابط کار برای دریافت معوقات مزدی، سنوات و الزام به بیمه.",
      tags: ["دادخواست", "شکایت", "معوقات", "حق بیمه"],
      content: `ریاست محترم اداره تعاون، کار و رفاه اجتماعی / هیات تشخیص
با سلام و احترام؛
اینجانب .................... کد ملی .................... از تاریخ ............ تا تاریخ ............ در کارگاه .................... متعلق به آقای/شرکت .................... در سمت .................... اشتغال به کار داشته‌ام.
با توجه به اینکه کارفرمای محترم از پرداخت مطالبات قانونی بنده استنکاف نموده، تقاضای رسیدگی و صدور حکم مبنی بر:
۱. پرداخت حقوق و مزایای معوقه از تاریخ ............ لغایت ............
۲. پرداخت حق سنوات پایان خدمت و مانده مرخصی استفاده نشده
۳. الزام کارفرما به واریز حق بیمه معوقه به سازمان تامین اجتماعی بر اساس ماده ۱۴۸ قانون کار
مستدعی است. مدارک شامل پرینت بانکی و شهادت همکاران ضمیمه می‌گردد.`
    },
    {
      id: "t3",
      title: "برگه تسویه‌حساب نهایی قانونی (مبتنی بر تراکنش بانکی)",
      description: "فرم قطعی تسویه خاتمه همکاری با تصریح جزئیات مبالغ واریز شده به حساب بانکی کارگر.",
      tags: ["تسویه حساب", "خاتمه کار", "بانکی"],
      content: `برگه تسویه‌حساب قطعی مالی پایان خدمت
نام و نام خانوادگی: .................... شماره بیمه: .................... تاریخ خاتمه قرارداد: ....................
بدین‌وسیله تایید می‌گردد کلیه مطالبات قانونی اینجانب شامل:
۱. مزد و مزایای معوقه: .................... ریال
۲. حق سنوات پایان خدمت: .................... ریال
۳. مانده مرخصی: .................... ریال
۴. پاداش و عیدی پایان سال: .................... ریال
جمع کل به مبلغ .................... ریال به موجب شماره تراکنش بانکی / فیش پیوست شماره ............ به حساب اینجانب نزد بانک ............ واریز گردیده و رابطه کاری در این تاریخ با رضایت کامل خاتمه یافت.`
    }
  ];

  // Filtering Laws with Memo
  const filteredLaws = useMemo(() => {
    return LAWS_DATABASE.filter((law: LawItem) => {
      const matchesCategory = selectedCategory === "all" || law.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === "" || 
        law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Filtering FAQ with Memo
  const filteredFaq = useMemo(() => {
    return FAQ_DATABASE.filter(f => {
      const matchCat = faqCategory === "all" || f.category === faqCategory;
      const matchQuery = faqSearch.trim() === "" ||
        f.question.includes(faqSearch) ||
        f.answer.includes(faqSearch) ||
        f.lawRef.includes(faqSearch);
      return matchCat && matchQuery;
    });
  }, [faqCategory, faqSearch]);

  // Filtering Templates with Memo
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATABASE.filter(t => {
      return templateSearch.trim() === "" ||
        t.title.includes(templateSearch) ||
        t.description.includes(templateSearch) ||
        t.tags.some(tag => tag.includes(templateSearch));
    });
  }, [templateSearch]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-24" dir="rtl">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-800 tracking-tight">دادکار</h1>
              <p className="text-xs text-slate-500 font-medium">دستیار تخصصی قوانین کار، سنوات و تأمین اجتماعی</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نسخه ۳.۰</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-5">
        
        {/* ===================== TAB 1: CALCULATOR ===================== */}
        {activeTab === "calc" && (
          <div className="space-y-5">
            {/* Calculator Navigation Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-200">
              {[
                { id: "severance", label: "حق سنوات" },
                { id: "overtime", label: "اضافه‌کاری" },
                { id: "shift", label: "نوبت‌کاری" },
                { id: "leave", label: "مانده مرخصی" },
                { id: "night", label: "شب‌کاری" },
                { id: "sanavat", label: "پایه سنوات" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCalc(c.id as CalcType)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                    activeCalc === c.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Base Salary Input Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  مزد ماهانه (پایه + مزایای مستمر به ریال):
                </label>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {formatToman(baseSalary)}
                </span>
              </div>
              <input
                type="range"
                min={50000000}
                max={500000000}
                step={5000000}
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">مزد روزانه (۳۰ روز):</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">{formatToman(calculations.dailyWage)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">مزد ساعتی (۲۲۰ ساعت):</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">{formatToman(calculations.hourlyWage)}</div>
                </div>
              </div>
            </div>

            {/* Calculation Context View */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
              {/* 1. SEVERANCE */}
              {activeCalc === "severance" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b pb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    محاسبه پاداش پایان خدمت (حق سنوات ماده ۲۴)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">تعداد سال:</label>
                      <input
                        type="number"
                        min="0"
                        value={years}
                        onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2.5 border rounded-xl font-bold text-center bg-slate-50 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">تعداد ماه:</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={months}
                        onChange={(e) => setMonths(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2.5 border rounded-xl font-bold text-center bg-slate-50 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">تعداد روز:</label>
                      <input
                        type="number"
                        min="0"
                        max="29"
                        value={days}
                        onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2.5 border rounded-xl font-bold text-center bg-slate-50 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-xs text-blue-700 font-semibold">مبلغ کل سنوات استحقاقی:</span>
                    <span className="text-2xl font-black text-blue-900">{formatToman(calculations.severancePay)}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    * استناد به ماده ۲۴ قانون کار و دادنامه ۲۲۷ دیوان عدالت اداری: سنوات به ازای هر سال معادل یک ماه آخرین حقوق محاسبه شده و به ماه‌های کارکرد نیز متناسباً تعلق می‌گیرد.
                  </p>
                </div>
              )}

              {/* 2. OVERTIME */}
              {activeCalc === "overtime" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b pb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    محاسبه اضافه‌کاری (ماده ۵۹ قانون کار)
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">ساعات اضافه‌کاری انجام شده:</label>
                    <input
                      type="number"
                      min="1"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-xs text-emerald-700 font-semibold">مبلغ فوق‌العاده اضافه‌کاری:</span>
                    <span className="text-2xl font-black text-emerald-900">{formatToman(calculations.overtimePay)}</span>
                    <span className="text-[11px] text-emerald-600 mt-1">نرخ هر ساعت اضافه‌کاری: {formatToman(calculations.overtimeHourlyRate)}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    * طبق قانون کار، برای هر ساعت اضافه‌کاری ۴۰ درصد فوق‌العاده مازاد بر مزد هر ساعت عادی به کارگر تعلق می‌گیرد (نرخ ضریب ۱.۴).
                  </p>
                </div>
              )}

              {/* 3. SHIFT */}
              {activeCalc === "shift" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b pb-3">
                    <Layers className="w-5 h-5 text-blue-600" />
                    محاسبه نوبت‌کاری (ماده ۵۶ قانون کار)
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">نوع گردش شیفت کاری:</label>
                    <select
                      value={shiftType}
                      onChange={(e: any) => setShiftType(e.target.value)}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50 text-slate-800"
                    >
                      <option value="morning-evening">صبح و عصر (۱۰ درصد فوق‌العاده)</option>
                      <option value="rotational">صبح، عصر و شب (۱۵ درصد فوق‌العاده)</option>
                      <option value="morning-night">صبح و شب (۲۲.۵ درصد فوق‌العاده)</option>
                      <option value="evening-night">عصر و شب (۲۲.۵ درصد فوق‌العاده)</option>
                    </select>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-xs text-purple-700 font-semibold">فوق‌العاده نوبت‌کاری ماهانه ({calculations.shiftMultiplier}٪):</span>
                    <span className="text-2xl font-black text-purple-900">{formatToman(calculations.shiftPay)}</span>
                  </div>
                </div>
              )}

              {/* 4. LEAVE */}
              {activeCalc === "leave" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b pb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    محاسبه بازخرید مانده مرخصی (ماده ۶۴ و ۶۶)
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">تعداد روزهای مانده مرخصی استفاده نشده:</label>
                    <input
                      type="number"
                      min="0"
                      value={unworkedLeaveDays}
                      onChange={(e) => setUnworkedLeaveDays(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-xs text-amber-700 font-semibold">مبلغ بازخرید مانده مرخصی:</span>
                    <span className="text-2xl font-black text-amber-900">{formatToman(calculations.leavePay)}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    * حداکثر میزان ذخیره قانونی مرخصی برای انتقال به سال بعد بر طبق ماده ۶۶ قانون کار ۹ روز است.
                  </p>
                </div>
              )}

              {/* 5. NIGHT WORK */}
              {activeCalc === "night" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b pb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    محاسبه شب‌کاری (ماده ۵۸ قانون کار)
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">تعداد ساعات کار در بازه شب (۲۲:۰۰ الی ۰۶:۰۰):</label>
                    <input
                      type="number"
                      min="1"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-xs text-indigo-700 font-semibold">فوق‌العاده شب‌کاری (۳۵٪):</span>
                    <span className="text-2xl font-black text-indigo-900">{formatToman(calculations.nightPay)}</span>
                  </div>
                </div>
              )}

              {/* 6. SANAVAT BASE */}
              {activeCalc === "sanavat" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b pb-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    محاسبه پایه سنوات تجمیعی ماهانه
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">تعداد سال‌های سابقه کار در این کارگاه:</label>
                    <input
                      type="number"
                      min="0"
                      value={years}
                      onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 border rounded-xl font-bold bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-1">
                    <span className="text-xs text-rose-700 font-semibold">مبلغ تقریبی پایه سنوات ماهانه:</span>
                    <span className="text-2xl font-black text-rose-900">{formatToman(calculations.totalSanavat)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: LAWS DATABASE ===================== */}
        {activeTab === "laws" && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در متن قوانین، مواد و آرای دیوان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {[
                { id: "all", label: "همه قوانین" },
                { id: "labor", label: "قانون کار" },
                { id: "tamin", label: "تأمین اجتماعی" },
                { id: "unemployment", label: "بیمه بیکاری" },
                { id: "court", label: "آرای دیوان" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Laws List Output */}
            {filteredLaws.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100">
                موردی با این عبارت یافت نشد.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {filteredLaws.slice(0, displayLimit).map((law) => (
                    <div key={law.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-800 text-base">{law.title}</h3>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap">
                          {law.subject}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed text-justify">
                        {law.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
                        {law.tags && law.tags.map((tag, i) => (
                          <span key={i} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Button */}
                {filteredLaws.length > displayLimit && (
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 25)}
                    className="w-full py-3.5 my-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>نمایش موارد بیشتر</span>
                    <span className="bg-blue-500 text-xs px-2.5 py-0.5 rounded-full">
                      {filteredLaws.length - displayLimit} مورد باقی‌مانده
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 3: FAQ ===================== */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در پرسش و پاسخ‌های کاربردی..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <div className="space-y-3">
              {filteredFaq.map((f) => (
                <div key={f.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2.5">
                  <div className="flex items-start gap-2 text-slate-800 font-bold text-base">
                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <h4>{f.question}</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify pr-7">
                    {f.answer}
                  </p>
                  <div className="pr-7 pt-1">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold inline-block">
                      مستند: {f.lawRef}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: TEMPLATES ===================== */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در قالب‌ها و فرم‌های قرارداد و دادخواست..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <div className="space-y-4">
              {filteredTemplates.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4>{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed select-all">
                    {t.content}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Bottom Sticky Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-6 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {[
            { id: "calc", label: "محاسبات", icon: Calculator },
            { id: "laws", label: "مخزن قوانین", icon: BookOpen },
            { id: "faq", label: "پرسش‌وپاسخ", icon: HelpCircle },
            { id: "templates", label: "قالب‌ها", icon: FileText }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive ? "text-blue-600 font-black scale-105" : "text-slate-400 font-medium hover:text-slate-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
