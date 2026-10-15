// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle, Navigation } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE, IranProvinceKey, TaminProvince } from './data/taminData';
import iranRawJson from './data/Iran.json';

// جدول نگاشت جامع برای یکسان‌سازی کلیدهای Iran.json با IranProvinceKey در taminData
const PROVINCE_MAPPER: Record<string, IranProvinceKey> = {
  'tehran': 'tehran',
  'isfahan': 'isfahan',
  'esfahan': 'isfahan',
  'fars': 'fars',
  'khorasan razavi': 'razaviKhorasan',
  'razavi khorasan': 'razaviKhorasan',
  'khorasan-e razavi': 'razaviKhorasan',
  'east azarbaijan': 'eastAzerbaijan',
  'east azerbaijan': 'eastAzerbaijan',
  'west azarbaijan': 'westAzerbaijan',
  'west azerbaijan': 'westAzerbaijan',
  'khuzestan': 'khuzestan',
  'alborz': 'alborz',
  'gilan': 'gilan',
  'mazandaran': 'mazandaran',
  'kerman': 'kerman',
  'ardabil': 'ardabil',
  'ardebil': 'ardabil',
  'zanjan': 'zanjan',
  'qazvin': 'qazvin',
  'markazi': 'markazi',
  'qom': 'qom',
  'hamedan': 'hamedan',
  'hamadan': 'hamedan',
  'kermanshah': 'kermanshah',
  'kurdistan': 'kurdistan',
  'kordestan': 'kurdistan',
  'lorestan': 'lorestan',
  'ilam': 'ilam',
  'chahar mahall and bakhtiari': 'chaharmahalAndBakhtiari',
  'chaharmahal and bakhtiari': 'chaharmahalAndBakhtiari',
  'chahar mahal va bakhtiari': 'chaharmahalAndBakhtiari',
  'kohgiluyeh and boyer-ahmad': 'kohgiluyehAndBoyerAhmad',
  'kohgiluyeh and boyer ahmad': 'kohgiluyehAndBoyerAhmad',
  'kohgiluyeh': 'kohgiluyehAndBoyerAhmad',
  'boyer-ahmad': 'kohgiluyehAndBoyerAhmad',
  'bushehr': 'bushehr',
  'semnan': 'semnan',
  'golestan': 'golestan',
  'north khorasan': 'northKhorasan',
  'south khorasan': 'southKhorasan',
  'yazd': 'yazd',
  'sistan and baluchestan': 'sistanAndBaluchestan',
  'hormozgan': 'hormozgan',
};

// نگاشت بر اساس کلیدهای استاندارد ISO
const ISO_MAPPER: Record<string, IranProvinceKey> = {
  'IR-01': 'gilan',
  'IR-02': 'mazandaran',
  'IR-03': 'eastAzerbaijan',
  'IR-04': 'westAzerbaijan',
  'IR-05': 'kermanshah',
  'IR-06': 'khuzestan',
  'IR-07': 'fars',
  'IR-08': 'kerman',
  'IR-09': 'razaviKhorasan',
  'IR-10': 'isfahan',
  'IR-11': 'sistanAndBaluchestan',
  'IR-12': 'kurdistan',
  'IR-13': 'hamedan',
  'IR-14': 'chaharmahalAndBakhtiari',
  'IR-15': 'lorestan',
  'IR-16': 'ilam',
  'IR-17': 'kohgiluyehAndBoyerAhmad',
  'IR-18': 'bushehr',
  'IR-19': 'zanjan',
  'IR-20': 'semnan',
  'IR-21': 'yazd',
  'IR-22': 'hormozgan',
  'IR-23': 'tehran',
  'IR-24': 'ardabil',
  'IR-25': 'qom',
  'IR-26': 'qazvin',
  'IR-27': 'golestan',
  'IR-28': 'northKhorasan',
  'IR-29': 'southKhorasan',
  'IR-30': 'alborz',
  'IR-31': 'kohgiluyehAndBoyerAhmad',
  'IR-00': 'markazi',
};

