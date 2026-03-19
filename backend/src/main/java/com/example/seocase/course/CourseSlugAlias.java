package com.example.seocase.course;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "course_slug_aliases")
public class CourseSlugAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "old_slug", nullable = false, unique = true)
    private String oldSlug;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOldSlug() { return oldSlug; }
    public void setOldSlug(String oldSlug) { this.oldSlug = oldSlug; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
