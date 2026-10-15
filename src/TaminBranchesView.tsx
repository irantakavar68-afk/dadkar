// src/TaminBranchesView.tsx
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Building2, Search, CheckCircle, Navigation } from 'lucide-react';
import { IRAN_PROVINCES_COMPLETE } from './taminData';

// تعریف موقعیت نسبی و مسیر وکتوری استان‌های ایران
interface ProvinceCoord {
  id: string;
  name: string;
  center: [number, number];
  path: string;
}

// مسیرهای وکتوری بهینه‌شده استان‌های ایران (ViewBox: 0 0 1000 900)
const IRAN_SVG_PROVINCES: ProvinceCoord[] = [
  { id: 'ardabil', name: 'اردبیل', center: [340, 150], path: 'M 320 100 L 360 110 L 365 170 L 330 200 L 315 150 Z' },
  { id: 'eastAzerbaijan', name: 'آذربایجان شرقی', center: [270, 150], path: 'M 240 100 L 320 100 L 315 150 L 330 200 L 290 220 L 250 170 Z' },
  { id: 'westAzerbaijan', name: 'آذربایجان غربی', center: [190, 160], path: 'M 190 70 L 240 100 L 250 170 L 220 280 L 170 230 L 170 120 Z' },
  { id: 'zanjan', name: 'زنجان', center: [330, 240], path: 'M 330 200 L 370 210 L 360 270 L 310 270 L 290 220 Z' },
  { id: 'gilan', name: 'گیلان', center: [400, 190], path: 'M 360 110 L 440 180 L 430 220 L 370 210 L 365 170 Z' },
  { id: 'kurdistan', name: 'کردستان', center: [240, 290], path: 'M 220 280 L 280 260 L 290 330 L 220 340 Z' },
  { id: 'kermanshah', name: 'کرمانشاه', center: [210, 370], path: 'M 220 340 L 280 340 L 270 410 L 180 400 L 180 370 Z' },
  { id: 'hamedan', name: 'همدان', center: [305, 335], path: 'M 280 260 L 340 280 L 330 360 L 280 340 Z' },
  { id: 'qazvin', name: 'قزوین', center: [400, 255], path: 'M 370 210 L 430 220 L 430 280 L 370 280 Z' },
  { id: 'alborz', name: 'البرز', center: [445, 260], path: 'M 430 230 L 465 240 L 460 285 L 430 280 Z' },
  { id: 'tehran', name: 'تهران', center: [480, 290], path: 'M 460 240 L 525 255 L 515 330 L 450 315 L 460 285 Z' },
  { id: 'mazandaran', name: 'مازندران', center: [490, 215], path: 'M 440 180 L 580 215 L 560 255 L 445 235 Z' },
  { id: 'golestan', name: 'گلستان', center: [620, 185], path: 'M 580 215 L 685 180 L 680 240 L 580 250 Z' },
  { id: 'northKhorasan', name: 'خراسان شمالی', center: [720, 195], path: 'M 685 180 L 780 180 L 770 260 L 680 240 Z' },
  { id: 'razaviKhorasan', name: 'خراسان رضوی', center: [830, 310], path: 'M 780 180 L 920 250 L 890 430 L 780 410 L 770 260 Z' },
  { id: 'southKhorasan', name: 'خراسان جنوبی', center: [840, 500], path: 'M 780 410 L 890 430 L 880 620 L 770 590 Z' },
  { id: 'semnan', name: 'سمنان', center: [600, 290], path: 'M 525 255 L 770 260 L 750 380 L 530 350 Z' },
  { id: 'qom', name: 'قم', center: [465, 345], path: 'M 450 315 L 500 330 L 490 380 L 440 365 Z' },
  { id: 'markazi', name: 'مرکزی', center: [390, 345], path: 'M 340 280 L 440 295 L 440 395 L 360 400 L 330 360 Z' },
  { id: 'lorestan', name: 'لرستان', center: [290, 420], path: 'M 270 380 L 350 380 L 340 480 L 250 460 Z' },
  { id: 'ilam', name: 'ایلام', center: [190, 440], path: 'M 180 400 L 250 430 L 230 500 L 160 480 Z' },
  { id: 'khuzestan', name: 'خوزستان', center: [290, 545], path: 'M 230 500 L 340 480 L 380 570 L 310 650 L 220 570 Z' },
  { id: 'chaharmahalAndBakhtiari', name: 'چهارمحال و بختیاری', center: [395, 495], path: 'M 360 465 L 430 475 L 420 535 L 365 520 Z' },
  { id: 'kohgiluyehAndBoyerAhmad', name: 'کهگیلویه و بویراحمد', center: [405, 570], path: 'M 380 540 L 445 545 L 430 615 L 375 600 Z' },
  { id: 'isfahan', name: 'اصفهان', center: [490, 445], path: 'M 440 360 L 590 370 L 560 550 L 430 530 L 440 430 Z' },
  { id: 'yazd', name: 'یزد', center: [635, 485], path: 'M 590 370 L 740 430 L 700 580 L 570 540 Z' },
  { id: 'fars', name: 'فارس', center: [490, 665], path: 'M 430 570 L 560 560 L 585 750 L 445 745 L 415 630 Z' },
  { id: 'bushehr', name: 'بوشهر', center: [375, 700], path: 'M 350 635 L 425 630 L 460 760 L 390 775 Z' },
  { id: 'kerman', name: 'کرمان', center: [720, 635], path: 'M 685 530 L 825 570 L 795 765 L 635 730 Z' },
  { id: 'hormozgan', name: 'هرمزگان', center: [620, 805], path: 'M 490 765 L 750 770 L 710 860 L 495 830 Z' },
  { id: 'sistanAndBaluchestan', name: 'سیستان و بلوچستان', center: [880, 685], path: 'M 825 570 L 960 585 L 910 870 L 760 840 L 795 730 Z' }
];

