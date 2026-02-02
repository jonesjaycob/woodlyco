import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://woodlyco.com";

  const routes = [
    "",
    "/about",
    "/gallery",
    "/contact",
    "/faq",
    "/care",
    "/shipping",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/gallery" ? 0.9 : 0.7,
  }));
}
