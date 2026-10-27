# 🖥️ Apollo Web

<p align="center">
  <strong>Interface web de gestão da plataforma Apollo</strong>
</p>

<p align="center">
  <a href="https://github.com/ApolloOficial/Apollo-Web/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/ApolloOficial/Apollo-Web/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="React Router 7" src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white">
</p>

O Apollo Web é o painel da plataforma Apollo para empresas que operam ativos
fotovoltaicos. Ele permite acompanhar placas e filiais, tratar alertas e ordens
de serviço, solicitar realocações e administrar funcionários conforme o perfil
de acesso.

## Como funciona

- **Aplicação:** frontend de página única em React e TypeScript, compilado pelo Vite.
- **Organização:** páginas e componentes usam hooks, tipos e utilitários; os
  services centralizam chamadas HTTP à Apollo API.
- **Acesso:** React Router protege as rotas privadas; o contexto de autenticação
  mantém a sessão e as permissões definidas para cada perfil.
- **Perfis:** Gerente de Filial administra funcionários e aprova operações; Operador realiza tarefas operacionais; Analista consulta os dados.

```text
Navegador → página → hook/service → Apollo API
               ├→ contexto de autenticação e sessão
               └→ rotas privadas e permissões
```

O guia de frontend descreve a arquitetura, os módulos e as permissões com mais detalhes: [docs/WEB.md](docs/WEB.md).

## Início rápido

Requisitos: Node.js 20.19+ ou 22.12+ e a Apollo API disponível. O CI usa
Node.js 22.

```bash
git clone https://github.com/ApolloOficial/Apollo-Web.git
cd Apollo-Web
npm ci
```

Crie o arquivo local de configuração a partir do exemplo:

```bash
cp .env.example .env      # macOS e Linux
copy .env.example .env    # Windows
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite disponibiliza a aplicação em `http://localhost:5173`.

## API

Defina `VITE_API_URL` no `.env` para apontar o frontend à Apollo API. O valor
local padrão é `http://localhost:8080/api/v1`. Variáveis acessadas pelo Vite
precisam do prefixo `VITE_`; não versione o arquivo `.env`.

As principais áreas do painel são:

| Rota                         | Funcionalidade                                  |
| ---------------------------- | ----------------------------------------------- |
| `/welcome` e `/login`        | Entrada e autenticação                          |
| `/` e `/alerts`              | Visão da filial e tratamento de alertas         |
| `/service-orders`            | Abertura e acompanhamento de ordens de serviço  |
| `/relocations` e `/branches` | Realocações e dados da filial                   |
| `/employees`                 | Administração de funcionários pelo Gerente     |
| `/map` e `/metrics`          | Mapa das filiais e indicadores                  |

As rotas privadas exigem sessão ativa. A matriz completa de acesso por perfil está em [docs/WEB.md](docs/WEB.md).

## Testes

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

O CI também verifica a formatação (`npm run format:check`) e executa os testes
com cobertura (`npm run test:coverage`).

## Documentação

- [Guia de arquitetura, módulos e regras do frontend](docs/WEB.md)
- [Exemplo de variáveis de ambiente](.env.example)
- [Workflow de CI](.github/workflows/ci.yml)
- [Apollo API](https://github.com/ApolloOficial/Apollo-API-Spring)
