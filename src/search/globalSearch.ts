// globalSearch.ts - جستجوی سراسری بین قوانین، پرسش‌ها و قالب‌ها

export type SearchSource = 'law' | 'faq' | 'template';

export interface SearchDoc {
  id: string;
  source: SearchSource;
  tab: string;          // تب مقصد در App (مثلاً 'laws', 'faq', 'templates')
  title: string;
  subject?: string;
  content: string;
  tags?: string[];
}

export interface SearchResult extends SearchDoc {
  score: number;
}

/** نرمال‌سازی فارسی: ی/ک عربی، ارقام، نیم‌فاصله، اعراب و فاصله‌های اضافه */
export function normalizeFa(input: string): string {
  return (input || '')
    .replace(/[\u064B-\u065F\u0670]/g, '')          // اعراب
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\u200C\u200B\u200E\u200F\u202A-\u202E]/g, '') // ZWNJ و کاراکترهای جهت‌دهی
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[‌]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function tokenize(q: string): string[] {
  return normalizeFa(q)
    .split(/[\s،,.؛;:!؟?()«»"']+/)
    .filter(t => t.length > 0);
}

/** امتیازدهی: هر توکن باید در متن باشد؛ وزن فیلدها: عنوان > موضوع > برچسب > متن */
export function searchDocs(docs: SearchDoc[], query: string, limit = 30): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const doc of docs) {
    const title = normalizeFa(doc.title);
    const subject = normalizeFa(doc.subject ?? '');
    const tags = normalizeFa((doc.tags ?? []).join(' '));
    const content = normalizeFa(doc.content);

    let score = 0;
    let allMatched = true;

    for (const t of tokens) {
      let hit = 0;
      if (title.includes(t)) hit = Math.max(hit, 10);
      if (subject.includes(t)) hit = Math.max(hit, 6);
      if (tags.includes(t)) hit = Math.max(hit, 5);
      if (content.includes(t)) hit = Math.max(hit, 2);
      if (hit === 0) { allMatched = false; break; }
      score += hit;
    }

    if (!allMatched) continue;
    // عبارت کامل در عنوان، امتیاز بیشتر
    const phrase = normalizeFa(query);
    if (phrase && title.includes(phrase)) score += 15;

    results.push({ ...doc, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/* ---------- آداپتورها ---------- */

interface LawLike { id: string; title: string; subject: string; content: string; tags: string[]; category: string }
export const lawsToDocs = (laws: LawLike[]): SearchDoc[] =>
  laws.map(l => ({ id: l.id, source: 'law', tab: 'laws', title: l.title, subject: l.subject, content: l.content, tags: l.tags }));

export interface FaqLike { q: string; a: string }
export const faqToDocs = (faq: FaqLike[]): SearchDoc[] =>
  faq.map((f, i) => ({ id: `faq-${i}`, source: 'faq', tab: 'faq', title: f.q, content: f.a }));

export interface TemplateLike { id: string; title: string; category?: string; body: string; tags?: string[] }
export const templatesToDocs = (items: TemplateLike[]): SearchDoc[] =>
  items.map(t => ({ id: t.id, source: 'template', tab: 'templates', title: t.title, subject: t.category, content: t.body, tags: t.tags }));

export const SOURCE_LABEL: Record<SearchSource, string> = {
  law: 'قوانین',
  faq: 'پرسش و پاسخ',
  template: 'قالب‌ها',
};
