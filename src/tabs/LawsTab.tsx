import React from 'react';
import { Search, BookOpen, ChevronDown, X } from 'lucide-react';
import { EXTRACTED_LAWS } from '../appData';

export default function LawsTab(props: any) {
  const { lawSearchQuery, lawVisibleCount, selectedLawCategory, setLawSearchQuery, setLawVisibleCount, setSelectedLawCategory } = props;
  return (
    <>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800">پایگاه جامع قوانین و مقررات</h2>
                </div>
                <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  {EXTRACTED_LAWS.length} ماده قانونی
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجو در مواد قوانین کار، تأمین اجتماعی و کلمات کلیدی..."
                  value={lawSearchQuery}
                  onChange={(e) => { setLawSearchQuery(e.target.value); setLawVisibleCount(10); }}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                {lawSearchQuery && (
                  <button
                    onClick={() => { setLawSearchQuery(''); setLawVisibleCount(10); }}
                    className="absolute left-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
                {['همه قوانین', 'حقوق و دستمزد', 'بازنشستگی و ازکارافتادگی', 'بیمه بیکاری', 'مراجع حل اختلاف', 'حوادث ناشی از کار', 'مرخصی و ساعات کار', 'قراردادها و اخراج'].map(category => {
                  const categoryTerms: Record<string, string[]> = {
                    'حقوق و دستمزد': ['حقوق', 'مزد', 'دستمزد', 'عیدی', 'سنوات', 'حق‌السعی', 'اضافه‌کاری', 'مزایا'],
                    'بازنشستگی و ازکارافتادگی': ['بازنشستگی', 'ازکارافتادگی', 'مستمری', 'بازماندگان'],
                    'بیمه بیکاری': ['بیکاری', 'مقرری'],
                    'مراجع حل اختلاف': ['هیأت تشخیص', 'هیأت حل اختلاف', 'حل اختلاف', 'ماده ۱۵۷', 'ماده ۱۵۹'],
                    'حوادث ناشی از کار': ['حادثه', 'حوادث', 'ایمنی', 'ماده ۹۱', 'ماده ۹۵'],
                    'مرخصی و ساعات کار': ['مرخصی', 'ساعات کار', 'اضافه‌کاری', 'نوبت‌کاری', 'تعطیل', 'ماده ۶۴', 'ماده ۵۹'],
                    'قراردادها و اخراج': ['قرارداد', 'اخراج', 'فسخ', 'استعفا', 'ماده ۱۰', 'ماده ۲۱', 'ماده ۲۷']
                  };
                  const matchesCategory = (item: any) => {
                    if (category === 'همه قوانین') return true;
                    const terms = categoryTerms[category] || [];
                    const haystack = [item.category, item.title, item.subject, item.content, ...(Array.isArray(item.tags) ? item.tags : [])].filter(Boolean).join(' ');
                    return terms.some(term => haystack.includes(term));
                  };
                  const count = EXTRACTED_LAWS.filter(matchesCategory).length;
                  return <button key={category} onClick={() => { setSelectedLawCategory(category); setLawVisibleCount(10); }} className={`whitespace-nowrap px-3 py-1.5 rounded-full border font-bold transition ${selectedLawCategory === category ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50'}`}>
                    {category}<span className={`mr-1.5 px-1.5 rounded-full ${selectedLawCategory === category ? 'bg-white/20' : 'bg-slate-200'}`}>{count}</span>
                  </button>;
                })}
              </div>
            </div>

            <div className="space-y-3">
              {(() => {
                const nq = lawSearchQuery.trim();
                const categoryTerms: Record<string, string[]> = {
                  'حقوق و دستمزد': ['حقوق', 'مزد', 'دستمزد', 'عیدی', 'سنوات', 'حق‌السعی', 'اضافه‌کاری', 'مزایا'],
                  'بازنشستگی و ازکارافتادگی': ['بازنشستگی', 'ازکارافتادگی', 'مستمری', 'بازماندگان'],
                  'بیمه بیکاری': ['بیکاری', 'مقرری'],
                  'مراجع حل اختلاف': ['هیأت تشخیص', 'هیأت حل اختلاف', 'حل اختلاف', 'ماده ۱۵۷', 'ماده ۱۵۹'],
                  'حوادث ناشی از کار': ['حادثه', 'حوادث', 'ایمنی', 'ماده ۹۱', 'ماده ۹۵'],
                  'مرخصی و ساعات کار': ['مرخصی', 'ساعات کار', 'اضافه‌کاری', 'نوبت‌کاری', 'تعطیل', 'ماده ۶۴', 'ماده ۵۹'],
                  'قراردادها و اخراج': ['قرارداد', 'اخراج', 'فسخ', 'استعفا', 'ماده ۱۰', 'ماده ۲۱', 'ماده ۲۷']
                };
                const categoryFilter = (item: any) => {
                  if (selectedLawCategory === 'همه قوانین') return true;
                  const haystack = [item.category, item.title, item.subject, item.content, ...(Array.isArray(item.tags) ? item.tags : [])].filter(Boolean).join(' ');
                  return (categoryTerms[selectedLawCategory] || []).some(term => haystack.includes(term));
                };
                const filteredLaws = EXTRACTED_LAWS
                  .filter(categoryFilter)
                  .filter(item =>
                    !nq ||
                    (item.title && item.title.includes(nq)) || 
                    (item.content && item.content.includes(nq)) ||
                    (item.id && item.id.includes(nq)) ||
                    (item.subject && item.subject.includes(nq)) ||
                    (item.tags && item.tags.some((tag: string) => tag.includes(nq)))
                  );
                const visibleLaws = filteredLaws.slice(0, lawVisibleCount);
                return (
                  <>
                   {visibleLaws.map((law, idx) => {
                      // استخراج شماره و ارجاع فارسی
                      const idStr = String(law.id || '');
                      const numMatch = idStr.match(/\d+/);
                      const numFa = numMatch ? Number(numMatch[0]).toLocaleString('fa-IR') : `${idx + 1}`.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
                      
                      let refName = 'قانون کار';
                      let catFa = 'قانون کار';
                      if (idStr.startsWith('tam-') || idStr.startsWith('ss-') || law.category === 'tamin') {
                        refName = 'قانون تأمین اجتماعی';
                        catFa = 'تأمین اجتماعی';
                      } else if (idStr.startsWith('unemp-') || law.category === 'unemployment') {
                        refName = 'قانون بیمه بیکاری';
                        catFa = 'بیمه بیکاری';
                      } else if (idStr.startsWith('crt-') || law.category === 'court') {
                        refName = 'آرای دیوان و مراجع حل اختلاف';
                        catFa = 'مراجع حل اختلاف';
                      }
                    
                      const subtitle = `ماده ${numFa} ${refName}`;
                      const displayTitle = (law.title && !/^[a-z]+-\d+$/i.test(law.title) && !/^[a-z_]+$/i.test(law.title))
                        ? law.title
                        : (law.subject && !/^[a-z_]+$/i.test(law.subject))
                          ? law.subject
                          : subtitle;
                    
                      return (
                        <div key={law.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                              {catFa}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-800">{displayTitle}</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{law.content}</p>
                    
                          {/* هشتگ‌های قوانین */}
                          {law.tags && law.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {law.tags.map((tag: string, tIdx: number) => (
                                <button
                                  key={tIdx}
                                  onClick={() => { setLawSearchQuery(tag); setLawVisibleCount(10); }}
                                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md hover:bg-blue-100 hover:text-blue-700 transition"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}



                    {filteredLaws.length === 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                        موردی مطابق جستجوی شما یافت نشد.
                      </div>
                    )}

                    {/* صفحه‌بندی / Load More برای ۳۰۰ قانون */}
                    {lawVisibleCount < filteredLaws.length && (
                      <button
                        onClick={() => setLawVisibleCount(prev => prev + 10)}
                        className="w-full py-3 bg-white border border-blue-200 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-50 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <ChevronDown className="w-4 h-4" />
                        نمایش موارد بیشتر ({filteredLaws.length - lawVisibleCount} ماده باقی‌مانده)
                      </button>
                    )}

                    <p className="text-center text-[10px] text-slate-400">
                      نمایش {visibleLaws.length} از {filteredLaws.length} ماده قانونی
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
    </>
  );
}
