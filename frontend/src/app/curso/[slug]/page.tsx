"use client";

import { useEffect, useState } from "react";
import { getCourseBySlug, type Course } from "@/lib/api";

type CoursePageProps = {
  params: {
    slug: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCourseBySlug(params.slug)
      .then((data) => {
        if (isMounted) {
          setCourse(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCourse(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!course) {
    return (
      <main>
        <h1>Curso não encontrado</h1>
        <p>Não foi possível carregar os dados do curso.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Página do curso</h1>
      <article className="course-hero-card">
        <section className="course-hero-left">
          <p className="course-label">CURSO</p>
          <p className="course-mark">_</p>
          <h2 className="course-title">{course.title}</h2>
          <p className="course-description">{course.description}</p>
          <a href="/">Saiba mais</a>
        </section>

        <section className="course-hero-right">
          <div className="course-badge-ring">
            <div className="course-badge-inner">
              <img src={course.imageUrl} />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
