# Pendências da avaliação (Apollo-Web)

Auditoria feita em 15/10/2026 sobre o código em `src/`. Legenda: OK = atende, PARCIAL = atende em parte, FALTA = não existe.
Itens marcados "(não verificado)" precisam de teste manual (leitor de tela, contraste, teclado, Profiler).

## Avaliação 1 (primeiro bloco)

| # | Requisito | Status | Situação / o que falta |
|---|-----------|--------|------------------------|
| 1 | Hook customizado tipado com loading, erro e cancelamento via AbortController | PARCIAL | `src/hooks/useApiResource.ts` tem tipo, loading e erro, mas cancela com flag `active`, sem `AbortController`. `services/http.ts` (`request`) não aceita `signal`. Falta passar `signal` até o `fetch` e abortar no cleanup. Quase todas as telas ainda usam `useEffect` + `useState` próprios, sem o hook. |
| 2 | `React.lazy` + `Suspense` por página | FALTA | Nenhum `lazy` nem `Suspense`. `AppRoutes.tsx` importa todas as páginas de forma estática. |
| 3 | `localStorage` com schema versionado (`_versao`) | OK | `utils/session.ts`: `_versao`, checagem ao carregar e descarte em caso de versão diferente. Detalhe: descarta, mas não migra (aceito pelo enunciado). O `JSON.parse` está em `try/catch` e remove a chave se falhar. |
| 4 | `useCallback`/`useMemo` com justificativa + Profiler | PARCIAL | Há 59 usos. Falta justificar cada um (comentário curto) e preparar a demonstração no Profiler. Revisar os que não trazem ganho real. |
| 5 | XSS: sem `dangerouslySetInnerHTML`, só interpolação JSX | OK | Nenhuma ocorrência. Falta só mostrar no código onde os dados externos são tratados. |
| 6 | Validação/sanitização em `src/utils/` com função tipada antes do envio | FALTA | `src/utils/validators.ts` está vazio. A validação hoje está solta nos formulários (`required`, `maxLength`, `minLength` do HTML). Falta: funções tipadas por campo, tamanho máximo, mensagem de erro específica por campo, e todos os `post/patch` passando por elas (login, primeiro acesso, funcionário, realocação, OS). |
| 7 | `PrivateRoute` + estado de autenticação via Context | FALTA | `routes/PrivateRoute.tsx`, `auth/AuthContext.tsx`, `auth/useAuth.ts` e `auth/AuthUser.tsx` estão vazios. Hoje **nenhuma rota é protegida** (`Layout` só carrega o usuário). `useLayoutContext` usa o contexto do Outlet, não um Context de autenticação. Falta: `AuthProvider`, `useAuth`, `PrivateRoute` com `Navigate` para `/login`, envolver as rotas autenticadas. |
| 8 | Acessibilidade WCAG 2.1 AA avançada (ARIA, foco, landmarks, leitor de tela) | PARCIAL | Ver detalhes na seção "Acessibilidade" abaixo. |

## Avaliação 2 (segundo bloco)

