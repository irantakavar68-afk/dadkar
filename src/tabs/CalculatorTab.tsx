import React from 'react';
import { Users, Clock, Calculator, ShieldCheck, Award, Briefcase, Percent, RefreshCw } from 'lucide-react';
import { toFa, toEn } from '../helpers';

export default function CalculatorTab(props: any) {
  const { MAX_SALARY_RIAL, activeCalc, baseSalary, calculations, days, dependents, formatRial, handleSalaryTextBlur, handleSalaryTextChange, handleSliderSalaryChange, hours, insuranceYears, months, nightHours, salaryInputText, setActiveCalc, setBaseSalary, setDays, setDependents, setHours, setInsuranceYears, setMonths, setNightHours, setSalaryInputText, setShiftType, setUnemploymentMonths, setUnworkedLeaveDays, setWorkHistoryYears, setYears, shiftType, unemploymentMonths, unworkedLeaveDays, workHistoryYears, years } = props;
  return (
    <>
          <div className="space-y-5">
            
            {/* کارت دستمزد با سقف ۱۰ میلیارد تومان و ورودی کاملاً اصلاح‌شده */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800 text-base">دستمزد مبنای محاسبه</h2>
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-500 ml-1">مبلغ فعال:</span>
                  <span className="text-base font-black text-blue-700">{formatRial(baseSalary)}</span>
                </div>
              </div>

              {/* ورودی دستی اصلاح‌شده بدون قفل‌شدن عدد یا تک‌رقمی ماندن */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                  <label htmlFor="salaryInput">وارد کردن مبلغ به ریال (سقف ۱ میلیارد تومان = ۱۰,۰۰۰,۰۰۰,۰۰۰ ریال):</label>
                  <span className="text-[11px] text-slate-400 tabular-nums">حداکثر ۱۰ میلیارد ریال</span>
                </div>
                <div className="relative">
                  <input
                    id="salaryInput"
                    type="text"
                    dir="ltr"
                    inputMode="numeric"
                    value={salaryInputText}
                    onChange={handleSalaryTextChange}
                    onBlur={handleSalaryTextBlur}
                    placeholder="مبلغ مورد نظر را وارد نمایید..."
                    className="w-full h-12 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl tabular-nums text-left font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-base"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-sans pointer-events-none">ریال</span>
                </div>
              </div>

              {/* اسلایدر تنظیم سریع با سقف ۱۰۰ میلیارد ریال */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>اهرم تنظیم سریع:</span>
                  <span className="tabular-nums text-blue-600 font-bold">{formatRial(baseSalary)}</span>
                </div>
                <input
                  type="range"
                  min={50000000}
                  max={MAX_SALARY_RIAL}
                  step={50000000}
                  value={baseSalary}
                  onChange={(e) => handleSliderSalaryChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* مقادیر قانونی و استاندارد */}
              <div className="pt-2">
                <div className="text-[11px] text-slate-500 mb-2 font-medium">مقادیر پایه مصوب شورای عالی کار:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { setBaseSalary(71661840); setSalaryInputText(toFa('71,661,840')); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل مزد ۳۰ روزه</div>
                    <div className="text-xs font-bold text-slate-800">۷۱,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(103661840); setSalaryInputText(toFa('103,661,840')); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">حداقل دریافتی مجرد</div>
                    <div className="text-xs font-bold text-slate-800">۱۰۳,۶۶۱,۸۴۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(200000000); setSalaryInputText(toFa('200,000,000')); }}
                    className="p-2 text-right rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition"
                  >
                    <div className="text-[10px] text-slate-500">مزد ۲۰ تومانی</div>
                    <div className="text-xs font-bold text-slate-800">۲۰۰,۰۰۰,۰۰۰ ریال</div>
                  </button>
                  <button
                    onClick={() => { setBaseSalary(501632880); setSalaryInputText(toFa('501,632,880')); }}
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
                  <span className="text-xs text-indigo-900">مزد هر ساعت کار (۲۲۰ ساعت):</span>
                  <span className="font-bold text-xs text-indigo-800">{formatRial(calculations.hourlyWage)}</span>
                </div>
              </div>
            </div>

            {/* تب‌های انتخاب ماشین‌حساب تخصصی */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
              {[
                { id: 'salary', label: 'بیمه اجباری کارگری' },
                { id: 'voluntary', label: 'بیمه اختیاری و زنان خانه‌دار' },
                { id: 'severance', label: 'حق سنوات پایان کار' },
                { id: 'overtime', label: 'اضافه‌کاری' },
                { id: 'shift', label: 'نوبت‌کاری' },
                { id: 'night', label: 'شب‌کاری' },
                { id: 'leave', label: 'مانده مرخصی' },
                { id: 'sanavat', label: 'پایه سنوات تجمیعی' },
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

            {/* کارت‌های محاسبات */}

            {/* ۱. بیمه اجباری ۳۰٪ */}
            {activeCalc === 'salary' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">تفکیک ۳۰٪ حق‌بیمه اجباری قانون کار و تأمین اجتماعی</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs text-emerald-700 font-bold mb-1">سهم کارگر (۷ درصد)</div>
                    <div className="text-lg font-black text-emerald-900">{formatRial(calculations.insuranceWorker)}</div>
                    <div className="text-[11px] text-emerald-600 mt-2">کسر از فیش حقوق ماهانه کارگر</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-xs text-blue-700 font-bold mb-1">سهم کارفرما (۲۰ درصد) + ۳٪ بیکاری</div>
                    <div className="text-lg font-black text-blue-900">{formatRial(calculations.insuranceEmployer + (baseSalary * 0.03))}</div>
                    <div className="text-[11px] text-blue-600 mt-2">تعهد کارفرما در لیست ماهانه</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-600 font-bold mb-1">مجموع واریزی کامل به سازمان (۳۰٪)</div>
                    <div className="text-lg font-black text-slate-900">{formatRial(calculations.insuranceTotal)}</div>
                    <div className="text-[11px] text-slate-500 mt-2">شامل درمان، بازنشستگی، فوت و بیکاری</div>
                  </div>
                </div>
              </div>
            )}

            {/* ۲. بیمه اختیاری و زنان خانه‌دار */}
            {activeCalc === 'voluntary' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">بیمه زنان خانه‌دار و حرف و مشاغل آزاد</h3>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <h4 className="font-bold text-sm text-slate-800">نرخ‌های سه‌گانه بیمه زنان خانه‌دار (قانون تأمین اجتماعی)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-pink-900">طرح ۱۲ درصد</span>
                        <span className="text-[10px] bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full font-bold">پایه</span>
                      </div>
                      <div className="text-lg font-black text-pink-950 my-1">{formatRial(calculations.housewife12)}</div>
                      <div className="text-[11px] text-pink-700 leading-relaxed">
                        شامل بازنشستگی و فوت پس از بازنشستگی (ویژه افراد بدون فرد تحت تکفل).
                      </div>
                    </div>

                    <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-purple-900">طرح ۱۴ درصد</span>
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">متوسط</span>
                      </div>
                      <div className="text-lg font-black text-purple-950 my-1">{formatRial(calculations.housewife14)}</div>
                      <div className="text-[11px] text-purple-700 leading-relaxed">
                        شامل بازنشستگی و فوت قبل و بعد از بازنشستگی (پرداخت مستمری به بازماندگان).
                      </div>
                    </div>

                    <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-indigo-900">طرح ۱۸ درصد</span>
                        <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">کامل‌ترین</span>
                      </div>
                      <div className="text-lg font-black text-indigo-950 my-1">{formatRial(calculations.housewife18)}</div>
                      <div className="text-[11px] text-indigo-700 leading-relaxed">
                        شامل بازنشستگی، فوت و ازکارافتادگی کلی.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h4 className="font-bold text-sm text-slate-800">بیمه اختیاری ۲۷ درصد (شامل درمان رایگان کامل)</h4>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-blue-800 font-bold">حق‌بیمه ماهانه (۲۷٪ کامل)</div>
                      <div className="text-[11px] text-blue-600 mt-1">شامل درمان کامل، بازنشستگی، فوت و ازکارافتادگی</div>
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
                  <h3 className="font-bold text-slate-800">حق سنوات خدمت (ماده ۲۴ قانون کار)</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد سال:</label>
                      <input
                        type="text" 
                        inputMode="numeric"                        
                        min="0"
                        placeholder="0"
                        value={years === 0 ? '' : toFa(years)}    
                        onChange={(e) => {
                          const val = toEn(e.target.value).replace(/[^0-9]/g, ''); 
                          setYears(val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0));
                        }}
                        className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد ماه:</label>
                      <input
                          type="text"
                          inputMode="numeric"
                          min="0"
                          max="11"
                          placeholder="0"
                          value={months === 0 ? '' : toFa(months)}       
                          onChange={(e) => {
                            const val = toEn(e.target.value).replace(/[^0-9]/g, '');  
                            setMonths(val === '' ? 0 : Math.min(11, Math.max(0, parseInt(val, 10) || 0)));
                          }}
                          className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد روز:</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        min="0"
                        max="30"
                        placeholder="0"
                       value={days === 0 ? '' : toFa(days)}
                        onChange={(e) => {
                          const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                          setDays(val === '' ? 0 : Math.min(30, Math.max(0, parseInt(val, 10) || 0)));
                        }}
                        className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                  <h3 className="font-bold text-slate-800">اضافه کاری (ماده ۵۹ قانون کار - ۴۰٪ مازاد)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">تعداد ساعات اضافه کاری در ماه:</label>
                     <input
                        type="text"
                        inputMode="numeric"
                        min="0"
                        placeholder="0"
                        value={hours === 0 ? '' : toFa(hours)}
                        onChange={(e) => {
                          const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                          setHours(val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0));
                        }}
                        className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-900 font-bold">فوق‌العاده کل اضافه‌کاری:</span>
                  <span className="text-lg font-black text-indigo-900">{formatRial(calculations.overtimePay)}</span>
                </div>
              </div>
            )}

            {/* ۵. فوق‌العاده نوبت‌کاری */}
            {activeCalc === 'shift' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-800">فوق‌العاده نوبت‌کاری (مواد ۵۵ و ۵۶ قانون کار)</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 font-bold block">نوع شیفت چرخشی در ماه:</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 text-xs"
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
              </div>
            )}

            {/* ۶. شب‌کاری عادی غیرنوبتی */}
            {activeCalc === 'night' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-5 h-5 text-indigo-900" />
                  <h3 className="font-bold text-slate-800">شب‌کاری غیرنوبتی (ماده ۵۸ قانون کار - ۳۵٪ مازاد)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">ساعات کار شبانه عادی (ساعت ۲۲ الی ۶ بامداد):</label>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    min="0" 
                    value={nightHours === 0 ? '' : toFa(nightHours)}
                    placeholder="0"
                    onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setNightHours(v === '' ? 0 : Math.max(0, parseInt(v, 10) || 0)); }}    
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                  />
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-bold">فوق‌العاده شب‌کاری:</span>
                  <span className="text-lg font-black text-indigo-950">{formatRial(calculations.nightPay)}</span>
                </div>
              </div>
            )}

            {/* ۷. مانده مرخصی */}
            {activeCalc === 'leave' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-800">بازخرید مانده مرخصی استحقاقی (ماده ۶۶ قانون کار)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">تعداد روزهای استفاده‌نشده:</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      min="0"
                      max="30"
                      placeholder="0"
                      value={unworkedLeaveDays === 0 ? '' : toFa(unworkedLeaveDays)}
                      onChange={(e) => {
                        const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                        setUnworkedLeaveDays(val === '' ? 0 : Math.min(30, Math.max(0, parseInt(val, 10) || 0)));
                      }}
                      className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                </div>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 flex items-center justify-between">
                  <span className="text-xs text-teal-950 font-bold">مبلغ بازخرید مرخصی:</span>
                  <span className="text-lg font-black text-teal-950">{formatRial(calculations.leavePay)}</span>
                </div>
              </div>
            )}

            {/* ۸. پایه سنوات تجمیعی */}
            {activeCalc === 'sanavat' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-slate-800">پایه سنوات تجمیعی ماهانه (بخشنامه مصوب شورای عالی کار)</h3>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">تعداد سال‌های اشتغال در کارگاه فعلی (بیش از یک سال):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      min="0"
                      max="35"
                      placeholder="0"
                      value={workHistoryYears === 0 ? '' : toFa(workHistoryYears)}
                      onChange={(e) => {
                        const val = toEn(e.target.value).replace(/[^0-9]/g, '');
                        setWorkHistoryYears(val === '' ? 0 : Math.min(35, Math.max(0, parseInt(val, 10) || 0)));
                      }}
                      className="w-full px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-xs text-blue-950 font-bold">پایه سنوات ماهانه (۳۰ روزه):</span>
                  <span className="text-lg font-black text-blue-950">{formatRial(calculations.sanavatMonthly)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  * پایه سنوات رقم ثابت روزانه مصوب شورای عالی کار است و به کارگرانی با بیش از یک سال سابقه در کارگاه یکسان تعلق می‌گیرد.
                </div>
              </div>
            )}

            {/* ۹. برآورد مستمری بازنشستگی (کاملاً مطابق ماده ۷۷ و با ورودی عددی مستقیم سنوات) */}
            {activeCalc === 'pension' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Percent className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">برآورد مستمری بازنشستگی (ماده ۷۷ قانون تأمین اجتماعی)</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 font-bold block">
                    تعداد سال‌های پرداخت حق‌بیمه (ورودی مستقیم عددی یا اسلایدر):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      min="10"
                      max="35"
                      value={insuranceYears === 0 ? '' : toFa(insuranceYears)}
                      placeholder="۱۰ تا ۳۵"
                      onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setInsuranceYears(v === '' ? 0 : Math.min(35, Math.max(0, parseInt(v, 10) || 0))); }}
                      className="w-24 p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center tabular-nums text-indigo-700"
                    />
                    <span className="text-xs text-slate-500">سال سابقه</span>
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={10}
                    max={35}
                    value={Math.max(10, insuranceYears)}
                    onChange={(e) => setInsuranceYears(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-bold">برآورد مستمری ماهانه بر اساس دستمزد انتخابی:</span>
                  <span className="text-lg font-black text-indigo-950">{formatRial(calculations.pensionEstimate)}</span>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  فرمول مصرح ماده ۷۷: (متوسط دستمزد مشمول کسر حق‌بیمه دو سال آخر × سابقه پرداخت حق‌بیمه) تقسیم بر ۳۰.
                </div>
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
                    <label className="text-xs text-slate-500 block mb-1">ماه‌های سابقه قبلی:</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      min="0" 
                      value={unemploymentMonths === 0 ? '' : toFa(unemploymentMonths)}
                      placeholder="حداقل ۶ ماه"
                      onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setUnemploymentMonths(v === '' ? 0 : Math.max(0, parseInt(v, 10) || 0)); }}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">تعداد افراد تحت تکفل:</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      min="0" 
                      max="4"
                      value={dependents === 0 ? '' : toFa(dependents)}
                      placeholder="0"
                      onChange={(e) => { const v = toEn(e.target.value).replace(/[^0-9]/g, ''); setDependents(v === '' ? 0 : Math.min(4, Math.max(0, parseInt(v, 10) || 0))); }}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="text-[11px] text-blue-700">حداکثر مدت دریافت مقرری:</div>
                    <div className="text-base font-black text-blue-900 mt-1">{toFa(calculations.maxUnemploymentMonths)} ماه شمسی</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <div className="text-[11px] text-emerald-700">مقرری برآوردی ماهانه:</div>
                    <div className="text-base font-black text-emerald-900 mt-1">{formatRial(calculations.monthlyUnemploymentBenefit)}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
    </>
  );
}
