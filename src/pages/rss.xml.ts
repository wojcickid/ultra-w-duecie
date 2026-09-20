import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import {
  excerpt,
  getAuthorNames,
  getSortedPosts,
  joinNames,
} from '../lib/blog';

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error('Brak `site` w astro.config.mjs (wymagane dla RSS).');
  }
  const posts = await getSortedPosts();
  const items = await Promise.all(
    posts.map(async (post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerpt(post.body),
      link: `/blog/${post.id}`,
      customData: `<dc:creator>${escapeXml(joinNames(await getAuthorNames(post)))}</dc:creator>`,
    })),
  );

  return rss({
    title: 'Ultra w duecie',
    description:
      'Wpisy z drogi dwóch biegaczy po Koronę Polskich Ultramaratonów.',
    site: context.site,
    // Zgodnie z html_handling: drop-trailing-slash (wrangler.jsonc): adresy bez końcowego ukośnika.
    trailingSlash: false,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    customData: '<language>pl-pl</language>',
    items,
  });
}
