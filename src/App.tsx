import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ShieldCheck,
  UserMinus,
  Clock,
  Printer,
  ChevronLeft,
  FileText,
  AlertCircle,
  Home,
  BookOpen,
  Info,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  DollarSign,
  Download,
  Share2,
  Heart,
  Baby,
  Briefcase,
  AlertTriangle,
  Flame,
  FileSpreadsheet
} from 'lucide-react';

// تابع چاپ و دانلود قطعی PDF برای اندروید وب‌ویو و وب
const executePrintAndDownload = (slipHtmlId: string, docTitle: string) => {
  const el = document.getElementById(slipHtmlId);
  if (!el) return;

  const content = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <title>${docTitle}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        * { box-sizing: border-box; }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          direction: rtl;
          background: #ffffff;
          color: #0f172a;
          margin: 0;
          padding: 10px;
        }
        .slip-container {
          border: 2px solid #0f172a;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          background: #ffffff;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .gold-seal {
          border: 2px dashed #b45309;
          color: #b45309;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          transform: rotate(-8deg);
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .data-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12.5px;
        }
        .data-table tr.highlight-row {
          background-color: #f8fafc;
          font-weight: bold;
        }
        .data-table tr.highlight-row td {
          border-top: 1.5px solid #0f172a;
          border-bottom: 1.5px solid #0f172a;
          font-size: 14px;
        }
        .disclaimer-box {
          margin-top: 20px;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 12px;
          font-size: 10.5px;
          color: #475569;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="slip-container">
        ${el.innerHTML}
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  
  // ایجاد پنجره جدید برای پرینت پایدار
  const printWin = window.open(blobUrl, '_blank');
  if (!printWin) {
    // در صورت بسته بودن پاپ‌آپ در اندروید، فایل HTML دانلود می‌شود
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${docTitle}.html`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};

// بانک اطلاعاتی عظیم، تفصیلی و طبقه‌بندی شده قوانین
const COMPREHENSIVE_LAWS = [
  // قوانین خاتمه خدمت، اخراج و بازخرید
  {
    id: 'law-27',
    category: 'termination',
    title: 'ماده ۲۷ قانون کار',
    subtitle: 'قصور در انجام وظایف و فسخ قرارداد (اخراج موجه)',
    description: 'هرگاه کارگر در انجام وظایف محوله قصور ورزد و یا آیین‌نامه‌های انضباطی کارگاه را پس از تذکرات کتبی نقض نماید، کارفرما حق دارد با جلب موافقت تشکل کارگری کارگاه (شورای اسلامی کار یا انجمن صنفی) و پرداخت مطالبات معوقه و حق سنوات به ازای هر سال یک ماه، قرارداد کار را فسخ نماید. در صورت عدم توافق، موضوع به هیأت تشخیص ارجاع خواهد شد.',
    tags: ['اخراج', 'قصور کارگر', 'فسخ قرارداد', 'آیین‌نامه انضباطی']
  },
  {
    id: 'law-20',
    category: 'termination',
    title: 'ماده ۲۰ قانون کار',
    subtitle: 'تعلیق قرارداد و بازگشت به کار',
    description: 'در مواردی نظیر توقیف کارگر که منتهی به حکم محکومیت نگردد یا خدمت نظام وظیفه، قرارداد کار به حالت تعلیق درمی‌آید. کارگر پس از رفع مانع تعلیق مکلف است ظرف ۳۰ روز خود را به کارفرما معرفی کند؛ امتناع کارفرما از پذیرش وی در حکم اخراج غیرقانونی است و کارگر مستحق دریافت حق‌السعی ایام تعلیق خواهد بود.',
    tags: ['تعلیق کار', 'سربازی', 'بازگشت به کار', 'اخراج غیرقانونی']
  },
  {
    id: 'law-24',
    category: 'termination',
    title: 'ماده ۲۴ قانون کار',
    subtitle: 'حق سنوات پایان‌کار الزامی (پاداش خدمت)',
    description: 'در صورت خاتمه قرارداد کار، کارفرما مکلف است به کارگری که مطابق قرارداد، یک سال یا بیشتر اشتغال داشته است، برای هر سال سابقه بر اساس آخرین مزد دریافتی، معادل یک ماه مزد به عنوان مزایای پایان کار (حق سنوات) پرداخت نماید. سنوات برای کمتر از یک سال نیز به تناسب ماه و روز کارکرد تعلق می‌گیرد.',
    tags: ['سنوات', 'پاداش خدمت', 'خاتمه کار']
  },
  {
    id: 'law-31',
    category: 'termination',
    title: 'ماده ۳۱ قانون کار',
    subtitle: 'سنوات خاتمه کار ناشی از بازنشستگی و ازکارافتادگی کلی',
    description: 'چنانچه خاتمه قرارداد کار به علت ازکارافتادگی کلی یا بازنشستگی کارگر باشد، کارفرما باید بر اساس آخرین مزد کارگر به ازای هر سال سابقه خدمت، حق سنواتی معادل یک ماه مزد به وی پرداخت کند. این مبلغ علاوه بر مستمری ازکارافتادگی یا بازنشستگی است که توسط سازمان تأمین اجتماعی پرداخت می‌شود.',
    tags: ['بازنشستگی', 'ازکارافتادگی', 'سنوات بازنشستگی']
  },
  {
    id: 'law-32',
    category: 'termination',
    title: 'ماده ۳۲ قانون کار',
    subtitle: 'سنوات ناشی از کاهش توانایی‌های جسمی و فکری',
    description: 'اگر خاتمه قرارداد کار ناشی از کاهش توانایی‌های فکری و جسمی کارگر ناشی از کار باشد (بنا به تشخیص کمیسیون پزشکی موضوع ماده ۹۱ تأمین اجتماعی)، کارفرما مکلف است به نسبت هر سال سابقه خدمت، معادل ۲ ماه آخرین مزد را به عنوان پاداش پایان کار به وی پرداخت نماید.',
    tags: ['کاهش توانایی', 'کمیسیون پزشکی', 'سنوات دو برابر']
  },

  // قوانین ازدواج و خانواده
  {
    id: 'law-85-tamin',
    category: 'marriage',
    title: 'ماده ۸۵ قانون تأمین اجتماعی',
    subtitle: 'کمک‌هزینه ازدواج (هدیه پیوند زناشویی)',
    description: 'به بیمه‌شده زن یا مرد که برای اولین بار ازدواج می‌کند مبلغی معادل یک ماه متوسط مزد یا حقوق به عنوان کمک‌هزینه ازدواج پرداخت می‌گردد؛ مشروط بر آنکه در تاریخ عقد رابطه استخدامی برقرار بوده و در ۵ سال پیش از ازدواج، حداقل حق بیمه ۷۲۰ روز کار را پرداخته باشد. چنانچه طرفین هر دو بیمه‌شده واجد شرایط باشند، به هر دو نفر این کمک تعلق می‌گیرد.',
    tags: ['کمک‌هزینه ازدواج', 'هدیه ازدواج', '۷۲۰ روز بیمه', 'عقد دائم']
  },

  // قوانین بارداری، زایمان و شیردهی
  {
    id: 'law-67-tamin',
    category: 'maternity',
    title: 'ماده ۶۷ قانون تأمین اجتماعی',
    subtitle: 'غرامت دستمزد ایام بارداری و مرخصی زایمان',
    description: 'بیمه‌شده زن در صورت داشتن سابقه پرداخت حق بیمه ۶۰ روز کار در طول یک سال قبل از زایمان، از کمک بارداری و غرامت دستمزد معادل دو سوم آخرین مزد بهره‌مند می‌شود. مدت مرخصی زایمان برابر مصوبات جاری ۹ ماه است و این ایام به طور کامل سابقه پرداخت حق بیمه محسوب می‌شود.',
    tags: ['مرخصی زایمان', 'کمک بارداری', 'غرامت دستمزد', '۹ ماه مرخصی']
  },
  {
    id: 'law-76-kar',
    category: 'maternity',
    title: 'ماده ۷۶ قانون کار',
    subtitle: 'امنیت شغلی مادر و ممنوعیت کارهای سخت در بارداری',
    description: 'پس از پایان مرخصی زایمان، کارگر زن به کار سابق خود بازمی‌گردد و این مدت با تأیید سازمان تأمین اجتماعی جزء سوابق خدمت وی محسوب می‌شود. کارفرما مجاز نیست کارگر زن را در ایام بارداری و زایمان اخراج کند یا کارهای سنگین و زیان‌آور به او محول نماید.',
    tags: ['امنیت شغلی مادر', 'منع اخراج زن باردار', 'بازگشت به کار']
  },
  {
    id: 'law-78-kar',
    category: 'maternity',
    title: 'ماده ۷۸ قانون کار',
    subtitle: 'فرصت شیردهی و تأسیس مهد کودک',
    description: 'در کارگاه‌هایی که دارای کارگر زن هستند، کارفرما مکلف است به مادران شیرده تا رسیدن کودک به دو سالگی پس از هر سه ساعت، نیم ساعت فرصت شیردهی بدهد (این زمان جزء ساعات کار حساب می‌شود). همچنین متناسب با تعداد کودکان، ایجاد مراکز نگهداری (شیرخوارگاه و مهد کودک) بر عهده کارفرماست.',
    tags: ['حق شیردهی', 'مهدکودک کارگاه', 'ساعت کار شیردهی']
  },

  // قوانین مزد، ساعات کار، اضافه کاری و نوبت کاری
  {
    id: 'law-36-kar',
    category: 'wages',
    title: 'ماده ۳۶ قانون کار',
    subtitle: 'تعریف مزد ثابت و مبنای محاسبه سایر مزایا',
    description: 'مزد ثابت عبارت است از مجموع مزد شغل و مزایای ثابت پرداختی به تبع شغل. در کارگاه‌هایی که طرح طبقه‌بندی مشاغل اجرا شده است، مزد رتبه و پایه سنوات جزء مزد مبنا به شمار می‌آیند و کلیه فوق‌العاده‌های اضافه کاری، شب‌کاری و سنوات بر مبنای این رقم محاسبه می‌شوند.',
    tags: ['مزد مبنا', 'مزد شغل', 'پایه سنوات', 'طبقه‌بندی مشاغل']
  },
  {
    id: 'law-51-kar',
    category: 'wages',
    title: 'ماده ۵۱ قانون کار',
    subtitle: 'ساعت کار استاندارد هفتگی',
    description: 'ساعت کار در قانون کار مدتی است که کارگر نیرو یا وقت خود را در اختیار کارفرما قرار می‌دهد. ساعات کار روزانه نباید از ۸ ساعت و در مجموع هفته نباید از ۴۴ ساعت تجاوز کند (در مشاغل سخت و زیان‌آور حداکثر ۳۶ ساعت در هفته و روزانه ۶ ساعت است).',
    tags: ['ساعت کار', '۴۴ ساعت هفتگی', 'مشاغل سخت ۳۶ ساعت']
  },
  {
    id: 'law-59-kar',
    category: 'wages',
    title: 'ماده ۵۹ قانون کار',
    subtitle: 'شرایط و نرخ اضافه کاری',
    description: 'ارجاع کار اضافی به کارگر منوط به موافقت وی و پرداخت ۴۰٪ اضافه بر مزد هر ساعت کار عادی است. ارجاع اضافه کاری به کارگر بیش از ۴ ساعت در روز مجاز نیست مگر در موارد استثنایی و با توافق طرفین.',
    tags: ['اضافه کاری', 'فوق‌العاده ۴۰ درصد', 'سقف ۴ ساعت']
  },
  {
    id: 'law-58-kar',
    category: 'wages',
    title: 'ماده ۵۸ قانون کار',
    subtitle: 'فوق‌العاده شب‌کاری',
    description: 'برای هر ساعت کار در شب (از ساعت ۲۲ تا ۶ صبح) به کارگران غیرنوبتی ۳۵٪ اضافه بر مزد ساعت کار عادی تعلق می‌گیرد.',
    tags: ['شب‌کاری', '۳۵ درصد فوق‌العاده', 'ساعت ۲۲ تا ۶']
  },
  {
    id: 'law-62-kar',
    category: 'wages',
    title: 'ماده ۶۲ قانون کار',
    subtitle: 'تعطیل جمعه و تعطیل‌کاری',
    description: 'روز جمعه، روز تعطیل هفتگی کارگران با استفاده از مزد است. کارگرانی که به علت ضرورت کاری در روز جمعه کار می‌کنند، علاوه بر تعطیلی یک روز دیگر در هفته، مستحق دریافت ۴۰٪ فوق‌العاده جمعه‌کاری خواهند بود.',
    tags: ['جمعه کاری', 'تعطیل هفتگی', 'فوق‌العاده جمعه']
  },

  // قوانین مرخصی‌ها
  {
    id: 'law-64-kar',
    category: 'leave',
    title: 'ماده ۶۴ قانون کار',
    subtitle: 'مرخصی استحقاقی سالانه و ذخیره مرخصی',
    description: 'مرخصی استحقاقی سالانه کارگران با استفاده از مزد و احتساب چهار روز جمعه، جمعاً یک ماه است (مشاغل سخت و زیان‌آور ۵ هفته در سال). طبق ماده ۶۶ قانون کار، کارگر نمی‌تواند بیش از ۹ روز از مرخصی سالانه خود را ذخیره کند.',
    tags: ['مرخصی سالانه', '۲۶ روز کاری', 'ذخیره مرخصی ۹ روز']
  },
  {
    id: 'law-73-kar',
    category: 'leave',
    title: 'ماده ۷۳ قانون کار',
    subtitle: 'مرخصی اضطراری ازدواج و فوت بستگان',
    description: 'کلیه کارگران در موارد ازدواج دائم یا فوت همسر، پدر، مادر و فرزندان، حق برخورداری از ۳ روز مرخصی با استفاده از مزد را دارند. این مرخصی مجزا از مرخصی استحقاقی سالیانه است و هم‌زمان با واقعه قابل استفاده می‌باشد.',
    tags: ['مرخصی ازدواج', 'مرخصی فوت', '۳ روز مرخصی با حقوق']
  },
  {
    id: 'law-59-tamin',
    category: 'leave',
    title: 'ماده ۵۹ قانون تأمین اجتماعی',
    subtitle: 'مرخصی استعلاجی و غرامت دستمزد ایام بیماری',
    description: 'بیمه‌شدگانی که تحت معالجه یا استراحت پزشکی قرار می‌گیرند، در صورت تایید پزشک معتمد یا شورای پزشکی تأمین اجتماعی، از غرامت دستمزد ایام بیماری (سه چهارم مزد برای متکفلین و دو سوم برای غیرمتکفلین) بهره‌مند شده و ایام بیماری جزو سابقه کاری آنان منظور خواهد شد.',
    tags: ['استعلاجی', 'غرامت بیماری', 'شورای پزشکی']
  },

  // قوانین حوادث ناشی از کار، بازنشستگی و بیمه
  {
    id: 'law-60-tamin',
    category: 'safety',
    title: 'ماده ۶۰ قانون تأمین اجتماعی',
    subtitle: 'تعریف حادثه ناشی از کار',
    description: 'حوادث ناشی از کار حوادثی است که در حین انجام وظیفه و به سبب آن برای بیمه‌شده اتفاق می‌افتد. رفت و برگشت مستقیم بین منزل و محل کارگاه نیز مشمول این ماده بوده و سازمان تأمین اجتماعی بدون الزام به شرط حداقل سابقه، مکلف به ارائه خدمات کامل درمانی و غرامت و برقراری ازکارافتادگی است.',
    tags: ['حادثه ناشی از کار', 'مسیر رفت و برگشت', 'درمان رایگان']
  },
  {
    id: 'law-66-tamin',
    category: 'safety',
    title: 'ماده ۶۶ قانون تأمین اجتماعی',
    subtitle: 'مسئولیت کارفرما در حوادث ناشی از عدم رعایت حفاظت فنی',
    description: 'اگر ثابت شود وقوع حادثه مستقیماً ناشی از عدم رعایت مقررات حفاظت فنی و بهداشت کار توسط کارفرما بوده، سازمان تأمین اجتماعی هزینه‌های مربوط به معالجه و مستمری‌ها را پرداخته و طبق این ماده تا سقف معین از کارفرما مطالبه و وصول خواهد نمود.',
    tags: ['حفاظت فنی', 'قصور کارفرما', 'خسارت ماده ۶۶']
  },
  {
    id: 'law-76-hard',
    category: 'tamin',
    title: 'تبصره ۲ ماده ۷۶ تأمین اجتماعی',
    subtitle: 'بازنشستگی در مشاغل سخت و زیان‌آور',
    description: 'افرادی که حداقل ۲۰ سال متوالی یا ۲۵ سال متناوب در کارهای سخت و زیان‌آور اشتغال داشته و حق بیمه پرداخت کرده باشند، بدون شرط سنی می‌توانند تقاضای بازنشستگی نمایند. هر سال سابقه در این مشاغل معادل ۱.۵ سال سابقه بیمه محاسبه می‌شود و ۴٪ حق بیمه اضافی بر عهده کارفرماست.',
    tags: ['مشاغل سخت و زیان‌آور', '۲۰ سال متوالی', 'ضریب ۱.۵ سابقه']
  },
  {
    id: 'law-7-unemp',
    category: 'unemployment',
    title: 'ماده ۷ قانون بیمه بیکاری',
    subtitle: 'میزان، شرایط و جدول مدت زمان مقرری بیکاری',
    description: 'میزان مقرری بیمه بیکاری معادل ۵۵٪ متوسط دستمزد ۹۰ روز آخر است و به ازای هر تحت تکفل (تا ۴ نفر) ۱۰٪ حداقل دستمزد افزوده می‌شود. مدت مقرری با توجه به سابقه از ۶ تا ۵۰ ماه متغیر است و کل ایام دریافت مقرری سابقه بازنشستگی حساب می‌شود.',
    tags: ['بیمه بیکاری', 'ماده ۷', 'مدت مقرری', '۵۵ درصد']
  },
  {
    id: 'law-28-tamin',
    category: 'tamin',
    title: 'ماده ۲۸ قانون تأمین اجتماعی',
    subtitle: 'نسبت‌های حق بیمه و مسئولیت پرداخت',
    description: 'حق بیمه معادل ۳۰٪ دستمزد است: ۷٪ سهم بیمه‌شده، ۲۰٪ سهم کارفرما، ۳٪ بیمه بیکاری و ۳٪ سهم دولت. کارفرما مسئول پرداخت سهم خود و کسر سهم کارگر از حقوق و ارسال لیست حداکثر تا آخرین روز ماه بعد است.',
    tags: ['ماده ۲۸', 'حق بیمه ۳۰ درصد', 'سهم کارفرما', 'ارسال لیست']
  },
  {
    id: 'law-77-tamin',
    category: 'tamin',
    title: 'ماده ۷۷ قانون تأمین اجتماعی',
    subtitle: 'فرمول مستمری بازنشستگی',
    description: 'مستمری بازنشستگی معادل یک سی‌ام متوسط مزد یا حقوق بیمه‌شده ضربدر سنوات پرداخت حق بیمه است. متوسط مزد عبارت است از مجموع مزد مشمول کسر حق بیمه در ۲ سال آخر تقسیم بر ۲۴.',
    tags: ['ماده ۷۷', 'فرمول بازنشستگی', 'میانگین ۲ سال آخر']
  },
  {
    id: 'law-1253-divan',
    category: 'termination',
    title: 'دادنامه ۱۲۵۳ هیأت عمومی دیوان عدالت اداری',
    subtitle: 'الزام به احتساب کلیه مزایای شغلی در پاداش سنوات',
    description: 'بر اساس این رأی وحدت رویه، کلیه مزایایی که به تبع شغل و شرایط محیط پرداخت می‌گردد از قبیل فوق‌العاده شغل، حق سرپرستی، حق جذب و سختی کار، جزء مزد مبنا محسوب شده و کسر کردن آنها از محاسبه سنوات مغایر با قانون کار است.',
    tags: ['دیوان عدالت اداری', 'دادنامه ۱۲۵۳', 'فوق‌العاده شغل در سنوات']
  }
];

export default function DadKarApp() {
  const [rootTab, setRootTab] = useState<'home' | 'calculators' | 'laws' | 'about'>('home');
  const [calcTab, setCalcTab] = useState<'severance' | 'unemployment' | 'tamin' | 'pension'>('severance');

  // جستجو و فیلتر قوانین
  const [searchQuery, setSearchQuery] = useState('');
  const [lawCategory, setLawCategory] = useState<'all' | 'termination' | 'marriage' | 'maternity' | 'wages' | 'leave' | 'safety' | 'tamin' | 'unemployment'>('all');

  const sanitizeNumber = (val: string): number => {
    const cleaned = val.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const formatNumber = (num: number): string => num.toLocaleString('fa-IR');

  // ۱. سنوات (فرمول قطعی و دست‌نخورده)
  const [sevMode, setSevMode] = useState<'simple' | 'itemized'>('simple');
  const [sevMonthlyWage, setSevMonthlyWage] = useState<number>(0);
  const [sevJobWage, setSevJobWage] = useState<number>(0);
  const [sevRankWage, setSevRankWage] = useState<number>(0);
  const [sevBaseSanavat, setSevBaseSanavat] = useState<number>(0);
  const [sevYears, setSevYears] = useState<number>(1);
  const [sevMonths, setSevMonths] = useState<number>(0);
  const [sevDays, setSevDays] = useState<number>(0);

  const sevCalculation = useMemo(() => {
    const effectiveMonthly = sevMode === 'simple'
      ? sevMonthlyWage
      : (sevJobWage + sevRankWage + sevBaseSanavat);

    const boundedMonths = Math.min(Math.max(sevMonths, 0), 11);
    const boundedDays = Math.min(Math.max(sevDays, 0), 30);
    const effectiveYears = sevYears + (boundedMonths / 12) + (boundedDays / 365);
    const totalAmount = Math.round(effectiveMonthly * effectiveYears);

    return {
      effectiveMonthly,
      effectiveYears: Number(effectiveYears.toFixed(3)),
      totalAmount
    };
  }, [sevMode, sevMonthlyWage, sevJobWage, sevRankWage, sevBaseSanavat, sevYears, sevMonths, sevDays]);

  // ۲. بیمه بیکاری (فرمول قطعی و دست‌نخورده)
  const [unempAvgWage, setUnempAvgWage] = useState<number>(0);
  const [unempMinWage, setUnempMinWage] = useState<number>(7166184);
  const [unempDependents, setUnempDependents] = useState<number>(0);
  const [unempInsuranceMonths, setUnempInsuranceMonths] = useState<number>(24);
  const [unempIsMarried, setUnempIsMarried] = useState<boolean>(true);

  const unempCalculation = useMemo(() => {
    if (unempAvgWage <= 0) return null;

    const baseAmount = Math.round(unempAvgWage * 0.55);
    const boundedDeps = Math.min(Math.max(unempDependents, 0), 4);
    const dependentsBonus = Math.round(unempMinWage * 0.10 * boundedDeps);
    let calculatedTotal = baseAmount + dependentsBonus;

    if (calculatedTotal < unempMinWage) calculatedTotal = unempMinWage;
    const maxAllowed = Math.round(unempAvgWage * 0.80);
    if (calculatedTotal > maxAllowed) calculatedTotal = maxAllowed;

    let durationMonths = 0;
    const m = unempInsuranceMonths;
    if (m >= 6 && m <= 24) durationMonths = unempIsMarried ? 12 : 6;
    else if (m >= 25 && m <= 120) durationMonths = unempIsMarried ? 18 : 12;
    else if (m >= 121 && m <= 180) durationMonths = unempIsMarried ? 26 : 18;
    else if (m >= 181 && m <= 240) durationMonths = unempIsMarried ? 36 : 24;
    else if (m >= 241) durationMonths = unempIsMarried ? 50 : 36;

    return {
      baseAmount,
      dependentsBonus,
      totalMonthly: calculatedTotal,
      durationMonths,
      totalPeriodAmount: calculatedTotal * durationMonths
    };
  }, [unempAvgWage, unempMinWage, unempDependents, unempInsuranceMonths, unempIsMarried]);

  // ۳. حق بیمه (فرمول قطعی و دست‌نخورده)
  const [taminWage, setTaminWage] = useState<number>(0);
  const [taminType, setTaminType] = useState<string>('compulsory');

  const taminCalculation = useMemo(() => {
    if (taminWage <= 0) return null;

    let workerRate = 7;
    let employerRate = 23;
    let govRate = 3;

    if (taminType === 'freelance_12') {
      workerRate = 12;
      employerRate = 0;
      govRate = 2;
    } else if (taminType === 'freelance_14') {
      workerRate = 14;
      employerRate = 0;
      govRate = 2;
    } else if (taminType === 'freelance_18') {
      workerRate = 18;
      employerRate = 0;
      govRate = 2;
    } else if (taminType === 'optional_27') {
      workerRate = 27;
      employerRate = 0;
      govRate = 0;
    }

    const workerShare = Math.round(taminWage * (workerRate / 100));
    const employerShare = Math.round(taminWage * (employerRate / 100));
    const govShare = Math.round(taminWage * (govRate / 100));

    return {
      workerRate,
      employerRate,
      govRate,
      workerShare,
      employerShare,
      govShare,
      totalPayment: workerShare + employerShare
    };
  }, [taminWage, taminType]);

  // ۴. مستمری بازنشستگی (فرمول قطعی و دست‌نخورده)
  const [penAvgWage, setPenAvgWage] = useState<number>(0);
  const [penYears, setPenYears] = useState<number>(30);

  const penCalculation = useMemo(() => {
    if (penAvgWage <= 0 || penYears <= 0) return null;
    const effectiveYears = Math.min(Math.max(penYears, 1), 35);
    const monthlyPension = Math.round((penAvgWage / 30) * effectiveYears);
    return {
      effectiveYears,
      monthlyPension
    };
  }, [penAvgWage, penYears]);

  // فیلتر جستجوی بانک جامع قوانین
  const filteredLaws = useMemo(() => {
    return COMPREHENSIVE_LAWS.filter((item) => {
      const matchCategory = lawCategory === 'all' || item.category === lawCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [lawCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-amber-500 selection:text-black" dir="rtl">
      
      {/* هدر ارتقایافته */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
            <Calculator className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">دادکار</h1>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">نسخه حرفه‌ای حقوقی</span>
            </div>
            <p className="text-[11px] text-slate-400">سامانه محاسبات تخصصی قانون کار و قوانین موضوعه</p>
          </div>
        </div>

        {rootTab !== 'home' && (
          <button
            onClick={() => setRootTab('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs text-slate-200 transition-colors border border-slate-700 shadow-sm"
          >
            <span>داشبورد</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ۱. صفحه داشبورد */}
        {rootTab === 'home' && (
          <div className="space-y-6">
            <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 shadow-2xl">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-700/50">
                  مرجع استنادی روابط کار
                </span>
                <h2 className="text-lg font-black text-white">سامانه هوشمند و فیش‌های رسمی دادکار</h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                  انجام دقیق‌ترین محاسبات حقوقی به همراه صدور فیش با سربرگ استاندارد، مهر تأیید دیجیتال و دسترسی به جامع‌ترین پایگاه مواد قانونی روابط کار و تأمین اجتماعی.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('severance'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Clock className="w-7 h-7 text-amber-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                  محاسبه سنوات
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۴ قانون کار
                </span>
              </button>

              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('pension'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <ShieldCheck className="w-7 h-7 text-emerald-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors">
                  مستمری بازنشستگی
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷۷ تأمین اجتماعی
                </span>
              </button>

              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('unemployment'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <UserMinus className="w-7 h-7 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-cyan-400 transition-colors">
                  مقرری بیمه بیکاری
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۷ بیمه بیکاری
                </span>
              </button>

              <button
                onClick={() => { setRootTab('calculators'); setCalcTab('tamin'); }}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-600/40 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <Calculator className="w-7 h-7 text-indigo-400 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-black text-slate-100 group-hover:text-indigo-400 transition-colors">
                  محاسبه حق بیمه
                </span>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  ماده ۲۸ تأمین اجتماعی
                </span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">بانک جامع مقررات و احکام قانونی</div>
                  <div className="text-[10px] text-slate-400">اخراج، بارداری، ازدواج، مرخصی و حوادث ناشی از کار</div>
                </div>
              </div>
              <button
                onClick={() => setRootTab('laws')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors"
              >
                مرور احکام
              </button>
            </div>
          </div>
        )}

        {/* ۲. بخش محاسبه‌گرها */}
        {rootTab === 'calculators' && (
          <div className="space-y-5">
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
              <button
                onClick={() => setCalcTab('severance')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'severance' ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                سنوات پایان‌کار
              </button>
              <button
                onClick={() => setCalcTab('unemployment')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'unemployment' ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                بیمه بیکاری
              </button>
              <button
                onClick={() => setCalcTab('tamin')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'tamin' ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                حق بیمه
              </button>
              <button
                onClick={() => setCalcTab('pension')}
                className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
                  calcTab === 'pension' ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                مستمری
              </button>
            </div>

            {/* سنوات */}
            {calcTab === 'severance' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> محاسبه سنوات پایان‌کار (ماده ۲۴ قانون کار)
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSevMode('simple')}
                      className={`py-2 text-xs rounded-xl border transition-all ${
                        sevMode === 'simple' ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      مزد مبنای یکپارچه
                    </button>
                    <button
                      type="button"
                      onClick={() => setSevMode('itemized')}
                      className={`py-2 text-xs rounded-xl border transition-all ${
                        sevMode === 'itemized' ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      اقلام تفکیکی (رأی ۱۲۵۳)
                    </button>
                  </div>

                  {sevMode === 'simple' ? (
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">آخرین مزد ثابت ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={sevMonthlyWage ? sevMonthlyWage.toLocaleString() : ''}
                        onChange={(e) => setSevMonthlyWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۵,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">مزد شغل ماهانه (تومان):</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sevJobWage ? sevJobWage.toLocaleString() : ''}
                          onChange={(e) => setSevJobWage(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">مزد رتبه یا پست (تومان):</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sevRankWage ? sevRankWage.toLocaleString() : ''}
                          onChange={(e) => setSevRankWage(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">پایه سنوات تجمیعی ماهانه (تومان):</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={sevBaseSanavat ? sevBaseSanavat.toLocaleString() : ''}
                          onChange={(e) => setSevBaseSanavat(sanitizeNumber(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">سال:</label>
                      <input
                        type="number"
                        min="0"
                        value={sevYears}
                        onChange={(e) => setSevYears(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">ماه (۰-۱۱):</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={sevMonths}
                        onChange={(e) => setSevMonths(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">روز (۰-۳۰):</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={sevDays}
                        onChange={(e) => setSevDays(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>سابقه مؤثر محاسباتی:</span>
                      <span className="font-mono text-amber-400 font-bold">{formatNumber(sevCalculation.effectiveYears)} سال</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>مزد ماهانه مؤثر:</span>
                      <span className="font-mono">{formatNumber(sevCalculation.effectiveMonthly)} تومان</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                      <span>کل سنوات پایان‌کار:</span>
                      <span className="text-base text-amber-400 font-black">{formatNumber(sevCalculation.totalAmount)} تومان</span>
                    </div>
                  </div>
                </div>

                {/* فیش رسمی لاکچری سنوات با مُهر و سربرگ طلایی */}
                <div id="slip-severance" className="bg-gradient-to-b from-white via-slate-50 to-white text-slate-950 rounded-3xl p-6 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                  {/* سربرگ لوکس سازمانی */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-amber-400 font-black text-xs">داد</div>
                        <h4 className="text-lg font-black text-slate-950 tracking-tight">صورت‌حساب رسمی پاداش پایان‌کار (سنوات)</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-1">مستند به ماده ۲۴ و ۳۱ قانون کار و دادنامه ۱۲۵۳ دیوان عدالت اداری</p>
                    </div>

                    {/* نشان و مُهر برجسته رسمی */}
                    <div className="text-center">
                      <div className="border-2 border-dashed border-amber-700 text-amber-800 rounded-2xl px-3 py-1 text-[10px] font-black tracking-wider uppercase bg-amber-50/50">
                        تأییدیه محاسبات
                        <div className="text-[8px] font-mono text-slate-600 font-normal mt-0.5">{new Date().toLocaleDateString('fa-IR')}</div>
                      </div>
                    </div>
                  </div>

                  {/* جدول اقلام فیش با حاشیه و فاصله‌بندی مهندسی‌شده */}
                  <table className="w-full text-xs border-collapse mb-5">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-slate-600 font-medium">شیوه احتساب مزد مبنا:</td>
                        <td className="py-2.5 text-left font-bold text-slate-900">{sevMode === 'simple' ? 'مزد مبنای یکپارچه' : 'اقلام تفکیکی شغل و رتبه'}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-slate-600 font-medium">مزد ماهانه پایه محاسبه:</td>
                        <td className="py-2.5 text-left font-bold font-mono text-slate-900">{formatNumber(sevCalculation.effectiveMonthly)} تومان</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-slate-600 font-medium">مدت سابقه خدمت اشتغال:</td>
                        <td className="py-2.5 text-left font-bold text-slate-900">{sevYears} سال و {sevMonths} ماه و {sevDays} روز</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-slate-600 font-medium">ضریب سالانه مؤثر (اعشاری):</td>
                        <td className="py-2.5 text-left font-bold font-mono text-slate-900">{sevCalculation.effectiveYears} سال</td>
                      </tr>
                      <tr className="bg-amber-50/80 border-t-2 border-b-2 border-amber-600">
                        <td className="py-3 px-2 font-black text-slate-950 text-sm">مبلغ خالص سنوات استحقاقی:</td>
                        <td className="py-3 px-2 text-left font-black font-mono text-amber-900 text-base">{formatNumber(sevCalculation.totalAmount)} تومان</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* بخش امضا و سلب مسئولیت حقوقی */}
                  <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] text-slate-500 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-700">محل امضا و تأیید کارفرما:</span>
                      <div className="h-10 mt-1 border border-dashed border-slate-300 rounded-lg bg-slate-50/50"></div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">محل امضا و رؤیت کارگر:</span>
                      <div className="h-10 mt-1 border border-dashed border-slate-300 rounded-lg bg-slate-50/50"></div>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 bg-slate-100/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed text-justify">
                    <strong>تذکر قانونی:</strong> محاسبات فوق بدون کسر دیون، وام‌های پرسنلی و اقلام معوقه صادر گردیده و ارائه این برگه بدون امضا و اثر انگشت طرفین به منزله سند تسویه‌حساب نهایی حقوقی تلقی نمی‌گردد.
                  </div>
                </div>

                <button
                  onClick={() => executePrintAndDownload('slip-severance', 'فیش_رسمی_سنوات_دادکار')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>چاپ مستقیم یا ذخیره فیش سنوات (PDF / چاپی)</span>
                </button>
              </div>
            )}

            {/* بیمه بیکاری */}
            {calcTab === 'unemployment' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <UserMinus className="w-4 h-4" /> محاسبه مقرری بیمه بیکاری (ماده ۷ قانون بیمه بیکاری)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">متوسط مزد یا حقوق ۹۰ روز پایانی (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={unempAvgWage ? unempAvgWage.toLocaleString() : ''}
                        onChange={(e) => setUnempAvgWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۲,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">حداقل دستمزد مصوب سال جاری (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={unempMinWage ? unempMinWage.toLocaleString() : ''}
                        onChange={(e) => setUnempMinWage(sanitizeNumber(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">تعداد افراد تکفل (حداکثر ۴):</label>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          value={unempDependents}
                          onChange={(e) => setUnempDependents(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">کل سابقه بیمه (ماه):</label>
                        <input
                          type="number"
                          min="6"
                          value={unempInsuranceMonths}
                          onChange={(e) => setUnempInsuranceMonths(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="marriedCheck"
                        checked={unempIsMarried}
                        onChange={(e) => setUnempIsMarried(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
                      />
                      <label htmlFor="marriedCheck" className="text-xs text-slate-300">
                        متقاضی متأهل یا متکفل است (جدول افزایش سنوات)
                      </label>
                    </div>
                  </div>

                  {unempCalculation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>مقرری پایه (۵۵٪ متوسط دستمزد):</span>
                        <span className="font-mono">{formatNumber(unempCalculation.baseAmount)} تومان</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>فوق‌العاده عائله‌مندی (۱۰٪ حداقل مزد):</span>
                        <span className="font-mono">{formatNumber(unempCalculation.dependentsBonus)} تومان</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>مدت استحقاق دریافت مقرری:</span>
                        <span className="font-mono text-cyan-400 font-bold">{unempCalculation.durationMonths} ماه</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                        <span>مقرری خالص ماهانه:</span>
                        <span className="text-base text-cyan-400 font-black">{formatNumber(unempCalculation.totalMonthly)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* فیش رسمی بیمه بیکاری */}
                {unempCalculation && (
                  <>
                    <div id="slip-unemp" className="bg-gradient-to-b from-white via-slate-50 to-white text-slate-950 rounded-3xl p-6 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-cyan-400 font-black text-xs">بیمه</div>
                            <h4 className="text-lg font-black text-slate-950">گواهی برآورد مقرری بیمه بیکاری</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-1">استناد قانونی: ماده ۷ قانون بیمه بیکاری و مصوبات تأمین اجتماعی</p>
                        </div>
                        <div className="border-2 border-dashed border-cyan-700 text-cyan-800 rounded-2xl px-3 py-1 text-[10px] font-black uppercase bg-cyan-50/50">
                          محاسبه سیستمی
                          <div className="text-[8px] font-mono text-slate-600 font-normal mt-0.5">{new Date().toLocaleDateString('fa-IR')}</div>
                        </div>
                      </div>

                      <table className="w-full text-xs border-collapse mb-5">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">متوسط دستمزد ۹۰ روز پایانی:</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{formatNumber(unempAvgWage)} تومان</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">افراد تحت تکفل و فوق‌العاده متعلقه:</td>
                            <td className="py-2.5 text-left font-bold text-slate-900">{unempDependents} نفر ({formatNumber(unempCalculation.dependentsBonus)} تومان)</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">مدت قانونی پرداخت مقرری:</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{unempCalculation.durationMonths} ماه</td>
                          </tr>
                          <tr className="bg-cyan-50/80 border-t-2 border-b-2 border-cyan-600">
                            <td className="py-3 px-2 font-black text-slate-950 text-sm">مقرری قابل پرداخت ماهانه:</td>
                            <td className="py-3 px-2 text-left font-black font-mono text-cyan-900 text-base">{formatNumber(unempCalculation.totalMonthly)} تومان</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-2 text-slate-600 text-[11px]">ارزش ریالی کل دوره مقرری:</td>
                            <td className="py-2 px-2 text-left font-bold font-mono text-slate-700">{formatNumber(unempCalculation.totalPeriodAmount)} تومان</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="p-2.5 bg-slate-100/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed text-justify">
                        <strong>توجه:</strong> برقراری مقرری نهایی مشروط به معرفی کتبی اداره تعاون، کار و رفاه اجتماعی محل و احراز شرایط ماده ۶ قانون بیمه بیکاری است.
                      </div>
                    </div>

                    <button
                      onClick={() => executePrintAndDownload('slip-unemp', 'فیش_رسمی_بیمه_بیکاری_دادکار')}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-600/20 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-white" />
                      <span>چاپ مستقیم یا ذخیره فیش بیمه بیکاری (PDF / چاپی)</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* حق بیمه */}
            {calcTab === 'tamin' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> تفکیک سهم و نرخ‌های حق بیمه (ماده ۲۸ تأمین اجتماعی)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">نوع بیمه و نرخ مصوب:</label>
                      <select
                        value={taminType}
                        onChange={(e) => setTaminType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="compulsory">بیمه اجباری قانون کار (۳۰٪ = ۷٪ کارگر + ۲۳٪ کارفرما)</option>
                        <option value="freelance_12">مشاغل آزاد و زنان خانه‌دار ۱۲٪ (بازنشستگی و فوت پس از بازنشستگی)</option>
                        <option value="freelance_14">مشاغل آزاد و زنان خانه‌دار ۱۴٪ (بازنشستگی و فوت قبل و بعد بازنشستگی)</option>
                        <option value="freelance_18">مشاغل آزاد و زنان خانه‌دار ۱۸٪ (کامل: بازنشستگی، فوت، ازکارافتادگی)</option>
                        <option value="optional_27">بیمه اختیاری ۲۷٪ (خدمات درمانی و کلیه تعهدات کامل)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">دستمزد مبنای کسر حق بیمه ماهانه (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={taminWage ? taminWage.toLocaleString() : ''}
                        onChange={(e) => setTaminWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۰,۰۰۰,۰۰۰"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {taminCalculation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>سهم بیمه‌شده ({taminCalculation.workerRate}٪):</span>
                        <span className="font-mono text-indigo-400 font-bold">{formatNumber(taminCalculation.workerShare)} تومان</span>
                      </div>
                      {taminCalculation.employerRate > 0 && (
                        <div className="flex justify-between items-center text-xs text-slate-300">
                          <span>سهم کارفرما ({taminCalculation.employerRate}٪):</span>
                          <span className="font-mono">{formatNumber(taminCalculation.employerShare)} تومان</span>
                        </div>
                      )}
                      {taminCalculation.govRate > 0 && (
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>کمک دولت ({taminCalculation.govRate}٪):</span>
                          <span className="font-mono">{formatNumber(taminCalculation.govShare)} تومان</span>
                        </div>
                      )}
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                        <span>مجموع قابل پرداخت:</span>
                        <span className="text-base text-indigo-400 font-black">{formatNumber(taminCalculation.totalPayment)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {taminCalculation && (
                  <>
                    <div id="slip-tamin" className="bg-gradient-to-b from-white via-slate-50 to-white text-slate-950 rounded-3xl p-6 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-indigo-400 font-black text-xs">سهم</div>
                            <h4 className="text-lg font-black text-slate-950">فیش تفکیکی واریزی حق بیمه</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-1">استناد قانونی: ماده ۲۸ قانون تأمین اجتماعی جمهوری اسلامی ایران</p>
                        </div>
                        <div className="border-2 border-dashed border-indigo-700 text-indigo-800 rounded-2xl px-3 py-1 text-[10px] font-black uppercase bg-indigo-50/50">
                          ترازنامه ماهانه
                          <div className="text-[8px] font-mono text-slate-600 font-normal mt-0.5">{new Date().toLocaleDateString('fa-IR')}</div>
                        </div>
                      </div>

                      <table className="w-full text-xs border-collapse mb-5">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">دستمزد مشمول کسر حق بیمه:</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{formatNumber(taminWage)} تومان</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">سهم کسر از بیمه‌شده ({taminCalculation.workerRate}٪):</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{formatNumber(taminCalculation.workerShare)} تومان</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">سهم واریزی کارفرما ({taminCalculation.employerRate}٪):</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{formatNumber(taminCalculation.employerShare)} تومان</td>
                          </tr>
                          <tr className="bg-indigo-50/80 border-t-2 border-b-2 border-indigo-600">
                            <td className="py-3 px-2 font-black text-slate-950 text-sm">مجموع قابل واریز به سازمان:</td>
                            <td className="py-3 px-2 text-left font-black font-mono text-indigo-950 text-base">{formatNumber(taminCalculation.totalPayment)} تومان</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="p-2.5 bg-slate-100/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed text-justify">
                        <strong>مهلت واریز:</strong> کارفرما مکلف است حق بیمه هر ماه را حداکثر تا آخرین روز ماه بعد به حساب سازمان تأمین اجتماعی تادیه نماید.
                      </div>
                    </div>

                    <button
                      onClick={() => executePrintAndDownload('slip-tamin', 'فیش_رسمی_حق_بیمه_دادکار')}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-white" />
                      <span>چاپ مستقیم یا ذخیره فیش حق بیمه (PDF / چاپی)</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* مستمری بازنشستگی */}
            {calcTab === 'pension' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> برآورد مستمری بازنشستگی (ماده ۷۷ تأمین اجتماعی)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">میانگین دستمزد ماهانه ۲ سال آخر (تومان):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={penAvgWage ? penAvgWage.toLocaleString() : ''}
                        onChange={(e) => setPenAvgWage(sanitizeNumber(e.target.value))}
                        placeholder="مثال: ۱۸,۰۰۰,۰۰۰"
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
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">حداکثر سابقه قابل احتساب در فرمول ماده ۷۷، ۳۵ سال می‌باشد.</p>
                    </div>
                  </div>

                  {penCalculation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>ضریب استحقاق سابقه:</span>
                        <span className="font-mono text-emerald-400 font-bold">{penCalculation.effectiveYears} / ۳۰</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-bold text-slate-100">
                        <span>مستمری برآوردی ماهانه:</span>
                        <span className="text-base text-emerald-400 font-black">{formatNumber(penCalculation.monthlyPension)} تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {penCalculation && (
                  <>
                    <div id="slip-pension" className="bg-gradient-to-b from-white via-slate-50 to-white text-slate-950 rounded-3xl p-6 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-emerald-400 font-black text-xs">تقاعد</div>
                            <h4 className="text-lg font-black text-slate-950">گواهی محاسباتی مستمری بازنشستگی</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-1">استناد قانونی: ماده ۷۷ قانون تأمین اجتماعی جمهوری اسلامی ایران</p>
                        </div>
                        <div className="border-2 border-dashed border-emerald-700 text-emerald-800 rounded-2xl px-3 py-1 text-[10px] font-black uppercase bg-emerald-50/50">
                          برآورد مستمری
                          <div className="text-[8px] font-mono text-slate-600 font-normal mt-0.5">{new Date().toLocaleDateString('fa-IR')}</div>
                        </div>
                      </div>

                      <table className="w-full text-xs border-collapse mb-5">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">متوسط دستمزد ۲۴ ماه آخر بیمه‌پردازی:</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{formatNumber(penAvgWage)} تومان</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">سنوات سابقه پرداخت حق بیمه:</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{penCalculation.effectiveYears} سال</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 text-slate-600 font-medium">ضریب سی‌ام قانونی:</td>
                            <td className="py-2.5 text-left font-bold font-mono text-slate-900">{penCalculation.effectiveYears}/30</td>
                          </tr>
                          <tr className="bg-emerald-50/80 border-t-2 border-b-2 border-emerald-600">
                            <td className="py-3 px-2 font-black text-slate-950 text-sm">مستمری پایه ماهانه:</td>
                            <td className="py-3 px-2 text-left font-black font-mono text-emerald-950 text-base">{formatNumber(penCalculation.monthlyPension)} تومان</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="p-2.5 bg-slate-100/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed text-justify">
                        <strong>سلب مسئولیت:</strong> این رقم بدون احتساب کمک‌هزینه همسر، اولاد و معیشت محاسبه گردیده و رقم قطعی در حکم رسمی بازنشستگی درج خواهد شد.
                      </div>
                    </div>

                    <button
                      onClick={() => executePrintAndDownload('slip-pension', 'فیش_رسمی_مستمری_دادکار')}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-white" />
                      <span>چاپ مستقیم یا ذخیره فیش مستمری (PDF / چاپی)</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ۳. بانک جامع و طبقه‌بندی شده قوانین و احکام حقوقی */}
        {rootTab === 'laws' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس شماره ماده، عنوان یا موضوع (مثال: اخراج، بارداری، ازدواج، اضافه کاری)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 shadow-inner"
                />
              </div>

              {/* دسته‌بندی موضوعی افقی */}
              <div className="flex gap-2 overflow-x-auto pb-2 text-[11px] scrollbar-none">
                <button
                  onClick={() => setLawCategory('all')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'all' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  همه قوانین ({COMPREHENSIVE_LAWS.length})
                </button>
                <button
                  onClick={() => setLawCategory('termination')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'termination' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  اخراج، سنوات و بازخرید
                </button>
                <button
                  onClick={() => setLawCategory('maternity')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'maternity' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  بارداری، زایمان و شیردهی
                </button>
                <button
                  onClick={() => setLawCategory('marriage')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'marriage' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  کمک‌هزینه ازدواج
                </button>
                <button
                  onClick={() => setLawCategory('wages')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'wages' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  مزد، ساعت کار و اضافه کاری
                </button>
                <button
                  onClick={() => setLawCategory('leave')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'leave' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  مرخصی استحقاقی و استعلاجی
                </button>
                <button
                  onClick={() => setLawCategory('safety')}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors ${
                    lawCategory === 'safety' ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  حوادث ناشی از کار
                </button>
              </div>
            </div>

            {/* لیست کارت‌های قوانین */}
            <div className="space-y-3">
              {filteredLaws.map((law) => (
                <div key={law.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      {law.title}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                      #{law.id}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{law.subtitle}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed text-justify">{law.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {law.tags.map((t, idx) => (
                      <span key={idx} className="text-[9.5px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ۴. درباره ما */}
        {rootTab === 'about' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">سامانه هوشمند دادکار</h3>
                  <p className="text-[11px] text-slate-400">مرجع محاسباتی و حقوقی کارشناسان منابع انسانی و حقوق کار</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                سامانه دادکار با هدف شفاف‌سازی و استانداردسازی محاسبات پیچیده روابط کار، اجرای مصوبات قانون کار و احکام دیوان عدالت اداری طراحی شده است. کلیه گزارش‌ها به صورت برخط و بدون ذخیره اطلاعات هویتی اشخاص تولید می‌گردد.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* منوی ناوبری پایینی (Bottom Navigation) با فوتر شناور */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-6 py-2 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          
          <button
            onClick={() => setRootTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'home' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">داشبورد</span>
          </button>

          <button
            onClick={() => setRootTab('calculators')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'calculators' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-5 h-5 mb-1" />
            <span className="text-[10px]">محاسبه‌گرها</span>
          </button>

          <button
            onClick={() => setRootTab('laws')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'laws' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px]">بانک قوانین</span>
          </button>

          <button
            onClick={() => setRootTab('about')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              rootTab === 'about' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-5 h-5 mb-1" />
            <span className="text-[10px]">درباره ما</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
