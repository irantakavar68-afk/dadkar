import React, { useState, useEffect, useRef } from 'react';
import { 
  User, KeyRound, CheckCircle, Save, X, Copy, Calendar, Lock, 
  LogIn, Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck, LogOut,
  Phone, Building2, MapPin, Sparkles, Briefcase, Users, DollarSign, FileText
} from 'lucide-react';

const API_URL = "https://daadkaar.ir/api/auth.php";

export const AVATAR_SVGS: Record<string, string> = {
  '0': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  '1': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>`,
  '2': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 14 0v2"/></svg>`,
  '3': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/></svg>`,
  '4': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  '5': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/><path d="M12 14v7"/></svg>`,
  '6': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  '7': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`
};

const INDUSTRIES = [
  "نفت، گاز، پالایش و پتروشیمی",
  "فولاد، صنایع معدنی و فلزات",
  "خودروسازی، ساخت قطعات و صنایع وابسته",
  "تجهیزات پزشکی، دارویی و سلامت",
  "فناوری اطلاعات، ارتباطات و نرم‌افزار",
  "بانکداری، بیمه و خدمات مالی",
  "آموزش، پژوهش و مشاوره",
  "خدمات مهندسی، مشاوره و پیمانکاری",
  "انرژی، برق و تجهیزات وابسته",
  "مخابرات و ارتباطات راه دور",
  "صنایع غذایی و آشامیدنی",
  "کشاورزی، دامداری و صنایع وابسته",
  "نساجی، پوشاک و چرم",
  "لجستیک، حمل و نقل و ترابر",
  "ساختمان، عمران و انبوه‌سازی",
  "معماری، دکوراسیون و شهرسازی",
  "بازرگانی، واردات و صادرات",
  "خرده‌فروشی و فروشگاه‌های زنجیره‌ای",
  "جهانگردی، هتلداری و گردشگری",
  "رسانه، تبلیغات و روابط عمومی",
  "خدمات حقوقی، وکالت و داوری",
  "حسابرسی، حسابداری و امور مالیاتی",
  "بسته‌بندی، چاپ و انتشارات",
  "ص صنایع شیمیایی و پلیمر",
  "صنایع چوب، کاغذ و مبلمان",
  "صنایع برق، الکترونیک و مخابرات",
  "هوافضا، صنایع هوایی و دفاعی",
  "آب، فاضلاب و تاسیسات شهری",
  "مدیریت پسماند و بازیافت",
  "سایر صنایع و خدمات"
];

const J_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

function div(a: number, b: number) {
  return Math.floor(a / b);
}

function g2j(gy: number, gm: number, gd: number) {
  let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 3599;
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + (div(gy2 + 3, 4)) - (div(gy2 + 99, 100)) + (div(gy2 + 399, 400)) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * (div(days, 12053));
  days %= 12053;
  jy += 4 * (div(days, 1461));
  days %= 1461;
  jy += div(days - 1, 365);
  if (days > 0) days = (days - 1) % 365;
  let jm = (days < 186) ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return [jy, jm, jd];
}

function j2g(jy: number, jm: number, jd: number) {
  let gy = (jy <= 979) ? 621 : 3599;
  jy -= (jy <= 979) ? 0 : 979;
  let days = (365 * jy) + (div(jy, 33) * 8) + (div((jy % 33) + 3, 4)) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy += 400 * (div(days, 146097));
  days %= 146097;
  if (days > 36524) {
    gy += 100 * (div(--days, 36524));
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * (div(days, 1461));
  days %= 1461;
  if (days > 365) {
    gy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13; gm++) {
    let v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return [gy, gm, gd];
}

function jalaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  let kabise = ((((((jy - 474) % 2838) + 474) + 38) * 682) % 2816) < 682;
  return kabise ? 30 : 29;
}

// کامپوننت انتخابگر تاریخ شمسی
function JalaliPicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const todayG = new Date();
  const [jyToday, jmToday, jdToday] = g2j(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());

  let initY = jyToday;
  let initM = jmToday;
  let initD = jdToday;

  if (value && /^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
    const parts = value.split('/').map(Number);
    initY = parts[0];
    initM = parts[1];
    initD = parts[2];
  }

  const [year, setYear] = useState(initY);
  const [month, setMonth] = useState(initM);
  const [day, setDay] = useState(initD);
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthLength = jalaliMonthLength(year, month);
  const firstDayOfWeek = 6; 

  const selectDay = (d: number) => {
    setDay(d);
    const mm = String(month).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    onChange(`${year}/${mm}/${dd}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white flex items-center justify-between cursor-pointer focus:border-emerald-500"
      >
        <span>{value || 'انتخاب تاریخ (مثال: 1370/01/01)'}</span>
        <Calendar size={14} className="text-emerald-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl p-3 w-64 text-white select-none">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <button 
              type="button" 
              onClick={() => {
                if (view === 'days') setMonth(m => m > 1 ? m - 1 : 12);
                if (view === 'years') setYear(y => y - 12);
              }}
              className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded"
            >
              قبلی
            </button>
            <div className="flex gap-1 text-xs font-bold">
              <span className="cursor-pointer hover:text-emerald-400" onClick={() => setView('years')}>
                {year}
              </span>
              <span>/</span>
              <span className="cursor-pointer hover:text-emerald-400" onClick={() => setView('months')}>
                {J_MONTHS[month - 1]}
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                if (view === 'days') setMonth(m => m < 12 ? m + 1 : 1);
                if (view === 'years') setYear(y => y + 12);
              }}
              className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded"
            >
              بعدی
            </button>
          </div>

          {view === 'days' && (
            <div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-1">
                <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: monthLength }).map((_, i) => {
                  const dNum = i + 1;
                  const isSelected = dNum === day;
                  return (
                    <button
                      key={dNum}
                      type="button"
                      onClick={() => selectDay(dNum)}
                      className={`h-7 rounded flex items-center justify-center transition ${isSelected ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-200'}`}
                    >
                      {dNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'months' && (
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              {J_MONTHS.map((mName, idx) => {
                const mNum = idx + 1;
                const isSelected = mNum === month;
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => { setMonth(mNum); setView('days'); }}
                    className={`py-2 rounded transition ${isSelected ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>
          )}

          {view === 'years' && (
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs max-h-48 overflow-y-auto">
              {Array.from({ length: 90 }).map((_, i) => {
                const yNum = jyToday - 70 + i;
                const isSelected = yNum === year;
                return (
                  <button
                    key={yNum}
                    type="button"
                    onClick={() => { setYear(yNum); setView('months'); }}
                    className={`py-2 rounded transition ${isSelected ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                  >
                    {yNum}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[11px]">
            <button 
              type="button" 
              onClick={() => { setYear(jyToday); setMonth(jmToday); setDay(jdToday); selectDay(jdToday); }}
              className="text-emerald-400 hover:underline"
            >
              امروز
            </button>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatSalary(val: string) {
  if (!val) return '';
  const num = val.replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calculatePasswordStrength(pass: string) {
  if (!pass) return { score: 0, text: '', color: 'bg-slate-700' };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { score, text: 'ضعیف', color: 'bg-red-500' };
  if (score === 2 || score === 3) return { score, text: 'متوسط', color: 'bg-amber-500' };
  return { score, text: 'بسیار قوی', color: 'bg-emerald-500' };
}

export interface UserProfile {
  user_code?: string;
  mobile?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  personnelCode?: string;
  industry?: string;
  organization?: string;
  city?: string;
  role?: string;
  birthDate?: string;
  maritalStatus?: string;
  childrenCount?: string;
  insuranceStartDate?: string;
  lastSalary?: string;
  avatar?: string;
  password?: string;
}

interface AuthProfileModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile | null, token: string) => void;
  initialStep?: 'login' | 'mobile' | 'code' | 'register' | 'forgot' | 'reset';
  showProfileModal?: boolean;
  setShowProfileModal?: (show: boolean) => void;
  currentUser?: UserProfile | null;
}

export const AuthProfileModals: React.FC<AuthProfileModalsProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialStep = 'login',
  showProfileModal = false,
  setShowProfileModal = () => {},
  currentUser = null
}) => {
  const [step, setStep] = useState<'login' | 'mobile' | 'code' | 'register' | 'forgot' | 'reset'>(initialStep);
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    personnelCode: '',
    industry: '',
    organization: '',
    city: '',
    role: '',
    birthDate: '',
    maritalStatus: 'مجرد',
    childrenCount: '0',
    insuranceStartDate: '',
    lastSalary: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [sessionToken, setSessionToken] = useState('');
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // استیت‌های ویرایش پروفایل داخلی
  const [editFirstName, setEditFirstName] = useState(currentUser?.firstName || '');
  const [editLastName, setEditLastName] = useState(currentUser?.lastName || '');
  const [editOrganization, setEditOrganization] = useState(currentUser?.organization || '');
  const [editIndustry, setEditIndustry] = useState(currentUser?.industry || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editRole, setEditRole] = useState(currentUser?.role || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '0');
  const [editNationalId, setEditNationalId] = useState(currentUser?.nationalId || '');
  const [editPersonnelCode, setEditPersonnelCode] = useState(currentUser?.personnelCode || '');
  const [editBirthDate, setEditBirthDate] = useState(currentUser?.birthDate || '');
  const [editMaritalStatus, setEditMaritalStatus] = useState(currentUser?.maritalStatus || 'مجرد');
  const [editChildrenCount, setEditChildrenCount] = useState(currentUser?.childrenCount || '0');
  const [editInsuranceStartDate, setEditInsuranceStartDate] = useState(currentUser?.insuranceStartDate || '');
  const [editLastSalary, setEditLastSalary] = useState(currentUser?.lastSalary || '');
  const [isEditOtherIndustry, setIsEditOtherIndustry] = useState(false);
  const [editCustomIndustry, setEditCustomIndustry] = useState('');

  // تغییر رمز عبور داخل پروفایل
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (currentUser) {
      setEditFirstName(currentUser.firstName || '');
      setEditLastName(currentUser.lastName || '');
      setEditOrganization(currentUser.organization || '');
      setEditIndustry(currentUser.industry || '');
      setEditCity(currentUser.city || '');
      setEditRole(currentUser.role || '');
      setEditAvatar(currentUser.avatar || '0');
      setEditNationalId(currentUser.nationalId || '');
      setEditPersonnelCode(currentUser.personnelCode || '');
      setEditBirthDate(currentUser.birthDate || '');
      setEditMaritalStatus(currentUser.maritalStatus || 'مجرد');
      setEditChildrenCount(currentUser.childrenCount || '0');
      setEditInsuranceStartDate(currentUser.insuranceStartDate || '');
      setEditLastSalary(currentUser.lastSalary || '');
    }
  }, [currentUser]);

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const post = async (action: string, dataObj: any) => {
    try {
      const res = await fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObj)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      throw new Error('خطا در برقراری ارتباط با سرور');
    }
  };

  const handleLoginPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await post('login_password', { identity: username, password });
      if (data.success || data.status === 'success') {
        const tokenVal = data.token || data.extra?.token || 'token_' + Date.now();
        setSessionToken(tokenVal);
        localStorage.setItem('dadkar_token', tokenVal);
        const fullUser = data.user || { username };
        localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
        onLoginSuccess(fullUser, tokenVal);
        setSuccessMsg('ورود با موفقیت انجام شد.');
        setTimeout(() => onClose(), 1000);
      } else {
        setErrorMsg(data.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در شبکه.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (isForgot = false) => {
    const targetMobile = isForgot ? username : mobile;
    if (!targetMobile || targetMobile.length < 10) {
      setErrorMsg('لطفاً شماره موبایل معتبر وارد کنید.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const actionName = isForgot ? 'forgot_password' : 'send_otp';
      const data = await post(actionName, { mobile: targetMobile });
      if (data.success || data.status === 'success') {
        setSuccessMsg('کد تأیید با موفقیت ارسال شد.');
        setStep(isForgot ? 'reset' : 'code');
        setResendTimer(90);
      } else {
        setErrorMsg(data.message || 'خطا در ارسال کد تأیید.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در شبکه.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('لطفاً کد تأیید را وارد کنید.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const targetMobile = mobile || username;
      const data = await post('verify_otp', { mobile: targetMobile, code: otpCode });
      if (data.success || data.status === 'success') {
        const tokenVal = data.token || data.extra?.token || 'token_' + Date.now();
        setSessionToken(tokenVal);
        localStorage.setItem('dadkar_token', tokenVal);

        if (data.is_registered) {
          const fullUser = data.user || { mobile: targetMobile };
          localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
          onLoginSuccess(fullUser, tokenVal);
          setSuccessMsg('ورود با موفقیت انجام شد.');
          setTimeout(() => onClose(), 1000);
        } else {
          setMobile(targetMobile);
          setStep('register');
        }
      } else {
        setErrorMsg(data.message || 'کد تأیید نامعتبر است.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در شبکه.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      // اصلاح خطای مرجع و TDZ با جلوگیری از سایه انداختن نام متغیر روی خودِ استیت
      const currentAuthToken = sessionToken || localStorage.getItem('dadkar_token') || '';
      const finalIndustry = isOtherIndustry ? customIndustry : formData.industry;
      const payload = {
        mobile,
        token: currentAuthToken,
        ...formData,
        industry: finalIndustry
      };
      const data = await post('save_profile', payload);
      if (data.success || data.status === 'success') {
        const fullUser = data.user || payload;
        localStorage.setItem('dadkar_user', JSON.stringify(fullUser));
        onLoginSuccess(fullUser, currentAuthToken);
        setSuccessMsg('پروفایل با موفقیت ثبت شد.');
        setTimeout(() => {
          onClose();
          setStep('login');
        }, 1000);
      } else {
        setErrorMsg(data.message || 'خطا در ثبت اطلاعات.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در شبکه.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await post('reset_password', { mobile: username, code: otpCode, new_password: password });
      if (data.success || data.status === 'success') {
        setSuccessMsg('رمز عبور با موفقیت تغییر کرد.');
        setTimeout(() => setStep('login'), 1500);
      } else {
        setErrorMsg(data.message || 'خطا در تغییر رمز عبور.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در شبکه.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const currentAuthToken = sessionToken || localStorage.getItem('dadkar_token') || '';
      const finalInd = isEditOtherIndustry ? editCustomIndustry : editIndustry;
      const payload = {
        mobile: currentUser?.mobile,
        token: currentAuthToken,
        firstName: editFirstName,
        lastName: editLastName,
        organization: editOrganization,
        industry: finalInd,
        city: editCity,
        role: editRole,
        avatar: editAvatar,
        nationalId: editNationalId,
        personnelCode: editPersonnelCode,
        birthDate: editBirthDate,
        maritalStatus: editMaritalStatus,
        childrenCount: editChildrenCount,
        insuranceStartDate: editInsuranceStartDate,
        lastSalary: editLastSalary
      };
      const data = await post('save_profile', payload);
      if (data.success || data.status === 'success') {
        const updatedUser = data.user || payload;
        localStorage.setItem('dadkar_user', JSON.stringify(updatedUser));
        onLoginSuccess(updatedUser, currentAuthToken);
        setSuccessMsg('تغییرات پروفایل با موفقیت ذخیره شد.');
        setTimeout(() => setShowProfileModal(false), 1000);
      } else {
        setErrorMsg(data.message || 'خطا در ذخیره پروفایل.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در شبکه.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordInside = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMsg({ text: 'رمز جدید و تکرار آن مطابقت ندارند.', type: 'error' });
      return;
    }
    try {
      const currentAuthToken = sessionToken || localStorage.getItem('dadkar_token') || '';
      const data = await post('change_password', {
        token: currentAuthToken,
        current_password: currentPassword,
        new_password: newPassword
      });
      if (data.success || data.status === 'success') {
        setPasswordChangeMsg({ text: 'رمز عبور با موفقیت تغییر کرد.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeMsg({ text: data.message || 'خطا در تغییر رمز عبور.', type: 'error' });
      }
    } catch (err: any) {
      setPasswordChangeMsg({ text: err.message || 'خطا در ارتباط با سرور.', type: 'error' });
    }
  };

  if (!isOpen && !showProfileModal) return null;

  return (
    <>
      {isOpen && !showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 font-['Vazirmatn']" dir="rtl">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white">
            <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-emerald-400">سامانه جامع دادکار</h2>
              <p className="text-xs text-slate-400 mt-1">
                {step === 'login' && 'ورود به حساب کاربری'}
                {step === 'mobile' && 'ورود با شماره موبایل'}
                {step === 'code' && 'وارد کردن کد تأیید پیامک شده'}
                {step === 'register' && 'تکمیل مشخصات حساب کاربری'}
                {step === 'forgot' && 'بازیابی رمز عبور'}
                {step === 'reset' && 'تعیین رمز عبور جدید'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {step === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleLoginPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">شناسه دادکار یا موبایل</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="DK-... یا 0912..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">رمز عبور</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-emerald-500"
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-3 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : 'ورود با رمز عبور'}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-xs">یا</span>
                  <div className="flex-grow border-t border-slate-700"></div>
                </div>

                <button onClick={() => setStep('mobile')} className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  <Phone size={16} /> ورود سریع با کد پیامکی (OTP)
                </button>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                  <button type="button" onClick={() => setStep('forgot')} className="hover:text-white underline">
                    رمز عبور خود را فراموش کرده‌ام؟
                  </button>
                </div>
              </div>
            )}

            {step === 'mobile' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">شماره تلفن همراه</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 text-slate-500" size={18} />
                    <input 
                      type="tel"
                      maxLength={11}
                      placeholder="09123456789"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : 'ارسال کد تأیید'}
                </button>
                <button type="button" onClick={() => setStep('login')} className="w-full text-center text-xs text-slate-400 hover:text-white pt-2">
                  بازگشت به روش‌های ورود
                </button>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">کد تأیید ارسال شده به {mobile}</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 text-slate-500" size={18} />
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="------"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-center tracking-widest text-lg text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : 'تأیید و ادامه'}
                </button>
                <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                  <button type="button" onClick={() => setStep('mobile')} className="hover:text-white underline">
                    ویرایش شماره
                  </button>
                  {resendTimer > 0 ? (
                    <span>ارسال مجدد ({resendTimer}s)</span>
                  ) : (
                    <button type="button" onClick={() => handleSendOtp(false)} className="text-emerald-400 hover:underline">
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
              </form>
            )}

            {step === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3 max-h-[70vh] overflow-y-auto px-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">نام *</label>
                    <input 
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">نام خانوادگی *</label>
                    <input 
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">کد ملی</label>
                    <input 
                      type="text"
                      maxLength={10}
                      value={formData.nationalId}
                      onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">کد پرسنلی</label>
                    <input 
                      type="text"
                      value={formData.personnelCode}
                      onChange={(e) => setFormData({...formData, personnelCode: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">تاریخ تولد</label>
                    <JalaliPicker 
                      value={formData.birthDate} 
                      onChange={(val) => setFormData({...formData, birthDate: val})} 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">وضعیت تأهل</label>
                    <select 
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="مجرد">مجرد</option>
                      <option value="متاهل">متاهل</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">تعداد فرزندان</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.childrenCount}
                      onChange={(e) => setFormData({...formData, childrenCount: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">تاریخ شروع بیمه</label>
                    <JalaliPicker 
                      value={formData.insuranceStartDate} 
                      onChange={(val) => setFormData({...formData, insuranceStartDate: val})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">آخرین حقوق (ریال)</label>
                    <input 
                      type="text"
                      value={formatSalary(formData.lastSalary)}
                      onChange={(e) => setFormData({...formData, lastSalary: e.target.value.replace(/,/g, '')})}
                      placeholder="مثال: 150,000,000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">شهر محل خدمت</label>
                    <input 
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">نام سازمان / شرکت</label>
                  <input 
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">صنایع فعالیت</label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => {
                      setFormData({...formData, industry: e.target.value});
                      setIsOtherIndustry(e.target.value === 'سایر صنایع و خدمات');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 max-h-32"
                  >
                    <option value="">انتخاب صنعت...</option>
                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>

                {isOtherIndustry && (
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">عنوان صنعت دلخواه</label>
                    <input 
                      type="text"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : 'تکمیل ثبت‌نام و ورود'}
                </button>
              </form>
            )}

            {step === 'forgot' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">شماره موبایل ثبت‌شده</label>
                  <input 
                    type="tel" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="0912..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required 
                  />
                </div>
                <button onClick={() => handleSendOtp(true)} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : 'ارسال کد بازیابی'}
                </button>
                <button type="button" onClick={() => setStep('login')} className="w-full text-center text-xs text-slate-400 hover:text-white pt-2">
                  بازگشت به ورود
                </button>
              </div>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">کد تأیید ارسال‌شده</label>
                  <input 
                    type="text" 
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value)} 
                    placeholder="------"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-center tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">رمز عبور جدید</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required 
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : 'تغییر رمز عبور'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 font-['Vazirmatn']" dir="rtl">
          <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 left-4 text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <User size={20} /> پروفایل کاربری و تنظیمات حساب
            </h2>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-6 text-xs">
              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">انتخاب آواتار پروفایل</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Object.entries(AVATAR_SVGS).map(([id, svgHtml]) => {
                    const isSelected = editAvatar === id;
                    return (
                      <div
                        key={id}
                        onClick={() => setEditAvatar(id)}
                        className={`p-2 rounded-xl cursor-pointer flex items-center justify-center border transition ${isSelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                        dangerouslySetInnerHTML={{ __html: svgHtml }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">نام</label>
                  <input 
                    type="text" 
                    value={editFirstName} 
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">نام خانوادگی</label>
                  <input 
                    type="text" 
                    value={editLastName} 
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">کد ملی</label>
                  <input 
                    type="text" 
                    value={editNationalId} 
                    onChange={(e) => setEditNationalId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">کد پرسنلی</label>
                  <input 
                    type="text" 
                    value={editPersonnelCode} 
                    onChange={(e) => setEditPersonnelCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">تاریخ تولد</label>
                  <JalaliPicker value={editBirthDate} onChange={setEditBirthDate} />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">وضعیت تأهل</label>
                  <select 
                    value={editMaritalStatus} 
                    onChange={(e) => setEditMaritalStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="مجرد">مجرد</option>
                    <option value="متاهل">متاهل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">تعداد فرزندان</label>
                  <input 
                    type="number" 
                    value={editChildrenCount} 
                    onChange={(e) => setEditChildrenCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">تاریخ شروع بیمه</label>
                  <JalaliPicker value={editInsuranceStartDate} onChange={setEditInsuranceStartDate} />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">آخرین حقوق (ریال)</label>
                  <input 
                    type="text" 
                    value={formatSalary(editLastSalary)} 
                    onChange={(e) => setEditLastSalary(e.target.value.replace(/,/g, ''))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">شهر محل خدمت</label>
                  <input 
                    type="text" 
                    value={editCity} 
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">سازمان / شرکت</label>
                <input 
                  type="text" 
                  value={editOrganization} 
                  onChange={(e) => setEditOrganization(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">صنایع فعالیت</label>
                <select 
                  value={editIndustry} 
                  onChange={(e) => {
                    setEditIndustry(e.target.value);
                    setIsEditOtherIndustry(e.target.value === 'سایر صنایع و خدمات');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">انتخاب صنعت...</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>

              {isEditOtherIndustry && (
                <div>
                  <label className="block text-slate-300 mb-1">عنوان صنعت دلخواه</label>
                  <input 
                    type="text" 
                    value={editCustomIndustry} 
                    onChange={(e) => setEditCustomIndustry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                  />
                </div>
              )}

              <div className="pt-2">
                <button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={16} /> ذخیره تغییرات پروفایل</>}
                </button>
              </div>

              <div className="border-t border-slate-800 pt-4 mt-4">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                  <KeyRound size={16} /> تغییر رمز عبور حساب
                </h3>
                <form onSubmit={handleChangePasswordInside} className="space-y-3">
                  {passwordChangeMsg.text && (
                    <div className={`p-2.5 rounded-xl text-xs ${passwordChangeMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                      {passwordChangeMsg.text}
                    </div>
                  )}
                  <div>
                    <label className="block text-slate-300 mb-1">رمز عبور فعلی</label>
                    <input 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">رمز عبور جدید</label>
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">تکرار رمز عبور جدید</label>
                      <input 
                        type="password" 
                        value={confirmNewPassword} 
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-medium py-2 rounded-xl transition">
                    بروزرسانی رمز عبور
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button 
                  onClick={() => {
                    localStorage.removeItem('dadkar_token');
                    localStorage.removeItem('dadkar_user');
                    onLoginSuccess(null, '');
                    setShowProfileModal(false);
                  }}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition flex items-center gap-1.5"
                >
                  <LogOut size={16} /> خروج از حساب کاربری
                </button>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
