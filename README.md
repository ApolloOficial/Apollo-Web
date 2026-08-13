# Apollo Web

Aplicação web desenvolvida como Projeto Interdisciplinar da disciplina de
Desenvolvimento de Aplicações Dinâmicas - 2º ano, 2026.

---

## Tecnologias

| Ferramenta | Versão | Papel |
|---|---|---|
| Node.js | 20.19+ ou 22.12+ | Ambiente de execução |
| React | 19 | Biblioteca de interface |
| TypeScript | 5 | Tipagem estática |
| Vite | 8 | Build e servidor de desenvolvimento |
| React Router | 7 | Roteamento |
| ESLint | 9 | Análise estática e acessibilidade |

---

## Começando

### Pré-requisitos

Confira as versões instaladas na sua máquina:

```bash
node -v    # precisa ser 20.19+ ou 22.12+
npm -v     # precisa ser 10+
git --version
```

Se o Node estiver desatualizado ou ausente, instale a versão LTS:

```bash
# Windows
winget install OpenJS.NodeJS.LTS

# macOS
brew install node
```

Feche e reabra o terminal depois de instalar — o terminal já aberto mantém o
PATH antigo em memória e continuará mostrando a versão anterior.

### Onde clonar

O caminho da pasta **não pode conter** `&`, acentos, nem estar dentro de
OneDrive, Google Drive ou Dropbox.

- `&` quebra o `cmd.exe` e nenhum script npm roda
- Acentos quebram ferramentas que não tratam UTF-8
- Serviços de sincronização travam e corrompem o `node_modules`

Use algo como `C:\dev` no Windows ou `~/dev` no macOS e Linux.

### Instalação

```bash
git clone https://github.com/ApolloOficial/Apollo-Web.git
cd Apollo-Web
npm install
```

React e TypeScript não são instalados na máquina — são dependências do projeto
e ficam dentro de `node_modules`.

### Variáveis de ambiente

```bash
cp .env.example .env      # macOS e Linux
copy .env.example .env    # Windows
```

Preencha os valores no `.env`. Toda variável precisa do prefixo `VITE_` para o
Vite expor ao código, e é lida com `import.meta.env.VITE_NOME`.

O `.env` está no `.gitignore` e **nunca** deve ser versionado.

### Rodando

```bash
npm run dev       # servidor de desenvolvimento em http://localhost:5173
npm run build     # build de produção
npm run preview   # testa localmente a build de produção
npm run lint      # verifica as regras de ESLint
```

Rode `npm run build` e `npm run lint` antes de abrir Pull Request. Erro de tipo
não aparece no `dev`, só na build.

### Extensões recomendadas do VS Code

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension deque-systems.vscode-axe-linter
```

Ative **Format on Save** para evitar diffs de formatação nos Pull Requests.

---

## Estrutura do projeto

```
src/
├── components/   # um componente por pasta, com index.tsx
├── pages/        # uma página por pasta, com index.tsx
├── services/     # comunicação com API — único lugar onde fetch é permitido
├── types/        # interfaces de props e entidades, por domínio
├── utils/        # validação e sanitização
├── hooks/        # hooks customizados com retorno tipado
├── contexts/     # Context API com Provider dedicado
└── routes/       # configuração do React Router
```

---

## Convenções

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/),
**em inglês**.

```
<tipo>: <descrição no imperativo>
```

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Mudança de código sem alterar comportamento |
| `docs` | Documentação |
| `style` | Formatação, sem mudança de lógica |
| `chore` | Configuração, dependências, tarefas de manutenção |

Exemplos:

```
feat: add product listing page
fix: handle undefined route param in useParams
refactor: extract fetch logic into custom hook
docs: add deploy link to README
chore: configure ESLint accessibility rules
```

Regras:

- **Imperativo, não passado** — `add product listing`, não `added product listing`
- **Minúscula** depois dos dois-pontos, **sem ponto final**
- Escopo opcional quando ajuda a localizar: `feat(auth): add private route guard`
- Nada de mensagens genéricas como `update`, `changes` ou `fix bug`

### Branches

Ninguém commita direto na `main`.

```
<tipo>/<descrição-curta-com-hifens>
```

| Prefixo | Uso |
|---|---|
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `refactor/` | Refatoração |
| `docs/` | Documentação |

Exemplos:

```
feat/product-listing
fix/undefined-route-param
refactor/api-service-layer
docs/setup-instructions
```

### Fluxo de trabalho

```bash
git checkout main
git pull                              # sempre antes de criar a branch
git checkout -b feat/product-listing

# ... desenvolvimento, com commits pequenos e frequentes ...

npm run lint
npm run build                         # os dois precisam passar

git push -u origin feat/product-listing
```

Abra o Pull Request no GitHub, peça revisão de pelo menos um colega e só faça
merge depois da aprovação. Apague a branch após o merge.

---

## Regras do projeto

Estas restrições vêm dos critérios de avaliação da disciplina e **não são
negociáveis**:

- Nenhum arquivo `.js` ou `.jsx` dentro de `src/` — apenas `.ts` e `.tsx`
- Proibido `any` — a tipagem `strict` está ativa no `tsconfig`
- Proibido `fetch` em componentes ou páginas — sempre via `src/services/`
- Proibido `key={index}` em listas com adição, remoção ou reordenação
- Proibido `window.location.href` — navegação via `<Link>` ou `useNavigate`
- Proibido `<div onClick>` — use `<button>` para toda ação
- Proibido `alert()` ou `console.log` como único feedback de operação assíncrona
- Todo `<input>` precisa de `<label>` associado via `htmlFor`
- Toda imagem precisa de `alt` descritivo, ou `alt=""` quando decorativa
- Não atualize o ESLint para a versão 10 — os plugins de React e de
  acessibilidade ainda não a suportam e o `npm install` quebra

---

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `node -v` mostra a versão antiga | Feche todos os terminais e o VS Code, e abra novamente |
| `npm ERR! engine Unsupported` | Node desatualizado — instale a versão LTS |
| `Cannot find module ... vite.js` | Caminho do projeto contém `&` ou acento — mova para `C:\dev` |
| Porta 5173 em uso | `npm run dev -- --port 3000` |
| Erro após trocar de branch | `npm install` — o `package.json` pode ter mudado |
| Variável de ambiente indefinida | Confirme o prefixo `VITE_` e reinicie o servidor |
| `ERESOLVE` ao instalar plugin do ESLint | Confirme que `eslint` e `@eslint/js` estão ambos na versão 9 |

---
