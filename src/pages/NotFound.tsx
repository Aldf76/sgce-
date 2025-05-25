import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2547] px-4">
      <div className="text-center text-white space-y-4">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-xl">Página não encontrada</p>
        <p className="text-sm opacity-70">
          Você tentou acessar <span className="underline">{location.pathname}</span>, que não existe.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-[#D8282C] text-white font-semibold rounded-md hover:bg-[#b91d23] transition"
        >
          Voltar para o Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
