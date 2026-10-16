// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle, Navigation } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE, IranProvinceKey, ProvinceMapData } from './data/taminData';
import iranRawJson from './data/Iran.json';

// جدول تطبیق دقیق کلیدهای فایل Iran.json با تایپ رسمی IranProvinceKey
const RAW_KEY_TO_PROVINCE_KEY: Record<string, IranProvinceKey> = {
  // کدهای ۳ حرفی موجود در Iran.json
  'waz': 'westAzerbaijan',
  'eaz': 'eastAzerbaijan',
  'ard': 'ardabil',
  'esf': 'isfahan',
  'alb': 'alborz',
  'ilm': 'ilam',
  'bsh': 'bushehr',
  'teh': 'tehran',
  'cmb': 'chaharmahalAndBakhtiari',
  'skh': 'southKhorasan',
  'rkh': 'razaviKhorasan',
  'nkh': 'northKhorasan',
  'khz': 'khuzestan',
  'zan': 'zanjan',
  'sem': 'semnan',
  'snb': 'sistanAndBaluchestan',
  'far': 'fars',
  'qaz': 'qazvin',
  'qom': 'qom',
  'krd': 'kurdistan',
  'krn': 'kerman',
  'krm': 'kermanshah',
  'kba': 'kohgiluyehAndBoyerAhmad',
  'gol': 'golestan',
  'gil': 'gilan',
  'lor': 'lorestan',
  'maz': 'mazandaran',
  'mar': 'markazi',
  'hor': 'hormozgan',
  'ham': 'hamedan',
  'yzd': 'yazd',

  // کدهای ISO استاندارد
  'ir-01': 'westAzerbaijan',
  'ir-02': 'eastAzerbaijan',
  'ir-03': 'ardabil',
  'ir-04': 'isfahan',
  'ir-05': 'alborz',
  'ir-06': 'ilam',
  'ir-07': 'bushehr',
  'ir-08': 'tehran',
  'ir-09': 'chaharmahalAndBakhtiari',
  'ir-10': 'southKhorasan',
  'ir-11': 'razaviKhorasan',
  'ir-12': 'northKhorasan',
  'ir-13': 'khuzestan',
  'ir-14': 'zanjan',
  'ir-15': 'semnan',
  'ir-16': 'sistanAndBaluchestan',
  'ir-17': 'fars',
  'ir-18': 'qazvin',
  'ir-19': 'qom',
  'ir-20': 'kurdistan',
  'ir-21': 'kerman',
  'ir-22': 'kermanshah',
  'ir-23': 'kohgiluyehAndBoyerAhmad',
  'ir-24': 'golestan',
  'ir-25': 'gilan',
  'ir-26': 'lorestan',
  'ir-27': 'mazandaran',
  'ir-28': 'markazi',
  'ir-29': 'hormozgan',
  'ir-30': 'hamedan',
  'ir-31': 'yazd',
};

// مختصات بهینه‌شده نام‌ها در مقیاس SVG نقشه ایران (viewBox: 0 0 798 724)
const PROVINCE_LABEL_SETTINGS: Record<IranProvinceKey, { x: number; y: number; fs: number; short?: string }> = {
  westAzerbaijan: { x: 95, y: 155, fs: 7.2, short: 'آذربایجان غربی' },
  eastAzerbaijan: { x: 172, y: 102, fs: 7.2, short: 'آذربایجان شرقی' },
  ardabil: { x: 232, y: 88, fs: 7.0 },
  gilan: { x: 288, y: 148, fs: 7.0 },
  zanjan: { x: 215, y: 182, fs: 7.0 },
  kurdistan: { x: 145, y: 232, fs: 7.2, short: 'کردستان' },
  kermanshah: { x: 135, y: 300, fs: 7.0 },
  ilam: { x: 122, y: 365, fs: 6.8 },
  lorestan: { x: 212, y: 345, fs: 7.2 },
  hamedan: { x: 220, y: 268, fs: 7.0 },
  markazi: { x: 285, y: 282, fs: 7.2 },
  qom: { x: 340, y: 278, fs: 6.8 },
  tehran: { x: 350, y: 220, fs: 7.0 },
  alborz: { x: 312, y: 202, fs: 6.0 },
  qazvin: { x: 272, y: 212, fs: 6.8 },
  mazandaran: { x: 370, y: 168, fs: 7.2 },
  golestan: { x: 470, y: 145, fs: 7.2 },
  semnan: { x: 450, y: 238, fs: 8.0 },
  northKhorasan: { x: 558, y: 140, fs: 7.0, short: 'خراسان شمالی' },
  razaviKhorasan: { x: 638, y: 235, fs: 7.8, short: 'خراسان رضوی' },
  southKhorasan: { x: 625, y: 400, fs: 7.8, short: 'خراسان جنوبی' },
  isfahan: { x: 350, y: 365, fs: 8.5 },
  chaharmahalAndBakhtiari: { x: 282, y: 415, fs: 6.2, short: 'چهارمحال' },
  khuzestan: { x: 212, y: 455, fs: 8.2 },
  kohgiluyehAndBoyerAhmad: { x: 298, y: 462, fs: 6.2, short: 'کهگیلویه' },
  bushehr: { x: 295, y: 555, fs: 7.2 },
  fars: { x: 395, y: 510, fs: 8.5 },
  yazd: { x: 470, y: 390, fs: 8.0 },
  kerman: { x: 540, y: 505, fs: 8.5 },
  hormozgan: { x: 485, y: 630, fs: 7.5 },
  sistanAndBaluchestan: { x: 680, y: 540, fs: 7.5, short: 'سیستان و بلوچستان' },
};

