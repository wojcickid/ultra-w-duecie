import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export const POSTS_PER_PAGE = 10;

export type Post = CollectionEntry<'posts'>;

// Wpisy od najnowszych (przy tej samej dacie stabilnie po identyfikatorze).
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

// Nazwy wyświetlane autorów; nieistniejące referencje są pomijane.
export async function getAuthorNames(post: Post): Promise<string[]> {
  const authors = await getEntries(post.data.authors);
  return authors
    .filter((author) => author !== undefined)
    .map((author) => author.data.displayName);
}

// "Damian", "Damian i Grzegorz", "A, B i C".
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} i ${names[names.length - 1]}`;
}

// Krótki opis z treści Markdown (meta description, RSS).
export function excerpt(markdown: string | undefined, maxLength = 160): string {
  const text = (markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export function blogPageUrl(page: number): string {
  return page <= 1 ? '/blog' : `/blog/strona/${page}`;
}
