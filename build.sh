#!/bin/bash

# Encerra o script se algum comando falhar
set -e

echo "Iniciando o processo de deploy..."

# Instala as dependências
echo "Instalando as dependências..."
npm install

# Compila o projeto TypeScript
echo "Compilando o projeto TypeScript..."
npm run build

echo "Deploy concluído com sucesso!"