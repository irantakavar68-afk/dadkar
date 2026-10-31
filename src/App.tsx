import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Users, FileText, ChevronRight, ChevronLeft, Phone, 
  MapPin, Clock, Search, HelpCircle, AlertCircle, 
  Scale, Calculator, BookOpen, ShieldCheck, Download, 
  Share2, ChevronDown, CheckCircle2, Award, Briefcase, 
  Percent, ArrowRight, X, ExternalLink, Sparkles, Sliders, 
  RefreshCw, Layers, Check, Info, FileSpreadsheet, Home,
  FileCheck2, ShieldAlert, Copy, Mail, Globe, MessageSquare,          
  ChevronUp, Settings, Moon, Sun, Type, MessageCircle, Send           
} from 'lucide-react';

import { User } from 'lucide-react';
import { AuthProfileModals, UserProfile, AVATAR_SVGS } from './AuthProfileModals';


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

const getJalaliToday = (): number[] => {
  const p = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric'
  }).formatToParts(new Date());
  const g = (t: string) => Number(p.find(x => x.type === t)!.value);
  return [g('year'), g('month'), g('day')];
};

const seniorityFromProfile = (start?: string) => {
  if (!start) return null;
  const [sy, sm, sd] = start.split('/').map(Number);
  if (!sy || !sm || !sd) return null;
  const [ty, tm, td] = getJalaliToday();
  let y = ty - sy, m = tm - sm, d = td - sd;
  if (d < 0) { d += 30; m--; }
  if (m < 0) { m += 12; y--; }
  if (y < 0) return null;
  return { y, m, d, totalMonths: y * 12 + m };
};

const toFa = (s: string | number) => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
const toEn = (s: string) =>
  s.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
   .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  // --- افزونه ۲: موتور چاپ و خروجی PDF فیش/قرارداد ---
    const handlePrintDocument = (elementId: string) => {
      const printContent = document.getElementById(elementId)?.innerHTML;
      if (!printContent) return;
      const win = window.open('', '', 'height=800,width=1000');
      win?.document.write('<html><head><title>فیش حقوقی - سامانه جامع دادکار</title>');
      win?.document.write(`
        <style>
          body { font-family: Tahoma, Vazirmatn, sans-serif; direction: rtl; padding: 30px; background: #fff; color: #111; }
          .print-footer { margin-top: 40px; text-align: center; font-size: 11px; color: #666; border-top: 1px dashed #ccc; padding-top: 15px; }
          .watermark { font-weight: bold; color: #047857; }
        </style>
      `);
      win?.document.write('</head><body>');
      win?.document.write(printContent);
      win?.document.write(`
        <div class="print-footer">
          این سند به صورت رسمی از <span class="watermark">سامانه جامع حقوق و دستمزد دادکار (daadkaar.ir)</span> صادر شده است.<br/>
          تاریخ صدور خروجی: ${new Date().toLocaleDateString('fa-IR')}
        </div>
      `);
      win?.document.write('</body></html>');
      win?.document.close();
      win?.focus();
      setTimeout(() => {
        win?.print();
        win?.close();
      }, 500);
    };




