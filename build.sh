#!/bin/bash

# Encerra o script se algum comando falhar
set -e

echo "Iniciando o processo de deploy..."

# Instala as dependências
echo "Instalando as dependências..."
npm install

# Navega para a pasta 'infra' e executa as migrações
echo "Executando migrations no diretório 'infra'..."
cd infra
npx sequelize-cli db:migrate

# Retorna para a raiz do projeto
cd ..

# Compila o projeto TypeScript
echo "Compilando o projeto TypeScript..."
npm run build

echo "Deploy concluído com sucesso!"