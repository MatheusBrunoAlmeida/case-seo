package com.example.seocase.course;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping
public class CourseController {

    private final CourseRepository courseRepository;
    private final CourseSlugAliasRepository courseSlugAliasRepository;

    public CourseController(CourseRepository courseRepository, CourseSlugAliasRepository courseSlugAliasRepository) {
        this.courseRepository = courseRepository;
        this.courseSlugAliasRepository = courseSlugAliasRepository;
    }

    @GetMapping("/api/courses")
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/api/courses/{slug}")
    public Course getCourseBySlug(@PathVariable String slug) {
        return courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    /**
     * Resolve a slug (new or legacy) to its canonical form.
     *
     * Returns:
     *   200 { canonicalSlug, isAlias: false } — slug is already canonical
     *   200 { canonicalSlug, isAlias: true  } — slug is a legacy alias, frontend must redirect
     *   404                                    — slug unknown entirely
     *
     * Spring MVC prioritises literal path segments over path variables, so
     * "/api/courses/resolve/{slug}" never conflicts with "/api/courses/{slug}".
     */
    @GetMapping("/api/courses/resolve/{slug}")
    public SlugResolutionResponse resolveSlug(@PathVariable String slug) {
        if (courseRepository.findBySlug(slug).isPresent()) {
            return new SlugResolutionResponse(slug, false);
        }

        return courseSlugAliasRepository.findByOldSlug(slug)
                .map(alias -> new SlugResolutionResponse(alias.getCourse().getSlug(), true))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slug not found"));
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemap() {
        String siteUrl = System.getenv().getOrDefault("SITE_URL", "http://localhost:3000");

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        xml.append("<url><loc>").append(siteUrl).append("/</loc></url>");

        for (Course course : courseRepository.findAll()) {
            xml.append("<url><loc>")
               .append(siteUrl)
               .append("/curso/")
               .append(course.getSlug())
               .append("</loc></url>");
        }

        xml.append("</urlset>");
        return ResponseEntity.ok(xml.toString());
    }
}
