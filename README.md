# API de Agregação de Dados Climáticos e Geográficos

## Descrição
API REST desenvolvida para integração de dados climáticos e geográficos de cidades brasileiras.

## Tecnologias Utilizadas
- Node.js
- Express
- Axios
- Jest
- BrasilAPI

## Endpoints

### Health Check
GET /api/v1/health

### Buscar clima por cidade
GET /api/v1/clima/{nome_cidade}

### Listar cidades por estado
GET /api/v1/cidades/{uf}

## Como executar

```bash
npm install
node src/server.js
```

## Porta
A aplicação roda na porta 3000.

## Autor
Francisco Laércio Moura De Sousa Filho - 2317769