````markdown
# Financial Wallet API

Este é o projeto `Financial Wallet API`, uma API modularizada que permite gerenciar usuários, autenticação e transações financeiras. Ele utiliza [NestJS](https://nestjs.com/) para fornecer uma arquitetura robusta e escalável, combinada com PostgreSQL para o armazenamento de dados.

## Conteúdos

- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Execução do Projeto](#execução-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Contribuindo](#contribuindo)

## Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- [Node.js](https://nodejs.org/) na versão 14 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) como gerenciador de pacotes

## Configuração

Antes de executar o projeto, você precisa criar um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```dotenv
POSTGRES_USER=<seu_usuario>
POSTGRES_PASSWORD=<sua_senha>
POSTGRES_DB=financial_wallet
JWT_SECRET=<seu_segredo_jwt>
PORT=3000
```
````

## Execução do Projeto

1. **Build e subir os containers docker:**

   Execute o seguinte comando para iniciar o projeto com Docker:

   ```bash
   docker-compose up --build
   ```

   Este comando irá configurar e executar o PostgreSQL, pgAdmin e a aplicação Nest.js no Docker.

2. **Acessar a aplicação:**

   - A aplicação estará disponível em `http://localhost:3000/`
   - O pgAdmin pode ser acessado em `http://localhost:8081/`

## Funcionalidades

- **Gestão de Usuários:** Criação, atualização, remoção e listagem de usuários.
- **Autenticação:** Autenticação baseada em JWT para segurança e acesso a recursos protegidos.
- **Transações:** Criação, listagem e reversão de transações financeiras entre usuários.

## Documentação da API

A documentação interativa da API utilizando Swagger está disponível em:

```
http://localhost:3000/api
```

Esta documentação detalha todos os endpoints disponíveis, os parâmetros esperados e exemplos de resposta.

---

Este projeto foi configurado utilizando uma arquitetura modular baseada no NestJS, visando escalabilidade e organização. A utilização de TypeScript permite um código mais seguro e manutenível.

```

```
