import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/api";

// force-dynamic: sitemap depends on runtime data from the backend
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();

  const courseUrls: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/curso/${course.slug}`,
    lastModified: new Date(course.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...courseUrls,
  ];
}
