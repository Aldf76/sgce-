// importar a função clsx que junta classes com lógica condicional
// importar o tipo ClassValue para tipar corretamente os argumentos
import { clsx, type ClassValue } from "clsx"

// importar a função twMerge que resolve conflitos entre classes do Tailwind CSS
import { twMerge } from "tailwind-merge"

// declarar função chamada cn que recebe uma lista de classes (condicionais ou não)
export function cn(...inputs: ClassValue[]) {
  // juntar todas as classes com clsx (remover falsos, condicionar objetos, etc)
  // depois resolver conflitos de classes do Tailwind com twMerge (ex: px-4 e px-2)
  // retornar a string final pronta para ser usada no className
  return twMerge(clsx(inputs))
}


// ponto menor no sistema, usei para estudar a lib
// usado ocasionalmente para resolver conflitos envolvendo classaname