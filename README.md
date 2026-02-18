# 🛒 GoShopp API - Backend

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

> **Status do Projeto:** 🚧 Em Desenvolvimento (Módulo de Identidade Concluído)
> 
> **Acesso Rápido:** [Status da API (Health Check) na Vercel](https://go-shopp-back-end.vercel.app/)

## 💻 Sobre o Projeto

O **GoShopp API** é o motor de backend de um marketplace digital. Este projeto foi concebido para não ser apenas mais um CRUD, mas sim uma demonstração prática da aplicação de conceitos avançados de engenharia de software no ecossistema Node.js. 

O objetivo principal é construir uma API escalável, de fácil manutenção e testável, separando rigorosamente as regras de negócio dos frameworks e bibliotecas externas.

## 🏗️ Arquitetura e Padrões

Este projeto foi desenhado seguindo os princípios da **Clean Architecture** (Arquitetura Limpa) e **Domain-Driven Design (DDD)** simplificado. A estrutura é dividida em camadas muito bem definidas:

* **Domain (Core):** Contém as entidades de negócio puras (ex: `User`) e as interfaces dos repositórios. Totalmente isolada, não conhece banco de dados nem frameworks web.
* **Application:** Onde residem os *Use Cases* (Casos de Uso), orquestrando as regras de negócio.
* **Infra:** Implementações concretas de acesso a dados (Repositórios do Prisma, Mappers de conversão).
* **Presentation:** A porta de entrada da aplicação (Controllers do NestJS, Auth Guards).

## 🚀 Principais Funcionalidades (Até o momento)

**Módulo de Identidade (Auth & Users):**
- [x] Criação de contas com hash de senha seguro (`bcrypt`).
- [x] Autenticação de usuários gerando Token de Acesso (`@nestjs/jwt`).
- [x] Proteção de rotas com `AuthGuard` personalizado.
- [x] Consulta de perfil, atualização de dados e remoção (Soft Delete).
- [x] Rota pública de Health Check para monitoramento do deploy.

## 🛠️ Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (com configuração rigorosa de ESLint e Prettier)
* **Banco de Dados:** [MongoDB](https://www.mongodb.com/) (Atlas)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Segurança:** JWT (JSON Web Tokens) e Bcrypt
* **Testes:** [Jest](https://jestjs.io/) (Foco massivo em Testes Unitários isolados com mocks)
* **Deploy / Infra:** Serverless via [Vercel](https://vercel.com/) utilizando o adapter `@vercel/node`.

## ⚙️ Como rodar o projeto localmente

Para rodar este projeto na sua máquina, você precisará do [Node.js](https://nodejs.org/) e de uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ou rodando local).

**1. Clone o repositório:**
```bash
git clone [https://github.com/SEU_USUARIO/GoShopp.git](https://github.com/SEU_USUARIO/GoShopp.git)
cd GoShopp
```
**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto e adicione a sua string de conexão:
```env
DATABASE_URL="mongodb+srv://<usuario>:<senha>@cluster0.abc.mongodb.net/goshopp?retryWrites=true&w=majority"
```

**4. Gere o Prisma Client:**
```bash
npx prisma generate
```

**5. Inicie o Servidor:**
```bash
npm run start:dev
```
A API estará rodando em `http://localhost:3000`.

## 🧪 Como rodar os Testes

O projeto conta com uma suíte de testes unitários rápidos e isolados (não dependem de banco de dados).

```bash
# Para rodar todos os testes
npm run test

# Para rodar os testes em modo watch (desenvolvimento)
npm run test:watch
```

---

*Desenvolvido  por [Emilly Paiva](https://www.linkedin.com/in/emillypaivabelo/).*
