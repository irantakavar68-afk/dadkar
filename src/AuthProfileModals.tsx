import React, { useState, useEffect, useRef } from 'react';
import { 
  User, KeyRound, CheckCircle, Save, X, Copy, Calendar, 
  Lock, LogIn, Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck,
  Upload, Trash2, Image as ImageIcon
} from 'lucide-react';

const API_URL = "https://daadkaar.ir/api/auth.php";

// ۸ آواتار وکتور استاندارد، مدرن و پرسنلی (SVG درون‌برنامه‌ای با وضوح بالا)
export const AVATAR_SVGS = [
  { id: '0', title: 'کارشناس مرد ۱', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
      <circle cx="50" cy="38" r="18" fill="#FBBF24" />
      <path d="M50 20 C36 20 33 32 33 36 C38 34 46 32 50 32 C56 32 63 34 67 36 C67 32 64 20 50 20 Z" fill="#334155" />
      <path d="M26 84 C26 68 36 60 50 60 C64 60 74 68 74 84 Z" fill="#0284C7" />
      <polygon points="50,60 45,74 50,78 55,74" fill="#E2E8F0" />
      <polygon points="48,74 52,74 51,88 49,88" fill="#BE123C" />
    </svg>
  )},
  { id: '1', title: 'کارشناس مرد ۲', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#F1F5F9" />
      <circle cx="50" cy="38" r="18" fill="#FCD34D" />
      <path d="M33 34 C33 22 42 18 50 18 C58 18 67 22 67 34 C67 36 64 30 50 30 C36 30 33 36 33 34 Z" fill="#1E293B" />
      <path d="M26 84 C26 66 37 58 50 58 C63 58 74 66 74 84 Z" fill="#334155" />
      <polygon points="50,58 43,84 57,84" fill="#0EA5E9" />
    </svg>
  )},
  { id: '2', title: 'مهندس / تکنسین', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#FEF3C7" />
      <circle cx="50" cy="40" r="17" fill="#FDE68A" />
      <path d="M28 36 C28 22 40 18 50 18 C60 18 72 22 72 36 C75 36 76 39 74 41 C70 42 30 42 26 41 C24 39 25 36 28 36 Z" fill="#F59E0B" />
      <rect x="47" y="16" width="6" height="10" rx="3" fill="#D97706" />
      <path d="M24 84 C24 66 36 60 50 60 C64 60 76 66 76 84 Z" fill="#D97706" />
      <rect x="42" y="60" width="16" height="24" fill="#1E293B" />
    </svg>
  )},
  { id: '3', title: 'کارشناس خانم ۱', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#FCE7F3" />
      <path d="M26 84 C26 64 32 54 35 48 C32 38 34 26 50 26 C66 26 68 38 65 48 C68 54 74 64 74 84 Z" fill="#1E293B" />
      <ellipse cx="50" cy="44" rx="13" ry="16" fill="#FDE68A" />
      <path d="M37 38 C42 42 58 42 63 38 C60 30 40 30 37 38 Z" fill="#0F172A" />
      <path d="M36 84 C38 68 44 60 50 60 C56 60 62 68 64 84 Z" fill="#4338CA" />
    </svg>
  )},
  { id: '4', title: 'کارشناس خانم ۲', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#EDE9FE" />
      <path d="M26 84 C26 64 32 54 35 48 C32 38 34 26 50 26 C66 26 68 38 65 48 C68 54 74 64 74 84 Z" fill="#312E81" />
      <ellipse cx="50" cy="44" rx="13" ry="16" fill="#FCD34D" />
      <path d="M34 84 C37 66 43 58 50 58 C57 58 63 66 66 84 Z" fill="#059669" />
    </svg>
  )},
  { id: '5', title: 'مدیر ارشد', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#DCFCE7" />
      <circle cx="50" cy="38" r="18" fill="#FCD34D" />
      <path d="M33 30 C35 20 45 16 50 16 C60 16 68 22 67 30 C60 26 40 24 33 30 Z" fill="#475569" />
      <rect x="38" y="36" width="9" height="7" rx="2" fill="none" stroke="#0F172A" strokeWidth="2" />
      <rect x="53" y="36" width="9" height="7" rx="2" fill="none" stroke="#0F172A" strokeWidth="2" />
      <line x1="47" y1="39" x2="53" y2="39" stroke="#0F172A" strokeWidth="2" />
      <path d="M24 84 C24 64 35 56 50 56 C65 56 76 64 76 84 Z" fill="#0F172A" />
      <polygon points="50,56 46,74 50,78 54,74" fill="#F8FAFC" />
      <polygon points="49,74 51,74 51,84 49,84" fill="#2563EB" />
    </svg>
  )},
  { id: '6', title: 'توسعه‌دهنده / IT', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#E0E7FF" />
      <circle cx="50" cy="38" r="18" fill="#FDE68A" />
      <path d="M30 40 C30 24 40 20 50 20 C60 20 70 24 70 40" fill="none" stroke="#4F46E5" strokeWidth="4" />
      <rect x="28" y="34" width="6" height="12" rx="3" fill="#4338CA" />
      <rect x="66" y="34" width="6" height="12" rx="3" fill="#4338CA" />
      <path d="M26 84 C26 66 38 60 50 60 C62 60 74 66 74 84 Z" fill="#4F46E5" />
    </svg>
  )},
  { id: '7', title: 'پزشک / درمانگر', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#CCFBF1" />
      <circle cx="50" cy="38" r="18" fill="#FCD34D" />
      <path d="M34 30 C38 20 55 20 66 30 C60 26 40 26 34 30 Z" fill="#64748B" />
      <path d="M26 84 C26 66 37 60 50 60 C63 60 74 66 74 84 Z" fill="#0D9488" />
      <path d="M42 60 C42 70 58 70 58 60" fill="none" stroke="#E2E8F0" strokeWidth="3" />
      <circle cx="50" cy="72" r="4" fill="#94A3B8" />
    </svg>
  )}
];

