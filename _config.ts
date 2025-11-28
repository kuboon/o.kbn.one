import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import extractDate from "lume/plugins/extract_date.ts";
import feed from "lume/plugins/feed.ts";
// import filter_pages from "lume/plugins/filter_pages.ts";
import inline from "lume/plugins/inline.ts";
import metas from "lume/plugins/metas.ts";
import modifyUrls from "lume/plugins/modify_urls.ts";
import nav from "lume/plugins/nav.ts";
import pagefind from "lume/plugins/pagefind.ts";
import picture from "lume/plugins/picture.ts";
import postcss from "lume/plugins/postcss.ts";
import prism from "lume/plugins/prism.ts";
// import relations from "lume/plugins/relations.ts";
import sitemap from "lume/plugins/sitemap.ts";
import source_maps from "lume/plugins/source_maps.ts";
import transformImages from "lume/plugins/transform_images.ts";
import vento from "lume/plugins/vento.ts";

import markdownItAnchor from "npm:markdown-it-anchor";

const linkIcon = '<svg class="icon"><use href="#octicon-link"></use></svg>';

const mdAnchor = [
  markdownItAnchor,
  {
    callback: (token: any) => token.attrSet("class", "h"),
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      symbol: linkIcon,
    }),
  },
];

const site = lume({
  prettyUrls: false,
  src: "src",
}, { markdown: { options: { breaks: true }, plugins: [mdAnchor] } });

site.use(date());
site.use(esbuild());
// site.use(filter_pages({}));
site.use(postcss());
site.use(source_maps());
site.use(picture());
site.use(transformImages());
site.use(metas());
site.use(inline());
site.use(extractDate());
site.use(feed({
  output: ["feed.rss", "feed.json"],
  info: { title: "o.kbn.one", lang: "ja" },
}));
site.use(modifyUrls({
  fn: (url: string) => url.replace(/\.html$/, ""),
}));
site.use(nav());
site.use(pagefind());
site.use(prism());
// site.use(relations());
site.use(sitemap({
  query: "noindex!=true",
}));
site.use(vento());
site.add([".css", ".ts", ".svg", ".jpeg"]);

export default site;
