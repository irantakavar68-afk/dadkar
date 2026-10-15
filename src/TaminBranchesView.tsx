// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle, Navigation } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE } from './data/taminData';

export const TaminBranchesView: React.FC = () => {
  // استان انتخابی بر اساس فیلد id موجود در taminData
  const [selectedId, setSelectedId] = useState<string>(() => {
    return IRAN_PROVINCES_COMPLETE[0]?.id || 'tehran';
  });
  const [branchSearch, setBranchSearch] = useState<string>('');
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // استان جاری
  const currentProvince = useMemo(() => {
    return (
      IRAN_PROVINCES_COMPLETE.find((p: any) => p.id === selectedId) ||
      IRAN_PROVINCES_COMPLETE[0]
    );
  }, [selectedId]);

  // فیلتر شعب
  const filteredBranches = useMemo(() => {
    const branches = currentProvince?.branches || [];
    if (!branchSearch.trim()) return branches;
    const term = branchSearch.trim().toLowerCase();
    return branches.filter(
      (b: any) =>
        (b.name && b.name.toLowerCase().includes(term)) ||
        (b.city && b.city.toLowerCase().includes(term)) ||
        (b.address && b.address.toLowerCase().includes(term)) ||
        (b.code && String(b.code).includes(term))
    );
  }, [currentProvince, branchSearch]);

  if (!IRAN_PROVINCES_COMPLETE || IRAN_PROVINCES_COMPLETE.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 font-['Vazirmatn']" dir="rtl">
        داده‌های استان‌ها بارگذاری نشد. لطفاً فایل taminData.ts را بررسی کنید.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14 font-['Vazirmatn'] text-slate-800" dir="rtl">
      {/* هدر بخش نقشه */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">اطلس شعب تأمین اجتماعی ایران</h2>
              <p className="text-[11px] text-slate-400 font-normal">انتخاب استان از روی نقشه وکتور</p>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full border border-blue-100/60 inline-block">
              استان انتخابی: {currentProvince?.name}
            </span>
          </div>
        </div>

        {/* کادر نقشه وکتور */}
        <div className="relative w-full bg-slate-950 rounded-2xl p-3 md:p-4 overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
          
          <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-slate-200 border border-slate-700/60 shadow-lg">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>{hoveredName ? `استان: ${hoveredName}` : 'روی استان مورد نظر کلیک کنید'}</span>
          </div>

          <svg
            viewBox="0 0 798 724"
            className="w-full max-w-2xl h-auto select-none"
          >
            {/* پهنه‌های آبی */}
            <g id="water-bodies" className="pointer-events-none">
              <path
                d="M 245 40 Q 380 90 520 85 L 540 185 Q 430 195 305 180 Q 255 140 235 95 Z"
                fill="#0284c7"
                fillOpacity="0.25"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text x="380" y="130" fill="#7dd3fc" fontSize="13" fontWeight="bold" textAnchor="middle" opacity="0.8">
                دریای خزر
              </text>

              <path
                d="M 230 520 Q 320 590 440 635 Q 560 670 730 670 L 730 720 L 210 720 Z"
                fill="#0284c7"
                fillOpacity="0.25"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text x="360" y="665" fill="#7dd3fc" fontSize="13" fontWeight="bold" textAnchor="middle" opacity="0.8">
                خلیج فارس
              </text>
            </g>

            {/* لایه استان‌ها مستقیم از IRAN_PROVINCES_COMPLETE */}
            <g id="provinces-layer">
              {IRAN_PROVINCES_COMPLETE.map((prov: any) => {
                const isSelected = String(prov.id).toLowerCase() === String(selectedId).toLowerCase();
                const pathData = prov.svgPath || prov.path || '';

                if (!pathData) return null;

                return (
                  <path
                    key={prov.id}
                    d={pathData}
                    onClick={() => {
                      setSelectedId(prov.id);
                      setBranchSearch('');
                    }}
                    onMouseEnter={() => setHoveredName(prov.name)}
                    onMouseLeave={() => setHoveredName(null)}
                    className={`cursor-pointer transition-all duration-200 outline-none ${
                      isSelected
                        ? 'fill-blue-600 stroke-amber-300 stroke-[2.2] drop-shadow-[0_0_12px_rgba(37,99,235,0.95)]'
                        : 'fill-slate-800/90 hover:fill-blue-950/80 stroke-slate-700 hover:stroke-cyan-400 stroke-[1]'
                    }`}
                  >
                    <title>{prov.name}</title>
                  </path>
                );
              })}
            </g>
          </svg>
        </div>

        {/* لیست افقی اسامی استان‌ها برای دسترسی سریع بدون خطا */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {IRAN_PROVINCES_COMPLETE.map((prov: any) => {
            const isSelected = String(prov.id).toLowerCase() === String(selectedId).toLowerCase();
            return (
              <button
                key={prov.id}
                onClick={() => {
                  setSelectedId(prov.id);
                  setBranchSearch('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {prov.name}
              </button>
            );
          })}
        </div>

        {/* سرچ باکس شعب */}
        <div className="relative">
          <input
            type="text"
            placeholder={`جستجو در شعب استان ${currentProvince?.name || ''}...`}
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl py-3 pr-10 pl-4 text-xs md:text-sm outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          {branchSearch && (
            <button
              onClick={() => setBranchSearch('')}
              className="absolute left-3 top-3 text-[11px] text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full px-2 py-0.5"
            >
              پاک کردن
            </button>
          )}
        </div>
      </div>

      {/* لیست شعب استان */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-sm md:text-base">
              فهرست شعب تأمین اجتماعی {currentProvince?.name}
            </h3>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">
            {filteredBranches.length} مرکز فعال
          </span>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-400 text-xs">
            شعبه‌ای مطابق با عبارت «{branchSearch}» در استان {currentProvince?.name} یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredBranches.map((branch: any) => (
              <div
                key={branch.code || branch.name}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{branch.name}</h4>
                    {branch.code && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                        کد {branch.code}
                      </span>
                    )}
                  </div>
                  {branch.city && (
                    <div className="text-[11px] text-blue-600 font-medium">
                      شهرستان / حوزه: {branch.city}
                    </div>
                  )}
                  {branch.address && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/70">
                      {branch.address}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> شعبه فعال
                  </span>
                  {branch.tel && (
                    <a
                      href={`tel:${String(branch.tel).replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                      dir="ltr"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{branch.tel}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaminBranchesView;
