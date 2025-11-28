import providers from "https://oembed.com/providers.json" with { type: "json" };
import { globToRegExp } from "std/path/mod.ts";

function getApiUrl(url: string) {
  for (const prov of providers) {
    for (const endpoint of prov.endpoints) {
      if ("schemes" in endpoint) {
        const match = endpoint.schemes.some((x) => globToRegExp(x).test(url));
        if (match) return endpoint.url.replace("{format}", "json");
      } else {
        console.log(endpoint);
      }
    }
    if (prov.provider_url && url.startsWith(prov.provider_url)) {
      return prov.provider_url;
    }
  }
}

export function oembed(url: string) {
  const params = new URLSearchParams();
  params.set("url", url);
  params.set("format", "json");
  params.set("maxwidth", "640");
  params.set("maxheight", "480");
  const apiUrl = getApiUrl(url) + "?" + params.toString();
  return fetch(apiUrl).then((r) => r.json());
}
