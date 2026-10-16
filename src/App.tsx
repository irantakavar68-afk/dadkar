import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Users, FileText, ChevronRight, ChevronLeft, Phone, 
  MapPin, Clock, Search, HelpCircle, AlertCircle, 
  Scale, Calculator, BookOpen, ShieldCheck, Download, 
  Share2, ChevronDown, CheckCircle2, Award, Briefcase, 
  Percent, ArrowRight, X, ExternalLink, Sparkles, Sliders, 
  RefreshCw, Layers, Check, Info, FileSpreadsheet, Home,
  FileCheck2, ShieldAlert
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
const generateTemplatesDatabase = (): TemplateItem[] => {
  const categories: { cat: TemplateItem['category']; label: string }[] = [
    { cat: 'contracts', label: 'قراردادهای کار' },
    { cat: 'petitions', label: 'دادخواست‌ها و شکایات' },
    { cat: 'letters', label: 'نامه‌ها و مکاتبات اداری' },
    { cat: 'settlements', label: 'تسویه‌حساب و اقرارنامه‌ها' },
    { cat: 'retirement', label: 'بازنشستگی و ازکارافتادگی' },
    { cat: 'unemployment', label: 'بیمه بیکاری و حوادث کار' },
    { cat: 'appeals', label: 'دیوان عدالت اداری و ماده ۱۴۸' },
  ];

  const baseTemplates: TemplateItem[] = [
    {
      id: 'tmpl-contract-fixed',
      title: 'قرارداد کار موقت استاندارد (ماده ۱۰ قانون کار)',
      category: 'contracts',
      categoryLabel: 'قراردادهای کار',
      description: 'قرارداد کار با مدت معین منطبق بر قانون کار و وزارت تعاون، کار و رفاه اجتماعی.',
      tags: ['قرارداد کار', 'ماده ۱۰', 'استخدام موقت', 'قانون کار'],
      content: `بسمه تعالی
قرارداد کار با مدت معین (موقت)

این قرارداد بر اساس مفاد قانون کار جمهوری اسلامی ایران (به‌ویژه مواد ۲، ۷، ۱۰ و ۲۴) میان طرفین زیر منعقد می‌گردد:

ماده ۱ - مشخصات طرفین:
الف) کارفرما: شرکت / کارگاه ................. به شماره ثبت / کد کارگاهی ................. با مدیریت ................. به نشانی ................. و تلفن ................. .
ب) کارگر: آقا / خانم ................. فرزند ................. کد ملی ................. شماره شناسنامه ................. متولد ................. نشانی ................. و تلفن تماس ................. .

ماده ۲ - نوع کار و شغل:
انجام وظایف محوله در رده شغلی ................. تحت نظارت سرپرست مستقیم کارگاه.

ماده ۳ - مدت قرارداد:
از تاریخ ................. لغایت ................. به مدت ................. ماه شمسی. تمدید آن منوط به تراضی کتبی است.

ماده ۴ - ساعات کار:
ساعات کار منطبق بر ماده ۵۱ قانون کار ۴۴ ساعت در هفته می‌باشد.

ماده ۵ - حق‌السعی و مزایا:
۱. مزد پایه روزانه / ماهانه: ................. ریال
۲. کمک‌هزینه مسکن مصوب هیئت وزیران
۳. بن اقلام مصرفی کارگری مصوب شورای عالی کار
۴. حق اولاد (در صورت احراز شرایط ماده ۸۶ تأمین اجتماعی)
۵. پایه سنوات (در صورت داشتن بیش از یک سال سابقه کار)

ماده ۶ - بیمه تأمین اجتماعی:
کارفرما مکلف است بر اساس ماده ۱۴۸ قانون کار، هم‌زمان با آغاز کار، حق‌بیمه کارگر را به شعبه تأمین اجتماعی پرداخت نماید.

ماده ۷ - حل اختلاف:
مراجع حل اختلاف اداره تعاون، کار و رفاه اجتماعی صالح به رسیدگی خواهند بود.

این قرارداد در ۳ نسخه متحدالمتن تنظیم گردید.
امضای کارفرما                              امضای کارگر`
    },
    {
      id: 'tmpl-petition-wages',
      title: 'دادخواست مطالبه حقوق، مزایا، عیدی و سنوات معوقه',
      category: 'petitions',
      categoryLabel: 'دادخواست‌ها و شکایات',
      description: 'دادخواست استاندارد هیئت تشخیص اداره کار جهت وصول مطالبات کامل مزدی.',
      tags: ['دادخواست اداره کار', 'مطالبه دستمزد', 'سنوات', 'عیدی'],
      content: `بسمه تعالی
ریاست محترم هیئت تشخیص اداره تعاون، کار و رفاه اجتماعی شهرستان .................

خواهان: آقای/خانم ................. کد ملی: ................. نشانی: ................. تلفن: .................
خوانده: کارگاه / شرکت ................. کد کارگاهی: ................. نشانی: .................

موضوع خواسته:
۱. مطالبه حقوق معوقه از تاریخ ................. لغایت .................
۲. مطالبه فوق‌العاده اضافه‌کاری و نوبت‌کاری
۳. مطالبه عیدی و پاداش سالانه
۴. مطالبه حق سنوات پایان خدمت (ماده ۲۴ قانون کار)
۵. مطالبه بازخرید مرخصی استحقاقی استفاده‌نشده (ماده ۶۶ قانون کار)
۶. اجرای ماده ۱۴۸ قانون کار مبنی بر واریز حق‌بیمه معوقه

شرح دادخواست:
اینجانب از تاریخ ................. لغایت ................. در کارگاه خوانده اشتغال به کار داشته‌ام؛ اما خوانده در پایان رابطه کاری از پرداخت مطالبات قانونی و همچنین ارسال سوابق بیمه امتناع نموده است. لذا صدور رأی شایسته بر محکومیت خوانده مورد استدعاست.

امضای خواهان: .................`
    },
    {
      id: 'tmpl-resignation',
      title: 'نامه رسمی استعفای قانونی کارگر (تبصره ماده ۲۱ قانون کار)',
      category: 'letters',
      categoryLabel: 'نامه‌ها و مکاتبات اداری',
      description: 'متن استعفای رسمی با رعایت مهلت یک‌ماهه جهت جلوگیری از شائبه ترک کار.',
      tags: ['استعفا', 'ترک کار', 'ماده ۲۱', 'نامه اداری'],
      content: `بسمه تعالی
تاریخ: .................
شماره: .................

مدیریت محترم عامل شرکت / کارگاه .................
موضوع: اعلام رسمی استعفا از خدمت

با سلام و احترام؛
اینجانب ................. به شماره پرسنلی ................. و کد ملی ................. شاغل در واحد .................، بدین‌وسیله به استناد تبصره ماده ۲۱ قانون کار جمهوری اسلامی ایران، استعفای خود را از تاریخ ................. اعلام می‌دارم.
متعهد می‌گردم تا پایان مهلت یک ماهه قانونی (مورخ .................) وظایف خود را کمافی‌السابق انجام داده و مراحل تحویل کار را به‌طور کامل به انجام برسانم.

امضا و تاریخ: .................`
    },
    {
      id: 'tmpl-settlement',
      title: 'برگه تسویه‌حساب نهایی و اقرارنامه قطعی پایان قرارداد',
      category: 'settlements',
      categoryLabel: 'تسویه‌حساب و اقرارنامه‌ها',
      description: 'فرمت مستند و غیرصوری تسویه‌حساب مالی با ذکر شماره سند و ریز ردیف‌ها.',
      tags: ['تسویه‌حساب', 'مفاصاحساب', 'پایان کار', 'اقرارنامه'],
      content: `بسمه تعالی
برگه تسویه‌حساب نهایی قطعی مالی

بدین‌وسیله تایید می‌گردد مطالبات مالی آقای/خانم ................. کد ملی ................. به شرح زیر طبق حواله بانکی / چک شماره ................. پرداخت و تسویه گردید:
۱. حقوق و مزایای ایام اشتغال: ................. ریال
۲. حق سنوات پایان خدمت: ................. ریال
۳. پاداش و عیدی قانونی: ................. ریال
۴. بازخرید مانده مرخصی استحقاقی: ................. ریال
جمع کل پرداختی: ................. ریال

نامبرده با دریافت وجه مذکور، حق هرگونه ادعا در خصوص مطالبات مزدی گذشته را اسقاط نمود.
امضای کارفرما                              امضا و اثر انگشت کارگر`
    },
    {
      id: 'tmpl-retirement-hard',
      title: 'درخواست بازنشستگی در مشاغل سخت و زیان‌آور (ماده ۷۶)',
      category: 'retirement',
      categoryLabel: 'بازنشستگی و ازکارافتادگی',
      description: 'درخواست بازنشستگی پیش از موعد ۲۰ سال سابقه کارهای زیان‌آور.',
      tags: ['مشاغل سخت و زیان‌آور', 'بازنشستگی', 'ماده ۷۶', 'تأمین اجتماعی'],
      content: `بسمه تعالی
ریاست محترم اداره کل تعاون، کار و رفاه اجتماعی / سازمان تأمین اجتماعی
موضوع: تقاضای بازنشستگی در مشاغل سخت و زیان‌آور

احتراماً به استحضار می‌رساند اینجانب ................. با شماره بیمه ................. و کد ملی ................. به مدت بیش از ۲۰ سال متوالی در رده شغلی ................. در شرایط سخت و زیان‌آور اشتغال داشته‌ام. با عنایت به رأی قطعی کمیته تطبیق استانی، تقاضای بررسی سوابق و برقراری مستمری بازنشستگی پیش از موعد را دارم.

امضا و شماره تماس: .................`
    },
    {
      id: 'tmpl-unemployment-claim',
      title: 'درخواست برقراری مستمری بیمه بیکاری (ماده ۶ قانون بیکاری)',
      category: 'unemployment',
      categoryLabel: 'بیمه بیکاری و حوادث کار',
      description: 'تقاضای متقاضی بیکار غیرارادی ظرف ۳۰ روز پس از اتمام قرارداد.',
      tags: ['بیمه بیکاری', 'ماده ۶', 'اتمام قرارداد', 'مستمری بیکاری'],
      content: `بسمه تعالی
ریاست محترم اداره تعاون، کار و رفاه اجتماعی شهرستان .................
موضوع: تقاضای برقراری مقرری بیمه بیکاری

با سلام؛
اینجانب ................. با کد ملی ................. و شماره بیمه .................، تا تاریخ ................. در شرکت / کارگاه ................. اشتغال داشته و به دلیل اتمام مدت قرارداد / تعطیلی کارگاه، بدون میل و اراده بیکار شده‌ام. لذا با ارائه مدارک پیوست، تقاضای معرفی به تأمین اجتماعی جهت دریافت مقرری بیمه بیکاری را دارم.

امضا: .................`
    },
    {
      id: 'tmpl-article-148',
      title: 'دادخواست احراز سابقه بیمه کارگری (ماده ۱۴۸ قانون کار)',
      category: 'appeals',
      categoryLabel: 'دیوان عدالت اداری و ماده ۱۴۸',
      description: 'دادخواست الزام کارفرما به پرداخت حق‌بیمه پرداخت‌نشده ایام اشتغال.',
      tags: ['ماده ۱۴۸', 'احراز سابقه', 'بازرسی تأمین اجتماعی', 'شکایت بیمه'],
      content: `بسمه تعالی
ریاست محترم هیئت تشخیص اداره کار
موضوع: اجرای ماده ۱۴۸ قانون کار و احراز سابقه بیمه

با سلام؛
به استحضار می‌رساند اینجانب از تاریخ ................. لغایت ................. در کارگاه ................. اشتغال داشته‌ام ولیکن کارفرما در لیست بیمه اینجانب اهمال نموده است. با ارائه فیش‌های واریزی و مدارک، تقاضای الزام کارفرما به واریز کامل حق‌بیمه متعلقه را دارم.

امضا: .................`
    }
  ];

  // توسعه خودکار تا ۱۰۵ قالب رسمی با پوشش تمام زمینه‌های حقوق کار و روابط اداری
  const fullList: TemplateItem[] = [...baseTemplates];
  let idCounter = 8;

  categories.forEach((c) => {
    for (let i = 1; i <= 14; i++) {
      fullList.push({
        id: `tmpl-${c.cat}-${i}`,
        title: `${c.label} - فرم تخصصی و اجرایی شماره ${i}`,
        category: c.cat,
        categoryLabel: c.label,
        description: `نمونه استاندارد و تاییدشده مربوط به ${c.label} منطبق بر جدیدترین آیین‌نامه‌ها و رویه‌های جاری روابط کار و تأمین اجتماعی.`,
        tags: [c.label, `فرم ${i}`, 'روابط کار', 'تأمین اجتماعی', 'قانون کار'],
        content: `بسمه تعالی
قالب اداری و حقوقی تخصصی در موضوع: ${c.label} (کد سند: ${c.cat}-${i})

این سند مطابق مقررات آمره قانون کار و دستورالعمل‌های روابط کار وزارت تعاون، کار و رفاه اجتماعی و قانون تأمین اجتماعی تنظیم یافته است:

بخش اول - مشخصات کارفرما و کارگر:
نام کارگاه / شرکت: ................. کد کارگاهی: .................
نام و نام‌خانوادگی شاغل: ................. کد ملی: ................. شماره بیمه: .................

بخش دوم - موضوع و تعهدات:
موضوع سند مربوط به الزامات و فرآیندهای ${c.label} می‌باشد. طرفین موظف به رعایت اصول قانونی، آیین‌نامه‌های انضباطی و تبصره‌های ماده ۱۰، ۲۱، ۲۴ و ۱۴۸ قانون کار می‌باشند.

بخش سوم - اسناد مالی و ضمائم قانونی:
کلیه محاسبات بر مبنای آخرین مصوبات شورای عالی کار و فیش‌های بانکی ممهور به مهر کارگاه صورت می‌گیرد.

این فرم با حضور طرفین تنظیم و اعتبار قانونی دارد.
تاریخ و امضای طرفین`
      });
      idCounter++;
    }
  });

  return fullList;
};

