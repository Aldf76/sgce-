// src/components/Header.tsx

import React from "react";

export function Header() {
  return (
    <header className="bg-[#1E2547] text-white py-4 px-6 shadow-md flex items-center gap-4">
      <img
        src="/bipbrasil_logo.jpg"
        alt="Logo BIP Brasil"
        className="h-10 w-auto"
      />
      <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
        Sistema de Gestão de Consumo Energético
      </h1>
    </header>
  );
}
