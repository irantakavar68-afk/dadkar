// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle, Navigation } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE, IranProvinceKey, ProvinceMapData } from './data/taminData';
import iranRawJson from './data/Iran.json';

// ۱. نگاشت دقیق کلیدهای Iran.json به IranProvinceKey
const RAW_KEY_TO_MAPKEY: Record<string, IranProvinceKey> = {
  'Teh': 'tehran',
  'Esf': 'isfahan',
  'Far': 'fars',
  'RKh': 'razaviKhorasan',
  'EAz': 'eastAzerbaijan',
  'Khz': 'khuzestan',
  'Alb': 'alborz',
  'Gil': 'gilan',
  'Maz': 'mazandaran',
  'Krm': 'kerman',
  'WAz': 'westAzerbaijan',
  'Ard': 'ardabil',
  'Zan': 'zanjan',
  'Qaz': 'qazvin',
  'Mar': 'markazi',
  'Qom': 'qom',
  'Ham': 'hamedan',
  'Krn': 'kermanshah',
  'Krd': 'kurdistan',
  'Lor': 'lorestan',
  'Ilm': 'ilam',
  'CMB': 'chaharmahalAndBakhtiari',
  'KBA': 'kohgiluyehAndBoyerAhmad',
  'Bsh': 'bushehr',
  'Sem': 'semnan',
  'Gol': 'golestan',
  'NKh': 'northKhorasan',
  'SKh': 'southKhorasan',
  'Yzd': 'yazd',
  'SnB': 'sistanAndBaluchestan',
  'Hor': 'hormozgan',
};

// ۲. مختصات دقیق مرکز استان‌ها روی viewBox="0 0 798 724"
const PROVINCE_LABEL_COORDS: Record<IranProvinceKey, { x: number; y: number }> = {
  tehran: { x: 382, y: 290 },
  alborz: { x: 345, y: 275 },
  qom: { x: 375, y: 345 },
  markazi: { x: 320, y: 365 },
  qazvin: { x: 320, y: 285 },
  gilan: { x: 310, y: 215 },
  mazandaran: { x: 415, y: 245 },
  golestan: { x: 505, y: 210 },
  semnan: { x: 485, y: 315 },
  isfahan: { x: 395, y: 415 },
  yazd: { x: 485, y: 445 },
  fars: { x: 415, y: 555 },
  kerman: { x: 565, y: 540 },
  razaviKhorasan: { x: 645, y: 290 },
  northKhorasan: { x: 590, y: 195 },
  southKhorasan: { x: 640, y: 425 },
  sistanAndBaluchestan: { x: 675, y: 585 },
  hormozgan: { x: 525, y: 645 },
  bushehr: { x: 345, y: 565 },
  khuzestan: { x: 260, y: 470 },
  chaharmahalAndBakhtiari: { x: 335, y: 445 },
  kohgiluyehAndBoyerAhmad: { x: 350, y: 495 },
  lorestan: { x: 265, y: 395 },
  ilam: { x: 195, y: 405 },
  kermanshah: { x: 190, y: 345 },
  kurdistan: { x: 200, y: 285 },
  hamedan: { x: 265, y: 335 },
  zanjan: { x: 260, y: 265 },
  eastAzerbaijan: { x: 195, y: 185 },
  westAzerbaijan: { x: 135, y: 215 },
  ardabil: { x: 235, y: 150 },
};

interface ProvinceSvgItem {
  key: IranProvinceKey;
  rawKey: string;
  name: string;
  pathD: string;
  coords: { x: number; y: number };
}