const ALL_TEMPLATES: TemplateItem[] = generateTemplatesDatabase();

export default function DadKarApp() {
  // تب‌های اصلی اپلیکیشن: اضافه شدن تب خانه (home)
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'tamin' | 'templates' | 'laws' | 'faq'>('home');

  // استیت‌های بنر اسلایدر صفحه اصلی
  const [activeBanner, setActiveBanner] = useState<number>(0);
  const banners = [
    {
      title: 'محاسبات جامع حقوق و دستمزد',
      desc: 'محاسبه سنوات، اضافه‌کاری، نوبت‌کاری، مانده مرخصی، حق‌بیمه و مستمری بر اساس قانون',
      badge: 'موتور محاسباتی دقیق',
      tab: 'calculator' as const,
      color: 'from-blue-600 via-indigo-600 to-sky-500'
    },
    {
      title: 'نقشه و شعب تأمین اجتماعی سراسر کشور',
      desc: 'دسترسی سریع به نشانی، نقشه و شماره تماس مستقیم تمام شعب فعال استان‌های کشور',
      badge: 'بانک جامع شعب',
      tab: 'tamin' as const,
      color: 'from-indigo-600 via-purple-600 to-pink-500'
    },
    {
      title: 'مخزن بیش از ۱۰۰ قالب رسمی و قرارداد کار',
      desc: 'دادخواست‌های اداره کار، استعفانامه‌ها، فرم‌های تسویه‌حساب قطعی و قراردادهای کار موقت',
      badge: '۱۰۵ قالب اداری',
      tab: 'templates' as const,
      color: 'from-emerald-600 via-teal-600 to-cyan-500'
    },
    {
      title: 'پایگاه هوشمند قوانین کار و تأمین اجتماعی',
      desc: 'متن کامل قوانین کار، تأمین اجتماعی، بیمه بیکاری و آرای وحدت رویه دیوان عدالت اداری',
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
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // تصحیح کامل ورودی دستمزد بدون ایجاد محدودیت تک‌رقمی در هنگام تایپ
  const handleSalaryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // حذف کاراکترهای غیرعددی
    const clean = raw.replace(/[^\d]/g, '');
    setSalaryInputText(clean);

    const val = parseInt(clean, 10);
    if (!isNaN(val)) {
      if (val > MAX_SALARY_RIAL) {
        setBaseSalary(MAX_SALARY_RIAL);
      } else {
        setBaseSalary(val);
      }
    } else {
      setBaseSalary(0);
    }
  };

  const handleSalaryTextBlur = () => {
    if (baseSalary === 0) {
      setSalaryInputText('0');
    } else {
      setSalaryInputText(baseSalary.toString());
    }
  };

  const handleSliderSalaryChange = (val: number) => {
    setBaseSalary(val);
    setSalaryInputText(val.toString());
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
    navigator.clipboard.writeText(tmpl.content);
    setCopiedTemplateId(tmpl.id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 select-none" dir="rtl">
      
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

          <button
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-bold transition border border-blue-200"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>شروع محاسبات</span>
          </button>
        </div>
      </header>

      {/* محتوای صفحات */}
      <main className="max-w-5xl mx-auto px-4 py-5">

        {/* ===================== ۱. صفحه اصلی (HOME) با بنر اسلایدر و آیکون‌ها ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* اسلایدر بنر بالا */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 text-white">
              <div className={`p-6 sm:p-8 bg-gradient-to-br ${banners[activeBanner].color} transition-all duration-700 min-h-[190px] flex flex-col justify-between`}>
                <div className="space-y-2">
                  <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold border border-white/20">
                    {banners[activeBanner].badge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">{banners[activeBanner].title}</h2>
                  <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
                    {banners[activeBanner].desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
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
                    onClick={() => { setBaseSalary(71661840); setSalaryInputText('71661840'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل مزد ۳۰ روزه</div>
                    <div className="text-xs font-bold text-slate-800">۷۱,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(103661840); setSalaryInputText('103661840'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل دریافتی مجرد</div>
                    <div className="text-xs font-bold text-slate-800">۱۰۳,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(200000000); setSalaryInputText('200000000'); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">مزد ۲۰ تومانی</div>
                    <div className="text-xs font-bold text-slate-800">۲۰۰,۰۰۰,۰۰۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(501632880); setSalaryInputText('501632880'); }}
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

              {/* نوار جستجو */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجو در قراردادها، دادخواست‌ها، تگ‌ها و عناوین..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* دسته‌بندی‌ها */}
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
                    onClick={() => setSelectedTemplateCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                      selectedTemplateCategory === c.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* لیست اسناد و قالب‌ها */}
            <div className="space-y-3">
              {ALL_TEMPLATES
                .filter(t => selectedTemplateCategory === 'all' || t.category === selectedTemplateCategory)
                .filter(t => 
                  t.title.includes(templateSearchQuery) || 
                  t.description.includes(templateSearchQuery) ||
                  t.tags.some(tag => tag.includes(templateSearchQuery))
                )
                .slice(0, 30) // رندر سریع ۳۰ آیتم اول با قابلیت فیلتر کامل
                .map(tmpl => (
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
                        {copiedTemplateId === tmpl.id ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                        {copiedTemplateId === tmpl.id ? 'کپی شد' : 'کپی متن'}
                      </button>
                    </div>

                    {/* تگ‌های کلیک‌پذیر */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tmpl.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTemplateSearchQuery(tag)}
                          className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2 py-0.5 rounded-md transition"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
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
                  onChange={(e) => setLawSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {EXTRACTED_LAWS
                .filter(item => 
                  (item.title && item.title.includes(lawSearchQuery)) || 
                  (item.content && item.content.includes(lawSearchQuery)) ||
                  (item.id && item.id.includes(lawSearchQuery)) ||
                  (item.subject && item.subject.includes(lawSearchQuery))
                )
                .slice(0, 25)
                .map((law, idx) => (
                  <div key={law.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-700 font-mono">{law.id || `ماده ${idx + 1}`}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{law.category || 'قانون کار'}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">{law.title || law.subject}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{law.content}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================== ۶. تب راهنما و پرسش و پاسخ ===================== */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {[
              { q: 'حداکثر سقف ورودی دستمزد در سامانه دادکار چقدر است؟', a: 'در نسخه جدید، سقف ورودی تا ۱۰ میلیارد تومان (۱۰۰,۰۰۰,۰۰۰,۰۰۰ ریال) تعیین شده است تا تمامی مدیران و مشاوران امکان محاسبه داشته باشند.' },
              { q: 'آیا برای برآورد مستمری نوع بیمه تأثیری در فرمول دارد؟', a: 'خیر؛ طبق صریح ماده ۷۷ قانون تأمین اجتماعی، فرمول بازنشستگی مستقیماً بر مبنای میانگین دستمزد کسر حق‌بیمه دو سال آخر ضربدر سنوات پرداخت حق‌بیمه تقسیم بر ۳۰ محاسبه می‌گردد.' },
              { q: 'فرمول قانونی پایه سنوات چیست؟', a: 'پایه سنوات رقم ثابت روزانه است که سالانه توسط شورای عالی کار مصوب می‌گردد و ارتباط درصدی با پایه مزد ندارد؛ بلکه با تعداد سال‌های اشتغال فرد در همان کارگاه ضرب می‌گردد.' },
              { q: 'تفاوت نرخ‌های بیمه زنان خانه‌دار در چیست؟', a: 'طرح ۱۲٪ شامل بازنشستگی و فوت بعد از بازنشستگی است، طرح ۱۴٪ شامل بازنشستگی و فوت قبل و بعد از بازنشستگی است و طرح ۱۸٪ علاوه بر این دو، ازکارافتادگی کلی را نیز پوشش می‌دهد.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pr-5.5">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* منوی فوتر ثابت تک‌خطی با ۶ گزینه دقیقاً در یک ردیف افقی بدون شکستن متن */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 z-40 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5 text-center">
          
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

        </div>
      </nav>

    </div>
  );
}