| # | Requisito | Status | Situação / o que falta |
|---|-----------|--------|------------------------|
| 9 | Interfaces TS em `src/types/` por domínio, sem `any` | PARCIAL | Sem `any` em `src/` (OK). Mas os tipos de domínio vivem em `pages/*/data-access/dto` e `vm`; em `src/types/` há 10 arquivos **vazios** (alert, branch, common, inverter, map, metrics, panel, relocation, service-order, string). Falta decidir: mover os DTOs para `src/types/` ou apagar os vazios. Também: `tsconfig.app.json` **não tem `"strict": true`** (nem `noImplicitAny`), então a proibição de `any` não é garantida pelo compilador. Ligar `strict` e corrigir os erros. As interfaces de props dos componentes estão inline em cada arquivo, não em `src/types/`. |
| 10 | Chamadas de API isoladas em `src/services/`, um arquivo por recurso, `Promise` tipada, try/catch, sem fetch em componentes, env não versionado | PARCIAL | `fetch` só existe em `services/http.ts` (OK) e `.env` está no `.gitignore` (OK). Porém os serviços reais estão em `pages/*/data-access/services/` e os de `src/services/` (alerts, batches, branches, inverters, panels, relocations, service-orders, strings) estão **vazios**. O try/catch fica nos componentes, não nos serviços. Falta: consolidar em `src/services/` (ou aceitar a estrutura atual, mas limpar os vazios) e tratar erro no serviço. |
| 11 | Estado local com `useState`, campos relacionados agrupados, sem mutação | PARCIAL | Sem mutação direta de estado encontrada (os `push` são em arrays locais recém-criados). Mas há vários `useState` separados para dados relacionados (ex.: `page`, `size`, `totalPages`, `loading`, `error` em `Employees.tsx`, `BranchesAllBranches.tsx` etc.). Falta agrupar em objeto. |
| 12 | `useEffect` com dependências corretas | (não verificado) | Nenhum `eslint-disable` de `exhaustive-deps`. Há 2 `eslint-disable` de `set-state-in-effect` (`AlertDetails.tsx`, `ServiceOrderDetails.tsx`). Falta ensaiar o teste ao vivo (remover uma dependência e mostrar o efeito). |
| 13 | Listas com `key` única, sem `key={index}` | OK | Nenhum `key={index}`. |
| 14 | `useParams` com checagem de `undefined` | OK | `AlertDetails`, `RelocationDetails`, `ServiceOrderDetails`, `BranchesStringDetails`, `BranchesInverterDetails` checam `!id` (e `type`). |
| 15 | 3+ rotas, navegação por `Link`/`useNavigate`, sem `window.location.href`, rota `*` com página de erro e botão de voltar | PARCIAL | Muitas rotas e sem `window.location` (OK). Falta a rota `path="*"`: `pages/not-found/NotFound.tsx` está **vazio** e não está no `AppRoutes`. Criar a página com botão de retorno e registrar a rota. |
| 16 | Acessibilidade mínima AA | PARCIAL | Ver seção "Acessibilidade". |
| 17 | Feedback assíncrono com 3 estados no DOM, sem `alert()`/`console.log` | PARCIAL | Sem `alert()` nem `console.*`. Há carregando e erro (`role="alert"`) nas listas. Falta padronizar o estado de **sucesso** (existe `FeedbackModal`, conferir uso em todos os fluxos) e usar `aria-live` no "Carregando...". |
| 18 | Publicação em Vercel ou GitHub Pages com link no README | FALTA | README não tem link de deploy e não há `vercel.json`/workflow de deploy. Para SPA com React Router, precisa de rewrite para `index.html`. |
| 19 | 20+ commits em Conventional Commits, 4+ semanas de desenvolvimento | FALTA | 48 commits, mas 17 não seguem o padrão (merges, `os-screens`, `feat/alerts-screen`, `fix/adjusting-conflicts`...). Primeiro commit em 11/10/2026: **só 5 dias de histórico**, longe das 4 semanas. Não dá para corrigir o histórico de forma honesta; ver com o professor. Daqui para frente: `feat:`/`fix:`/`refactor:`/`docs:` com descrição. |
| 20 | Extra: Context API com Provider, hook de consumo, tipagem | FALTA | Não existe `createContext`. Resolver junto do item 7 (`AuthContext`). |
| 21 | Extra: `useReducer` com State/Action em union types | FALTA | Nenhum `useReducer`. Bom candidato: estado de filtros + paginação + loading/erro das listas, ou o formulário de realocação. |

## Estrutura do projeto

