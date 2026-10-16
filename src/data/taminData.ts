// src/data/taminData.ts - پایگاه داده جامع شعب رسمی تأمین اجتماعی دادکار

export type IranProvinceKey =
  | 'tehran'
  | 'isfahan'
  | 'fars'
  | 'razaviKhorasan'
  | 'eastAzerbaijan'
  | 'khuzestan'
  | 'alborz'
  | 'gilan'
  | 'mazandaran'
  | 'kerman'
  | 'westAzerbaijan'
  | 'ardabil'
  | 'zanjan'
  | 'qazvin'
  | 'markazi'
  | 'qom'
  | 'hamedan'
  | 'kermanshah'
  | 'kurdistan'
  | 'lorestan'
  | 'ilam'
  | 'chaharmahalAndBakhtiari'
  | 'kohgiluyehAndBoyerAhmad'
  | 'bushehr'
  | 'semnan'
  | 'golestan'
  | 'northKhorasan'
  | 'southKhorasan'
  | 'yazd'
  | 'sistanAndBaluchestan'
  | 'hormozgan';

export interface TaminBranch {
  name: string;
  code: string;
  city: string;
  address: string;
  tel: string;
  type?: 'headquarters' | 'general' | 'industrial' | 'specialized';
}

export interface ProvinceMapData {
  id: string;
  mapKey: IranProvinceKey;
  name: string;
  center: string;
  branchCount: number;
  branches: TaminBranch[];
}

