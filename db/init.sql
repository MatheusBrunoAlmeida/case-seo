SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS seo_case
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE seo_case;

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO courses (slug, title, description, image_url, updated_at) VALUES
  ('react', 'Curso de React', 'Aprenda os fundamentos de React para construir interfaces modernas.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80', NOW()),
  ('nextjs', 'Curso de Next.js', 'Construa aplicações React com renderização híbrida usando Next.js.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', NOW()),
  ('java-spring', 'Curso de Java com Spring', 'Desenvolva APIs robustas com Spring Boot e Java 21.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80', NOW());
