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

import { EXTRACTED_LAWS, ALL_TEMPLATES } from './appData';
import type { TemplateItem } from './appData';
import HomeTab from './tabs/HomeTab';
import CalculatorTab from './tabs/CalculatorTab';
import TribunalTab from './tabs/TribunalTab';
import PayslipTab from './tabs/PayslipTab';
import TaminTab from './tabs/TaminTab';
import TemplatesTab from './tabs/TemplatesTab';
import LawsTab from './tabs/LawsTab';
import FaqTab from './tabs/FaqTab';
import ContactTab from './tabs/ContactTab';
import { getJalaliToday, seniorityFromProfile, toFa, toEn } from './helpers';


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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    housingAllowance: 30000000, // ۳۰ میلیون ریال
    groceryAllowance: 22000000, // ۲۲ میلیون ریال
    childAllowance: (user?.children_count || 0) * 16625550,
    overtimeHours: 20,
    overtimeRate: Math.round((Number(user?.last_salary_million_rial || 100) * 1_000_000) / 220 * 1.4),
    insuranceDeduction: true,
    taxDeduction: false,
    eidi: 0,          // ← اضافه شده در نسخه ۴
    taxAmount: 0      // ← اضافه شده در نسخه ۴
  });


  useEffect(() => {
    if (user) {
      setPayslipData(prev => ({
        ...prev,
        eidi: calculations.finalEidi,
        taxAmount: calculations.salaryIncomeTax,
        empName: user.full_name || (user.first_name ? `${user.first_name} ${user.last_name}` : prev.empName),
        nationalId: user.username || user.national_code || prev.nationalId,
        workshopName: user.company_name || prev.workshopName,
        month: getCurrentJalaliMonthLabel(),
        baseSalary: Number(user.last_salary_million_rial || 100) * 1_000_000,
        childAllowance: (user?.children_count || 0) * 16625550,
        overtimeRate: Math.round((Number(user.last_salary_million_rial || 100) * 1_000_000) / 220 * 1.4)

      }));
    }
    }, [user, payslipData.baseSalary, payslipData.housingAllowance, payslipData.groceryAllowance]);





  
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

    // ۱۱. عیدی و پاداش سالانه (ماده واحده مصوب ۱۳۷۰)
    const eidiBaseDays = 60;
    const eidiMaxDays = 90;
    const minDailyWage1405 = 3500000; // حداقل دستمزد روزانه
   const workedDaysThisYear = Math.min(years * 365 + months * 30 + days, 365);
    const calculatedEidi = Math.min(dailyWage * eidiBaseDays, minDailyWage1405 * eidiMaxDays);
    const finalEidi = Math.round((calculatedEidi / 365) * Math.max(workedDaysThisYear, 1));
    const insuranceCeilingMonthly = minDailyWage1405 * 30 * 7; // سقف ماهانه بیمه
    const insurableBase = Math.min(
      baseSalary + (payslipData.housingAllowance || 0) + (payslipData.groceryAllowance || 0),
      insuranceCeilingMonthly
    );

    const insuranceWorker = Math.round(insurableBase * 0.07);
    const insuranceEmployer = Math.round(insurableBase * 0.20);
    const insuranceGov = Math.round(insurableBase * 0.03);
    const insuranceTotal = insuranceWorker + insuranceEmployer + insuranceGov;


    // ۸. بیمه اختیاری، مشاغل آزاد و زنان خانه‌دار
    const voluntaryInsurance = baseSalary * 0.27; // اختیاری ۲۷٪
    const housewife12 = baseSalary * 0.12; // ۱۲٪ بازنشستگی
    const housewife14 = baseSalary * 0.14; // ۱۴٪ بازنشستگی و فوت
    const housewife18 = baseSalary * 0.18; // ۱۸٪ کامل با ازکارافتادگی


    // ۱۲. محاسبه مالیات بر درآمد حقوق پلکانی دقیق
    const taxableGross = baseSalary + (payslipData.housingAllowance || 0) + (payslipData.groceryAllowance || 0);
    const monthlyTaxExemption1405 = 140000000; // سقف معافیت ماهانه (ریال)
    const taxBase = Math.max(0, taxableGross - monthlyTaxExemption1405);
    
    // پله‌های مالیاتی (قابل تنظیم بر اساس تبصره بودجه ۱۴۰۵)
    const taxBrackets = [
      { width: 100000000, rate: 0.10 },
      { width: 150000000, rate: 0.15 },
      { width: 250000000, rate: 0.20 },
      { width: Infinity,    rate: 0.30 },
    ];
    
    let salaryIncomeTax = 0;
    let remainingTaxable = taxBase;
    for (const bracket of taxBrackets) {
      if (remainingTaxable <= 0) break;
      const slice = Math.min(remainingTaxable, bracket.width);
      salaryIncomeTax += slice * bracket.rate;
      remainingTaxable -= slice;
    }
    salaryIncomeTax = Math.round(salaryIncomeTax);

    
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
      pensionEstimate,
      finalEidi,
      salaryIncomeTax 
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
        {activeTab === 'home' && <HomeTab activeBanner={activeBanner} banners={banners} setActiveBanner={setActiveBanner} setActiveCalc={setActiveCalc} setActiveTab={setActiveTab} />}

        {/* ===================== ۲. تب محاسبات تخصصی ===================== */}
        {activeTab === 'calculator' && <CalculatorTab MAX_SALARY_RIAL={MAX_SALARY_RIAL} activeCalc={activeCalc} baseSalary={baseSalary} calculations={calculations} days={days} dependents={dependents} formatRial={formatRial} handleSalaryTextBlur={handleSalaryTextBlur} handleSalaryTextChange={handleSalaryTextChange} handleSliderSalaryChange={handleSliderSalaryChange} hours={hours} insuranceYears={insuranceYears} months={months} nightHours={nightHours} salaryInputText={salaryInputText} setActiveCalc={setActiveCalc} setBaseSalary={setBaseSalary} setDays={setDays} setDependents={setDependents} setHours={setHours} setInsuranceYears={setInsuranceYears} setMonths={setMonths} setNightHours={setNightHours} setSalaryInputText={setSalaryInputText} setShiftType={setShiftType} setUnemploymentMonths={setUnemploymentMonths} setUnworkedLeaveDays={setUnworkedLeaveDays} setWorkHistoryYears={setWorkHistoryYears} setYears={setYears} shiftType={shiftType} unemploymentMonths={unemploymentMonths} unworkedLeaveDays={unworkedLeaveDays} workHistoryYears={workHistoryYears} years={years} />}
               {/* --- شاخه رندر تب شبیه‌ساز هیئت تشخیص (۱۵ مرحله‌ای تخصصی) --- */}
        {activeTab === 'tribunal' && <TribunalTab calculateTribunal={calculateTribunal} setTribunalData={setTribunalData} setTribunalResult={setTribunalResult} setTribunalStep={setTribunalStep} tribunalData={tribunalData} tribunalResult={tribunalResult} tribunalStep={tribunalStep} />}




            {/* --- شاخه رندر تب فیش حقوقی پرسنلی --- */}
        {activeTab === 'payslip' && <PayslipTab calculations={calculations} fontFamily={fontFamily} handlePrintDocument={handlePrintDocument} isAndroid={isAndroid} payslipData={payslipData} setActiveTab={setActiveTab} setPayslipData={setPayslipData} user={user} />}
        {/* ===================== ۳. تب شعب تأمین اجتماعی ===================== */}
        {activeTab === 'tamin' && <TaminTab  />}

        {/* ===================== ۴. تب مخزن ۱۰۵ قالب حقوقی و رسمی ===================== */}
        {activeTab === 'templates' && <TemplatesTab copiedTemplateId={copiedTemplateId} copyTemplateContent={copyTemplateContent} selectedTemplateCategory={selectedTemplateCategory} setSelectedTemplateCategory={setSelectedTemplateCategory} setTemplateSearchQuery={setTemplateSearchQuery} setTemplateVisibleCount={setTemplateVisibleCount} templateListRef={templateListRef} templateLoadStep={templateLoadStep} templateSearchQuery={templateSearchQuery} templateVisibleCount={templateVisibleCount} />}

                {/* ===================== ۵. تب پایگاه قوانین ===================== */}
        {activeTab === 'laws' && <LawsTab lawSearchQuery={lawSearchQuery} lawVisibleCount={lawVisibleCount} selectedLawCategory={selectedLawCategory} setLawSearchQuery={setLawSearchQuery} setLawVisibleCount={setLawVisibleCount} setSelectedLawCategory={setSelectedLawCategory} />}

                {/* ===================== ۶. راهنمای سامانه و پرسش‌های تخصصی ===================== */}
        {activeTab === 'faq' && <FaqTab faqSearchQuery={faqSearchQuery} openFaq={openFaq} setFaqSearchQuery={setFaqSearchQuery} setOpenFaq={setOpenFaq} />}

               {/* ===================== ۷. ارتباط با ما ===================== */}
        {activeTab === 'contact' && <ContactTab captchaOk={captchaOk} selectedTicket={selectedTicket} setCaptchaOk={setCaptchaOk} setSelectedTicket={setSelectedTicket} setShowTickets={setShowTickets} setTicketBody={setTicketBody} setTicketSubject={setTicketSubject} setTickets={setTickets} showTickets={showTickets} ticketBody={ticketBody} ticketSubject={ticketSubject} tickets={tickets} token={token} />}
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
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
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
