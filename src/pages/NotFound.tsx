// Hook que fornece informações sobre a rota atual (como pathname)
import { useLocation } from "react-router-dom";

// Hook de efeito colateral do React, usado para executar ações quando algo muda
import { useEffect } from "react";

// ✅ Importa o Link para navegação sem recarregar a página
import { Link } from "react-router-dom"; 

const NotFound = () => {
  const location = useLocation(); // Captura a URL que o usuário tentou acessar

  useEffect(() => {
    // Loga no console uma mensagem de erro com a rota inválida
    // (Útil em ambiente de desenvolvimento para monitorar erros de navegação)
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2547] px-4">
      <div className="text-center text-white space-y-4">
        <h1 className="text-6xl font-extrabold">404</h1> {/* Código de erro */}
        <p className="text-xl">Página não encontrada</p> {/* Mensagem clara */}

        <p className="text-sm opacity-70">
          Você tentou acessar <span className="underline">{location.pathname}</span>, que não existe.
        </p>

         {/* ✅ TESTE: substituímos <a> por <Link> para navegação interna no React */}
         <Link
          to="/"
          className="inline-block mt-4 px-6 py-2 bg-[#D8282C] text-white font-semibold rounded-md hover:bg-[#b91d23] transition"
        >
          Voltar para o Início
        </Link>

        

      </div>
    </div>
  );
};

export default NotFound;

// APRENDIZADO !

// Esta página usa <Link> ao invés de <a> para evitar recarregamento total da aplicação.
// Em projetos React com React Router, <Link> garante navegação interna mais fluida (SPA),
// preservando estados, cache e desempenho da aplicação. 