import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Users, FileText, ChevronRight, ChevronLeft, Phone, 
  MapPin, Clock, Search, HelpCircle, AlertCircle, 
  Scale, Calculator, BookOpen, ShieldCheck, Download, 
  Share2, ChevronDown, CheckCircle2, Award, Briefcase, 
  Percent, ArrowRight, X, ExternalLink, Sparkles, Sliders, 
  RefreshCw, Layers, Check, Info, FileSpreadsheet, Home,
  FileCheck2, ShieldAlert, Copy, Mail, Globe, MessageSquare,
  ChevronUp, Settings, Moon, Sun, Type
} from 'lucide-react';


import TaminBranchesView from './TaminBranchesView';
import * as LawsModule from './lawsData';

// استخراج ایمن پایگاه قوانین از فایل lawsData.ts
const EXTRACTED_LAWS: any[] = 
  (LawsModule as any).LAWS_DATABASE || 
  (LawsModule as any).lawsDatabase || 
  (LawsModule as any).default || 
  [];

interface TemplateItem {
  id: string;
  title: string;
  category: 'contracts' | 'petitions' | 'letters' | 'settlements' | 'retirement' | 'unemployment' | 'appeals';
  categoryLabel: string;
  description: string;
  tags: string[];
  content: string;
}

// مخزن جامع ۱۰۵ قالب رسمی و استاندارد قرارداد، دادخواست و اداری
import * as TemplatesModule from './templatesData';

// استخراج ایمن داده‌های قالب‌ها با گارد چندگانه
const templateExportCandidates = [
  (TemplatesModule as any).TEMPLATES_DATABASE,
  (TemplatesModule as any).templatesData,
  (TemplatesModule as any).templates,
  (TemplatesModule as any).templatesDatabase,
  (TemplatesModule as any).default,
  ...Object.values(TemplatesModule as any)
];
const EXTRACTED_TEMPLATES: TemplateItem[] = (() => {
  for (const candidate of templateExportCandidates) {
    const data = Array.isArray(candidate)
      ? candidate
      : candidate && typeof candidate === 'object'
        ? Object.values(candidate).find(Array.isArray)
        : null;
    if (Array.isArray(data) && data.length) return data as TemplateItem[];
  }
  return [];
})();

// fallback اضطراری سبک: در صورت خالی بودن پایگاه قالب‌ها در زمان لود
const EMERGENCY_FALLBACK_TEMPLATES: TemplateItem[] = [
  {
    id: 'fb-contract',
    title: 'قرارداد کار موقت استاندارد (ماده ۱۰ قانون کار)',
    category: 'contracts',
    categoryLabel: 'قراردادهای کار',
    description: 'قرارداد کار با مدت معین منطبق بر قانون کار.',
    tags: ['قرارداد کار', 'ماده ۱۰', 'استخدام موقت'],
    content: 'قرارداد کار با مدت معین\n\nاین قرارداد بر اساس مواد ۲، ۷، ۱۰ و ۲۴ قانون کار میان کارفرما و کارگر منعقد می‌گردد.\nمشخصات طرفین، نوع کار، مدت قرارداد، حق‌السعی و سایر شرایط مطابق قانون کار درج می‌گردد.\nتاریخ و امضای طرفین'
  },
  {
    id: 'fb-settlement',
    title: 'فرم تسویه‌حساب قطعی کارگر',
    category: 'settlements',
    categoryLabel: 'تسویه‌حساب و اقرارنامه‌ها',
    description: 'اقرارنامه تسویه‌حساب کامل بین کارگر و کارفرما.',
    tags: ['تسویه حساب', 'سنوات', 'اقرارنامه'],
    content: 'بسمه تعالی\nاقرارنامه تسویه‌حساب قطعی\n\nاینجانب ................. کارگر سابق واحد ................. اقرار می‌نمایم کلیه حقوق، مزایا، سنوات، بازخرید مرخصی و سایر مطالبات اینجانب به طور کامل پرداخت گردیده و هیچ‌گونه ادعایی نسبت به سابقه کارم ندارم.\nتاریخ و امضای طرفین'
  },
  {
    id: 'fb-petition-148',
    title: 'دادخواست احراز سابقه بیمه کارگری (ماده ۱۴۸ قانون کار)',
    category: 'petitions',
    categoryLabel: 'دادخواست‌ها و شکایات',
    description: 'دادخواست اداره کار جهت الزام کارفرما به پرداخت حق‌بیمه معوقه و احراز سابقه.',
    tags: ['ماده ۱۴۸', 'سابقه بیمه', 'حق بیمه'],
    content: 'موضوع: اجرای ماده ۱۴۸ قانون کار و احراز سابقه بیمه\n\nریاست محترم اداره کار\nاحتراماً به استحضار می‌رساند کارفرما از تاریخ ................. لغایت ................. حق‌بیمه اینجانب را نپرداخته است. تقاضای رسیدگی و الزام کارفرما به پرداخت حق‌بیمه معوقه و احراز سابقه بیمه را دارم.\nامضاء متقاضی'
  },
  {
    id: 'fb-resignation', title: 'نمونه استعفانامه کارگر', category: 'letters', categoryLabel: 'نامه‌های اداری',
    description: 'اعلام کتبی استعفا و درخواست تعیین تکلیف مطالبات.', tags: ['استعفا', 'ماده ۲۱', 'نامه اداری'],
    content: 'مدیریت محترم ........\nموضوع: اعلام استعفا\n\nاینجانب ........ شاغل در سمت ........، با رعایت مهلت قانونی و مفاد ماده ۲۱ قانون کار، استعفای خود را از تاریخ ........ اعلام می‌نمایم. تقاضا دارم مطالبات قانونی و سوابق بیمه تا آخرین روز کارکرد محاسبه و پرداخت شود.\nبا احترام، نام و امضا: ........\nتاریخ: ........'
  },
  {
    id: 'fb-overtime', title: 'درخواست پرداخت اضافه‌کاری', category: 'letters', categoryLabel: 'نامه‌های اداری',
    description: 'درخواست ثبت و پرداخت ساعات اضافه‌کاری مستند.', tags: ['اضافه‌کاری', 'ماده ۵۹', 'مطالبات مزدی'],
    content: 'مدیریت محترم ........\nموضوع: درخواست رسیدگی به اضافه‌کاری\n\nبا سلام؛ با توجه به کارکرد اینجانب در روزها/ساعات ........ طی بازه ........، خواهشمند است ساعات اضافه‌کاری با لحاظ مقررات ماده ۵۹ قانون کار بررسی و مبلغ قانونی آن در فیش حقوقی درج و پرداخت شود.\nپیوست: ریز کارکرد/مستندات\nنام و امضا: ........'
  },
  {
    id: 'fb-unemployment', title: 'درخواست برقراری بیمه بیکاری', category: 'unemployment', categoryLabel: 'بیمه بیکاری',
    description: 'درخواست بررسی شرایط و برقراری مقرری بیمه بیکاری.', tags: ['بیمه بیکاری', 'قانون بیمه بیکاری', 'اداره کار'],
    content: 'ریاست محترم اداره تعاون، کار و رفاه اجتماعی ........\nموضوع: درخواست بررسی برقراری مقرری بیمه بیکاری\n\nاینجانب ........ با شماره ملی ........ به علت بیکاری غیرارادی از تاریخ ........ فاقد شغل شده‌ام. با پیوست مدارک رابطه کاری و سابقه بیمه، تقاضای بررسی شرایط و ثبت درخواست در مهلت قانونی را دارم.\nتوجه: احراز بیکاری غیرارادی و سایر شرایط، با مرجع ذی‌صلاح است.\nنام و امضا: ........'
  },
  {
    id: 'fb-settlement-request', title: 'درخواست پرداخت مطالبات پایان کار', category: 'settlements', categoryLabel: 'تسویه‌حساب و اقرارنامه‌ها',
    description: 'درخواست ریزمحاسبه و پرداخت مطالبات پایان رابطه کاری.', tags: ['سنوات', 'عیدی', 'مرخصی', 'تسویه'],
    content: 'مدیریت محترم ........\nموضوع: درخواست پرداخت مطالبات پایان کار\n\nبا سلام؛ با توجه به پایان همکاری از تاریخ ........، خواهشمند است ریز محاسبات حقوق معوق، مزایای قانونی، عیدی و پاداش، مزایای پایان کار و مانده مرخصی قابل پرداخت تهیه و پس از تطبیق با سوابق کارکرد پرداخت شود. این درخواست به منزله اسقاط حقوق قانونی اینجانب نیست.\nنام و امضا: ........'
  },
  {
    id: 'fb-appeal', title: 'درخواست تجدیدنظر از رأی هیأت تشخیص', category: 'appeals', categoryLabel: 'اعتراض و پیگیری',
    description: 'نمونه متن اعتراض در مهلت مقرر قانونی به رأی هیأت تشخیص.', tags: ['اعتراض', 'هیأت تشخیص', 'ماده ۱۵۹'],
    content: 'ریاست محترم هیأت حل اختلاف اداره کار ........\nموضوع: اعتراض به رأی شماره ........\n\nاینجانب ........ در مهلت مقرر قانونی نسبت به رأی صادره از هیأت تشخیص اعتراض دارم. جهات اعتراض: ........ . با توجه به مدارک پیوست، تقاضای رسیدگی و صدور رأی شایسته را دارم.\nپیوست: تصویر رأی و مستندات\nنام و امضا: ........\nتوجه: مهلت و مرجع اعتراض را با متن رأی و مقررات جاری تطبیق دهید.'
  },
  {
    id: 'fb-accident', title: 'گزارش اولیه حادثه ناشی از کار', category: 'letters', categoryLabel: 'نامه‌های اداری',
    description: 'فرم ثبت اطلاعات اولیه حادثه برای ارائه به مراجع ذی‌صلاح.', tags: ['حادثه کار', 'ایمنی', 'تأمین اجتماعی'],
    content: 'گزارش حادثه ناشی از کار\nنام کارگاه: ........\nنام و مشخصات کارگر: ........\nتاریخ و ساعت حادثه: ........\nمحل و شرح دقیق حادثه: ........\nنوع آسیب و اقدامات درمانی: ........\nشاهدان/مستندات: ........\nنام و امضای مسئول کارگاه: ........\nاین فرم جایگزین تکالیف قانونی گزارش‌دهی به مراجع ذی‌صلاح نیست.'
  },
  {
    id: 'fb-retirement', title: 'درخواست بررسی سوابق و بازنشستگی', category: 'retirement', categoryLabel: 'بازنشستگی',
    description: 'درخواست بررسی سابقه پرداخت حق‌بیمه و شرایط بازنشستگی.', tags: ['بازنشستگی', 'ماده ۷۶', 'سوابق بیمه'],
    content: 'مدیریت محترم شعبه تأمین اجتماعی ........\nموضوع: درخواست بررسی سوابق بیمه و شرایط بازنشستگی\n\nاینجانب ........ با شماره بیمه ........ تقاضا دارم سوابق پرداخت حق‌بیمه و شرایط بازنشستگی اینجانب وفق قانون تأمین اجتماعی و مقررات جاری بررسی و نتیجه اعلام شود.\nپیوست: تصویر مدارک هویتی و سوابق\nنام و امضا: ........'
  }
];