interface RenderedProvince {
  mapKey: IranProvinceKey;
  pathD: string;
  name: string;
}

export const TaminBranchesView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<IranProvinceKey>('tehran');
  const [branchSearch, setBranchSearch] = useState<string>('');
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // استخراج مسیرهای وکتور و فیلتر کردن قطعی دریاچه‌ها یا کلیدهای نامعتبر
  const parsedMapProvinces = useMemo<RenderedProvince[]>(() => {
    const list: RenderedProvince[] = [];
    const rawData = iranRawJson as Record<string, any>;
    if (!rawData || typeof rawData !== 'object') return list;

    Object.keys(rawData).forEach((key) => {
      const item = rawData[key];
      if (!item) return;

      const pathD =
        item.path?.med_res ||
        item.path?.high_res ||
        item.med_res ||
        item.high_res ||
        (typeof item.path === 'string' ? item.path : '');

      if (!pathD) return;

      const normalizedRawKey = key.toLowerCase().trim();
      const normalizedIso = (item.id || '').toLowerCase().trim();
      const normalizedNameEn = (item.name_en || '').toLowerCase().trim();

      const matchedKey: IranProvinceKey | undefined =
        RAW_KEY_TO_PROVINCE_KEY[normalizedRawKey] ||
        RAW_KEY_TO_PROVINCE_KEY[normalizedIso] ||
        RAW_KEY_TO_PROVINCE_KEY[normalizedNameEn];

      if (!matchedKey) return;

      const pData = IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === matchedKey);
      const name = pData ? pData.name : item.name_fa || key;

      list.push({
        mapKey: matchedKey,
        pathD,
        name,
      });
    });

    return list;
  }, []);

  // استان انتخاب شده همراه با Fallback تضمینی برای جلوگیری از ارور
  const currentProvince: ProvinceMapData = useMemo(() => {
    const found = IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === selectedKey);
    return found || IRAN_PROVINCES_COMPLETE[0];
  }, [selectedKey]);

  // فیلتر شعب با گارد دفاعی برای جلوگیری از خطای دسترسی به فیلدها
  const filteredBranches = useMemo(() => {
    const branches = currentProvince?.branches || [];
    if (!branchSearch.trim()) return branches;
    const term = branchSearch.trim().toLowerCase();
    return branches.filter((b) => {
      return (
        (b.name && b.name.toLowerCase().includes(term)) ||
        (b.city && b.city.toLowerCase().includes(term)) ||
        (b.address && b.address.toLowerCase().includes(term)) ||
        (b.code && b.code.includes(term))
      );
    });
  }, [currentProvince, branchSearch]);

  return (
    <div className="space-y-6 pb-14 font-['Vazirmatn'] text-slate-800" dir="rtl">
      {/* کارت بالای نقشه */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-slate-900 text-lg">
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

        {/* کادر نقشه برداری */}
        <div className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-xl flex flex-col items-center justify-center">
          <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-slate-200 border border-slate-700/50">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>{hoveredProvince ? `استان: ${hoveredProvince}` : 'روی استان مورد نظر ضربه بزنید'}</span>
          </div>

          <svg
            viewBox="0 0 798 724"
            className="w-full max-w-xl h-auto select-none transition-transform duration-300 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            {/* لایه استان‌ها */}
            <g id="provinces-layer">
              {parsedMapProvinces.map((item, index) => {
                const isSelected = selectedKey === item.mapKey;
                return (
                  <path
                    key={`path-${item.mapKey}-${index}`}
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

            {/* لایه نام استان‌ها */}
            <g id="province-labels" className="pointer-events-none select-none">
              {parsedMapProvinces.map((item, index) => {
                const conf = PROVINCE_LABEL_SETTINGS[item.mapKey];
                if (!conf) return null;

                const isSelected = selectedKey === item.mapKey;
                const displayText = conf.short || item.name;

                return (
                  <text
                    key={`text-${item.mapKey}-${index}`}
                    x={conf.x}
                    y={conf.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold pointer-events-none"
                    fontSize={isSelected ? conf.fs + 1.2 : conf.fs}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    stroke={isSelected ? '#0f172a' : '#020617'}
                    strokeWidth={isSelected ? 2.4 : 1.8}
                    paintOrder="stroke fill"
                  >
                    {displayText}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>

        {/* فیلد جستجوی شعب */}
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

      {/* لیست کارت‌های شعب */}
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
