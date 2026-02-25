# Case Técnico --- Fullstack (SEO Analysis, Execution & Compatibilidade de Slugs)

## Contexto

Você recebeu este projeto como parte de um time que está enfrentando
queda de tráfego orgânico.

Recentemente, a aplicação passou por uma mudança de nomenclatura dos
slugs dos cursos (simplificação). A **rota pública permaneceu a mesma**,
porém alguns slugs antigos ainda estão circulando na internet e em
bookmarks.

Exemplo:

-   Antigo: `/curso/aprenda-react`
-   Novo: `/curso/react`

A aplicação ainda recebe alto volume de tráfego em URLs com slugs
antigos devido a:

-   Links históricos
-   Indexação anterior
-   Bookmarks de usuários
-   Links externos

Sua missão é analisar o projeto e propor melhorias técnicas relacionadas
a SEO e compatibilidade de slugs.

------------------------------------------------------------------------

## Setup

Suba o projeto com:

``` bash
docker compose up --build
```

A aplicação estará disponível em:

-   Frontend: http://localhost:3000
-   Backend: http://localhost:8080

------------------------------------------------------------------------

# Parte 1 --- Diagnóstico Técnico

Analise o projeto e identifique problemas técnicos relacionados a SEO.

Para cada problema identificado, documente:

-   Onde está (arquivo/endpoint)
-   Por que é um problema
-   Impacto potencial
-   Nível de criticidade (baixo / médio / alto)

⚠️ Evite recomendações genéricas.\
Baseie-se exclusivamente no código real deste projeto.

------------------------------------------------------------------------

# Parte 2 --- Priorização e Implementação

Escolha **um problema crítico** identificado por você e:

1.  Justifique por que ele é prioritário.
2.  Explique o impacto técnico e de negócio.
3.  Implemente a solução.

Requisitos:

-   Não quebrar funcionalidades existentes
-   Código organizado
-   Justificar decisões técnicas
-   Documentar claramente a solução

------------------------------------------------------------------------

# Parte 3 --- Compatibilidade de Slugs (mesma rota)

Os slugs dos cursos foram alterados, mas a rota pública permaneceu:

-   Rota pública: `/curso/{slug}`

Exemplo real:

-   Antigo: `/curso/aprenda-react`
-   Novo: `/curso/react`

A aplicação precisa manter compatibilidade com slugs antigos **na mesma
rota**, garantindo que os acessos antigos não se percam e que o SEO seja
preservado.

## Tarefa

Implemente suporte a slugs antigos no frontend **na rota existente**:

-   `GET /curso/{slug}` deve aceitar tanto slugs novos quanto slugs
    antigos
-   Se receber um slug antigo, deve redirecionar permanentemente para o
    slug novo correspondente (mantendo querystring, ex:
    `?utm_source=test`)
-   Se o slug já for o novo, deve servir normalmente
-   Se não existir (nem como antigo, nem como novo) → retornar 404

⚠️ Importante:

A decisão de mapeamento entre slug antigo e novo deve ser baseada em
informação proveniente do backend.

Você deve definir:

-   Como o backend identifica o novo slug a partir do antigo
-   Qual contrato será utilizado entre frontend e backend
-   Como garantir que apenas slugs válidos sejam redirecionados

------------------------------------------------------------------------

## Validação

Curso existente (slug antigo):

``` bash
curl -I "http://localhost:3000/curso/aprenda-react?utm_source=test"
```

Esperado:

-   Status 301 ou 308
-   Header `Location` apontando para: `/curso/react?utm_source=test`

Curso existente (slug novo):

``` bash
curl -I "http://localhost:3000/curso/react?utm_source=test"
```

Esperado:

-   Status 200 (sem redirect)

Curso inexistente:

``` bash
curl -I "http://localhost:3000/curso/nao-existe"
```

Esperado:

-   Status 404

------------------------------------------------------------------------

# Documentação Obrigatória

Inclua um arquivo `CASE_ANALYSIS.md` contendo:

-   Lista de problemas identificados
-   Problema escolhido e justificativa
-   Explicação técnica da solução implementada
-   Como modelou o contrato backend → frontend
-   Estratégia adotada para compatibilidade de slugs
-   Decisões arquiteturais
-   Considerações de performance e escalabilidade
-   Trade-offs assumidos
-   Diferença entre 301 e 302 (e quando usaria 308)

Seja objetivo e técnico.

------------------------------------------------------------------------

# O que será avaliado

-   Capacidade analítica
-   Profundidade técnica
-   Organização do código
-   Correção de status HTTP
-   Clareza de documentação
-   Capacidade de priorização
-   Conhecimento de Java/Spring
-   Modelagem de contrato backend ↔ frontend
-   Noção de SEO técnico aplicado
-   Capacidade de pensar em alto volume de tráfego

------------------------------------------------------------------------

# Tempo sugerido

4--6 horas.

------------------------------------------------------------------------

# Observações

-   Não use bibliotecas externas de SEO prontas.
-   Mantenha o projeto funcionando via docker compose.
-   Caso utilize IA, você deve ser capaz de explicar as decisões
    técnicas durante a entrevista.