// در صورت نبود یا خالی بودن هر نوع export، مخزن پشتیبان کامل‌تر نمایش داده می‌شود.
const ALL_TEMPLATES: TemplateItem[] = EXTRACTED_TEMPLATES.length > 0 ? EXTRACTED_TEMPLATES : EMERGENCY_FALLBACK_TEMPLATES;

export default function DadKarApp() {
  // تب‌های اصلی اپلیکیشن: اضافه شدن تب خانه (home)
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'tamin' | 'templates' | 'laws' | 'faq' | 'contact'>('home');

  // --- وضعیت‌های پیشرفته تنظیمات دادکار ---
    type AppTheme = 'light' | 'dark' | 'sepia' | 'navy' | 'emerald';

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('dadkar_theme') as AppTheme) || 'light';
  });
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('dadkar_font') || 'Vazirmatn';
  });
  const [fontSizePx, setFontSizePx] = useState<number>(() => {
    const saved = localStorage.getItem('dadkar_font_size_px');
    return saved ? parseInt(saved, 10) : 14;
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('dadkar_contrast') === 'true';
  });
  const [hapticFeedback, setHapticFeedback] = useState<boolean>(() => {
    return localStorage.getItem('dadkar_haptic') !== 'false';
  });
  const [faNumbersOnly, setFaNumbersOnly] = useState<boolean>(() => {
    return localStorage.getItem('dadkar_fa_num') === 'true';
  });

  const handleThemeSelect = (theme: AppTheme) => {
    setAppTheme(theme);
    localStorage.setItem('dadkar_theme', theme);
  };

  const handleContrastToggle = (val: boolean) => {
    setHighContrast(val);
    localStorage.setItem('dadkar_contrast', String(val));
  };

  const handleHapticToggle = (val: boolean) => {
    setHapticFeedback(val);
    localStorage.setItem('dadkar_haptic', String(val));
    if (val && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const handleFaNumbersToggle = (val: boolean) => {
    setFaNumbersOnly(val);
    localStorage.setItem('dadkar_fa_num', String(val));
  };


  
  // استیت‌های بنر اسلایدر صفحه اصلی
  const [activeBanner, setActiveBanner] = useState<number>(0);
  const banners = [
    {
      title: 'محاسبات جامع حقوق و دستمزد',
      desc: 'محاسبه سنوات، اضافه‌کاری، نوبت‌کاری، مرخصی و مستمری طبق قانون',
      badge: 'موتور محاسباتی دقیق',
      tab: 'calculator' as const,
      color: 'from-blue-600 via-indigo-600 to-sky-500'
    },
    {
      title: 'نقشه و شعب تأمین اجتماعی سراسر کشور',
      desc: 'نشانی، نقشه و شماره تماس مستقیم تمام شعب فعال سراسر کشور',
      badge: 'بانک جامع شعب',
      tab: 'tamin' as const,
      color: 'from-indigo-600 via-purple-600 to-pink-500'
    },
    {
      title: 'مخزن بیش از ۱۰۰ قالب رسمی و قرارداد کار',
      desc: 'دادخواست اداره کار، استعفانامه، تسویه‌حساب و قراردادهای کار',
      badge: '۱۰۵ قالب اداری',
      tab: 'templates' as const,
      color: 'from-emerald-600 via-teal-600 to-cyan-500'
    },
    {
      title: 'پایگاه هوشمند قوانین کار و تأمین اجتماعی',
      desc: 'متن کامل قوانین کار، تأمین اجتماعی، بیمه بیکاری و آرای وحدت رویه',
      badge: 'پایگاه معتبر قوانین',
      tab: 'laws' as const,
      color: 'from-amber-600 via-orange-600 to-rose-500'
    }
  ];

  // تغییر خودکار اسلایدر صفحه اصلی هر ۵ ثانیه
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [banners.length]);

  // لودینگ اولیه منحصر به فرد و مدرن
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 250);
          return 100;
        }
        return prev + 12;
      });
    }, 70);
    return () => clearInterval(timer);
  }, []);

  // بخش محاسبات: سقف دستمزد ۱۰۰,۰۰۰,۰۰۰,۰۰۰ ریال (۱۰ میلیارد تومان)
  const MAX_SALARY_RIAL = 100000000000; 
  const [baseSalary, setBaseSalary] = useState<number>(100000000); // پیش‌فرض ۱۰ میلیون تومان
  const [salaryInputText, setSalaryInputText] = useState<string>('100000000');

  const [activeCalc, setActiveCalc] = useState<string>('salary');
  const [years, setYears] = useState<number>(1);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10);
  const [shiftType, setShiftType] = useState<string>('morning_evening');
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(5);
  const [dependents, setDependents] = useState<number>(1);
  const [unemploymentMonths, setUnemploymentMonths] = useState<number>(24);
  const [insuranceYears, setInsuranceYears] = useState<number>(30); // سنوات مستمری

  // پایه سنوات: مستقل از دستمزد و وابسته به سابقه کار (مصوبه شورای عالی کار)
  const [workHistoryYears, setWorkHistoryYears] = useState<number>(1);

  // جستجو در قوانین و قالب‌ها
  const [lawSearchQuery, setLawSearchQuery] = useState('');
  const [selectedLawCategory, setSelectedLawCategory] = useState('همه قوانین');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  // Load More و اسکرول قالب‌ها و قوانین
  const [templateVisibleCount, setTemplateVisibleCount] = useState<number>(10);
  const [templateLoadStep] = useState<number>(10); // هر بار ۱۰ قالب بیشتر برای رندر روان روی موبایل
  const [lawVisibleCount, setLawVisibleCount] = useState<number>(10);
  const templateListRef = React.useRef<HTMLDivElement | null>(null);

  // اجازه خالی ماندن کادر هنگام پاک کردن بدون تبدیل ناخواسته به صفر
  const handleSalaryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    if (!raw) {
      setSalaryInputText('');
      setBaseSalary(0);
      return;
    }
    const num = Math.min(parseInt(raw, 10), MAX_SALARY_RIAL);
    setBaseSalary(num);
    setSalaryInputText(num.toLocaleString('en-US'));
  };

  const handleSalaryTextBlur = () => {
    if (!salaryInputText || baseSalary === 0) {
      setSalaryInputText('0');
      setBaseSalary(0);
    } else {
      setSalaryInputText(baseSalary.toLocaleString('en-US'));
    }
  };


  const handleSliderSalaryChange = (val: number) => {
    setBaseSalary(val);
    setSalaryInputText(val.toLocaleString('en-US'));
  };

  // محاسبات دقیق مطابق موازین قانونی
  const calculations = useMemo(() => {
    const dailyWage = baseSalary / 30;
    const hourlyWage = baseSalary / 220;

    // ۱. حق سنوات پایان خدمت (ماده ۲۴ قانون کار)
    const totalWorkingDays = (years * 365) + (months * 30) + days;
    const severancePay = (baseSalary / 365) * totalWorkingDays;

    // ۲. اضافه کاری (ماده ۵۹ قانون کار - ۴۰٪ مازاد)
    const overtimePay = hours * hourlyWage * 1.4;

    // ۳. فوق‌العاده نوبت‌کاری (مواد ۵۵ و ۵۶ قانون کار)
    let shiftMultiplier = 0.10;
    if (shiftType === 'morning_afternoon_night') shiftMultiplier = 0.15;
    if (shiftType === 'morning_night' || shiftType === 'afternoon_night') shiftMultiplier = 0.225;
    const shiftPay = baseSalary * shiftMultiplier;

    // ۴. بازخرید مانده مرخصی (ماده ۶۶ قانون کار بر مبنای آخرین مزد روزانه)
    const leavePay = unworkedLeaveDays * dailyWage;

    // ۵. شب‌کاری عادی غیرنوبتی (ماده ۵۸ قانون کار - ۳۵٪ مازاد)
    const nightPay = hours * hourlyWage * 0.35;

    // ۶. پایه سنوات طبق مصوبه شورای عالی کار (مبلغ ثابت روزانه ۲,۱۰۰,۰۰۰ ریال در ماه به ازای هر سال سابقه بعد از سال اول)
    const baseSanavatDailyRate = 70000; // ۷۰,۰۰۰ ریال روزانه مصوب
    const sanavatMonthly = workHistoryYears >= 1 ? (workHistoryYears * baseSanavatDailyRate * 30) : 0;

    // ۷. حق‌بیمه اجباری کارگری (ماده ۲۸ تأمین اجتماعی)
    const insuranceWorker = baseSalary * 0.07;
    const insuranceEmployer = baseSalary * 0.20;
    const insuranceGov = baseSalary * 0.03;
    const insuranceTotal = baseSalary * 0.30;

    // ۸. بیمه اختیاری، مشاغل آزاد و زنان خانه‌دار
    const voluntaryInsurance = baseSalary * 0.27; // اختیاری ۲۷٪
    const housewife12 = baseSalary * 0.12; // ۱۲٪ بازنشستگی
    const housewife14 = baseSalary * 0.14; // ۱۴٪ بازنشستگی و فوت
    const housewife18 = baseSalary * 0.18; // ۱۸٪ کامل با ازکارافتادگی

    // ۹. مقرری بیمه بیکاری (جدول ماده ۷ قانون بیمه بیکاری)
    const isMarried = dependents > 0;
    let maxUnemploymentMonths = 6;
    if (unemploymentMonths >= 6 && unemploymentMonths <= 24) maxUnemploymentMonths = isMarried ? 12 : 6;
    else if (unemploymentMonths >= 25 && unemploymentMonths <= 120) maxUnemploymentMonths = isMarried ? 18 : 12;
    else if (unemploymentMonths >= 121 && unemploymentMonths <= 180) maxUnemploymentMonths = isMarried ? 26 : 14;
    else if (unemploymentMonths >= 181 && unemploymentMonths <= 240) maxUnemploymentMonths = isMarried ? 36 : 18;
    else if (unemploymentMonths > 240) maxUnemploymentMonths = isMarried ? 50 : 36;

    const benefitRate = Math.min(0.55 + Math.min(dependents, 4) * 0.10, 0.80);
    const monthlyUnemploymentBenefit = baseSalary * benefitRate;

    // ۱۰. مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی): صرفاً تابع میانگین دستمزد و سنوات
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
      voluntaryInsurance,
      housewife12,
      housewife14,
      housewife18,
      maxUnemploymentMonths,
      monthlyUnemploymentBenefit,
      pensionEstimate
    };
  }, [baseSalary, years, months, days, hours, shiftType, unworkedLeaveDays, dependents, unemploymentMonths, insuranceYears, workHistoryYears]);

  const formatRial = (val: number) => {
    return Math.round(val).toLocaleString('fa-IR') + ' ریال';
  };

  const copyTemplateContent = (tmpl: TemplateItem) => {
    const done = () => {
      setCopiedTemplateId(tmpl.id);
      setTimeout(() => setCopiedTemplateId(null), 2500);
    };

    // مسیر اصلی: Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(tmpl.content).then(done).catch(() => {
        copyViaTextareaFallback(tmpl.content, done);
      });
      return;
    }
    // fallback اضطراری: textarea مخفی + execCommand (برای وب‌ویو اندروید و مرورگرهای قدیمی)
    copyViaTextareaFallback(tmpl.content, done);
  };

  // کپی با textarea مخفی و execCommand('copy')
  const copyViaTextareaFallback = (text: string, onDone: () => void) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      ta.style.pointerEvents = 'none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) onDone();
    } catch (e) {
      try { document.body.removeChild(document.querySelector('textarea[data-dadkar-copy]') as HTMLTextAreaElement); } catch (_) {}
    }
  };

  // لودینگ شیک، اختصاصی و نئومورفیک
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#090D16] flex flex-col items-center justify-center p-6 text-white z-50 overflow-hidden font-sans select-none" dir="rtl">
        {/* هاله و نور پس‌زمینه */}
        <div className="absolute w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col items-center max-w-sm w-full z-10 text-center">
          
          {/* آیکون ترازوی نورانی دادکار */}
          <div className="relative mb-7">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_35px_rgba(37,99,235,0.4)]">
              <div className="w-full h-full bg-[#0d1322] rounded-[22px] flex items-center justify-center">
                <Scale className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-400 w-7 h-7 rounded-full border-2 border-[#090D16] flex items-center justify-center shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-300 mb-1.5">
            سامانه تخصصی دادکار
          </h1>
          <p className="text-xs text-slate-400 font-medium mb-8">
            دستیار هوشمند حقوق کار، تأمین اجتماعی و محاسبات قانونی
          </p>

          {/* خط بارگذاری متحرک نئونی */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 border border-slate-700/60 shadow-inner mb-3 overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-200 ease-out shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span className="flex items-center gap-1.5 text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
              آماده‌سازی پایگاه جامع...
            </span>
            <span className="font-bold text-cyan-300">{loadingProgress}٪</span>
          </div>
        </div>

        <div className="absolute bottom-6 text-[11px] text-slate-500 tracking-wide font-medium">
          مطابق با آخرین بخشنامه‌های شورای عالی کار و تأمین اجتماعی
        </div>
      </div>
    );
  }

  return (
<div 
  className={`min-h-screen pb-20 select-none transition-colors duration-200 theme-${appTheme} ${
    highContrast ? 'force-high-contrast' : ''
  }`} 
  style={{ 
    fontFamily: fontFamily,
    fontSize: `${fontSizePx}px`
  }}
  dir="rtl"
>
  {/* بارگذاری فونت‌های فارسی استاندارد و استایل‌های پنج تم کاملاً مجزا */}
  <style>{`
    @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
    @import url('https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css');
    @import url('https://cdn.jsdelivr.net/gh/rastikerdar/samim-font@v4.0.5/dist/font-face.css');
    @import url('https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css');

    /* تم ۱: شب تاریک (دارک کهکشانی) */
    .theme-dark { background-color: #0b0f19 !important; color: #f1f5f9 !important; }
    .theme-dark .bg-white { background-color: #111827 !important; color: #f3f4f6 !important; border-color: #1f2937 !important; }
    .theme-dark .bg-slate-50, .theme-dark .bg-slate-100 { background-color: #1f2937 !important; color: #e5e7eb !important; }
    .theme-dark .text-slate-900, .theme-dark .text-slate-800, .theme-dark .text-slate-700 { color: #f9fafb !important; }
    .theme-dark .text-slate-600, .theme-dark .text-slate-500 { color: #9ca3af !important; }
    .theme-dark .border-slate-200, .theme-dark .border-slate-100 { border-color: #374151 !important; }
    .theme-dark header, .theme-dark nav { background-color: rgba(17, 24, 39, 0.95) !important; border-color: #1f2937 !important; }
    .theme-dark input:not([type="range"]), .theme-dark select { background-color: #1f2937 !important; color: #ffffff !important; border-color: #4b5563 !important; }

    /* تم ۲: کاغذی و کتابخوان (سپیا - گرم و ملایم برای چشم) */
    .theme-sepia { background-color: #fbf0d9 !important; color: #433422 !important; }
    .theme-sepia .bg-white { background-color: #f4e3c1 !important; color: #2d2419 !important; border-color: #e4cd9f !important; }
    .theme-sepia .bg-slate-50, .theme-sepia .bg-slate-100 { background-color: #edd5a8 !important; color: #3c2f21 !important; }
    .theme-sepia .text-slate-900, .theme-sepia .text-slate-800, .theme-sepia .text-slate-700 { color: #231b11 !important; }
    .theme-sepia .text-slate-600, .theme-sepia .text-slate-500 { color: #5c4731 !important; }
    .theme-sepia .border-slate-200, .theme-sepia .border-slate-100 { border-color: #dac092 !important; }
    .theme-sepia header, .theme-sepia nav { background-color: rgba(244, 227, 193, 0.96) !important; border-color: #d6bc8b !important; }
    .theme-sepia input:not([type="range"]), .theme-sepia select { background-color: #fdf6e7 !important; color: #2d2419 !important; border-color: #d6bc8b !important; }

    /* تم ۳: لاجوردی سازمانی (سرمه‌ای اداری شیک) */
    .theme-navy { background-color: #0d1b2a !important; color: #e0e1dd !important; }
    .theme-navy .bg-white { background-color: #1b263b !important; color: #ffffff !important; border-color: #415a77 !important; }
    .theme-navy .bg-slate-50, .theme-navy .bg-slate-100 { background-color: #24344d !important; color: #e0e1dd !important; }
    .theme-navy .text-slate-900, .theme-navy .text-slate-800, .theme-navy .text-slate-700 { color: #ffffff !important; }
    .theme-navy .text-slate-600, .theme-navy .text-slate-500 { color: #a4b3c6 !important; }
    .theme-navy .border-slate-200, .theme-navy .border-slate-100 { border-color: #2e435e !important; }
    .theme-navy header, .theme-navy nav { background-color: rgba(27, 38, 59, 0.96) !important; border-color: #415a77 !important; }
    .theme-navy input:not([type="range"]), .theme-navy select { background-color: #24344d !important; color: #ffffff !important; border-color: #415a77 !important; }

    /* تم ۴: زمردین یشمی (سبز آرامش‌بخش تیره) */
    .theme-emerald { background-color: #062319 !important; color: #e6f4ea !important; }
    .theme-emerald .bg-white { background-color: #0b3829 !important; color: #ffffff !important; border-color: #165b43 !important; }
    .theme-emerald .bg-slate-50, .theme-emerald .bg-slate-100 { background-color: #124b37 !important; color: #d1fae5 !important; }
    .theme-emerald .text-slate-900, .theme-emerald .text-slate-800, .theme-emerald .text-slate-700 { color: #ffffff !important; }
    .theme-emerald .text-slate-600, .theme-emerald .text-slate-500 { color: #a7f3d0 !important; }
    .theme-emerald .border-slate-200, .theme-emerald .border-slate-100 { border-color: #1b6d51 !important; }
    .theme-emerald header, .theme-emerald nav { background-color: rgba(11, 56, 41, 0.96) !important; border-color: #165b43 !important; }
    .theme-emerald input:not([type="range"]), .theme-emerald select { background-color: #124b37 !important; color: #ffffff !important; border-color: #228464 !important; }

    /* اصلاح اصولی کنتراست بالا بدون فیلتر مخرب ابعاد */
    .force-high-contrast * {
      border-color: #000000 !important;
      font-weight: 600 !important;
    }
    .theme-dark.force-high-contrast *, .theme-navy.force-high-contrast *, .theme-emerald.force-high-contrast * {
      border-color: #ffffff !important;
      color: #ffffff !important;
    }
  `}</style>



      
      {/* هدر اپلیکیشن */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-right focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-lg leading-tight">دادکار</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">نسخه جامع</span>
              </div>
              <p className="text-[10px] text-slate-500">پایگاه جامع روابط کار و سازمان تأمین اجتماعی</p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-xl transition border ${
                themeMode === 'dark' 
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="تنظیمات سامانه"
              aria-label="تنظیمات"
            >
              <Settings className="w-4 h-4" />
            </button>
    
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-bold transition border border-blue-200"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">شروع محاسبات</span>
            </button>
          </div>

        </div>
      </header>

      {/* محتوای صفحات */}
      <main className="max-w-5xl mx-auto px-4 py-5">

        {/* ===================== ۱. صفحه اصلی (HOME) با بنر اسلایدر و آیکون‌ها ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* اسلایدر بنر بالا */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 text-white">
              <div className={`p-5 sm:p-6 bg-gradient-to-br ${banners[activeBanner].color} transition-colors duration-700 min-h-[200px] h-[210px] sm:h-[200px] overflow-hidden flex flex-col justify-between`}>
                <div className="space-y-1.5 min-h-0">
                  <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20">
                    {banners[activeBanner].badge}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black leading-snug line-clamp-1">{banners[activeBanner].title}</h2>
                  <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {banners[activeBanner].desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
                  <button
                    onClick={() => setActiveTab(banners[activeBanner].tab)}
                    className="flex items-center gap-1 text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-xl shadow-md hover:bg-slate-100 transition"
                  >
                    <span>ورود به این بخش</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* نقطه‌های اسلایدر */}
                  <div className="flex items-center gap-1.5">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBanner(idx)}
                        className={`h-2 rounded-full transition-all ${activeBanner === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* بخش دسترسی سریع و آیکون‌های مینیمال */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>دسترسی سریع به امکانات دادکار</span>
                </h3>
                <span className="text-[11px] text-slate-400">تمام ماژول‌ها به‌روز</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* دکمه محاسبات */}
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition text-right group flex flex-col justify-between h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">ماشین‌حساب حقوق و بیمه</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">سنوات، مرخصی، نوبت‌کاری و مستمری</p>
                  </div>
                </button>

                {/* دکمه شعب تأمین */}
                <button
                  onClick={() => setActiveTab('tamin')}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition text-right group flex flex-col justify-between h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">شعب تأمین اجتماعی</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">نقشه، نشانی و تماس مستقیم شعب</p>
                  </div>
                </button>

                {/* دکمه قالب‌ها */}
                <button
                  onClick={() => setActiveTab('templates')}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition text-right group flex flex-col justify-between h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">مخزن ۱۰۵ قالب رسمی</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">قرارداد، دادخواست و استعفانامه‌ها</p>
                  </div>
                </button>

                {/* دکمه قوانین */}
                <button
                  onClick={() => setActiveTab('laws')}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition text-right group flex flex-col justify-between h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">پایگاه جامع قوانین کار</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">مواد قانون کار و تأمین اجتماعی</p>
                  </div>
                </button>

                {/* دکمه بیمه زنان خانه‌دار */}
                <button
                  onClick={() => { setActiveTab('calculator'); setActiveCalc('voluntary'); }}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-pink-300 transition text-right group flex flex-col justify-between h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">بیمه زنان خانه‌دار</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">نرخ‌های ۱۲، ۱۴ و ۱۸ درصد</p>
                  </div>
                </button>

                {/* دکمه راهنما و سوالات */}
                <button
                  onClick={() => setActiveTab('faq')}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition text-right group flex flex-col justify-between h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">پرسش و پاسخ روابط کار</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">پاسخ رسمی به ابهامات کارگری</p>
                  </div>
                </button>

              </div>
            </div>

            {/* کارت راهنما و اطلاعات مبنا */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 text-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] bg-blue-700/60 px-2 py-0.5 rounded font-bold">مبنای استناد</span>
                <h4 className="text-xs font-bold">محاسبات بر اساس آخرین بخشنامه مصوب شورای عالی کار</h4>
                <p className="text-[10px] text-blue-200">سقف ورودی دستمزد تا ۱۰ میلیارد تومان (۱۰۰ میلیارد ریال)</p>
              </div>
              <button 
                onClick={() => setActiveTab('calculator')}
                className="bg-white text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 hover:bg-blue-50 transition"
              >
                ورود
              </button>
            </div>

          </div>
        )}

        {/* ===================== ۲. تب محاسبات تخصصی ===================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-5">
            
            {/* کارت دستمزد با سقف ۱۰ میلیارد تومان و ورودی کاملاً اصلاح‌شده */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800 text-base">دستمزد مبنای محاسبه</h2>
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-500 ml-1">مبلغ فعال:</span>
                  <span className="text-base font-black text-blue-700">{formatRial(baseSalary)}</span>
                </div>
              </div>

              {/* ورودی دستی اصلاح‌شده بدون قفل‌شدن عدد یا تک‌رقمی ماندن */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                  <label htmlFor="salaryInput">وارد کردن مبلغ به ریال (سقف ۱۰ میلیارد تومان = ۱۰۰,۰۰۰,۰۰۰,۰۰۰ ریال):</label>
                  <span className="text-[11px] text-slate-400 font-mono">حداکثر ۱۰۰ میلیارد ریال</span>
                </div>
                <div className="relative">
                  <input
                    id="salaryInput"
                    type="text"
                    dir="ltr"
                    value={salaryInputText}
                    onChange={handleSalaryTextChange}
                    onBlur={handleSalaryTextBlur}
                    placeholder="مبلغ مورد نظر را وارد نمایید..."
                    className="w-full h-12 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-base"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-sans pointer-events-none">ریال</span>
                </div>
              </div>

              {/* اسلایدر تنظیم سریع با سقف ۱۰۰ میلیارد ریال */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>اهرم تنظیم سریع:</span>
                  <span className="font-mono text-blue-600 font-bold">{formatRial(baseSalary)}</span>
                </div>
                <input
                  type="range"
                  min={50000000}
                  max={MAX_SALARY_RIAL}
                  step={50000000}
                  value={baseSalary}
                  onChange={(e) => handleSliderSalaryChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* مقادیر قانونی و استاندارد */}
              <div className="pt-2">
                <div className="text-[11px] text-slate-500 mb-2 font-medium">مقادیر پایه مصوب شورای عالی کار:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { setBaseSalary(71661840); setSalaryInputText('71,661,840'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل مزد ۳۰ روزه</div>
                    <div className="text-xs font-bold text-slate-800">۷۱,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(103661840); setSalaryInputText('103,661,840'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل دریافتی مجرد</div>
                    <div className="text-xs font-bold text-slate-800">۱۰۳,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(200000000); setSalaryInputText('200,000,000'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">مزد ۲۰ تومانی</div>
                    <div className="text-xs font-bold text-slate-800">۲۰۰,۰۰۰,۰۰۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(501632880); setSalaryInputText('501,632,880'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">سقف مشمول بیمه (۷ برابر)</div>
                    <div className="text-xs font-bold text-slate-800">۵۰۱,۶۳۲,۸۸۰ ریال</div>
                  </button>
                </div>
              </div>

              {/* خلاصه پایه‌های مزد روزانه و ساعتی */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                  <span className="text-xs text-blue-900">مزد روزانه (۳۰ روزه):</span>
                  <span className="font-bold text-xs text-blue-800">{formatRial(calculations.dailyWage)}</span>
                </div>
                <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-900">مزد هر ساعت کار (۲۲۰ ساعت):</span>
                  <span className="font-bold text-xs text-indigo-800">{formatRial(calculations.hourlyWage)}</span>
                </div>
              </div>
            </div>

            {/* تب‌های انتخاب ماشین‌حساب تخصصی */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
              {[
                { id: 'salary', label: 'بیمه اجباری کارگری' },
                { id: 'voluntary', label: 'بیمه اختیاری و زنان خانه‌دار' },
                { id: 'severance', label: 'حق سنوات پایان کار' },
                { id: 'overtime', label: 'اضافه‌کاری' },
                { id: 'shift', label: 'نوبت‌کاری' },
                { id: 'night', label: 'شب‌کاری' },
                { id: 'leave', label: 'مانده مرخصی' },
                { id: 'sanavat', label: 'پایه سنوات تجمیعی' },
                { id: 'pension', label: 'برآورد مستمری بازنشستگی' },
                { id: 'unemployment', label: 'مقرری بیمه بیکاری' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveCalc(item.id)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                    activeCalc === item.id 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* کارت‌های محاسبات */}

            {/* ۱. بیمه اجباری ۳۰٪ */}
            {activeCalc === 'salary' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">تفکیک ۳۰٪ حق‌بیمه اجباری قانون کار و تأمین اجتماعی</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs text-emerald-700 font-bold mb-1">سهم کارگر (۷ درصد)</div>
                    <div className="text-lg font-black text-emerald-900">{formatRial(calculations.insuranceWorker)}</div>
                    <div className="text-[11px] text-emerald-600 mt-2">کسر از فیش حقوق ماهانه کارگر</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-xs text-blue-700 font-bold mb-1">سهم کارفرما (۲۰ درصد) + ۳٪ بیکاری</div>
                    <div className="text-lg font-black text-blue-900">{formatRial(calculations.insuranceEmployer + (baseSalary * 0.03))}</div>
                    <div className="text-[11px] text-blue-600 mt-2">تعهد کارفرما در لیست ماهانه</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-600 font-bold mb-1">مجموع واریزی کامل به سازمان (۳۰٪)</div>
                    <div className="text-lg font-black text-slate-900">{formatRial(calculations.insuranceTotal)}</div>
                    <div className="text-[11px] text-slate-500 mt-2">شامل درمان، بازنشستگی، فوت و بیکاری</div>
                  </div>
                </div>
              </div>
            )}

            {/* ۲. بیمه اختیاری و زنان خانه‌دار */}
            {activeCalc === 'voluntary' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">بیمه زنان خانه‌دار و حرف و مشاغل آزاد</h3>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <h4 className="font-bold text-sm text-slate-800">نرخ‌های سه‌گانه بیمه زنان خانه‌دار (قانون تأمین اجتماعی)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-pink-900">طرح ۱۲ درصد</span>
                        <span className="text-[10px] bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full font-bold">پایه</span>
                      </div>
                      <div className="text-lg font-black text-pink-950 my-1">{formatRial(calculations.housewife12)}</div>
                      <div className="text-[11px] text-pink-700 leading-relaxed">
                        شامل بازنشستگی و فوت پس از بازنشستگی (ویژه افراد بدون فرد تحت تکفل).
                      </div>
                    </div>

                    <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-purple-900">طرح ۱۴ درصد</span>
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">متوسط</span>
                      </div>
                      <div className="text-lg font-black text-purple-950 my-1">{formatRial(calculations.housewife14)}</div>
                      <div className="text-[11px] text-purple-700 leading-relaxed">
                        شامل بازنشستگی و فوت قبل و بعد از بازنشستگی (پرداخت مستمری به بازماندگان).
                      </div>
                    </div>

                    <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-indigo-900">طرح ۱۸ درصد</span>
                        <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">کامل‌ترین</span>
                      </div>
                      <div className="text-lg font-black text-indigo-950 my-1">{formatRial(calculations.housewife18)}</div>
                      <div className="text-[11px] text-indigo-700 leading-relaxed">
                        شامل بازنشستگی، فوت و ازکارافتادگی کلی.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h4 className="font-bold text-sm text-slate-800">بیمه اختیاری ۲۷ درصد (شامل درمان رایگان کامل)</h4>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-blue-800 font-bold">حق‌بیمه ماهانه (۲۷٪ کامل)</div>
                      <div className="text-[11px] text-blue-600 mt-1">شامل درمان کامل، بازنشستگی، فوت و ازکارافتادگی</div>
                    </div>
                    <div className="text-xl font-black text-blue-900">{formatRial(calculations.voluntaryInsurance)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ۳. سنوات پایان خدمت */}
            {activeCalc === 'severance' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-800">حق سنوات خدمت (ماده ۲۴ قانون کار)</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد سال:</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={years} 
                      onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد ماه:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="11" 
                      value={months} 
                      onChange={(e) => setMonths(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد روز:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="30" 
                      value={days} 
                      onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                  <span className="text-xs text-blue-900 font-bold">مبلغ سنوات قابل پرداخت:</span>
                  <span className="text-lg font-black text-blue-900">{formatRial(calculations.severancePay)}</span>
                </div>
              </div>
            )}

            {/* ۴. اضافه‌کاری */}
            {activeCalc === 'overtime' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">اضافه کاری (ماده ۵۹ قانون کار - ۴۰٪ مازاد)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">تعداد ساعات اضافه کاری در ماه:</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={hours} 
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                  />
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-900 font-bold">فوق‌العاده کل اضافه‌کاری:</span>
                  <span className="text-lg font-black text-indigo-900">{formatRial(calculations.overtimePay)}</span>
                </div>
              </div>
            )}

            {/* ۵. فوق‌العاده نوبت‌کاری */}
            {activeCalc === 'shift' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-800">فوق‌العاده نوبت‌کاری (مواد ۵۵ و ۵۶ قانون کار)</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 font-bold block">نوع شیفت چرخشی در ماه:</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 text-xs"
                  >
                    <option value="morning_evening">صبح و عصر (۱۰ درصد مازاد)</option>
                    <option value="morning_afternoon_night">صبح و عصر و شب (۱۵ درصد مازاد)</option>
                    <option value="morning_night">صبح و شب (۲۲.۵ درصد مازاد)</option>
                    <option value="afternoon_night">عصر و شب (۲۲.۵ درصد مازاد)</option>
                  </select>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span className="text-xs text-amber-950 font-bold">فوق‌العاده نوبت‌کاری ماهانه:</span>
                  <span className="text-lg font-black text-amber-950">{formatRial(calculations.shiftPay)}</span>
                </div>
              </div>
            )}

            {/* ۶. شب‌کاری عادی غیرنوبتی */}
            {activeCalc === 'night' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-5 h-5 text-indigo-900" />
                  <h3 className="font-bold text-slate-800">شب‌کاری غیرنوبتی (ماده ۵۸ قانون کار - ۳۵٪ مازاد)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">ساعات کار شبانه عادی (ساعت ۲۲ الی ۶ بامداد):</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={hours} 
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                  />
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-bold">فوق‌العاده شب‌کاری:</span>
                  <span className="text-lg font-black text-indigo-950">{formatRial(calculations.nightPay)}</span>
                </div>
              </div>
            )}

            {/* ۷. مانده مرخصی */}
            {activeCalc === 'leave' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-800">بازخرید مانده مرخصی استحقاقی (ماده ۶۶ قانون کار)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">تعداد روزهای استفاده‌نشده:</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="30"
                    value={unworkedLeaveDays} 
                    onChange={(e) => setUnworkedLeaveDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                  />
                </div>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 flex items-center justify-between">
                  <span className="text-xs text-teal-950 font-bold">مبلغ بازخرید مرخصی:</span>
                  <span className="text-lg font-black text-teal-950">{formatRial(calculations.leavePay)}</span>
                </div>
              </div>
            )}

            {/* ۸. پایه سنوات تجمیعی */}
            {activeCalc === 'sanavat' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-slate-800">پایه سنوات تجمیعی ماهانه (بخشنامه مصوب شورای عالی کار)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">تعداد سال‌های اشتغال در کارگاه فعلی (بیش از یک سال):</label>
                  <input
                    type="number"
                    min="0"
                    max="35"
                    value={workHistoryYears}
                    onChange={(e) => setWorkHistoryYears(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-xs text-blue-950 font-bold">پایه سنوات ماهانه (۳۰ روزه):</span>
                  <span className="text-lg font-black text-blue-950">{formatRial(calculations.sanavatMonthly)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * پایه سنوات رقم ثابت روزانه مصوب شورای عالی کار است و به کارگرانی با بیش از یک سال سابقه در کارگاه یکسان تعلق می‌گیرد.
                </div>
              </div>
            )}

            {/* ۹. برآورد مستمری بازنشستگی (کاملاً مطابق ماده ۷۷ و با ورودی عددی مستقیم سنوات) */}
            {activeCalc === 'pension' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Percent className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">برآورد مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 font-bold block">
                    تعداد سال‌های پرداخت حق‌بیمه (ورودی مستقیم عددی یا اسلایدر):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="35"
                      value={insuranceYears}
                      onChange={(e) => setInsuranceYears(Math.min(35, Math.max(10, parseInt(e.target.value) || 10)))}
                      className="w-24 p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center font-mono text-indigo-700"
                    />
                    <span className="text-xs text-slate-500">سال سابقه</span>
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={10}
                    max={35}
                    value={insuranceYears}
                    onChange={(e) => setInsuranceYears(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-bold">برآورد مستمری ماهانه بر اساس دستمزد انتخابی:</span>
                  <span className="text-lg font-black text-indigo-950">{formatRial(calculations.pensionEstimate)}</span>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  فرمول مصرح ماده ۷۷: (متوسط دستمزد مشمول کسر حق‌بیمه دو سال آخر × سابقه پرداخت حق‌بیمه) تقسیم بر ۳۰.
                </div>
              </div>
            )}

            {/* ۱۰. بیمه بیکاری */}
            {activeCalc === 'unemployment' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-800">مقرری بیمه بیکاری (جدول ماده ۷ قانون بیمه بیکاری)</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">ماه‌های سابقه قبلی:</label>
                    <input 
                      type="number" 
                      min="6" 
                      value={unemploymentMonths} 
                      onChange={(e) => setUnemploymentMonths(Math.max(6, parseInt(e.target.value) || 6))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد افراد تحت تکفل:</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="4"
                      value={dependents} 
                      onChange={(e) => setDependents(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="text-[11px] text-blue-700">حداکثر مدت دریافت مقرری:</div>
                    <div className="text-base font-black text-blue-900 mt-1">{calculations.maxUnemploymentMonths} ماه شمسی</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <div className="text-[11px] text-emerald-700">مقرری برآوردی ماهانه:</div>
                    <div className="text-base font-black text-emerald-900 mt-1">{formatRial(calculations.monthlyUnemploymentBenefit)}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== ۳. تب شعب تأمین اجتماعی ===================== */}
        {activeTab === 'tamin' && (
          <TaminBranchesView />
        )}

        {/* ===================== ۴. تب مخزن ۱۰۵ قالب حقوقی و رسمی ===================== */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-slate-800">مخزن ۱۰۵ قالب رسمی و قراردادهای کار</h2>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  {ALL_TEMPLATES.length} قالب آماده
                </span>
              </div>

              {/* نوار جستجوی زنده: عنوان، توضیحات، متن و تگ‌ها */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجوی زنده در عنوان، توضیحات، متن قالب و تگ‌ها..."
                  value={templateSearchQuery}
                  onChange={(e) => { setTemplateSearchQuery(e.target.value); setTemplateVisibleCount(10); }}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                {templateSearchQuery && (
                  <button
                    onClick={() => { setTemplateSearchQuery(''); setTemplateVisibleCount(10); }}
                    className="absolute left-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* دسته‌بندی‌ها با شمارنده تعداد قالب‌ها */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none font-bold">
                {[
                  { id: 'all', label: 'همه قالب‌ها' },
                  { id: 'contracts', label: 'قراردادها' },
                  { id: 'petitions', label: 'دادخواست‌ها' },
                  { id: 'letters', label: 'نامه‌ها' },
                  { id: 'settlements', label: 'تسویه‌حساب' },
                  { id: 'retirement', label: 'بازنشستگی' },
                  { id: 'unemployment', label: 'بیکاری' },
                  { id: 'appeals', label: 'ماده ۱۴۸' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedTemplateCategory(c.id); setTemplateVisibleCount(10); }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                      selectedTemplateCategory === c.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                    <span className={`mr-1.5 px-1.5 py-0.5 rounded-md text-[9px] ${
                      selectedTemplateCategory === c.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {c.id === 'all'
                        ? ALL_TEMPLATES.length
                        : ALL_TEMPLATES.filter(t => t.category === c.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* لیست اسناد و قالب‌ها با جستجوی زنده، هشتگ کلیک‌پذیر و Load More */}
            <div className="space-y-3" ref={templateListRef}>
              {(() => {
                const normalizedQuery = templateSearchQuery.trim();
                const filtered = ALL_TEMPLATES
                  .filter(t => selectedTemplateCategory === 'all' || t.category === selectedTemplateCategory)
                  .filter(t =>
                    !normalizedQuery ||
                    (t.title && t.title.includes(normalizedQuery)) ||
                    (t.description && t.description.includes(normalizedQuery)) ||
                    (t.content && t.content.includes(normalizedQuery)) ||
                    (t.tags && t.tags.some(tag => tag.includes(normalizedQuery)))
                  );
                const visible = filtered.slice(0, templateVisibleCount);
                return (
                  <>
                    {visible.map(tmpl => (
                      <div key={tmpl.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                              {tmpl.categoryLabel}
                            </span>
                            <h3 className="font-bold text-slate-800 text-sm mt-1">{tmpl.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
                          </div>
                          <button
                            onClick={() => copyTemplateContent(tmpl)}
                            className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                              copiedTemplateId === tmpl.id 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            {copiedTemplateId === tmpl.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedTemplateId === tmpl.id ? 'کپی شد' : 'کپی متن'}
                          </button>
                        </div>

                        <div className="relative rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden">
                          <button
                            onClick={() => copyTemplateContent(tmpl)}
                            aria-label={copiedTemplateId === tmpl.id ? 'متن کپی شد' : 'کپی متن قالب'}
                            className={`absolute left-2 top-2 z-10 p-2 rounded-lg shadow transition ${copiedTemplateId === tmpl.id ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-blue-600 text-white'}`}
                          >
                            {copiedTemplateId === tmpl.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 pl-14 pt-12 text-xs leading-7 font-mono select-text" dir="rtl">{tmpl.content}</pre>
                        </div>

                        {/* هشتگ‌های کلیک‌پذیر: فیلتر آنی + اسکرول به ابتدای لیست */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tmpl.tags.map((tag, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setTemplateSearchQuery(tag);
                                setTemplateVisibleCount(10);
                                if (templateListRef.current) {
                                  templateListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded-md transition ${
                                templateSearchQuery === tag
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {filtered.length === 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                        موردی مطابق جستجوی شما یافت نشد.
                      </div>
                    )}

                    {/* دکمه نمایش موارد بیشتر (Load More) برای رندر روان روی موبایل */}
                    {templateVisibleCount < filtered.length && (
                      <button
                        onClick={() => setTemplateVisibleCount(prev => prev + templateLoadStep)}
                        className="w-full py-3 bg-white border border-blue-200 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-50 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <ChevronDown className="w-4 h-4" />
                        نمایش موارد بیشتر ({filtered.length - templateVisibleCount} قالب باقی‌مانده)
                      </button>
                    )}

                    <p className="text-center text-[10px] text-slate-400">
                      نمایش {visible.length} از {filtered.length} قالب
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        )}

                {/* ===================== ۵. تب پایگاه قوانین ===================== */}
        {activeTab === 'laws' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800">پایگاه جامع قوانین و مقررات</h2>
                </div>
                <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  {EXTRACTED_LAWS.length} ماده قانونی
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجو در مواد قوانین کار، تأمین اجتماعی و کلمات کلیدی..."
                  value={lawSearchQuery}
                  onChange={(e) => { setLawSearchQuery(e.target.value); setLawVisibleCount(10); }}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                {lawSearchQuery && (
                  <button
                    onClick={() => { setLawSearchQuery(''); setLawVisibleCount(10); }}
                    className="absolute left-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
                {['همه قوانین', 'حقوق و دستمزد', 'بازنشستگی و ازکارافتادگی', 'بیمه بیکاری', 'مراجع حل اختلاف', 'حوادث ناشی از کار', 'مرخصی و ساعات کار', 'قراردادها و اخراج'].map(category => {
                  const categoryTerms: Record<string, string[]> = {
                    'حقوق و دستمزد': ['حقوق', 'مزد', 'دستمزد', 'عیدی', 'سنوات', 'حق‌السعی', 'اضافه‌کاری', 'مزایا'],
                    'بازنشستگی و ازکارافتادگی': ['بازنشستگی', 'ازکارافتادگی', 'مستمری', 'بازماندگان'],
                    'بیمه بیکاری': ['بیکاری', 'مقرری'],
                    'مراجع حل اختلاف': ['هیأت تشخیص', 'هیأت حل اختلاف', 'حل اختلاف', 'ماده ۱۵۷', 'ماده ۱۵۹'],
                    'حوادث ناشی از کار': ['حادثه', 'حوادث', 'ایمنی', 'ماده ۹۱', 'ماده ۹۵'],
                    'مرخصی و ساعات کار': ['مرخصی', 'ساعات کار', 'اضافه‌کاری', 'نوبت‌کاری', 'تعطیل', 'ماده ۶۴', 'ماده ۵۹'],
                    'قراردادها و اخراج': ['قرارداد', 'اخراج', 'فسخ', 'استعفا', 'ماده ۱۰', 'ماده ۲۱', 'ماده ۲۷']
                  };
                  const matchesCategory = (item: any) => {
                    if (category === 'همه قوانین') return true;
                    const terms = categoryTerms[category] || [];
                    const haystack = [item.category, item.title, item.subject, item.content, ...(Array.isArray(item.tags) ? item.tags : [])].filter(Boolean).join(' ');
                    return terms.some(term => haystack.includes(term));
                  };
                  const count = EXTRACTED_LAWS.filter(matchesCategory).length;
                  return <button key={category} onClick={() => { setSelectedLawCategory(category); setLawVisibleCount(10); }} className={`whitespace-nowrap px-3 py-1.5 rounded-full border font-bold transition ${selectedLawCategory === category ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50'}`}>
                    {category}<span className={`mr-1.5 px-1.5 rounded-full ${selectedLawCategory === category ? 'bg-white/20' : 'bg-slate-200'}`}>{count}</span>
                  </button>;
                })}
              </div>
            </div>

            <div className="space-y-3">
              {(() => {
                const nq = lawSearchQuery.trim();
                const categoryTerms: Record<string, string[]> = {
                  'حقوق و دستمزد': ['حقوق', 'مزد', 'دستمزد', 'عیدی', 'سنوات', 'حق‌السعی', 'اضافه‌کاری', 'مزایا'],
                  'بازنشستگی و ازکارافتادگی': ['بازنشستگی', 'ازکارافتادگی', 'مستمری', 'بازماندگان'],
                  'بیمه بیکاری': ['بیکاری', 'مقرری'],
                  'مراجع حل اختلاف': ['هیأت تشخیص', 'هیأت حل اختلاف', 'حل اختلاف', 'ماده ۱۵۷', 'ماده ۱۵۹'],
                  'حوادث ناشی از کار': ['حادثه', 'حوادث', 'ایمنی', 'ماده ۹۱', 'ماده ۹۵'],
                  'مرخصی و ساعات کار': ['مرخصی', 'ساعات کار', 'اضافه‌کاری', 'نوبت‌کاری', 'تعطیل', 'ماده ۶۴', 'ماده ۵۹'],
                  'قراردادها و اخراج': ['قرارداد', 'اخراج', 'فسخ', 'استعفا', 'ماده ۱۰', 'ماده ۲۱', 'ماده ۲۷']
                };
                const categoryFilter = (item: any) => {
                  if (selectedLawCategory === 'همه قوانین') return true;
                  const haystack = [item.category, item.title, item.subject, item.content, ...(Array.isArray(item.tags) ? item.tags : [])].filter(Boolean).join(' ');
                  return (categoryTerms[selectedLawCategory] || []).some(term => haystack.includes(term));
                };
                const filteredLaws = EXTRACTED_LAWS
                  .filter(categoryFilter)
                  .filter(item =>
                    !nq ||
                    (item.title && item.title.includes(nq)) || 
                    (item.content && item.content.includes(nq)) ||
                    (item.id && item.id.includes(nq)) ||
                    (item.subject && item.subject.includes(nq)) ||
                    (item.tags && item.tags.some((tag: string) => tag.includes(nq)))
                  );
                const visibleLaws = filteredLaws.slice(0, lawVisibleCount);
                return (
                  <>
                   {visibleLaws.map((law, idx) => {
                      // استخراج شماره و ارجاع فارسی
                      const idStr = String(law.id || '');
                      const numMatch = idStr.match(/\d+/);
                      const numFa = numMatch ? Number(numMatch[0]).toLocaleString('fa-IR') : `${idx + 1}`.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
                      
                      let refName = 'قانون کار';
                      let catFa = 'قانون کار';
                      if (idStr.startsWith('tam-') || idStr.startsWith('ss-') || law.category === 'tamin') {
                        refName = 'قانون تأمین اجتماعی';
                        catFa = 'تأمین اجتماعی';
                      } else if (idStr.startsWith('unemp-') || law.category === 'unemployment') {
                        refName = 'قانون بیمه بیکاری';
                        catFa = 'بیمه بیکاری';
                      } else if (idStr.startsWith('crt-') || law.category === 'court') {
                        refName = 'آرای دیوان و مراجع حل اختلاف';
                        catFa = 'مراجع حل اختلاف';
                      }
                    
                      const subtitle = `ماده ${numFa} ${refName}`;
                      const displayTitle = (law.title && !/^[a-z]+-\d+$/i.test(law.title) && !/^[a-z_]+$/i.test(law.title))
                        ? law.title
                        : (law.subject && !/^[a-z_]+$/i.test(law.subject))
                          ? law.subject
                          : subtitle;
                    
                      return (
                        <div key={law.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                              {catFa}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-800">{displayTitle}</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{law.content}</p>
                    
                          {/* هشتگ‌های قوانین */}
                          {law.tags && law.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {law.tags.map((tag: string, tIdx: number) => (
                                <button
                                  key={tIdx}
                                  onClick={() => { setLawSearchQuery(tag); setLawVisibleCount(10); }}
                                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md hover:bg-blue-100 hover:text-blue-700 transition"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}



                    {filteredLaws.length === 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                        موردی مطابق جستجوی شما یافت نشد.
                      </div>
                    )}

                    {/* صفحه‌بندی / Load More برای ۳۰۰ قانون */}
                    {lawVisibleCount < filteredLaws.length && (
                      <button
                        onClick={() => setLawVisibleCount(prev => prev + 10)}
                        className="w-full py-3 bg-white border border-blue-200 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-50 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <ChevronDown className="w-4 h-4" />
                        نمایش موارد بیشتر ({filteredLaws.length - lawVisibleCount} ماده باقی‌مانده)
                      </button>
                    )}

                    <p className="text-center text-[10px] text-slate-400">
                      نمایش {visibleLaws.length} از {filteredLaws.length} ماده قانونی
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        )}

                {/* ===================== ۶. راهنمای سامانه و پرسش‌های تخصصی ===================== */}
        {activeTab === 'faq' && (
          <div className="space-y-5">
            <section className="rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-5 text-white shadow-lg">
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /><h2 className="text-lg font-black">راهنمای جامع دادکار</h2></div>
              <p className="mt-2 text-xs leading-6 text-white/85">آموزش استفاده از ابزارهای سامانه و پاسخ‌های کاربردی درباره روابط کار و تأمین اجتماعی. پاسخ‌ها راهنمای عمومی‌اند و جایگزین بررسی پرونده و مقررات روز نیستند.</p>
            </section>
            <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />آموزش گام‌به‌گام کار با سامانه</h3>
              <ol className="space-y-3 text-xs text-slate-600 leading-6 list-decimal pr-5">
                <li><b>محاسبات حقوق:</b> وارد بخش «محاسبات» شوید؛ مبلغ مزد را به ریال بنویسید (جداکننده سه‌رقمی خودکار است)، سابقه/روزها و نوع محاسبه را تعیین کنید. خروجی برآوردی است؛ مبنای نهایی، مزد مشمول و مقررات سال مربوط است.</li>
                <li><b>استفاده از قالب‌ها:</b> در «قالب‌ها» عنوان یا موضوع را جستجو و دسته را انتخاب کنید. متن کامل هر نمونه در کادر قابل اسکرول دیده می‌شود؛ دکمه کپی گوشه کادر متن را در کلیپ‌بورد قرار می‌دهد. جاهای خالی را تکمیل و پیش از امضا با شرایط واقعی تطبیق دهید.</li>
                <li><b>استعلام قوانین:</b> در «قوانین» با شماره ماده، عبارت یا هشتگ جستجو کنید؛ چیپ‌های موضوعی نتایج را محدود می‌کنند. روی هشتگ بزنید تا همان موضوع جستجو شود.</li>
                <li><b>یافتن شعب تأمین اجتماعی:</b> از «شعب» استفاده کنید؛ استان/شهر یا نام شعبه را جستجو و نشانی، شماره تماس و مسیر نقشه را بررسی کنید. اطلاعات تماس ممکن است تغییر کند؛ پیش از مراجعه تلفنی تأیید کنید.</li>
                <li><b>راهنما و تماس:</b> پرسش خود را در جستجوی پایین وارد کنید یا از آکاردئون‌ها بهره ببرید. برای پیگیری اختصاصی از بخش «ارتباط با ما» استفاده کنید.</li>
              </ol>
            </section>
            <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2"><h3 className="font-black text-slate-900">پرسش‌های پرتکرار قانون کار و تأمین اجتماعی</h3><span className="text-[10px] rounded-full bg-blue-50 text-blue-700 px-2 py-1 font-bold">۲۴ پرسش</span></div>
              <div className="relative"><Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" /><input value={faqSearchQuery} onChange={e => setFaqSearchQuery(e.target.value)} placeholder="جستجو در پرسش‌ها..." className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs" /></div>
              {[
                {q:'سنوات پایان کار چگونه محاسبه می‌شود؟',a:'به موجب ماده ۲۴ قانون کار، برای هر سال سابقه کار، معادل یک ماه آخرین مزد (با رعایت اجزای مشمول) به عنوان مزایای پایان کار تعلق می‌گیرد؛ برای سابقه کمتر از سال، محاسبه به نسبت مدت کارکرد است. جزئیات مزد مبنا و رویه روز را با اسناد پرونده تطبیق دهید.'},
                {q:'عیدی و پاداش سالانه چه میزان است؟',a:'طبق قانون مربوط به عیدی و پاداش کارگران، معادل ۶۰ روز آخرین مزد برای یک سال کارکرد است، اما از سقف ۹۰ روز حداقل مزد روزانه همان سال تجاوز نمی‌کند؛ برای کارکرد کمتر از سال، تناسبی محاسبه می‌شود.'},
                {q:'بن کارگری و کمک‌هزینه مسکن به چه کسانی تعلق می‌گیرد؟',a:'این مزایا از اقلام مصوب مزدی شورای عالی کار برای کارگران مشمول قانون کار هستند و مبلغ هر سال در مصوبه/بخشنامه مزد تعیین می‌شود. مبلغ، شرایط شمول و نحوه درج باید با مصوبه همان سال و وضعیت استخدامی تطبیق داده شود.'},
                {q:'اگر کارفرما بیمه نکند، ماده ۱۴۸ چه حقی ایجاد می‌کند؟',a:'ماده ۱۴۸ قانون کار کارفرما را مکلف به بیمه‌کردن کارگران مشمول می‌کند. کارگر می‌تواند با ارائه دلایل رابطه کار و مدت اشتغال، از اداره کار و سازمان تأمین اجتماعی پیگیری احراز سابقه و وصول حق‌بیمه را درخواست کند؛ تشخیص با مراجع صالح است.'},
                {q:'پس از اخراج غیرموجه چگونه می‌توان بازگشت به کار خواست؟',a:'کارگر می‌تواند در مهلت قانونی به مراجع حل اختلاف اداره کار شکایت کند. در صورت احراز اخراج غیرموجه، ماده ۱۶۵ قانون کار امکان حکم بازگشت به کار و پرداخت حق‌السعی ایام بلاتکلیفی را پیش‌بینی کرده است؛ نتیجه تابع دلایل و رأی مرجع است.'},
                {q:'مرخصی استحقاقی سالانه چقدر است؟',a:'طبق ماده ۶۴ قانون کار، مرخصی استحقاقی سالانه با احتساب چهار جمعه، جمعاً یک ماه است و برای کار کمتر از یک سال به نسبت مدت کار محاسبه می‌شود. مشاغل خاص و توافق‌های معتبر ممکن است ضوابط تکمیلی داشته باشند.'},
                {q:'آیا کارفرما می‌تواند بابت حسن انجام کار سفته بگیرد؟',a:'دریافت سفته به‌خودی‌خود مجوز وصول یا ضبط بی‌ضابطه نیست. مبلغ، بابت، شماره، تاریخ و شرط استرداد را دقیق در رسید قید کنید، تصویر نگه دارید و از سفیدامضا دادن بپرهیزید. اختلاف درباره استحقاق، تابع قرارداد، دلیل و رسیدگی قضایی است.'},
                {q:'شرایط کلی دریافت بیمه بیکاری چیست؟',a:'بیکاری باید بدون میل و اراده بیمه‌شده رخ داده باشد و متقاضی مشمول قانون بیمه بیکاری، دارای سابقه لازم و آماده کار باشد. اعلام بیکاری و ثبت درخواست در مهلت قانونی (اصولاً ۳۰ روز از تاریخ بیکاری، با امکان بررسی عذر موجه) اهمیت دارد؛ مرجع ذی‌صلاح شرایط را احراز می‌کند.'},
                {q:'مشاغل سخت و زیان‌آور چه اثری بر بازنشستگی دارد؟',a:'سابقه واجد شرایط در مشاغل سخت و زیان‌آور با ضوابط قانونی و تأیید کمیته‌های مربوط احراز می‌شود؛ هر سال اشتغال واجد شرایط طبق مقررات می‌تواند با ضریب قانونی در سابقه محاسباتی منظور شود. صرف عنوان شغلی کافی نیست و شرایط کار و سوابق باید تأیید شود.'},
                {q:'شرایط بازنشستگی موضوع ماده ۷۶ چیست؟',a:'ماده ۷۶ قانون تأمین اجتماعی و اصلاحات و مقررات بعدی، مسیرهای مختلف بازنشستگی را بر اساس سن و سابقه بیان می‌کند. شرایط با جنسیت، سابقه پرداخت حق‌بیمه، مقررات انتقالی و اصلاحات جدید تغییرپذیر است؛ سوابق را از شعبه تأمین اجتماعی استعلام کنید.'},
                {q:'حادثه ناشی از کار را چه زمانی و چگونه گزارش کنیم؟',a:'کارفرما مکلف به رعایت مقررات ایمنی و گزارش حادثه به مراجع ذی‌ربط در مهلت مقرر است. حادثه را سریع ثبت، مدارک درمانی و مشخصات شاهدان را نگهداری و موضوع را از مسیر اداره کار و تأمین اجتماعی پیگیری کنید؛ مسئولیت و مزایا بر اساس بررسی و مستندات تعیین می‌شود.'},
                {q:'حق اولاد به چه کسی تعلق می‌گیرد؟',a:'کمک عائله‌مندی طبق ماده ۸۶ قانون تأمین اجتماعی به بیمه‌شده واجد شرایط پرداخت می‌شود؛ از جمله داشتن حداقل سابقه پرداخت حق‌بیمه مقرر و شرایط سنی/تحصیلی فرزند یا ازکارافتادگی کلی او. شرایط و تعداد قابل پرداخت را با مقررات جاری تطبیق دهید.'},
                {q:'اضافه‌کاری با چه نرخی محاسبه می‌شود؟',a:'ماده ۵۹ قانون کار اضافه‌کاری را منوط به موافقت کارگر و پرداخت ۴۰٪ اضافه بر مزد هر ساعت عادی می‌داند؛ ساعات کار اضافی روزانه نیز اصولاً محدودیت قانونی دارد و موارد استثنا تابع قانون است. مزد ساعتی باید از مزد قانونی مشمول محاسبه شود.'},
                {q:'فوق‌العاده نوبت‌کاری چند درصد است؟',a:'مواد ۵۵ و ۵۶ قانون کار نوبت‌کاری را بر اساس گردش نوبت تعریف می‌کنند: نوبت صبح و عصر ۱۰٪، صبح و عصر و شب ۱۵٪، و صبح و شب یا عصر و شب ۲۲.۵٪ فوق‌العاده دارد. تشخیص تابع برنامه واقعی نوبت‌هاست.'},
                {q:'ترک کار با استعفا چه تفاوتی دارد؟',a:'استعفا یکی از طرق خاتمه قرارداد موضوع ماده ۲۱ قانون کار است و کارگر باید استعفا را کتبی اعلام و یک ماه به کار ادامه دهد؛ تا ۱۵ روز امکان انصراف کتبی وجود دارد. ترک کار بدون رعایت تشریفات ممکن است اختلاف اثباتی و آثار قراردادی ایجاد کند و باید با مدارک سنجیده شود.'},
                {q:'مهلت ۳۰ روزه استعفا یعنی چه؟',a:'پس از اعلام کتبی استعفا، کارگر اصولاً موظف است یک ماه به کار ادامه دهد و می‌تواند ظرف ۱۵ روز از اعلام، استعفای خود را کتبی پس بگیرد. این مهلت با مهلت‌های شکایت یا بیمه بیکاری متفاوت است؛ متن ماده ۲۱ و قرارداد بررسی شود.'},
                {q:'مالیات حقوق چگونه تعیین می‌شود؟',a:'مالیات حقوق بر اساس قانون بودجه و نرخ‌ها، معافیت‌ها و پلکان‌های همان سال، پس از تعیین درآمد مشمول مالیات اعمال می‌شود. مزایای مشمول و معافیت‌ها ممکن است تغییر کنند؛ رقم نهایی را از جداول رسمی سال مربوط و فیش حقوقی کنترل کنید.'},
                {q:'آیا قرارداد کار حتماً باید کتبی باشد؟',a:'ماده ۷ قانون کار قرارداد کار را توافق کارگر و کارفرما می‌داند و کتبی یا شفاهی بودن را می‌پذیرد؛ با این حال قرارداد کتبی با درج دقیق موضوع، مزد، ساعات و مدت، برای اثبات حقوق طرفین توصیه می‌شود. قواعد آمره قانون کار قابل اسقاط نیستند.'},
                {q:'کارفرما در چه شرایطی می‌تواند قرارداد را فسخ یا کارگر را اخراج کند؟',a:'خاتمه قرارداد تابع ماده ۲۱ و سایر مواد قانون کار است. در قصور یا تخلف انضباطی، تشریفات ماده ۲۷ و اخذ نظر مراجع/تشکل‌های مقرر اهمیت دارد؛ اخراج بدون دلیل و تشریفات ممکن است در مرجع حل اختلاف غیرموجه شناخته شود.'},
                {q:'حداکثر ساعات کار عادی در هفته چقدر است؟',a:'ماده ۵۱ قانون کار ساعات کار عادی را اصولاً حداکثر ۸ ساعت در روز و ۴۴ ساعت در هفته تعیین می‌کند؛ توزیع ساعات با توافق در چارچوب قانون ممکن است. مشاغل و شرایط خاص مقررات ویژه دارند.'},
                {q:'آیا جمعه‌کاری و کار در تعطیل رسمی فوق‌العاده دارد؟',a:'جمعه روز تعطیل هفتگی با مزد است؛ کار در جمعه مستلزم تعطیل جایگزین و فوق‌العاده مقرر در ماده ۶۲ است. تعطیلات رسمی و کار در آن نیز باید با توجه به مقررات ساعات کار و اضافه‌کاری و رویه قابل اعمال محاسبه شود.'},
                {q:'آیا مرخصی استفاده‌نشده قابل پرداخت است؟',a:'ماده ۶۶ ذخیره بیش از ۹ روز مرخصی سالانه را مجاز نمی‌داند؛ در پایان کار، مطالبات مرخصی استحقاقی استفاده‌نشده طبق مقررات و میزان قابل احتساب تسویه می‌شود. سوابق مرخصی و مزد مبنا باید مستند باشد.'},
                {q:'چگونه به رأی هیأت تشخیص اعتراض می‌شود؟',a:'رأی هیأت تشخیص طبق ماده ۱۵۹ قانون کار در مهلت ۱۵ روز از ابلاغ، قابل اعتراض برای طرفین است و سپس هیأت حل اختلاف رسیدگی می‌کند. تاریخ ابلاغ، نحوه ثبت اعتراض و متن رأی را دقیق بررسی و مدارک را ضمیمه کنید.'},
                {q:'آیا کارفرما باید ریز فیش و سابقه بیمه را ارائه کند؟',a:'کارفرما مکلف به پرداخت به‌موقع مزد و حق‌بیمه و رعایت تکالیف قانونی است. فیش‌ها، قرارداد، گردش بانکی و سابقه ثبت‌شده نزد تأمین اجتماعی را نگهدارید؛ مغایرت را ابتدا مستند و سپس از مراجع صالح پیگیری کنید.'}
              ].filter(item => (item.q + item.a).includes(faqSearchQuery.trim())).map((item, i) => (
                <div key={item.q} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-3 p-3 text-right hover:bg-slate-50" aria-expanded={openFaq === i}>
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-800"><HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />{item.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0 text-blue-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                  </button>
                  {openFaq === i && <p className="px-4 pb-4 text-xs text-slate-600 leading-7">{item.a}</p>}
                </div>
              ))}
              {faqSearchQuery && ![
                'سنوات','عیدی','بن','ماده ۱۴۸','بازگشت به کار','مرخصی استحقاقی','سفته','بیمه بیکاری','سخت و زیان‌آور','بازنشستگی','حادثه','حق اولاد','اضافه‌کاری','نوبت‌کاری','ترک کار','استعفا','مالیات','قرارداد','اخراج','ساعات کار','جمعه‌کاری','مرخصی استفاده','هیأت تشخیص','فیش'
              ].some(t => faqSearchQuery.includes(t)) && <p className="text-xs text-slate-500 text-center">پرسشی مطابق عبارت جستجو یافت نشد.</p>}
            </section>
            <p className="text-[10px] text-slate-500 leading-5">یادآوری: این مطالب اطلاعات عمومی‌اند، تضمین نتیجه پرونده نیستند و باید با متن به‌روز قوانین، مصوبات سالانه و اسناد موردی تطبیق داده شوند.</p>
          </div>
        )}

        {/* ===================== ۷. ارتباط با ما ===================== */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4"><Scale className="w-6 h-6 text-cyan-300" /></div>
              <h2 className="text-2xl font-black">ارتباط با ما</h2>
              <p className="mt-3 text-sm leading-7 text-blue-100">دادکار سامانه‌ای برای دسترسی آسان به ابزارهای محاسبات حقوق و دستمزد، قالب‌های کاربردی، قوانین کار و تأمین اجتماعی و اطلاعات شعب است؛ هدف ما ساده‌سازی دسترسی به دانش و خدمات روابط کار برای کارگران، کارفرمایان و کارشناسان است.</p>
            </section>
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div><p className="text-xs text-slate-500">طراح و اجرا</p><p className="font-black text-slate-900 mt-1">سیدحسین حجازی</p></div>
              <div><p className="text-xs text-slate-500">شماره تماس</p><a href="tel:09138003216" className="inline-flex mt-1 items-center gap-2 font-bold text-blue-700" dir="ltr"><Phone className="w-4 h-4" />09138003216</a></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a href="tel:09138003216" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 text-xs font-bold"><Phone className="w-4 h-4" />تماس</a>
                <a href="sms:09138003216" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white py-3 text-xs font-bold"><MessageSquare className="w-4 h-4" />پیامک</a>
                <a href="mailto:info@dadkar.app" className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white py-3 text-xs font-bold"><Mail className="w-4 h-4" />ایمیل</a>
                <a href="https://dadkar.app" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-white py-3 text-xs font-bold"><Globe className="w-4 h-4" />وب‌سایت</a>
              </div>
              <p className="text-[10px] text-slate-400 leading-5">لینک ایمیل و وب‌سایت نمونه هستند و در صورت داشتن نشانی رسمی می‌توان آن‌ها را جایگزین کرد.</p>
            </section>
          </div>
        )}

      </main>

      {/* منوی فوتر ثابت تک‌خطی با ۶ گزینه دقیقاً در یک ردیف افقی بدون شکستن متن */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 z-40 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-7 gap-0.5 text-center">
          
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] whitespace-nowrap mt-0.5">صفحه اصلی</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center py-1 transition ${activeTab === 'calculator' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Calculator className="w-4 h-4" />
            <span className="text-[9px] whitespace-nowrap mt-0.5">محاسبات</span>
          </button>

          <button
            onClick={() => setActiveTab('tamin')}
            className={`flex flex-col items-center justify-center py-1 transition ${activeTab === 'tamin' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-[9px] whitespace-nowrap mt-0.5">شعب</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex flex-col items-center justify-center py-1 transition ${activeTab === 'templates' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[9px] whitespace-nowrap mt-0.5">قالب‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('laws')}
            className={`flex flex-col items-center justify-center py-1 transition ${activeTab === 'laws' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px] whitespace-nowrap mt-0.5">قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex flex-col items-center justify-center py-1 transition ${activeTab === 'faq' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-[9px] whitespace-nowrap mt-0.5">راهنما</span>
          </button>
              {/* دکمه هفتم: ارتباط با ما */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'contact' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] whitespace-nowrap">ارتباط با ما</span>
          </button>

        </div>
      </nav>
           {/* پاپ‌آپ جامع تنظیمات حرفه‌ای دادکار */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className={`w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl p-5 shadow-2xl border transition-all ${
              themeMode === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* سربرگ */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-inherit z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">تنظیمات پیشرفته دادکار</h3>
                  <p className="text-[10px] text-slate-400">سفارشی‌سازی ظاهر، فونت و تجربه کاربری</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 py-4">
            {/* ۱. انتخاب تم از بین ۵ تم کاملاً متمایز */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">انتخاب تم رنگی نرم‌افزار (۵ تم مجزا)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'light', name: 'روز (پیش‌فرض)', bg: 'bg-white', border: 'border-slate-300' },
                  { id: 'dark', name: 'شب کهکشانی', bg: 'bg-slate-950 text-white', border: 'border-slate-700' },
                  { id: 'sepia', name: 'کاغذی (سپیا)', bg: 'bg-[#fbf0d9] text-[#433422]', border: 'border-[#dac092]' },
                  { id: 'navy', name: 'لاجوردی اداری', bg: 'bg-[#0d1b2a] text-white', border: 'border-[#415a77]' },
                  { id: 'emerald', name: 'زمردین یشمی', bg: 'bg-[#062319] text-white', border: 'border-[#1b6d51]' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeSelect(t.id as AppTheme)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition ${t.bg} ${t.border} ${
                      appTheme === t.id ? 'ring-2 ring-blue-500 shadow-md' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-current"></span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ۲. انتخاب از بین ۵ فونت فارسی فعال و بارگذاری‌شده */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">نوع قلم متون (فونت)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Vazirmatn, sans-serif', name: 'وزیرمتن (اصلی)' },
                  { id: 'Sahel, sans-serif', name: 'ساحل (کتابی)' },
                  { id: 'Samim, sans-serif', name: 'صمیم (نرم و روان)' },
                  { id: 'Shabnam, sans-serif', name: 'شبنم (مدرن)' },
                  { id: 'Tahoma, Arial, sans-serif', name: 'تاهما (کلاسیک)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleFontChange(f.id)}
                    style={{ fontFamily: f.id }}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition ${
                      fontFamily === f.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>


              {/* ۳. گیج اسلایدر تنظیم دستی سایز فونت */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500">اندازه قلم متون (گیج اسلایدر)</label>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {fontSizePx} پیکسل
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="20"
                  step="1"
                  value={fontSizePx}
                  onChange={(e) => handleFontSizePxChange(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>بسیار ریز (۱۲)</span>
                  <span>استاندارد (۱۴)</span>
                  <span>بسیار خوانا (۲۰)</span>
                </div>
              </div>

              {/* ۴. تنظیمات تکمیلی (کنتراست، بازخورد لرزشی و اعداد) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-500 mb-1">امکانات تکمیلی</label>

                {/* کنتراست بالا */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-medium">افزایش کنتراست متن‌ها (خوانایی بهتر)</span>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => handleContrastToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* بازخورد لرزشی لمس */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-medium">بازخورد لرزشی لمس دکمه‌ها (Haptic)</span>
                  <input
                    type="checkbox"
                    checked={hapticFeedback}
                    onChange={(e) => handleHapticToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* نمایش اعداد فارسی */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-medium">قالب‌بندی کلیه ارقام به فارسی رسمی</span>
                  <input
                    type="checkbox"
                    checked={faNumbersOnly}
                    onChange={(e) => handleFaNumbersToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* پاورقی مودال */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
              >
                تأیید و ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
