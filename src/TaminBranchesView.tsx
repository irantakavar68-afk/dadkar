// TaminBranchesView.tsx
import React, { useState } from 'react';
import IranMap from 'react-iran-map';
import { IRAN_PROVINCES_COMPLETE, ProvinceMapData } from './taminData';

export const TaminBranchesView: React.FC = () => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('tehran');

  const selectedProvince = IRAN_PROVINCES_COMPLETE.find(
    (p) => p.id === selectedProvinceId || p.mapKey === selectedProvinceId
  ) || IRAN_PROVINCES_COMPLETE[0];

  const handleSelect = (provinceKey: string) => {
    setSelectedProvinceId(provinceKey);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-center overflow-x-auto">
        <IranMap
          selectedProvince={selectedProvince.mapKey}
          onSelect={handleSelect}
          color="#3b82f6"
          selectedColor="#1d4ed8"
          width={500}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          شعب استان {selectedProvince.name} ({selectedProvince.branchCount} شعبه فعال)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedProvince.branches.map((b, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">{b.name}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">کد {b.code}</span>
              </div>
              <p className="text-sm text-slate-600">{b.address}</p>
              <div className="pt-2 border-t border-slate-200">
                <a href={`tel:${b.tel.replace(/[^0-9]/g, '')}`} className="text-sm text-blue-600 hover:underline">
                  تلفن: {b.tel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaminBranchesView;
