# Evidências de Aplicações Dinâmicas (Web)

Este documento reúne os requisitos da disciplina e mostra, para cada um, onde ele
está no código e como apresentar. Os links levam direto ao arquivo e à linha. Os
testes de teclado e acessibilidade foram feitos pela equipe em 01/11/2026.

- **Aplicação publicada:** [apollo-sigma-ruby.vercel.app](https://apollo-sigma-ruby.vercel.app)
- **Repositório:** [github.com/ApolloOficial/Apollo-Web](https://github.com/ApolloOficial/Apollo-Web)

## Requisitos mínimos

### Projeto em TypeScript

- **Onde está:** [src/](../src), sem nenhum `.js` ou `.jsx`.
- **Como verificar:** `find src -name "*.js*"` não retorna nada.
- **Situação:** atendido.

### Componentes e páginas em pasta própria com `index.tsx`

- **Onde está:** [src/components/](../src/components) e [src/pages/](../src/pages), por exemplo [button/index.tsx](../src/components/button/index.tsx).
- **Como verificar:** abrir qualquer pasta de componente ou página.
- **Situação:** atendido.

### Componentes de responsabilidade única, sem acesso à API

- **Onde está:** [src/components/](../src/components). A busca global usa o hook [useGlobalSearchNavigation](../src/components/global-search/index.tsx#L50) em vez de chamar a API.
- **Como verificar:** `grep -r "services/" src/components` não retorna nada.
- **Situação:** atendido.

### Tipos em `src/types/`, sem `any`

- **Onde está:** [src/types/](../src/types) e a regra [no-explicit-any](../eslint.config.js#L24).
- **Como verificar:** `npm run lint`.
- **Situação:** atendido.

### API isolada em `src/services/`

- **Onde está:** [src/services/](../src/services), um arquivo por recurso. Todos usam [request](../src/services/http.ts#L55), que devolve `Promise<T>` e concentra o try/catch. O `.env` fica fora do Git pelo [.gitignore](../.gitignore#L24).
- **Como verificar:** abrir a pasta `src/services/`.
- **Situação:** atendido.

### Estado do formulário agrupado

- **Onde está:** [ServiceOrderFormState](../src/pages/service-order/service-order-form/index.tsx#L30) e [updateField](../src/pages/service-order/service-order-form/index.tsx#L67), que atualiza o objeto sem mutação.
- **Como verificar:** preencher e enviar uma OS.
- **Situação:** atendido.

### Dependências do `useEffect`

- **Onde está:** a regra [exhaustive-deps](../eslint.config.js#L25) e o [useApiResource](../src/hooks/useApiResource.ts#L27).
- **Como verificar:** remover uma dependência ao vivo e ver o lint e o comportamento mudarem.
- **Situação:** atendido.

### Chaves estáveis nas listas

- **Onde está:** [key={item.uid}](../src/pages/branches/features/mine-branch/inverter-form/strings-step/index.tsx#L49) e [key={panel.uid}](../src/pages/branches/features/mine-branch/inverter-form/strings-step/index.tsx#L110), com o `uid` gerado por `crypto.randomUUID()` na criação.
- **Como verificar:** no cadastro de inversor, adicionar e remover strings e placas.
- **Situação:** atendido.

### Verificação do `useParams`

- **Onde está:** as telas de detalhe tratam `id` ausente, por exemplo [relocation-details](../src/pages/relocations/relocation-details/index.tsx#L35).
- **Como verificar:** abrir um detalhe com um id inválido.
- **Situação:** atendido.

### Rotas e página 404

- **Onde está:** [AppRoutes.tsx](../src/routes/AppRoutes.tsx#L158), com a rota `path="*"`, e a página [NotFound](../src/pages/not-found/index.tsx).
- **Como verificar:** acessar `/abc` e clicar em "Voltar ao início".
- **Situação:** atendido.

### Acessibilidade básica

- **Onde está:** [Combobox](../src/components/inputs/combobox/index.tsx#L58) e [SelectInput](../src/components/inputs/select-input/index.tsx#L132), no padrão ARIA de combobox, e [ErrorState](../src/components/error-state/index.tsx#L19) com `role="alert"`.
- **Como verificar:** usar os filtros de Alertas só pelo teclado.
- **Situação:** parcialmente atendido.

### Carregamento, sucesso e erro

- **Onde está:** [TableSkeleton](../src/components/table-skeleton/index.tsx#L7) no carregamento, modais de sucesso nos formulários e [ErrorState](../src/components/error-state/index.tsx) com "Tentar novamente".
- **Como verificar:** desligar a API, abrir Alertas e usar "Tentar novamente".
- **Situação:** atendido.

### Publicação

- **Onde está:** [apollo-sigma-ruby.vercel.app](https://apollo-sigma-ruby.vercel.app), com o link no [README](../README.md). A função [`api/[...path].ts`](../api/%5B...path%5D.ts) repassa as chamadas à API e o [vercel.json](../vercel.json) faz o F5 em rotas internas abrir o app.
- **Como verificar:** abrir o link em janela anônima, entrar, apertar F5 em `/alerts` e acessar `/abc`.
- **Situação:** atendido.

### Commits no padrão Conventional Commits

- **Onde está:** [histórico de commits](https://github.com/ApolloOficial/Apollo-Web/commits/main).
- **Como verificar:** `git log --oneline`.
- **Situação:** parcialmente atendido.

## Requisitos extras

### Context API

- **Onde está:** [AuthProvider](../src/contexts/AuthProvider.tsx#L41), [AuthContextValue](../src/contexts/auth.context.ts#L7) e o hook tipado [useAuth](../src/hooks/useAuth.ts#L4), que evita prop drilling.
- **Como verificar:** entrar, apertar F5 e sair.
- **Situação:** atendido.

### `useReducer`

- **Onde está:** [InverterForm.reducer.ts](../src/pages/branches/data-access/vm/InverterForm.reducer.ts#L20), com `State` e `Action` em union types, usado no [cadastro de inversor](../src/pages/branches/features/mine-branch/inverter-form/index.tsx#L52).
- **Como verificar:** passar pelas quatro etapas do cadastro.
- **Situação:** atendido.

### Hook com `AbortController`

- **Onde está:** [useApiResource](../src/hooks/useApiResource.ts#L30), com o `signal` repassado ao `fetch` em [request](../src/services/http.ts#L77).
- **Como verificar:** trocar de aba em Filiais com a aba Network aberta.
- **Situação:** atendido.

### `React.lazy` e `Suspense`

- **Onde está:** [AppRoutes.tsx](../src/routes/AppRoutes.tsx#L10), com um chunk por página no build.
- **Como verificar:** aba Network ao navegar entre as telas.
- **Situação:** atendido.

### `localStorage` com versão

- **Onde está:** [session.ts](../src/utils/session.ts#L21), que descarta a sessão quando `_versao` não bate.
- **Como verificar:** alterar `_versao` no navegador e recarregar.
- **Situação:** atendido.

### Proteção contra XSS

- **Onde está:** não há `dangerouslySetInnerHTML`; o conteúdo dinâmico vai por `{variavel}` no JSX. Os links dos dashboards passam por [sanitizeEmbedUrl](../src/utils/validators/url.ts#L1) antes do [iframe](../src/pages/metrics/features/dashboard-frame/index.tsx#L53).
- **Como verificar:** mostrar o código.
- **Situação:** atendido.

### Validação em `src/utils/`

- **Onde está:** [ValidationResult](../src/utils/validators/index.ts#L26) e [validateServiceOrderForm](../src/utils/validators/index.ts#L51), usada no [formulário de OS](../src/pages/service-order/service-order-form/index.tsx#L136).
- **Como verificar:** tentar abrir uma OS sem escolher o técnico.
- **Situação:** atendido.

### `PrivateRoute`

- **Onde está:** [PrivateRoute.tsx](../src/routes/PrivateRoute.tsx#L12), que lê a autenticação pelo `useAuth`.
- **Como verificar:** abrir `/alerts` sem login.
- **Situação:** atendido.

### Acessibilidade avançada

- **Onde está:** [useModalFocus](../src/hooks/useModalFocus.ts#L6) nos modais, [Layout](../src/components/layout/index.tsx#L35) com `<main>`, `<footer>` e o link "Pular para o conteúdo", [Header](../src/components/header/index.tsx#L81) e [Sidebar](../src/components/sidebar/index.tsx#L70) com `<nav aria-label>`.
- **Como verificar:** abrir o modal de desligar funcionário e navegar com Tab, Shift+Tab e Esc.
- **Situação:** atendido.

## Verificações

Rodadas em 01/11/2026 em uma cópia limpa do projeto, no mesmo ambiente do CI:

- `npm run lint`: sem erros.
- `npm run format:check`: sem erros.
- `npm run typecheck`: sem erros.
- `npm run test:coverage`: 17 testes em 5 arquivos, todos passando.
- `npm run build`: concluído, com um chunk por página em `dist/assets`.

## Testes automatizados

- [validators.test.ts](../src/utils/validators/validators.test.ts): validadores e validação da OS.
- [session.test.ts](../src/utils/session.test.ts): sessão com `_versao`.
- [InverterForm.reducer.test.ts](../src/pages/branches/data-access/vm/InverterForm.reducer.test.ts): ações do cadastro de inversor.
- [ErrorState.test.tsx](../src/components/error-state/ErrorState.test.tsx): aviso de erro e "Tentar novamente".
- [Combobox.test.tsx](../src/components/inputs/combobox/Combobox.test.tsx): seleção pelo teclado e Esc.

## Roteiro da apresentação

1. Abrir o site em janela anônima e acessar `/alerts` sem login.
2. Entrar, apertar F5 e sair. Entrar como técnico e mostrar a permissão negada.
3. Acessar `/abc` e voltar ao início.
4. Apertar Tab desde o topo e usar os filtros de Alertas só pelo teclado.
5. Abrir o modal de desligar funcionário e testar Tab, Shift+Tab e Esc.
6. Com a aba Network aberta, navegar entre as telas e trocar de aba em Filiais.
7. Cadastrar um inversor pelas quatro etapas.
8. Desligar a API, abrir Alertas e usar "Tentar novamente".
