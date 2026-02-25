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

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
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

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemapPlaceholder() {
        String placeholder = "<urlset><url><loc>http://localhost:3000</loc></urlset>";
        return ResponseEntity.ok(placeholder);
    }
}
