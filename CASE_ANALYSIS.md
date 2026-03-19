# Análise Técnica de SEO — Case Fullstack

## Metodologia

Análise baseada exclusivamente no código-fonte do projeto. Cada problema identificado está referenciado ao arquivo e linha exatos onde ocorre.

---

## Problemas Identificados

### #1 — Página de curso usa CSR (`"use client"` + `useEffect`)

**Arquivo:** `frontend/src/app/curso/[slug]/page.tsx`, linha 1
**Criticidade:** ALTO

**Descrição técnica:**
O arquivo começa com `"use client"`, convertendo o componente em um Client Component do React. Os dados do curso são buscados dentro de um `useEffect` (linha 16), o que significa que o fetch só ocorre após a hidratação do JavaScript no browser.

O HTML inicial entregue ao cliente (e aos crawlers) é:

```html
<main><h1>Loading...</h1></main>
```

O conteúdo real do curso — título, descrição, imagem — nunca está presente no HTML da resposta HTTP.

**Por que é um problema:**
O Googlebot indexa páginas em duas ondas. A primeira onda processa o HTML estático imediatamente. A segunda onda (JavaScript rendering) é lenta, sujeita a fila de crawl e não garantida para todas as páginas. Com `useEffect`, o conteúdo _nunca_ está no HTML inicial, o que significa que, na prática, as páginas de cursos são indexadas como páginas vazias — ou não indexadas.

**Impacto:**
Tráfego orgânico para páginas de cursos individuais é efetivamente zero. As páginas mais importantes do produto são invisíveis para o Google.

---

### #2 — Sem `generateMetadata` nas páginas de curso

**Arquivo:** `frontend/src/app/curso/[slug]/page.tsx` (ausente); `frontend/src/app/layout.tsx`, linhas 5–8
**Criticidade:** ALTO

**Descrição técnica:**
O layout raiz define apenas:

```typescript
export const metadata: Metadata = {
  title: "SEO Case",
  description: "Aplicação simples para case técnico de SEO"
};
```

Não existe nenhum export `generateMetadata` no arquivo de página do curso. Isso significa que todas as páginas de cursos compartilham o mesmo `<title>SEO Case</title>` e a mesma `<meta name="description">`. Além disso, nenhuma página possui `<link rel="canonical">`.

**Por que é um problema:**
O Google usa `<title>` como um dos sinais mais fortes para determinar o tópico de uma página e seu snippet nos resultados de busca. Sem título único por curso, o Google não consegue diferenciar `/curso/react` de `/curso/nextjs`. Sem canonical, URLs com query strings (ex: `?utm_source=google`) são tratadas como páginas duplicadas, diluindo autoridade.

**Impacto:**
CTR baixo (título genérico no SERP), risco de canibalização entre páginas de cursos, risco de penalização por conteúdo duplicado.

---

### #3 — Sitemap retorna XML inválido e hardcoded

**Arquivo:** `backend/src/main/java/com/example/seocase/course/CourseController.java`, linhas 35–39
**Criticidade:** ALTO

**Descrição técnica:**
O endpoint `/sitemap.xml` no backend retorna:

```xml
<urlset><url><loc>http://localhost:3000</loc></urlset>
```

Dois problemas: (1) o XML é inválido — falta `</url>` antes de `</urlset>`; (2) o único `<loc>` aponta para `localhost`, o que é inútil em produção e não lista nenhum dos cursos reais (`/curso/react`, `/curso/nextjs`, `/curso/java-spring`).

**Por que é um problema:**
O sitemap é o mecanismo principal para informar ao Googlebot quais URLs existem e quando foram atualizadas. Um sitemap inválido pode ser rejeitado pelo Google Search Console. Sem as URLs dos cursos no sitemap, a descoberta das páginas depende exclusivamente de crawling de links, que é mais lento e menos confiável — especialmente para páginas que ainda não têm backlinks.

**Impacto:**
Cursos podem demorar semanas para ser indexados (ou nunca ser). Perda de velocidade de indexação a cada novo curso publicado.

---

### #4 — Ausência de `robots.txt`

**Arquivo:** `frontend/public/` (diretório vazio)
**Criticidade:** MÉDIO

**Descrição técnica:**
O diretório `frontend/public/` contém apenas `.gitkeep`. Não existe arquivo `robots.txt` em nenhum lugar do projeto. O Next.js serve arquivos de `public/` na raiz, então um `robots.txt` em `frontend/public/robots.txt` estaria disponível em `http://localhost:3000/robots.txt`.

