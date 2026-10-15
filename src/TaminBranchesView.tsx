// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE, ProvinceMapData } from './taminData';

export const TaminBranchesView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('tehran');
  const [branchSearch, setBranchSearch] = useState<string>('');

  const currentProvince = useMemo(() => {
    return IRAN_PROVINCES_COMPLETE.find(p => p.id === selectedId || p.mapKey === selectedId) || IRAN_PROVINCES_COMPLETE[0];
  }, [selectedId]);

  const filteredBranches = useMemo(() => {
    if (!branchSearch.trim()) return currentProvince.branches;
    return currentProvince.branches.filter(b =>
      b.name.includes(branchSearch) ||
      b.city.includes(branchSearch) ||
      b.address.includes(branchSearch) ||
      b.code.includes(branchSearch)
    );
  }, [currentProvince, branchSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* کارت انتخاب سریع استان */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <span>اطلس شعب و مراکز تأمین اجتماعی</span>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-100">
            ۳۱ استان کامل
          </span>
        </div>

        {/* سلکتور دراپ‌داون + جستجو */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">انتخاب استان:</label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setBranchSearch('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {IRAN_PROVINCES_COMPLETE.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  استان {prov.name} ({prov.branchCount} شعبه)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">جستجوی شعبه در این استان:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="نام شعبه، شهر، آدرس..."
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-10 pl-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>
        </div>

        {/* دکمه‌های سریع استان‌های پرتردد */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-400 block mb-2">دسترسی سریع به کلان‌شهرها:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'tehran', name: 'تهران' },
              { id: 'isfahan', name: 'اصفهان' },
              { id: 'fars', name: 'فارس (شیراز)' },
              { id: 'khorasan_razavi', name: 'خراسان رضوی' },
              { id: 'east_azerbaijan', name: 'آذربایجان شرقی' },
              { id: 'khuzestan', name: 'خوزستان' },
              { id: 'alborz', name: 'البرز' }
            ].map(fastProv => (
              <button
                key={fastProv.id}
                type="button"
                onClick={() => {
                  setSelectedId(fastProv.id);
                  setBranchSearch('');
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedId === fastProv.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fastProv.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* لیست شعب استان انتخاب شده */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-800 text-base">
              شعب استان {currentProvince.name}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {filteredBranches.length} مرکز فعال
          </span>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm">
            هیچ شعبه‌ای مطابق با جستجوی شما یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBranches.map((branch, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{branch.name}</h4>
                    <span className="text-[11px] text-slate-400 font-semibold">شهر: {branch.city}</span>
                  </div>
                  <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-100">
                    کد {branch.code}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  {branch.address}
                </p>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>فعال و پاسخگو</span>
                  </div>
                  <a
                    href={`tel:${branch.tel.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors dir-ltr"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{branch.tel}</span>
                  </a>
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
