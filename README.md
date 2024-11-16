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

## Usuários (`/api/user`)

### Endpoints

| Método | Rota   | Descrição                          |
| ------ | ------ | ---------------------------------- |
| GET    | `/`    | Listar todos os usuários           |
| GET    | `/:id` | Obter detalhes de um usuário       |
| PATCH  | `/:id` | Atualizar parcialmente um usuário  |
| PUT    | `/:id` | Atualizar completamente um usuário |
| DELETE | `/:id` | Remover um usuário                 |

## Portfólio (`/api/portfolio`)

### Endpoints

| Método | Rota               | Descrição                                   |
| ------ | ------------------ | ------------------------------------------- |
| GET    | `/`                | Obter portfólio do usuário                  |
| POST   | `/stocks`          | Adicionar/comprar uma ação ao portfólio     |
| DELETE | `/stocks/:stockId` | Remover/vender uma ação do portfólio        |
| GET    | `/summary`         | Obter resumo financeiro do portfólio        |
| GET    | `/performance`     | Obter desempenho/rentabilidade do portfólio |

## Transações (`/api/transaction`)

### Endpoints

| Método | Rota           | Descrição                             |
| ------ | -------------- | ------------------------------------- |
| GET    | `/`            | Listar todas as transações do usuário |
| POST   | `/stocks/buy`  | Comprar ações                         |
| POST   | `/stocks/sell` | Vender ações                          |
| POST   | `/deposit`     | Realizar depósito na carteira         |
| POST   | `/withdraw`    | Realizar retirada da carteira         |

## Dividendos (`/api/dividend`)

### Endpoints

| Método | Rota                | Descrição                                            |
| ------ | ------------------- | ---------------------------------------------------- |
| GET    | `/`                 | Listar todos os dividendos                           |
| POST   | `/`                 | Registrar um novo dividendo                          |
| GET    | `/summary`          | Obter resumo dos dividendos recebidos                |
| GET    | `/calendar`         | Obter calendário de dividendos futuros               |
| GET    | `/history/:stockId` | Obter histórico de dividendos de uma ação específica |

## Ações (`/api/stock`)

### Endpoints

| Método | Rota                | Descrição                                    |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/market/available` | Listar ações disponíveis no mercado          |
| GET    | `/market/:ticker`   | Obter a cotação atual de uma ação específica |
