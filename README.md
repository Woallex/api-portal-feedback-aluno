# Portal do Feedback - API

## Sobre o projeto

Backend robusto desenvolvido para centralizar e gerenciar feedbacks institucionais. O projeto utiliza uma arquitetura moderna focada em segurança, escalabilidade e experiência do usuário.

## FeTecnologias Utilizadasatures

-  **Runtime**: Node.js
-  **Linguagem**: TypeScript (Tipagem estática para maior segurança)
-  **Framework**: Express
-  **Database**: Integration with Amazon Dynamodb for data storage.
-  **Banco de Dados**: MongoDB (Hospedado no Atlas)
-  **Segurança**: Bcrypt (Hash de senhas), JSON Web Token (Autenticação JWT), 2FA - Autenticação de dois fatores via E-mail
-  **Envio de E-mail**: Nodemailer
-  **Testes**: Jest e Supertest

## Funcionalidades de Segurança

This project was built with the following technologies:

**Hashing de Senha**
As senhas nunca são salvas em texto puro. Utilizamos o Bcrypt com fator de custo 10 para garantir que, mesmo em caso de vazamento do banco, os dados dos usuários permaneçam protegidos.

Autenticação em Duas Etapas (2FA)
-  **Primeiro Acesso**: Ao logar, se for o primeiro acesso do dia, o sistema gera um código aleatório de 6 dígitos.
-  **Envio**: O código é enviado para o e-mail institucional do aluno via Nodemailer.
-  **Validação**: O acesso só é liberado (token JWT gerado) após a inserção do código correto.
-  **TePersistênciastes**: Para melhor usabilidade, a validação é exigida apenas uma vez por dia.


## Como rodar o projeto localmente

-  Node.js instalado.
-  Conta no MongoDB Atlas ou MongoDB local.

## Instalação

```bash
# Clone o repositório:
$ git clone https://github.com/seu-usuario/api-portal-feedback-aluno.git
```

## Instale as dependências:

```bash
$ npm install
```

## Configure o arquivo .env na raiz do projeto (use o .env.example como base):

```bash
$ DATABASE_URL="mongodb+srv://..."
$ SECRET_KEY="sua_chave_secreta"
$ EMAIL_USER="seu-email@gmail.com"
$ EMAIL_PASS="sua-senha-de-app-16-digitos"
```

## Gere o cliente do Prisma:

```bash
$ npx prisma generate
```

## Inicie o servidor:

```bash
$ npm run dev
```

## Rotas Principais

**Autenticação (/auth)**
-  **POST /register**: Cria um novo usuário.
-  **POST /login**: Valida credenciais e dispara código 2FA se necessário.
-  **POST /verify2FA**: Valida o código enviado por e-mail e libera o Token JWT.

**Publicações (/publications)**
-  **GET /**: Lista todos os feedbacks (Apenas usuários autenticados).
-  **POST /**: Cria uma nova publicação.


## Testes Automatizados

O projeto conta com testes de integração para garantir a integridade das rotas de autenticação.

```bash
$ npm test
```