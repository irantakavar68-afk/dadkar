import React, { useState, useEffect, useRef } from 'react';
import { 
  User, KeyRound, CheckCircle, Save, X, Copy, Calendar, 
  Lock, LogIn, Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck
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
      {/* کلاه ایمنی مهندسی */}
      <path d="M28 36 C28 22 40 18 50 18 C60 18 72 22 72 36 C75 36 76 39 74 41 C70 42 30 42 26 41 C24 39 25 36 28 36 Z" fill="#F59E0B" />
      <rect x="47" y="16" width="6" height="10" rx="3" fill="#D97706" />
      <path d="M24 84 C24 66 36 60 50 60 C64 60 76 66 76 84 Z" fill="#D97706" />
      <rect x="42" y="60" width="16" height="24" fill="#1E293B" />
    </svg>
  )},
  { id: '3', title: 'کارشناس خانم ۱', svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#FCE7F3" />
      {/* مقنعه اداری */}
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
      {/* عینک */}
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
      {/* هدفون */}
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
      {/* گوشی پزشکی */}
      <path d="M42 60 C42 70 58 70 58 60" fill="none" stroke="#E2E8F0" strokeWidth="3" />
      <circle cx="50" cy="72" r="4" fill="#94A3B8" />
    </svg>
  )}
];

// لیست جامع و بیش از ۸۰ حوزه فعالیت
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

// ---------- تبدیل تاریخ شمسی ----------
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

