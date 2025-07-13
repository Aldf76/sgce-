# 🚀 SGCE Frontend – React + TypeScript + Tailwind CSS

Interface web do Sistema de Gestão de Consumo Energético (SGCE), desenvolvida com foco em componentização, responsividade e integração com a API REST em Spring Boot. A aplicação permite visualizar unidades cadastradas, registrar consumo mensal e acompanhar dados de consumo por meio de gráficos e alertas.

> ✅ Projeto completo com `componentes reutilizáveis`, `hooks customizados`, `integração com backend`, e estrutura de `serviços`, `notificações`, `responsividade` e `estilização moderna`.

---

## 🔧 Tecnologias

- React + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes acessíveis e estilizados)
- react-hook-form (formulários)
- @tanstack/react-query (cache e fetch de dados)
- axios (requisições HTTP)
- clsx + tailwind-merge (composição de classes)
- sonner (notificações tipo toast)
- html2pdf.js (exportação em PDF)
- framer-motion (animações)
- lucide-react (ícones SVG)

---

## 📂 Estrutura do Projeto

sgce-frontend/
├── components/ # Componentes reutilizáveis (botões, tabelas, alertas...)
├── pages/ # Páginas principais (Cadastro, Consumo, Visualização)
├── hooks/ # Hooks customizados (useIsMobile, useToast)
├── services/ # Comunicação com a API REST
├── lib/ # axios.ts, utils.ts
├── styles/ # Estilos globais (caso aplicável)
├── public/ # Assets públicos
├── index.html
├── vite.config.ts
└── README.md


---

## 🧠 Fluxo de Funcionamento

### 🔁 Cadastro e Consumo

1. **Cadastro de Unidade (formulário + react-hook-form)**  
   Permite registrar uma nova unidade com nome, cidade e tipo (residencial, comercial ou industrial). As unidades são exibidas em uma tabela com opções de edição e exclusão.

2. **Registro de Consumo por Unidade**  
   O usuário seleciona uma unidade, escolhe a data de referência e informa o consumo em kWh. Os dados são enviados à API via `axios + react-query`.

3. **Visualização Analítica**  
   A tela exibe os consumos registrados de uma unidade, calcula a média dos últimos meses, compara com o consumo atual e apresenta um gráfico com a evolução temporal.

4. **Alertas de Consumo**  
   Se o consumo exceder 20% da média dos 3 meses anteriores, um alerta é gerado e exibido ao usuário em formato visual e via toast.

5. **Exportação de Dados**  
   O usuário pode exportar os dados exibidos (tabela + gráfico) para PDF, utilizando a biblioteca `html2pdf.js`.

---

## 🔄 Arquitetura

- `components/`: Estrutura modular e reutilizável (formulários, tabelas, inputs, etc).
- `services/`: Cada entidade possui um arquivo com funções específicas para comunicação HTTP.
- `hooks/`: Hooks como `useToast()` e `useIsMobile()` encapsulam lógica e reatividade.
- `react-query`: Gerencia o cache de dados com atualização automática após mutações.
- `clsx + tailwind-merge`: Resolve composição de classes CSS com conflitos de Tailwind.
- `toast()`: Sistema de notificação visual não intrusivo, configurado com limite e auto-dismissão.

> ✅ Toda estrutura foi comentada com foco em aprendizado, explicando o funcionamento de hooks, serviços, interação com a API e composição de estilos.

---

## 🧪 Testes

O projeto ainda não possui testes automatizados, mas está preparado para evolução com:

### 1. **Testes de Integração (Cypress ou Playwright)**  
- Para simular interações completas com formulários, listas e respostas da API.

### 2. **Testes Unitários (Jest + React Testing Library)**  
- Para validar componentes isolados como botões, gráficos, tabelas e comportamento condicional.

---

## ▶️ Como Executar

### 🔧 Pré-requisitos

- Node.js 18+
- Backend sgce-api em execução local (porta 8080 por padrão)

### 📥 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sgce-frontend.git
cd sgce-frontend

# Instale as dependências
npm install

# Inicie o servidor local
npm run dev

A aplicação será acessível em http://localhost:3000.

📬 Autor
Desenvolvido por Felipe Medeiros
🎓 Estudante de Análise e Desenvolvimento de Sistemas e Desenvolvimento FullStack
🔗 linkedin.com/in/seu-linkedin
📫 felipe@email.com
📂 Projeto back-end: GitHub – sgce-api
📂 Projeto front-end: GitHub – sgce-frontend

ℹ️ Este projeto foi desenvolvido com propósito educacional e profissional, aplicando conceitos reais de arquitetura de software, componentização front-end, e integração com APIs REST em Java.