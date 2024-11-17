# API de Gerenciamento de Carteira de Investimentos

Bem-vindo à documentação da API de Gerenciamento de Carteira de Investimentos. Abaixo estão listadas todas as rotas disponíveis, organizadas por domínio, juntamente com seus métodos e descrições.

## Base URL

https://api-auth-ws.onrender.com/

## Autenticação (`/api/auth`)

### Endpoints

| Método | Rota               | Descrição                             |
| ------ | ------------------ | ------------------------------------- |
| POST   | `/register`        | Registro de novos usuários            |
| POST   | `/login`           | Login de usuários                     |
| GET    | `/github`          | Iniciar autenticação via GitHub       |
| GET    | `/github/callback` | Callback para autenticação via GitHub |

#### POST `/register`

- **Descrição:** Registra um novo usuário.
- **Requisição:**
  - **Corpo (JSON):**
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (201):**
    ```json
    {
      "message": "Usuário cadastrado com sucesso!"
    }
    ```
  - **Erro (400):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### POST `/login`

- **Descrição:** Autentica um usuário e retorna um token.
- **Requisição:**
  - **Corpo (JSON):**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "token": "string"
    }
    ```
  - **Erro (401):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### GET `/github`

- **Descrição:** Redireciona o usuário para a página de autenticação do GitHub.
- **Requisição:** Nenhuma.
- **Resposta:** Redirecionamento para a URL de autenticação do GitHub.

#### GET `/github/callback`

- **Descrição:** Callback para finalizar a autenticação via GitHub.
- **Requisição:**
  - **Query Parameters:**
    - `code`: string
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "token": "string"
    }
    ```
  - **Erro (400 ou 500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

## Usuários (`/api/user`)

### Endpoints

| Método | Rota   | Descrição                          |
| ------ | ------ | ---------------------------------- |
| GET    | `/`    | Listar todos os usuários           |
| GET    | `/:id` | Obter detalhes de um usuário       |
| PATCH  | `/:id` | Atualizar parcialmente um usuário  |
| PUT    | `/:id` | Atualizar completamente um usuário |
| DELETE | `/:id` | Remover um usuário                 |

#### GET `/`

- **Descrição:** Retorna uma lista de todos os usuários.
- **Requisição:** Nenhuma.
- **Resposta:**
  - **Sucesso (200):**
    ```json
    [
      {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "createdAt": "date",
        "updatedAt": "date"
      },
      ...
    ]
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### GET `/:id`

- **Descrição:** Retorna os detalhes de um usuário específico.
- **Requisição:**
  - **Parâmetros de Rota:**
    - `id`: string
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (404):**
    ```json
    {
      "message": "Usuário não encontrado"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### PATCH `/:id`

- **Descrição:** Atualiza parcialmente os dados de um usuário.
- **Requisição:**
  - **Parâmetros de Rota:**
    - `id`: string
  - **Corpo (JSON):**
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (404):**
    ```json
    {
      "message": "Usuário não encontrado"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### PUT `/:id`

- **Descrição:** Atualiza completamente os dados de um usuário.
- **Requisição:**
  - **Parâmetros de Rota:**
    - `id`: string
  - **Corpo (JSON):**
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (404):**
    ```json
    {
      "message": "Usuário não encontrado"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### DELETE `/:id`

- **Descrição:** Remove um usuário.
- **Requisição:**
  - **Parâmetros de Rota:**
    - `id`: string
- **Resposta:**
  - **Sucesso (204):** Sem conteúdo.
  - **Erro (404):**
    ```json
    {
      "message": "Usuário não encontrado"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

## Estoque (`/api/stock`)

### Endpoints

| Método | Rota                | Descrição                                |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/market/available` | Listar ações disponíveis no mercado      |
| GET    | `/market/:ticker`   | Obter informações de uma ação específica |

#### GET `/market/available`

- **Descrição:** Retorna uma lista de ações disponíveis no mercado.
- **Requisição:**
  - **Query Parameters (Opcional):**
    - `search`: string
- **Resposta:**
  - **Sucesso (200):**
    ```json
    [
      {
        "id": "string",
        "type": "STOCK" | "REIT",
        "ticker": "string",
        "currentPrice": number,
        "createdAt": "date",
        "updatedAt": "date"
      },
      ...
    ]
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### GET `/market/:ticker`

- **Descrição:** Retorna informações detalhadas sobre uma ação específica.
- **Requisição:**
  - **Parâmetros de Rota:**
    - `ticker`: string
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "id": "string",
      "type": "STOCK" | "REIT",
      "ticker": "string",
      "currentPrice": number,
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

## Portfólio (`/api/portfolio`)

### Endpoints

| Método | Rota           | Descrição                              |
| ------ | -------------- | -------------------------------------- |
| POST   | `/`            | Criar um novo portfólio                |
| GET    | `/`            | Obter detalhes do portfólio do usuário |
| GET    | `/positions`   | Obter posições do portfólio            |
| GET    | `/performance` | Obter desempenho do portfólio          |

#### POST `/`

- **Descrição:** Cria um novo portfólio para o usuário autenticado.
- **Requisição:**
  - **Corpo (JSON):** Nenhum corpo necessário.
- **Resposta:**
  - **Sucesso (201):**
    ```json
    {
      "id": "string",
      "userId": "string",
      "balance": number,
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (400):**
    ```json
    {
      "message": "Portfolio already exists"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Ocorreu um erro desconhecido"
    }
    ```

#### GET `/`

- **Descrição:** Retorna os detalhes do portfólio do usuário autenticado.
- **Requisição:** Nenhuma.
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "id": "string",
      "userId": "string",
      "balance": number,
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Ocorreu um erro desconhecido"
    }
    ```

#### GET `/positions`

- **Descrição:** Retorna as posições (ações) no portfólio do usuário.
- **Requisição:** Nenhuma.
- **Resposta:**
  - **Sucesso (200):**
    ```json
    [
      {
        "stockId": "string",
        "ticker": "string",
        "quantity": number,
        "averagePrice": number
      },
      ...
    ]
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Ocorreu um erro desconhecido"
    }
    ```

#### GET `/performance`

- **Descrição:** Retorna o desempenho financeiro do portfólio do usuário.
- **Requisição:** Nenhuma.
- **Resposta:**
  - **Sucesso (200):**
    ```json
    {
      "totalInvested": number,
      "currentValue": number,
      "profitLoss": number
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Ocorreu um erro desconhecido"
    }
    ```

## Transações (`/api/transaction`)

### Endpoints

| Método | Rota          | Descrição                             |
| ------ | ------------- | ------------------------------------- |
| GET    | `/history`    | Listar todas as transações do usuário |
| POST   | `/stock/buy`  | Comprar ações                         |
| POST   | `/stock/sell` | Vender ações                          |
| POST   | `/deposit`    | Depositar fundos no portfólio         |
| POST   | `/withdraw`   | Retirar fundos do portfólio           |

#### GET `/history`

- **Descrição:** Retorna o histórico de transações do usuário autenticado.
- **Requisição:** Nenhuma.
- **Resposta:**
  - **Sucesso (200):**
    ```json
    [
      {
        "id": "string",
        "type": "BUY" | "SELL" | "DEPOSIT" | "WITHDRAWAL" | "DIVIDEND",
        "userId": "string",
        "portfolioId": "string",
        "ticker": "string",
        "quantity": number,
        "price": number,
        "amount": number,
        "date": "date",
        "createdAt": "date",
        "updatedAt": "date"
      },
      ...
    ]
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Mensagem de erro"
    }
    ```

#### POST `/stock/buy`

- **Descrição:** Realiza a compra de ações.
- **Requisição:**
  - **Corpo (JSON):**
    ```json
    {
      "ticker": "string",
      "quantity": number,
      "amount": number,
      "portfolioId": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (201):**
    ```json
    {
      "id": "string",
      "type": "BUY",
      "userId": "string",
      "portfolioId": "string",
      "ticker": "string",
      "quantity": number,
      "price": number,
      "amount": number,
      "date": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (400):**
    ```json
    {
      "message": "Dados de transação inválidos"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Erro interno do servidor"
    }
    ```

#### POST `/stock/sell`

- **Descrição:** Realiza a venda de ações.
- **Requisição:**
  - **Corpo (JSON):**
    ```json
    {
      "ticker": "string",
      "quantity": number,
      "amount": number,
      "portfolioId": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (201):**
    ```json
    {
      "id": "string",
      "type": "SELL",
      "userId": "string",
      "portfolioId": "string",
      "ticker": "string",
      "quantity": number,
      "price": number,
      "amount": number,
      "date": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (400):**
    ```json
    {
      "message": "Dados de transação inválidos"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Erro interno do servidor"
    }
    ```

#### POST `/deposit`

- **Descrição:** Deposita fundos no portfólio do usuário.
- **Requisição:**
  - **Corpo (JSON):**
    ```json
    {
      "amount": number,
      "portfolioId": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (201):**
    ```json
    {
      "id": "string",
      "type": "DEPOSIT",
      "userId": "string",
      "portfolioId": "string",
      "amount": number,
      "date": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (400):**
    ```json
    {
      "message": "Dados de transação inválidos"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Erro interno do servidor"
    }
    ```

#### POST `/withdraw`

- **Descrição:** Retira fundos do portfólio do usuário.
- **Requisição:**
  - **Corpo (JSON):**
    ```json
    {
      "amount": number,
      "portfolioId": "string"
    }
    ```
- **Resposta:**
  - **Sucesso (201):**
    ```json
    {
      "id": "string",
      "type": "WITHDRAWAL",
      "userId": "string",
      "portfolioId": "string",
      "amount": number,
      "date": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```
  - **Erro (400):**
    ```json
    {
      "message": "Dados de transação inválidos"
    }
    ```
  - **Erro (500):**
    ```json
    {
      "message": "Erro interno do servidor"
    }
    ```

## Authors

- [@Acauhi99](https://github.com/Acauhi99)
