// src/payroll/calculations.ts

export interface PayrollParams {
  baseSalary: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  nightHours: number;
  shiftType: string;
  unworkedLeaveDays: number;
  dependents: number;
  unemploymentMonths: number;
  insuranceYears: number;
  workHistoryYears: number;
  housingAllowance: number;
  groceryAllowance: number;
}

export interface PayrollResult {
  dailyWage: number;
  hourlyWage: number;
  severancePay: number;
  overtimePay: number;
  shiftPay: number;
  leavePay: number;
  nightPay: number;
  sanavatMonthly: number;
  insuranceWorker: number;
  insuranceEmployer: number;
  insuranceGov: number;
  insuranceTotal: number;
  voluntaryInsurance: number;
  housewife12: number;
  housewife14: number;
  housewife18: number;
  maxUnemploymentMonths: number;
  monthlyUnemploymentBenefit: number;
  pensionEstimate: number;
  finalEidi: number;
  salaryIncomeTax: number;
}

export function calculatePayroll(params: PayrollParams): PayrollResult {
  const {
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
    housingAllowance,
    groceryAllowance,
  } = params;

  // ۱. دستمزد روزانه و ساعتی (مبنا ۳۰ روز)
  const dailyWage = Math.round(baseSalary / 30);
  const hourlyWage = Math.round(dailyWage / 7.33);

  // ۲. حق سنوات (پایه سنوات قانون کار ۱۴۰۵)
  const totalWorkingDays = years * 365 + months * 30 + days;
  const baseSanavatDailyRate = 70000; // نرخ روزانه پایه سنوات ۱۴۰۵
  const severancePay = Math.round(totalWorkingDays * baseSanavatDailyRate);
  const sanavatMonthly = Math.round((baseSanavatDailyRate * 30));

  // ۳. اضافه‌کاری (ضریب ۱.۴)
  const overtimePay = Math.round(hours * hourlyWage * 1.4);

  // ۴. نوبت‌کاری (شیفت)
  let shiftMultiplier = 0;
  if (shiftType === 'morning-evening') shiftMultiplier = 0.10;
  else if (shiftType === 'morning-evening-night') shiftMultiplier = 0.15;
  else if (shiftType === 'night') shiftMultiplier = 0.22.5; // یا 35% حسب مورد
  const shiftPay = Math.round(baseSalary * shiftMultiplier);

  // ۵. کسر مرخصی استفاده نشده
  const leavePay = Math.round(unworkedLeaveDays * dailyWage * 1.2);

  // ۶. حق شب‌کاری (ضریب ۳۵٪ اضافه‌بر ساعت عادی)
  const nightPay = Math.round(nightHours * hourlyWage * 0.35);

  // ۷. عیدی و پاداش سالانه (ماده واحده مصوب ۱۳۷۰)
  const eidiBaseDays = 60;
  const eidiMaxDays = 90;
  const minDailyWage1405 = 3500000; // حداقل دستمزد روزانه ۱۴۰۵
  const workedDaysThisYear = Math.min(years * 365 + months * 30 + days, 365);
  const calculatedEidi = Math.min(dailyWage * eidiBaseDays, minDailyWage1405 * eidiMaxDays);
  const finalEidi = Math.round((calculatedEidi / 365) * Math.max(workedDaysThisYear, 1));

  // ۸. بیمه تأمین اجتماعی (با اعمال سقف قانونی ماده ۲۸ - ۷ برابر حداقل دستمزد)
  const insuranceCeilingMonthly = minDailyWage1405 * 30 * 7;
  const insurableBase = Math.min(
    baseSalary + (housingAllowance || 0) + (groceryAllowance || 0),
    insuranceCeilingMonthly
  );

  const insuranceWorker = Math.round(insurableBase * 0.07);
  const insuranceEmployer = Math.round(insurableBase * 0.20);
  const insuranceGov = Math.round(insurableBase * 0.03);
  const insuranceTotal = insuranceWorker + insuranceEmployer + insuranceGov;

  // ۹. بیمه اختیاری و صاحبان حرف و مشاغل آزاد
  const voluntaryInsurance = Math.round(baseSalary * 0.14);
  const housewife12 = Math.round(baseSalary * 0.12);
  const housewife14 = Math.round(baseSalary * 0.14);
  const housewife18 = Math.round(baseSalary * 0.18);

  // ۱۰. بیمه بیکاری
  const maxUnemploymentMonths = workHistoryYears >= 10 ? 36 : 50;
  const benefitRate = dependents > 0 ? 0.8 : 0.6;
  const monthlyUnemploymentBenefit = Math.round(baseSalary * benefitRate);

  // ۱۱. برآورد مستمری بازنشستگی
  const pensionEstimate = Math.round((baseSalary * Math.min(insuranceYears, 30)) / 30);

  // ۱۲. مالیات بر درآمد حقوق سال ۱۴۰۵ (پله‌ای پیشرونده)
  // معفیت سالانه یا ماهانه حقوق (مثلا ۱۴۰ میلیون ریال در ماه)
  const monthlyTaxExemption1405 = 140000000;
  const taxableGross = baseSalary + (housingAllowance || 0) + (groceryAllowance || 0) + overtimePay + shiftPay;
  const taxBase = Math.max(taxableGross - insuranceWorker - monthlyTaxExemption1405, 0);

  let salaryIncomeTax = 0;
  if (taxBase > 0) {
    const taxBrackets = [
      { limit: 100000000, rate: 0.10 },
      { limit: 200000000, rate: 0.15 },
      { limit: 300000000, rate: 0.20 },
      { limit: Infinity, rate: 0.25 }
    ];
    let remainingTaxable = taxBase;
    let previousLimit = 0;

    for (const bracket of taxBrackets) {
      const bracketSpan = bracket.limit - previousLimit;
      const taxableInThisBracket = Math.min(remainingTaxable, bracketSpan);
      if (taxableInThisBracket <= 0) break;
      salaryIncomeTax += taxableInThisBracket * bracket.rate;
      remainingTaxable -= taxableInThisBracket;
      previousLimit = bracket.limit;
      if (remainingTaxable <= 0) break;
    }
  }
  salaryIncomeTax = Math.round(salaryIncomeTax);

  return {
    dailyWage,
    hourlyWage,
    severancePay,
    overtimePay,
    shiftPay,
    leavePay,
    nightPay,
    sanavatMonthly,
    insuranceWorker,
    insuranceEmployer,
    insuranceGov,
    insuranceTotal,
    voluntaryInsurance,
    housewife12,
    housewife14,
    housewife18,
    maxUnemploymentMonths,
    monthlyUnemploymentBenefit,
    pensionEstimate,
    finalEidi,
    salaryIncomeTax,
  };
}