// بیش از ۸۰ حوزه فعالیت اقتصادی و صنعتی
const INDUSTRIES = [
  'فناوری اطلاعات و نرم‌افزار',
  'شبکه، زیرساخت و امنیت سایبری',
  'هوش مصنوعی و داده‌کاوی',
  'مخابرات و ارتباطات',
  'صنایع نفت، گاز و پتروشیمی',
  'صنایع فولاد، ذوب و متالورژی',
  'معدن و صنایع معدنی',
  'صنایع خودروسازی و قطعه‌سازی',
  'صنایع دفاعی و هوافضا',
  'پزشکی، درمان و بیمارستانی',
  'داروسازی و تجهیزات پزشکی',
  'صنایع شیمیایی و پلیمری',
  'صنایع غذایی و تبدیلی',
  'کشاورزی، دامپروری و شیلات',
  'ساختمان و ابنیه عمرانی',
  'راه‌سازی، پل و تونل‌سازی',
  'معماری و دکوراسیون داخلی',
  'تولید برق، نیروگاهی و انرژی‌های تجدیدپذیر',
  'آب، فاضلاب و تاسیسات انتقال',
  'بانکداری، مالی و صرافی',
  'بیمه و ارزیابی خسارت',
  'بورس، سرمایه‌گذاری و بازارهای مالی',
  'حسابداری، حسابرسی و مالیاتی',
  'حقوقی، وکالت و داوری',
  'مشاوره مدیریت و منابع انسانی',
  'حمل و نقل بین‌المللی و ترانزیت',
  'لجستیک، انبارداری و پخش مویرگی',
  'حمل و نقل ریلی و دریایی',
  'هوانوردی و خدمات فرودگاهی',
  'صادرات و واردات (بازرگانی خارجی)',
  'عمده‌فروشی و توزیع کالا',
  'خرده‌فروشی و فروشگاه‌های زنجیره‌ای',
  'تجارت الکترونیک و فروش آنلاین',
  'آموزش عالی، دانشگاه و مراکز پژوهشی',
  'آموزش و پرورش و مدارس',
  'موسسات آموزشی آزاد و کنکور',
  'فرهنگی، رسانه و خبرگزاری',
  'چاپ، بسته‌بندی و نشر',
  'تبلیغات، بازاریابی و برندینگ',
  'روابط عمومی و تشریفات',
  'صدا و تصویر، سینما و تولید محتوا',
  'گردشگری، هتلداری و بوم‌گردی',
  'رستوران، فست‌فود و کترینگ',
  'خدمات حفاظتی، حراست و نگهبانی',
  'خدمات نظافتی و مدیریت پسماند',
  'تعمیرات، نگهداری تجهیزات و ماشین‌آلات (نت)',
  'صنایع نساجی، پوشاک و کفش',
  'صنایع چوب، مبلمان و MDF',
  'صنایع شیشه، سرامیک و کاشی',
  'صنایع سلولزی و کاغذسازی',
  'محیط‌زیست، بازیافت و تصفیه',
  'ورزش، باشگاه و تجهیزات ورزشی',
  'زیبایی، بهداشتی و آرایشی',
  'خدمات شهری و شهرداری‌ها',
  'خدمات عمومی و دولتی',
  'سایر'
];

const J_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

function div(a: number, b: number) { return ~~(a / b); }
function g2j(gy: number, gm: number, gd: number) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979; gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + div(gy2 + 3, 4) - div(gy2 + 99, 100) + div(gy2 + 399, 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * div(days, 12053); days %= 12053;
  jy += 4 * div(days, 1461); days %= 1461;
  if (days > 365) { jy += div(days - 1, 365); days = (days - 1) % 365; }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}
function j2g(jy: number, jm: number, jd: number) {
  let gy = jy <= 979 ? 621 : 1600; jy -= jy <= 979 ? 0 : 979;
  let days = 365 * jy + div(jy, 33) * 8 + div(jy % 33 + 3, 4) + 78 + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * div(days, 146097); days %= 146097;
  if (days > 36524) { gy += 100 * div(--days, 36524); days %= 36524; if (days >= 365) days++; }
  gy += 4 * div(days, 1461); days %= 1461;
  if (days > 365) { gy += div(days - 1, 365); days = (days - 1) % 365; }
  let gd = days + 1;
  const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0; for (gm = 1; gm <= 12 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}
function jalaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return j2g(jy, 12, 30)[1] === 2 && j2g(jy + 1, 1, 1)[2] === 1 ? 30 : 29;
}

