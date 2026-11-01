import React from 'react';
import { Scale, Mail, Globe, MessageSquare, Type, MessageCircle, Send } from 'lucide-react';

export default function ContactTab(props: any) {
  const { captchaOk, selectedTicket, setCaptchaOk, setSelectedTicket, setShowTickets, setTicketBody, setTicketSubject, setTickets, showTickets, ticketBody, ticketSubject, tickets, token } = props;
  return (
    <>
          <div className="max-w-2xl mx-auto space-y-4">
            <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4"><Scale className="w-6 h-6 text-cyan-300" /></div>
              <h2 className="text-2xl font-black">ارتباط با ما</h2>
              <p className="mt-3 text-sm leading-7 text-blue-100">دادکار سامانه‌ای برای دسترسی آسان به ابزارهای محاسبات حقوق و دستمزد، قالب‌های کاربردی، قوانین کار و تأمین اجتماعی و اطلاعات شعب است؛ هدف ما ساده‌سازی دسترسی به دانش و خدمات روابط کار برای کارگران، کارفرمایان و کارشناسان است.</p>
            </section>
            
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
             <div>
                <p className="text-xs text-slate-500">طراح و اجرا</p>
                <p className="font-black text-slate-900 dark:text-white mt-1">گروه تخصصی تحلیل و برنامه نویسی دادکار</p>
              </div>
              
              {/* گرید دسترسی‌ها و پیام‌رسان‌ها (بدون شماره تماس مستقیم) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                <button onClick={() => setShowTickets(true)} className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                  <MessageSquare className="w-4 h-4" /> تیکت‌ها
                </button>
                <a href="mailto:info@daadkaar.ir" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition">
                  <Mail className="w-4 h-4" /> ایمیل
                </a>
                <a href="https://www.daadkaar.ir" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition">
                  <Globe className="w-4 h-4" /> وب‌سایت
                </a>
                <a href="https://ble.ir/daadkaar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition">
                  <MessageCircle className="w-4 h-4" /> بله
                </a>
                <a href="https://eitaa.com/daadkar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition">
                  <Send className="w-4 h-4" /> ایتا
                </a>
              </div>


            {/* مودال و سیستم تیکت‌ها */}
            {showTickets && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-black text-sm text-slate-800 dark:text-white">سیستم تیکت‌های پشتیبانی</h3>
                    <button type="button" onClick={() => { setShowTickets(false); setSelectedTicket(null); }} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">✕</button>
                  </div>

                  {selectedTicket ? (
                    <div className="mt-4 space-y-3">
                      <button type="button" onClick={() => setSelectedTicket(null)} className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-2">← بازگشت به فهرست تیکت‌ها</button>
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedTicket.subject}</h4>
                        <span className="text-[10px] text-slate-400 block mt-1">{selectedTicket.created_at}</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 whitespace-pre-wrap">{selectedTicket.body}</p>
                      </div>
                      {selectedTicket.reply ? (
                        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4 bg-emerald-50 dark:bg-emerald-900/30">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-1">پاسخ پشتیبانی:</span>
                          <p className="text-xs text-emerald-800 dark:text-emerald-200 whitespace-pre-wrap">{selectedTicket.reply}</p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs text-center">
                          این تیکت در انتظار پاسخ پشتیبانی است.
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">تیکت‌های ارسالی شما</h4>
                          <button type="button" onClick={async () => {
                            try {
                              const r = await fetch('https://daadkaar.ir/api/auth.php?action=list_tickets', { headers: { Authorization: `Bearer ${token}` } });
                              const j = await r.json();
                              if (j.ok) setTickets(j.tickets);
                            } catch {}
                          }} className="text-[10px] text-blue-600 font-bold">بارگذاری / به‌روزرسانی</button>
                        </div>
                        {tickets.map(t => (
                          <div key={t.id} onClick={() => setSelectedTicket(t)} className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <div className="flex justify-between items-center font-bold text-slate-800 dark:text-white">
                              <span>{t.subject}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${t.status === 'open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                {t.status === 'open' ? 'منتظر پاسخ' : 'پاسخ داده شده'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">{t.created_at}</span>
                          </div>
                        ))}
                        {tickets.length === 0 && <p className="text-center text-xs text-slate-400 py-4">هنوز تیکتی بارگذاری یا ثبت نکرده‌اید.</p>}
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                        <h4 className="font-black text-xs text-slate-800 dark:text-white">ثبت تیکت جدید</h4>
                        <input
                          value={ticketSubject}
                          onChange={e => setTicketSubject(e.target.value)}
                          placeholder="موضوع تیکت"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <textarea
                          value={ticketBody}
                          onChange={e => setTicketBody(e.target.value)}
                          rows={3}
                          placeholder="متن پیام شما..."
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                          <input type="checkbox" checked={captchaOk} onChange={e => setCaptchaOk(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span>من ربات نیستم</span>
                        </label>
                        <button
                          onClick={async () => {
                            const currentToken = localStorage.getItem('dadkar_token') || localStorage.getItem('token') || '';
                            if (!currentToken) {
                              alert('لطفاً ابتدا وارد حساب کاربری خود شوید.');
                              return;
                            }
                            if (!ticketSubject.trim() || !ticketBody.trim()) {
                              alert('لطفاً موضوع و متن تیکت را وارد کنید.');
                              return;
                            }
                            if (!captchaOk) {
                              alert('لطفاً تایید کنید که ربات نیستید.');
                              return;
                            }
                            try {
                              const res = await fetch('https://daadkaar.ir/api/auth.php?action=create_ticket', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  token: currentToken,
                                  subject: ticketSubject,
                                  body: ticketBody
                                })
                              });
                              const data = await res.json();
                              if (res.ok && (data.ok || data.status === 'success')) {
                                setTicketSubject('');
                                setTicketBody('');
                                setCaptchaOk(false);
                                alert(data.message || 'تیکت شما با موفقیت ثبت شد.');

                                const r = await fetch('https://daadkaar.ir/api/auth.php?action=list_tickets', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ token: currentToken })
                                });
                                const j = await r.json();
                                if (j.tickets || j.data) {
                                  setTickets(j.tickets || j.data || []);
                                }
                              } else {
                                alert(data.message || 'خطا در ثبت تیکت. لطفاً دوباره تلاش کنید.');
                              }
                            } catch (err) {
                              alert('خطای ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition hover:bg-emerald-700 active:scale-95"
                        >
                          ارسال تیکت جدید
                        </button>


                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
    </>
  );
}