// مختصات دقیق، استاندارد و بدون تداخل مرکز استان‌ها منطبق بر ویوباکس 798x724
const PROVINCE_CENTERS: Record<IranProvinceKey, { x: number; y: number }> = {
  westAzerbaijan: { x: 92, y: 135 },
  eastAzerbaijan: { x: 172, y: 110 },
  ardabil: { x: 228, y: 88 },
  gilan: { x: 288, y: 148 },
  zanjan: { x: 218, y: 182 },
  kurdistan: { x: 148, y: 228 },
  kermanshah: { x: 135, y: 300 },
  ilam: { x: 130, y: 375 },
  lorestan: { x: 215, y: 345 },
  hamedan: { x: 218, y: 268 },
  markazi: { x: 285, y: 285 },
  qom: { x: 335, y: 275 },
  tehran: { x: 348, y: 215 },
  alborz: { x: 312, y: 202 },
  qazvin: { x: 275, y: 205 },
  mazandaran: { x: 368, y: 165 },
  golestan: { x: 472, y: 148 },
  semnan: { x: 450, y: 250 },
  northKhorasan: { x: 558, y: 142 },
  razaviKhorasan: { x: 642, y: 242 },
  southKhorasan: { x: 628, y: 405 },
  isfahan: { x: 345, y: 370 },
  chaharmahalAndBakhtiari: { x: 285, y: 420 },
  khuzestan: { x: 215, y: 460 },
  kohgiluyehAndBoyerAhmad: { x: 300, y: 470 },
  bushehr: { x: 295, y: 565 },
  fars: { x: 395, y: 525 },
  yazd: { x: 465, y: 390 },
  kerman: { x: 535, y: 515 },
  hormozgan: { x: 505, y: 640 },
  sistanAndBaluchestan: { x: 685, y: 550 },
};

interface ParsedMapProvince {
  mapKey: IranProvinceKey;
  pathD: string;
  name: string;
}