| # | Requisito | Status | Situação / o que falta |
|---|-----------|--------|------------------------|
| 22 | Vite + React TS, tudo em `src/` com `.ts/.tsx`, sem `.js/.jsx` | OK | Nenhum `.js`/`.jsx` em `src/`. |
| 23 | Componentes em `src/components/`, páginas em `src/pages/`, cada um em pasta própria **com `index.tsx`** | PARCIAL | Cada pasta tem `index.ts` (re-export), não `index.tsx`. Pelo texto literal, falta renomear ou aceitar que `index.ts` sirva (confirmar com o professor). Também há muita pasta/arquivo vazio de rascunho: `pages/shared/**` (Apollo*), `components/breadcrumb`, `error-modal`, `list`, `success-modal`, `header/modal-settings`, `header/options`, `pages/*/filters`, `pages/*/requests`, `reviews`, `branches/mine-branch/batch-*`, `string-form`, `map`, etc. (listar com `find src -type f -empty`). Apagar ou implementar. |
| 24 | Mínimo de 6 componentes com responsabilidade única, sem misturar renderização, regra de negócio e acesso a `src/services/` | PARCIAL | Há mais de 6 componentes reutilizáveis (Paginator, Combobox, SelectInput, DatePicker, FeedbackModal, AppliedFilters, Sidebar, Header...). Mas os componentes de feature (`Employees.tsx`, `BranchesAllBranches.tsx`, `Alerts.tsx`, `Relocations.tsx`, `ServiceOrder.tsx`, formulários) **chamam os serviços e guardam regra de negócio dentro do componente**. Falta extrair para hooks (ex.: `useEmployees`) e deixar o componente só renderizando. |

## Acessibilidade (itens 8 e 16)

- OK: `role="alert"` em 25 pontos, `aria-expanded`/`aria-haspopup`/`aria-controls`/`aria-selected` em Header, Combobox, SelectInput, DatePicker e abas de Filiais; `role="dialog"` + `aria-modal` + foco inicial + Esc nos modais; imagens decorativas com `alt=""`.
- FALTA: devolver o foco ao elemento de origem ao fechar modais e menus (`FeedbackModal`, `DeactivateEmployeeModal`, menu do Header, painel de notificações). Nenhum guarda o elemento que abriu.
- FALTA: prender o foco dentro do modal (focus trap) e navegação por setas nas abas (`role="tablist"` em Filiais e Realocações sem `onKeyDown`).
- FALTA: `<label>` sem `htmlFor` nos formulários de funcionário, realocação e OS (`EmployeesForm`, `RelocationsForm`, `ServiceOrderForm`), e em `SearchInput`/`DatePicker`/`SelectInput` (usam `id` próprio, conferir associação). Só 3 `htmlFor` no projeto.
- FALTA: landmarks. `Layout` já tem `main`, `header`, `aside`/`nav`, mas as páginas (`Employees`, `EmployeeForm`, ...) abrem outro `<main>` **dentro** do `<main>` do Layout (inválido: só pode haver um). Trocar por `<section>`. Não há `<footer>`.
- FALTA: `:focus-visible` verificado em todos os interativos. Há `outline: none` em `AuthPage.css`, `SearchInput.css` e `SimpleInput.css`; conferir se têm substituto visível. Botões e links de tabelas (`.branches-table__row`, `.employees-table__row button`) dependem do estilo padrão.
- (não verificado) contraste 4,5:1 / 3:1: placeholders e textos em `--color-text-muted`/`--color-disabled` provavelmente abaixo de 4,5:1. Medir com o DevTools.
- (não verificado) teste ao vivo só com teclado e com NVDA/VoiceOver.

## Outros achados

- Não existe nenhum teste (`*.test.*`); `src/test/setup.ts` importa `@testing-library/jest-dom/vitest` e o TypeScript acusa erro de módulo (dependência não instalada em `node_modules` aqui). O `npm test` vai falhar ou não achar nada.
- `components/notifications/notifications.mock.ts` e uso de "mock" no `Header.tsx`: dados falsos em produção.
- `.git/stale-index-lock-*` sobrou de um comando meu; pode apagar.

## Ordem sugerida para arrumar

1. `strict: true` + corrigir erros (base para todo o resto).
2. `AuthContext` + `PrivateRoute` + rota `*` com `NotFound`.
3. `React.lazy`/`Suspense` nas rotas.
4. `validators.ts` + usar em todos os formulários.
5. Hook com `AbortController` (+ `signal` no `http.ts`) e extrair a lógica dos componentes de feature para hooks.
6. `useReducer` nas listas; agrupar `useState`.
7. Acessibilidade: labels, foco de volta, focus trap, abas por teclado, `main` duplicado, contraste.
8. Limpar arquivos vazios; decidir `types/` e `services/`.
9. Deploy (Vercel/GitHub Pages) + link no README.
10. Padronizar commits daqui para frente.
