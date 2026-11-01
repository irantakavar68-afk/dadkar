import React from 'react';
import { Building2, Users, FileText, ChevronLeft, HelpCircle, Calculator, BookOpen, Layers } from 'lucide-react';

export default function HomeTab(props: any) {
  const { activeBanner, banners, setActiveBanner, setActiveCalc, setActiveTab } = props;
  return (
    <>
          <div className="space-y-6">
            
            {/* اسلایدر بنر بالا */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 text-white">
              <div className={`p-5 sm:p-6 bg-gradient-to-br ${banners[activeBanner].color} transition-colors duration-700 min-h-[200px] h-[210px] sm:h-[200px] overflow-hidden flex flex-col justify-between`}>
                <div className="space-y-1.5 min-h-0">
                  <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20">
                    {banners[activeBanner].badge}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black leading-snug line-clamp-1">{banners[activeBanner].title}</h2>
                  <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {banners[activeBanner].desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
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
                  <div onClick={() => setActiveTab('tribunal')} className="cursor-pointer p-5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 transition">
                    <h3 className="text-lg font-bold">⚖️ شبیه‌ساز هیئت تشخیص</h3>
                    <p className="text-sm opacity-90 mt-1">تست احتمال پیروزی در دعاوی کارگر و کارفرما</p>
                  </div>

              </div>
            </div>
            {/* کارت دسترسی سریع: فیش حقوقی پرسنلی */}
            <div 
              onClick={() => setActiveTab('payslip')}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">📄 فیش حقوقی پرسنلی</h3>
                <p className="text-emerald-100 text-xs mt-1">محاسبه و خروجی فیش بر اساس پروفایل</p>
              </div>
              <FileText className="w-8 h-8 text-emerald-100 opacity-80" />
            </div>
          
            {/* کارت راهنما و اطلاعات مبنا */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 text-white flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] bg-blue-700/60 px-2 py-0.5 rounded font-bold">مبنای استناد</span>
                <h4 className="text-xs font-bold">محاسبات بر اساس آخرین بخشنامه مصوب شورای عالی کار</h4>
                <p className="text-[10px] text-blue-200">سقف ورودی دستمزد تا ۱ میلیارد تومان (۱۰ میلیارد ریال)</p>
              </div>
              <button 
                onClick={() => setActiveTab('calculator')}
                className="bg-white text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 hover:bg-blue-50 transition"
              >
                ورود
              </button>
            </div>

          </div>
    </>
  );
}
