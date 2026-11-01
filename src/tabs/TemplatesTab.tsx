import React from 'react';
import { FileText, Search, ChevronDown, X, Check, Copy } from 'lucide-react';
import { ALL_TEMPLATES } from '../appData';

export default function TemplatesTab(props: any) {
  const { copiedTemplateId, copyTemplateContent, selectedTemplateCategory, setSelectedTemplateCategory, setTemplateSearchQuery, setTemplateVisibleCount, templateListRef, templateLoadStep, templateSearchQuery, templateVisibleCount } = props;
  return (
    <>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-slate-800">مخزن ۱۰۵ قالب رسمی و قراردادهای کار</h2>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  {ALL_TEMPLATES.length} قالب آماده
                </span>
              </div>

              {/* نوار جستجوی زنده: عنوان، توضیحات، متن و تگ‌ها */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجوی زنده در عنوان، توضیحات، متن قالب و تگ‌ها..."
                  value={templateSearchQuery}
                  onChange={(e) => { setTemplateSearchQuery(e.target.value); setTemplateVisibleCount(10); }}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                {templateSearchQuery && (
                  <button
                    onClick={() => { setTemplateSearchQuery(''); setTemplateVisibleCount(10); }}
                    className="absolute left-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* دسته‌بندی‌ها با شمارنده تعداد قالب‌ها */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none font-bold">
                {[
                  { id: 'all', label: 'همه قالب‌ها' },
                  { id: 'contracts', label: 'قراردادها' },
                  { id: 'petitions', label: 'دادخواست‌ها' },
                  { id: 'letters', label: 'نامه‌ها' },
                  { id: 'settlements', label: 'تسویه‌حساب' },
                  { id: 'retirement', label: 'بازنشستگی' },
                  { id: 'unemployment', label: 'بیکاری' },
                  { id: 'appeals', label: 'ماده ۱۴۸' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedTemplateCategory(c.id); setTemplateVisibleCount(10); }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                      selectedTemplateCategory === c.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                    <span className={`mr-1.5 px-1.5 py-0.5 rounded-md text-[9px] ${
                      selectedTemplateCategory === c.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {c.id === 'all'
                        ? ALL_TEMPLATES.length
                        : ALL_TEMPLATES.filter(t => t.category === c.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* لیست اسناد و قالب‌ها با جستجوی زنده، هشتگ کلیک‌پذیر و Load More */}
            <div className="space-y-3" ref={templateListRef}>
              {(() => {
                const normalizedQuery = templateSearchQuery.trim();
                const filtered = ALL_TEMPLATES
                  .filter(t => selectedTemplateCategory === 'all' || t.category === selectedTemplateCategory)
                  .filter(t =>
                    !normalizedQuery ||
                    (t.title && t.title.includes(normalizedQuery)) ||
                    (t.description && t.description.includes(normalizedQuery)) ||
                    (t.content && t.content.includes(normalizedQuery)) ||
                    (t.tags && t.tags.some(tag => tag.includes(normalizedQuery)))
                  );
                const visible = filtered.slice(0, templateVisibleCount);
                return (
                  <>
                    {visible.map(tmpl => (
                      <div key={tmpl.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                              {tmpl.categoryLabel}
                            </span>
                            <h3 className="font-bold text-slate-800 text-sm mt-1">{tmpl.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
                          </div>
                          <button
                            onClick={() => copyTemplateContent(tmpl)}
                            className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                              copiedTemplateId === tmpl.id 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            {copiedTemplateId === tmpl.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedTemplateId === tmpl.id ? 'کپی شد' : 'کپی متن'}
                          </button>
                        </div>

                        <div className="relative rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden">
                          <button
                            onClick={() => copyTemplateContent(tmpl)}
                            aria-label={copiedTemplateId === tmpl.id ? 'متن کپی شد' : 'کپی متن قالب'}
                            className={`absolute left-2 top-2 z-10 p-2 rounded-lg shadow transition ${copiedTemplateId === tmpl.id ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-blue-600 text-white'}`}
                          >
                            {copiedTemplateId === tmpl.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 pl-14 pt-12 text-xs leading-7 tabular-nums select-text" dir="rtl">{tmpl.content}</pre>
                        </div>

                        {/* هشتگ‌های کلیک‌پذیر: فیلتر آنی + اسکرول به ابتدای لیست */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tmpl.tags.map((tag, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setTemplateSearchQuery(tag);
                                setTemplateVisibleCount(10);
                                if (templateListRef.current) {
                                  templateListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded-md transition ${
                                templateSearchQuery === tag
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {filtered.length === 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                        موردی مطابق جستجوی شما یافت نشد.
                      </div>
                    )}

                    {/* دکمه نمایش موارد بیشتر (Load More) برای رندر روان روی موبایل */}
                    {templateVisibleCount < filtered.length && (
                      <button
                        onClick={() => setTemplateVisibleCount(prev => prev + templateLoadStep)}
                        className="w-full py-3 bg-white border border-blue-200 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-50 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <ChevronDown className="w-4 h-4" />
                        نمایش موارد بیشتر ({filtered.length - templateVisibleCount} قالب باقی‌مانده)
                      </button>
                    )}

                    <p className="text-center text-[10px] text-slate-400">
                      نمایش {visible.length} از {filtered.length} قالب
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
    </>
  );
}
