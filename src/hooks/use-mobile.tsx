// Importa as funcionalidades do React
import * as React from "react"

// Define o ponto de quebra (breakpoint) para considerar a tela como "mobile"
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Estado reativo que indica se a tela é mobile ou não
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)


  React.useEffect(() => {
    // Cria uma media query listener para acompanhar mudanças no tamanho da tela
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Função que atualiza o estado com base na largura atual da janela
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Registra o listener na media query
    mql.addEventListener("change", onChange)

    // Define o valor inicial assim que o hook for carregado
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Remove o listener ao desmontar o componente (boas práticas)
    return () => mql.removeEventListener("change", onChange)
  }, [])


  return !!isMobile
}


/*
esse hook simples verifica se a largura da tela atual está abaixo de 768px,
 e retorna true se estiver (modo mobile) ou false se for desktop.

*/
