# Evidências DAD (Aplicações Dinâmicas Web)

Roteiro para demonstrar os requisitos da disciplina. Cada item mostra onde está no
código, como demonstrar e o estado. Os testes manuais de teclado e acessibilidade
foram feitos pela equipe em 01/11/2026 e passaram.

## Mínimos

### Só `.ts` e `.tsx` em `src/`

- **Evidência:** `find src -name "*.js*"` não retorna nada.
- **Como demonstrar:** rodar a busca.
- **Estado:** ATENDIDO.

### Componentes e páginas em pastas com `index.tsx`

- **Evidência:** 104 pastas em `src/components/` e `src/pages/`.
- **Como demonstrar:** abrir `src/components/button/index.tsx`.
- **Estado:** ATENDIDO.

### API isolada em `src/services/`

- **Evidência:** todos os services ficam em `src/services/`, um por recurso
  (`alerts`, `auth`, `branches`, `employees`, `notifications`, `panels`,
  `relocations`, `search`, `service-orders`), usando `request<Tipo>` de `http.ts`.
  Os tipos de cada domínio ficam em `src/types/`.
- **Como demonstrar:** abrir `src/services/`.
- **Estado:** ATENDIDO.

### Componentes sem acesso à API

- **Evidência:** nenhum componente importa `services/`. A busca global usa o hook
  `useGlobalSearchNavigation` (`src/components/global-search/index.tsx`, linha 50).
- **Como demonstrar:** `grep -r "services/" src/components`.
- **Estado:** ATENDIDO.

### Tipagem sem `any`

- **Evidência:** regra `no-explicit-any` como erro em `eslint.config.js`.
- **Como demonstrar:** `npm run lint`.
- **Estado:** ATENDIDO.

### Estado do formulário agrupado

- **Evidência:** `ServiceOrderFormState` em
  `src/pages/service-order/service-order-form/index.tsx`, linha 60.
- **Como demonstrar:** preencher e enviar uma OS.
- **Estado:** ATENDIDO.

### `useEffect` com dependências corretas

- **Evidência:** regra `react-hooks/exhaustive-deps` como erro em `eslint.config.js`.
- **Como demonstrar:** `npm run lint`.
- **Estado:** ATENDIDO.

### Chaves estáveis em listas

- **Evidência:** `key={item.uid}` e `key={panel.uid}` em
  `src/pages/branches/features/mine-branch/inverter-form/strings-step/index.tsx`
  (linhas 49 e 110).
- **Como demonstrar:** no cadastro de inversor, adicionar e remover strings e placas.
- **Estado:** ATENDIDO.

### `useParams` com verificação

- **Evidência:** as telas de detalhe tratam `id` ausente (ex.: `relocation-details`).
- **Como demonstrar:** abrir um detalhe com id inválido.
- **Estado:** ATENDIDO.

### Rotas e página 404

- **Evidência:** `path="*"` em `src/routes/AppRoutes.tsx`, linha 158.
- **Como demonstrar:** abrir `/abc` e clicar em "Voltar ao início".
- **Estado:** ATENDIDO.

### Acessibilidade básica

- **Evidência:** teclado e `aria-activedescendant` em
  `src/components/inputs/combobox/index.tsx` e
  `src/components/inputs/select-input/index.tsx`. Erros com `role="alert"`.
- **Como demonstrar:** usar os filtros só com o teclado (↑ ↓ Enter Esc).
- **Estado:** PARCIALMENTE ATENDIDO. Teclado, rótulos e `role="alert"` testados manualmente; o contraste do botão laranja fica pendente.

### Carregamento, sucesso e erro

- **Evidência:** skeleton nas listas, modais de sucesso e `ErrorState` com
  "Tentar novamente" (`src/components/error-state/index.tsx`).
- **Como demonstrar:** parar a API, abrir Alertas, subir a API e clicar em
  "Tentar novamente".
- **Estado:** NÃO VERIFICÁVEL.

### Publicação

- **Evidência:** pendente.
- **Como demonstrar:** abrir o link da Vercel.
- **Estado:** NÃO ATENDIDO.

### Commits convencionais

- **Evidência:** 107 commits de 11/10 a 01/11/2026.
- **Como demonstrar:** `git log --oneline`.
- **Estado:** PARCIALMENTE ATENDIDO (3 semanas e 1 dia).

## Extras

### Context de autenticação

