import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, Save, CheckCircle, RefreshCw } from 'lucide-react';
import { toFa } from '../helpers';

export default function AdminDashboardTab({ token }: { token: string }) {
  const [activeTab, setActiveTab] = useState<'settings' | 'tickets'>('settings');
  const [settings, setSettings] = useState<any>({
    minDailyWage1405: '3500000',
    monthlyTaxExemption1405: '140000000'
  });
  const [tickets, setTickets] = useState<any[]>([]);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = "https://daadkaar.ir/api/admin_backend.php";

  // بارگذاری اطلاعات
  const fetchData = async () => {
    setLoading(true);
    try {
      const resSettings = await fetch(`${API_BASE}?action=get_settings`);
      const dataSettings = await resSettings.json();
      if (dataSettings.success && dataSettings.data) {
        setSettings((prev: any) => ({ ...prev, ...dataSettings.data }));
      }

      const resTickets = await fetch(`${API_BASE}?action=admin_list_tickets`);
      const dataTickets = await resTickets.json();
      if (dataTickets.success && dataTickets.data) {
        setTickets(dataTickets.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ذخیره تنظیمات مبنای سالانه
  const handleSaveSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=save_settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('تنظیمات با موفقیت در سامانه بروزرسانی شد.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('خطا در ذخیره تنظیمات');
    }
  };

  // ارسال پاسخ به تیکت کاربر
  const handleSendReply = async (ticketId: number) => {
    const replyText = replies[ticketId];
    if (!replyText) return;

    try {
      const res = await fetch(`${API_BASE}?action=admin_reply_ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, reply: replyText })
      });
      const data = await res.json();
      if (data.success) {
        fetchData(); // بروزرسانی لیست
        setReplies({ ...replies, [ticketId]: '' });
      }
    } catch (err) {
      alert('خطا در ارسال پاسخ');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4" dir="rtl">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm">
        <h2 className="font-black text-slate-800 text-lg">داشبورد مدیریت مرکزی دادکار</h2>
        <button onClick={fetchData} className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-slate-700 font-bold">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>بروزرسانی اطلاعات</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* تب‌های داخلی داشبورد */}
      <div className="flex gap-3 border-b pb-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl text-xs transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border'}`}
        >
          <Settings className="w-4 h-4" />
          <span>مدیریت مبناها و ضرایب سالانه</span>
        </button>
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl text-xs transition-all ${activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>صندوق تیکت‌های پشتیبانی ({tickets.length})</span>
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b pb-3">پارامترهای مالی و بیمه‌ای قابل ویرایش</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">حداقل مزد روزانه (ریال):</label>
              <input 
                type="text" 
                dir="ltr"
                value={settings.minDailyWage1405}
                onChange={(e) => setSettings({...settings, minDailyWage1405: e.target.value})}
                className="w-full border rounded-xl p-2.5 text-sm font-bold text-left bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">سقف معافیت مالیاتی ماهانه (ریال):</label>
              <input 
                type="text" 
                dir="ltr"
                value={settings.monthlyTaxExemption1405}
                onChange={(e) => setSettings({...settings, monthlyTaxExemption1405: e.target.value})}
                className="w-full border rounded-xl p-2.5 text-sm font-bold text-left bg-slate-50"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات در دیتابیس</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t: any) => (
            <div key={t.id} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500 border-b pb-2">
                <span className="font-bold text-slate-700">کاربر: {t.user_code}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${t.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {t.status === 'open' ? 'در انتظار پاسخ' : 'پاسخ داده شده'}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">موضوع: {t.subject}</h4>
                <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{t.body}</p>
              </div>

              {t.reply && (
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs text-blue-900 space-y-1">
                  <span className="font-bold">پاسخ قبلی شما:</span>
                  <p>{t.reply}</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <input 
                  type="text" 
                  placeholder="متن پاسخ به کاربر..." 
                  value={replies[t.id] || ''}
                  onChange={(e) => setReplies({ ...replies, [t.id]: e.target.value })}
                  className="flex-1 border rounded-xl px-3 py-2 text-xs bg-slate-50"
                />
                <button 
                  onClick={() => handleSendReply(t.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  ارسال پاسخ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