export default function App() {
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

  // تب‌های اصلی اپلیکیشن: اضافه شدن تب خانه (home)
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'tamin' | 'templates' | 'laws' | 'faq' | 'contact' | 'payslip' | 'tribunal'>('home');

  // --- وضعیت‌های پیشرفته تنظیمات دادکار ---
    type AppTheme = 'light' | 'dark';

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('dadkar_theme') as AppTheme) || 'light';
  });
  const [fontFamily, setFontFamily] = useState<string>(
    () => localStorage.getItem('dadkar_font') || 'Vazirmatn, Tahoma, sans-serif'
  );

  const [fontSizePx, setFontSizePx] = useState<number>(() => {
    const saved = localStorage.getItem('dadkar_font_size_px');
    return saved ? parseInt(saved, 10) : 14;
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('dadkar_contrast') === 'true';
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dadkar_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
        const saved = localStorage.getItem('dadkar_user');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
  return null;
}

  });
  const [showProfileModal, setShowProfileModal] = useState(false);
    // تیکت‌های پشتیبانی
  const [showTickets, setShowTickets] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [captchaOk, setCaptchaOk] = useState(false);

  useEffect(() => {
    if (token && (!user || !user.username || !user.first_name)) {
      localStorage.removeItem('dadkar_token');
      localStorage.removeItem('dadkar_user');
      setToken(null);
      setUser(null);
    }
  }, []);


  const handleThemeSelect = (theme: AppTheme) => {
    setAppTheme(theme);
    localStorage.setItem('dadkar_theme', theme);
  };


  
  const handleFontChange = (font: string) => {
    setFontFamily(font);
    localStorage.setItem('dadkar_font', font);
  };

  const handleFontSizePxChange = (size: number) => {
    setFontSizePx(size);
    localStorage.setItem('dadkar_font_size_px', size.toString());
  };

  const handleContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem('dadkar_contrast', checked.toString());
  };

  // دریافت خودکار و پویای نام ماه و سال جاری خورشیدی سیستم (بدون مقدار ثابتی)
  const getCurrentJalaliMonthLabel = () => {
    try {
      const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long' });
      return formatter.format(new Date());
    } catch {
      const jalaliMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      const [jy, jm] = typeof getJalaliToday === 'function' ? getJalaliToday() : [1405, 8];
      return `${jalaliMonths[jm - 1]} ${jy}`;
    }
  };

  // --- فیش حقوقی پویا متصل به پروفایل کاربر ---
      const [payslipData, setPayslipData] = useState({
    empName: user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'همکار گرامی'),
    nationalId: user?.username || user?.national_code || '---',
    workshopName: user?.company_name || 'کارگاه مشمول قانون کار',
    month: getCurrentJalaliMonthLabel(),
    baseSalary: Number(user?.last_salary_million_rial || 100) * 1_000_000,
    housingAllowance: 30000000, // ۳۰ میلیون ریال (حق مسکن)
    groceryAllowance: 22000000, // ۲۲ میلیون ریال (بن خواربار)
    childAllowance: (user?.children_count || 0) * 16625550, // ۱۶،۶۲۵،۵۵۰ ریال (حق اولاد)
    overtimeHours: 20,
    overtimeRate: Math.round((Number(user?.last_salary_million_rial || 100) * 1_000_000) / 220 * 1.4),
    insuranceDeduction: true,
    taxDeduction: false
  });

  useEffect(() => {
    if (user) {
      setPayslipData(prev => ({
        ...prev,
        empName: user.full_name || (user.first_name ? `${user.first_name} ${user.last_name}` : prev.empName),
        nationalId: user.username || user.national_code || prev.nationalId,
        workshopName: user.company_name || prev.workshopName,
        month: getCurrentJalaliMonthLabel(),
        baseSalary: Number(user.last_salary_million_rial || 100) * 1_000_000,
        childAllowance: (user?.children_count || 0) * 16625550,
        overtimeRate: Math.round((Number(user.last_salary_million_rial || 100) * 1_000_000) / 220 * 1.4)

      }));
    }
  }, [user]);





  
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

    // نمونه بهینه برای لودینگ ۴ ثانیه‌ای نرم:
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const duration = 4000; // دقیقاً ۴ ثانیه زمان بارگذاری
      const interval = 40;   // بروزرسانی روان هر ۴۰ میلی‌ثانیه یک بار
      const increment = 100 / (duration / interval);
    
      const timer = setInterval(() => {
        setLoadingProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(timer);
            setTimeout(() => setIsLoading(false), 250);
            return 100;
          }
          return next;
        });
      }, interval);
    
      return () => clearInterval(timer);
    }, []);



    // --- شبیه‌ساز حرفه‌ای ۱۵ مرحله‌ای هیئت تشخیص (ماده ۱۵۷) ---
  const [tribunalStep, setTribunalStep] = useState(1);
   const [tribunalData, setTribunalData] = useState({
    hasContract: 'formal_two_copies', // تغییر از yes به اسلاگ جدید
    contractType: 'permanent',
    hasInsurance: 'full_insurance',
    insuranceMonths: '36',
    hasBankTransfer: 'bank_transfer',
    hasPaySlip: 'has_payslip_official',
    hasWhiteSign: 'clean',
    terminationType: 'expire',
    hasWrittenNotice: 'no_notice',
    hasWitness: 'witness_available',
    hasOvertimeRecords: 'overtime_records_valid',
    hasLeaveRecords: 'leave_documented',
    hasBenevolence: 'benefits_paid',
    hasComplaintHistory: 'no_prior_complaint',
    hasMOU: 'mou_none'
  });

  const [tribunalResult, setTribunalResult] = useState<any>(null);

 const calculateTribunal = () => {
  let score = 50;
  const notes = [];

  // ۱. قرارداد کار (ماده ۱۰ و ۷)
  if (tribunalData.hasContract === 'formal_two_copies') {
    score += 15;
    notes.push('استناد به ماده ۱۰ قانون کار: وجود قرارداد کتبی دو نسخه‌ای به نفع کارگر است.');
  } else if (tribunalData.hasContract === 'verbal') {
    score -= 20;
    notes.push('ریسک بالا (ماده ۷): شفاهی بودن قرارداد اثبات رابطه کارگری را دشوار می‌کند اما قابل اثبات با سایر قرائن است.');
  }

  // ۲. نوع قرارداد
  if (tribunalData.contractType === 'temporary_invalid') {
    score -= 10;
    notes.push('تبصره ۲ ماده ۷: قراردادهای موقت در کارهای مستمر بدون ثبت قانونی، دائم تلقی می‌شوند.');
  }

  // ۳. بیمه تأمین اجتماعی (ماده ۱۴۸)
  if (tribunalData.hasInsurance === 'full_insurance') {
    score += 15;
    notes.push('ماده ۱۴۸ قانون کار: واریز کامل حق بیمه، سابقه اشتغال و مزد را مستند می‌کند.');
  } else if (tribunalData.hasInsurance === 'no_insurance') {
    score -= 25;
    notes.push('تخلف آشکار کارفرما (ماده ۱۴۸): عدم پرداخت حق بیمه؛ الزام به بیمه و پرداخت خسارات.');
  } else if (tribunalData.hasInsurance === 'partial_insurance') {
    score -= 15;
    notes.push('عدم تطابق دستمزد بیمه با حقوق واقعی؛ امکان مطالبه مابه‌التفاوت حق بیمه.');
  }

  // ۵. طریق پرداخت دستمزد (ماده ۳۷)
  if (tribunalData.hasBankTransfer === 'bank_transfer') {
    score += 10;
    notes.push('ماده ۳۷ قانون کار: واریز بانکی مستند، پرداخت حقوق را اثبات می‌کند.');
  } else if (tribunalData.hasBankTransfer === 'cash_or_third_party') {
    score -= 15;
    notes.push('پرداخت دستی یا از طریق اشخاص ثالث؛ اثبات دریافت حقوق را با چالش مواجه می‌کند.');
  } else if (tribunalData.hasBankTransfer === 'unpaid_or_deducted') {
    score += 10; // امتیاز مثبت برای مطالبه گر در هیئت
    notes.push('وجود معوقات حقوقی؛ هیئت تشخیص به نفع کارگر رای به وصول مطالبات می‌دهد.');
  }

  // ۶. فیش حقوقی
  if (tribunalData.hasPaySlip === 'has_payslip_official') {
    score += 10;
    notes.push('وجود فیش حقوقی ممهور؛ سند رسمی احراز میزان دستمزد و مزایا.');
  } else if (tribunalData.hasPaySlip === 'no_payslip') {
    score -= 10;
    notes.push('عدم وجود فیش حقوقی؛ نیاز به استناد به تراکنش‌های بانکی یا شهادت شهود.');
  }

  // ۷. سفیدامضا / سفته
  if (tribunalData.hasWhiteSign === 'white_sign_risk') {
    score -= 25;
    notes.push('استناد به رویه قضایی و دیوان عدالت: برگه‌های سفیدامضا و اخذ سفته بدون رسید فاقد اعتبار قانونی شناخته می‌شوند.');
  }

  // ۸ و ۹. اخراج و اخطار کتبی (ماده ۱۶۵ و ۲۷)
  if (tribunalData.terminationType === 'dismiss') {
    if (tribunalData.hasWrittenNotice === 'no_notice') {
      score += 20;
      notes.push('ماده ۱۶۵ قانون کار: اخراج بدون دلیل موجه و بدون اخطار کتبی؛ حق بازگشت به کار یا دریافت حق سنوات حبس/اخراج.');
    } else {
      score -= 10;
      notes.push('وجود مستندات انضباطی کارفرما، اثبات اخراج غیرقانونی را دشوار می‌کند.');
    }
  }

  // ۱۰. شهود
  if (tribunalData.hasWitness === 'witness_available') {
    score += 10;
    notes.push('شهادت شهود مطلع، از ادله اثباتی معتبر در مراجع حل اختلاف است.');
  } else {
    score -= 10;
    notes.push('نبود شهود؛ تکیه صرف به مدارک کتبی (که ضعف مستندات را افزایش می‌دهد).');
  }

  // ۱۱. اضافه‌کار (ماده ۵۹)
  if (tribunalData.hasOvertimeRecords === 'overtime_records_valid') {
    score += 10;
    notes.push('ماده ۵۹ و ۸۷: وجود کارت‌ساعت یا مستندات تردد، مطالبات اضافه‌کاری را اثبات می‌کند.');
  } else if (tribunalData.hasOvertimeRecords === 'overtime_no_doc') {
    score -= 10;
    notes.push('نبود سند کتبی اضافه‌کاری؛ اثبات ساعات کار اضافی در هیئت تشخیص دشوار است.');
  }

  // ۱۲. مرخصی (ماده ۶۶)
  if (tribunalData.hasLeaveRecords === 'leave_documented') {
    score += 5;
    notes.push('ماده ۶۶: مطالبات مرخصی ذخیره شده قابل بازخرید در پایان کار است.');
  }

  // ۱۳. مطالبات سنوات و عیدی
  if (tribunalData.hasBenevolence === 'benefits_unpaid') {
    score += 10;
    notes.push('مطالبات سنوات، عیدی و پاداش قانونی کارگران قابل مطالبه قطعی است.');
  }

  // ۱۵. توافق‌نامه / تعهدنامه
  if (tribunalData.hasMOU === 'mou_waiver') {
    score -= 15;
    notes.push('ماده ۸ قانون کار: هرگونه شرط و توافق‌نامه که حقوق قانونی کارگر را ساقط کند باطل و بلااثربود.');
  }

  const finalScore = Math.max(10, Math.min(95, score));
  
  setTribunalResult({
    score: finalScore,
    status: finalScore >= 75 ? 'وضعیت عالی و شانس موفقیت بالا' : finalScore >= 50 ? 'وضعیت متوسط - نیازمند تقویت مستندات' : 'ریسک بالا - نیازمند دفاع تخصصی و کارشناسی',
    notes
  });
  setTribunalStep(16);
};




  // بخش محاسبات: سقف دستمزد ۱۰,۰۰۰,۰۰۰,۰۰۰ ریال (۱ میلیارد تومان)
  const MAX_SALARY_RIAL = 10000000000;
  const [baseSalary, setBaseSalary] = useState<number>(100000000); // پیش‌فرض ۱۰ میلیون تومان
  const [salaryInputText, setSalaryInputText] = useState<string>(toFa('100,000,000'));

  const [activeCalc, setActiveCalc] = useState<string>('salary');
  const [years, setYears] = useState<number>(1);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10); const [nightHours, setNightHours] = useState<number>(0);
  // همگام‌سازی ساعات اضافه‌کاری از ماشین‌حساب به فیش حقوقی
  useEffect(() => {
    setPayslipData(prev => ({ ...prev, overtimeHours: hours }));
  }, [hours]);

  const [shiftType, setShiftType] = useState<string>('morning_evening');
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(5);
  const [dependents, setDependents] = useState<number>(1);
  const [unemploymentMonths, setUnemploymentMonths] = useState<number>(24);
  const [insuranceYears, setInsuranceYears] = useState<number>(30); // سنوات مستمری

  // پایه سنوات: مستقل از دستمزد و وابسته به سابقه کار (مصوبه شورای عالی کار)
  const [workHistoryYears, setWorkHistoryYears] = useState<number>(1);
    // مقدار پیش‌فرض از پروفایل کاربر
  useEffect(() => {
    if (!user) return;
    const salMillion = Number(toEn(String(user.last_salary_million_rial ?? '')).replace(/[^\d.]/g, '')) || 0;
    if (salMillion > 0) {
      const v = Math.min(Math.round(salMillion * 1000000), MAX_SALARY_RIAL);
      setBaseSalary(v);
      setSalaryInputText(toFa(v.toLocaleString('en-US')));
    }
    const s = seniorityFromProfile(user.insurance_start_date);
    if (s) {
      setYears(s.y); setMonths(s.m); setDays(s.d);
      setWorkHistoryYears(Math.min(35, s.y));
      setInsuranceYears(Math.min(35, s.y));
      setUnemploymentMonths(s.totalMonths);
    }
    setDependents(Math.min(4, (Number(user.children_count) || 0) + (user.marital_status === 'married' ? 1 : 0)));
  }, [user]);




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
    const raw = toEn(e.target.value).replace(/[^\d]/g, '');
    if (!raw) {
      setSalaryInputText('');
      setBaseSalary(0);
      return;
    }
    const num = Math.min(parseInt(raw, 10), MAX_SALARY_RIAL);
    setBaseSalary(num);
    setSalaryInputText(toFa(num.toLocaleString('en-US')));
  };

  const handleSalaryTextBlur = () => {
    if (!salaryInputText || salaryInputText.trim() === '') {
      return; // در صورت خالی بودن، به صفر تحمیلی تبدیل نمی‌شود
    }
    const num = parseInt(toEn(salaryInputText).replace(/[^\d]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
        setSalaryInputText(toFa(num.toLocaleString('en-US')));
    }
  };



  const handleSliderSalaryChange = (val: number) => {
    setBaseSalary(val);
    setSalaryInputText(toFa(val.toLocaleString('en-US')));
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
    const nightPay = nightHours * hourlyWage * 0.35;

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
    if (unemploymentMonths <= 24) maxUnemploymentMonths = isMarried ? 12 : 6;
    else if (unemploymentMonths >= 25 && unemploymentMonths <= 120) maxUnemploymentMonths = isMarried ? 18 : 12;
    else if (unemploymentMonths >= 121 && unemploymentMonths <= 180) maxUnemploymentMonths = isMarried ? 26 : 14;
    else if (unemploymentMonths >= 181 && unemploymentMonths <= 240) maxUnemploymentMonths = isMarried ? 36 : 18;
    else if (unemploymentMonths > 240) maxUnemploymentMonths = isMarried ? 50 : 36;

    const benefitRate = Math.min(0.55 + Math.min(dependents, 4) * 0.10, 0.80);
    const monthlyUnemploymentBenefit = baseSalary * benefitRate;

    // ۱۰. مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی): صرفاً تابع میانگین دستمزد و سنوات
    const pensionEstimate = (baseSalary * Math.max(10, insuranceYears)) / 30;

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
  }, [baseSalary, years, months, days, hours, nightHours, shiftType, unworkedLeaveDays, dependents, unemploymentMonths, insuranceYears, workHistoryYears]);

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

          <div className="w-full flex items-center justify-between text-xs text-slate-400 tabular-nums px-1">
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
        ['--app-font' as any]: fontFamily,
        ['--app-font-size' as any]: `${fontSizePx}px`,
      }} 
      dir="rtl"
    >
        {/* سیستم استایل مینیمال، تایپوگرافی استاندارد و دارک‌مود عمیق */}
      <style>{`
        :root {
          --app-font: ${fontFamily};
          --app-font-size: ${fontSizePx}px;
        }
      html, body, #root, #root *, input, select, textarea, button, option {
        font-family: var(--app-font), Vazirmatn, Tahoma, sans-serif !important;
      }
      body, #root {
        font-size: var(--app-font-size);
        letter-spacing: -0.02em;
        -webkit-font-smoothing: antialiased;
      }

        .theme-light {
          background-color: #f8fafc;
          color: #0f172a;
        }
        .theme-dark {
          background-color: #090d16;
          color: #f1f5f9;
        }
        .theme-dark .bg-white {
          background-color: #111827 !important;
          border-color: #1e293b !important;
        }
        .theme-dark .text-slate-900, .theme-dark .text-slate-800, .theme-dark .text-slate-700 {
          color: #f1f5f9 !important;
        }
        .theme-dark .text-slate-600, .theme-dark .text-slate-500 {
          color: #94a3b8 !important;
        }
        .theme-dark .bg-slate-50, .theme-dark .bg-slate-100 {
          background-color: #0f172a !important;
          border-color: #1e293b !important;
        }
        .theme-dark input, .theme-dark select, .theme-dark textarea {
          background-color: #0d1322 !important;
          border-color: #334155 !important;
          color: #ffffff !important;
        }
        .force-high-contrast {
          font-weight: 600 !important;
        }
        .force-high-contrast .theme-light * {
          border-color: #000000 !important;
        }
        .force-high-contrast .theme-dark * {
          border-color: #38bdf8 !important;
        }
      `}</style>




      
      {/* هدر مینیمال شیشه‌ای با مونوگرام اختصاصی DK */}
      <header className={`sticky top-0 z-40 transition-colors duration-300 backdrop-blur-xl border-b ${
        appTheme === 'dark' 
          ? 'bg-slate-950/80 border-slate-800/80 text-white' 
          : 'bg-white/85 border-slate-200/80 text-slate-900'
      }`}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-right group focus:outline-none"
          >
            {/* لوگوی مونوگرام مهندسی DK با حاشیه درخشان نئونی */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-blue-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                  {/* نماد حرف D به شکل سپر قانونی */}
                  <path d="M10 8H14C22 8 25 13 25 20C25 27 22 32 14 32H10V8Z" stroke="#38BDF8" strokeWidth="3" strokeLinejoin="round" />
                  {/* شاخه‌های مورب نماد حرف K */}
                  <path d="M18 20L28 10M18 20L29 30" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="28" cy="10" r="1.5" fill="#60A5FA" />
                  <circle cx="29" cy="30" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight">دادکار</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  نسخه جامع
                </span>
              </div>
              <p className={`text-[11px] font-medium leading-none mt-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                سامانه هوشمند روابط کار و قوانین تأمین اجتماعی
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">

          {/* دکمه پروفایل و آواتار کاربری */}
          <button
            onClick={() => setShowProfileModal(true)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 active:scale-95 ${
              appTheme === 'dark'
                ? 'bg-slate-800/80 text-blue-400 hover:bg-slate-700/80 border border-slate-700/60'
                : 'bg-slate-100 text-blue-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title={user ? `پروفایل: ${user.first_name || user.username || 'کاربر دادکار'}` : 'پروفایل کاربری'}
          >
            {user ? (
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                {AVATAR_SVGS.find(a => a.id === (user.avatar_id ?? '0'))?.svg || <User className="w-5 h-5" />}
              </div>
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>


            
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                appTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200'
              } active:scale-95`}
              title="تنظیمات"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>محاسبات سریع</span>
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
                  <div onClick={() => setActiveTab('tribunal')} className="cursor-pointer p-5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 transition">
                    <h3 className="text-lg font-bold">⚖️ شبیه‌ساز هیئت تشخیص</h3>
                    <p className="text-sm opacity-90 mt-1">تست احتمال پیروزی در دعاوی کارگر و کارفرما</p>
                  </div>

              </div>
            </div>
            {/* کارت دسترسی سریع: فیش حقوقی پرسنلی */}
            <div 
              onClick={() => setActiveTab('payslip')}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">📄 فیش حقوقی پرسنلی</h3>
                <p className="text-emerald-100 text-xs mt-1">محاسبه و خروجی فیش بر اساس پروفایل</p>
              </div>
              <FileText className="w-8 h-8 text-emerald-100 opacity-80" />
            </div>
          
            {/* کارت راهنما و اطلاعات مبنا */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 text-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] bg-blue-700/60 px-2 py-0.5 rounded font-bold">مبنای استناد</span>
                <h4 className="text-xs font-bold">محاسبات بر اساس آخرین بخشنامه مصوب شورای عالی کار</h4>
                <p className="text-[10px] text-blue-200">سقف ورودی دستمزد تا ۱ میلیارد تومان (۱۰ میلیارد ریال)</p>
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
                  <label htmlFor="salaryInput">وارد کردن مبلغ به ریال (سقف ۱ میلیارد تومان = ۱۰,۰۰۰,۰۰۰,۰۰۰ ریال):</label>
                  <span className="text-[11px] text-slate-400 tabular-nums">حداکثر ۱۰ میلیارد ریال</span>
                </div>
                <div className="relative">
                  <input
                    id="salaryInput"
                    type="text"
                    dir="ltr"
                    inputMode="numeric"
                    value={salaryInputText}
                    onChange={handleSalaryTextChange}
                    onBlur={handleSalaryTextBlur}
                    placeholder="مبلغ مورد نظر را وارد نمایید..."
                    className="w-full h-12 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl tabular-nums text-left font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-base"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-sans pointer-events-none">ریال</span>
                </div>
              </div>

              {/* اسلایدر تنظیم سریع با سقف ۱۰۰ میلیارد ریال */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>اهرم تنظیم سریع:</span>
                  <span className="tabular-nums text-blue-600 font-bold">{formatRial(baseSalary)}</span>
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
                    onClick={() => { setBaseSalary(71661840); setSalaryInputText(toFa('71,661,840')); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل مزد ۳۰ روزه</div>
                    <div className="text-xs font-bold text-slate-800">۷۱,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(103661840); setSalaryInputText(toFa('103,661,840')); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل دریافتی مجرد</div>
                    <div className="text-xs font-bold text-slate-800">۱۰۳,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(200000000); setSalaryInputText(toFa('200,000,000')); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">مزد ۲۰ تومانی</div>
                    <div className="text-xs font-bold text-slate-800">۲۰۰,۰۰۰,۰۰۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(501632880); setSalaryInputText(toFa('501,632,880')); }}
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
                        type="text" 
                        inputMode="numeric"                        
                        min="0"
                        placeholder="0"
                        value={years === 0 ? '' : toFa(years)}    
                        onChange={(e) => {
                          const val = toEn(e.target.value).replace(/[^0-9]/g, ''); 
                          setYears(val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0));
                        }}
                        className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد ماه:</label>
                      <input
                          type="text"
                          inputMode="numeric"
                          min="0"
                          max="11"
                          placeholder="0"
                          value={months === 0 ? '' : toFa(months)}       
                          onChange={(e) => {
                            const val = toEn(e.target.value).replace(/[^0-9]/g, '');  
                            setMonths(val === '' ? 0 : Math.min(11, Math.max(0, parseInt(val, 10) || 0)));
                          }}
                          className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد روز:</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        min="0"
                        max="30"
                        placeholder="0"
                       value={days === 0 ? '' : toFa(days)}
                        onChange={(e) => {
                          const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                          setDays(val === '' ? 0 : Math.min(30, Math.max(0, parseInt(val, 10) || 0)));
                        }}
                        className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                        type="text"
                        inputMode="numeric"
                        min="0"
                        placeholder="0"
                        value={hours === 0 ? '' : toFa(hours)}
                        onChange={(e) => {
                          const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                          setHours(val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0));
                        }}
                        className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                    type="text" 
                    inputMode="numeric" 
                    min="0" 
                    value={nightHours === 0 ? '' : toFa(nightHours)}
                    placeholder="0"
                    onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setNightHours(v === '' ? 0 : Math.max(0, parseInt(v, 10) || 0)); }}    
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
                      type="text"
                      inputMode="numeric"
                      min="0"
                      max="30"
                      placeholder="0"
                      value={unworkedLeaveDays === 0 ? '' : toFa(unworkedLeaveDays)}
                      onChange={(e) => {
                        const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                        setUnworkedLeaveDays(val === '' ? 0 : Math.min(30, Math.max(0, parseInt(val, 10) || 0)));
                      }}
                      className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                      type="text"
                      inputMode="numeric"
                      min="0"
                      max="35"
                      placeholder="0"
                      value={workHistoryYears === 0 ? '' : toFa(workHistoryYears)}
                      onChange={(e) => {
                        const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                        setWorkHistoryYears(val === '' ? 0 : Math.min(35, Math.max(0, parseInt(val, 10) || 0)));
                      }}
                      className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                      type="text"
                      inputMode="numeric"
                      min="10"
                      max="35"
                      value={insuranceYears === 0 ? '' : toFa(insuranceYears)}
                      placeholder="۱۰ تا ۳۵"
                      onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setInsuranceYears(v === '' ? 0 : Math.min(35, Math.max(0, parseInt(v, 10) || 0))); }}
                      className="w-24 p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center tabular-nums text-indigo-700"
                    />
                    <span className="text-xs text-slate-500">سال سابقه</span>
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={10}
                    max={35}
                    value={Math.max(10, insuranceYears)}
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
                      type="text" 
                      inputMode="numeric"
                      min="0" 
                      value={unemploymentMonths === 0 ? '' : toFa(unemploymentMonths)}
                      placeholder="حداقل ۶ ماه"
                      onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setUnemploymentMonths(v === '' ? 0 : Math.max(0, parseInt(v, 10) || 0)); }}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد افراد تحت تکفل:</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      min="0" 
                      max="4"
                      value={dependents === 0 ? '' : toFa(dependents)}
                      placeholder="0"
                      onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setDependents(v === '' ? 0 : Math.min(4, Math.max(0, parseInt(v, 10) || 0))); }}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="text-[11px] text-blue-700">حداکثر مدت دریافت مقرری:</div>
                    <div className="text-base font-black text-blue-900 mt-1">{toFa(calculations.maxUnemploymentMonths)} ماه شمسی</div>
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
               {/* --- شاخه رندر تب شبیه‌ساز هیئت تشخیص (۱۵ مرحله‌ای تخصصی) --- */}
        {activeTab === 'tribunal' && (
          <div className="space-y-6 max-w-3xl mx-auto pb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">⚖️ شبیه‌ساز حرفه‌ای هیئت تشخیص (ماده ۱۵۷)</h2>
                  <p className="text-xs text-gray-500 mt-1">ارزیابی ریسک و شانس موفقیت پرونده بر اساس ۱۵ فاکتور کلیدی قوانین کار</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold">
                  مرحله {tribunalStep} از ۱۵
                </span>
              </div>

                {tribunalStep <= 15 && (
                <div className="space-y-6">
                  {/* سوالات گام‌به‌گام */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                      {tribunalStep === 1 && "۱. آیا قرارداد کار کتبی (نسخه کارگر/کارفرما) در اختیار دارید؟"}
                      {tribunalStep === 2 && "۲. نوع قرارداد کار شما چگونه منعقد شده است؟"}
                      {tribunalStep === 3 && "۳. آیا حق بیمه تأمین اجتماعی شما ماهیانه و به موقع واریز شده است؟"}
                      {tribunalStep === 4 && "۴. مجموع سابقه بیمه واریز‌شده شما در کارگاه چقدر است؟"}
                      {tribunalStep === 5 && "۵. دستمزد و حقوق شما از چه طریق پرداخت شده است؟"}
                      {tribunalStep === 6 && "۶. آیا فیش حقوقی ممهور یا پرینت رسمی حقوق دریافت می‌کنید؟"}
                      {tribunalStep === 7 && "۷. آیا فرم تسویه حساب یا قرارداد سفیدامضا / سفته امضا کرده‌اید؟"}
                      {tribunalStep === 8 && "۸. نحوه قطع همکاری و پایان کار شما چگونه بوده است؟"}
                      {tribunalStep === 9 && "۹. آیا اخطار کتبی، تذکر یا فرم کمیته انضباطی دریافت کرده‌اید؟"}
                      {tribunalStep === 10 && "۱۰. آیا شاهد یا مطلعی (همکاران) برای اثبات ادعای حضور دارید؟"}
                      {tribunalStep === 11 && "۱۱. آیا مدارک یا ساعت‌زن / کارت‌ساعت اضافه کار دارید؟"}
                      {tribunalStep === 12 && "۱۲. آیا مطالبات مرخصی استفاده‌نشده ذخیره دارید؟"}
                      {tribunalStep === 13 && "۱۳. آیا مبلغی بابت سنوات یا عیدی به صورت نقدی بدون رسید گرفته‌اید؟"}
                      {tribunalStep === 14 && "۱۴. آیا سابقه طرح شکایت قبلی در اداره کار دارید؟"}
                      {tribunalStep === 15 && "۱۵. آیا توافق‌نامه دستی یا تعهدنامه محضری خارج از اداره کار امضا کرده‌اید؟"}
                    </h3>

                             {/* گام ۱: قرارداد کتبی - ماده ۱۰ و ۷ */}
          {tribunalStep === 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت تنظیم قرارداد کار کتبی شما به چه صورت است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'formal_two_copies', label: 'کتبی در دو نسخه دارای امضا و مهر کارفرما (ماده ۱۰)' },
                  { id: 'single_copy', label: 'کتبی در یک نسخه نزد کارفرما / فاقد نسخه کارگر' },
                  { id: 'verbal', label: 'شفاهی / فاقد هرگونه قرارداد کتبی (ماده ۷)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasContract: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasContract === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۲: نوع قرارداد - ماده ۷ */}
          {tribunalStep === 2 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">ماهیت و مدت قرارداد کار شما چگونه منعقد شده است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'permanent', label: 'دائم / مستمر در کارهای با ماهیت دائم' },
                  { id: 'temporary_valid', label: 'موقت با ذکر دلیل موجه در کارهای غیرمستمر' },
                  { id: 'temporary_invalid', label: 'موقت برای کارهای مستمر بدون ثبت در سامانه / سفیدامضا (تبصره ۲ ماده ۷)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, contractType: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.contractType === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۳: بیمه - ماده ۱۴۸ */}
          {tribunalStep === 3 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت ارسال لیست و واریز حق بیمه تأمین اجتماعی چگونه است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'full_insurance', label: 'کامل و مطابق با ایام واقعی اشتغال و مزد واقعی (ماده ۱۴۸)' },
                  { id: 'partial_insurance', label: 'پاره‌وقت یا با حقوق کمتر از پایه وزارت کار رد شده' },
                  { id: 'no_insurance', label: 'کلاً رد نشده / کارفرما بیمه نکرده است (تخلف ماده ۱۴۸)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasInsurance: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasInsurance === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۴: سابقه بیمه */}
          {tribunalStep === 4 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">مجموع سابقه بیمه پرداختی شما در کارگاه فعلی چقدر است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: '6', label: 'کمتر از ۱ سال' },
                  { id: '36', label: 'بین ۱ تا ۵ سال' },
                  { id: '72', label: 'بیش از ۵ سال' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, insuranceMonths: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.insuranceMonths === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۵: طریق پرداخت دستمزد - ماده ۳۷ */}
          {tribunalStep === 5 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">دستمزد و حقوق قانونی شما از چه طریقی به حسابتان پرداخت می‌شده است؟ (ماده ۳۷)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'bank_transfer', label: 'واریز مستقیم از حساب رسمی شرکت/کارفرما به حساب بانکی کارگر' },
                  { id: 'cash_or_third_party', label: 'پرداخت نقدی دستی یا کارت به کارت از حساب شخصی اشخاص ثالث' },
                  { id: 'unpaid_or_deducted', label: 'عدم پرداخت معوقات یا پرداخت همراه با کسورات غیرقانونی' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasBankTransfer: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasBankTransfer === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۶: فیش حقوقی */}
          {tribunalStep === 6 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا فیش حقوقی ممهور به مهر کارگاه یا پرینت رسمی دریافت می‌کرده‌اید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'has_payslip_official', label: 'بله، فیش‌های حقوقی هر ماه با امضا و مهر موجود است' },
                  { id: 'payslip_unofficial', label: 'پرینت پرسنلی یا گزارش نرم‌افزاری بدون مهر دارم' },
                  { id: 'no_payslip', label: 'خیر، هیچ‌گونه فیش یا مدرک ممهوری در اختیار ندارم' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasPaySlip: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasPaySlip === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۷: سفیدامضا / سفته */}
          {tribunalStep === 7 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت برگه‌های تسویه سفیدامضا یا سفته‌های حسن انجام کار چگونه است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'clean', label: 'خیر، هیچ‌گونه برگه سفیدامضا یا سفته‌ای داده نشده است' },
                  { id: 'guarantee_check_with_receipt', label: 'بله، سفته تضمین با ذکر شماره در قرارداد و اخذ رسید تحویل شده' },
                  { id: 'white_sign_risk', label: 'بله، قرارداد یا برگه تسویه حساب سفیدامضا و سفته بدون رسید اخذ شده (استناد به آرای دیوان)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasWhiteSign: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasWhiteSign === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۸: نحوه قطع همکاری - ماده ۲۱ */}
          {tribunalStep === 8 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">قطع همکاری و خاتمه رابطه کار شما به چه نحو صورت گرفته است؟ (ماده ۲۱)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'dismiss', label: 'اخراج مستقیم توسط کارفرما بدون رضایت کارگر (ماده ۱۶۵)' },
                  { id: 'resign', label: 'استعفای کتبی با رعایت تشریفات قانونی' },
                  { id: 'expire', label: 'اتمام مدت قرارداد موقت' },
                  { id: 'abandon', label: 'ترک کار ادعایی کارفرما' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, terminationType: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.terminationType === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۹: اخطار کتبی - ماده ۲۷ */}
          {tribunalStep === 9 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا پیش از قطع همکاری، اخطار کتبی عملکرد یا فرم کمیته انضباطی دریافت کرده‌اید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'no_notice', label: 'خیر، هیچ اخطار کتبی یا مستندات قصوری وجود ندارد (به نفع کارگر)' },
                  { id: 'has_disciplinary_notice', label: 'بله، اخطار کتبی یا آرای منفی کمیته انضباطی موجود است' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasWrittenNotice: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasWrittenNotice === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۰: شهود */}
          {tribunalStep === 10 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا شهود مطلع (همکاران شاغل یا سابق) جهت اثبات حضور در کارگاه دارید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'witness_available', label: 'بله، شهود معتبر با امکان حضور و گواهی در جلسه هیئت تشخیص آماده‌اند' },
                  { id: 'no_witness', label: 'خیر، هیچ شاهدی حاضر به ادای شهادت نیست' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasWitness: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasWitness === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۱: مدارک اضافه‌کار - ماده ۵۹ */}
          {tribunalStep === 11 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">مستندات شما برای اثبات اضافه‌کار و ساعات حضور در کارگاه چیست؟ (ماده ۵۹)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'overtime_records_valid', label: 'کارت‌ساعت فیزیکی، گزارش دستگاه تردد یا پرینت سامانه حضور و غیاب دارم' },
                  { id: 'overtime_no_doc', label: 'صرفاً ادعای شفاهی بدون سند کتبی یا کارت‌ساعت دارم' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasOvertimeRecords: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasOvertimeRecords === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۲: مرخصی - ماده ۶۶ */}
          {tribunalStep === 12 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت ثبت مرخصی‌های استفاده‌نشده و مانده مرخصی چگونه است؟ (ماده ۶۶)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'leave_documented', label: 'درخواست‌های مرخصی و مانده ذخیره در پرونده کارگزینی ثبت است' },
                  { id: 'leave_undocumented', label: 'صرفاً تعداد روزهای ادعایی بدون ثبت کتبی در شرکت است' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasLeaveRecords: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasLeaveRecords === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۳: سنوات و عیدی */}
          {tribunalStep === 13 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">حق سنوات، عیدی و پاداش سالانه شما چگونه تسویه شده است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'benefits_paid', label: 'به طور کامل با واریز بانکی مستند برای هر سال تسویه شده است' },
                  { id: 'benefits_unpaid', label: 'پرداخت نشده یا بخشی از آن به صورت دستی و بدون رسید معتبر است' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasBenevolence: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasBenevolence === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۴: سوابق شکایت */}
          {tribunalStep === 14 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا سابقه طرح دعوا یا شکایت قبلی در اداره کار علیه همین کارگاه دارید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'no_prior_complaint', label: 'خیر، این اولین پرونده طرح شده علیه این کارگاه است' },
                  { id: 'prior_complaint_exists', label: 'بله، دارای سابقه سازش یا رای قطعی قبلی مرتبط هستم' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasComplaintHistory: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasComplaintHistory === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۵: توافق‌نامه دستی / ماده ۸ */}
          {tribunalStep === 15 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا توافق‌نامه دستی یا تعهدنامه‌ای دال بر اسقاط حق شکایت امضا داده‌اید؟ (ماده ۸)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'mou_none', label: 'خیر، هیچ‌گونه توافق‌نامه اسقاط حقی امضا نکرده‌ام' },
                  { id: 'mou_waiver', label: 'بله، تعهدنامه یا رضایت‌نامه محضری با شرط اسقاط حق شکایت اخذ شده (نیازمند استناد ماده ۸)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasMOU: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasMOU === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

                    {/* دکمه‌های ناوبری مراحل شبیه‌ساز */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={() => setTribunalStep(prev => Math.max(1, prev - 1))}
              disabled={tribunalStep === 1}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tribunalStep === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              مرحله قبل
            </button>

            {tribunalStep < 15 ? (
              <button
                type="button"
                onClick={() => setTribunalStep(prev => Math.min(15, prev + 1))}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-all shadow-sm"
              >
                مرحله بعد
              </button>
            ) : (
              <button
                type="button"
                onClick={calculateTribunal}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
              >
                <span>محاسبه نهایی نتیجه پرونده</span>
              </button>
            )}
                 </div>
        </div>
      )}

      {/* بخش نمایش نتیجه شبیه‌ساز (مرحله ۱۶) */}
      {tribunalStep === 16 && tribunalResult && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">نتیجه ارزیابی و تحلیل ریسک پرونده</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">بر اساس ۱۵ فاکتور قانونی و رویه هیئت‌های تشخیص</p>
            </div>
            <div className="text-left">
              <span className="text-3xl font-extrabold text-amber-600">{tribunalResult.score}</span>
              <span className="text-sm text-slate-400"> از ۱۰۰</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">توصیه حقوقی کارشناس:</h4>
            <p className="text-sm font-medium text-slate-700 dark:text-gray-300">{tribunalResult.status}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">تحلیل استناد قانونی:</h4>
            <ul className="space-y-2">
              {tribunalResult.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-gray-900/50 p-3 rounded-xl border border-slate-100 dark:border-gray-700">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setTribunalStep(1);
                setTribunalResult(null);
              }}
              className="px-6 py-2.5 bg-slate-800 dark:bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-slate-900 dark:hover:bg-gray-600 transition-all"
            >
              شروع مجدد ارزیابی
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  </div>     {/* این دایو دقیقاً برای بستن ظرف بازمانده خط 1653 اضافه شد */}
)}


            {/* --- شاخه رندر تب فیش حقوقی پرسنلی --- */}
        {activeTab === 'payslip' && (
          <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              
              {/* هدر کنترل */}
              <div className="flex justify-between items-center mb-6 print:hidden">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">📄 فیش حقوق و دستمزد پرسنلی</h2>
                  <p className="text-xs text-gray-500 mt-1">محاسبه آنی بر اساس مشخصات پروفایل، قانون کار و ضوابط تأمین اجتماعی</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    بازگشت به خانه
                  </button>
                 {!isAndroid && (
                    <button 
                      onClick={() => handlePrintDocument('payslip-print-area')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>🖨️</span> چاپ فیش حقوقی
                    </button>
                  )}




                </div>
              </div>

              {/* کنترلر تعاملی ساعت اضافه کار برای اعمال آنی در فیش */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-xl text-emerald-800 text-sm font-medium">
                  <span>ساعات اضافه‌کاری (گرفته شده از بخش محاسبات):</span>
                  <span className="font-bold">{payslipData.overtimeHours} ساعت</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={payslipData.overtimeHours}
                    onChange={(e) => setPayslipData({...payslipData, overtimeHours: Number(e.target.value) || 0})}
                    className="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-center font-bold text-gray-900 dark:text-white"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ساعت</span>
                </div>
              </div>

              {/* کادر فیش حقوقی (طراحی رسمی مجهز به inline style برای چاپ تمیز) */}
              <div id="payslip-print-area" style={{ fontFamily: 'Tahoma, Arial, sans-serif', direction: 'rtl', padding: '24px', background: '#ffffff', color: '#111827', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                
                {/* سربرگ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1f2937', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{payslipData.workshopName}</h3>
                    <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>سیستم جامع حقوق و دستمزد دادکار</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857', margin: '0 0 4px 0' }}>فیش حقوق و مزایای پرسنلی</h2>
                    <span style={{ display: 'inline-block', padding: '2px 10px', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                      عملکرد ماه: {payslipData.month}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', fontSize: '11px', color: '#4b5563' }}>
                    <p style={{ margin: 0 }}>تاریخ صدور: {new Date().toLocaleDateString('fa-IR')}</p>
                  </div>
                </div>

                {/* مشخصات */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '11px', marginBottom: '20px' }}>
                  <div><span style={{ color: '#6b7280' }}>نام و نام خانوادگی:</span> <strong>{payslipData.empName}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>کد ملی / شناسه:</span> <strong>{payslipData.nationalId}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>وضعیت تأهل و عائله:</span> <strong>{user?.marital_status === 'married' ? 'متأهل (دارای حق تأهل)' : 'مجرد / سایر'}</strong></div>
                </div>

                {/* جداول درآمد و کسورات */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  
                  {/* مزایا */}
                  <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '14px', background: '#fcfcfc' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#065f46', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span>مزایای مستمر و رفاهی</span>
                      <span>مبلغ (ریال)</span>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>پایه حقوق ماهیانه:</span>
                      <strong>{payslipData.baseSalary.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>پایه مسکن مصوب:</span>
                      <strong>{payslipData.housingAllowance.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>بن کارگری (خواربار):</span>
                      <strong>{payslipData.groceryAllowance.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>حق اولاد (فرزندان):</span>
                      <strong>{payslipData.childAllowance.toLocaleString()}</strong>
                    </div>
                    {user?.marital_status === 'married' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', color: '#047857' }}>
                        <span>حق تأهل (حق همسر):</span>
                        <strong>{Math.round(5000000).toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>اضافه کاری ({payslipData.overtimeHours} ساعت):</span>
                      <strong>{(payslipData.overtimeHours * payslipData.overtimeRate).toLocaleString()}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '10px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#065f46' }}>
                      <span>جمع مزایای ناخالص:</span>
                      <span>
                        {(
                          payslipData.baseSalary +
                          payslipData.housingAllowance +
                          payslipData.groceryAllowance +
                          payslipData.childAllowance +
                          (user?.marital_status === 'married' ? 5000000 : 0) +
                          (payslipData.overtimeHours * payslipData.overtimeRate)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* کسورات */}
                  <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '14px', background: '#fcfcfc' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span>کسورات قانونی</span>
                      <span>مبلغ (ریال)</span>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>بیمه سهم کارگر (۷٪ پایه و مزایا):</span>
                      <strong style={{ color: '#991b1b' }}>
                        {payslipData.insuranceDeduction 
                          ? Math.round((payslipData.baseSalary + payslipData.housingAllowance + payslipData.groceryAllowance) * 0.07).toLocaleString() 
                          : '۰'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>مالیات بر درآمد حقوق:</span>
                      <strong style={{ color: '#991b1b' }}>{payslipData.taxDeduction ? 'محاسبه شده' : 'معاف / صفر'}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '48px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#991b1b' }}>
                      <span>جمع کل کسورات:</span>
                      <span>
                        {payslipData.insuranceDeduction 
                          ? Math.round((payslipData.baseSalary + payslipData.housingAllowance + payslipData.groceryAllowance) * 0.07).toLocaleString() 
                          : '۰'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* خالص پرداختی */}
                <div style={{ background: '#111827', color: '#ffffff', padding: '14px 20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block' }}>مبلغ قابل پرداخت نهایی به پرسنل:</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>
                      {(
                        (
                          payslipData.baseSalary +
                          payslipData.housingAllowance +
                          payslipData.groceryAllowance +
                          payslipData.childAllowance +
                          (user?.marital_status === 'married' ? 5000000 : 0) +
                          (payslipData.overtimeHours * payslipData.overtimeRate)
                        ) -
                        (
                          payslipData.insuranceDeduction 
                            ? Math.round((payslipData.baseSalary + payslipData.housingAllowance + payslipData.groceryAllowance) * 0.07) 
                            : 0
                        )
                      ).toLocaleString()} ریال
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', fontSize: '10px', color: '#9ca3af' }}>
                    <p style={{ margin: 0 }}>وضعیت: آماده واریز بانکی</p>
                  </div>
                </div>

                            {/* امضاها */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', fontSize: '11px', color: '#4b5563' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0 0 25px 0' }}>امضا و مهر کارفرما / امور مالی</p>
                    <div style={{ borderBottom: '1px dashed #9ca3af', width: '80%', margin: '0 auto' }}></div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0 0 25px 0' }}>امضا و تأیید دریافت پرسنل</p>
                    <div style={{ borderBottom: '1px dashed #9ca3af', width: '80%', margin: '0 auto' }}></div>
                  </div>
                </div>

              </div>             
            </div>                
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
                          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 pl-14 pt-12 text-xs leading-7 tabular-nums select-text" dir="rtl">{tmpl.content}</pre>
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
            
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
             <div>
                <p className="text-xs text-slate-500">طراح و اجرا</p>
                <p className="font-black text-slate-900 dark:text-white mt-1">گروه تخصصی تحلیل و برنامه نویسی دادکار</p>
              </div>
              
              {/* گرید دسترسی‌ها و پیام‌رسان‌ها (بدون شماره تماس مستقیم) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                <button onClick={() => setShowTickets(true)} className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                  <MessageSquare className="w-4 h-4" /> تیکت‌ها
                </button>
                <a href="mailto:info@daadkaar.ir" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition">
                  <Mail className="w-4 h-4" /> ایمیل
                </a>
                <a href="https://www.daadkaar.ir" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition">
                  <Globe className="w-4 h-4" /> وب‌سایت
                </a>
                <a href="https://ble.ir/daadkaar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition">
                  <MessageCircle className="w-4 h-4" /> بله
                </a>
                <a href="https://eitaa.com/daadkar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition">
                  <Send className="w-4 h-4" /> ایتا
                </a>
              </div>


            {/* مودال و سیستم تیکت‌ها */}
            {showTickets && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-black text-sm text-slate-800 dark:text-white">سیستم تیکت‌های پشتیبانی</h3>
                    <button type="button" onClick={() => { setShowTickets(false); setSelectedTicket(null); }} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">✕</button>
                  </div>

                  {selectedTicket ? (
                    <div className="mt-4 space-y-3">
                      <button type="button" onClick={() => setSelectedTicket(null)} className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-2">← بازگشت به فهرست تیکت‌ها</button>
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedTicket.subject}</h4>
                        <span className="text-[10px] text-slate-400 block mt-1">{selectedTicket.created_at}</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 whitespace-pre-wrap">{selectedTicket.body}</p>
                      </div>
                      {selectedTicket.reply ? (
                        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4 bg-emerald-50 dark:bg-emerald-900/30">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-1">پاسخ پشتیبانی:</span>
                          <p className="text-xs text-emerald-800 dark:text-emerald-200 whitespace-pre-wrap">{selectedTicket.reply}</p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs text-center">
                          این تیکت در انتظار پاسخ پشتیبانی است.
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">تیکت‌های ارسالی شما</h4>
                          <button type="button" onClick={async () => {
                            try {
                              const r = await fetch('https://daadkaar.ir/api/auth.php?action=list_tickets', { headers: { Authorization: `Bearer ${token}` } });
                              const j = await r.json();
                              if (j.ok) setTickets(j.tickets);
                            } catch {}
                          }} className="text-[10px] text-blue-600 font-bold">بارگذاری / به‌روزرسانی</button>
                        </div>
                        {tickets.map(t => (
                          <div key={t.id} onClick={() => setSelectedTicket(t)} className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <div className="flex justify-between items-center font-bold text-slate-800 dark:text-white">
                              <span>{t.subject}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${t.status === 'open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                {t.status === 'open' ? 'منتظر پاسخ' : 'پاسخ داده شده'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">{t.created_at}</span>
                          </div>
                        ))}
                        {tickets.length === 0 && <p className="text-center text-xs text-slate-400 py-4">هنوز تیکتی بارگذاری یا ثبت نکرده‌اید.</p>}
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                        <h4 className="font-black text-xs text-slate-800 dark:text-white">ثبت تیکت جدید</h4>
                        <input
                          value={ticketSubject}
                          onChange={e => setTicketSubject(e.target.value)}
                          placeholder="موضوع تیکت"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <textarea
                          value={ticketBody}
                          onChange={e => setTicketBody(e.target.value)}
                          rows={3}
                          placeholder="متن پیام شما..."
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                          <input type="checkbox" checked={captchaOk} onChange={e => setCaptchaOk(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span>من ربات نیستم</span>
                        </label>
                        <button
                          onClick={async () => {
                            const currentToken = localStorage.getItem('dadkar_token') || localStorage.getItem('token') || '';
                            if (!currentToken) {
                              alert('لطفاً ابتدا وارد حساب کاربری خود شوید.');
                              return;
                            }
                            if (!ticketSubject.trim() || !ticketBody.trim()) {
                              alert('لطفاً موضوع و متن تیکت را وارد کنید.');
                              return;
                            }
                            if (!captchaOk) {
                              alert('لطفاً تایید کنید که ربات نیستید.');
                              return;
                            }
                            try {
                              const res = await fetch('https://daadkaar.ir/api/auth.php?action=create_ticket', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  token: currentToken,
                                  subject: ticketSubject,
                                  body: ticketBody
                                })
                              });
                              const data = await res.json();
                              if (res.ok && (data.ok || data.status === 'success')) {
                                setTicketSubject('');
                                setTicketBody('');
                                setCaptchaOk(false);
                                alert(data.message || 'تیکت شما با موفقیت ثبت شد.');

                                const r = await fetch('https://daadkaar.ir/api/auth.php?action=list_tickets', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ token: currentToken })
                                });
                                const j = await r.json();
                                if (j.tickets || j.data) {
                                  setTickets(j.tickets || j.data || []);
                                }
                              } else {
                                alert(data.message || 'خطا در ثبت تیکت. لطفاً دوباره تلاش کنید.');
                              }
                            } catch (err) {
                              alert('خطای ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition hover:bg-emerald-700 active:scale-95"
                        >
                          ارسال تیکت جدید
                        </button>


                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>



      {/* نوار ناوبری پایین با هماهنگی کامل تم روشن/تاریک */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t transition-colors duration-300 py-1.5 safe-bottom ${
        appTheme === 'dark'
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-400 shadow-2xl'
          : 'bg-white/90 border-slate-200/80 text-slate-500 shadow-lg'
      }`}>
        <div className="max-w-md mx-auto px-1 grid grid-cols-7 gap-0.5">
          {[
            { id: 'home', label: 'اصلی', icon: Home },
            { id: 'calculator', label: 'محاسبات', icon: Calculator },
            { id: 'tamin', label: 'شعب', icon: Building2 },
            { id: 'templates', label: 'قالب‌ها', icon: FileSpreadsheet },
            { id: 'laws', label: 'قوانین', icon: BookOpen },
            { id: 'faq', label: 'راهنما', icon: HelpCircle },
            { id: 'contact', label: 'ارتباط', icon: Phone },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-blue-500 font-black'
                    : 'hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-500/15 scale-110' : ''
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tighter truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

       {/* مودال تنظیمات لوکس و اختصاصی */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border transition-all ${
            appTheme === 'dark' 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-100 text-slate-800'
          }`}>
            
            {/* سربرگ مودال */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm">تنظیمات رابط کاربری</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {/* ۱. پوسته نرم‌افزار */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">حالت نمایش (پوسته)</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleThemeSelect('light')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      appTheme === 'light'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    ☀️ روز (روشن)
                  </button>
                  <button
                    type="button"
                     onClick={() => handleThemeSelect('dark')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      appTheme === 'dark'
                        ? 'bg-slate-700 text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    🌙 شب (تاریک)
                  </button>
                </div>
              </div>

              {/* ۲. فونت قلم */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">نوع قلم سامانه</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Vazirmatn, Tahoma, sans-serif', name: 'وزیرمتن (پیش‌فرض اپلیکیشن)' },
                    { id: 'system-ui, -apple-system, sans-serif', name: 'قلم استاندارد سیستم' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleFontChange(f.id)}
                      style={{ fontFamily: f.id }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        fontFamily === f.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>


              {/* ۳. اندازه قلم */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span className="text-slate-500 dark:text-slate-400">اندازه متن‌ها</span>
                  <span className="text-blue-500 tabular-nums">{fontSizePx}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={1}
                  value={fontSizePx}
                  onChange={(e) => handleFontSizePxChange(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>ریز</span>
                  <span>استاندارد</span>
                  <span>درشت</span>
                </div>
              </div>

              {/* ۴. کنتراست بالا */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">افزایش خوانایی و کنتراست</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => handleContrastToggle(e.target.checked)}
                  className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* دکمه ذخیره و بستن */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
            >
              ثبت و اعمال تغییرات
            </button>
          </div>
        </div>
      )}

      {/* مودال پروفایل و احراز هویت */}
        <AuthProfileModals
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          user={user}
          token={token}
          showProfileModal={showProfileModal}

          setShowProfileModal={setShowProfileModal}
          onLoginSuccess={(userData, tokenStr) => {
            setUser(userData);
            setToken(tokenStr);
            localStorage.setItem('dadkar_user', JSON.stringify(userData));
            localStorage.setItem('dadkar_token', tokenStr);
            setShowProfileModal(false); // بستن مودال پس از ورود موفق
            setActiveTab('home');     // هدایت به صفحه اصلی
          }}
          onProfileUpdate={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('dadkar_user', JSON.stringify(updatedUser));
          }}
      />

     </div>
  );
}
