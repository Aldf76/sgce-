// Importa o método createRoot, necessário para inicializar o React 18+ no DOM.
import { createRoot } from 'react-dom/client'

// Importa o componente principal da aplicação (App.tsx), que contém as rotas e páginas.
import App from './App.tsx'

// Importa os estilos globais da aplicação, aplicando Tailwind, resets, etc.
import './index.css'

// Garante que os tipos globais definidos no projeto (ex: interfaces compartilhadas) sejam carregados.
// O @ é um alias configurado no Vite para facilitar importações absolutas.
import "@/types/types";

// Inicializa o React e renderiza o componente <App /> dentro da div com id="root" (presente no index.html).
// O operador "!" garante ao TypeScript que esse elemento sempre existirá.
createRoot(document.getElementById("root")!).render(<App />);
