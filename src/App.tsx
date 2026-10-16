import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Users, FileText, ChevronRight, Phone, 
  MapPin, Clock, Search, HelpCircle, AlertCircle, 
  Scale, Calculator, BookOpen, ShieldCheck, Download, 
  Share2, ChevronDown, CheckCircle2, Award, Briefcase, 
  Percent, ArrowRight, X, ExternalLink, Sparkles, Sliders, 
  RefreshCw, Layers, Check, Info, FileSpreadsheet, ShieldAlert
} from 'lucide-react';

import TaminBranchesView from './TaminBranchesView';
import { taminProvincesData } from './data/taminData';
import { lawsDatabase, LawItem } from './lawsData';

// --- رابط‌های تایپ اسکریپت ---
interface Article {
  number: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  notes?: string[];
}

interface TemplateItem {
  id: string;
  title: string;
  category: 'contracts' | 'petitions' | 'letters' | 'settlements' | 'retirement' | 'unemployment' | 'appeals';
  categoryLabel: string;
  description: string;
  content: string;
  tags: string[];
}

// دیتابیس ۲۰ قالب حقوقی و اداری استاندارد
const TEMPLATES_DATABASE: TemplateItem[] = [
  {
    id: 'contract-fixed-term',
    title: 'قرارداد کار موقت (مشاغل غیرمستمر و پروژه‌ای)',
    category: 'contracts',
    categoryLabel: 'قراردادهای کار',
    description: 'قرارداد استاندارد بر اساس ماده ۷ و ۱۰ قانون کار جمهوری اسلامی ایران با تعیین حقوق، مزایا، ساعت کار و تعهدات طرفین.',
    tags: ['قرارداد کار', 'ماده ۱۰ قانون کار', 'کار موقت', 'استخدام'],
    content: `بسمه تعالی
قرارداد کار موقت

این قرارداد بر اساس مفاد قانون کار جمهوری اسلامی ایران (به ویژه مواد ۲، ۷، ۱۰ و ۲۴) میان طرفین زیر منعقد می‌گردد:

ماده ۱ - طرفین قرارداد:
الف) کارفرما / نماینده قانونی: شرکت / کارگاه ................. به شماره ثبت / کد کارگاهی ................. به مدیریت آقای/خانم ................. به نشانی ................. و شماره تلفن ................. .
ب) کارگر: آقای / خانم ................. فرزند ................. کد ملی ................. متولد ................. وضعیت نظام وظیفه ................. نشانی ................. و شماره تماس ................. .

ماده ۲ - نوع کار و وظایف:
انجام امور مربوط به پست سازمانی: ................. با شرح وظایف ابلاغی از سوی سرپرست مربوطه و رعایت کامل مقررات انضباطی کارگاه.

ماده ۳ - محل انجام کار:
کارگاه / دفتر مرکزی واقع در: ................. (تغییر محل کار در محدوده همان شهر در حیطه اختیارات کارفرما با حفظ رسته شغلی مجاز است).

ماده ۴ - مدت قرارداد:
از تاریخ ................. لغایت ................. به مدت ................. ماه شمسی. تمدید آن منوط به تراضی کتبی طرفین خواهد بود.

ماده ۵ - حق‌السعی و مزایا:
۱. مزد پایه روزانه / ماهانه: ................. ریال
۲. بن کارگری (کمک‌هزینه اقلام مصرفی): طبق مصوبه شورای عالی کار
۳. حق مسکن: طبق مصوبه هیئت وزیران
۴. حق اولاد (در صورت شمول ماده ۸۶ قانون تأمین اجتماعی): ................. ریال
۵. پایه سنوات (در صورت داشتن بیش از یک سال سابقه در کارگاه): طبق مصوبه شورای عالی کار
تبصره: پرداخت‌ها پایان هر ماه خورشیدی به حساب شماره ................. نزد بانک ................. واریز خواهد شد.

ماده ۶ - ساعات کار و مرخصی‌ها:
ساعات کار منطبق بر ماده ۵۱ قانون کار ۴۴ ساعت در هفته می‌باشد. حق استفاده از تعطیلات هفتگی، رسمی و مرخصی استحقاقی طبق مواد ۶۲ الی ۶۹ قانون کار لحاظ خواهد شد.

ماده ۷ - بیمه تأمین اجتماعی:
کارفرما مکلف است بر اساس ماده ۱۴۸ قانون کار، از روز اول اشتغال، لیست بیمه کارگر را به شعبه تأمین اجتماعی ارسال و حق‌بیمه قانونی (۷٪ سهم کارگر و ۲۳٪ سهم کارفرما) را تادیه نماید.

ماده ۸ - حل اختلاف:
در صورت بروز اختلاف، موضوع از طریق مذاکره دوجانبه و در صورت عدم حصول توافق، از طریق هیئت‌های تشخیص و حل اختلاف اداره تعاون، کار و رفاه اجتماعی پیگیری خواهد شد.

این قرارداد در ۸ ماده و در ۳ نسخه متحدالمتن تنظیم و امضا گردید.
امضای کارفرما                              امضای کارگر`
  },
  {
    id: 'petition-unpaid-wages',
    title: 'دادخواست مطالبه معوقات حقوق، مزایا، عیدی و پاداش',
    category: 'petitions',
    categoryLabel: 'دادخواست‌ها و شکایات کارگری',
    description: 'دادخواست فرمت هیئت تشخیص اداره کار جهت وصول حقوق پرداخت‌نشده، بن، مسکن، اضافه‌کاری و عیدی.',
    tags: ['دادخواست اداره کار', 'مطالبه مزد', 'عیدی و سنوات', 'هیئت تشخیص'],
    content: `بسمه تعالی
ریاست محترم هیئت تشخیص اداره تعاون، کار و رفاه اجتماعی شهرستان .................

خواهان: آقای/خانم ................. کد ملی: ................. نشانی: ................. تلفن: .................
خوانده: شرکت / کارگاه ................. به مدیریت: ................. نشانی: ................. کد کارگاهی: .................

موضوع خواسته:
۱. مطالبه حقوق و دستمزد معوقه از تاریخ ................. لغایت .................
۲. مطالبه فوق‌العاده اضافه‌کاری و جمعه‌کاری
۳. مطالبه حق سنوات خدمت (ماده ۲۴ قانون کار)
۴. مطالبه عیدی و پاداش سالانه قانونی
۵. مطالبه حق بن کارگری و حق مسکن پرداخت‌نشده
۶. الزام خوانده به واریز حق‌بیمه ایام اشتغال (ماده ۱۴۸ قانون کار)

شرح دادخواست:
با سلام و احترام؛
به استحضار می‌رساند اینجانب از تاریخ ................. لغایت ................. در کارگاه خوانده محترم به عنوان ................. با دستمزد ماهانه ................. ریال مشغول به خدمت بوده‌ام. متأسفانه کارفرما در پایان دوره همکاری از پرداخت مطالبات قانونی اینجانب شامل حقوق معوقه ماه‌های .................، حق مسکن، بن کارگری، پاداش و سنوات استنکاف نموده است.
لذا با استناد به مواد ۲۴، ۳۴، ۳۷، ۱۴۸ و سایر مقررات آمره قانون کار، صدور رأی مقتضی مبنی بر محکومیت خوانده به پرداخت مطالبات معوق به انضمام حق‌بیمه معوقه مورد استدعاست.

مدارک و ضمائم:
۱. کپی کارت ملی
۲. پرینت پرینت بانکی واریز حقوق
۳. سابقه بیمه تأمین اجتماعی
۴. تصویر کارت ورود و خروج / قرارداد کار

با تجدید احترام؛
نام و امضای خواهان: .................`
  },
  {
    id: 'resignation-letter',
    title: 'نامه استعفای قانونی کارگر (ماده ۲۱ قانون کار)',
    category: 'letters',
    categoryLabel: 'نامه‌ها و مکاتبات اداری',
    description: 'متن استعفای کتبی کارگر با رعایت بازه یک ماهه ادامه کار مندرج در تبصره ماده ۲۱ قانون کار.',
    tags: ['استعفا', 'ماده ۲۱ قانون کار', 'مکاتبه اداری', 'ترک کار قانونی'],
    content: `بسمه تعالی
تاریخ: .................
شماره ثبت اندیکاتور: .................

جناب آقای / سرکار خانم .................
مدیریت محترم عامل شرکت / کارگاه .................

موضوع: اعلام کتبی استعفا از خدمت

با سلام و احترام؛
بدین‌وسیله به استحضار می‌رساند اینجانب ................. فرزند ................. شاغل در ردیف شغلی ................. در بخش / واحد .................، به دلایل شخصی قادر به ادامه همکاری با این مجموعه محترم نمی‌باشم.
لذا در اجرای تبصره ماده ۲۱ قانون کار جمهوری اسلامی ایران، مراتب استعفای رسمی خود را از تاریخ ................. کتباً اعلام می‌دارم. متعهد می‌گردم به مدت یک ماه کامل (تا تاریخ .................) در محل کار حاضر و کلیه امور محوله، وظایف جاری و مستندات تحت اختیار را به‌طور کامل به همکار جانشین تحویل نمایم.
خواهشمند است دستور فرمایید هماهنگی‌های لازم جهت تحویل و تحول کار و انجام مراحل تسویه‌حساب نهایی صورت پذیرد.

با آرزوی موفقیت روزافزون برای مجموعه؛
نام و نام‌خانوادگی: .................
امضا و اثر انگشت: .................`
  },
  {
    id: 'full-settlement-release',
    title: 'برگ تسویه‌حساب نهایی قطعی و اقرارنامه مالی',
    category: 'settlements',
    categoryLabel: 'تسویه‌حساب و توافق‌نامه‌ها',
    description: 'فرمت اصولی و غیرصوری تسویه‌حساب پایان قرارداد با قید ریز اقلام دریافتی جهت پیشگیری از ابطال.',
    tags: ['تسویه‌حساب', 'مفاصاحساب', 'اقرارنامه', 'پایان کار'],
    content: `بسمه تعالی
برگ تسویه‌حساب قطعی مالی و اداری

این سند در تاریخ ................. میان کارفرما شرکت / کارگاه ................. و آقای / خانم ................. کد ملی ................. تنظیم گردید:

بدین‌وسیله نامبرده اقرار می‌نماید که در پایان قرارداد کار مورخ .................، کلیه مطالبات قانونی و شرعی خود ناشی از رابطه کارگری و کارفرمایی را طبق جدول زیر به موجب چک بانکی / حواله پایا شماره ................. مورخ ................. دریافت نموده است:

۱. حقوق و مزایای معوقه: ................. ریال
۲. حق سنوات پایان خدمت (ماده ۲۴ قانون کار): ................. ریال
۳. پاداش و عیدی مصوب قانونی: ................. ریال
۴. بازخرید ایام مرخصی استحقاقی مانده (ماده ۶۶): ................. ریال
۵. اضافه کاری و تعطیل کاری: ................. ریال
جمع کل پرداختی: ................. ریال (به حروف: ................. ریال)

اقرار و اسقاط حق:
اینجانب اقرار می‌دارم که کلیه اموال، اسناد، تجهیزات و ابزارآلات کارگاهی تحویل داده شده را به طور صحیح عودت نموده و با دریافت مبالغ فوق‌الذکر، هیچ‌گونه ادعا یا شکایتی تحت عناوین مزد، حق سنوات، مرخصی و سایر موارد نداشته و حق هرگونه اعتراض بعدی را از خود سلب و ساقط می‌نمایم.

امضای کارفرما                              امضا و اثر انگشت کارگر`
  },
  {
    id: 'retirement-hard-jobs',
    title: 'درخواست بازنشستگی در مشاغل سخت و زیان‌آور',
    category: 'retirement',
    categoryLabel: 'بازنشستگی و ازکارافتادگی',
    description: 'تقاضای بازنشستگی بر اساس قانون اصلاح تبصره ۲ الحاقی به ماده ۷۶ قانون تأمین اجتماعی (۲۰ سال متوالی سابقه).',
    tags: ['مشاغل سخت و زیان‌آور', 'بازنشستگی', 'ماده ۷۶', 'تأمین اجتماعی'],
    content: `بسمه تعالی
ریاست محترم اداره کل تعاون، کار و رفاه اجتماعی / ریاست محترم شعبه ................. تأمین اجتماعی

با سلام و احترام؛
اینجانب ................. فرزند ................. کد ملی ................. شماره بیمه ................. شاغل در کارگاه / شرکت ................. به اطلاع می‌رساند:
نظر به اینکه عنوان شغلی اینجانب به عنوان ................. در کمیته‌های بدوی و تجدیدنظر مشاغل سخت و زیان‌آور استان، مشمول صفت سخت و زیان‌آور شناخته شده است و اینجانب دارای بیش از ۲۰ سال متوالی / ۲۵ سال متناوب سابقه پرداخت حق‌بیمه در مشاغل مذکور می‌باشم؛
لذا با استناد به قانون الحاق یک تبصره به ماده ۷۶ قانون تأمین اجتماعی، تقاضای بررسی سوابق و اعلام به شعبه تأمین اجتماعی جهت برقراری مستمری بازنشستگی پیش از موعد را دارم.

مدارک پیوست:
۱. کپی کارت ملی و شناسنامه
۲. تأییدیه آرای کمیته تطبیق مشاغل سخت و زیان‌آور
۳. ریز دستمزد و سوابق بیمه‌ای

امضا و شماره تماس: .................`
  },
  {
    id: 'unemployment-benefit-claim',
    title: 'درخواست برقراری مقرری بیمه بیکاری',
    category: 'unemployment',
    categoryLabel: 'بیمه بیکاری و حوادث کار',
    description: 'درخواست قانونی متقاضی بیکار غیرارادی جهت ثبت در سامانه و بررسی در کمیته دوجانبه اداره کار و تأمین اجتماعی.',
    tags: ['بیمه بیکاری', 'عدم تمدید قرارداد', 'ماده ۶ قانون بیکاری', 'مستمری'],
    content: `بسمه تعالی
ریاست محترم اداره تعاون، کار و رفاه اجتماعی شهرستان .................

با سلام و تحیات؛
احتراماً به استحضار می‌رساند اینجانب ................. فرزند ................. با کد ملی ................. و شماره بیمه ................. از تاریخ ................. در شرکت / کارگاه ................. مشغول به خدمت بوده‌ام.
در تاریخ ................. به دلیل اتمام مدت قرارداد کار موقت / تعطیلی کارگاه، علیرغم میل باطنی و بدون اراده از کار منفک و بیکار شده‌ام.
با توجه به اینکه اینجانب مشمول قانون کار و تأمین اجتماعی بوده و دارای سابقه پرداخت حق‌بیمه بیش از حداقل قانونی می‌باشم، با رعایت مهلت مقرر ۳۰ روزه، تقاضای معرفی به سازمان تأمین اجتماعی شعبه ................. جهت دریافت مقرری بیمه بیکاری موضوع مواد ۳، ۶ و ۷ قانون بیمه بیکاری را دارم.

پیوست‌ها:
۱. قرارداد کار موقت اخیر
۲. نامه عدم نیاز / پایان کار از سوی کارفرما
۳. کپی صفحه اول دفترچه یا برگه اطلاعات هویتی

نام و امضای متقاضی: .................`
  },
  {
    id: 'appeal-article-148',
    title: 'دادخواست احراز سابقه بیمه کارگری (ماده ۱۴۸ قانون کار)',
    category: 'appeals',
    categoryLabel: 'اعتراضات و دیوان عدالت اداری',
    description: 'دادخواست الزام کارفرما به پرداخت حق‌بیمه ایام اشتغال اعلام‌نشده به سازمان تأمین اجتماعی.',
    tags: ['ماده ۱۴۸', 'احراز سابقه', 'بازرسی بیمه', 'جرایم بیمه‌ای'],
    content: `بسمه تعالی
ریاست محترم هیئت تشخیص / حل اختلاف اداره تعاون، کار و رفاه اجتماعی

خواهان: ................. کد ملی: ................. نشانی: .................
خوانده: شرکت / کارگاه ................. با کد کارگاهی ................. نشانی: .................

موضوع: تقاضای اعمال ماده ۱۴۸ قانون کار (الزام به واریز حق‌بیمه ایام اشتغال اعلام نشده)

شرح دادخواست:
به استحضار می‌رساند اینجانب از تاریخ ................. لغایت ................. به عنوان ................. در مجموعه متعلق به خوانده مشغول به خدمت بوده‌ام، اما متأسفانه کارفرما در بازه زمانی از تاریخ ................. لغایت ................. (به مدت ................. ماه/سال) نسبت به ارسال لیست بیمه و پرداخت حق‌بیمه اینجانب به شعبه تأمین اجتماعی استنکاف نموده است.
نظر به حاکمیت ماده ۱۴۸ قانون کار مبنی بر تکلیف کارفرما به بیمه نمودن کارگر و ماده ۳۶ قانون تأمین اجتماعی، تقاضای صدور رأی مبنی بر احراز رابطه کارگری و الزام خوانده به تادیه اصل حق‌بیمه و خسارات متعلقه در حق سازمان تأمین اجتماعی را دارم.

ادله اثبات دعوا:
۱. پرینت واریز دستمزد به حساب بانکی
۲. استشهادیه محلی همکاران شاغل
۳. دفاتر قانونی و فاکتورهای امضاشده توسط خواهان
۴. معرفی‌نامه‌ها یا اسناد مرخصی اداری

امضای خواهان: .................`
  }
];