export const TaminBranchesView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<IranProvinceKey>('tehran');
  const [branchSearch, setBranchSearch] = useState<string>('');
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // استخراج مسیرهای وکتور
  const vectorProvinces = useMemo<ParsedMapProvince[]>(() => {
    const list: ParsedMapProvince[] = [];
    const rawData = iranRawJson as Record<string, any>;

    Object.keys(rawData).forEach((rawKey) => {
      const item = rawData[rawKey];
      if (!item) return;

      const pathD =
        item.path?.med_res ||
        item.path?.high_res ||
        item.med_res ||
        item.high_res ||
        (typeof item.path === 'string' ? item.path : '');
      if (!pathD) return;

      const nameEn = (item.name_en || '').toLowerCase().trim();
      const isoId = (item.id || '').toUpperCase().trim();
      const rawKeyLower = rawKey.toLowerCase().trim();

      const resolvedKey: IranProvinceKey =
        PROVINCE_MAPPER[nameEn] ||
        ISO_MAPPER[isoId] ||
        PROVINCE_MAPPER[rawKeyLower] ||
        (rawKey as IranProvinceKey);

      const provinceInfo = IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === resolvedKey);
      const displayName = provinceInfo ? provinceInfo.name : (item.name_fa || item.name_en || rawKey);

      list.push({
        mapKey: resolvedKey,
        pathD,
        name: displayName,
      });
    });

    return list;
  }, []);

  const currentProvince: TaminProvince = useMemo(() => {
    return IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === selectedKey) || IRAN_PROVINCES_COMPLETE[0];
  }, [selectedKey]);

  const filteredBranches = useMemo(() => {
    if (!branchSearch.trim()) return currentProvince.branches;
    const term = branchSearch.trim().toLowerCase();
    return currentProvince.branches.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.city.toLowerCase().includes(term) ||
        b.address.toLowerCase().includes(term) ||
        b.code.includes(term)
    );
  }, [currentProvince, branchSearch]);

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
              <p className="text-[11px] text-slate-400 font-normal">انتخاب استان از روی نقشه تعاملی وکتور</p>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full border border-blue-100/60 inline-block">
              استان انتخابی: {currentProvince.name}
            </span>
          </div>
        </div>

        {/* کادر اصلی نقشه جغرافیایی وکتور */}
        <div className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-xl flex flex-col items-center justify-center">
          
          {/* تولتیپ شناور */}
          <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-slate-200 border border-slate-700/50">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>{hoveredProvince ? `استان: ${hoveredProvince}` : 'روی استان مورد نظر ضربه بزنید'}</span>
          </div>

          <svg
            viewBox="0 0 798 724"
            className="w-full max-w-xl h-auto select-none transition-transform duration-300 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            {/* ۱. لایه اشکال استان‌ها */}
            <g id="provinces-layer">
              {vectorProvinces.map((item, index) => {
                const isSelected = selectedKey === item.mapKey;
                return (
                  <path
                    key={`${item.mapKey}-${index}`}
                    d={item.pathD}
                    onClick={() => {
                      setSelectedKey(item.mapKey);
                      setBranchSearch('');
                    }}
                    onMouseEnter={() => setHoveredProvince(item.name)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    className={`cursor-pointer transition-all duration-200 outline-none ${
                      isSelected
                        ? 'fill-blue-500 stroke-white stroke-[2] drop-shadow-[0_0_12px_rgba(59,130,246,0.9)]'
                        : 'fill-slate-800 hover:fill-blue-900/60 stroke-slate-700/80 hover:stroke-blue-400 stroke-[1]'
                    }`}
                  >
                    <title>{item.name}</title>
                  </path>
                );
              })}
            </g>

            {/* ۲. لایه اسامی استان‌ها با مختصات استاندارد و بدون خطا */}
            <g id="province-labels" className="pointer-events-none select-none">
              {vectorProvinces.map((item, index) => {
                const coords = PROVINCE_CENTERS[item.mapKey];
                if (!coords) return null;

                const isSelected = selectedKey === item.mapKey;
                return (
                  <text
                    key={`label-${item.mapKey}-${index}`}
                    x={coords.x}
                    y={coords.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold pointer-events-none"
                    fontSize={isSelected ? 10.5 : 8.5}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    stroke={isSelected ? '#0f172a' : '#020617'}
                    strokeWidth={isSelected ? 2.5 : 1.8}
                    paintOrder="stroke fill"
                  >
                    {item.name}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>

        {/* جستجوگر در شعب استان انتخابی */}
        <div className="relative">
          <input
            type="text"
            placeholder={`جستجو در شعب استان ${currentProvince.name} (نام شعبه، شهر، آدرس، کد شعبه)...`}
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl py-3 pr-10 pl-4 text-xs md:text-sm outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          {branchSearch && (
            <button
              onClick={() => setBranchSearch('')}
              className="absolute left-3 top-3 text-[11px] text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full px-2 py-0.5"
            >
              پاک کردن
            </button>
          )}
        </div>
      </div>

      {/* اطلاعات استان و فهرست شعب */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-sm md:text-base">
              فهرست شعب تأمین اجتماعی {currentProvince.name}
            </h3>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">
            {filteredBranches.length} مرکز فعال
          </span>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-400 text-xs">
            شعبه‌ای مطابق با عبارت «{branchSearch}» در استان {currentProvince.name} یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredBranches.map((branch) => (
              <div
                key={branch.code}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{branch.name}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                      کد {branch.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium">
                    شهرستان / حوزه: {branch.city}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/70">
                    {branch.address}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> شعبه فعال اجرایی
                  </span>
                  <a
                    href={`tel:${branch.tel.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors duration-150"
                    dir="ltr"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
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
