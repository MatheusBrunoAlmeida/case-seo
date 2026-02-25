export type Course = {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
};

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
}

export async function getCourseBySlug(slug: string): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  return response.json();
}