**Por que é um problema:**
Sem `robots.txt`, crawlers operam sem orientação explícita. Mais criticamente, não há diretiva `Sitemap:` apontando para o sitemap, o que significa que mesmo após corrigir o sitemap (problema #3), os crawlers podem demorar muito para encontrá-lo — a menos que o URL seja submetido manualmente no Google Search Console.

**Impacto:**
Descoberta lenta do sitemap. Falta de controle sobre quais bots têm acesso e com qual frequência.

---

### #5 — `cache: "no-store"` em chamadas de API que raramente mudam

**Arquivo:** `frontend/src/lib/api.ts`, linha 17 (função `getCourses`)
**Criticidade:** MÉDIO

**Descrição técnica:**
A função `getCourses` usa `cache: "no-store"`:

```typescript
const response = await fetch(`${API_BASE_URL}/api/courses`, {
  cache: "no-store"
});
```

Isso desabilita completamente o cache do Next.js Data Cache para esta chamada. A função `getCourseBySlug` (linha 28) não define cache, o que usa a estratégia padrão do Next.js mas sem revalidação configurada.

**Por que é um problema:**
O conteúdo dos cursos muda raramente (título, descrição, imagem). Com `cache: "no-store"`, cada requisição de crawl ou de usuário faz um round-trip ao Spring Boot, aumentando o TTFB (Time to First Byte). O TTFB é um fator do Core Web Vitals (LCP), que é um sinal de ranking do Google. Em cenários de alto tráfego, isso também sobrecarrega o backend desnecessariamente.

**Impacto:**
TTFB mais alto, Core Web Vitals piores, maior carga no backend, menor pontuação de desempenho no PageSpeed Insights.

---

### #6 — Ausência de tags canonical

**Arquivo:** `frontend/src/app/layout.tsx` e `frontend/src/app/curso/[slug]/page.tsx` (ausente)
**Criticidade:** MÉDIO

**Descrição técnica:**
Nenhuma página do projeto exporta uma tag `<link rel="canonical">`. O Next.js 14 suporta canonical via `generateMetadata` com `alternates.canonical`, mas isso não está implementado.

**Por que é um problema:**
Quando um usuário acessa `/curso/react?utm_source=google`, o Google vê uma URL diferente de `/curso/react`. Sem canonical, o Google pode tratar as duas como páginas distintas com conteúdo idêntico, dividindo a autoridade de link (PageRank) entre as variações. Com campanhas de marketing usando múltiplos parâmetros UTM (`utm_source`, `utm_medium`, `utm_campaign`), o número de URLs "duplicadas" pode crescer rapidamente.

**Impacto:**
Fragmentação de autoridade, risco de conteúdo duplicado, dificuldade para o Google eleger a URL canônica correta para ranquear.

---

### #7 — `<h1>` genérico, título dinâmico do curso como `<h2>`

**Arquivo:** `frontend/src/app/curso/[slug]/page.tsx`, linhas 60 e 65
**Criticidade:** BAIXO

**Descrição técnica:**
```tsx
<h1>Página do curso</h1>          {/* texto genérico e estático */}
<h2 className="course-title">{course.title}</h2>  {/* título real do curso */}
```

O `<h1>` contém texto genérico idêntico em todas as páginas. O título real e único do curso está em `<h2>`.

**Por que é um problema:**
O `<h1>` é o sinal semântico mais forte da hierarquia HTML para indicar o tópico principal de uma página. O Google usa `<h1>` como um dos fatores de relevância. Ter um `<h1>` idêntico em todas as páginas de cursos enfraquece a capacidade do Google de entender sobre o que cada página trata individualmente.

**Impacto:**
Relevância semântica reduzida. Este problema é facilmente resolvido junto com o fix do #1 (conversão para SSR).

---

### #8 — Ausência de tags Open Graph

**Arquivo:** `frontend/src/app/layout.tsx` e `frontend/src/app/curso/[slug]/page.tsx` (ausente)
**Criticidade:** BAIXO

**Descrição técnica:**
Nenhuma página define `og:title`, `og:description`, `og:image` ou `og:url`. O Next.js 14 suporta isso via `metadata.openGraph` no `generateMetadata`.

**Por que é um problema:**
Quando um link de curso é compartilhado no WhatsApp, LinkedIn, Slack ou Twitter/X, o scraper da plataforma busca essas tags para gerar o preview. Sem elas, o compartilhamento aparece como um link cru sem imagem ou descrição.

**Impacto:**
CTR baixo em compartilhamentos sociais. Conteúdo parece não-profissional. Menor potencial de tráfego referral de redes sociais.

---

### #9 — Ausência de dados estruturados (JSON-LD)

**Arquivo:** `frontend/src/app/curso/[slug]/page.tsx` (ausente)
**Criticidade:** BAIXO

**Descrição técnica:**
Nenhuma página implementa Schema.org markup. Para páginas de cursos, o schema relevante é `Course` (com `provider`, `name`, `description`, `image`) e potencialmente `BreadcrumbList`.

**Por que é um problema:**
O Google usa dados estruturados para exibir rich snippets nos resultados de busca — elementos visuais enriquecidos como avaliações, preços, breadcrumbs. Sem schema, os cursos aparecem como resultados orgânicos simples (blue link).

**Impacto:**
Sem rich snippets. CTR potencialmente menor que concorrentes que implementam schema. Perda de visibilidade nos SERPs.

---

## Resumo de Criticidade

| # | Problema | Criticidade | Arquivo |
|---|----------|-------------|---------|
| 1 | CSR com `useEffect` — conteúdo não está no HTML inicial | **ALTO** | `frontend/src/app/curso/[slug]/page.tsx:1` |
| 2 | Sem `generateMetadata` — título/description genéricos | **ALTO** | `frontend/src/app/curso/[slug]/page.tsx` |
| 3 | Sitemap inválido e hardcoded sem cursos reais | **ALTO** | `backend/.../CourseController.java:35` |
| 4 | Sem `robots.txt` | **MÉDIO** | `frontend/public/` (ausente) |
| 5 | `cache: "no-store"` em conteúdo estável | **MÉDIO** | `frontend/src/lib/api.ts:17` |
| 6 | Sem canonical tags | **MÉDIO** | Layout e páginas de curso |
| 7 | `<h1>` genérico, título do curso em `<h2>` | **BAIXO** | `frontend/src/app/curso/[slug]/page.tsx:60` |
| 8 | Sem Open Graph tags | **BAIXO** | Layout e páginas de curso |
| 9 | Sem JSON-LD / dados estruturados | **BAIXO** | `frontend/src/app/curso/[slug]/page.tsx` |

---

## Problema Escolhido para Implementação (Parte 2)

**Problema #1: Conversão da página de curso de CSR para SSR.**

**Justificativa de priorização:**

É o único problema que torna as páginas _completamente não-indexáveis_. Todos os outros problemas degradam a qualidade de uma página que já existe no índice — este impede que a página exista. Corrigir o #1 desbloqueia o valor de corrigir todos os outros.

**Implementação:** Remoção de `"use client"`, conversão para `async` server component, adição de `generateMetadata` com `title`, `description`, `canonical` e `openGraph` dinâmicos por curso. O `<h1>` foi promovido para o título do curso (corrige #7 simultaneamente). O caching foi ajustado para `next: { revalidate: 3600 }` (corrige #5 simultaneamente).

**Arquivos modificados:**
- `frontend/src/app/curso/[slug]/page.tsx`
- `frontend/src/lib/api.ts`

---

## Parte 3 — Compatibilidade de Slugs

### Problema

Slugs de cursos foram alterados (ex: `aprenda-react` → `react`), mas a rota pública `/curso/{slug}` permanece a mesma. Acessos ao slug antigo devem redirecionar permanentemente para o novo, preservando query strings.

### Decisão de design: backend como fonte de verdade

O mapeamento de slugs antigos para novos está no banco de dados (tabela `course_slug_aliases`). O frontend nunca hardcoda mapeamentos — sempre consulta o backend via `GET /api/courses/resolve/{slug}`. Isso garante que o frontend reflita automaticamente qualquer atualização de slug sem deploy.

### Contrato definido

**Novo endpoint:** `GET /api/courses/resolve/{slug}`

| Cenário | Status | Resposta |
|---------|--------|----------|
| Slug canônico existe | 200 | `{ "canonicalSlug": "react", "isAlias": false }` |
| Slug antigo (alias) | 200 | `{ "canonicalSlug": "react", "isAlias": true }` |
| Slug desconhecido | 404 | — |

### Fluxo de redirecionamento

1. `GET /curso/aprenda-react?utm_source=test` chega ao Next.js
2. Server component chama `GET /api/courses/resolve/aprenda-react`
3. Backend encontra `aprenda-react` na tabela `course_slug_aliases`, retorna `{ canonicalSlug: "react", isAlias: true }`
4. Frontend chama `permanentRedirect("/curso/react?utm_source=test")` → HTTP 308
5. `GET /curso/react?utm_source=test` chega ao Next.js
6. Server component chama `GET /api/courses/resolve/react`
7. Backend encontra `react` em `courses`, retorna `{ canonicalSlug: "react", isAlias: false }`
8. Frontend renderiza a página normalmente → HTTP 200

### Por que 308 e não 301?

`permanentRedirect()` do Next.js App Router emite HTTP 308, não 301. O README aceita explicitamente 301 ou 308. Para fins de SEO (transferência de PageRank), Google trata 308 e 301 de forma equivalente. A diferença prática entre os dois é irrelevante para GET requests como páginas de cursos.

### Arquivos modificados/criados

**Backend:**
- `db/init.sql` — tabela `course_slug_aliases` + seed `aprenda-react → react`
- `CourseSlugAlias.java` — entidade JPA
- `CourseSlugAliasRepository.java` — `findByOldSlug()`
- `SlugResolutionResponse.java` — DTO record
- `CourseController.java` — endpoint `GET /api/courses/resolve/{slug}`

**Frontend:**
- `frontend/src/lib/api.ts` — função `resolveSlug()`
- `frontend/src/app/curso/[slug]/page.tsx` — lógica de resolução e redirect

**Extras implementados:**
- `frontend/src/app/sitemap.ts` — sitemap dinâmico real (corrige #3)
- `frontend/public/robots.txt` — robots com diretiva Sitemap (corrige #4)
