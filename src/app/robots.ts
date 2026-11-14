import type { MetadataRoute } from "next";

// Search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
// Google-Extended…) are all welcome: everything here is public.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://gwaphcalc.shaunniekins.com/sitemap.xml",
    host: "https://gwaphcalc.shaunniekins.com",
  };
}
