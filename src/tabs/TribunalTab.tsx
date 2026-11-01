import React from 'react';

export default function TribunalTab(props: any) {
  const { calculateTribunal, setTribunalData, setTribunalResult, setTribunalStep, tribunalData, tribunalResult, tribunalStep } = props;
  return (
    <>
          <div className="space-y-6 max-w-3xl mx-auto pb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">⚖️ شبیه‌ساز حرفه‌ای هیئت تشخیص (ماده ۱۵۷)</h2>
                  <p className="text-xs text-gray-500 mt-1">ارزیابی ریسک و شانس موفقیت پرونده بر اساس ۱۵ فاکتور کلیدی قوانین کار</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold">
                  مرحله {tribunalStep} از ۱۵
                </span>
              </div>

                {tribunalStep <= 15 && (
                <div className="space-y-6">
                  {/* سوالات گام‌به‌گام */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                      {tribunalStep === 1 && "۱. آیا قرارداد کار کتبی (نسخه کارگر/کارفرما) در اختیار دارید؟"}
                      {tribunalStep === 2 && "۲. نوع قرارداد کار شما چگونه منعقد شده است؟"}
                      {tribunalStep === 3 && "۳. آیا حق بیمه تأمین اجتماعی شما ماهیانه و به موقع واریز شده است؟"}
                      {tribunalStep === 4 && "۴. مجموع سابقه بیمه واریز‌شده شما در کارگاه چقدر است؟"}
                      {tribunalStep === 5 && "۵. دستمزد و حقوق شما از چه طریق پرداخت شده است؟"}
                      {tribunalStep === 6 && "۶. آیا فیش حقوقی ممهور یا پرینت رسمی حقوق دریافت می‌کنید؟"}
                      {tribunalStep === 7 && "۷. آیا فرم تسویه حساب یا قرارداد سفیدامضا / سفته امضا کرده‌اید؟"}
                      {tribunalStep === 8 && "۸. نحوه قطع همکاری و پایان کار شما چگونه بوده است؟"}
                      {tribunalStep === 9 && "۹. آیا اخطار کتبی، تذکر یا فرم کمیته انضباطی دریافت کرده‌اید؟"}
                      {tribunalStep === 10 && "۱۰. آیا شاهد یا مطلعی (همکاران) برای اثبات ادعای حضور دارید؟"}
                      {tribunalStep === 11 && "۱۱. آیا مدارک یا ساعت‌زن / کارت‌ساعت اضافه کار دارید؟"}
                      {tribunalStep === 12 && "۱۲. آیا مطالبات مرخصی استفاده‌نشده ذخیره دارید؟"}
                      {tribunalStep === 13 && "۱۳. آیا مبلغی بابت سنوات یا عیدی به صورت نقدی بدون رسید گرفته‌اید؟"}
                      {tribunalStep === 14 && "۱۴. آیا سابقه طرح شکایت قبلی در اداره کار دارید؟"}
                      {tribunalStep === 15 && "۱۵. آیا توافق‌نامه دستی یا تعهدنامه محضری خارج از اداره کار امضا کرده‌اید؟"}
                    </h3>

                             {/* گام ۱: قرارداد کتبی - ماده ۱۰ و ۷ */}
          {tribunalStep === 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت تنظیم قرارداد کار کتبی شما به چه صورت است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'formal_two_copies', label: 'کتبی در دو نسخه دارای امضا و مهر کارفرما (ماده ۱۰)' },
                  { id: 'single_copy', label: 'کتبی در یک نسخه نزد کارفرما / فاقد نسخه کارگر' },
                  { id: 'verbal', label: 'شفاهی / فاقد هرگونه قرارداد کتبی (ماده ۷)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasContract: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasContract === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۲: نوع قرارداد - ماده ۷ */}
          {tribunalStep === 2 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">ماهیت و مدت قرارداد کار شما چگونه منعقد شده است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'permanent', label: 'دائم / مستمر در کارهای با ماهیت دائم' },
                  { id: 'temporary_valid', label: 'موقت با ذکر دلیل موجه در کارهای غیرمستمر' },
                  { id: 'temporary_invalid', label: 'موقت برای کارهای مستمر بدون ثبت در سامانه / سفیدامضا (تبصره ۲ ماده ۷)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, contractType: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.contractType === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۳: بیمه - ماده ۱۴۸ */}
          {tribunalStep === 3 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت ارسال لیست و واریز حق بیمه تأمین اجتماعی چگونه است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'full_insurance', label: 'کامل و مطابق با ایام واقعی اشتغال و مزد واقعی (ماده ۱۴۸)' },
                  { id: 'partial_insurance', label: 'پاره‌وقت یا با حقوق کمتر از پایه وزارت کار رد شده' },
                  { id: 'no_insurance', label: 'کلاً رد نشده / کارفرما بیمه نکرده است (تخلف ماده ۱۴۸)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasInsurance: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasInsurance === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۴: سابقه بیمه */}
          {tribunalStep === 4 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">مجموع سابقه بیمه پرداختی شما در کارگاه فعلی چقدر است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: '6', label: 'کمتر از ۱ سال' },
                  { id: '36', label: 'بین ۱ تا ۵ سال' },
                  { id: '72', label: 'بیش از ۵ سال' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, insuranceMonths: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.insuranceMonths === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۵: طریق پرداخت دستمزد - ماده ۳۷ */}
          {tribunalStep === 5 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">دستمزد و حقوق قانونی شما از چه طریقی به حسابتان پرداخت می‌شده است؟ (ماده ۳۷)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'bank_transfer', label: 'واریز مستقیم از حساب رسمی شرکت/کارفرما به حساب بانکی کارگر' },
                  { id: 'cash_or_third_party', label: 'پرداخت نقدی دستی یا کارت به کارت از حساب شخصی اشخاص ثالث' },
                  { id: 'unpaid_or_deducted', label: 'عدم پرداخت معوقات یا پرداخت همراه با کسورات غیرقانونی' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasBankTransfer: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasBankTransfer === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۶: فیش حقوقی */}
          {tribunalStep === 6 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا فیش حقوقی ممهور به مهر کارگاه یا پرینت رسمی دریافت می‌کرده‌اید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'has_payslip_official', label: 'بله، فیش‌های حقوقی هر ماه با امضا و مهر موجود است' },
                  { id: 'payslip_unofficial', label: 'پرینت پرسنلی یا گزارش نرم‌افزاری بدون مهر دارم' },
                  { id: 'no_payslip', label: 'خیر، هیچ‌گونه فیش یا مدرک ممهوری در اختیار ندارم' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasPaySlip: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasPaySlip === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۷: سفیدامضا / سفته */}
          {tribunalStep === 7 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت برگه‌های تسویه سفیدامضا یا سفته‌های حسن انجام کار چگونه است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'clean', label: 'خیر، هیچ‌گونه برگه سفیدامضا یا سفته‌ای داده نشده است' },
                  { id: 'guarantee_check_with_receipt', label: 'بله، سفته تضمین با ذکر شماره در قرارداد و اخذ رسید تحویل شده' },
                  { id: 'white_sign_risk', label: 'بله، قرارداد یا برگه تسویه حساب سفیدامضا و سفته بدون رسید اخذ شده (استناد به آرای دیوان)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasWhiteSign: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasWhiteSign === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۸: نحوه قطع همکاری - ماده ۲۱ */}
          {tribunalStep === 8 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">قطع همکاری و خاتمه رابطه کار شما به چه نحو صورت گرفته است؟ (ماده ۲۱)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'dismiss', label: 'اخراج مستقیم توسط کارفرما بدون رضایت کارگر (ماده ۱۶۵)' },
                  { id: 'resign', label: 'استعفای کتبی با رعایت تشریفات قانونی' },
                  { id: 'expire', label: 'اتمام مدت قرارداد موقت' },
                  { id: 'abandon', label: 'ترک کار ادعایی کارفرما' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, terminationType: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.terminationType === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۹: اخطار کتبی - ماده ۲۷ */}
          {tribunalStep === 9 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا پیش از قطع همکاری، اخطار کتبی عملکرد یا فرم کمیته انضباطی دریافت کرده‌اید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'no_notice', label: 'خیر، هیچ اخطار کتبی یا مستندات قصوری وجود ندارد (به نفع کارگر)' },
                  { id: 'has_disciplinary_notice', label: 'بله، اخطار کتبی یا آرای منفی کمیته انضباطی موجود است' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasWrittenNotice: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasWrittenNotice === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۰: شهود */}
          {tribunalStep === 10 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا شهود مطلع (همکاران شاغل یا سابق) جهت اثبات حضور در کارگاه دارید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'witness_available', label: 'بله، شهود معتبر با امکان حضور و گواهی در جلسه هیئت تشخیص آماده‌اند' },
                  { id: 'no_witness', label: 'خیر، هیچ شاهدی حاضر به ادای شهادت نیست' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasWitness: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasWitness === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۱: مدارک اضافه‌کار - ماده ۵۹ */}
          {tribunalStep === 11 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">مستندات شما برای اثبات اضافه‌کار و ساعات حضور در کارگاه چیست؟ (ماده ۵۹)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'overtime_records_valid', label: 'کارت‌ساعت فیزیکی، گزارش دستگاه تردد یا پرینت سامانه حضور و غیاب دارم' },
                  { id: 'overtime_no_doc', label: 'صرفاً ادعای شفاهی بدون سند کتبی یا کارت‌ساعت دارم' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasOvertimeRecords: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasOvertimeRecords === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۲: مرخصی - ماده ۶۶ */}
          {tribunalStep === 12 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">وضعیت ثبت مرخصی‌های استفاده‌نشده و مانده مرخصی چگونه است؟ (ماده ۶۶)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'leave_documented', label: 'درخواست‌های مرخصی و مانده ذخیره در پرونده کارگزینی ثبت است' },
                  { id: 'leave_undocumented', label: 'صرفاً تعداد روزهای ادعایی بدون ثبت کتبی در شرکت است' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasLeaveRecords: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasLeaveRecords === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۳: سنوات و عیدی */}
          {tribunalStep === 13 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">حق سنوات، عیدی و پاداش سالانه شما چگونه تسویه شده است؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'benefits_paid', label: 'به طور کامل با واریز بانکی مستند برای هر سال تسویه شده است' },
                  { id: 'benefits_unpaid', label: 'پرداخت نشده یا بخشی از آن به صورت دستی و بدون رسید معتبر است' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasBenevolence: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasBenevolence === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۴: سوابق شکایت */}
          {tribunalStep === 14 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا سابقه طرح دعوا یا شکایت قبلی در اداره کار علیه همین کارگاه دارید؟</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'no_prior_complaint', label: 'خیر، این اولین پرونده طرح شده علیه این کارگاه است' },
                  { id: 'prior_complaint_exists', label: 'بله، دارای سابقه سازش یا رای قطعی قبلی مرتبط هستم' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasComplaintHistory: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasComplaintHistory === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* گام ۱۵: توافق‌نامه دستی / ماده ۸ */}
          {tribunalStep === 15 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">آیا توافق‌نامه دستی یا تعهدنامه‌ای دال بر اسقاط حق شکایت امضا داده‌اید؟ (ماده ۸)</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'mou_none', label: 'خیر، هیچ‌گونه توافق‌نامه اسقاط حقی امضا نکرده‌ام' },
                  { id: 'mou_waiver', label: 'بله، تعهدنامه یا رضایت‌نامه محضری با شرط اسقاط حق شکایت اخذ شده (نیازمند استناد ماده ۸)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTribunalData(prev => ({ ...prev, hasMOU: opt.id }))}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${tribunalData.hasMOU === opt.id ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

                    {/* دکمه‌های ناوبری مراحل شبیه‌ساز */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={() => setTribunalStep(prev => Math.max(1, prev - 1))}
              disabled={tribunalStep === 1}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tribunalStep === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              مرحله قبل
            </button>

            {tribunalStep < 15 ? (
              <button
                type="button"
                onClick={() => setTribunalStep(prev => Math.min(15, prev + 1))}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-all shadow-sm"
              >
                مرحله بعد
              </button>
            ) : (
              <button
                type="button"
                onClick={calculateTribunal}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
              >
                <span>محاسبه نهایی نتیجه پرونده</span>
              </button>
            )}
          </div>
        </div>
      </div>
      )}

      {/* بخش نمایش نتیجه شبیه‌ساز (مرحله ۱۶) */}
      {tribunalStep === 16 && tribunalResult && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">نتیجه ارزیابی و تحلیل ریسک پرونده</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">بر اساس ۱۵ فاکتور قانونی و رویه هیئت‌های تشخیص</p>
            </div>
            <div className="text-left">
              <span className="text-3xl font-extrabold text-amber-600">{tribunalResult.score}</span>
              <span className="text-sm text-slate-400"> از ۱۰۰</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">توصیه حقوقی کارشناس:</h4>
            <p className="text-sm font-medium text-slate-700 dark:text-gray-300">{tribunalResult.status}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">تحلیل استناد قانونی:</h4>
            <ul className="space-y-2">
              {tribunalResult.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-gray-900/50 p-3 rounded-xl border border-slate-100 dark:border-gray-700">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setTribunalStep(1);
                setTribunalResult(null);
              }}
              className="px-6 py-2.5 bg-slate-800 dark:bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-slate-900 dark:hover:bg-gray-600 transition-all"
            >
              شروع مجدد ارزیابی
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
    </>
  );
}
