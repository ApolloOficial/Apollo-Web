# 🖥️ Apollo Web

<p align="center">
  <strong>Interface web para gestão de ativos fotovoltaicos</strong>
</p>

<p align="center">
  <a href="https://github.com/ApolloOficial/Apollo-Web/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/ApolloOficial/Apollo-Web/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="React 19" src="https://img.shields.io/badge/React%2019-61DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF">
</p>

O Apollo Web permite que gerentes, operadores e analistas acompanhem ativos, alertas e ordens de serviço na plataforma Apollo. A aplicação utiliza React e TypeScript e consome a [Apollo API](https://github.com/ApolloOficial/Apollo-API-Spring).

## Como funciona

- **Interface:** páginas e componentes apresentam os módulos de gestão.
- **Integração:** serviços centralizam a comunicação HTTP com a API.
- **Sessão:** contexto de autenticação e rotas privadas controlam a navegação.
- **Qualidade:** TypeScript, ESLint e Vitest apoiam a validação.

```text
Usuário → página → serviço HTTP → Apollo API → banco de dados
```

## Início rápido

Requisitos: Node.js 20.19+ ou 22.12+ e Apollo API disponível.

```bash
git clone https://github.com/ApolloOficial/Apollo-Web.git
cd Apollo-Web
npm install
cp .env.example .env
npm run dev
```

No PowerShell, use `Copy-Item .env.example .env`. Configure `VITE_API_URL` com a base da API, incluindo `/api/v1`. O servidor local utiliza normalmente `http://localhost:5173`.

## Módulos

A interface organiza alertas, ordens de serviço, realocações, filiais, funcionários, mapa e métricas. O acesso depende do perfil do funcionário; as regras também precisam ser aplicadas pela API.

## Testes

```bash
npm run build
npm run lint
npm run test:run
```

O comando de testes permite ausência de testes; uma execução sem casos não comprova cobertura funcional. Valide também o fluxo alterado com a API disponível.

## Documentação

- [Arquitetura, módulos, convenções e problemas comuns](docs/WEB.md)
- [Configuração de ambiente](.env.example)
- [API da plataforma](https://github.com/ApolloOficial/Apollo-API-Spring)