// تقویم ارتقا یافته شمسی
const JalaliPicker: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ 
  value, onChange, placeholder = "----/--/--" 
}) => {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const nowG = new Date();
  const currentJalali = g2j(nowG.getFullYear(), nowG.getMonth() + 1, nowG.getDate());
  const currentYear = currentJalali[0];

  const init = value ? value.split('/').map(Number) : currentJalali;
  const [jy, setJy] = useState(init[0] || 1370);
  const [jm, setJm] = useState(init[1] || 1);
  const [jd, setJd] = useState<number | null>(init[2] || null);

  const yearsList = Array.from({ length: currentYear - 1320 + 1 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (value) {
      const parts = value.split('/').map(Number);
      if (parts.length === 3) {
        setJy(parts[0]);
        setJm(parts[1]);
        setJd(parts[2]);
      }
    }
  }, [value]);

  const selectDay = (day: number) => {
    setJd(day);
    const formatted = `${jy}/${String(jm).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onChange(formatted);
    setOpen(false);
  };

  const daysInMonth = jalaliMonthLength(jy, jm);
  const firstG = j2g(jy, jm, 1);
  const offset = new Date(firstG[0], firstG[1] - 1, firstG[2]).getDay();

  return (
    <div className="relative w-full font-['Vazirmatn']">
      <div 
        onClick={() => { setOpen(!open); setViewMode('days'); }}
        className="w-full px-3 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md text-sm font-mono dark:text-white text-center cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 shadow-sm transition flex items-center justify-between"
      >
        <Calendar size={18} className="text-blue-500" />
        <span className="font-bold tracking-wider">{value || placeholder}</span>
        <div className="w-4" />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 p-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 right-0">
          <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => {
                if (jm === 1) { setJm(12); setJy(jy - 1); } else { setJm(jm - 1); }
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
            >‹</button>
            
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline px-1"
              >
                {J_MONTHS[jm - 1]}
              </button>
              <button 
                type="button" 
                onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                className="font-bold text-sm text-slate-800 dark:text-white hover:underline px-1"
              >
                {jy}
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => {
                if (jm === 12) { setJm(1); setJy(jy + 1); } else { setJm(jm + 1); }
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
            >›</button>
          </div>

          {viewMode === 'years' && (
            <div className="max-h-56 overflow-y-auto grid grid-cols-3 gap-1.5 p-1">
              {yearsList.map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => { setJy(y); setViewMode('months'); }}
                  className={`py-2 text-xs rounded-lg transition font-mono ${y === jy ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {J_MONTHS.map((mName, idx) => (
                <button
                  key={mName}
                  type="button"
                  onClick={() => { setJm(idx + 1); setViewMode('days'); }}
                  className={`py-2 text-xs rounded-xl font-medium transition ${idx + 1 === jm ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300'}`}
                >
                  {mName}
                </button>
              ))}
            </div>
          )}

          {viewMode === 'days' && (
            <>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">
                {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: (offset + 1) % 7 }).map((_, i) => <span key={'e' + i} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => selectDay(d)}
                    className={`text-xs rounded-lg py-1.5 font-medium transition ${jd === d ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <button 
              type="button" 
              onClick={() => { setJy(currentJalali[0]); setJm(currentJalali[1]); selectDay(currentJalali[2]); }}
              className="text-[11px] text-blue-500 hover:underline"
            >
              امروز
            </button>
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const formatSalary = (s: string) => s.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const calculatePasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, text: '', color: 'bg-slate-300' };
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 9) score += 1;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (score <= 2) return { score: 1, text: 'ضعیف', color: 'bg-rose-500' };
  if (score <= 4) return { score: 2, text: 'متوسط', color: 'bg-amber-500' };
  return { score: 3, text: 'بسیار قوی', color: 'bg-emerald-500' };
};

export interface UserProfile {
  user_code: string; 
  mobile: string;
  username?: string;
  first_name: string; 
  last_name: string;
  birth_date: string; 
  marital_status: 'single' | 'married' | 'divorced';
  children_count?: number;
  insurance_start_date: string; 
  last_salary_million_rial: number | string;
  avatar_id?: string; 
  avatar_image?: string; // تصویر اختصاصی آپلود شده با Base64
  company_name?: string; 
  industry_field?: string;
  password?: string;
}

interface Props {
  user: UserProfile | null;
  token: string | null;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  onProfileUpdate: (user: UserProfile) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
}

const emptyForm: UserProfile = {
  user_code: '', 
  mobile: '', 
  username: '', 
  first_name: '', 
  last_name: '',
  birth_date: '', 
  marital_status: 'single', 
  children_count: 0,
  insurance_start_date: '',
  last_salary_million_rial: '', 
  avatar_id: '0', 
  avatar_image: '',
  company_name: '', 
  industry_field: '', 
  password: ''
};

// مؤلفه ورودی فوق‌العاده شیک با طراحی گلس‌مورفیک مدرن
const GlassInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }> = ({ 
  icon, className = '', ...props 
}) => (
  <div className="relative w-full">
    {icon && (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors">
        {icon}
      </div>
    )}
    <input
      {...props}
      className={`w-full ${icon ? 'pr-11 pl-4' : 'px-4'} py-3 text-sm rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 ${className}`}
    />
  </div>
);

// مؤلفه ورودی رمز گلس‌مورفیک با قابلیت مشاهده/مخفی‌سازی
const GlassPasswordInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  show: boolean;
  onToggleShow: () => void;
  icon?: React.ReactNode;
}> = ({ value, onChange, placeholder = "••••••••", show, onToggleShow, icon }) => (
  <div className="relative w-full">
    {icon && (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
        {icon}
      </div>
    )}
    <input
      type={show ? "text" : "password"}
      dir="ltr"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full ${icon ? 'pr-11 pl-11' : 'pr-4 pl-11'} py-3 text-sm rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 font-mono tracking-wider transition-all duration-200`}
    />
    <button
      type="button"
      onClick={onToggleShow}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export const AuthProfileModals: React.FC<Props> = ({
  user, token, onLoginSuccess, onProfileUpdate, showProfileModal, setShowProfileModal
}) => {
  const [step, setStep] = useState<'login' | 'mobile' | 'code' | 'register' | 'forgot' | 'reset'>('login');
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  
  const [sessionToken, setSessionToken] = useState<string>(token || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success'>('error');
  
  const [formData, setFormData] = useState<UserProfile>(user || emptyForm);
  const [customIndustry, setCustomIndustry] = useState('');
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(90);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameMsg, setUsernameMsg] = useState('');
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const post = async (action: string, body: object) => {
    const res = await fetch(`${API_URL}?action=${action}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body)
    });
    return res.json();
  };

  const handleUsernameChange = (val: string) => {
    const cleaned = val.replace(/[^a-zA-Z0-9_.]/g, '');
    setFormData(prev => ({ ...prev, username: cleaned }));
    
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    if (cleaned.length < 3) {
      setUsernameStatus('idle');
      setUsernameMsg(cleaned.length > 0 ? 'حداقل ۳ کاراکتر انگلیسی' : '');
      return;
    }

    setUsernameStatus('checking');
    setUsernameMsg('در حال استعلام...');
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await post('check_username', { username: cleaned, token: sessionToken || token });
        const isAvailable = res.available === true || res.extra?.available === true;
        
        if (isAvailable) {
          setUsernameStatus('available');
          setUsernameMsg(res.message || 'این نام کاربری آزاد است.');
        } else {
          setUsernameStatus('taken');
          setUsernameMsg(res.message || 'این نام کاربری قبلاً انتخاب شده است.');
        }
      } catch {
        setUsernameStatus('idle');
        setUsernameMsg('');
      }
    }, 600);
  };

  // آپلود عکس سفارشی و تبدیل به Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsgType('error');
      setMsg('لطفاً فقط فایل تصویری معتبر انتخاب کنید.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMsgType('error');
      setMsg('حداکثر حجم تصویر ۲ مگابایت است.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, avatar_image: base64, avatar_id: 'custom' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, avatar_image: '', avatar_id: '0' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ورود با رمز عبور
  const handleLoginPassword = async () => {
    if (!identity || !password) { 
      setMsgType('error'); 
      setMsg('نام کاربری و رمز عبور را وارد کنید.'); 
      return; 
    }
    setLoading(true); setMsg('');
    try {
      const data = await post('login_password', { username: identity, password });
      if (data.status === 'success') {
        localStorage.setItem('dadkar_token', data.token);
        localStorage.setItem('dadkar_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else { 
        setMsgType('error'); 
        setMsg(data.message || 'نام کاربری یا رمز نادرست است.'); 
      }
    } catch { 
      setMsgType('error'); 
      setMsg('خطای ارتباط با سرور'); 
    } finally { 
      setLoading(false); 
    }
  };

  // ارسال OTP
  const handleSendOtp = async (isForgot = false, channel: 'sms' | 'voice' = 'sms') => {
    setLoading(true);
    setMsg('');
    try {
      const actionName = channel === 'voice' 
        ? 'send_voice_otp' 
        : (isForgot ? 'forgot_password' : 'send_otp');

      const data = await post(actionName, { mobile, is_forgot: isForgot });
      
      if (data.status === 'success') {
        setResendTimer(90);
        setStep(isForgot ? 'reset' : 'code');
        setMsg(data.message || (channel === 'voice' ? 'کد تأیید صوتی ارسال شد.' : 'کد تأیید پیامکی ارسال شد.'));
        setMsgType('success');
      } else {
        setMsgType('error');
        setMsg(data.message || 'خطا در ارسال کد تأیید');
      }
    } catch (err) {
      console.error('Send OTP Error:', err);
      setMsgType('error');
      setMsg('خطای ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // بررسی کد تایید (رفع باگ فریز و صفحه تیره)
  const handleVerifyOtp = async () => {
    const cleanOtp = otpCode.replace(/\D/g, '');
    if (!cleanOtp || cleanOtp.length < 4) {
      setMsgType('error');
      setMsg('لطفاً کد تایید ۴ رقمی را کامل وارد کنید.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const data = await post('verify_otp', { mobile: formData.mobile || mobile, code: cleanOtp });
      
      if (data.status === 'success') {
        const tokenVal = data.extra?.token || data.token || '';
        setSessionToken(tokenVal);
        localStorage.setItem('dadkar_token', tokenVal);
        
        if (data.is_registered) {
          const fullUser = data.extra?.user || data.user || {};
          localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
          setMsg('با موفقیت وارد شدید!');
          setMsgType('success');
          // بروزرسانی مستقیم وضعیت ورود و توکن بدون تداخل با مودال‌های دیگر
          setTimeout(() => {
            onLoginSuccess(fullUser, tokenVal);
          }, 300);
        } else {
          setStep('register');
          setMsg('کد تأیید شد. لطفاً اطلاعات عضویت را تکمیل نمایید.');
          setMsgType('success');
        }
      } else {
        setMsgType('error');
        setMsg(data.message || 'کد تأیید نامعتبر یا منقضی شده است.');
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setMsgType('error');
      setMsg('خطای ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // ثبت‌نام اولیه
  const handleRegister = async () => {
    if (!formData.username || formData.username.length < 3) {
      setMsgType('error'); setMsg('تعیین نام کاربری معتبر (حداقل ۳ حرف) الزامی است.'); return;
    }
    if (usernameStatus === 'taken') {
      setMsgType('error'); setMsg('لطفاً یک نام کاربری آزاد انتخاب کنید.'); return;
    }
    if (!formData.password || formData.password.length < 6) {
      setMsgType('error'); setMsg('رمز عبور باید حداقل ۶ کاراکتر باشد.'); return;
    }
    if (formData.password !== confirmPassword) {
      setMsgType('error'); setMsg('رمز عبور و تکرار آن همخوانی ندارند.'); return;
    }

    setLoading(true); 
    setMsg('');
    try {
      const currentToken = sessionToken || localStorage.getItem('dadkar_token');
      const finalIndustry = isOtherIndustry ? customIndustry : formData.industry_field;

      const payload = {
        ...formData,
        industry_field: finalIndustry,
        token: currentToken
      };

      const data = await post('save_profile', payload);

      if (data.status === 'success') {
        const fullUser = data.user || data.extra?.user || { ...formData, mobile, industry_field: finalIndustry };
        localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
        
        const finalToken = data.extra?.token || data.token || currentToken || '';
        localStorage.setItem('dadkar_token', finalToken);

        onLoginSuccess(fullUser, finalToken);
        setMsg('عضویت شما با موفقیت تکمیل شد. خوش آمدید!');
        setMsgType('success');
      } else { 
        setMsgType('error'); 
        setMsg(data.message || 'خطا در ثبت اطلاعات عضویت'); 
      }
    } catch (err) { 
      console.error('Save Profile Error:', err);
      setMsgType('error'); 
      setMsg('خطای ارتباط با سرور'); 
    } finally {
      setLoading(false);
    }
  };

  // بازیابی رمز عبور
  const handleResetPassword = async () => {
    const cleanOtp = otpCode.replace(/\D/g, '');
    if (cleanOtp.length < 4 || password.length < 6) { 
      setMsgType('error'); setMsg('کد و رمز جدید (حداقل ۶ کاراکتر) را وارد کنید.'); return; 
    }
    setLoading(true); setMsg('');
    try {
      const data = await post('reset_password', { 
        mobile, 
        code: cleanOtp, 
        new_password: password 
      });
      if (data.status === 'success') {
        setMsgType('success'); setMsg('رمز با موفقیت تغییر کرد. در حال انتقال به ورود...');
        setTimeout(() => { setStep('login'); setMsg(''); }, 1500);
      } else { setMsgType('error'); setMsg(data.message || 'خطا در بازیابی'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ذخیره مشخصات پروفایل
  const handleSaveProfile = async () => {
    const activeToken = token || sessionToken || localStorage.getItem('dadkar_token');
    if (!activeToken) return;
    setSaveLoading(true); setSaveMsg('');
    try {
      const finalIndustry = isOtherIndustry ? customIndustry : formData.industry_field;
      const res = await post('save_profile', { ...formData, industry_field: finalIndustry, token: activeToken });
      if (res.status === 'success') {
        const updated = { ...formData, industry_field: finalIndustry };
        localStorage.setItem('dadkar_user', JSON.stringify(updated));
        onProfileUpdate(updated);
        setSaveMsg('مشخصات با موفقیت ذخیره گردید.');
        setTimeout(() => setShowProfileModal(false), 1200);
      } else setSaveMsg(res.message || 'خطا در ذخیره‌سازی');
    } catch { setSaveMsg('خطای ارتباط با سرور'); }
    finally { setSaveLoading(false); }
  };

  const pwdStrength = calculatePasswordStrength(formData.password || '');
  const selectedAvatarObj = AVATAR_SVGS.find(a => a.id === (formData.avatar_id ?? '0')) || AVATAR_SVGS[0];

  const Msg = () => msg ? (
    <div className="mt-3 p-3 text-xs text-center rounded-2xl flex items-center justify-center gap-2 backdrop-blur-md transition-all animate-in fade-in duration-200">
      {msgType === 'success' ? (
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700/50 p-2.5 rounded-xl w-full justify-center font-medium">
          <CheckCircle size={16} />
          <span>{msg}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-rose-700 bg-rose-500/15 border border-rose-500/30 dark:text-rose-300 dark:bg-rose-950/50 dark:border-rose-700/50 p-2.5 rounded-xl w-full justify-center font-medium">
          <AlertCircle size={16} />
          <span>{msg}</span>
        </div>
      )}
    </div>
  ) : null;

  // رندر آواتار یا عکس اختصاصی آپلود شده با افکت‌های مدرن
  const renderCurrentAvatar = (sizeClass = "w-14 h-14") => {
    if (formData.avatar_image) {
      return (
        <img 
          src={formData.avatar_image} 
          alt="پروفایل" 
          className={`${sizeClass} object-cover rounded-2xl shadow-md border-2 border-blue-500`} 
        />
      );
    }
    return (
      <div className={`${sizeClass} rounded-2xl p-1 bg-white/80 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden`}>
        {selectedAvatarObj.svg}
      </div>
    );
  };

  // ================= مودال احراز هویت (ورود / کد تایید / ثبت نام) =================
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto font-['Vazirmatn']">
        <style>{`
          @keyframes avatarGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4), inset 0 0 10px rgba(59, 130, 246, 0.2); }
            50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.7), inset 0 0 15px rgba(99, 102, 241, 0.4); }
          }
          .avatar-pulse-glow {
            animation: avatarGlow 3s infinite ease-in-out;
          }
        `}</style>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/40 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl text-right my-auto max-h-[94vh] overflow-y-auto relative">
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Lock size={28} />
            </div>
          </div>

          {/* ۱. ورود با نام کاربری و رمز */}
          {step === 'login' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">ورود به دادکار</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">نام کاربری (یا شماره موبایل) و رمز عبور خود را وارد کنید.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">نام کاربری یا شماره همراه</label>
                  <GlassInput
                    dir="ltr"
                    placeholder="09xxxxxxxxx یا username"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    icon={<User size={18} />}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">رمز عبور</label>
                  <GlassPasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    show={showPwd}
                    onToggleShow={() => setShowPwd(!showPwd)}
                    icon={<KeyRound size={18} />}
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => { setStep('forgot'); setMsg(''); }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    رمز عبور را فراموش کرده‌اید؟
                  </button>
                </div>

                <Msg />

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleLoginPassword}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <LogIn size={18} />}
                  <span>ورود به حساب کاربری</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-xs text-slate-400">یا ورود سریع</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep('mobile'); setMsg(''); }}
                  className="w-full py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <ShieldCheck size={18} className="text-emerald-500" />
                  <span>ورود با پیامک یا کد یکبار مصرف (OTP)</span>
                </button>
              </div>
            </>
          )}

          {/* ۲. ارسال شماره موبایل */}
          {step === 'mobile' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">ورود یا ثبت‌نام با موبایل</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">شماره تلفن همراه خود را جهت دریافت کد تأیید وارد کنید.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">شماره موبایل</label>
                  <GlassInput
                    dir="ltr"
                    type="tel"
                    maxLength={11}
                    placeholder="09123456789"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    icon={<User size={18} />}
                  />
                </div>

                <Msg />

                <button
                  type="button"
                  disabled={loading || mobile.length < 11}
                  onClick={() => handleSendOtp(false, 'sms')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
                  <span>ارسال کد تأیید پیامکی</span>
                </button>

                <button
                  type="button"
                  disabled={loading || mobile.length < 11}
                  onClick={() => handleSendOtp(false, 'voice')}
                  className="w-full py-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <span>دریافت کد از طریق تماس صوتی</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('login'); setMsg(''); }}
                  className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:underline pt-2 block"
                >
                  بازگشت به ورود با رمز عبور
                </button>
              </div>
            </>
          )}

          {/* ۳. دریافت و تایید کد OTP */}
          {step === 'code' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">کد تأیید را وارد کنید</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
                کد ارسال شده به شماره <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{mobile}</span> را بنویسید.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5 text-center">کد تأیید ۴ رقمی</label>
                  <GlassInput
                    dir="ltr"
                    maxLength={6}
                    placeholder="— — — —"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center font-mono text-2xl tracking-[0.5em] font-bold py-3.5"
                  />
                </div>

                <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
                  {resendTimer > 0 ? (
                    <span>ارسال مجدد تا <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{formatTimer(resendTimer)}</span></span>
                  ) : (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSendOtp(false, 'sms')}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      ارسال مجدد پیامک
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setStep('mobile'); setOtpCode(''); setMsg(''); }}
                    className="hover:underline"
                  >
                    تغییر شماره
                  </button>
                </div>

                <Msg />

                <button
                  type="button"
                  disabled={loading || otpCode.length < 4}
                  onClick={handleVerifyOtp}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  <span>تأیید و ادامه</span>
                </button>
              </div>
            </>
          )}

          {/* ۴. تکمیل مشخصات عضویت و ثبت‌نام */}
          {step === 'register' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">تکمیل عضویت دادکار</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-5">نام کاربری اختصاصی، رمز عبور و اطلاعات اولیه خود را تعیین فرمایید.</p>

              <div className="space-y-3.5">
                {/* بخش آواتار یا تصویر آپلودی */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">تصویر یا آواتار پروفایل</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 flex items-center gap-1 transition"
                      >
                        <Upload size={13} />
                        <span>آپلود تصویر</span>
                      </button>
                      {formData.avatar_image && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-[11px] px-2 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 transition"
                          title="حذف عکس"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {formData.avatar_image ? (
                    <div className="flex items-center gap-3 p-2 bg-blue-50/50 dark:bg-slate-800/40 rounded-2xl border border-blue-200 dark:border-blue-800">
                      {renderCurrentAvatar("w-14 h-14")}
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold block text-blue-600 dark:text-blue-400">تصویر اختصاصی انتخاب شد</span>
                        <span>در صورت تمایل می‌توانید با کلید بالا تصویر را تغییر داده یا حذف کنید.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      {AVATAR_SVGS.map((av) => {
                        const isSelected = (formData.avatar_id ?? '0') === av.id;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, avatar_id: av.id, avatar_image: '' })}
                            className={`relative p-1 rounded-2xl transition-all duration-300 hover:scale-110 ${
                              isSelected 
                                ? 'avatar-pulse-glow bg-gradient-to-tr from-blue-600 to-indigo-500 scale-105' 
                                : 'opacity-70 hover:opacity-100 hover:bg-white dark:hover:bg-slate-700'
                            }`}
                            title={av.title}
                          >
                            <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-0.5">
                              {av.svg}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* نام کاربری و استعلام آنلاین */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">نام کاربری (حداقل ۳ حرف انگلیسی)</label>
                  <GlassInput
                    dir="ltr"
                    placeholder="مثال: seyed_hejazi"
                    value={formData.username || ''}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    icon={<User size={18} />}
                  />
                  {usernameMsg && (
                    <p className={`text-[11px] mt-1 font-medium ${
                      usernameStatus === 'available' ? 'text-emerald-500' :
                      usernameStatus === 'taken' ? 'text-rose-500' : 'text-slate-400'
                    }`}>
                      {usernameMsg}
                    </p>
                  )}
                </div>

                {/* رمز عبور و تکرار آن */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">رمز عبور</label>
                    <GlassPasswordInput
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      show={showPwd}
                      onToggleShow={() => setShowPwd(!showPwd)}
                      icon={<KeyRound size={17} />}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">تکرار رمز عبور</label>
                    <GlassPasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      show={showConfirmPwd}
                      onToggleShow={() => setShowConfirmPwd(!showConfirmPwd)}
                      icon={<KeyRound size={17} />}
                    />
                  </div>
                </div>

                {/* نوار سنجش قدرت رمز */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>قدرت رمز:</span>
                      <span className="font-bold">{pwdStrength.text}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}

                {/* نام و نام خانوادگی */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">نام</label>
                    <GlassInput
                      placeholder="نام"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">نام خانوادگی</label>
                    <GlassInput
                      placeholder="نام خانوادگی"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                {/* حوزه فعالیت */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">صنعت و حوزه فعالیت</label>
                  <select 
                    value={isOtherIndustry ? 'سایر' : (formData.industry_field || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'سایر') {
                        setIsOtherIndustry(true);
                      } else {
                        setIsOtherIndustry(false);
                        setFormData({ ...formData, industry_field: val });
                      }
                    }}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="">انتخاب حوزه فعالیت...</option>
                    {INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {isOtherIndustry && (
                  <GlassInput
                    placeholder="عنوان دقیق حوزه فعالیت خود را درج نمایید..."
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                  />
                )}

                <Msg />

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegister}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all duration-200 mt-3 disabled:opacity-50"
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>ثبت نهایی و ورود به دادکار</span>
                </button>
              </div>
            </>
          )}

          {/* ۵. درخواست بازیابی رمز */}
          {step === 'forgot' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">بازیابی رمز عبور</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">شماره همراه خود را جهت دریافت کد بازیابی وارد نمایید.</p>

              <div className="space-y-4">
                <GlassInput
                  dir="ltr"
                  type="tel"
                  maxLength={11}
                  placeholder="09123456789"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  icon={<User size={18} />}
                />

                <Msg />

                <button
                  type="button"
                  disabled={loading || mobile.length < 11}
                  onClick={() => handleSendOtp(true, 'sms')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
                  <span>ارسال پیامک کد بازیابی</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('login'); setMsg(''); }}
                  className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:underline pt-2 block"
                >
                  انصراف و بازگشت
                </button>
              </div>
            </>
          )}

          {/* ۶. تنظیم مجدد رمز با کد */}
          {step === 'reset' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">تعیین رمز جدید</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">کد تایید دریافتی و رمز عبور جدید را بنویسید.</p>

              <div className="space-y-4">
                <GlassInput
                  dir="ltr"
                  maxLength={6}
                  placeholder="کد ۴ رقمی پیامک شده"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center font-mono tracking-widest text-lg"
                />

                <GlassPasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                  show={showPwd}
                  onToggleShow={() => setShowPwd(!showPwd)}
                  icon={<KeyRound size={18} />}
                />

                <Msg />

                <button
                  type="button"
                  disabled={loading || otpCode.length < 4 || password.length < 6}
                  onClick={handleResetPassword}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>تغییر رمز و ورود</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }

  // ================= مودال ویرایش پروفایل (کاربر لاگین شده) =================
  if (!showProfileModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto font-['Vazirmatn']">
      <style>{`
        @keyframes avatarGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4), inset 0 0 10px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.7), inset 0 0 15px rgba(99, 102, 241, 0.4); }
        }
        .avatar-pulse-glow {
          animation: avatarGlow 3s infinite ease-in-out;
        }
      `}</style>

      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/40 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl text-right my-auto max-h-[94vh] overflow-y-auto">
        
        {/* هدر مودال پروفایل */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <User size={22} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">مشخصات کاربری و پرسنلی</h3>
          </div>
          <button 
            onClick={() => setShowProfileModal(false)} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* کارت هویت اختصاصی دادکار و آواتار/عکس زنده */}
        <div className="mb-5 p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-3xl flex items-center justify-between border border-blue-100 dark:border-blue-900/40 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {renderCurrentAvatar("w-14 h-14")}
            </div>
            <div>
              <span className="text-[11px] block text-blue-600 dark:text-blue-400 font-semibold">شناسه اختصاصی دادکار:</span>
              <span className="text-base font-bold font-mono text-slate-800 dark:text-white tracking-wider">
                {formData.user_code || user?.user_code || 'DK-USER'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(formData.user_code || user?.user_code || '')}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 shadow-sm transition border border-slate-200/60 dark:border-slate-700/60" 
            title="کپی شناسه"
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="space-y-4 text-right">
          
          {/* بخش مدیریت آواتار و آپلود عکس */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">تغییر آواتار یا تصویر پرسنلی</label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 flex items-center gap-1.5 transition font-medium"
                >
                  <Upload size={14} />
                  <span>آپلود عکس شخصی</span>
                </button>
                {formData.avatar_image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition"
                    title="حذف عکس و انتخاب آواتار"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {AVATAR_SVGS.map((av) => {
                const isSelected = !formData.avatar_image && (formData.avatar_id ?? '0') === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar_id: av.id, avatar_image: '' })}
                    className={`p-1 rounded-2xl transition-all duration-300 hover:scale-110 ${
                      isSelected 
                        ? 'avatar-pulse-glow bg-gradient-to-tr from-blue-600 to-indigo-500 scale-105' 
                        : 'hover:bg-white dark:hover:bg-slate-700 opacity-70 hover:opacity-100'
                    }`}
                    title={av.title}
                  >
                    <div className="w-9 h-9 mx-auto rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-0.5">
                      {av.svg}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* نام و نام خانوادگی */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">نام</label>
              <GlassInput
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">نام خانوادگی</label>
              <GlassInput
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          {/* تاریخ تولد، وضعیت تأهل و تعداد فرزند */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">تاریخ تولد</label>
              <JalaliPicker value={formData.birth_date} onChange={(v) => setFormData({ ...formData, birth_date: v })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">وضعیت تأهل</label>
              <select 
                value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as 'single' | 'married' | 'divorced' })}
                className="w-full px-3 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-sm dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="single">مجرد</option>
                <option value="married">متأهل</option>
                <option value="divorced">مطلقه</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">تعداد فرزند</label>
              <input 
                type="number" 
                min={0} 
                max={15} 
                value={formData.children_count ?? 0}
                onChange={(e) => setFormData({ ...formData, children_count: parseInt(e.target.value || '0', 10) })}
                className="w-full px-3 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-sm font-mono text-center dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40" 
              />
            </div>
          </div>

          {/* سابقه بیمه و حقوق */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">شروع سابقه بیمه</label>
              <JalaliPicker value={formData.insurance_start_date} onChange={(v) => setFormData({ ...formData, insurance_start_date: v })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">حقوق (میلیون ریال)</label>
              <GlassInput
                dir="ltr"
                inputMode="numeric"
                placeholder="مثلاً 250"
                value={formData.last_salary_million_rial as string}
                onChange={(e) => setFormData({ ...formData, last_salary_million_rial: formatSalary(e.target.value) })}
                className="text-center font-mono"
              />
            </div>
          </div>

          {/* نام شرکت و حوزه فعالیت */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">نام شرکت / محل کار</label>
              <GlassInput
                placeholder="نام سازمان یا شرکت..."
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">حوزه فعالیت</label>
              <select 
                value={isOtherIndustry ? 'سایر' : (formData.industry_field || '')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'سایر') {
                    setIsOtherIndustry(true);
                  } else {
                    setIsOtherIndustry(false);
                    setFormData({ ...formData, industry_field: val });
                  }
                }}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">انتخاب کنید...</option>
                {INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {isOtherIndustry && (
              <GlassInput
                placeholder="عنوان حوزه فعالیت را بنویسید..." 
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
              />
            )}
          </div>

          {/* دکمه ذخیره مشخصات */}
          <button 
            disabled={saveLoading} 
            onClick={handleSaveProfile}
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saveLoading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saveLoading ? 'در حال ذخیره‌سازی...' : 'ذخیره مشخصات'}</span>
          </button>

          {/* دکمه خروج از حساب کاربری */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('آیا قصد خروج از حساب کاربری را دارید؟')) {
                localStorage.removeItem('dadkar_token');
                localStorage.removeItem('dadkar_user');
                onLoginSuccess(null as any, null as any);
                setShowProfileModal(false);
              }
            }}
            className="w-full mt-2 py-2.5 bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-xs font-semibold hover:bg-rose-100/80 dark:hover:bg-rose-900/40 transition flex items-center justify-center gap-2"
          >
            <span>خروج از حساب کاربری</span>
          </button>

          {saveMsg && (
            <p className="mt-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 py-2.5 rounded-2xl">
              {saveMsg}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};