- **Evidência:** `AuthProvider` e `useAuth` em `src/contexts/AuthProvider.tsx`.
- **Como demonstrar:** entrar, apertar F5 e sair.
- **Estado:** ATENDIDO.

### Hook com `AbortController`

- **Evidência:** `src/hooks/useApiResource.ts`, linha 30.
- **Como demonstrar:** em Filiais, trocar de aba com a aba Network aberta; a
  requisição aparece como cancelada.
- **Estado:** ATENDIDO.

### `useReducer`

- **Evidência:** `src/pages/branches/data-access/vm/InverterForm.reducer.ts`, usado
  no cadastro de inversor (4 etapas).
- **Como demonstrar:** avançar e voltar entre as etapas.
- **Estado:** ATENDIDO.

### `React.lazy` e `Suspense`

- **Evidência:** 23 páginas com `lazy()` em `src/routes/AppRoutes.tsx`.
- **Como demonstrar:** aba Network, um arquivo `.js` novo por página.
- **Estado:** ATENDIDO. O build gera 51 arquivos `.js`, um por página e por dependência compartilhada.

### `localStorage` versionado

- **Evidência:** `_versao` em `src/utils/session.ts`.
- **Como demonstrar:** alterar `_versao` no navegador e recarregar.
- **Estado:** ATENDIDO.

### Validação tipada em `src/utils/`

- **Evidência:** `src/utils/validators/` reúne senha, e-mail, IPv4, porta,
  preenchimento, tamanho máximo, URL https, strings do inversor e
  `validateServiceOrderForm`, que devolve `ValidationResult` com erro por campo.
- **Como demonstrar:** abrir uma OS sem preencher o técnico.
- **Estado:** ATENDIDO.

### `PrivateRoute`

- **Evidência:** `src/routes/PrivateRoute.tsx`, usando `useAuth`.
- **Como demonstrar:** abrir `/alerts` sem estar logado.
- **Estado:** ATENDIDO.

### Modais acessíveis

- **Evidência:** `src/hooks/useModalFocus.ts`.
- **Como demonstrar:** no modal de desligar funcionário, Tab e Shift+Tab ficam
  dentro, Esc fecha e o foco volta ao botão.
- **Estado:** ATENDIDO. Testado manualmente.

### Landmarks

- **Evidência:** um único `<main>`, `<nav aria-label="Menu principal">` e link
  "Pular para o conteúdo" e `<footer>` semântico (lido só pelo leitor de tela) em
  `src/components/layout/index.tsx`.
- **Como demonstrar:** apertar Tab ao abrir a página.
- **Estado:** ATENDIDO. Testado manualmente.

### `useMemo` e `useCallback` justificados

- **Como demonstrar:** medir no React Profiler.
- **Estado:** NÃO VERIFICÁVEL.

## Verificações

Executadas em 01/11/2026 numa cópia limpa do projeto, com `npm ci`, em Linux
(mesmo ambiente do CI):

- `npm run lint`: passou.
- `npm run format:check`: passou.
- `npm run typecheck`: passou.
- `npm run test:coverage`: 5 arquivos e 17 testes passaram.
- `npm run build`: passou, com 51 arquivos `.js` em `dist/assets`.

## Testes automatizados

- `src/utils/validators/validators.test.ts`: validadores e `validateServiceOrderForm`.
- `src/utils/session.test.ts`: sessão com `_versao` e descarte de versão antiga.
- `src/pages/branches/data-access/vm/InverterForm.reducer.test.ts`: ações do reducer.
- `src/components/error-state/ErrorState.test.tsx`: `role="alert"` e "Tentar novamente".
- `src/components/inputs/combobox/Combobox.test.tsx`: seleção só pelo teclado e Esc.

## Roteiro de teste manual

1. **Rotas:** abrir `/abc` e voltar ao início. Abrir `/alerts` deslogado.
2. **Autenticação:** entrar, apertar F5 e sair. Entrar como técnico.
3. **Teclado:** apertar Tab desde o topo e usar os filtros com ↑ ↓ Enter Esc.
4. **Modal:** abrir "Desligar" em Funcionários e testar Tab, Shift+Tab e Esc.
5. **Erro:** parar a API, abrir Alertas e usar "Tentar novamente".
6. **Cancelamento:** trocar de aba em Filiais com a aba Network aberta.
7. **Lazy:** navegar entre páginas com a aba Network aberta.
8. **Reducer:** cadastrar um inversor passando pelas 4 etapas.
