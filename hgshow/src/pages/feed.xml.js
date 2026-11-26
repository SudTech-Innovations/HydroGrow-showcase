import rss from "@astrojs/rss";
import site from "@data/site.json";
import { getCollection } from "astro:content";

// Du plus récent au plus ancien : l'ordre renvoyé par la collection n'est pas garanti
const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort((a, b) => b.data.date - a.data.date);

export function GET(context) {
  return rss({
    title: site.site_title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      link: `/blog/${post.id}`,
      title: post.data.title,
      pubDate: post.data.date,
    })),
  });
}
