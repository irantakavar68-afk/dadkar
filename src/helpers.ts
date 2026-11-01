// توابع کمکی خالص (تاریخ جلالی و تبدیل ارقام)

export const getJalaliToday = (): number[] => {
  const p = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric'
  }).formatToParts(new Date());
  const g = (t: string) => Number(p.find(x => x.type === t)!.value);
  return [g('year'), g('month'), g('day')];
};

export const seniorityFromProfile = (start?: string) => {
  if (!start) return null;
  const [sy, sm, sd] = start.split('/').map(Number);
  if (!sy || !sm || !sd) return null;
  const [ty, tm, td] = getJalaliToday();
  let y = ty - sy, m = tm - sm, d = td - sd;
  if (d < 0) { d += 30; m--; }
  if (m < 0) { m += 12; y--; }
  if (y < 0) return null;
  return { y, m, d, totalMonths: y * 12 + m };
};

export const toFa = (s: string | number) => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
export const toEn = (s: string) =>
  s.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
   .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