export const TaminBranchesView: React.FC = () => {
  const [selectedMapKey, setSelectedMapKey] = useState<IranProvinceKey>('tehran');
  const [branchSearch, setBranchSearch] = useState<string>('');
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // استخراج وکتورهای نقشه
  const svgProvinces = useMemo<ProvinceSvgItem[]>(() => {
    const rawData = (iranRawJson as any).default || iranRawJson;
    const items: ProvinceSvgItem[] = [];

    Object.keys(RAW_KEY_TO_MAPKEY).forEach((rawCode) => {
      const mapKey = RAW_KEY_TO_MAPKEY[rawCode];
      const jsonItem = rawData[rawCode];
      const taminInfo = IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === mapKey);

      if (!jsonItem) return;

      const pathD =
        jsonItem.path?.med_res ||
        jsonItem.path?.high_res ||
        jsonItem.path?.low_res ||
        (typeof jsonItem.path === 'string' ? jsonItem.path : '');

      if (!pathD) return;

      items.push({
        key: mapKey,
        rawKey: rawCode,
        name: taminInfo?.name || jsonItem.name_fa || mapKey,
        pathD,
        coords: PROVINCE_LABEL_COORDS[mapKey] || { x: 400, y: 360 },
      });
    });

    return items;
  }, []);

  const currentProvince: ProvinceMapData = useMemo(() => {
    return (
      IRAN_PROVINCES_COMPLETE.find((p) => p.mapKey === selectedMapKey) ||
      IRAN_PROVINCES_COMPLETE[0]
    );
  }, [selectedMapKey]);

  const filteredBranches = useMemo(() => {
    const branches = currentProvince?.branches || [];
    if (!branchSearch.trim()) return branches;
    const term = branchSearch.trim().toLowerCase();
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.city.toLowerCase().includes(term) ||
        b.address.toLowerCase().includes(term) ||
        b.code.includes(term)
    );
  }, [currentProvince, branchSearch]);

  return (
    <div className="space-y-6 pb-14 font-['Vazirmatn'] text-slate-800" dir="rtl">
      {/* هدر و نقشه */}
      <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 text-base md:text-lg">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black">اطلس شعب تأمین اجتماعی ایران</h2>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-normal">انتخاب استان از روی نقشه تعاملی</p>
            </div>
          </div>
          <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full border border-blue-100/60">
            {currentProvince.name}
          </span>
        </div>

        {/* کادر نقشه وکتور */}
        <div className="relative w-full bg-slate-950 rounded-2xl p-2 md:p-4 overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] text-slate-200 border border-slate-700/60 shadow-lg">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>{hoveredName ? `استان: ${hoveredName}` : 'روی نقشه ضربه بزنید'}</span>
          </div>

          <svg viewBox="0 0 798 724" className="w-full max-w-xl h-auto select-none">
            <g id="water-bodies" className="pointer-events-none">
              <path d="M 245 40 Q 380 90 520 85 L 540 185 Q 430 195 305 180 Q 255 140 235 95 Z" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" />
              <text x="380" y="130" fill="#7dd3fc" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.8">دریای خزر</text>
              <path d="M 230 520 Q 320 590 440 635 Q 560 670 730 670 L 730 720 L 210 720 Z" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" />
              <text x="360" y="665" fill="#7dd3fc" fontSize="13" fontWeight="bold" textAnchor="middle" opacity="0.8">خلیج فارس</text>
            </g>

            <g id="provinces-layer">
              {svgProvinces.map((item) => {
                const isSelected = selectedMapKey === item.key;
                return (
                  <path
                    key={item.key}
                    d={item.pathD}
                    onClick={() => { setSelectedMapKey(item.key); setBranchSearch(''); }}
                    onMouseEnter={() => setHoveredName(item.name)}
                    onMouseLeave={() => setHoveredName(null)}
                    className={`cursor-pointer transition-all duration-200 outline-none ${
                      isSelected
                        ? 'fill-blue-600 stroke-amber-300 stroke-[2.2] drop-shadow-[0_0_12px_rgba(37,99,235,0.95)]'
                        : 'fill-slate-800/90 hover:fill-blue-950/80 stroke-slate-700 hover:stroke-cyan-400 stroke-[1]'
                    }`}
                  >
                    <title>{item.name}</title>
                  </path>
                );
              })}
            </g>

            <g id="province-labels" className="pointer-events-none select-none">
              {svgProvinces.map((item) => {
                const isSelected = selectedMapKey === item.key;
                return (
                  <text
                    key={`lbl-${item.key}`}
                    x={item.coords.x}
                    y={item.coords.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-black tracking-tighter"
                    fontSize={isSelected ? "11" : "9"}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    stroke={isSelected ? '#1e3a8a' : '#020617'}
                    strokeWidth={isSelected ? "2.5" : "1.8"}
                    paintOrder="stroke fill"
                  >
                    {item.name}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>

        {/* دکمه‌های انتخاب سریع استان (طراحی کاملاً مرتب، گرید ریسپانسیو و بدون به هم ریختگی) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 px-1 block">انتخاب سریع استان:</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 max-h-44 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {IRAN_PROVINCES_COMPLETE.map((prov) => {
              const isSelected = selectedMapKey === prov.mapKey;
              return (
                <button
                  key={prov.id}
                  onClick={() => { setSelectedMapKey(prov.mapKey); setBranchSearch(''); }}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all truncate text-center ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                      : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/60'
                  }`}
                  title={prov.name}
                >
                  {prov.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* جستجوی شعب */}
        <div className="relative">
          <input
            type="text"
            placeholder={`جستجو در شعب استان ${currentProvince.name}...`}
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

      {/* فهرست شعب */}
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
            شعبه‌ای مطابق با «{branchSearch}» در این استان یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredBranches.map((branch) => (
              <div
                key={branch.code}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between space-y-3"
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
                    <CheckCircle className="w-3.5 h-3.5" /> شعبه فعال
                  </span>
                  <a
                    href={`tel:${branch.tel.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
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
