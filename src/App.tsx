import React, { useState, useMemo, useEffect } from "react";
import { TaminBranchesView } from './TaminBranchesView';

// استایل فونت وزیرمتن
const vazirFontStyles = `
  @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
  * {
    font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  }
`;

import {
  Calculator,
  BookOpen,
  FileText,
  Scale,
  MapPin,
  HelpCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  Clock,
  Briefcase,
  AlertCircle,
  Info,
  DollarSign,
  HeartHandshake,
  Phone,
  RefreshCw,
  Copy,
  Download,
  CheckCircle
} from 'lucide-react';

import { LAWS_DATABASE as rawLaws } from "./lawsData";

// نرمال‌سازی پایگاه داده قوانین
const SAFE_LAWS_DATABASE = Array.isArray(rawLaws) ? rawLaws : [];

type TabType = 'home' | 'calc' | 'laws' | 'branches' | 'faq' | 'templates' | 'about';
type CalcCategory = 
  | 'severance' 
  | 'overtime' 
  | 'shift' 
  | 'leave' 
  | 'night' 
  | 'sanavat' 
  | 'insurance_compulsory' 
  | 'insurance_freelance' 
  | 'unemployment_benefit' 
  | 'pension';

export default function DadKarApp() {
  // Splash & Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // App Navigation States
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("Teh");
  const [activeCalc, setActiveCalc] = useState<CalcCategory>('insurance_compulsory');

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const homeSlides = [
    {
      id: 1,
      title: "محاسبه دقیق بیمه اجباری ۳۰ درصد",
      desc: "تفکیک سهم کارگر (۷٪)، کارفرما (۲۰٪) و دولت (۳٪) بر اساس آخرین بخشنامه‌ها",
      targetTab: "calc" as TabType,
      targetCalc: "insurance_compulsory" as CalcCategory,
      gradient: "from-blue-600 to-indigo-700",
      accent: "bg-blue-500/20 text-blue-200 border-blue-400/30"
    },
    {
      id: 2,
      title: "مقرری بیمه بیکاری و جدول ماده ۷",
      desc: "محاسبه دقیق مدت و مبلغ استحقاق با لحاظ تاهل و سوابق بیمه‌پردازی",
      targetTab: "calc" as TabType,
      targetCalc: "unemployment_benefit" as CalcCategory,
      gradient: "from-emerald-600 to-teal-700",
      accent: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
    },
    {
      id: 3,
      title: "بانک الگوهای قرارداد و نامه‌های حقوقی",
      desc: "قراردادهای معتبر، دادخواست‌های اداره کار و خروجی مستقیم فایل Word",
      targetTab: "templates" as TabType,
      gradient: "from-purple-600 to-indigo-800",
      accent: "bg-purple-500/20 text-purple-200 border-purple-400/30"
    },
    {
      id: 4,
      title: "پایگاه جامع قوانین و آیین‌نامه‌ها",
      desc: "متن کامل قانون کار، آیین دادرسی، قوانین تأمین اجتماعی و آرای وحدت رویه",
      targetTab: "laws" as TabType,
      gradient: "from-amber-600 to-orange-700",
      accent: "bg-amber-500/20 text-amber-200 border-amber-400/30"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [homeSlides.length]);

  // Calculator Form Inputs
  const [baseSalary, setBaseSalary] = useState<number>(100000000); // 10,000,000 Toman default
  const [years, setYears] = useState<number>(1);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10);
  const [shiftType, setShiftType] = useState<string>('morning_evening');
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(5);
  const [dependents, setDependents] = useState<number>(1);
  const [unemploymentMonths, setUnemploymentMonths] = useState<number>(24);
  const [insuranceYears, setInsuranceYears] = useState<number>(30);

  // Laws Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(10);

  // FAQ State
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState<string>("");

  // Templates State
  const [templateSearch, setTemplateSearch] = useState<string>("");
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>("all");
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Loading Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayLimit(10);
  }, [searchQuery, selectedCategory]);

  // Helper: Format Rial
  const formatRial = (val: number) => {
    return Math.round(val).toLocaleString("fa-IR") + " ریال";
  };

  // Calculations Logic
  const calculations = useMemo(() => {
    const dailyWage = baseSalary / 30;
    const hourlyWage = baseSalary / 220;

    // ۱. پاداش پایان‌کار (حق سنوات - ماده ۲۴)
    const totalWorkingDays = (years * 365) + (months * 30) + days;
    const severancePay = (baseSalary / 365) * totalWorkingDays;

    // ۲. اضافه کاری (ماده ۵۹ - ۴۰٪ مازاد بر مزد)
    const overtimePay = hours * hourlyWage * 1.4;

    // ۳. نوبت کاری (مواد ۵۵ و ۵۶)
    let shiftMultiplier = 0.10;
    if (shiftType === 'morning_evening_night') shiftMultiplier = 0.15;
    if (shiftType === 'morning_night' || shiftType === 'evening_night') shiftMultiplier = 0.225;
    const shiftPay = baseSalary * shiftMultiplier;

    // ۴. بازخرید مرخصی استحقاقی (ماده ۶۶)
    const leavePay = unworkedLeaveDays * dailyWage;

    // ۵. شب کاری (ماده ۵۸ - ۳۵٪ مازاد)
    const nightPay = hours * hourlyWage * 0.35;

    // ۶. پایه سنوات ماهیانه (نرخ مصوب روزانه ۷۰,۰۰۰ ریال)
    const sanavatMonthly = 70000 * 30;

    // ۷. حق بیمه اجباری کارگری (مجموع ۳۰٪)
    const insuranceWorker = baseSalary * 0.07;
    const insuranceEmployer = baseSalary * 0.20;
    const insuranceGov = baseSalary * 0.03;
    const insuranceTotal = baseSalary * 0.30;

    // ۸. بیمه اختیاری و مشاغل آزاد
    const insuranceOptional = baseSalary * 0.27;
    const insuranceFreelanceRetirement = baseSalary * 0.12;
    const insuranceFreelanceDeath = baseSalary * 0.14;
    const insuranceFreelanceFull = baseSalary * 0.18;

    // بیمه زنان خانه‌دار
    const housewife12 = baseSalary * 0.12;
    const housewife14 = baseSalary * 0.14;
    const housewife18 = baseSalary * 0.18;

    // ۹. مقرری بیمه بیکاری (جدول استحقاق ماده ۷)
    let maxUnemploymentDuration = 0;
    const isMarried = dependents > 0;
    if (unemploymentMonths >= 6 && unemploymentMonths <= 24) {
      maxUnemploymentDuration = isMarried ? 12 : 6;
    } else if (unemploymentMonths >= 25 && unemploymentMonths <= 120) {
      maxUnemploymentDuration = isMarried ? 18 : 12;
    } else if (unemploymentMonths >= 121 && unemploymentMonths <= 180) {
      maxUnemploymentDuration = isMarried ? 26 : 14;
    } else if (unemploymentMonths >= 181 && unemploymentMonths <= 240) {
      maxUnemploymentDuration = isMarried ? 36 : 18;
    } else if (unemploymentMonths >= 241) {
      maxUnemploymentDuration = isMarried ? 50 : 36;
    }

    // مبلغ مقرری: ۵۵٪ میانگین دستمزد + ۱۰٪ به ازای هر تحت تکفل (حداکثر ۴ نفر)
    let benefitRate = 0.55 + Math.min(dependents, 4) * 0.10;
    benefitRate = Math.min(benefitRate, 0.80);
    const monthlyUnemploymentBenefit = baseSalary * benefitRate;

    // ۱۰. مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)
    const pensionEstimate = (baseSalary * insuranceYears) / 30;

    return {
      dailyWage,
      hourlyWage,
      severancePay,
      overtimePay,
      shiftPay,
      leavePay,
      nightPay,
      sanavatMonthly,
      insuranceWorker,
      insuranceEmployer,
      insuranceGov,
      insuranceTotal,
      insuranceOptional,
      insuranceFreelanceRetirement,
      insuranceFreelanceDeath,
      insuranceFreelanceFull,
      housewife12,
      housewife14,
      housewife18,
      maxUnemploymentDuration,
      monthlyUnemploymentBenefit,
      benefitRate,
      pensionEstimate
    };
  }, [baseSalary, years, months, days, hours, shiftType, unworkedLeaveDays, dependents, unemploymentMonths, insuranceYears]);

  // فیلتر قوانین
  const filteredLaws = useMemo(() => {
    return SAFE_LAWS_DATABASE.filter((law: any) => {
      const matchCategory = selectedCategory === "all" || law.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === "" ||
        law.title.toLowerCase().includes(query) ||
        law.content.toLowerCase().includes(query) ||
        (Array.isArray(law.tags) && law.tags.some((tag: string) => tag.toLowerCase().includes(query)));
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  // پایگاه داده پرسش و پاسخ (FAQ)
  const FAQ_DATABASE = [
    {
      id: "f1",
      category: "بیمه",
      question: "آیا پرداخت حق بیمه ۳۰ درصد بر عهده کارگر است؟",
      answer: "خیر، طبق ماده ۲۸ قانون تأمین اجتماعی، تنها ۷ درصد سهم کارگر است که از حقوق کسر می‌شود. ۲۰ درصد سهم کارفرما و ۳ درصد سهم دولت است.",
      lawRef: "ماده ۲۸ قانون تأمین اجتماعی"
    },
    {
      id: "f2",
      category: "بیکاری",
      question: "شرط اصلی دریافت مقرری بیمه بیکاری چیست؟",
      answer: "مستند به قانون بیمه بیکاری، کارگر باید بدون میل و اراده اخراج شده باشد، حداقل ۶ ماه سابقه بیمه داشته باشد و ظرف ۳۰ روز از تاریخ اخراج به اداره کار مراجعه کند.",
      lawRef: "ماده ۲ و ۶ قانون بیمه بیکاری"
    },
    {
      id: "f3",
      category: "بازنشستگی",
      question: "شرایط بازنشستگی در مشاغل سخت و زیان‌آور چگونه است؟",
      answer: "داشتن ۲۰ سال سابقه کار متوالی یا ۲۵ سال سابقه متناوب در کارهای سخت و زیان‌آور بدون شرط سنی، با پرداخت ۴ درصد حق بیمه مشاغل سخت توسط کارفرما.",
      lawRef: "تبصره ۲ ماده ۷۶ قانون تأمین اجتماعی"
    },
    {
      id: "f4",
      category: "سنوات",
      question: "آیا به قراردادهای کمتر از یک سال حق سنوات تعلق می‌گیرد؟",
      answer: "بله، طبق دادنامه دیوان عدالت اداری و اصلاحات قانون کار، به تمام کارگران به نسبت مدت کارکرد (حتی چند روز) حق سنوات معادل یک ماه حقوق پرداخت می‌شود.",
      lawRef: "دادنامه دیوان عدالت اداری / ماده ۲۴ قانون کار"
    }
  ];

  const filteredFaq = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchCat = faqCategory === "all" || item.category === faqCategory;
      const q = faqSearch.trim().toLowerCase();
      const matchQ = q === "" || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [faqCategory, faqSearch]);

  // مخزن جامع، مستند و استاندارد قالب‌ها (TEMPLATES DATABASE)
  const TEMPLATES_DATABASE = [
    {
      id: "t-contract-temp",
      category: "قراردادهای کار",
      title: "قرارداد کار موقت منطبق بر ماده ۱۰ قانون کار",
      description: "قرارداد جامع با مدت معین به همراه تمام جزئیات حقوق، مزایا، سنوات، بیمه و شروط محرمانگی.",
      tags: ["قرارداد موقت", "ماده ۱۰", "روابط کار", "استخدام"],
      content: `بسمه تعالی
قرارداد کار با مدت معین (موقت)
منطبق با قانون کار جمهوری اسلامی ایران

ماده ۱: طرفین قرارداد
الف) کارفرما / شرکت: .................... به شماره ثبت / کد ملی: .................... به نشانی: .................... شماره تلفن: ....................
ب) کارگر / کارمند: جناب آقای / سرکار خانم .................... فرزند: .................... کد ملی: .................... شماره بیمه: .................... نشانی محل سکونت: .................... تلفن تماس: ....................

ماده ۲: نوع قرارداد و موضوع کار
نوع قرارداد: موقت موضوع تبصره ۲ ماده ۷ قانون کار.
موضوع: اشتغال در سمت سازمانی: .................... و انجام دقیق وظایف شغلی ابلاغ‌شده بر اساس آیین‌نامه‌ها و دستورالعمل‌های داخلی کارگاه.

ماده ۳: مدت قرارداد
مدت این قرارداد از تاریخ ۱۴۰ / / لغایت ۱۴۰ / / به مدت ........ ماه تعیین می‌گردد. ادامه همکاری منوط به توافق کتبی و انعقاد قرارداد مجدد خواهد بود.

ماده ۴: ساعات کار و تعطیلات
ساعات کار منطبق با ماده ۵۱ قانون کار معادل ۴۴ ساعت در هفته خواهد بود. روز جمعه روز تعطیل هفتگی با استفاده از مزد می‌باشد (ماده ۶۲ قانون کار).

ماده ۵: مزد، حقوق و مزایای قانونی
۱- مزد پایه روزانه: .................... ریال (مزد ماهیانه: .................... ریال)
۲- کمک‌هزینه مسکن مصوب شورای عالی کار: .................... ریال
۳- بن نقدی (کمک‌هزینه اقلام مصرفی خانوار): .................... ریال
۴- حق اولاد (بر اساس ماده ۸۶ قانون تأمین اجتماعی): .................... ریال
۵- سایر مزایای انگیزشی / سختی کار / پاداش: .................... ریال
تبصره: پرداخت کلیه مبالغ ماهیانه صرفاً به حساب بانکی به نام کارگر انجام می‌پذیرد.

ماده ۶: بیمه تأمین اجتماعی
مستند به ماده ۱۴۸ قانون کار، کارفرما مکلف است از تاریخ شروع به کار، حق بیمه کارگر را کسر و سهم کارفرما را اضافه و به سازمان تأمین اجتماعی پرداخت نماید.

ماده ۷: سنوات، پاداش و عیدی
کارفرما مکلف است در خاتمه قرارداد، پاداش پایان‌کار (حق سنوات خدمت) به ازای هر سال یک ماه مزد طبق ماده ۲۴ قانون کار و پاداش و عیدی مصوب را محاسبه و تادیه کند.

ماده ۸: نسخ قرارداد
این قرارداد در ۴ نسخه با متن و اعتبار واحد تنظیم گردید که یک نسخه نزد کارگر، یک نسخه نزد کارفرما و دو نسخه دیگر در صورت تقاضا تحویل مراجع ذی‌صلاح می‌گردد.

امضاء و اثر انگشت کارگر:                 مهر و امضاء کارفرما:`
    },
    {
      id: "t-contract-probation",
      category: "قراردادهای کار",
      title: "قرارداد استخدام با دوره آزمایشی (ماده ۱۱ قانون کار)",
      description: "قرارداد جهت ارزیابی مهارت شغلی با امکان قطع رابطه کاری بدون اخطار قبلی و الزام به پرداخت خسارت.",
      tags: ["دوره آزمایشی", "ماده ۱۱", "استخدام آزمایشی"],
      content: `بسمه تعالی
قرارداد کار با شرط دوره آزمایشی
(موضوع ماده ۱۱ قانون کار)

طرفین قرارداد:
کارفرما: .................... کد ملی / شناسه ملی: ....................
کارگر: .................... کد ملی: .................... سمت شغلی: ....................

ماده ۱: مدت دوره آزمایشی
به استناد ماده ۱۱ قانون کار، طرفین توافق نمودند که از تاریخ ۱۴۰ / / لغایت ۱۴۰ / / به مدت ........ روز (کارگر غیرماهر حداکثر ۱ ماه، کارگر ماهر و تخصصی حداکثر ۳ ماه) به عنوان دوره آزمایشی منظور گردد.

ماده ۲: شرایط فسخ و قطع همکاری در دوره آزمایشی
۱. در خلال دوره آزمایشی هر یک از طرفین حق دارد بدون اخطار قبلی و بی‌آنکه الزام به پرداخت خسارت داشته باشد، رابطه کار را قطع نماید.
۲. در صورت قطع رابطه کار از سوی کارفرما، کارفرما مکلف است حقوق و مزایای تمام دوره آزمایشی را پرداخت نماید.
۳. در صورت انصراف کارگر، وی تنها مستحق دریافت مزد و مزایای روزهای کارکرد خواهد بود.
۴. پوشش بیمه تأمین اجتماعی در دوره آزمایشی بر اساس ماده ۱۴۸ قانون کار الزامی و قطعی است.

محل امضاء و اثر انگشت کارگر:             مهر و امضاء کارفرما:`
    },
    {
      id: "t-contract-parttime",
      category: "قراردادهای کار",
      title: "قرارداد کار پاره‌وقت / ساعتی (ماده ۳۵ و ۳۹ قانون کار)",
      description: "قرارداد کار ساعتی بر مبنای ساعات کار انجام شده، با محاسبه حقوق، سنوات و بیمه متناسب با ساعات کارکرد.",
      tags: ["پاره وقت", "ساعتی", "ماده ۳۹", "حق‌الزحمه"],
      content: `بسمه تعالی
قرارداد کار ساعتی و پاره‌وقت
(منطبق با مواد ۳۵ و ۳۹ قانون کار جمهوری اسلامی ایران)

کارفرما: .................... به نشانی: ....................
کارگر / کارمند: .................... کد ملی: ....................

ماده ۱: موضوع قرارداد
انجام امور مربوط به: .................... به صورت پاره‌وقت در محل کارگاه یا به‌صورت توافق‌شده.

ماده ۲: مدت و ساعات همکاری
مدت قرارداد از تاریخ ۱۴۰ / / لغایت ۱۴۰ / / خواهد بود. ساعات کارکرد کارگر حداکثر ........ ساعت در ماه / هفته توافق می‌گردد.

ماده ۳: مزد و مزایای ساعتی
دستمزد هر ساعت کارکرد معادل .................... ریال تعیین می‌گردد. به استناد ماده ۳۹ قانون کار، مزد، بیمه، سنوات، عیدی و مرخصی‌ها به نسبت ساعات کارکرد محاسبه و پرداخت خواهد شد.

ماده ۴: بیمه تأمین اجتماعی ساعتی
کارفرما مکلف است ساعات کارکرد واقعی ماهانه را به روز تبدیل کرده و لیست بیمه را ماهانه به شعبه تأمین اجتماعی ارسال نماید (هر ۸ ساعت معادل یک روز سابقه بیمه).

امضاء و اثر انگشت کارگر:                 مهر و امضاء کارفرما:`
    },
    {
      id: "t-petition-general",
      category: "دادخواست‌ها و شکایات",
      title: "دادخواست مطالبه حقوق، سنوات، عیدی و احراز بیمه (ماده ۱۴۸)",
      description: "نمونه متن استاندارد دادخواست جهت ثبت در سامانه جامع روابط کار و رسیدگی در هیات تشخیص اداره کار.",
      tags: ["دادخواست", "هیات تشخیص", "ماده ۱۴۸", "سنوات", "بیمه معوق"],
      content: `بسمه تعالی
ریاست محترم هیات تشخیص اداره تعاون، کار و رفاه اجتماعی شهرستان ....................

موضوع: دادخواست مطالبه دستمزد معوقه، سنوات پایان‌کار، عیدی و پاداش، مرخصی و الزام به رد سوابق بیمه (ماده ۱۴۸)
خواهان (کارگر): .................... فرزند: .................... کد ملی: .................... شماره تماس: ....................
خوانده (کارفرما): شرکت / کارگاه .................... مدیریت محترم: .................... نشانی: ....................

با سلام و احترام؛
به استحضار عالی می‌رساند اینجانب از تاریخ ۱۴۰ / / لغایت ۱۴۰ / / به مدت ........ در کارگاه متعلق به خوانده محترم به عنوان .................... اشتغال به کار داشته‌ام. متأسفانه خوانده به تعهدات قانونی خود عمل ننموده است:
۱. از ارسال لیست بیمه اینجانب در بازه زمانی .................... لغایت .................... به شعبه سازمان تأمین اجتماعی خودداری نموده است که مغایر آشکار با ماده ۱۴۸ قانون کار می‌باشد.
۲. دستمزد و مزایای قانونی ماه‌های .................... کلاً/جزئاً به مبلغ .................... ریال تادیه نگردیده است.
۳. حق سنوات خدمت پایان‌کار (ماده ۲۴ قانون کار) و پاداش و عیدی سال‌های .................... تسویه نشده است.
۴. مانده مرخصی‌های ذخیره‌شده به تعداد ........ روز پرداخت نگردیده است.

لذا مستنداً به مواد ۲، ۳، ۲۴، ۳۴، ۳۷، ۶۶، ۱۴۸ و ۱۵۷ قانون کار جمهوری اسلامی ایران، تقاضای رسیدگی، الزام کارفرما به واریز حق‌بیمه معوقه به سازمان تأمین اجتماعی و محکومیت خوانده به پرداخت کلیه مطالبات مالی فوق‌الذکر مورد استدعاست.

مدارک و ضمائم: پرینت واریزی‌های بانکی، پرینت سوابق بیمه، گواهی شهود، پیام‌های کاری و فیش‌های حقوقی.

امضاء خواهان (کارگر): ....................`
    },
    {
      id: "t-petition-layoff",
      category: "دادخواست‌ها و شکایات",
      title: "دادخواست بازگشت به کار و اخراج غیرقانونی (ماده ۲۰ قانون کار)",
      description: "دادخواست اعتراض به اخراج غیرقانونی کارگر، تقاضای بطلان اخراج و مطالبه حق‌السعی ایام بلاتکلیفی.",
      tags: ["اخراج غیرقانونی", "بازگشت به کار", "ماده ۲۰", "ماده ۲۷"],
      content: `بسمه تعالی
ریاست محترم مراجع حل اختلاف اداره تعاون، کار و رفاه اجتماعی

موضوع: دادخواست بازگشت به کار، اعلام بطلان اخراج غیرقانونی و مطالبه حق‌السعی ایام تعلیق
خواهان: .................... کد ملی: ....................
خوانده: شرکت / کارگاه ....................

با سلام؛
به استحضار می‌رساند اینجانب با سابقه ........ سال اشتغال مستمر در مجموعه خوانده، در تاریخ ۱۴۰ / / بدون هیچ‌گونه عذر موجه قانونی و پیش از انقضای مدت قرارداد یا نقض تعهدات، توسط کارفرما از ورود به کارگاه منع و اخراج گردیده‌ام.
با عنایت به اینکه اخراج اینجانب بدون رعایت تشریفات ماده ۲۷ قانون کار و عدم اخذ نظر مثبت تشکل کارگری صورت پذیرفته و وجاهت قانونی ندارد، مستند به ماده ۲۰ قانون کار و آیین دادرسی کار، تقاضای صدور حکم بر بطلان اخراج، اعاده به کار و الزام کارفرما به پرداخت حق‌السعی ایام بلاتکلیفی را دارم.

امضاء کارگر: ....................`
    },
    {
      id: "t-letter-resignation",
      category: "نامه‌ها و مکاتبات",
      title: "نامه رسمی استعفای کارگر با مهلت ۳۰ روزه (ماده ۲۱ قانون کار)",
      description: "نامه رسمی استعفا با رعایت مهلت یک‌ماهه قانونی جهت جلوگیری از تبعات ترک کار غیرقانونی.",
      tags: ["استعفا", "ماده ۲۱", "ترک کار", "پایان خدمت"],
      content: `بسمه تعالی
تاریخ: ۱۴۰ / /
شماره: ....................

جناب آقای / سرکار خانم ....................
مدیریت محترم عامل / کارفرمای محترم کارگاه ....................

موضوع: اعلام استعفای رسمی از خدمت

با سلام و احترام؛
بدین‌وسیله اینجانب .................... شاغل در سمت .................... با کد پرسنلی ....................، استعفای خود را از ادامه همکاری با آن مجموعه به دلایل شخصی اعلام می‌دارم.
به استناد تبصره ماده ۲۱ قانون کار جمهوری اسلامی ایران، اینجانب متعهد می‌گردم تا پایان مهلت ۳۰ روزه قانونی (لغایت تاریخ ۱۴۰ / /) در محل کار حضور یافته و وظایف شغلی و تحویل امور محوله را به نحو احسن انجام دهم.
خواهشمند است دستور فرمایید هماهنگی‌های لازم جهت فرآیند تحویل کار و تسویه‌حساب نهایی مطالبات و حق سنوات خدمت معمول دارند.

با تشکر و احترام؛
نام و نام خانوادگی: ....................
امضاء و اثر انگشت:`
    },
    {
      id: "t-letter-warning",
      category: "نامه‌ها و مکاتبات",
      title: "برگه اخطار کتبی و تذکر انضباطی کارفرما به کارگر (ماده ۲۷)",
      description: "برگه اخطار رسمی اداری جهت درج در پرونده پرسنلی مطابق با آیین‌نامه انضباطی کارگاه.",
      tags: ["اخطار کتبی", "انضباطی", "ماده ۲۷", "تخلفات اداری"],
      content: `بسمه تعالی
برگه اخطار کتبی انضباطی

به: جناب آقای / سرکار خانم .................... (کد پرسنلی: ....................)
از: امور اداری و منابع انسانی / مدیریت کارگاه ....................
تاریخ ابلاغ: ۱۴۰ / /

موضوع: اخطار کتبی انضباطی

پیرو تذکرات شفاهی گذشته، متأسفانه در تاریخ‌های .................... مواردی دال بر تخطی از شرح وظایف شغلی و نقض آیین‌نامه انضباطی کارگاه از جمله: (شرح تخلف: ....................) محرز گردیده است.
بدین‌وسیله مستند به ماده ۲۷ قانون کار و مقررات انضباطی مصوب، اخطار کتبی با درج در پرونده پرسنلی به شما ابلاغ می‌گردد. یادآور می‌شود در صورت استمرار این روند، کارگاه تصمیمات مقتضی قانونی را اتخاذ خواهد نمود.

مهر و امضاء مدیریت: ....................
رسید ابلاغ:
اینجانب .................... این برگه اخطار را در تاریخ ۱۴۰ / / رویت و تحویل گرفتم. (امضاء کارگر)`
    },
    {
      id: "t-letter-leave",
      category: "نامه‌ها و مکاتبات",
      title: "فرم درخواست مرخصی استحقاقی سالانه (ماده ۶۴ قانون کار)",
      description: "برگه استاندارد اداری درخواست مرخصی استحقاقی روزانه یا ساعتی با تایید مدیر مستقیم.",
      tags: ["مرخصی استحقاقی", "ماده ۶۴", "اداری", "مرخصی"],
      content: `بسمه تعالی
برگه درخواست مرخصی استحقاقی

مشخصات متقاضی:
نام و نام خانوادگی: .................... واحد / بخش: .................... سمت: ....................

نوع مرخصی: [ ] استحقاقی روزانه      [ ] استحقاقی ساعتی      [ ] بدون حقوق
مدت مرخصی: از تاریخ ۱۴۰ / / لغایت ۱۴۰ / / به مدت ........ روز / ساعت.
علت مرخصی: ....................
جانشین در ایام مرخصی: جناب آقای / سرکار خانم ....................

امضاء متقاضی: ....................               امضاء جانشین: ....................

نظر مدیر مستقیم / سرپرست:
[ ] موافقت می‌شود      [ ] مخالفت می‌شود (علت: ....................)
امضاء مدیر مربوطه: ....................`
    },
    {
      id: "t-settlement-form",
      category: "صورتجلسات و توافق‌نامه‌ها",
      title: "صورتجلسه قطعی تسویه‌حساب مالی و اقرارنامه مطالبات کارگری",
      description: "فرم استاندارد تسویه‌حساب مستند به پرداخت‌های بانکی همراه با تفکیک اجزای سنوات، عیدی و مرخصی.",
      tags: ["تسویه‌حساب", "سنوات", "اقرارنامه", "خاتمه کار"],
      content: `بسمه تعالی
صورتجلسه قطعی تسویه‌حساب و پرداخت مطالبات قانونی کارگر

مشخصات کارگر: .................... فرزند: .................... کد ملی: .................... شماره بیمه: ....................
تاریخ شروع به کار: ۱۴۰ / /             تاریخ خاتمه قطعی: ۱۴۰ / /

ریز محاسبات مطالبات قانونی:
۱. دستمزد و حقوق ایام کارکرد تا تاریخ خاتمه: .................... ریال
۲. حق سنوات پایان‌کار خدمت (ماده ۲۴ قانون کار): .................... ریال
۳. پاداش و عیدی قانونی: .................... ریال
۴. بازخرید مانده مرخصی استحقاقی (ماده ۶۶ - ........ روز): .................... ریال
۵. کمک‌هزینه‌های معوقه (مسکن، بن، اولاد): .................... ریال
جمع کل مطالبات استحقاقی: .................... ریال
کسورات قانونی (مالیات، حق‌بیمه سهم کارگر، مساعده): .................... ریال
خالص پرداختی نهایی تادیه شده: .................... ریال

شیوه پرداخت:
مبلغ فوق طبق فیش / حواله بانکی به شماره رهگیری .................... در تاریخ ۱۴۰ / / به شماره شبای بانکی IR............................................ متعلق به کارگر واریز گردید.

اقرارنامه:
اینجانب .................... با دریافت خالص مبلغ فوق تایید می‌نمایم کلیه مطالبات قانونی و سنوات خدمت خویش را تا تاریخ خاتمه دریافت نموده و نسبت به این دوره هیچ‌گونه ادعایی علیه کارگاه ندارم.

امضاء و اثر انگشت کارگر:                 مهر و امضاء کارفرما:`
    },
    {
      id: "t-tamin-appeal",
      category: "تأمین اجتماعی",
      title: "لایحه اعتراض کارفرما به بدهی اعلامی حق‌بیمه (ماده ۴۲)",
      description: "لایحه رسمی دفاعیه کارفرما جهت طرح در هیات بدوی تشخیص مطالبات سازمان تأمین اجتماعی.",
      tags: ["تأمین اجتماعی", "ماده ۴۲", "هیات بدوی", "بدهی بیمه", "اعتراض"],
      content: `بسمه تعالی
ریاست و اعضای محترم هیات بدوی تشخیص مطالبات سازمان تأمین اجتماعی شعبه ....................

موضوع: لایحه اعتراض به اعلامیه بدهی حق‌بیمه به شماره .................... مورخ ۱۴۰ / /
مستند قانونی: ماده ۴۲ قانون تأمین اجتماعی
نام کارگاه: .................... کد کارگاه: .................... نام مدیر / کارفرما: ....................

با احترام؛
احتراماً در خصوص اعلامیه بدهی فوق‌الذکر به مبلغ .................... ریال، مراتب اعتراض مستند و مستدل این کارگاه به جهات ذیل اعلام می‌گردد:
۱. مغایرت در گزارش بازرسی: بازرسی صورت‌پذیرفته در تاریخ ۱۴۰ / / دقیق نبوده و افراد ردیف‌های ........ رابطه خادم و مخدومی یا اشتغال مستمر در این واحد نداشته‌اند.
۲. مبالغ اعلامی مربوط به قراردادهای پیمانکاری مشمول ماده ۳۸ بوده که مفاصاحساب آن اخذ یا کسورات قانونی اعمال گردیده است.
۳. دستمزدهای مبنای محاسبه بیش از ارقام واقعی پرداخت‌شده در دفاتر قانونی و لیست‌های ارسالی لحاظ گردیده است.

بنا به مراتب فوق و با استناد به ماده ۴۲ قانون تأمین اجتماعی، تقاضای توقف اقدامات اجرایی، بررسی مجدد دفاتر قانونی و اسناد پیوست و صدور رای شایسته بر تعدیل و ابطال بدهی غیرواقعی مورد استدعاست.

پیوست‌ها: تصاویر دفاتر قانونی، لیست واریز حقوق بانکی، قراردادهای پیمان و اسناد مالی.

امضاء کارفرما / مهر شرکت:`
    }
  ];

  // لیست دسته‌بندی‌ها
  const categoriesList = ["all", "قراردادهای کار", "دادخواست‌ها و شکایات", "نامه‌ها و مکاتبات", "صورتجلسات و توافق‌نامه‌ها", "تأمین اجتماعی"];

  // فیلتر قالب‌ها
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATABASE.filter((t) => {
      const matchCat = selectedTemplateCategory === "all" || t.category === selectedTemplateCategory;
      const q = templateSearch.trim().toLowerCase();
      const matchQ =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [templateSearch, selectedTemplateCategory]);

  // کپی متن قالب
  const handleCopyTemplate = async (id: string, text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedTemplateId(id);
      setTimeout(() => setCopiedTemplateId(null), 2500);
    } catch (err) {
      console.error("خطا در کپی متن:", err);
    }
  };

  // دانلود فایل Word رسمی دادکار
  const handleDownloadWord = (template: { title: string; category: string; content: string }) => {
    const formattedBody = template.content
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "<p style='margin: 4pt 0;'>&nbsp;</p>";
        if (trimmed.startsWith("ماده") || trimmed.startsWith("بند") || trimmed.startsWith("فصل") || trimmed.startsWith("موضوع:") || trimmed.startsWith("ریز محاسبات")) {
          return `<p style="font-weight: bold; color: #1e3a8a; margin-top: 12pt; margin-bottom: 4pt; font-size: 12pt;">${trimmed}</p>`;
        }
        return `<p style="text-align: justify; line-height: 1.8; margin-bottom: 5pt; font-size: 11pt; color: #1e293b;">${trimmed}</p>`;
      })
      .join("");

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${template.title}</title>
        <style>
          @page {
            size: A4;
            margin: 2.5cm 2cm 2.5cm 2cm;
          }
          body {
            font-family: 'B Nazanin', 'IRANSans', 'Vazirmatn', Tahoma, sans-serif;
            direction: rtl;
            text-align: right;
            color: #0f172a;
          }
          .header-box {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .title-box {
            background-color: #f8fafc;
            border-right: 4px solid #2563eb;
            padding: 10px 14px;
            margin-bottom: 18px;
          }
          .footer-box {
            margin-top: 35px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 10px;
            font-size: 9pt;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="text-align: right;">
                <span style="font-size: 15pt; font-weight: bold; color: #1e40af;">⚖️ سامانه تخصصی دادکار</span><br/>
                <span style="font-size: 10pt; color: #64748b;">مرجع قوانین، محاسبات و الگوهای روابط کار و تأمین اجتماعی</span>
              </td>
              <td style="text-align: left; vertical-align: top; font-size: 9.5pt; color: #64748b;">
                دسته‌بندی: ${template.category}<br/>
                تاریخ صدور: ${new Date().toLocaleDateString("fa-IR")}
              </td>
            </tr>
          </table>
        </div>

        <div class="title-box">
          <h2 style="font-size: 13pt; margin: 0; color: #0f172a;">${template.title}</h2>
        </div>

        <div style="padding: 4px 0;">
          ${formattedBody}
        </div>

        <div class="footer-box">
          این سند بر اساس استانداردهای حقوقی و اداری، مستخرج از «سامانه جامع دادکار» تنظیم گردیده است.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + wordContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.title.replace(/\s+/g, "_")}_دادکار.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Splash Screen Render
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50 p-6 select-none" dir="rtl">
        <style>{vazirFontStyles}</style>
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-pulse">
            <Scale className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
            <Calculator className="w-4 h-4 text-slate-950 font-bold" />
          </div>
        </div>
        
        <h1 className="text-2xl font-black tracking-tight mb-2">سامانه تخصصی دادکار</h1>
        <p className="text-slate-400 text-xs mb-8 text-center max-w-xs leading-relaxed">
          مرجع هوشمند محاسبات کار و تأمین اجتماعی، پایگاه قوانین و الگوهای رسمی
        </p>

        <div className="w-64 bg-slate-800 rounded-full h-2 p-0.5 overflow-hidden border border-slate-700/60 shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between w-64 mt-2 text-[11px] text-slate-400 font-mono">
          <span>نسخه ۴.۰</span>
          <span>{loadingProgress}٪</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white pb-24" dir="rtl">
      <style>{vazirFontStyles}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900">دادکار</span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200">
                  نسخه ۴.۰
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">دستیار تخصصی قوانین و محاسبات کار</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('about')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="درباره ما"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content Body */}
      <main className="max-w-4xl mx-auto px-4 py-5 flex-1 w-full">
        {/* ۱. تب خانه (HOME) */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Slider */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 aspect-[16/8] sm:aspect-[16/6] flex items-end">
              {homeSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} p-6 sm:p-8 flex flex-col justify-end text-white transition-all duration-700 ease-in-out ${
                    idx === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"
                  }`}
                >
                  <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border mb-2 w-fit ${slide.accent}`}>
                    ویژگی برجسته
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mb-1">{slide.title}</h2>
                  <p className="text-white/80 text-xs sm:text-sm max-w-lg mb-4 line-clamp-2">
                    {slide.desc}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab(slide.targetTab);
                      if (slide.targetCalc) setActiveCalc(slide.targetCalc);
                    }}
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-100 transition w-fit"
                  >
                    <span>مشاهده و اقدام</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                {homeSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>

            {/* کارت‌های دسترسی سریع */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                دسترسی سریع به بخش‌ها
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => { setActiveTab('calc'); setActiveCalc('insurance_compulsory'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition text-right group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Percent className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">بیمه اجباری ۳۰٪</h4>
                  <p className="text-[11px] text-slate-500">تفکیک دقیق سهم کارگر، کارفرما و دولت</p>
                </button>

                <button
                  onClick={() => { setActiveTab('calc'); setActiveCalc('unemployment_benefit'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition text-right group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">بیمه بیکاری</h4>
                  <p className="text-[11px] text-slate-500">جدول مدت و مبلغ طبق ماده ۷ قانون</p>
                </button>

                <button
                  onClick={() => { setActiveTab('calc'); setActiveCalc('severance'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition text-right group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">حق سنوات پایان‌کار</h4>
                  <p className="text-[11px] text-slate-500">ماده ۲۴ قانون کار بر اساس روز و سال</p>
                </button>

                <button
                  onClick={() => setActiveTab('laws')}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition text-right group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">پایگاه قوانین</h4>
                  <p className="text-[11px] text-slate-500">جستجوی هوشمند در مواد قانون کار</p>
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition text-right group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">قالب‌ها و نامه‌ها</h4>
                  <p className="text-[11px] text-slate-500">الگوهای رسمی با امکان دانلود فایل Word</p>
                </button>

                <button
                  onClick={() => setActiveTab('branches')}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition text-right group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">مراکز تأمین اجتماعی</h4>
                  <p className="text-[11px] text-slate-500">نقشه شعب و تماس مستقیم استانی</p>
                </button>
              </div>
            </div>

            {/* کارت ارتباط و پشتیبانی */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-black text-base mb-1">طراحی و توسعه تخصصی</h4>
                <p className="text-xs text-slate-400">سید حسین حجازی • مدیر تحول دیجیتال و کارشناس ارشد سرمایه انسانی</p>
              </div>
              <a
                href="tel:09138003216"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                <Phone className="w-4 h-4" />
                <span>۰۹۱۳۸۰۰۳۲۱۶</span>
              </a>
            </div>
          </div>
        )}

        {/* ۲. تب محاسبات (CALC) */}
        {activeTab === 'calc' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* ناوبری نوع محاسبه */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              {[
                { id: 'insurance_compulsory', label: 'بیمه اجباری ۳۰٪' },
                { id: 'unemployment_benefit', label: 'بیمه بیکاری' },
                { id: 'pension', label: 'مستمری بازنشستگی' },
                { id: 'insurance_freelance', label: 'اختیاری و آزاد' },
                { id: 'severance', label: 'حق سنوات' },
                { id: 'overtime', label: 'اضافه‌کاری' },
                { id: 'shift', label: 'نوبت‌کاری' },
                { id: 'leave', label: 'مرخصی' },
                { id: 'night', label: 'شب‌کاری' },
                { id: 'sanavat', label: 'پایه سنوات' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCalc(item.id as CalcCategory)}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    activeCalc === item.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* فیلد ورودی دستمزد مبنا */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  مزد مبنای ماهانه (حقوق پایه + مزایای مشمول):
                </label>
                <span className="text-sm font-black text-blue-700 font-mono">
                  {formatRial(baseSalary)}
                </span>
              </div>

              <input
                type="range"
                min={50000000}
                max={500000000}
                step={5000000}
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex gap-2">
                {[71661840, 100000000, 150000000, 200000000].map((quickVal) => (
                  <button
                    key={quickVal}
                    onClick={() => setBaseSalary(quickVal)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                  >
                    {(quickVal / 10000000).toLocaleString("fa-IR")} م ت
                  </button>
                ))}
              </div>
            </div>

            {/* جزئیات خروجی هر نوع محاسبه */}
            {activeCalc === 'insurance_compulsory' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                  <span>تفکیک سهم حق‌بیمه اجباری ۳۰ درصد (ماده ۲۸)</span>
                  <span className="text-xs text-blue-600 font-normal">مبنا: قانون تأمین اجتماعی</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="text-xs text-blue-600 font-bold block mb-1">سهم کارگر (۷٪)</span>
                    <span className="text-base font-black text-blue-900 font-mono">{formatRial(calculations.insuranceWorker)}</span>
                    <p className="text-[10px] text-blue-500 mt-1">کسر از حقوق دریافتی کارگر</p>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                    <span className="text-xs text-indigo-600 font-bold block mb-1">سهم کارفرما (۲۰٪ + ۳٪ بیکاری)</span>
                    <span className="text-base font-black text-indigo-900 font-mono">{formatRial(calculations.insuranceEmployer + (baseSalary * 0.03))}</span>
                    <p className="text-[10px] text-indigo-500 mt-1">پرداخت قانونی توسط کارفرما</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 text-white">
                    <span className="text-xs text-slate-300 font-bold block mb-1">مجموع واریزی به شعبه (۳۰٪)</span>
                    <span className="text-base font-black text-yellow-400 font-mono">{formatRial(calculations.insuranceTotal)}</span>
                    <p className="text-[10px] text-slate-400 mt-1">کل مبلغ ارسال‌شده در لیست ماهانه</p>
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'unemployment_benefit' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">محاسبه مقرری بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">ماه‌های سابقه بیمه‌پردازی قبل از بیکاری:</label>
                    <input
                      type="number"
                      min={6}
                      max={360}
                      value={unemploymentMonths}
                      onChange={(e) => setUnemploymentMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">تعداد افراد تحت تکفل:</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={dependents}
                      onChange={(e) => setDependents(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="text-xs text-emerald-700 font-bold block mb-1">مدت مجاز دریافت مقرری:</span>
                    <span className="text-lg font-black text-emerald-900 font-mono">{calculations.maxUnemploymentDuration} ماه</span>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="text-xs text-blue-700 font-bold block mb-1">مقرری تقریبی ماهانه:</span>
                    <span className="text-lg font-black text-blue-900 font-mono">{formatRial(calculations.monthlyUnemploymentBenefit)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'severance' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">محاسبه حق سنوات پایان‌کار (ماده ۲۴ قانون کار)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">سال:</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">ماه:</label>
                    <input
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">روز:</label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
                  <span className="text-xs text-purple-700 font-bold block mb-1">مبلغ کل حق سنوات استحقاقی:</span>
                  <span className="text-xl font-black text-purple-900 font-mono">{formatRial(calculations.severancePay)}</span>
                </div>
              </div>
            )}

            {activeCalc === 'overtime' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">اضافه‌کاری (ماده ۵۹ قانون کار - ۴۰٪ مازاد)</h3>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">تعداد ساعت اضافه‌کاری:</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                  />
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                  <span className="text-xs text-amber-800 font-bold block mb-1">فوق‌العاده اضافه کاری:</span>
                  <span className="text-xl font-black text-amber-900 font-mono">{formatRial(calculations.overtimePay)}</span>
                </div>
              </div>
            )}

            {activeCalc === 'insurance_freelance' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">بیمه اختیاری، مشاغل آزاد و زنان خانه‌دار</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border rounded-xl">
                    <span className="text-xs font-bold text-slate-700 block">مشاغل آزاد ۱۲٪ (بازنشستگی):</span>
                    <span className="text-sm font-black text-blue-700 font-mono">{formatRial(calculations.insuranceFreelanceRetirement)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-xl">
                    <span className="text-xs font-bold text-slate-700 block">مشاغل آزاد ۱۴٪ (بازنشستگی و فوت):</span>
                    <span className="text-sm font-black text-blue-700 font-mono">{formatRial(calculations.insuranceFreelanceDeath)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-xl">
                    <span className="text-xs font-bold text-slate-700 block">مشاغل آزاد ۱۸٪ (کامل با ازکارافتادگی):</span>
                    <span className="text-sm font-black text-blue-700 font-mono">{formatRial(calculations.insuranceFreelanceFull)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-xl">
                    <span className="text-xs font-bold text-slate-700 block">بیمه اختیاری ۲۷٪ (درمان و بازنشستگی):</span>
                    <span className="text-sm font-black text-indigo-700 font-mono">{formatRial(calculations.insuranceOptional)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'pension' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">برآورد مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)</h3>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">سابقه پرداخت حق‌بیمه (سال):</label>
                  <input
                    type="number"
                    value={insuranceYears}
                    onChange={(e) => setInsuranceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                  />
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <span className="text-xs text-emerald-800 font-bold block mb-1">مستمری برآوردی ماهانه:</span>
                  <span className="text-xl font-black text-emerald-900 font-mono">{formatRial(calculations.pensionEstimate)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ۳. تب قوانین (LAWS) */}
        {activeTab === 'laws' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو در متن قوانین، مواد قانونی و برچسب‌ها..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {["all", "قانون کار", "تأمین اجتماعی", "بیمه بیکاری", "آیین دادرسی کار"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                      selectedCategory === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "all" ? "همه قوانین" : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredLaws.slice(0, displayLimit).map((law: any, index: number) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">{law.title}</h4>
                    {law.category && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                        {law.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{law.content}</p>
                  {Array.isArray(law.tags) && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {law.tags.map((tag: string, tIdx: number) => (
                        <button
                          key={tIdx}
                          onClick={() => setSearchQuery(tag)}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredLaws.length > displayLimit && (
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 10)}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-blue-600 hover:bg-slate-50 transition"
                >
                  نمایش موارد بیشتر
                </button>
              )}
            </div>
          </div>
        )}

        {/* ۴. تب سوالات متداول (FAQ) */}
        {activeTab === 'faq' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو در پرسش‌ها و پاسخ‌ها..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredFaq.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <h4>{item.question}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pr-6">{item.answer}</p>
                  <div className="pr-6 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      مستند: {item.lawRef}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ۵. تب مخزن قالب‌ها و اسناد رسمی (TEMPLATES) */}
        {activeTab === 'templates' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* بنر سربرگ */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-yellow-300" />
                  مخزن الگوهای رسمی، قراردادها و لوایح حقوقی
                </h3>
                <p className="text-blue-100 text-xs mt-1">
                  شامل قراردادهای کارشناسی، دادخواست‌های اداره کار و مکاتبات اداری با امکان دانلود مستقیم در قالب استاندارد Word
                </p>
              </div>
              <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 self-start md:self-auto font-medium">
                {TEMPLATES_DATABASE.length} الگوی معتبر قانونی
              </span>
            </div>

            {/* نوار جستجو و فیلتر دسته‌بندی */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative">
                <Search className="w-5 h-5 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو در قراردادها، دادخواست‌ها، شکایات و نامه‌ها..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                />
              </div>

              {/* چیپ‌های دسته‌بندی */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTemplateCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedTemplateCategory === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "all" ? "همه قالب‌ها" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* لیست کارت‌های قالب */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">هیچ الگویی مطابق با جستجوی شما یافت نشد.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredTemplates.map((t) => {
                  const isCopied = copiedTemplateId === t.id;
                  return (
                    <div
                      key={t.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* هدر کارت */}
                      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                              {t.category}
                            </span>
                            <h4 className="font-bold text-slate-800 text-base">{t.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500">{t.description}</p>
                        </div>

                        {/* دکمه‌های عملیاتی: کپی و دانلود ورد */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {/* دکمه کپی متن */}
                          <button
                            onClick={() => handleCopyTemplate(t.id, t.content)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              isCopied
                                ? "bg-emerald-600 text-white shadow"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                            title="کپی کردن متن کامل"
                          >
                            {isCopied ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-white" />
                                <span>کپی شد</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-slate-500" />
                                <span>کپی متن</span>
                              </>
                            )}
                          </button>

                          {/* دکمه دانلود سند Word با استایل دادکار */}
                          <button
                            onClick={() => handleDownloadWord(t)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all"
                            title="دانلود سند رسمی Word دادکار"
                          >
                            <Download className="w-4 h-4 text-white" />
                            <span>دانلود فایل Word</span>
                          </button>
                        </div>
                      </div>

                      {/* متن قالب */}
                      <div className="p-4 sm:p-5">
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-all border border-slate-800 shadow-inner">
                          {t.content}
                        </div>

                        {/* برچسب‌ها */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {t.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ۶. تب مراکز تأمین اجتماعی (BRANCHES) */}
        {activeTab === 'branches' && (
          <div className="tab-content">
            <TaminBranchesView />
          </div>
        )}

        {/* ۷. تب درباره ما (ABOUT) */}
        {activeTab === 'about' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">سامانه تخصصی دادکار</h3>
                <p className="text-xs text-slate-500 mt-1">نسخه ۴.۰ • مرجع هوشمند قوانین و محاسبات کار</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto text-justify">
                این نرم‌افزار به عنوان ابزاری جامع جهت محاسبه دقیق حقوق و مزایای قانونی کار، سنوات، بیمه اجباری، بیمه بیکاری، دسترسی به پایگاه مستندات و مخزن الگوهای حقوقی طراحی شده است.
              </p>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p>طراح و صاحب امتیاز: <strong className="text-slate-800">سید حسین حجازی</strong></p>
                <p>شماره تماس مستقیم: <span className="font-mono text-blue-600">۰۹۱۳۸۰۰۳۲۱۶</span></p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* نوار فوتر شناور (اصلاح شده به ۶ ستون یکپارچه) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1 text-[10px] text-center font-bold">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 rounded-xl transition ${
              activeTab === 'home' ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scale className="w-5 h-5 mb-0.5" />
            <span>خانه</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={`flex flex-col items-center py-1 rounded-xl transition ${
              activeTab === 'calc' ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span>محاسبات</span>
          </button>

          <button
            onClick={() => setActiveTab('laws')}
            className={`flex flex-col items-center py-1 rounded-xl transition ${
              activeTab === 'laws' ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span>قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`flex flex-col items-center py-1 rounded-xl transition ${
              activeTab === 'branches' ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MapPin className="w-5 h-5 mb-0.5" />
            <span>شعب</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex flex-col items-center py-1 rounded-xl transition ${
              activeTab === 'templates' ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span>قالب‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center py-1 rounded-xl transition ${
              activeTab === 'about' ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Info className="w-5 h-5 mb-0.5" />
            <span>درباره</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
