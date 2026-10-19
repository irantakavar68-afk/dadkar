import React, { useState, useEffect } from 'react';
import { User, Phone, KeyRound, CheckCircle, Save, X, Copy, Calendar, Lock, LogIn } from 'lucide-react';

const API_URL = "https://daadkaar.ir/api/auth.php";

const AVATARS = ['🧑‍💼', '👷', '👨‍🔧', '👩‍💼', '🧑‍🏭', '👨‍💼', '🧑‍🔧', '👩‍🔧'];
const INDUSTRIES = ['صنعتی', 'پزشکی', 'نفت و گاز', 'IT و نرم‌افزار', 'ساخت و ساز', 'بازرگانی', 'خدماتی', 'سایر'];

// ---------- تبدیل تاریخ شمسی (بدون کتابخانه) ----------
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
  return j2g(jy, 12, 30)[1] === 2 && j2g(jy + 1, 1, 1)[2] === 1 ? 30 : 29; // ساده: کبیسه
}

const JalaliPicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const nowG = new Date();
  const init = value ? value.split('/').map(Number) : g2j(nowG.getFullYear(), nowG.getMonth() + 1, nowG.getDate());
  const [jy, setJy] = useState(init[0] || 1380);
  const [jm, setJm] = useState(init[1] || 1);
  const [jd, setJd] = useState<number | null>(init[2] || null);
  useEffect(() => { if (jd) onChange(`${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`); }, [jy, jm, jd]);
  const days = jalaliMonthLength(jy, jm);
  const firstG = j2g(jy, jm, 1);
  const offset = new Date(firstG[0], firstG[1] - 1, firstG[2]).getDay(); // 0=یکشنبه
  return (
    <div className="relative">
      <input readOnly dir="ltr" placeholder="----/--/--" value={value}
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono dark:text-white text-center cursor-pointer" />
      <Calendar className="absolute left-3 top-2.5 text-blue-500" size={18} />
      {open && (
        <div className="absolute z-20 mt-2 p-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => { jm === 12 ? (setJm(1), setJy(jy + 1)) : setJm(jm + 1); }} className="px-2 text-slate-500">›</button>
            <span className="text-sm font-bold dark:text-white">{jy} / {jm}</span>
            <button type="button" onClick={() => { jm === 1 ? (setJm(12), setJy(jy - 1)) : setJm(jm - 1); }} className="px-2 text-slate-500">‹</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-1">
            {['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: offset }).map((_, i) => <span key={'e' + i} />)}
            {Array.from({ length: days }, (_, i) => i + 1).map(d => (
              <button type="button" key={d} onClick={() => { setJd(d); setOpen(false); }}
                className={`text-xs rounded-lg py-1 ${jd === d ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatSalary = (s: string) => s.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export interface UserProfile {
  user_code: string; mobile: string;
  username?: string;
  first_name: string; last_name: string;
  birth_date: string; marital_status: 'single' | 'married';
  insurance_start_date: string; last_salary_million_rial: number | string;
  avatar_id?: string; company_name?: string; industry_field?: string;
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
  user_code: '', mobile: '', username: '', first_name: '', last_name: '',
  birth_date: '', marital_status: 'single', insurance_start_date: '',
  last_salary_million_rial: '', avatar_id: 'a0', company_name: '', industry_field: '', password: ''
};

export const AuthProfileModals: React.FC<Props> = ({
  user, token, onLoginSuccess, onProfileUpdate, showProfileModal, setShowProfileModal
}) => {
  const [step, setStep] = useState<'login' | 'mobile' | 'code' | 'register' | 'forgot' | 'reset'>('login');
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success'>('error');
  const [formData, setFormData] = useState<UserProfile>(user || emptyForm);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const post = async (action: string, body: object) => {
    const res = await fetch(`${API_URL}?action=${action}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    return res.json();
  };

  // ---- ورود با نام کاربری / رمز ----
  const handleLoginPassword = async () => {
    if (!identity || !password) { setMsgType('error'); setMsg('نام کاربری و رمز عبور را وارد کنید.'); return; }
    setLoading(true); setMsg('');
    try {
      const data = await post('login_password', { identity, password });
      if (data.status === 'success') {
        localStorage.setItem('dadkar_token', data.token);
        localStorage.setItem('dadkar_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else { setMsgType('error'); setMsg(data.message || 'نام کاربری یا رمز نادرست است.'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- ثبت‌نام: ارسال OTP ----
  const handleSendOtp = async (isForgot = false) => {
    if (!mobile.match(/^09\d{9}$/)) { setMsgType('error'); setMsg('شماره موبایل باید ۱۱ رقمی و با ۰۹ شروع شود.'); return; }
    setLoading(true); setMsg('');
    try {
      const data = await post(isForgot ? 'forgot_password' : 'send_otp', { mobile });
      if (data.status === 'success') { setStep(isForgot ? 'reset' : 'code'); setOtpCode(''); }
      else { setMsgType('error'); setMsg(data.message || 'خطا در ارسال پیامک'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- تأیید OTP (بار اول) → فرم عضویت ----
  const handleVerifyOtp = async () => {
    if (otpCode.length < 4) { setMsgType('error'); setMsg('کد پیامک‌شده را کامل وارد کنید.'); return; }
    setLoading(true); setMsg('');
    try {
      const data = await post('verify_otp', { mobile, code: otpCode });
      if (data.status === 'success' && data.user?.username) {
        localStorage.setItem('dadkar_token', data.token);
        localStorage.setItem('dadkar_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else if (data.status === 'success') {
        setFormData({ ...emptyForm, mobile, ...data.user });
        setStep('register'); // کاربر جدید → فرم عضویت
      } else { setMsgType('error'); setMsg(data.message || 'کد نادرست است'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- تکمیل فرم عضویت ----
  const handleRegister = async () => {
    if (!formData.username || !formData.password || formData.password.length < 6) {
      setMsgType('error'); setMsg('نام کاربری و رمز عبور (حداقل ۶ کاراکتر) الزامی است.'); return;
    }
    setLoading(true); setMsg('');
    try {
      const data = await post('register', { ...formData, mobile });
      if (data.status === 'success') {
        const u = { ...formData, ...data.user, mobile };
        localStorage.setItem('dadkar_user', JSON.stringify(u));
        onLoginSuccess(u, data.token || localStorage.getItem('dadkar_token') || '');
      } else { setMsgType('error'); setMsg(data.message || 'خطا در ثبت‌نام'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- بازیابی رمز ----
  const handleResetPassword = async () => {
    if (otpCode.length < 4 || password.length < 6) { setMsgType('error'); setMsg('کد و رمز جدید (حداقل ۶ کاراکتر) را وارد کنید.'); return; }
    setLoading(true); setMsg('');
    try {
      const data = await post('reset_password', { mobile, code: otpCode, password });
      if (data.status === 'success') {
        setMsgType('success'); setMsg('رمز با موفقیت تغییر کرد. وارد شوید.');
        setTimeout(() => { setStep('login'); setMsg(''); }, 1500);
      } else { setMsgType('error'); setMsg(data.message || 'خطا'); }
    } catch { setMsgType('error'); setMsg('خطای ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  // ---- ذخیره پروفایل (ویرایش از هدر) ----
  const handleSaveProfile = async () => {
    if (!token) return;
    setSaveLoading(true); setSaveMsg('');
    try {
      const res = await post('save_profile', { ...formData, token });
      if (res.status === 'success') {
        localStorage.setItem('dadkar_user', JSON.stringify(formData));
        onProfileUpdate(formData);
        setSaveMsg('مشخصات با موفقیت ذخیره گردید.');
        setTimeout(() => setShowProfileModal(false), 1200);
      } else setSaveMsg(res.message || 'خطا در ذخیره سازی');
    } catch { setSaveMsg('خطای ارتباط با سرور'); }
    finally { setSaveLoading(false); }
  };

  const Msg = () => msg ? (
    <div className={`mt-4 p-2 text-xs text-center rounded-lg ${msgType === 'success'
      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
      : 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'}`}>{msg}</div>
  ) : null;

  // ================= مودال ورود (بدون توکن) =================
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-right max-h-[92vh] overflow-y-auto">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
              <KeyRound size={32} />
            </div>
          </div>

          {/* --- صفحه ورود با رمز --- */}
          {step === 'login' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">ورود به دادکار</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">نام کاربری (یا موبایل) و رمز عبور خود را وارد کنید.</p>
              <div className="space-y-3">
                <input dir="ltr" placeholder="نام کاربری یا 09xxxxxxxxx" value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center dark:text-white" />
                <input dir="ltr" type="password" placeholder="رمز عبور" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center dark:text-white" />
                <button disabled={loading} onClick={handleLoginPassword}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                  <LogIn size={18} />{loading ? '...' : 'ورود'}
                </button>
                <div className="flex justify-between text-xs pt-1">
                  <button onClick={() => { setStep('forgot'); setMsg(''); }} className="text-blue-500 hover:underline">بازیابی رمز عبور</button>
                  <button onClick={() => { setStep('mobile'); setMsg(''); setMobile(''); }} className="text-emerald-600 hover:underline">ثبت‌نام جدید</button>
                </div>
              </div>
              <Msg />
            </>
          )}

          {/* --- ثبت‌نام: شماره موبایل --- */}
          {step === 'mobile' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">ثبت‌نام در دادکار</h2>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">شماره موبایل خود را وارد کنید تا کد تایید ارسال شود.</p>
              <input type="tel" dir="ltr" maxLength={11} placeholder="09xxxxxxxxx" value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center font-mono dark:text-white mb-4" />
              <button disabled={loading} onClick={() => handleSendOtp(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl">
                {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
              </button>
              <button onClick={() => setStep('login')} className="w-full text-center text-xs text-blue-500 hover:underline mt-3">بازگشت به ورود</button>
              <Msg />
            </>
          )}

          {/* --- ثبت‌نام: کد --- */}
          {step === 'code' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">کد تایید</h2>
              <p className="text-xs text-center text-slate-500 mb-4">کد ارسال‌شده به {mobile} را وارد کنید.</p>
              <input dir="ltr" inputMode="numeric" placeholder="-----" value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-lg font-mono tracking-widest dark:text-white mb-4" />
              <button disabled={loading} onClick={handleVerifyOtp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                <CheckCircle size={18} />{loading ? 'بررسی...' : 'ادامه و تکمیل عضویت'}
              </button>
              <Msg />
            </>
          )}

          {/* --- فرم عضویت کامل (بار اول) --- */}
          {step === 'register' && (
            <>
              <h2 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-1">فرم عضویت دادکار</h2>
              <p className="text-[11px] text-center text-slate-500 mb-4">اطلاعات حساب خود را تکمیل کنید.</p>
              <div className="space-y-3">
                {/* آواتار */}
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">آواتار خود را انتخاب کنید</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {AVATARS.map((a, i) => (
                      <button type="button" key={i} onClick={() => setFormData({ ...formData, avatar_id: 'a' + i })}
                        className={`text-xl py-1.5 rounded-xl ${formData.avatar_id === 'a' + i
                          ? 'bg-blue-600/20 ring-2 ring-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="نام" value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
                  <input placeholder="نام خانوادگی" value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <JalaliPicker value={formData.birth_date} onChange={(v) => setFormData({ ...formData, birth_date: v })} />
                  <select value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as 'single' | 'married' })}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white">
                    <option value="single">مجرد</option><option value="married">متأهل</option>
                  </select>
                </div>
                <JalaliPicker value={formData.insurance_start_date} onChange={(v) => setFormData({ ...formData, insurance_start_date: v })} />
                <input dir="ltr" inputMode="numeric" placeholder="آخرین حقوق (میلیون ریال)" value={formData.last_salary_million_rial as string}
                  onChange={(e) => setFormData({ ...formData, last_salary_million_rial: formatSalary(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-center dark:text-white" />
                <input placeholder="نام شرکت / محل کار" value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
                <select value={formData.industry_field} onChange={(e) => setFormData({ ...formData, industry_field: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white">
                  <option value="">حوزه فعالیت را انتخاب کنید</option>
                  {INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input dir="ltr" placeholder="نام کاربری" value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-center dark:text-white" />
                  <input dir="ltr" type="password" placeholder="رمز عبور (۶+)" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-center dark:text-white" />
                </div>
                <button disabled={loading} onClick={handleRegister}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                  <Save size={18} />{loading ? '...' : 'تکمیل عضویت'}
                </button>
              </div>
              <Msg />
            </>
          )}

          {/* --- بازیابی رمز: شماره --- */}
          {step === 'forgot' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">بازیابی رمز عبور</h2>
              <p className="text-xs text-center text-slate-500 mb-4">شماره موبایل ثبت‌شده خود را وارد کنید.</p>
              <input type="tel" dir="ltr" maxLength={11} placeholder="09xxxxxxxxx" value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center font-mono dark:text-white mb-4" />
              <button disabled={loading} onClick={() => handleSendOtp(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl">
                {loading ? 'در حال ارسال...' : 'ارسال کد بازیابی'}
              </button>
              <button onClick={() => setStep('login')} className="w-full text-center text-xs text-blue-500 hover:underline mt-3">بازگشت</button>
              <Msg />
            </>
          )}

          {/* --- بازیابی رمز: کد + رمز جدید --- */}
          {step === 'reset' && (
            <>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">تعیین رمز جدید</h2>
              <p className="text-xs text-center text-slate-500 mb-4">کد ارسال‌شده به {mobile} و رمز جدید را وارد کنید.</p>
              <input dir="ltr" inputMode="numeric" placeholder="کد ۵ رقمی" value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center font-mono dark:text-white mb-2" />
              <input dir="ltr" type="password" placeholder="رمز عبور جدید" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center dark:text-white mb-4" />
              <button disabled={loading} onClick={handleResetPassword}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl">
                {loading ? '...' : 'تغییر رمز و ورود'}
              </button>
              <Msg />
            </>
          )}
        </div>
      </div>
    );
  }

  // ================= مودال پروفایل (کاربر لاگین‌شده) =================
  if (!showProfileModal) return null;

  const avatarIdx = parseInt((user?.avatar_id || formData.avatar_id || 'a0').replace('a', ''), 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><User size={20} /></div>
            <h3 className="font-bold text-slate-900 dark:text-white">مشخصات کاربری</h3>
          </div>
          <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-between border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{AVATARS[isNaN(avatarIdx) ? 0 : avatarIdx] || AVATARS[0]}</span>
            <div>
              <span className="text-[11px] block text-blue-600 dark:text-blue-400">شناسه اختصاصی شما:</span>
              <span className="text-base font-bold font-mono text-slate-800 dark:text-white tracking-wider">
                {formData.user_code || user?.user_code}
              </span>
            </div>
          </div>
          <button onClick={() => navigator.clipboard.writeText(formData.user_code || user?.user_code || '')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm" title="کپی شناسه">
            <Copy size={16} />
          </button>
        </div>

        <div className="space-y-3 text-right">
          {/* آواتار */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">آواتار</label>
            <div className="grid grid-cols-8 gap-1.5">
              {AVATARS.map((a, i) => (
                <button key={i} type="button" onClick={() => setFormData({ ...formData, avatar_id: 'a' + i })}
                  className={`text-xl py-1.5 rounded-xl ${formData.avatar_id === 'a' + i
                    ? 'bg-blue-600/20 ring-2 ring-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>{a}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ تولد (شمسی)</label>
              <JalaliPicker value={formData.birth_date} onChange={(v) => setFormData({ ...formData, birth_date: v })} />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">وضعیت تأهل</label>
              <select value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as 'single' | 'married' })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white">
                <option value="single">مجرد</option><option value="married">متأهل</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ شروع سابقه بیمه (شمسی)</label>
            <JalaliPicker value={formData.insurance_start_date} onChange={(v) => setFormData({ ...formData, insurance_start_date: v })} />
          </div>

          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">آخرین حقوق دریافتی (میلیون ریال)</label>
            <input dir="ltr" inputMode="numeric" placeholder="مثلاً 250" value={formData.last_salary_million_rial as string}
              onChange={(e) => setFormData({ ...formData, last_salary_million_rial: formatSalary(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-center dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام شرکت / محل کار</label>
              <input type="text" value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">حوزه فعالیت</label>
              <select value={formData.industry_field || ''}
                onChange={(e) => setFormData({ ...formData, industry_field: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white">
                <option value="">انتخاب کنید</option>
                {INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button disabled={saveLoading} onClick={handleSaveProfile}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition">
            <Save size={18} />{saveLoading ? 'در حال ذخیره‌سازی...' : 'ذخیره مشخصات'}
          </button>
          {saveMsg && <p className="text-xs text-center mt-2 text-emerald-500 font-medium">{saveMsg}</p>}
        </div>
      </div>
    </div>
  );
};
