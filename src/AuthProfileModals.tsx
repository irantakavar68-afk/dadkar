import React, { useState } from 'react';
import { User, Phone, KeyRound, CheckCircle, Save, X, Copy } from 'lucide-react';

// آدرس دامنه هاست خود را اینجا جایگزین کنید
const API_URL = "https://yourdomain.com/api/auth.php";

export interface UserProfile {
  user_code: string;
  mobile: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  marital_status: 'single' | 'married';
  insurance_start_date: string;
  last_salary_million_rial: number | string;
}

interface Props {
  user: UserProfile | null;
  token: string | null;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  onProfileUpdate: (user: UserProfile) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
}

export const AuthProfileModals: React.FC<Props> = ({
  user,
  token,
  onLoginSuccess,
  onProfileUpdate,
  showProfileModal,
  setShowProfileModal
}) => {
  // استیت‌های لاگین OTP
  const [step, setStep] = useState<'mobile' | 'code'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // استیت‌های فرم پروفایل
  const [formData, setFormData] = useState<UserProfile>(
    user || {
      user_code: '',
      mobile: '',
      first_name: '',
      last_name: '',
      birth_date: '',
      marital_status: 'single',
      insurance_start_date: '',
      last_salary_million_rial: ''
    }
  );
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // ارسال شماره و دریافت پیامک
  const handleSendOtp = async () => {
    if (!mobile.match(/^09\d{9}$/)) {
      setMsg('شماره موبایل باید ۱۱ رقمی و با ۰۹ شروع شود.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}?action=send_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStep('code');
      } else {
        setMsg(data.message || 'خطا در ارسال پیامک');
      }
    } catch {
      setMsg('خطای ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // بررسی کد OTP
  const handleVerifyOtp = async () => {
    if (otpCode.length < 4) {
      setMsg('کد پیامک‌شده را کامل وارد کنید.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}?action=verify_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code: otpCode })
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('dadkar_token', data.token);
        localStorage.setItem('dadkar_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
        setFormData(data.user);
      } else {
        setMsg(data.message || 'کد نادرست است');
      }
    } catch {
      setMsg('خطای ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // ذخیره اطلاعات پروفایل
  const handleSaveProfile = async () => {
    if (!token) return;
    setSaveLoading(true);
    setSaveMsg('');
    try {
      const res = await fetch(`${API_URL}?action=save_profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token })
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('dadkar_user', JSON.stringify(formData));
        onProfileUpdate(formData);
        setSaveMsg('مشخصات با موفقیت ذخیره گردید.');
        setTimeout(() => setShowProfileModal(false), 1200);
      } else {
        setSaveMsg(data.message || 'خطا در ذخیره سازی');
      }
    } catch {
      setSaveMsg('خطای ارتباط با سرور');
    } finally {
      setSaveLoading(false);
    }
  };

  // مودال لاگین اجباری در صورت لاگین نبودن
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-right">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
              <KeyRound size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
            ورود به سامانه دادکار
          </h2>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            جهت دسترسی به امکانات، شماره موبایل خود را وارد نمایید تا کد تایید برایتان ارسال شود.
          </p>

          {step === 'mobile' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  شماره موبایل
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    maxLength={11}
                    placeholder="09xxxxxxxxx"
                    dir="ltr"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white text-center font-mono focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="absolute right-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>
              <button
                disabled={loading}
                onClick={handleSendOtp}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center"
              >
                {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  کد پیامک شده به {mobile}
                </label>
                <input
                  type="number"
                  placeholder="کد ۵ رقمی"
                  dir="ltr"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                {loading ? 'بررسی...' : 'ورود به برنامه'}
              </button>
              <button
                onClick={() => setStep('mobile')}
                className="w-full text-center text-xs text-blue-500 hover:underline"
              >
                تغییر شماره موبایل
              </button>
            </div>
          )}

          {msg && (
            <div className="mt-4 p-2 text-xs text-center text-rose-500 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
              {msg}
            </div>
          )}
        </div>
      </div>
    );
  }

  // مودال ویرایش پروفایل کاربر (از هدر)
  if (!showProfileModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <User size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">مشخصات کاربری</h3>
          </div>
          <button
            onClick={() => setShowProfileModal(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* کد اختصاصی کاربر */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-between border border-blue-100 dark:border-blue-900/50">
          <div>
            <span className="text-[11px] block text-blue-600 dark:text-blue-400">شناسه اختصاصی شما:</span>
            <span className="text-base font-bold font-mono text-slate-800 dark:text-white tracking-wider">
              {formData.user_code || user?.user_code}
            </span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(formData.user_code || user?.user_code || '')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
            title="کپی شناسه"
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="space-y-3 text-right">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نام خانوادگی</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ تولد (شمسی)</label>
              <input
                type="text"
                placeholder="مثلاً 1370/01/15"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono dark:text-white text-center"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">وضعیت تأهل</label>
              <select
                value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as 'single' | 'married' })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm dark:text-white"
              >
                <option value="single">مجرد</option>
                <option value="married">متأهل</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">تاریخ شروع سابقه بیمه</label>
            <input
              type="text"
              placeholder="مثلاً 1395/07/01"
              value={formData.insurance_start_date}
              onChange={(e) => setFormData({ ...formData, insurance_start_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono dark:text-white text-center"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
              آخرین حقوق دریافتی (میلیون ریال)
            </label>
            <input
              type="number"
              placeholder="مثلاً 250"
              value={formData.last_salary_million_rial}
              onChange={(e) => setFormData({ ...formData, last_salary_million_rial: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono dark:text-white text-center"
            />
          </div>

          <button
            disabled={saveLoading}
            onClick={handleSaveProfile}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            <Save size={18} />
            {saveLoading ? 'در حال ذخیره‌سازی...' : 'ذخیره مشخصات'}
          </button>

          {saveMsg && (
            <p className="text-xs text-center mt-2 text-emerald-500 font-medium">
              {saveMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
