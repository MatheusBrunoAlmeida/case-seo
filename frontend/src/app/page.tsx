import Link from "next/link";
import { getCourses } from "@/lib/api";

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <main>
      <h1>Catálogo de Cursos</h1>
      <p>Escolha um curso para visualizar os detalhes.</p>
      <section className="course-mini-grid">
        {courses.map((course) => (
          <Link key={course.id} href={`/curso/${course.slug}`} className="course-mini-card">
            <p className="course-mini-label">CURSO</p>
            <h2 className="course-mini-title">{course.title}</h2>
            <p className="course-mini-desc">{course.description}</p>
            <span className="course-mini-cta">Ver curso</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
