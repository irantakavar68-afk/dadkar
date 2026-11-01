import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2, Users, FileText, ChevronRight, ChevronLeft, Phone,
  MapPin, Clock, Search, HelpCircle, AlertCircle, User
} from 'lucide-react';
import { AuthProfileModals, UserProfile, AVATAR_SVGS } from './AuthProfileModals';
import TaminBranchesView from './TaminBranchesView';
import * as LawsModule from './lawsData';
import * as TemplatesModule from './templatesData';

// ایمپورت ماژول محاسبات جدا شده
import { calculatePayroll, PayrollResult } from './payroll/calculations';

// (بقیه ایمپورتها و ثابت‌های تمپلیت در صورت نیاز پابرجا می‌ماند...)
// ...

export default function App() {
  // ۱. Stateهای رابط کاربری و مقادیر ورودی
  const [activeTab, setActiveTab] = useState<string>('payslip');
  const [baseSalary, setBaseSalary] = useState<number>(950000000); // ۹۵۰ میلیون ریال پیش‌فرض
  const [salaryInputText, setSalaryInputText] = useState<string>('950,000,000');
  const [years, setYears] = useState<number>(5);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(10);
  const [nightHours, setNightHours] = useState<number>(5);
  const [shiftType, setShiftType] = useState<string>('none');
  const [unworkedLeaveDays, setUnworkedLeaveDays] = useState<number>(2);
  const [dependents, setDependents] = useState<number>(1);
  const [unemploymentMonths, setUnemploymentMonths] = useState<number>({/*...*/ as any} || 6);
  const [insuranceYears, setInsuranceYears] = useState<number>(10);
  const [workHistoryYears, setWorkHistoryYears] = useState<number>(10);

  // تاریخ / ماه جاری
  const getCurrentJalaliMonthLabel = () => {
    try {
      const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long' });
      return formatter.format(new Date());
    } catch {
      return 'فروردین ۱۴۰۵';
    }
  };

  const [payslipData, setPayslipData] = useState({
    employeeName: 'مهندس سید حسین حجازی',
    personnelCode: 'L-1405-01',
    department: 'دفتر تحول دیجیتال و هوش مصنوعی',
    jobTitle: 'مدیر پروژه و تحلیلگر داده',
    month: getCurrentJalaliMonthLabel(),
    baseSalary: 950000000,
    housingAllowance: 15000000,
    groceryAllowance: 12000000,
    overtimePay: 0,
    bonus: 5000000,
    eidi: 0,
    taxAmount: 0,
    insuranceWorker: 0,
    netPay: 0
  });

  const [user, setUser] = useState<any>(null);

  // ۲. فراخوانی موتور محاسبات خالص به‌صورت بهینه (useMemo)
  const calculations: PayrollResult = useMemo(() => {
    return calculatePayroll({
      baseSalary,
      years,
      months,
      days,
      hours,
      nightHours,
      shiftType,
      unworkedLeaveDays,
      dependents,
      unemploymentMonths,
      insuranceYears,
      workHistoryYears,
      housingAllowance: payslipData.housingAllowance,
      groceryAllowance: payslipData.groceryAllowance,
    });
  }, [
    baseSalary,
    years,
    months,
    days,
    hours,
    nightHours,
    shiftType,
    unworkedLeaveDays,
    dependents,
    unemploymentMonths,
    insuranceYears,
    workHistoryYears,
    payslipData.housingAllowance,
    payslipData.groceryAllowance
  ]);

  // ۳. همگام‌سازی فیش حقوقی با مقادیر محاسبه‌شده (عیدی، مالیات و بیمه)
  useEffect(() => {
    if (user) {
      setPayslipData(prev => ({
        ...prev,
        eidi: calculations.finalEidi,
        taxAmount: calculations.salaryIncomeTax,
        insuranceWorker: calculations.insuranceWorker,
      }));
    }
  }, [calculations, user]);

  const formatRial = (val: number) => {
    return val ? val.toLocaleString() + ' ریال' : '۰ ریال';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col rtl font-sans">
      {/* هدر، منوها و رندر تب‌ها (مانند فیش حقوقی و ماشین‌حساب) */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">سامانه جامع حقوق و دستمزد و تحول دیجیتال (۱۴۰۵)</h1>
        <div className="text-sm text-slate-300">کاربر: مهندس سید حسین حجازی</div>
      </header>

      <main className="flex-1 p-6">
        {activeTab === 'payslip' ? (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">فیش حقوقی رسمی ۱۴۰۵</h2>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>پایه حقوق: {formatRial(baseSalary)}</div>
              <div>بیمه سهم کارگر (با سقف): {formatRial(calculations.insuranceWorker)}</div>
              <div>مالیات حقوق: {formatRial(calculations.salaryIncomeTax)}</div>
              <div>עیدی سالانه: {formatRial(calculations.finalEidi)}</div>
            </div>
            {/* بقیه اجزای UI فیش حقوقی و فرم‌ها */}
          </div>
        ) : (
          <div>سایر بخش‌ها / ماشین‌حساب‌ها</div>
        )}
      </main>
    </div>
  );
}
