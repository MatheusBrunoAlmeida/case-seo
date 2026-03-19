import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getCourseBySlug, resolveSlug } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type CoursePageProps = {
  params: {
    slug: string;
  };
  searchParams: Record<string, string | string[]>;
};

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    return { title: "Curso não encontrado" };
  }

  const canonicalUrl = `${SITE_URL}/curso/${course.slug}`;

  return {
    title: `${course.title} | SEO Case`,
    description: course.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: course.title,
      description: course.description,
      images: [{ url: course.imageUrl }],
      type: "website",
      url: canonicalUrl,
    },
  };
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const resolution = await resolveSlug(params.slug);

  if (!resolution) {
    notFound();
  }

  if (resolution.isAlias) {
    const qs = new URLSearchParams(searchParams as Record<string, string>).toString();
    const target = qs
      ? `/curso/${resolution.canonicalSlug}?${qs}`
      : `/curso/${resolution.canonicalSlug}`;
    permanentRedirect(target);
  }

  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <main>
      <article className="course-hero-card">
        <section className="course-hero-left">
          <p className="course-label">CURSO</p>
          <p className="course-mark">_</p>
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <a href="/">Saiba mais</a>
        </section>

        <section className="course-hero-right">
          <div className="course-badge-ring">
            <div className="course-badge-inner">
              <img src={course.imageUrl} alt={course.title} />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
