package com.example.seocase.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseSlugAliasRepository extends JpaRepository<CourseSlugAlias, Long> {
    Optional<CourseSlugAlias> findByOldSlug(String oldSlug);
}
