import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type DigestDay = CollectionEntry<'digest'>;

const dateFormat = new Intl.DateTimeFormat('el-GR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function greekDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

/** Drafts and stubs are in the repository for review, never on the site. */
export async function publishedArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => data.status === 'published');
  return all.sort((a, b) => b.data.updated.localeCompare(a.data.updated));
}

export async function digestDays(): Promise<DigestDay[]> {
  const all = await getCollection('digest');
  return all.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export const KIND_LABELS: Record<string, string> = {
  origin: 'Αρχική πράξη',
  amends: 'Τροποποίηση',
  implements: 'Εφαρμογή',
  related: 'Σχετική πράξη',
};

export function topicSlug(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, '-');
}
