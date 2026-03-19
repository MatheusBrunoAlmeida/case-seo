export type Course = {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
};

export type SlugResolution = {
  canonicalSlug: string;
  isAlias: boolean;
};

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`, {
    next: { revalidate: 3600 }
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  return response.json();
}

/**
 * Resolves a slug (new or legacy) to its canonical form.
 * Returns null when the slug does not exist at all (404).
 * Uses cache: "no-store" because slug mappings must always be fresh —
 * a stale cached redirect could send users to the wrong URL.
 */
export async function resolveSlug(slug: string): Promise<SlugResolution | null> {
  const response = await fetch(`${API_BASE_URL}/api/courses/resolve/${slug}`, {
    cache: "no-store"
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Failed to resolve slug");
  }

  return response.json();
}