export const TaminBranchesView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('tehran');
  const [branchSearch, setBranchSearch] = useState<string>('');
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // پیدا کردن مشخصات استان انتخاب‌شده از دیتابیس جامع
  const currentProvince = useMemo(() => {
    return (
      IRAN_PROVINCES_COMPLETE.find(
        (p) => p.id === selectedId || (p as any).mapKey === selectedId
      ) || IRAN_PROVINCES_COMPLETE[0]
    );
  }, [selectedId]);

  // فیلتر شعب درون استان
  const filteredBranches = useMemo(() => {
    if (!branchSearch.trim()) return currentProvince.branches;
    return currentProvince.branches.filter(
      (b) =>
        b.name.includes(branchSearch) ||
        b.city.includes(branchSearch) ||
        b.address.includes(branchSearch) ||
        b.code.includes(branchSearch)
    );
  }, [currentProvince, branchSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* کارت نقشه تعاملی ایران */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Navigation className="w-5 h-5" />
            </div>
            <span>اطلس و نقشه ۳۱ استان تأمین اجتماعی</span>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-100">
            روی استان مورد نظر کلیک کنید
          </span>
        </div>

        {/* ظرف وکتوری نقشه ایران */}
        <div className="relative w-full bg-slate-900 rounded-2xl p-3 overflow-hidden shadow-inner flex flex-col items-center">
          <div className="w-full max-w-2xl aspect-[10/9]">
            <svg
              viewBox="0 0 1000 900"
              className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none"
            >
              {/* پس‌زمینه نقشه */}
              <rect width="1000" height="900" fill="transparent" />

              {/* ترسیم استان‌ها */}
              {IRAN_SVG_PROVINCES.map((prov) => {
                const isSelected = selectedId === prov.id;
                const isHovered = hoveredProvince === prov.id;

                return (
                  <g
                    key={prov.id}
                    onClick={() => {
                      setSelectedId(prov.id);
                      setBranchSearch('');
                    }}
                    onMouseEnter={() => setHoveredProvince(prov.id)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    <path
                      d={prov.path}
                      className={`stroke-[2.5] transition-all duration-300 ${
                        isSelected
                          ? 'fill-blue-500 stroke-white drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]'
                          : isHovered
                          ? 'fill-indigo-600 stroke-cyan-300'
                          : 'fill-slate-800 hover:fill-slate-700 stroke-slate-600'
                      }`}
                    />
                    {/* نام استان روی نقشه */}
                    <text
                      x={prov.center[0]}
                      y={prov.center[1]}
                      textAnchor="middle"
                      className={`text-[13px] font-bold pointer-events-none select-none transition-all ${
                        isSelected
                          ? 'fill-white font-black'
                          : isHovered
                          ? 'fill-yellow-300'
                          : 'fill-slate-300'
                      }`}
                    >
                      {prov.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="absolute bottom-3 right-4 bg-slate-850/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300">
            استان منتخب: <span className="font-bold text-blue-400">{currentProvince.name}</span>
          </div>
        </div>

        {/* فیلد جستجوی مستقیم شعبه */}
        <div className="relative pt-1">
          <input
            type="text"
            placeholder={`جستجوی شعبه، شهر یا آدرس در استان ${currentProvince.name}...`}
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-10 pl-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-4.5" />
        </div>
      </div>

      {/* لیست شعب استان فعال */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-800 text-base">
              مراکز تأمین اجتماعی استان {currentProvince.name}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {filteredBranches.length} مرکز فعال
          </span>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm">
            هیچ شعبه‌ای با عبارت جستجو شده در این استان یافت نشد.
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
                    <span>مرکز فعال</span>
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
