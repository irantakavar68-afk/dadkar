// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle, Navigation } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE, IranProvinceKey, ProvinceMapData } from './data/taminData';
import iranRawJson from './data/Iran.json';

// جدول نگاشت دقیق کلیدهای فایل Iran.json با تایپ رسمی IranProvinceKey
const RAW_KEY_TO_PROVINCE_KEY: Record<string, IranProvinceKey> = {
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

  // کدهای ISO
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

// مختصات دقیق حساب‌شده بر اساس Visual Center (Pole of Inaccessibility) هندسی نقشه
const PROVINCE_LABEL_SETTINGS: Record<IranProvinceKey, { x: number; y: number; fs: number; short?: string }> = {
  westAzerbaijan: { x: 70, y: 145, fs: 6.8, short: 'آذربایجان غربی' },
  eastAzerbaijan: { x: 140, y: 100, fs: 6.8, short: 'آذربایجان شرقی' },
  ardabil: { x: 172, y: 80, fs: 6.5, short: 'اردبیل' },
  gilan: { x: 238, y: 145, fs: 6.5, short: 'گیلان' },
  zanjan: { x: 181, y: 162, fs: 6.5, short: 'زنجان' },
  kurdistan: { x: 127, y: 211, fs: 6.8, short: 'کردستان' },
  kermanshah: { x: 93, y: 276, fs: 6.8, short: 'کرمانشاه' },
  ilam: { x: 130, y: 353, fs: 6.5, short: 'ایلام' },
  lorestan: { x: 163, y: 321, fs: 6.8, short: 'لرستان' },
  hamedan: { x: 193, y: 242, fs: 6.5, short: 'همدان' },
  markazi: { x: 233, y: 284, fs: 6.8, short: 'مرکزی' },
  qom: { x: 294, y: 258, fs: 5.8, short: 'قم' },
  tehran: { x: 305, y: 221, fs: 5.8, short: 'تهران' },
  alborz: { x: 284, y: 194, fs: 5.5, short: 'البرز' },
  qazvin: { x: 245, y: 190, fs: 6.5, short: 'قزوین' },
  mazandaran: { x: 380, y: 179, fs: 6.5, short: 'مازندران' },
  golestan: { x: 469, y: 119, fs: 6.8, short: 'گلستان' },
  semnan: { x: 456, y: 223, fs: 7.5, short: 'سمنان' },
  northKhorasan: { x: 535, y: 120, fs: 6.8, short: 'خراسان شمالی' },
  razaviKhorasan: { x: 629, y: 217, fs: 7.5, short: 'خراسان رضوی' },
  southKhorasan: { x: 641, y: 386, fs: 7.5, short: 'خراسان جنوبی' },
  isfahan: { x: 334, y: 330, fs: 8.0, short: 'اصفهان' },
  chaharmahalAndBakhtiari: { x: 279, y: 401, fs: 5.5, short: 'چهارمحال' },
  khuzestan: { x: 204, y: 412, fs: 7.5, short: 'خوزستان' },
  kohgiluyehAndBoyerAhmad: { x: 280, y: 455, fs: 5.5, short: 'کهگیلویه' },
  bushehr: { x: 312, y: 561, fs: 6.5, short: 'بوشهر' },
  fars: { x: 397, y: 560, fs: 8.0, short: 'فارس' },
  yazd: { x: 507, y: 350, fs: 7.5, short: 'یزد' },
  kerman: { x: 556, y: 494, fs: 8.0, short: 'کرمان' },
  hormozgan: { x: 499, y: 604, fs: 7.0, short: 'هرمزگان' },
  sistanAndBaluchestan: { x: 689, y: 616, fs: 7.2, short: 'سیستان و بلوچستان' },
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

      const normalizedKey = key.toLowerCase().trim();
      const normalizedIso = (item.id || '').toLowerCase().trim();
      const normalizedNameEn = (item.name_en || '').toLowerCase().trim();

      const matchedKey: IranProvinceKey | undefined =
        RAW_KEY_TO_PROVINCE_KEY[normalizedKey] ||
        RAW_KEY_TO_PROVINCE_KEY[normalizedIso] ||
        RAW_KEY_TO_PROVINCE_KEY[normalizedNameEn];

      if (!matchedKey) return;

      const pData = IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === matchedKey);
      
      // اصلاح اصلاحی نام‌گذاری جابه‌جا شده‌ی آذربایجان‌ها در Iran.json خام
      let fixedName = pData ? pData.name : item.name_fa;
      if (matchedKey === 'westAzerbaijan') fixedName = 'آذربایجان غربی';
      if (matchedKey === 'eastAzerbaijan') fixedName = 'آذربایجان شرقی';

      list.push({
        mapKey: matchedKey,
        pathD,
        name: fixedName || key,
      });
    });

    return list;
  }, []);

  const currentProvince: ProvinceMapData = useMemo(() => {
    const found = IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === selectedKey);
    return found || IRAN_PROVINCES_COMPLETE[0];
  }, [selectedKey]);

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
      {/* هدر */}
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

        {/* کادر نقشه */}
        <div className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-xl flex flex-col items-center justify-center">
          <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-slate-200 border border-slate-700/50">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>{hoveredProvince ? `استان: ${hoveredProvince}` : 'روی استان مورد نظر ضربه بزنید'}</span>
          </div>

          <svg
            viewBox="0 0 798 724"
            className="w-full max-w-xl h-auto select-none transition-transform duration-300 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
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
                    fontSize={isSelected ? conf.fs + 1.5 : conf.fs}
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

        {/* جستجوی شعب */}
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

      {/* لیست شعب */}
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
