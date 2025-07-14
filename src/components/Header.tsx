import React from "react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-[#1E2547] text-white py-4 px-6 shadow-md flex items-center gap-4">
    {/* Título clicável que redireciona para a página inicial */}
    <Link to="/" className="hover:opacity-90 transition-opacity">
      <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
        Sistema de Gestão de Consumo Energético
      </h1>
    </Link>
  </header>
  );
}