// تقویم ارتقا یافته شمسی با انتخابگر سال (۱۳۲۰ تا جاری) و انتخابگر نام ماه‌ها
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
  const offset = new Date(firstG[0], firstG[1] - 1, firstG[2]).getDay(); // 0=یکشنبه -> 6=شنبه

  return (
    <div className="relative w-full">
      <div 
        onClick={() => { setOpen(!open); setViewMode('days'); }}
        className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono dark:text-white text-center cursor-pointer border border-transparent hover:border-blue-400 transition flex items-center justify-between"
      >
        <Calendar size={18} className="text-blue-500" />
        <span className="font-bold tracking-wider">{value || placeholder}</span>
        <div className="w-4" />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 p-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 right-0">
          {/* هدر تقویم */}
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

          {/* نمای انتخاب سال */}
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

          {/* نمای انتخاب ماه */}
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

          {/* نمای پیش‌فرض روزهای ماه */}
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

// سنجش میزان قدرت رمز عبور
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
  company_name: '', 
  industry_field: '', 
  password: ''
};

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
  
  // نگهداری توکن موقت کاربر در جریان احراز هویت اولیه
  const [sessionToken, setSessionToken] = useState<string>(token || '');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success'>('error');
  
  const [formData, setFormData] = useState<UserProfile>(user || emptyForm);
  const [customIndustry, setCustomIndustry] = useState('');
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
    // --- تایمر ۹۰ ثانیه‌ای ارسال مجدد OTP ---
  const [resendTimer, setResendTimer] = useState<number>(90);

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

  // بررسی نام کاربری
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

  // استعلام یونیک بودن نام کاربری به محض تایپ
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
        // بررسی دقیق فیلد available که از بک‌اند برمی‌گردد
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

  // ---- ورود با رمز عبور ----
  const handleLoginPassword = async () => {
    if (!identity || !password) { setMsgType('error'); setMsg('نام کاربری و رمز عبور را وارد کنید.'); return; }
    setLoading(true); setMsg('');
    try {
      const data = await post('login_password', { username: identity, password });
      if (data.status === 'success') {
        localStorage.setItem('dadkar_token', data.token);
        localStorage.setItem('dadkar_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else { setMsgType('error'); setMsg(data.message || 'نام کاربری یا رمز نادرست است.'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- ارسال پیامک OTP ----
  const handleSendOtp = async (isForgot = false, channel: 'sms' | 'voice' = 'sms') => {
    setLoading(true);
    setMsg('');
    try {
      const actionName = channel === 'voice' 
        ? 'send_voice_otp' 
        : (isForgot ? 'forgot_password' : 'send_otp');

      const data = await post(actionName, { mobile, is_forgot: isForgot });
      
      if (data.status === 'success') {
        setResendTimer(90); // هماهنگ با تایمر کامپوننت
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





  // ---- بررسی کد تایید ----
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      setMsgType('error');
      setMsg('لطفاً کد تایید ۴ رقمی را کامل وارد کنید.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const data = await post('verify_otp', { mobile: formData.mobile || mobile, code: otpCode });
      
      if (data.status === 'success') {
        const tokenVal = data.extra?.token || data.token || '';
        setSessionToken(tokenVal);
        localStorage.setItem('dadkar_token', tokenVal);
        
        if (data.is_registered) {
          const fullUser = data.extra?.user || data.user || {};
          localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
          onLoginSuccess(fullUser, tokenVal);
          setMsg('با موفقیت وارد شدید!');
          setMsgType('success');
          setTimeout(() => setShowProfileModal(false), 1000);
        } else {
          setStep('register');
          setMsg('کد تأیید شد. لطفاً اطلاعات پروفایل را تکمیل کنید.');
          setMsgType('success');
        }
      } else {
        setMsgType('error');
        setMsg(data.message || 'کد تأیید نامعتبر است.');
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setMsgType('error');
      setMsg('خطای ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };



  // ---- تکمیل ثبت‌نام اولیه ----
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
      const activeToken = sessionToken || localStorage.getItem('dadkar_token');
      const finalIndustry = isOtherIndustry ? customIndustry : formData.industry_field;

      const payload = {
        ...formData,
        industry_field: finalIndustry,
        token: activeToken
      };

      const data = await post('save_profile', payload);

      if (data.status === 'success') {
        const fullUser = data.user || data.extra?.user || { ...formData, mobile, username, industry_field: finalIndustry };
        localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
        
        // اصلاح نام متغیر توکن (جایگزین tokenToUse مجهول)
        const finalToken = data.extra?.token || data.token || activeToken || '';
        localStorage.setItem('dadkar_token', finalToken);

        onLoginSuccess(fullUser, finalToken);
        setMsg('عضویت شما با موفقیت تکمیل شد. خوش آمدید!');
        setMsgType('success');
        
        setTimeout(() => {
          setShowProfileModal(false);
        }, 1000);
      } else { 
        setMsgType('error'); 
        setMsg(data.message || 'خطا در ثبت اطلاعات عضویت'); 
      }
    } catch (err) { 
      console.error('Save Profile Error:', err); // برای مشاهده خطای دقیق در کنسول فشرده F12
      setMsgType('error'); 
      setMsg('خطای ارتباط با سرور'); 
    } finally {
      setLoading(false);
    }
  }; // <--- این آکولاد و نقطه ویرگول پایانی handleRegister گم شده است




  // ---- بازیابی رمز عبور ----
  const handleResetPassword = async () => {
    if (otpCode.length < 4 || password.length < 6) { 
      setMsgType('error'); setMsg('کد و رمز جدید (حداقل ۶ کاراکتر) را وارد کنید.'); return; 
    }
    setLoading(true); setMsg('');
    try {
      const data = await post('reset_password', { 
        mobile, 
        code: otpCode, 
        new_password: password 
      });
      if (data.status === 'success') {
        setMsgType('success'); setMsg('رمز با موفقیت تغییر کرد. در حال انتقال به ورود...');
        setTimeout(() => { setStep('login'); setMsg(''); }, 1500);
      } else { setMsgType('error'); setMsg(data.message || 'خطا در بازیابی'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- ویرایش پروفایل از درون برنامه ----
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

  const Msg = () => msg ? (
    <div className={`mt-3 p-2.5 text-xs text-center rounded-xl flex items-center justify-center gap-1.5 ${msgType === 'success'
      ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
      : 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800'}`}>
      {msgType === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{msg}</span>
    </div>
  ) : null;

  // ================= مودال احراز هویت (بدون توکن فعال) =================
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl text-right my-auto max-h-[94vh] overflow-y-auto">
          
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <KeyRound size={30} />
            </div>
          </div>

          {/* ۱. صفحه ورود با نام کاربری / رمز */}
          {step === 'login' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">ورود به دادکار</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-5">نام کاربری (یا شماره موبایل) و رمز عبور خود را وارد کنید.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام کاربری یا موبایل</label>
                  <input dir="ltr" placeholder="09xxxxxxxxx یا username" value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center font-mono dark:text-white border border-transparent focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">رمز عبور</label>
                  <input dir="ltr" type="password" placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center dark:text-white border border-transparent focus:border-blue-500 focus:outline-none" />
                </div>
                <button disabled={loading} onClick={handleLoginPassword}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition">
                  <LogIn size={18} />{loading ? 'در حال ورود...' : 'ورود به حساب کاربری'}
                </button>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800 mt-3">
                  <button onClick={() => { setStep('forgot'); setMsg(''); }} className="text-blue-500 hover:underline">بازیابی رمز عبور</button>
                  <button onClick={() => { setStep('mobile'); setMsg(''); setMobile(''); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">ثبت‌نام جدید در سامانه</button>
                </div>
              </div>
              <Msg />
            </>
          )}

          {/* ۲. ثبت‌نام: مرحله دریافت موبایل */}
        {step === 'mobile' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">عضویت جدید</h3>
              <p className="text-xs text-slate-500 mt-1">شماره موبایل خود را وارد کنید تا کد تأیید پیامک شود.</p>
            </div>
            <div>
              <input
                type="tel"
                dir="ltr"
                maxLength={11}
                placeholder="09xxxxxxxxx"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-lg tracking-widest font-mono py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              disabled={loading}
              onClick={() => handleSendOtp(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/25"
            >
              {loading ? 'در حال بررسی و ارسال پیامک...' : 'ارسال کد تأیید پیامکی'}
            </button>
            <div className="flex items-center justify-between text-xs pt-2">
              <button onClick={() => { setStep('login'); setMsg(''); }} className="text-slate-500 hover:text-blue-600 transition">
                ورود با نام کاربری و رمز
              </button>
              <button onClick={() => { setStep('forgot'); setMsg(''); }} className="text-amber-600 hover:underline">
                بازیابی رمز عبور
              </button>
            </div>
            <Msg />
          </div>
        )}


              {/* ۳. ثبت‌نام: ورود کد تأیید */}
          {step === 'code' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">کد تأیید هویت</h2>
              <p className="text-xs text-center text-slate-500 mb-4">کد ۵ رقمی ارسال‌شده به شماره {mobile} را وارد کنید:</p>
              <input dir="ltr" inputMode="numeric" maxLength={6} placeholder="• • • • •" value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-2xl font-mono tracking-widest dark:text-white mb-4 border border-blue-400 focus:outline-none" />
              <button disabled={loading} onClick={handleVerifyOtp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-colors">
                <CheckCircle size={18} />{loading ? 'در حال احراز هویت...' : 'تأیید و ادامه'}
              </button>

              <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setStep('mobile')} className="text-slate-400 hover:underline">
                  ویرایش شماره موبایل
                </button>

                {resendTimer > 0 ? (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    ارسال مجدد ({formatTimer(resendTimer)})
                  </span>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={() => handleSendOtp(false, 'sms')}
                      className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 disabled:opacity-50"
                    >
                      {otpCountdown > 0 ? `ارسال مجدد (${Math.floor(otpCountdown / 60)}:${(otpCountdown % 60).toString().padStart(2, '0')})` : 'ارسال مجدد پیامک'}
                    </button>
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={() => handleSendOtp(false, 'voice')}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs disabled:opacity-50"
                    >
                      📞 تماس صوتی
                    </button>
                  </div>

                )}
              </div>
              <Msg />
            </>
          )}


          {/* ۴. فرم جامع عضویت دادکار (کاربر جدید) */}
          {step === 'register' && (
            <div className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">تکمیل فرم عضویت دادکار</h2>
                <p className="text-[11px] text-slate-500">لطفاً مشخصات هویتی و پرسنلی خود را با دقت تکمیل کنید.</p>
              </div>

              {/* ۱. انتخاب آواتار پرسنلی وکتور */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">انتخاب تصویر نمایه (آواتار)</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {AVATAR_SVGS.map((av) => {
                    const isSelected = (formData.avatar_id ?? '0') === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar_id: av.id })}
                        className={`relative rounded-xl p-1 transition transform active:scale-95 ${
                          isSelected 
                            ? 'ring-2 ring-blue-600 bg-blue-100/50 dark:bg-blue-900/40 scale-105 shadow' 
                            : 'hover:bg-white dark:hover:bg-slate-700 opacity-75 hover:opacity-100'
                        }`}
                        title={av.title}
                      >
                        <div className="w-10 h-10 mx-auto">
                          {av.svg}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* نام و نام خانوادگی */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام</label>
                  <input placeholder="مثال: علی" value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام خانوادگی</label>
                  <input placeholder="مثال: محمدی" value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
                </div>
              </div>

              {/* نام کاربری (با استعلام یونیک بودن بلادرنگ) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">نام کاربری اختصاصی</label>
                  {usernameMsg && (
                    <span className={`text-[10px] ${
                      usernameStatus === 'available' ? 'text-emerald-500 font-bold' : 
                      usernameStatus === 'taken' ? 'text-rose-500 font-bold' : 'text-slate-400'
                    }`}>
                      {usernameMsg}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    dir="ltr" 
                    placeholder="یک نام کاربری انگلیسی (مانند ali_mohammadi)" 
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-left dark:text-white border ${
                      usernameStatus === 'available' ? 'border-emerald-500' :
                      usernameStatus === 'taken' ? 'border-rose-500' : 'border-transparent'
                    }`} 
                  />
                  <div className="absolute right-3 top-2.5">
                    {usernameStatus === 'checking' && <RefreshCw size={16} className="animate-spin text-blue-500" />}
                    {usernameStatus === 'available' && <CheckCircle size={16} className="text-emerald-500" />}
                    {usernameStatus === 'taken' && <AlertCircle size={16} className="text-rose-500" />}
                  </div>
                </div>
              </div>

              {/* سطر رمز عبور */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">رمز عبور</label>
                  {pwdStrength.text && (
                    <span className="text-[10px] font-bold text-slate-500">
                      قدرت: <span className={pwdStrength.score === 3 ? 'text-emerald-500' : pwdStrength.score === 2 ? 'text-amber-500' : 'text-rose-500'}>{pwdStrength.text}</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    dir="ltr" 
                    type={showPwd ? 'text' : 'password'} 
                    placeholder="حداقل ۶ کاراکتر" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-left dark:text-white" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)} 
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* نوار قدرت‌سنجی رمز */}
                {formData.password && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${pwdStrength.color} transition-all duration-300`} 
                      style={{ width: pwdStrength.score === 1 ? '30%' : pwdStrength.score === 2 ? '65%' : '100%' }}
                    />
                  </div>
                )}
              </div>

              {/* سطر تکرار رمز عبور */}
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">تکرار رمز عبور</label>
                <div className="relative">
                  <input
                    dir="ltr"
                    type={showConfirmPwd ? 'text' : 'password'}
                    placeholder="تکرار رمز عبور فوق"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-left dark:text-white border ${
                      confirmPassword && confirmPassword !== formData.password
                        ? 'border-rose-500'
                        : 'border-transparent focus:border-cyan-500'
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== formData.password && (
                  <span className="text-[11px] text-rose-500 mt-1 block">رمز عبور و تکرار آن همخوانی ندارند.</span>
                )}
              </div>



              {/* تاریخ تولد، وضعیت تأهل و تعداد فرزند */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ تولد</label>
                  <JalaliPicker value={formData.birth_date} onChange={(v) => setFormData({ ...formData, birth_date: v })} />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">وضعیت تأهل</label>
                  <select 
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as 'single' | 'married' | 'divorced' })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white"
                  >
                    <option value="single">مجرد</option>
                    <option value="married">متأهل</option>
                    <option value="divorced">مطلقه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">تعداد فرزندان</label>
                  <select
                    value={formData.children_count}
                    onChange={(e) => setFormData({ ...formData, children_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white border border-transparent focus:border-cyan-500 focus:outline-none"
                  >
                    <option value={0}>۰ (بدون فرزند)</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} فرزند
                      </option>
                    ))}
                  </select>
                </div>


              </div>

              {/* تاریخ شروع بیمه و حقوق */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ شروع بیمه</label>
                  <JalaliPicker value={formData.insurance_start_date} onChange={(v) => setFormData({ ...formData, insurance_start_date: v })} />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">آخرین حقوق (میلیون ریال)</label>
                  <input dir="ltr" inputMode="numeric" placeholder="مثلاً 250" value={formData.last_salary_million_rial as string}
                    onChange={(e) => setFormData({ ...formData, last_salary_million_rial: formatSalary(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-center dark:text-white" />
                </div>
              </div>

              {/* محل کار و حوزه فعالیت (با قابلیت سایر) */}
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام شرکت / کارگاه / محل خدمت</label>
                  <input placeholder="مثال: شرکت صنایع فولاد..." value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">حوزه فعالیت تخصصی</label>
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
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white"
                  >
                    <option value="">انتخاب از بین بیش از ۸۰ حوزه تخصصی...</option>
                    {INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                {/* فیلد تایپی اختصاصی در صورت انتخاب سایر */}
                {isOtherIndustry && (
                  <div>
                    <input 
                      placeholder="عنوان حوزه فعالیت خود را بنویسید..." 
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-sm dark:text-white" 
                    />
                  </div>
                )}
              </div>

              <button disabled={loading} onClick={handleRegister}
                className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition">
                <Save size={18} />{loading ? 'در حال ثبت اطلاعات...' : 'تکمیل عضویت و ورود به سامانه'}
              </button>

              <Msg />
            </div>
          )}

          {/* ۵. بازیابی رمز: ارسال کد */}
          {step === 'forgot' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">بازیابی رمز عبور</h2>
              <p className="text-xs text-center text-slate-500 mb-4">شماره موبایل یا نام کاربری ثبت‌شده خود را وارد کنید.</p>
              <input type="tel" dir="ltr" placeholder="09xxxxxxxxx یا username" value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center font-mono dark:text-white mb-4" />
              <button disabled={loading} onClick={() => handleSendOtp(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25">
                {loading ? 'در حال ارسال...' : 'ارسال کد بازیابی پیامکی'}
              </button>
              <button onClick={() => setStep('login')} className="w-full text-center text-xs text-blue-500 hover:underline mt-3">بازگشت به صفحه ورود</button>
              <Msg />
            </>
          )}

          {/* ۶. تعیین رمز جدید با کد بازیابی */}
          {step === 'reset' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">تعیین رمز عبور جدید</h2>
              <p className="text-xs text-center text-slate-500 mb-4">کد بازیابی ۵ رقمی و رمز جدید را وارد کنید:</p>
              <input dir="ltr" inputMode="numeric" maxLength={6} placeholder="کد بازیابی" value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center font-mono text-xl dark:text-white mb-2" />
              <input dir="ltr" type="password" placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center dark:text-white mb-4" />
              <button disabled={loading} onClick={handleResetPassword}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/25">
                {loading ? 'در حال اعمال...' : 'تغییر رمز عبور و ورود'}
              </button>
              <Msg />
            </>
          )}
        </div>
      </div>
    );
  }

  // ================= مودال ویرایش پروفایل (کاربر لاگین‌شده) =================
  if (!showProfileModal) return null;

  const selectedAvatarObj = AVATAR_SVGS.find(a => a.id === (formData.avatar_id ?? user?.avatar_id ?? '0')) || AVATAR_SVGS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
        
        {/* هدر */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><User size={20} /></div>
            <h3 className="font-bold text-slate-900 dark:text-white">مشخصات کاربری و پرسنلی</h3>
          </div>
          <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* کارت شناسه اختصاصی و آواتار فعال */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl flex items-center justify-between border border-blue-100 dark:border-blue-900/40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-inner bg-white dark:bg-slate-800 p-0.5 border border-blue-200 dark:border-blue-800">
              {selectedAvatarObj.svg}
            </div>
            <div>
              <span className="text-[11px] block text-blue-600 dark:text-blue-400 font-medium">شناسه اختصاصی دادکار:</span>
              <span className="text-base font-bold font-mono text-slate-800 dark:text-white tracking-wider">
                {formData.user_code || user?.user_code || 'DK-USER'}
              </span>
            </div>
          </div>
          <button onClick={() => navigator.clipboard.writeText(formData.user_code || user?.user_code || '')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 shadow-sm transition" title="کپی شناسه">
            <Copy size={16} />
          </button>
        </div>

        <div className="space-y-3.5 text-right">
          {/* آواتارهای وکتور */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">تغییر آواتار</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              {AVATAR_SVGS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar_id: av.id })}
                  className={`p-1 rounded-xl transition ${
                    (formData.avatar_id ?? '0') === av.id 
                      ? 'ring-2 ring-blue-600 bg-blue-100/60 dark:bg-blue-900/40 scale-105' 
                      : 'hover:bg-white dark:hover:bg-slate-700 opacity-70 hover:opacity-100'
                  }`}
                  title={av.title}
                >
                  <div className="w-9 h-9 mx-auto">{av.svg}</div>
                </button>
              ))}
            </div>
          </div>

          {/* نام و نام خانوادگی */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام</label>
              <input type="text" value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام خانوادگی</label>
              <input type="text" value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
            </div>
          </div>

          {/* تاریخ تولد، وضعیت تأهل و تعداد فرزند */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ تولد</label>
              <JalaliPicker value={formData.birth_date} onChange={(v) => setFormData({ ...formData, birth_date: v })} />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">وضعیت تأهل</label>
              <select value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as 'single' | 'married' | 'divorced' })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white">
                <option value="single">مجرد</option>
                <option value="married">متأهل</option>
                <option value="divorced">مطلقه</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تعداد فرزند</label>
              <input 
                type="number" 
                min={0} 
                max={15} 
                value={formData.children_count ?? 0}
                onChange={(e) => setFormData({ ...formData, children_count: parseInt(e.target.value || '0', 10) })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-center dark:text-white" 
              />
            </div>
          </div>

          {/* سابقه بیمه و آخرین حقوق */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">شروع سابقه بیمه</label>
              <JalaliPicker value={formData.insurance_start_date} onChange={(v) => setFormData({ ...formData, insurance_start_date: v })} />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">حقوق (میلیون ریال)</label>
              <input dir="ltr" inputMode="numeric" placeholder="مثلاً 250" value={formData.last_salary_million_rial as string}
                onChange={(e) => setFormData({ ...formData, last_salary_million_rial: formatSalary(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-center dark:text-white" />
            </div>
          </div>

          {/* نام شرکت و حوزه فعالیت */}
          <div className="space-y-2">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام شرکت / محل کار</label>
              <input type="text" value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">حوزه فعالیت</label>
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white"
              >
                <option value="">انتخاب کنید</option>
                {INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {isOtherIndustry && (
              <input 
                placeholder="عنوان حوزه فعالیت را بنویسید..." 
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-sm dark:text-white" 
              />
            )}
          </div>


        {/* دکمه ذخیره مشخصات */}
        <button disabled={saveLoading} onClick={handleSaveProfile}
          className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition">
          <Save size={18} />{saveLoading ? 'در حال ذخیره‌سازی...' : 'ذخیره مشخصات'}
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
          className="w-full mt-2 py-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/40 transition flex items-center justify-center gap-2"
        >
          <span>خروج از حساب کاربری</span>
        </button>

        {saveMsg && (
          <p className="mt-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {saveMsg}
          </p>
        )}


          
          {saveMsg && (
            <p className="text-xs text-center mt-2 text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/30 py-2 rounded-xl">
              {saveMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
