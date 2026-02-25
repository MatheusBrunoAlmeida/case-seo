# SEO Backlog (Case Técnico)

## 1) Tornar `/curso/[slug]` indexável

Objetivo:
Garantir que o conteúdo principal da página de curso esteja disponível no HTML inicial.

Critérios de aceite:
- Página `/curso/[slug]` deixa de depender de fetch client-side para conteúdo principal.
- Implementação pode ser SSR ou SSG (candidato escolhe e justifica).
- Ao abrir o código-fonte inicial, título e descrição do curso já estão presentes.

## 2) Meta tags dinâmicas por curso

Objetivo:
Implementar metadados dinâmicos para cada curso.

Critérios de aceite:
- `title` dinâmico por curso.
- `description` dinâmica por curso.
- `canonical` dinâmica por slug.
- Open Graph com `og:title`, `og:description`, `og:image` dinâmicos.

## 3) Implementar `/sitemap.xml` válido

Objetivo:
Gerar sitemap XML válido com URLs relevantes da aplicação.

Critérios de aceite:
- Endpoint `/sitemap.xml` retorna XML válido.
- Inclui `/` e `/curso/{slug}` para todos os cursos do banco.
- `content-type` apropriado para XML.

## 4) Performance de imagens

Objetivo:
Reduzir layout shift e melhorar carregamento das imagens.

Critérios de aceite:
- Substituir `<img>` por `next/image` ou equivalente.
- Definir dimensões para evitar CLS.
- Implementar lazy loading quando aplicável.

## 5) Acessibilidade e semântica

Objetivo:
Melhorar estrutura semântica e acessibilidade básica da página.

Critérios de aceite:
- Apenas um `h1` por página.
- Headings em ordem lógica.
- `alt` apropriado para imagens.
- Uso de elementos semânticos (`main`, `article`, `section`, etc.) quando fizer sentido.