export const IRAN_PROVINCES_COMPLETE: ProvinceMapData[] = [
  {
    id: "tehran",
    mapKey: "tehran",
    name: "تهران",
    center: "تهران",
    branchCount: 33,
    branches: [
      { name: "شعبه ۱ (شهدای هفتم تیر)", code: "۰۱", city: "تهران", address: "میدان هفتم تیر، ابتدای مفتح جنوبی", tel: "۰۲۱-۸۸۸۳۱۰۰۱", type: "general" },
      { name: "شعبه ۲ (آزادی)", code: "۰۲", city: "تهران", address: "خیابان آزادی، بعد از تقاطع یادگار امام", tel: "۰۲۱-۶۶۰۰۵۱۱۱", type: "general" },
      { name: "شعبه ۳ (خیام)", code: "۰۳", city: "تهران", address: "چهارراه گلوبندک، خیابان خیام جنوبی", tel: "۰۲۱-۵۵۶۲۰۰۰۱", type: "general" },
      { name: "شعبه ۴ (ری)", code: "۰۴", city: "شهرری", address: "شهرری، خیابان فداییان اسلام", tel: "۰۲۱-۵۵۹۰۰۱۱۱", type: "general" },
      { name: "شعبه ۵ (بهارستان)", code: "۰۵", city: "تهران", address: "میدان بهارستان، خیابان مصطفی خمینی", tel: "۰۲۱-۳۳۵۵۰۰۰۱", type: "general" },
      { name: "شعبه ۶ (نارمک)", code: "۰۶", city: "تهران", address: "نارمک، میدان هفت‌حوض، خیابان جانبازان شرقی", tel: "۰۲۱-۷۷۹۱۰۰۰۱", type: "general" },
      { name: "شعبه ۷ (پیروزی)", code: "۰۷", city: "تهران", address: "خیابان پیروزی، بعد از چهارراه کوکاکولا", tel: "۰۲۱-۳۳۳۴۰۰۰۱", type: "general" },
      { name: "شعبه ۸ (لویزان)", code: "۰۸", city: "تهران", address: "لویزان، خیابان شهید فرشادی", tel: "۰۲۱-۲۲۹۴۰۰۰۱", type: "general" },
      { name: "شعبه ۹ (بزرگراه بعثت)", code: "۰۹", city: "تهران", address: "بزرگراه بعثت، تقاطع ۱۷ شهریور جنوبی", tel: "۰۲۱-۵۵۳۰۰۰۰۱", type: "general" },
      { name: "شعبه ۱۰ (رودکی)", code: "۱۰", city: "تهران", address: "خیابان رودکی، تقاطع مرتضوی", tel: "۰۲۱-۶۶۸۸۰۰۰۱", type: "general" },
      { name: "شعبه ۱۱ (ولیعصر)", code: "۱۱", city: "تهران", address: "خیابان ولیعصر، نرسیده به چهارراه طالقانی", tel: "۰۲۱-۶۶۴۶۰۰۰۱", type: "general" },
      { name: "شعبه ۱۲ (خیابان امام خمینی)", code: "۱۲", city: "تهران", address: "خیابان امام خمینی، روبروی پارک شهر", tel: "۰۲۱-۶۶۷۰۰۰۰۱", type: "general" },
      { name: "شعبه ۱۳ (شهدای گمنام)", code: "۱۳", city: "تهران", address: "جلال آل احمد، خیابان امیرآباد شمالی", tel: "۰۲۱-۸۸۰۲۰۰۰۱", type: "general" },
      { name: "شعبه ۱۴ (تهرانپارس)", code: "۱۴", city: "تهران", address: "فلکه دوم تهرانپارس، خیابان فرجام", tel: "۰۲۱-۷۷۷۰۰۰۰۱", type: "general" },
      { name: "شعبه ۱۵ (سعدی)", code: "۱۵", city: "تهران", address: "خیابان سعدی شمالی، بالاتر از منوچهری", tel: "۰۲۱-۳۳۹۱۰۰۰۱", type: "general" },
      { name: "شعبه ۱۶ (اسلامشهر)", code: "۱۶", city: "اسلامشهر", address: "اسلامشهر، ابتدای جاده ساوه، روبروی شهرداری", tel: "۰۲۱-۵۶۳۴۰۰۰۱", type: "general" },
      { name: "شعبه ۱۷ (شهریار)", code: "۱۷", city: "شهریار", address: "شهریار، خیابان ولیعصر، روبروی بیمارستان امام سجاد", tel: "۰۲۱-۶۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه ۱۸ (چهاردانگه)", code: "۱۸", city: "چهاردانگه", address: "شهرک صنعتی چهاردانگه", tel: "۰۲۱-۵۵۲۴۰۰۰۱", type: "industrial" },
      { name: "شعبه ۱۹ (شادآباد)", code: "۱۹", city: "تهران", address: "بازار آهن شادآباد، بلوار الغدیر", tel: "۰۲۱-۶۶۲۰۰۰۰۱", type: "industrial" },
      { name: "شعبه ۲۰ (شهرقدس)", code: "۲۰", city: "قدس", address: "شهرقدس، میدان قدس، بلوار کلهر", tel: "۰۲۱-۴۶۸۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲۱ (اکباتان)", code: "۲۱", city: "تهران", address: "شهرک اکباتان، فاز ۲، جنب ایستگاه مترو", tel: "۰۲۱-۴۴۶۴۰۰۰۱", type: "general" },
      { name: "شعبه ۲۲ (آیت‌الله کاشانی)", code: "۲۲", city: "تهران", address: "بلوار آیت‌الله کاشانی، نبش تقاطع جنت‌آباد", tel: "۰۲۱-۴۴۰۰۱۲۰۳", type: "general" },
      { name: "شعبه ۲۳ (افسریه)", code: "۲۳", city: "تهران", address: "بزرگراه بسیج، روبروی افسریه، جنب پل هجرت", tel: "۰۲۱-۳۳۱۴۰۰۰۱", type: "general" },
      { name: "شعبه ۲۴ (ورامین)", code: "۲۴", city: "ورامین", address: "ورامین، خیابان شهید بهشتی، جنب فرمانداری", tel: "۰۲۱-۳۶۲۴۰۰۰۱", type: "general" },
      { name: "شعبه ۲۵ (تخصصی شمیران)", code: "۲۵", city: "تهران", address: "تجریش، خیابان فناخسرو، روبروی دادگستری", tel: "۰۲۱-۲۲۷۱۴۰۰۰", type: "specialized" },
      { name: "شعبه ۲۶ (سعادت‌آباد)", code: "۲۶", city: "تهران", address: "بلوار سعادت‌آباد، خیابان علامه طباطبایی", tel: "۰۲۱-۲۲۰۷۰۰۰۱", type: "general" },
      { name: "شعبه ۲۷ (پاکدشت)", code: "۲۷", city: "پاکدشت", address: "پاکدشت، میدان شهدای گمنام", tel: "۰۲۱-۳۶۰۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲۸ (ستارخان)", code: "۲۸", city: "تهران", address: "خیابان ستارخان، نرسیده به پل یادگار امام", tel: "۰۲۱-۴۴۲۴۰۰۰۱", type: "general" },
      { name: "شعبه ۲۹ (فلسطین)", code: "۲۹", city: "تهران", address: "میدان فلسطین، خیابان فلسطین شمالی", tel: "۰۲۱-۸۸۹۵۰۰۰۱", type: "general" },
      { name: "شعبه دماوند", code: "۳۰", city: "دماوند", address: "دماوند، گیلاوند، بلوار آیت‌الله خامنه‌ای", tel: "۰۲۱-۷۶۳۴۲۰۰۱", type: "general" },
      { name: "شعبه رباط‌کریم", code: "۳۱", city: "رباط‌کریم", address: "رباط‌کریم، بلوار امام خمینی، جنب فرمانداری", tel: "۰۲۱-۵۶۴۲۰۰۰۱", type: "general" },
      { name: "شعبه فیروزکوه", code: "۳۲", city: "فیروزکوه", address: "فیروزکوه، خیابان پاسداران", tel: "۰۲۱-۷۶۴۴۲۰۰۱", type: "general" },
      { name: "شعبه قرچک", code: "۳۳", city: "قرچک", address: "قرچک، خیابان اصلی، جنب بانک ملی", tel: "۰۲۱-۳۶۱۴۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "isfahan",
    mapKey: "isfahan",
    name: "اصفهان",
    center: "اصفهان",
    branchCount: 16,
    branches: [
      { name: "شعبه ۱ (پل خواجو)", code: "۰۱", city: "اصفهان", address: "میدان خواجو، ابتدای چهارباغ خواجو", tel: "۰۳۱-۳۲۷۳۱۱۴۴", type: "general" },
      { name: "شعبه ۲ (شهید رجایی)", code: "۰۲", city: "اصفهان", address: "میدان جمهوری اسلامی، ابتدای امام خمینی", tel: "۰۳۱-۳۳۳۸۵۰۰۱", type: "general" },
      { name: "شعبه ۳ (پل شیری)", code: "۰۳", city: "اصفهان", address: "خیابان صائب، جنب پل شیری", tel: "۰۳۱-۳۲۳۳۰۰۰۱", type: "general" },
      { name: "شعبه ۴ (صنعتی محمودآباد)", code: "۰۴", city: "اصفهان", address: "شهرک صنعتی محمودآباد", tel: "۰۳۱-۳۳۸۰۲۰۳۰", type: "industrial" },
      { name: "شعبه ۵ (جی)", code: "۰۵", city: "اصفهان", address: "خیابان جی، چهارراه پروین", tel: "۰۳۱-۳۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه کاشان", code: "۰۶", city: "کاشان", address: "کاشان، میدان معلم، بلوار مفتح", tel: "۰۳۱-۵۵۴۴۰۰۰۱", type: "general" },
      { name: "شعبه نجف‌آباد", code: "۰۷", city: "نجف‌آباد", address: "نجف‌آباد، خیابان شریعتی، جنب هلال احمر", tel: "۰۳۱-۴۲۶۲۰۰۰۱", type: "general" },
      { name: "شعبه خمینی‌شهر", code: "۰۸", city: "خمینی‌شهر", address: "خمینی‌شهر، میدان شهدا", tel: "۰۳۱-۳۳۶۲۰۰۰۱", type: "general" },
      { name: "شعبه شاهین‌شهر", code: "۰۹", city: "شاهین‌شهر", address: "شاهین‌شهر، بلوار طالقانی", tel: "۰۳۱-۴۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه لنجان (زرین‌شهر)", code: "۱۰", city: "زرین‌شهر", address: "زرین‌شهر، میدان انقلاب", tel: "۰۳۱-۵۲۲۳۰۰۰۱", type: "general" },
      { name: "شعبه مبارکه", code: "۱۱", city: "مبارکه", address: "مبارکه، بلوار شریعتی", tel: "۰۳۱-۵۲۴۰۲۲۱۱", type: "industrial" },
      { name: "شعبه شهرضا", code: "۱۲", city: "شهرضا", address: "شهرضا، میدان حر، بلوار شهید مدرس", tel: "۰۳۱-۵۳۲۴۰۰۰۱", type: "general" },
      { name: "شعبه نایین", code: "۱۳", city: "نایین", address: "نایین، خیابان شهید رجایی", tel: "۰۳۱-۴۶۲۵۲۰۰۱", type: "general" },
      { name: "شعبه گلپایگان", code: "۱۴", city: "گلپایگان", address: "گلپایگان، بلوار سلمان فارسی", tel: "۰۳۱-۵۷۴۲۰۰۰۱", type: "general" },
      { name: "شعبه اردستان", code: "۱۵", city: "اردستان", address: "اردستان، خیابان قیام", tel: "۰۳۱-۵۴۲۴۰۰۰۱", type: "general" },
      { name: "شعبه نطنز", code: "۱۶", city: "نطنز", address: "نطنز، میدان امام خمینی", tel: "۰۳۱-۵۴۲۲۲۰۰۱", type: "general" }
    ]
  },
  {
    id: "fars",
    mapKey: "fars",
    name: "فارس",
    center: "شیراز",
    branchCount: 13,
    branches: [
      { name: "شعبه ۱ شیراز", code: "۰۱", city: "شیراز", address: "بلوار پاسداران، نبش خیابان آقایی", tel: "۰۷۱-۳۸۳۳۹۰۰۰", type: "general" },
      { name: "شعبه ۲ شیراز (زند)", code: "۰۲", city: "شیراز", address: "خیابان کریمخان زند، روبروی بیمارستان شهید فقیهی", tel: "۰۷۱-۳۲۳۵۷۰۰۱", type: "general" },
      { name: "شعبه ۳ شیراز", code: "۰۳", city: "شیراز", address: "بلوار عدالت، جنب میدان بسیج", tel: "۰۷۱-۳۸۲۴۵۰۱۲", type: "general" },
      { name: "شعبه ۴ شیراز (صنعتی)", code: "۰۴", city: "شیراز", address: "شهرک صنعتی بزرگ شیراز", tel: "۰۷۱-۳۷۷۴۲۰۰۰", type: "industrial" },
      { name: "شعبه مرودشت", code: "۰۵", city: "مرودشت", address: "مرودشت، خیابان انقلاب", tel: "۰۷۱-۴۳۳۳۰۰۰۱", type: "general" },
      { name: "شعبه جهرم", code: "۰۶", city: "جهرم", address: "جهرم، بلوار شهید مطهری", tel: "۰۷۱-۵۴۳۳۰۰۰۱", type: "general" },
      { name: "شعبه فسا", code: "۰۷", city: "فسا", address: "فسا، میدان امام رضا", tel: "۰۷۱-۵۳۳۴۰۰۰۱", type: "general" },
      { name: "شعبه کازرون", code: "۰۸", city: "کازرون", address: "کازرون، میدان شهدا", tel: "۰۷۱-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه لارستان", code: "۰۹", city: "لار", address: "شهر جدید لار، بلوار جمهوری", tel: "۰۷۱-۵۲۲۴۰۰۰۱", type: "general" },
      { name: "شعبه داراب", code: "۱۰", city: "داراب", address: "داراب، بلوار شهید چمران", tel: "۰۷۱-۵۳۵۲۰۰۰۱", type: "general" },
      { name: "شعبه فیروزآباد", code: "۱۱", city: "فیروزآباد", address: "فیروزآباد، میدان امام خمینی", tel: "۰۷۱-۳۸۷۲۰۰۰۱", type: "general" },
      { name: "شعبه آباده", code: "۱۲", city: "آباده", address: "آباده، خیابان قدس", tel: "۰۷۱-۴۴۳۳۰۰۰۱", type: "general" },
      { name: "شعبه لامرد", code: "۱۳", city: "لامرد", address: "لامرد، بلوار شهید مطهری", tel: "۰۷۱-۵۲۷۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "khorasan_razavi",
    mapKey: "razaviKhorasan",
    name: "خراسان رضوی",
    center: "مشهد",
    branchCount: 14,
    branches: [
      { name: "شعبه ۱ مشهد (احمدآباد)", code: "۰۱", city: "مشهد", address: "بلوار احمدآباد، خیابان کلاهدوز", tel: "۰۵۱-۳۸۴۰۰۴۵۱", type: "general" },
      { name: "شعبه ۲ مشهد (شهید کامیاب)", code: "۰۲", city: "مشهد", address: "میدان راه‌آهن، بولوار کامیاب", tel: "۰۵۱-۳۲۲۲۶۱۱۰", type: "general" },
      { name: "شعبه ۳ مشهد (شهید رجایی)", code: "۰۳", city: "مشهد", address: "بلوار مصلی، جنب پایانه مسافربری", tel: "۰۵۱-۳۳۴۱۰۰۰۱", type: "general" },
      { name: "شعبه ۴ مشهد (خیام)", code: "۰۴", city: "مشهد", address: "میدان خیام، ابتدای بلوار توس", tel: "۰۵۱-۳۷۶۴۵۵۰۰", type: "general" },
      { name: "شعبه ۵ مشهد (توس)", code: "۰۵", city: "مشهد", address: "بلوار وکیل‌آباد، بین وکیل‌آباد ۴۵ و ۴۷", tel: "۰۵۱-۳۸۹۰۰۰۰۱", type: "general" },
      { name: "شعبه ۶ مشهد (طرق)", code: "۰۶", city: "مشهد", address: "جاده قدیم نیشابور، شهرک شهید رجایی", tel: "۰۵۱-۳۳۹۲۰۰۰۱", type: "industrial" },
      { name: "شعبه نیشابور", code: "۰۷", city: "نیشابور", address: "نیشابور، میدان فردوسی", tel: "۰۵۱-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه سبزوار", code: "۰۸", city: "سبزوار", address: "سبزوار، خیابان ۲۴ متری انقلاب", tel: "۰۵۱-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه تربت حیدریه", code: "۰۹", city: "تربت حیدریه", address: "تربت حیدریه، بلوار امام رضا", tel: "۰۵۱-۵۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه قوچان", code: "۱۰", city: "قوچان", address: "قوچان، میدان فلسطین", tel: "۰۵۱-۴۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه کاشمر", code: "۱۱", city: "کاشمر", address: "کاشمر، خیابان جمهوری اسلامی", tel: "۰۵۱-۵۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه گناباد", code: "۱۲", city: "گناباد", address: "گناباد، بلوار معلم", tel: "۰۵۱-۵۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه سرخس", code: "۱۳", city: "سرخس", address: "سرخس، بلوار طالقانی", tel: "۰۵۱-۳۴۵۲۰۰۰۱", type: "general" },
      { name: "شعبه چناران", code: "۱۴", city: "چناران", address: "چناران، بلوار امام رضا", tel: "۰۵۱-۴۶۱۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "east_azerbaijan",
    mapKey: "eastAzerbaijan",
    name: "آذربایجان شرقی",
    center: "تبریز",
    branchCount: 12,
    branches: [
      { name: "شعبه ۱ تبریز (نصف‌راه)", code: "۰۱", city: "تبریز", address: "میدان جهاد (نصف‌راه)، جنب مترو", tel: "۰۴۱-۳۴۴۴۷۰۰۱", type: "general" },
      { name: "شعبه ۲ تبریز (آبرسان)", code: "۰۲", city: "تبریز", address: "چهارراه آبرسان، خیابان هفتم تیر", tel: "۰۴۱-۳۳۳۵۲۱۱۲", type: "general" },
      { name: "شعبه ۳ تبریز (راه‌آهن)", code: "۰۳", city: "تبریز", address: "میدان راه‌آهن، اول بلوار ۲۲ بهمن", tel: "۰۴۱-۳۴۴۲۰۰۰۱", type: "general" },
      { name: "شعبه ۴ تبریز (شهریار)", code: "۰۴", city: "تبریز", address: "بلوار استاد شهریار", tel: "۰۴۱-۳۶۵۶۰۰۰۱", type: "general" },
      { name: "شعبه ۵ تبریز (صنعتی رجایی)", code: "۰۵", city: "تبریز", address: "شهرک صنعتی شهید رجایی", tel: "۰۴۱-۳۴۲۰۲۰۰۰", type: "industrial" },
      { name: "شعبه مراغه", code: "۰۶", city: "مراغه", address: "مراغه، خیابان قدس", tel: "۰۴۱-۳۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مرند", code: "۰۷", city: "مرند", address: "مرند، خیابان طالقانی", tel: "۰۴۱-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه میانه", code: "۰۸", city: "میانه", address: "میانه، میدان نماز", tel: "۰۴۱-۵۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه اهر", code: "۰۹", city: "اهر", address: "اهر، خیابان قدس", tel: "۰۴۱-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بناب", code: "۱۰", city: "بناب", address: "بناب، بلوار لاله", tel: "۰۴۱-۳۷۷۲۰۰۰۱", type: "general" },
      { name: "شعبه سراب", code: "۱۱", city: "سراب", address: "سراب، خیابان مطهری", tel: "۰۴۱-۴۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه جلفا", code: "۱۲", city: "جلفا", address: "جلفا، منطقه آزاد ارس", tel: "۰۴۱-۴۲۰۲۰۰۰۱", type: "specialized" }
    ]
  },
  {
    id: "khuzestan",
    mapKey: "khuzestan",
    name: "خوزستان",
    center: "اهواز",
    branchCount: 15,
    branches: [
      { name: "شعبه ۱ اهواز (امانیه)", code: "۰۱", city: "اهواز", address: "امانیه، خیابان دز شرقی", tel: "۰۶۱-۳۳۳۳۱۰۰۱", type: "general" },
      { name: "شعبه ۲ اهواز (نادری)", code: "۰۲", city: "اهواز", address: "خیابان شریعتی، جنب سینما اکسین", tel: "۰۶۱-۳۲۲۱۷۸۹۰", type: "general" },
      { name: "شعبه ۳ اهواز (سپیدار)", code: "۰۳", city: "اهواز", address: "بلوار انصار، کوی سپیدار", tel: "۰۶۱-۳۲۲۸۰۰۰۱", type: "general" },
      { name: "شعبه آبادان", code: "۰۴", city: "آبادان", address: "آبادان، خیابان شهید منتظری", tel: "۰۶۱-۵۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه خرمشهر", code: "۰۵", city: "خرمشهر", address: "خرمشهر، بلوار ساحلی", tel: "۰۶۱-۵۳۵۲۰۰۰۱", type: "general" },
      { name: "شعبه دزفول", code: "۰۶", city: "دزفول", address: "دزفول، خیابان شریعتی، روبروی مصلی", tel: "۰۶۱-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بندر ماهشهر", code: "۰۷", city: "بندر ماهشهر", address: "ماهشهر، فاز ۳، بلوار آیت‌الله سعیدی", tel: "۰۶۱-۵۲۳۳۰۰۰۱", type: "industrial" },
      { name: "شعبه بندر امام خمینی (ره)", code: "۰۸", city: "بندر امام خمینی", address: "بندر امام، بلوار شهید باهنر", tel: "۰۶۱-۵۲۲۲۰۰۰۱", type: "industrial" },
      { name: "شعبه شوش", code: "۰۹", city: "شوش", address: "شوش دانیال، بلوار امام خمینی", tel: "۰۶۱-۴۲۸۲۰۰۰۱", type: "general" },
      { name: "شعبه شوشتر", code: "۱۰", city: "شوشتر", address: "شوشتر، میدان ۱۷ شهریور", tel: "۰۶۱-۳۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مسجدسلیمان", code: "۱۱", city: "مسجدسلیمان", address: "مسجدسلیمان، میدان نمره یک", tel: "۰۶۱-۴۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بهبهان", code: "۱۲", city: "بهبهان", address: "بهبهان، میدان بیدبلند", tel: "۰۶۱-۵۲۷۲۰۰۰۱", type: "general" },
      { name: "شعبه ایذه", code: "۱۳", city: "ایذه", address: "ایذه، بلوار مدرس", tel: "۰۶۱-۴۳۶۲۰۰۰۱", type: "general" },
      { name: "شعبه رامهرمز", code: "۱۴", city: "رامهرمز", address: "رامهرمز، خیابان ولیعصر", tel: "۰۶۱-۴۳۵۲۰۰۰۱", type: "general" },
      { name: "شعبه امیدیه", code: "۱۵", city: "امیدیه", address: "امیدیه، بلوار شهید بهشتی", tel: "۰۶۱-۵۲۶۲۰۰۰۱", type: "industrial" }
    ]
  },
  {
    id: "alborz",
    mapKey: "alborz",
    name: "البرز",
    center: "کرج",
    branchCount: 8,
    branches: [
      { name: "شعبه ۱ کرج (طالقانی)", code: "۰۱", city: "کرج", address: "میدان هفت تیر، بلوار طالقانی جنوبی", tel: "۰۲۶-۳۲۲۶۴۰۰۱", type: "general" },
      { name: "شعبه ۲ کرج (فردیس)", code: "۰۲", city: "فردیس", address: "فردیس، کانال غربی، بلوار امام رضا", tel: "۰۲۶-۳۶۵۴۱۰۰۰", type: "general" },
      { name: "شعبه ۳ کرج (شهید بهشتی)", code: "۰۳", city: "کرج", address: "میدان شهدا، اول خیابان بهار", tel: "۰۲۶-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه ۴ کرج (رجایی‌شهر)", code: "۰۴", city: "کرج", address: "رجایی‌شهر، خیابان آزادی، نبش خیابان نهم", tel: "۰۲۶-۳۴۴۲۰۰۰۱", type: "general" },
      { name: "شعبه ساوجبلاغ (هشتگرد)", code: "۰۵", city: "هشتگرد", address: "هشتگرد، بلوار امام خمینی", tel: "۰۲۶-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه نظرآباد", code: "۰۶", city: "نظرآباد", address: "نظرآباد، خیابان انقلاب", tel: "۰۲۶-۴۵۳۵۰۰۰۱", type: "general" },
      { name: "شعبه اشتهارد", code: "۰۷", city: "اشتهارد", address: "شهرک صنعتی اشتهارد، بلوار حافظ", tel: "۰۲۶-۳۷۷۷۰۰۰۱", type: "industrial" },
      { name: "شعبه طالقان", code: "۰۸", city: "طالقان", address: "طالقان، شهرک، میدان شهید فلاحی", tel: "۰۲۶-۴۴۷۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "gilan",
    mapKey: "gilan",
    name: "گیلان",
    center: "رشت",
    branchCount: 11,
    branches: [
      { name: "شعبه ۱ رشت (فرهنگ)", code: "۰۱", city: "رشت", address: "میدان فرهنگ، ابتدای خیابان پرستار", tel: "۰۱۳-۳۳۳۲۴۰۰۱", type: "general" },
      { name: "شعبه ۲ رشت (گلسار)", code: "۰۲", city: "رشت", address: "گلسار، بلوار سمیه، نبش خیابان ۱۴۲", tel: "۰۱۳-۳۳۷۵۱۰۰۰", type: "general" },
      { name: "شعبه بندرانزلی", code: "۰۳", city: "بندرانزلی", address: "انزلی، بلوار شهید فاتحی", tel: "۰۱۳-۴۴۵۲۰۰۰۱", type: "general" },
      { name: "شعبه لاهیجان", code: "۰۴", city: "لاهیجان", address: "لاهیجان، خیابان شهید رجایی", tel: "۰۱۳-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه لنگرود", code: "۰۵", city: "لنگرود", address: "لنگرود، بلوار جمهوری اسلامی", tel: "۰۱۳-۴۲۵۲۰۰۰۱", type: "general" },
      { name: "شعبه تالش", code: "۰۶", city: "تالش", address: "تالش، خیابان خرمشهر", tel: "۰۱۳-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه رودسر", code: "۰۷", city: "رودسر", address: "رودسر، خیابان انقلاب", tel: "۰۱۳-۴۲۶۲۰۰۰۱", type: "general" },
      { name: "شعبه فومن", code: "۰۸", city: "فومن", address: "فومن، خیابان شهید بهشتی", tel: "۰۱۳-۳۴۷۲۰۰۰۱", type: "general" },
      { name: "شعبه صومعه‌سرا", code: "۰۹", city: "صومعه‌سرا", address: "صومعه‌سرا، خیابان برشنورد", tel: "۰۱۳-۴۴۳۲۰۰۰۱", type: "general" },
      { name: "شعبه آستارا", code: "۱۰", city: "آستارا", address: "آستارا، خیابان فارابی", tel: "۰۱۳-۴۴۸۲۰۰۰۱", type: "general" },
      { name: "شعبه رودبار (منجیل)", code: "۱۱", city: "منجیل", address: "منجیل، خیابان امام خمینی", tel: "۰۱۳-۳۴۶۴۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "mazandaran",
    mapKey: "mazandaran",
    name: "مازندران",
    center: "ساری",
    branchCount: 12,
    branches: [
      { name: "شعبه ۱ ساری", code: "۰۱", city: "ساری", address: "بلوار طالقانی، بعد از شهرداری ساری", tel: "۰۱۱-۳۳۲۵۰۱۱۱", type: "general" },
      { name: "شعبه ۲ ساری (طبرستان)", code: "۰۲", city: "ساری", address: "بلوار طبرستان، نبش فرهنگ", tel: "۰۱۱-۳۳۳۲۰۰۰۱", type: "general" },
      { name: "شعبه بابل", code: "۰۳", city: "بابل", address: "بابل، میدان هلال احمر، بلوار نوشیروانی", tel: "۰۱۱-۳۲۳۳۶۰۷۰", type: "general" },
      { name: "شعبه آمل", code: "۰۴", city: "آمل", address: "آمل، خیابان امام رضا، کوچه شهید مطهری", tel: "۰۱۱-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه قائم‌شهر", code: "۰۵", city: "قائم‌شهر", address: "قائم‌شهر، خیابان بابل، روبروی تلار", tel: "۰۱۱-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه تنکابن", code: "۰۶", city: "تنکابن", address: "تنکابن، خیابان علامه مجلسی", tel: "۰۱۱-۵۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه چالوس", code: "۰۷", city: "چالوس", address: "چالوس، خیابان امام خمینی", tel: "۰۱۱-۵۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بهشهر", code: "۰۸", city: "بهشهر", address: "بهشهر، خیابان فرودگاه", tel: "۰۱۱-۳۴۵۲۰۰۰۱", type: "general" },
      { name: "شعبه نوشهر", code: "۰۹", city: "نوشهر", address: "نوشهر، خیابان فردوسی", tel: "۰۱۱-۵۲۳۲۰۰۰۱", type: "general" },
      { name: "شعبه بابلسر", code: "۱۰", city: "بابلسر", address: "بابلسر، خیابان پاسداران", tel: "۰۱۱-۳۵۳۲۰۰۰۱", type: "general" },
      { name: "شعبه نور", code: "۱۱", city: "نور", address: "نور، خیابان امام خمینی", tel: "۰۱۱-۴۴۵۲۰۰۰۱", type: "general" },
      { name: "شعبه نکا", code: "۱۲", city: "نکا", address: "نکا، بلوار انقلاب", tel: "۰۱۱-۳۴۶۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "kerman",
    mapKey: "kerman",
    name: "کرمان",
    center: "کرمان",
    branchCount: 10,
    branches: [
      { name: "شعبه ۱ کرمان (فردوسی)", code: "۰۱", city: "کرمان", address: "میدان قرنی، خیابان فردوسی", tel: "۰۳۴-۳۲۲۳۶۰۰۱", type: "general" },
      { name: "شعبه ۲ کرمان (جمهوری)", code: "۰۲", city: "کرمان", address: "بلوار جمهوری اسلامی، نبش والفجر", tel: "۰۳۴-۳۲۴۴۵۱۲۰", type: "general" },
      { name: "شعبه ۳ کرمان (صنعتی)", code: "۰۳", city: "کرمان", address: "شهرک صنعتی خضراء", tel: "۰۳۴-۳۲۷۲۰۰۰۱", type: "industrial" },
      { name: "شعبه رفسنجان", code: "۰۴", city: "رفسنجان", address: "رفسنجان، بلوار شهید مقیمی", tel: "۰۳۴-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه سیرجان", code: "۰۵", city: "سیرجان", address: "سیرجان، بلوار سردار جنگل", tel: "۰۳۴-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه جیرفت", code: "۰۶", city: "جیرفت", address: "جیرفت، بلوار پاسداران", tel: "۰۳۴-۴۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بم", code: "۰۷", city: "بم", address: "بم، بلوار امام خمینی", tel: "۰۳۴-۴۴۲۱۰۰۰۱", type: "general" },
      { name: "شعبه زرند", code: "۰۸", city: "زرند", address: "زرند، خیابان چمران", tel: "۰۳۴-۳۳۴۲۰۰۰۱", type: "general" },
      { name: "شعبه بافت", code: "۰۹", city: "بافت", address: "بافت، بلوار شهید بهشتی", tel: "۰۳۴-۴۲۴۲۰۰۰۱", type: "general" },
      { name: "شعبه کهنوج", code: "۱۰", city: "کهنوج", address: "کهنوج، خیابان آزادی", tel: "۰۳۴-۴۳۲۰۲۰۰۱", type: "general" }
    ]
  },
  {
    id: "west_azerbaijan",
    mapKey: "westAzerbaijan",
    name: "آذربایجان غربی",
    center: "ارومیه",
    branchCount: 9,
    branches: [
      { name: "شعبه ۱ ارومیه", code: "۰۱", city: "ارومیه", address: "بلوار شهید بهشتی، نرسیده به دانشگاه", tel: "۰۴۴-۳۳۴۴۰۰۰۱", type: "general" },
      { name: "شعبه ۲ ارومیه", code: "۰۲", city: "ارومیه", address: "خیابان شهید دستغیب، نرسیده به میدان دفاع مقدس", tel: "۰۴۴-۳۲۳۵۰۰۰۱", type: "general" },
      { name: "شعبه خوی", code: "۰۳", city: "خوی", address: "خوی، بلوار ولیعصر", tel: "۰۴۴-۳۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه میاندوآب", code: "۰۴", city: "میاندوآب", address: "میاندوآب، خیابان پاسداران", tel: "۰۴۴-۴۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مهاباد", code: "۰۵", city: "مهاباد", address: "مهاباد، خیابان صلاح‌الدین ایوبی", tel: "۰۴۴-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بوکان", code: "۰۶", city: "بوکان", address: "بوکان، خیابان انقلاب", tel: "۰۴۴-۴۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه سلماس", code: "۰۷", city: "سلماس", address: "سلماس، خیابان فردوسی", tel: "۰۴۴-۳۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه نقده", code: "۰۸", city: "نقده", address: "نقده، خیابان امام خمینی", tel: "۰۴۴-۳۵۶۲۰۰۰۱", type: "general" },
      { name: "شعبه ماکو", code: "۰۹", city: "ماکو", address: "ماکو، بلوار رسالت", tel: "۰۴۴-۳۴۲۲۰۰۰۱", type: "specialized" }
    ]
  },
  {
    id: "ardabil",
    mapKey: "ardabil",
    name: "اردبیل",
    center: "اردبیل",
    branchCount: 6,
    branches: [
      { name: "شعبه ۱ اردبیل", code: "۰۱", city: "اردبیل", address: "میدان بسیج، بلوار شهید علیپور", tel: "۰۴۵-۳۳۷۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲ اردبیل (دانش)", code: "۰۲", city: "اردبیل", address: "خیابان دانش، کوچه طالقانی", tel: "۰۴۵-۳۳۲۴۰۰۰۱", type: "general" },
      { name: "شعبه پارس‌آباد", code: "۰۳", city: "پارس‌آباد", address: "پارس‌آباد مغان، خیابان امام خمینی", tel: "۰۴۵-۳۲۷۲۰۰۰۱", type: "general" },
      { name: "شعبه مشگین‌شهر", code: "۰۴", city: "مشگین‌شهر", address: "مشگین‌شهر، بلوار مدرس", tel: "۰۴۵-۳۲۵۲۰۰۰۱", type: "general" },
      { name: "شعبه خلخال", code: "۰۵", city: "خلخال", address: "خلخال، خیابان امام خمینی", tel: "۰۴۵-۳۲۴۲۰۰۰۱", type: "general" },
      { name: "شعبه گرمی", code: "۰۶", city: "گرمی", address: "گرمی، خیابان جانبازان", tel: "۰۴۵-۳۲۹۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "zanjan",
    mapKey: "zanjan",
    name: "زنجان",
    center: "زنجان",
    branchCount: 5,
    branches: [
      { name: "شعبه ۱ زنجان", code: "۰۱", city: "زنجان", address: "میدان استقلال، اول خیابان خرمشهر", tel: "۰۲۴-۳۳۷۷۰۰۰۱", type: "general" },
      { name: "شعبه ۲ زنجان", code: "۰۲", city: "زنجان", address: "خیابان کارگران، جنب دادگستری", tel: "۰۲۴-۳۳۵۴۰۰۰۱", type: "general" },
      { name: "شعبه ابهر", code: "۰۳", city: "ابهر", address: "ابهر، میدان معلم، بلوار خرمدره", tel: "۰۲۴-۳۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه خرمدره", code: "۰۴", city: "خرمدره", address: "خرمدره، خیابان شهید بهشتی", tel: "۰۲۴-۳۵۵۲۰۰۰۱", type: "general" },
      { name: "شعبه خدابنده (قیدار)", code: "۰۵", city: "قیدار", address: "قیدار، خیابان امام خمینی", tel: "۰۲۴-۳۴۲۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "qazvin",
    mapKey: "qazvin",
    name: "قزوین",
    center: "قزوین",
    branchCount: 6,
    branches: [
      { name: "شعبه ۱ قزوین", code: "۰۱", city: "قزوین", address: "خیابان بوعلی شرقی، خیابان خیام", tel: "۰۲۸-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲ قزوین (صنعتی الوند)", code: "۰۲", city: "الوند", address: "شهر صنعتی البرز، الوند، بلوار سهروردی", tel: "۰۲۸-۳۲۲۲۰۰۰۱", type: "industrial" },
      { name: "شعبه تاکستان", code: "۰۳", city: "تاکستان", address: "تاکستان، بلوار امام خمینی", tel: "۰۲۸-۳۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بوئین‌زهرا", code: "۰۴", city: "بوئین‌زهرا", address: "بوئین‌زهرا، بلوار طالقانی", tel: "۰۲۸-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه آبیک", code: "۰۵", city: "آبیک", address: "آبیک، خیابان شریعتی", tel: "۰۲۸-۳۲۸۲۰۰۰۱", type: "general" },
      { name: "شعبه کاسپین (صنعتی)", code: "۰۶", city: "آبیک", address: "شهرک صنعتی کاسپین", tel: "۰۲۸-۳۲۸۵۰۰۰۱", type: "industrial" }
    ]
  },
  {
    id: "markazi",
    mapKey: "markazi",
    name: "مرکزی",
    center: "اراک",
    branchCount: 10,
    branches: [
      { name: "شعبه ۱ اراک", code: "۰۱", city: "اراک", address: "خیابان شهید شیرودی (خرم)، نبش کوچه دلگشا", tel: "۰۸۶-۳۳۱۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲ اراک (صنعتی)", code: "۰۲", city: "اراک", address: "میدان صنعت، ابتدای جاده تهران", tel: "۰۸۶-۳۴۱۳۰۰۰۱", type: "industrial" },
      { name: "شعبه ساوه", code: "۰۳", city: "ساوه", address: "ساوه، خیابان مطهری، جنب پارک شهر", tel: "۰۸۶-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه شهرک صنعتی کاوه", code: "۰۴", city: "ساوه", address: "ساوه، شهرک صنعتی کاوه", tel: "۰۸۶-۴۲۳۴۰۰۰۱", type: "industrial" },
      { name: "شعبه خمین", code: "۰۵", city: "خمین", address: "خمین، بلوار قدس", tel: "۰۸۶-۴۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه محلات", code: "۰۶", city: "محلات", address: "محلات، خیابان شهید بهشتی", tel: "۰۸۶-۴۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه دلیجان", code: "۰۷", city: "دلیجان", address: "دلیجان، خیابان طالقانی", tel: "۰۸۶-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه شازند", code: "۰۸", city: "شازند", address: "شازند، خیابان انقلاب", tel: "۰۸۶-۳۸۲۲۰۰۰۱", type: "general" },
      { name: "شعبه تفرش", code: "۰۹", city: "تفرش", address: "تفرش، میدان امام خمینی", tel: "۰۸۶-۳۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه زرندیه", code: "۱۰", city: "مامونیه", address: "مامونیه، بلوار امام خمینی", tel: "۰۸۶-۴۵۲۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "qom",
    mapKey: "qom",
    name: "قم",
    center: "قم",
    branchCount: 5,
    branches: [
      { name: "شعبه ۱ قم", code: "۰۱", city: "قم", address: "میدان سعیدی، خیابان امام خمینی", tel: "۰۲۵-۳۶۶۱۷۰۰۱", type: "general" },
      { name: "شعبه ۲ قم (باجک)", code: "۰۲", city: "قم", address: "خیابان ۱۹ دی (باجک)، کوچه ۵۵", tel: "۰۲۵-۳۷۷۵۴۰۰۰", type: "general" },
      { name: "شعبه ۳ قم (صنعتی شکوهیه)", code: "۰۳", city: "قم", address: "شهرک صنعتی شکوهیه", tel: "۰۲۵-۳۳۳۴۰۰۰۱", type: "industrial" },
      { name: "شعبه ۴ قم (شهید بهشتی)", code: "۰۴", city: "قم", address: "خیابان شهید بهشتی، ۲۴ متری مطهری", tel: "۰۲۵-۳۶۶۴۰۰۰۱", type: "general" },
      { name: "شعبه کهک", code: "۰۵", city: "کهک", address: "کهک، بلوار خلیج فارس", tel: "۰۲۵-۳۴۲۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "hamedan",
    mapKey: "hamedan",
    name: "همدان",
    center: "همدان",
    branchCount: 7,
    branches: [
      { name: "شعبه ۱ همدان", code: "۰۱", city: "همدان", address: "میدان جهاد، ابتدای خیابان میرزاده عشقی", tel: "۰۸۱-۳۸۲۵۰۰۰۱", type: "general" },
      { name: "شعبه ۲ همدان (بعثت)", code: "۰۲", city: "همدان", address: "میدان بعثت، بلوار فاطمیه", tel: "۰۸۱-۳۸۲۲۰۰۰۱", type: "general" },
      { name: "شعبه ملایر", code: "۰۳", city: "ملایر", address: "ملایر، خیابان شهدا", tel: "۰۸۱-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه نهاوند", code: "۰۴", city: "نهاوند", address: "نهاوند، میدان شریعتی", tel: "۰۸۱-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه تویسرکان", code: "۰۵", city: "تویسرکان", address: "تویسرکان، خیابان انقلاب", tel: "۰۸۱-۴۴۹۲۰۰۰۱", type: "general" },
      { name: "شعبه اسدآباد", code: "۰۶", city: "اسدآباد", address: "اسدآباد، میدان شهدا", tel: "۰۸۱-۳۳۱۲۰۰۰۱", type: "general" },
      { name: "شعبه بهار", code: "۰۷", city: "بهار", address: "بهار، بلوار آیت‌الله بهاری", tel: "۰۸۱-۳۴۵۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "kermanshah",
    mapKey: "kermanshah",
    name: "کرمانشاه",
    center: "کرمانشاه",
    branchCount: 8,
    branches: [
      { name: "شعبه ۱ کرمانشاه", code: "۰۱", city: "کرمانشاه", address: "میدان نفت، بلوار زن", tel: "۰۸۳-۳۸۳۵۰۰۰۱", type: "general" },
      { name: "شعبه ۲ کرمانشاه (کسری)", code: "۰۲", city: "کرمانشاه", address: "بلوار شهید بهشتی، جنب استادیوم آزادی", tel: "۰۸۳-۳۸۲۴۰۰۰۱", type: "general" },
      { name: "شعبه ۳ کرمانشاه (فردوسی)", code: "۰۳", city: "کرمانشاه", address: "میدان فردوسی", tel: "۰۸۳-۳۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه اسلام‌آباد غرب", code: "۰۴", city: "اسلام‌آباد غرب", address: "اسلام‌آباد غرب، خیابان شهید چمران", tel: "۰۸۳-۴۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه کنگاور", code: "۰۵", city: "کنگاور", address: "کنگاور، بلوار انقلاب", tel: "۰۸۳-۴۸۲۲۰۰۰۱", type: "general" },
      { name: "شعبه سنقر", code: "۰۶", city: "سنقر", address: "سنقر، خیابان شهید دستغیب", tel: "۰۸۳-۴۸۴۲۰۰۰۱", type: "general" },
      { name: "شعبه پاوه", code: "۰۷", city: "پاوه", address: "پاوه، بلوار جانبازان", tel: "۰۸۳-۴۶۱۲۰۰۰۱", type: "general" },
      { name: "شعبه سرپل ذهاب", code: "۰۸", city: "سرپل ذهاب", address: "سرپل ذهاب، خیابان امام خمینی", tel: "۰۸۳-۴۲۲۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "kurdistan",
    mapKey: "kurdistan",
    name: "کردستان",
    center: "سنندج",
    branchCount: 7,
    branches: [
      { name: "شعبه ۱ سنندج", code: "۰۱", city: "سنندج", address: "خیابان پاسداران، روبروی دانشگاه علوم پزشکی", tel: "۰۸۷-۳۳۲۳۰۰۰۱", type: "general" },
      { name: "شعبه ۲ سنندج", code: "۰۲", city: "سنندج", address: "میدان جهاد، ابتدای بلوار پاسداران", tel: "۰۸۷-۳۳۶۶۰۰۰۱", type: "general" },
      { name: "شعبه سقز", code: "۰۳", city: "سقز", address: "سقز، بلوار جمهوری", tel: "۰۸۷-۳۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مریوان", code: "۰۴", city: "مریوان", address: "مریوان، میدان شهید فهمیده", tel: "۰۸۷-۳۴۵۲۰۰۰۱", type: "general" },
      { name: "شعبه بانه", code: "۰۵", city: "بانه", address: "بانه، بلوار شهدا", tel: "۰۸۷-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه قروه", code: "۰۶", city: "قروه", address: "قروه، خیابان شهید چمران", tel: "۰۸۷-۳۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بیجار", code: "۰۷", city: "بیجار", address: "بیجار، بلوار امام رحمان", tel: "۰۸۷-۳۴۲۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "lorestan",
    mapKey: "lorestan",
    name: "لرستان",
    center: "خرم‌آباد",
    branchCount: 7,
    branches: [
      { name: "شعبه ۱ خرم‌آباد", code: "۰۱", city: "خرم‌آباد", address: "میدان شقایق، بلوار شریعتی", tel: "۰۶۶-۳۳۳۰۰۰۰۱", type: "general" },
      { name: "شعبه ۲ خرم‌آباد", code: "۰۲", city: "خرم‌آباد", address: "خیابان ۶۰ متری، روبروی مصلی", tel: "۰۶۶-۳۳۲۰۰۰۰۱", type: "general" },
      { name: "شعبه بروجرد", code: "۰۳", city: "بروجرد", address: "بروجرد، میدان بهشت، بلوار یادبود", tel: "۰۶۶-۴۲۵۲۰۰۰۱", type: "general" },
      { name: "شعبه دورود", code: "۰۴", city: "دورود", address: "دورود، میدان امام رضا", tel: "۰۶۶-۴۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه الیگودرز", code: "۰۵", city: "الیگودرز", address: "الیگودرز، بلوار توحید", tel: "۰۶۶-۴۳۳۲۰۰۰۱", type: "general" },
      { name: "شعبه کوهدشت", code: "۰۶", city: "کوهدشت", address: "کوهدشت، میدان امام خمینی", tel: "۰۶۶-۳۲۶۲۰۰۰۱", type: "general" },
      { name: "شعبه نورآباد (دلفان)", code: "۰۷", city: "نورآباد", address: "نورآباد، خیابان شهید بهشتی", tel: "۰۶۶-۳۲۷۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "ilam",
    mapKey: "ilam",
    name: "ایلام",
    center: "ایلام",
    branchCount: 5,
    branches: [
      { name: "شعبه ۱ ایلام", code: "۰۱", city: "ایلام", address: "بلوار مدرس، جنب بیمارستان امام خمینی", tel: "۰۸۴-۳۳۳۳۰۰۰۱", type: "general" },
      { name: "شعبه ۲ ایلام", code: "۰۲", city: "ایلام", address: "میدان مادر، بلوار امام علی", tel: "۰۸۴-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه دهلران", code: "۰۳", city: "دهلران", address: "دهلران، خیابان امام خمینی", tel: "۰۸۴-۳۳۷۲۰۰۰۱", type: "general" },
      { name: "شعبه ایوان", code: "۰۴", city: "ایوان", address: "ایوان غرب، خیابان شهید مطهری", tel: "۰۸۴-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مهران", code: "۰۵", city: "مهران", address: "مهران، بلوار امام رضا", tel: "۰۸۴-۳۸۲۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "chaharmahal",
    mapKey: "chaharmahalAndBakhtiari",
    name: "چهارمحال و بختیاری",
    center: "شهرکرد",
    branchCount: 5,
    branches: [
      { name: "شعبه ۱ شهرکرد", code: "۰۱", city: "شهرکرد", address: "بلوار طالقانی، نبش خیابان سعدی", tel: "۰۳۸-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بروجن", code: "۰۲", city: "بروجن", address: "بروجن، میدان شهید بهشتی", tel: "۰۳۸-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه لردگان", code: "۰۳", city: "لردگان", address: "لردگان، خیابان گلزار شهدا", tel: "۰۳۸-۳۴۴۴۰۰۰۱", type: "general" },
      { name: "شعبه فارسان", code: "۰۴", city: "فارسان", address: "فارسان، خیابان شهید بهشتی", tel: "۰۳۸-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه اردل", code: "۰۵", city: "اردل", address: "اردل، بلوار امام علی", tel: "۰۳۸-۳۴۳۴۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "kohgiluyeh",
    mapKey: "kohgiluyehAndBoyerAhmad",
    name: "کهگیلویه و بویراحمد",
    center: "یاسوج",
    branchCount: 5,
    branches: [
      { name: "شعبه ۱ یاسوج", code: "۰۱", city: "یاسوج", address: "بلوار شهید مطهری، روبروی انتقال خون", tel: "۰۷۴-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲ یاسوج", code: "۰۲", city: "یاسوج", address: "بلوار جمهوری، جنب دادگستری", tel: "۰۷۴-۳۳۳۳۰۰۰۱", type: "general" },
      { name: "شعبه دوگنبدان (گچساران)", code: "۰۳", city: "دوگنبدان", address: "دوگنبدان، خیابان ولیعصر", tel: "۰۷۴-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه دهدشت", code: "۰۴", city: "دهدشت", address: "دهدشت، خیابان شهید رجایی", tel: "۰۷۴-۳۲۲۶۰۰۰۱", type: "general" },
      { name: "شعبه دنا (سی‌سخت)", code: "۰۵", city: "سی‌سخت", address: "سی‌سخت، خیابان امام خمینی", tel: "۰۷۴-۳۳۴۴۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "bushehr",
    mapKey: "bushehr",
    name: "بوشهر",
    center: "بوشهر",
    branchCount: 8,
    branches: [
      { name: "شعبه ۱ بوشهر", code: "۰۱", city: "بوشهر", address: "خیابان امام خمینی، روبروی عمارت تاریخی کوتی", tel: "۰۷۷-۳۳۲۵۰۰۰۱", type: "general" },
      { name: "شعبه ۲ بوشهر (سبزآباد)", code: "۰۲", city: "بوشهر", address: "بلوار سپهبد قرنی، روبروی پایگاه هوایی", tel: "۰۷۷-۳۳۴۴۰۰۰۱", type: "general" },
      { name: "شعبه عسلویه (پارس جنوبی)", code: "۰۳", city: "عسلویه", address: "عسلویه، منطقه ویژه اقتصادی انرژی پارس", tel: "۰۷۷-۳۷۲۶۰۰۰۱", type: "industrial" },
      { name: "شعبه کنگان", code: "۰۴", city: "کنگان", address: "بندر کنگان، خیابان ۱۷ شهریور", tel: "۰۷۷-۳۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه برازجان", code: "۰۵", city: "برازجان", address: "برازجان، خیابان فردوسی", tel: "۰۷۷-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه گناوه", code: "۰۶", city: "گناوه", address: "بندر گناوه، بلوار امام خمینی", tel: "۰۷۷-۳۳۴۲۰۰۰۱", type: "general" },
      { name: "شعبه جم", code: "۰۷", city: "جم", address: "جم، بلوار شهید بهشتی", tel: "۰۷۷-۳۷۶۲۰۰۰۱", type: "general" },
      { name: "شعبه دیر", code: "۰۸", city: "دیر", address: "بندر دیر، بلوار ساحلی", tel: "۰۷۷-۳۵۴۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "semnan",
    mapKey: "semnan",
    name: "سمنان",
    center: "سمنان",
    branchCount: 6,
    branches: [
      { name: "شعبه ۱ سمنان", code: "۰۱", city: "سمنان", address: "میدان مشاهیر، خیابان باغ فردوس", tel: "۰۲۳-۳۳۳۳۰۰۰۱", type: "general" },
      { name: "شعبه شاهرود", code: "۰۲", city: "شاهرود", address: "شاهرود، خیابان ۲۲ بهمن", tel: "۰۲۳-۳۲۳۴۰۰۰۱", type: "general" },
      { name: "شعبه دامغان", code: "۰۳", city: "دامغان", address: "دامغان، میدان امام خمینی", tel: "۰۲۳-۳۵۲۲۰۰۰۱", type: "general" },
      { name: "شعبه گرمسار", code: "۰۴", city: "گرمسار", address: "گرمسار، میدان شهدا", tel: "۰۲۳-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مهدی‌شهر", code: "۰۵", city: "مهدی‌شهر", address: "مهدی‌شهر، خیابان امام رضا", tel: "۰۲۳-۳۳۶۲۰۰۰۱", type: "general" },
      { name: "شعبه ایوانکی", code: "۰۶", city: "ایوانکی", address: "ایوانکی، شهرک صنعتی", tel: "۰۲۳-۳۴۵۲۰۰۰۱", type: "industrial" }
    ]
  },
  {
    id: "golestan",
    mapKey: "golestan",
    name: "گلستان",
    center: "گرگان",
    branchCount: 7,
    branches: [
      { name: "شعبه ۱ گرگان", code: "۰۱", city: "گرگان", address: "خیابان ولیعصر، جنب عدالت ۱۸", tel: "۰۱۷-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه ۲ گرگان", code: "۰۲", city: "گرگان", address: "میدان بسیج، ابتدای جاده ساری", tel: "۰۱۷-۳۲۴۲۰۰۰۱", type: "general" },
      { name: "شعبه گنبد کاووس", code: "۰۳", city: "گنبد کاووس", address: "گنبد کاووس، خیابان طالقانی شرقی", tel: "۰۱۷-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه علی‌آباد کتول", code: "۰۴", city: "علی‌آباد کتول", address: "علی‌آباد کتول، خیابان امام رضا", tel: "۰۱۷-۳۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بندر ترکمن", code: "۰۵", city: "بندر ترکمن", address: "بندر ترکمن، خیابان آزادی", tel: "۰۱۷-۳۴۴۲۰۰۰۱", type: "general" },
      { name: "شعبه کردکوی", code: "۰۶", city: "کردکوی", address: "کردکوی، میدان شهید بهشتی", tel: "۰۱۷-۳۴۳۴۰۰۰۱", type: "general" },
      { name: "شعبه آزادشهر", code: "۰۷", city: "آزادشهر", address: "آزادشهر، خیابان امام خمینی", tel: "۰۱۷-۳۵۷۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "north_khorasan",
    mapKey: "northKhorasan",
    name: "خراسان شمالی",
    center: "بجنورد",
    branchCount: 5,
    branches: [
      { name: "شعبه ۱ بجنورد", code: "۰۱", city: "بجنورد", address: "خیابان طالقانی غربی، نبش قیام", tel: "۰۵۸-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه شیروان", code: "۰۲", city: "شیروان", address: "شیروان، خیابان امام رضا", tel: "۰۵۸-۳۶۲۲۰۰۰۱", type: "general" },
      { name: "شعبه اسفراین", code: "۰۳", city: "اسفراین", address: "اسفراین، میدان معلم", tel: "۰۵۸-۳۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه مانه و سملقان (آشخانه)", code: "۰۴", city: "آشخانه", address: "آشخانه، بلوار شهید بهشتی", tel: "۰۵۸-۳۲۹۲۰۰۰۱", type: "general" },
      { name: "شعبه جاجرم", code: "۰۵", city: "جاجرم", address: "جاجرم، خیابان شهید مطهری", tel: "۰۵۸-۳۲۲۷۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "south_khorasan",
    mapKey: "southKhorasan",
    name: "خراسان جنوبی",
    center: "بیرجند",
    branchCount: 6,
    branches: [
      { name: "شعبه ۱ بیرجند", code: "۰۱", city: "بیرجند", address: "خیابان طالقانی، نبش خیابان مفتح", tel: "۰۵۶-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه قائنات", code: "۰۲", city: "قائن", address: "قائن، میدان امام خمینی", tel: "۰۵۶-۳۲۵۲۰۰۰۱", type: "general" },
      { name: "شعبه فردوس", code: "۰۳", city: "فردوس", address: "فردوس، بلوار شفا", tel: "۰۵۶-۳۲۷۲۰۰۰۱", type: "general" },
      { name: "شعبه طبس", code: "۰۴", city: "طبس", address: "طبس، میدان امامزاده", tel: "۰۵۶-۳۲۸۲۰۰۰۱", type: "general" },
      { name: "شعبه نهبندان", code: "۰۵", city: "نهبندان", address: "نهبندان، بلوار کشاورز", tel: "۰۵۶-۳۲۶۲۰۰۰۱", type: "general" },
      { name: "شعبه سرایان", code: "۰۶", city: "سرایان", address: "سرایان، خیابان امام خمینی", tel: "۰۵۶-۳۲۸۸۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "yazd",
    mapKey: "yazd",
    name: "یزد",
    center: "یزد",
    branchCount: 8,
    branches: [
      { name: "شعبه ۱ یزد", code: "۰۱", city: "یزد", address: "بلوار شهید بهشتی، خیابان مهدی", tel: "۰۳۵-۳۶۲۶۱۰۰۱", type: "general" },
      { name: "شعبه ۲ یزد (صنعتی زارچ)", code: "۰۲", city: "زارچ", address: "شهرک صنعتی زارچ، جنب میدان صنعت", tel: "۰۳۵-۳۵۲۲۴۰۰۰", type: "industrial" },
      { name: "شعبه میبد", code: "۰۳", city: "میبد", address: "میبد، خیابان امام خمینی", tel: "۰۳۵-۳۲۳۲۰۰۰۱", type: "general" },
      { name: "شعبه اردکان", code: "۰۴", city: "اردکان", address: "اردکان، میدان چمران", tel: "۰۳۵-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه بافق", code: "۰۵", city: "بافق", address: "بافق، میدان شهدا", tel: "۰۳۵-۳۲۴۲۰۰۰۱", type: "general" },
      { name: "شعبه مهریز", code: "۰۶", city: "مهریز", address: "مهریز، بلوار مطهری", tel: "۰۳۵-۳۲۵۲۰۰۰۱", type: "general" },
      { name: "شعبه ابرکوه", code: "۰۷", city: "ابرکوه", address: "ابرکوه، خیابان شهید بهشتی", tel: "۰۳۵-۳۲۸۲۰۰۰۱", type: "general" },
      { name: "شعبه تفت", code: "۰۸", city: "تفت", address: "تفت، خیابان ۲۲ بهمن", tel: "۰۳۵-۳۲۶۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "sistan_baluchestan",
    mapKey: "sistanAndBaluchestan",
    name: "سیستان و بلوچستان",
    center: "زاهدان",
    branchCount: 7,
    branches: [
      { name: "شعبه ۱ زاهدان", code: "۰۱", city: "زاهدان", address: "بلوار دانشگاه، روبروی سازمان جهاد کشاورزی", tel: "۰۵۴-۳۳۴۴۰۰۰۱", type: "general" },
      { name: "شعبه ۲ زاهدان", code: "۰۲", city: "زاهدان", address: "میدان رسالت، ابتدای بلوار شهید میرحسینی", tel: "۰۵۴-۳۳۲۲۰۰۰۱", type: "general" },
      { name: "شعبه زابل", code: "۰۳", city: "زابل", address: "زابل، خیابان هامون", tel: "۰۵۴-۳۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه چابهار (منطقه آزاد)", code: "۰۴", city: "چابهار", address: "چابهار، منطقه آزاد تجاری صنعتی چابهار", tel: "۰۵۴-۳۵۳۱۰۰۰۱", type: "specialized" },
      { name: "شعبه ایرانشهر", code: "۰۵", city: "ایرانشهر", address: "ایرانشهر، بلوار امام خمینی", tel: "۰۵۴-۳۷۲۲۰۰۰۱", type: "general" },
      { name: "شعبه سراوان", code: "۰۶", city: "سراوان", address: "سراوان، خیابان آزادی", tel: "۰۵۴-۳۷۶۲۰۰۰۱", type: "general" },
      { name: "شعبه خاش", code: "۰۷", city: "خاش", address: "خاش، بلوار مهران", tel: "۰۵۴-۳۳۷۲۰۰۰۱", type: "general" }
    ]
  },
  {
    id: "hormozgan",
    mapKey: "hormozgan",
    name: "هرمزگان",
    center: "بندرعباس",
    branchCount: 8,
    branches: [
      { name: "شعبه ۱ بندرعباس", code: "۰۱", city: "بندرعباس", address: "بلوار امام خمینی، پشت پارک مصطفی خمینی", tel: "۰۷۶-۳۳۶۶۴۰۰۱", type: "general" },
      { name: "شعبه ۲ بندرعباس (شهید رجایی)", code: "۰۲", city: "بندرعباس", address: "اسکله مجتمع بندری شهید رجایی", tel: "۰۷۶-۳۲۵۶۱۱۱۱", type: "industrial" },
      { name: "شعبه ۳ بندرعباس", code: "۰۳", city: "بندرعباس", address: "بلوار رسالت شمالی، میدان صادقیه", tel: "۰۷۶-۳۳۶۷۰۰۰۱", type: "general" },
      { name: "شعبه قشم", code: "۰۴", city: "قشم", address: "قشم، بلوار امام قلی‌خان", tel: "۰۷۶-۳۵۲۴۰۰۰۱", type: "specialized" },
      { name: "شعبه کیش", code: "۰۵", city: "کیش", address: "کیش، میدان سعدی، جنب اداره پست", tel: "۰۷۶-۴۴۴۲۰۰۰۱", type: "specialized" },
      { name: "شعبه بندرلنگه", code: "۰۶", city: "بندرلنگه", address: "بندرلنگه، بلوار پاسداران", tel: "۰۷۶-۴۴۲۲۰۰۰۱", type: "general" },
      { name: "شعبه میناب", code: "۰۷", city: "میناب", address: "میناب، میدان شهدا", tel: "۰۷۶-۴۲۲۲۰۰۰۱", type: "general" },
      { name: "شعبه حاجی‌آباد", code: "۰۸", city: "حاجی‌آباد", address: "حاجی‌آباد، خیابان امام خمینی", tel: "۰۷۶-۳۵۴۲۰۰۰۱", type: "general" }
    ]
  }
];