export default function DadKarApp() {
  // تب‌های اصلی ناوبری برنامه
  const [activeTab, setActiveTab] = useState<'calculator' | 'tamin' | 'templates' | 'laws' | 'faq'>('calculator');
  
  // لودینگ اولیه اپلیکیشن
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // استیت‌های بخش محاسبات
  const [activeCalc, setActiveCalc] = useState<string>('salary');
  // پیش‌فرض ۱۰ میلیون تومان (۱۰۰ میلیون ریال)
  const [baseSalary, setBaseSalary] = useState<number>(100000000);
  const [salaryInputText, setSalaryInputText] = useState<string>('100,000,000');
  
  const [years, setYears] = useState<number>(1);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10);
  const [shiftType, setShiftType] = useState<string>('morning_evening');
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(5);
  const [dependents, setDependents] = useState<number>(1);
  const [unemploymentMonths, setUnemploymentMonths] = useState<number>(24);
  const [insuranceYears, setInsuranceYears] = useState<number>(30);
  const [pensionInsuranceType, setPensionInsuranceType] = useState<string>('compulsory');

  // استیت‌های بخش قوانین
  const [lawSearchQuery, setLawSearchQuery] = useState('');
  const [selectedLawCategory, setSelectedLawCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // استیت‌های بخش قالب‌های حقوقی
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // شبیه‌سازی لودینگ پویا و حرفه‌ای
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 90);
    return () => clearInterval(timer);
  }, []);

  // کنترل تغییر مبلغ ورودی به صورت عددی دستی تا ۱۰ میلیارد ریال
  const handleSalaryInputChange = (rawVal: string) => {
    const cleanDigits = rawVal.replace(/[^\d]/g, '');
    let num = parseInt(cleanDigits, 10);
    if (isNaN(num)) num = 0;
    
    // سقف ۱۰ میلیارد ریال (۱۰,۰۰۰,۰۰۰,۰۰۰ ریال)
    if (num > 10000000000) num = 10000000000;

    setBaseSalary(num);
    setSalaryInputText(num > 0 ? num.toLocaleString('fa-IR') : '');
  };

  const handleSalarySliderChange = (sliderVal: number) => {
    setBaseSalary(sliderVal);
    setSalaryInputText(sliderVal.toLocaleString('fa-IR'));
  };

  // محاسبات جامع حقوق، دستمزد، بیمه و مستمری
  const calculations = useMemo(() => {
    // پایه‌ها طبق ماده ۳۵ و ۳۷ قانون کار
    const dailyWage = baseSalary / 30;
    const hourlyWage = baseSalary / 220; // عرف استاندارد قانون کار برای ۴۴ ساعت هفتگی

    // ۱. حق سنوات پایان خدمت (ماده ۲۴ قانون کار)
    const totalWorkingDays = (years * 365) + (months * 30) + days;
    const severancePay = (baseSalary / 365) * totalWorkingDays;

    // ۲. اضافه کاری (ماده ۵۹ قانون کار - ۴۰٪ مازاد)
    const overtimePay = hours * hourlyWage * 1.4;

    // ۳. نوبت‌کاری (مواد ۵۵ و ۵۶ قانون کار)
    let shiftMultiplier = 0.10;
    if (shiftType === 'morning_afternoon_night') shiftMultiplier = 0.15;
    if (shiftType === 'morning_night' || shiftType === 'afternoon_night') shiftMultiplier = 0.225;
    const shiftPay = baseSalary * shiftMultiplier;

    // ۴. مانده مرخصی استحقاقی (ماده ۶۶ قانون کار - بازخرید بر اساس آخرین مزد روزانه)
    const leavePay = unworkedLeaveDays * dailyWage;

    // ۵. شب‌کاری عادی غیرنوبتی (ماده ۵۸ قانون کار - ۳۵٪ مازاد)
    const nightPay = hours * hourlyWage * 0.35;

    // ۶. پایه سنوات مصوب روزانه (مبلغ پایه روزانه مصوب سالانه ضربدر روزهای ماه)
    const sanavatMonthly = 70000 * 30; // نرخ مبنای پایه سنوات تجمیعی

    // ۷. حق‌بیمه اجباری ۳۰٪ قانون تأمین اجتماعی (ماده ۲۸)
    const insuranceWorker = baseSalary * 0.07;
    const insuranceEmployer = baseSalary * 0.20;
    const insuranceGov = baseSalary * 0.03;
    const insuranceTotal = baseSalary * 0.30;

    // ۸. بیمه اختیاری، مشاغل آزاد و زنان خانه‌دار
    const voluntaryInsurance = baseSalary * 0.27; // بیمه اختیاری ۲۷٪ کامل
    // مشاغل آزاد و زنان خانه‌دار (نرخ‌های ۱۲٪، ۱۴٪ و ۱۸٪)
    const housewife12 = baseSalary * 0.12; // بازنشستگی و فوت پس از بازنشستگی
    const housewife14 = baseSalary * 0.14; // بازنشستگی و فوت قبل و بعد از بازنشستگی
    const housewife18 = baseSalary * 0.18; // بازنشستگی، فوت و ازکارافتادگی کلی

    // ۹. مقرری بیمه بیکاری (جدول ماده ۷ قانون بیمه بیکاری)
    const isMarried = dependents > 0;
    let maxUnemploymentMonths = 6;
    if (unemploymentMonths >= 6 && unemploymentMonths <= 24) maxUnemploymentMonths = isMarried ? 12 : 6;
    else if (unemploymentMonths >= 25 && unemploymentMonths <= 120) maxUnemploymentMonths = isMarried ? 18 : 12;
    else if (unemploymentMonths >= 121 && unemploymentMonths <= 180) maxUnemploymentMonths = isMarried ? 26 : 14;
    else if (unemploymentMonths >= 181 && unemploymentMonths <= 240) maxUnemploymentMonths = isMarried ? 36 : 18;
    else if (unemploymentMonths > 240) maxUnemploymentMonths = isMarried ? 50 : 36;

    // مبلغ مقرری: ۵۵٪ پایه + ۱۰٪ به ازای هر تحت تکفل تا سقف ۸۰٪ و حداقل دستمزد
    const benefitRate = Math.min(0.55 + Math.min(dependents, 4) * 0.10, 0.80);
    const monthlyUnemploymentBenefit = baseSalary * benefitRate;

    // ۱۰. برآورد مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)
    // فرمول: (میانگین دستمزد دو سال آخر ضربدر سنوات) تقسیم بر ۳۰
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
  }, [baseSalary, years, months, days, hours, shiftType, unworkedLeaveDays, dependents, unemploymentMonths, insuranceYears]);

  const formatRial = (val: number) => {
    return Math.round(val).toLocaleString('fa-IR') + ' ریال';
  };

  const copyTemplateContent = (tmpl: TemplateItem) => {
    navigator.clipboard.writeText(tmpl.content);
    setCopiedTemplateId(tmpl.id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  // اسپلش اسکرین و لودینگ حرفه‌ای
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-white z-50 overflow-hidden" dir="rtl">
        {/* افکت نوری پس‌زمینه */}
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center max-w-sm w-full z-10">
          {/* نشانگر لوگو و انیمیشن مقیاس */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/30 flex items-center justify-center animate-bounce">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Scale className="w-12 h-12 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center shadow">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200 mb-1">
            سامانه تخصصی دادکار
          </h1>
          <p className="text-xs text-slate-400 font-medium mb-8">
            دستیار هوشمند قوانین کار، تأمین اجتماعی و محاسبات حقوقی
          </p>

          {/* نوار پیشرفت */}
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 p-0.5 border border-slate-700 shadow-inner mb-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out shadow-lg shadow-blue-500/50"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              بارگذاری موتور محاسبات...
            </span>
            <span className="font-bold text-blue-300">{loadingProgress}٪</span>
          </div>
        </div>

        <div className="absolute bottom-6 text-[11px] text-slate-500">
          مرجع استاندارد روابط کار و سازمان تأمین اجتماعی ایران
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24" dir="rtl">
      
      {/* هدر اپلیکیشن */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-lg leading-tight">دادکار</h1>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">نسخه جامع</span>
              </div>
              <p className="text-[11px] text-slate-500">محاسبات کارگری، شعب تأمین اجتماعی و پایگاه قوانین</p>
            </div>
          </div>
        </div>
      </header>

      {/* محتوای اصلی بر اساس تب */}
      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* ===================== تب ۱: محاسبات تخصصی ===================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            
            {/* کارت کنترل دستمزد پایه و محدودیت‌ها */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800 text-base">دستمزد مبنای محاسبه</h2>
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-500 ml-1">مبلغ انتخابی:</span>
                  <span className="text-base font-black text-blue-700">{formatRial(baseSalary)}</span>
                </div>
              </div>

              {/* ورودی دستی با سقف ۱۰ میلیارد ریال */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                  <label htmlFor="salaryInput">وارد کردن دستی مبلغ (ریال) - حداکثر ۱۰,۰۰۰,۰۰۰,۰۰۰ ریال:</label>
                  <span className="text-[11px] text-slate-400">سقف: ۱۰ میلیارد ریال</span>
                </div>
                <div className="relative">
                  <input
                    id="salaryInput"
                    type="text"
                    dir="ltr"
                    value={salaryInputText}
                    onChange={(e) => handleSalaryInputChange(e.target.value)}
                    placeholder="مثال: ۱۰۰,۰۰۰,۰۰۰"
                    className="w-full h-11 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-left font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-base"
                  />
                  <span className="absolute right-3 top-3 text-xs text-slate-400 font-sans pointer-events-none">ریال</span>
                </div>
              </div>

              {/* اهرم اسلایدر سریع */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>اهرم تنظیم سریع:</span>
                  <span className="font-mono">{formatRial(baseSalary)}</span>
                </div>
                <input
                  type="range"
                  min={50000000}
                  max={1000000000}
                  step={5000000}
                  value={baseSalary > 1000000000 ? 1000000000 : baseSalary}
                  onChange={(e) => handleSalarySliderChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* مبالغ معیار و قانونی */}
              <div className="pt-2">
                <div className="text-[11px] text-slate-500 mb-2 font-medium">مقادیر پایه مصوب بر اساس ضوابط قانونی:</div>
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
                    <div className="text-[10px] text-slate-500">مزد نمونه ۲۰ تومانی</div>
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
                  <span className="text-xs text-indigo-900">مزد هر ساعت کار:</span>
                  <span className="font-bold text-xs text-indigo-800">{formatRial(calculations.hourlyWage)}</span>
                </div>
              </div>
            </div>

            {/* نوار انتخاب نوع محاسبه */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
              {[
                { id: 'salary', label: 'بیمه اجباری کارگری' },
                { id: 'voluntary', label: 'بیمه اختیاری، آزاد و زنان خانه‌دار' },
                { id: 'severance', label: 'حق سنوات خدمت' },
                { id: 'overtime', label: 'اضافه‌کاری' },
                { id: 'shift', label: 'فوق‌العاده نوبت‌کاری' },
                { id: 'night', label: 'شب‌کاری' },
                { id: 'leave', label: 'مانده مرخصی' },
                { id: 'sanavat', label: 'پایه سنوات' },
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

            {/* کارت‌های نتایج محاسبات بر اساس انتخاب */}

            {/* ۱. بیمه اجباری ۳۰٪ */}
            {activeCalc === 'salary' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">تفکیک حق‌بیمه اجباری قانون کار (مجموع ۳۰٪)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs text-emerald-700 font-bold mb-1">سهم کارگر (۷ درصد)</div>
                    <div className="text-lg font-black text-emerald-900">{formatRial(calculations.insuranceWorker)}</div>
                    <div className="text-[11px] text-emerald-600 mt-2">کسر قانونی از فیش حقوقی کارگر</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-xs text-blue-700 font-bold mb-1">سهم کارفرما (۲۰ درصد) + ۳٪ بیکاری</div>
                    <div className="text-lg font-black text-blue-900">{formatRial(calculations.insuranceEmployer + (baseSalary * 0.03))}</div>
                    <div className="text-[11px] text-blue-600 mt-2">تعهد کارفرما در لیست ماهانه</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-600 font-bold mb-1">مجموع واریزی به سازمان تأمین اجتماعی (۳۰٪)</div>
                    <div className="text-lg font-black text-slate-900">{formatRial(calculations.insuranceTotal)}</div>
                    <div className="text-[11px] text-slate-500 mt-2">شامل درمان، بازنشستگی و بیکاری</div>
                  </div>
                </div>
              </div>
            )}

            {/* ۲. بیمه اختیاری، مشاغل آزاد و بیمه زنان خانه‌دار */}
            {activeCalc === 'voluntary' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">بیمه اختیاری، مشاغل آزاد و بیمه زنان خانه‌دار</h3>
                </div>

                {/* بخش ویژه زنان خانه‌دار و مشاغل آزاد */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <h4 className="font-bold text-sm text-slate-800">نرخ‌های بیمه زنان خانه‌دار و حرف و مشاغل آزاد (قانون تأمین اجتماعی)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-pink-900">طرح ۱۲ درصد</span>
                        <span className="text-[10px] bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full font-bold">پایه</span>
                      </div>
                      <div className="text-lg font-black text-pink-950 my-1">{formatRial(calculations.housewife12)}</div>
                      <div className="text-[11px] text-pink-700 leading-relaxed">
                        شامل: بازنشستگی و فوت پس از سن بازنشستگی (مناسب افراد فاقد فرد تحت تکفل).
                      </div>
                    </div>

                    <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-purple-900">طرح ۱۴ درصد</span>
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">متوسط</span>
                      </div>
                      <div className="text-lg font-black text-purple-950 my-1">{formatRial(calculations.housewife14)}</div>
                      <div className="text-[11px] text-purple-700 leading-relaxed">
                        شامل: بازنشستگی و فوت قبل و بعد از بازنشستگی (پرداخت مستمری به بازماندگان).
                      </div>
                    </div>

                    <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-indigo-900">طرح ۱۸ درصد</span>
                        <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">کامل‌ترین</span>
                      </div>
                      <div className="text-lg font-black text-indigo-950 my-1">{formatRial(calculations.housewife18)}</div>
                      <div className="text-[11px] text-indigo-700 leading-relaxed">
                        شامل: بازنشستگی، فوت و ازکارافتادگی کلی.
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    * سرانه درمان به ازای هر نفر (برای دفترچه درمانی) ماهانه به صورت مجزا اضافه می‌گردد.
                  </div>
                </div>

                {/* بخش بیمه اختیاری */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h4 className="font-bold text-sm text-slate-800">بیمه اختیاری ۲۷ درصد (دارای درمان رایگان بدون سرانه مجزا)</h4>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-blue-800 font-bold">حق‌بیمه ماهانه سهم متقاضی (۲۷٪ کامل)</div>
                      <div className="text-[11px] text-blue-600 mt-1">پوشش درمان کامل بیمارستان‌های ملکی، بازنشستگی، فوت و ازکارافتادگی</div>
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
                  <h3 className="font-bold text-slate-800">محاسبه حق سنوات خدمت (ماده ۲۴ قانون کار)</h3>
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
                  <h3 className="font-bold text-slate-800">محاسبه اضافه کاری (ماده ۵۹ قانون کار - ۴۰٪ مازاد)</h3>
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

            {/* ۵. نوبت‌کاری */}
            {activeCalc === 'shift' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-800">محاسبه فوق‌العاده نوبت‌کاری (مواد ۵۵ و ۵۶ قانون کار)</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 font-bold block">نوع شیفت کاری چرخشی در طول ماه:</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
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
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  * ساعات کار نوبت‌کاری نباید در ۴ هفته متوالی از ۱۷۶ ساعت تجاوز نماید.
                </div>
              </div>
            )}

            {/* ۶. شب‌کاری عادی */}
            {activeCalc === 'night' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-5 h-5 text-indigo-900" />
                  <h3 className="font-bold text-slate-800">محاسبه شب‌کاری غیرنوبتی (ماده ۵۸ قانون کار)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">تعداد ساعات کار در بازه شب (۲۲ الی ۶ بامداد):</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={hours} 
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                  />
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-bold">فوق‌العاده ۳۵٪ شب‌کاری:</span>
                  <span className="text-lg font-black text-indigo-950">{formatRial(calculations.nightPay)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * کارگران نوبت‌کار مشمول دریافت فوق‌العاده شب‌کاری ماده ۵۸ نبوده و تنها فوق‌العاده نوبت‌کاری دریافت می‌نمایند.
                </div>
              </div>
            )}

            {/* ۷. مانده مرخصی استحقاقی */}
            {activeCalc === 'leave' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-800">بازخرید مانده مرخصی استحقاقی (ماده ۶۶ قانون کار)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">تعداد روزهای مانده مرخصی استفاده نشده:</label>
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
                  <span className="text-xs text-teal-950 font-bold">مبلغ بازخرید مرخصی استحقاقی:</span>
                  <span className="text-lg font-black text-teal-950">{formatRial(calculations.leavePay)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * کارگر نمی‌تواند بیش از ۹ روز از مرخصی سالانه خود را ذخیره نماید؛ مگر در خاتمه قرارداد کار که تمام مانده قابل تسویه است.
                </div>
              </div>
            )}

            {/* ۸. پایه سنوات */}
            {activeCalc === 'sanavat' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-slate-800">پایه سنوات تجمیعی ماهیانه (بخشنامه شورای عالی کار)</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-xs text-blue-950 font-bold">پایه سنوات ماهانه (به ازای ۳۰ روز اشتغال پس از سال اول):</span>
                  <span className="text-lg font-black text-blue-950">{formatRial(calculations.sanavatMonthly)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * پایه سنوات به کارگرانی تعلق می‌گیرد که دارای یک سال سابقه کار مداوم در همان کارگاه بوده یا یک سال از دریافت آخرین پایه سنوات آن‌ها گذشته باشد.
                </div>
              </div>
            )}

            {/* ۹. برآورد مستمری بازنشستگی */}
            {activeCalc === 'pension' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Percent className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">برآورد مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)</h3>
                </div>

                {/* انتخاب نوع بیمه */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">نوع قرارداد بیمه پردازی فرد:</label>
                  <select
                    value={pensionInsuranceType}
                    onChange={(e) => setPensionInsuranceType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 text-xs"
                  >
                    <option value="compulsory">بیمه اجباری کارگری (مشمول حداقل دستمزد قانون کار)</option>
                    <option value="voluntary">بیمه اختیاری ۲۷ درصد</option>
                    <option value="freelance18">مشاغل آزاد / زنان خانه‌دار ۱۸٪ (شامل بازنشستگی، فوت و ازکارافتادگی)</option>
                    <option value="freelance14">مشاغل آزاد / زنان خانه‌دار ۱۴٪ (فاقد ازکارافتادگی)</option>
                    <option value="freelance12">مشاغل آزاد / زنان خانه‌دار ۱۲٪ (فقط بازنشستگی)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>تعداد سال‌های سابقه پرداخت حق‌بیمه:</span>
                    <span className="font-bold text-indigo-700">{insuranceYears} سال</span>
                  </div>
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
                  <span className="text-xs text-indigo-950 font-bold">برآورد مستمری ماهانه بر مبنای میانگین:</span>
                  <span className="text-lg font-black text-indigo-950">{formatRial(calculations.pensionEstimate)}</span>
                </div>

                {pensionInsuranceType === 'freelance12' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>توجه: در نرخ ۱۲٪ زنان خانه‌دار و مشاغل آزاد، در صورت فوت قبل از سن بازنشستگی، مستمری به بازماندگان تعلق نمی‌گیرد.</div>
                  </div>
                )}
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
                    <label className="text-xs text-slate-500 block mb-1">ماه‌های سابقه بیمه قبلی:</label>
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
                    <div className="text-[11px] text-emerald-700">مقرری برآوردی ماه اول:</div>
                    <div className="text-base font-black text-emerald-900 mt-1">{formatRial(calculations.monthlyUnemploymentBenefit)}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== تب ۲: شعب تأمین اجتماعی ===================== */}
        {activeTab === 'tamin' && (
          <TaminBranchesView />
        )}

        {/* ===================== تب ۳: قالب‌ها و فرم‌های حقوقی ===================== */}
        {activeTab === 'templates' && (
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-800">مخزن ۲۰ قالب رسمی و قراردادهای کار</h2>
              </div>
              <p className="text-xs text-slate-500">
                فرم‌های کاربردی، متون دادخواست، تسویه‌حساب و مکاتبات اداری قابل کپی مستقیم
              </p>

              {/* جستجو و فیلتر تگ‌ها */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجو در عناوین و تگ‌های قراردادها و دادخواست‌ها..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* فیلتر دسته‌بندی */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none font-bold">
                {[
                  { id: 'all', label: 'همه دسته‌ها' },
                  { id: 'contracts', label: 'قراردادها' },
                  { id: 'petitions', label: 'دادخواست‌ها' },
                  { id: 'letters', label: 'نامه‌های اداری' },
                  { id: 'settlements', label: 'تسویه‌حساب' },
                  { id: 'retirement', label: 'بازنشستگی' },
                  { id: 'unemployment', label: 'بیمه بیکاری' },
                  { id: 'appeals', label: 'ماده ۱۴۸ و اعتراض' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedTemplateCategory(c.id)}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition ${
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

            {/* لیست قالب‌ها */}
            <div className="grid grid-cols-1 gap-3">
              {TEMPLATES_DATABASE
                .filter(t => selectedTemplateCategory === 'all' || t.category === selectedTemplateCategory)
                .filter(t => 
                  t.title.includes(templateSearchQuery) || 
                  t.description.includes(templateSearchQuery) ||
                  t.tags.some(tag => tag.includes(templateSearchQuery))
                )
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

                    {/* تگ‌های قابل کلیک */}
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

        {/* ===================== تب ۴: پایگاه قوانین ===================== */}
        {activeTab === 'laws' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-800">قوانین و مقررات کار و تأمین اجتماعی</h2>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجو در متن قوانین (مثال: ماده ۱۴۸، مرخصی، حق سنوات)..."
                  value={lawSearchQuery}
                  onChange={(e) => setLawSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {lawsDatabase
                .filter(item => 
                  item.title.includes(lawSearchQuery) || 
                  item.content.includes(lawSearchQuery) ||
                  item.number.includes(lawSearchQuery)
                )
                .slice(0, 15)
                .map((law, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-700">{law.number}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{law.category}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">{law.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{law.content}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================== تب ۵: پرسش و پاسخ ===================== */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {[
              { q: 'آیا بیمه زنان خانه‌دار شامل بازنشستگی و فوت می‌شود؟', a: 'بله؛ متناسب با نرخ انتخابی (۱۲٪، ۱۴٪ یا ۱۸٪)، پوشش بازنشستگی، فوت و ازکارافتادگی تعلق خواهد گرفت.' },
              { q: 'حداکثر سقف مجاز ذخیره مرخصی طبق ماده ۶۶ قانون کار چند روز است؟', a: 'کارگر سالانه نمی‌تواند بیش از ۹ روز از مرخصی استحقاقی خود را ذخیره نماید و مابقی در صورت عدم استفاده بازخرید یا سوخت می‌شود.' },
              { q: 'مبنای محاسبه اضافه کاری چیست؟', a: 'طبق ماده ۵۹ قانون کار، به ازای هر ساعت کار مازاد، ۴۰ درصد اضافه بر مزد هر ساعت کار عادی پرداخت می‌شود (۱.۴ برابر مزد ساعتی).' },
              { q: 'سقف حقوق مشمول بیمه تأمین اجتماعی چند برابر حداقل دستمزد است؟', a: 'حداکثر دستمزد مشمول کسر حق‌بیمه در هر سال معادل ۷ برابر حداقل دستمزد روزانه مصوب شورای عالی کار می‌باشد.' }
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

      {/* نوار پایینی ثابت (Sticky Bottom Navigation) با ۶ دکمه استاندارد */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 z-40">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center gap-1 py-1 transition ${activeTab === 'calculator' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px]">محاسبات</span>
          </button>

          <button
            onClick={() => setActiveTab('tamin')}
            className={`flex flex-col items-center gap-1 py-1 transition ${activeTab === 'tamin' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px]">شعب تأمین</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex flex-col items-center gap-1 py-1 transition ${activeTab === 'templates' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">قالب‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('laws')}
            className={`flex flex-col items-center gap-1 py-1 transition ${activeTab === 'laws' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex flex-col items-center gap-1 py-1 transition ${activeTab === 'faq' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px]">راهنما</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
