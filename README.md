# 🪑 Visualizador 3D de Móveis

Sistema de visualização e planejamento de móveis modulares em 3D com cálculo automático de furos para montagem.

## 📋 Descrição

Este projeto permite visualizar e configurar móveis modulares (estantes, armários, etc.) em tempo real, com cálculo automático de furos para cavilhas baseado nas dimensões. Exporta dados técnicos em JSON para fabricação.

## 🛠️ Tecnologias

- **Three.js** (r128) - Renderização 3D
- **TypeScript** - Tipagem e desenvolvimento
- **Vite** - Build e desenvolvimento

## 📦 Estrutura do Projeto

```
teste-logica/
├── dist/                  # Build de produção
├── node_modules/          # Dependências
├── src/
│   ├── styles/
│   │   └── style.css     # Estilos da interface
│   └── main.ts           # Código principal
├── index.html            # Página principal
├── package.json
└── tsconfig.json
```

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [seu-repositorio]

# Entre na pasta do projeto
cd teste-logica

# Instale as dependências
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build para Produção

```bash
npm run build
```

### Interface

- **Comprimento (mm)**: Largura do móvel
- **Profundidade (mm)**: Profundidade do móvel
- **Altura (mm)**: Altura total do móvel
- **Espessura (mm)**: Espessura das placas (padrão: 18mm)

### Botões

- **Atualizar Móvel**: Regenera o móvel com novas dimensões
- **Alternar Opacidade**: Torna as placas transparentes (10% opacidade)
- **Posição Furos**: Mostra/oculta os furos com indicadores de orientação
- **Exportar JSON**: Baixa arquivo com dados técnicos das peças



---
