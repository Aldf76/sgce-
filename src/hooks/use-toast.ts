// Importa React e seus tipos
import * as React from "react"

// Tipagens do toast vindas do componente de UI do sistema
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Limita a quantidade de toasts visíveis simultaneamente
const TOAST_LIMIT = 1

// Tempo (em ms) para remover o toast da tela após ser fechado (DISMISS)
const TOAST_REMOVE_DELAY = 1000000 // aqui você pode ajustar para 5000 por ex.

// Define o tipo completo de um toast (baseado em ToastProps + extras)
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Enum de ações possíveis (ADD, UPDATE, etc.)
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Gerador de IDs incremental e seguro
let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Define tipos de ação aceitos no reducer
type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

// Estado principal: lista de toasts ativos
interface State {
  toasts: ToasterToast[]
}

// Mapa para guardar os timeouts de remoção agendados
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Agendador de remoção de toast
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Reducer: gerencia como os toasts são adicionados, atualizados ou removidos
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Marca o toast como fechado visualmente
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Lista de ouvintes que serão notificados quando o estado global mudar
const listeners: Array<(state: State) => void> = []

// Estado global fora do React
let memoryState: State = { toasts: [] }

// Dispara ações no reducer e notifica todos os componentes ouvintes
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Tipo básico de toast sem o ID
type Toast = Omit<ToasterToast, "id">

// Função para exibir um novo toast (programaticamente)
function toast({ ...props }: Toast) {
  const id = genId()

  // Permite atualizar o conteúdo do toast depois de criado
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  // Permite fechar o toast manualmente
  const dismiss = () =>
    dispatch({
      type: "DISMISS_TOAST",
      toastId: id,
    })

  // Cria o toast e envia ao reducer
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

// Hook que conecta um componente React ao sistema global de toasts
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  // Inscreve o componente no sistema global quando ele monta
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state, // contém toasts atuais
    toast, // função para criar toasts
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }), // função para fechar um toast
  }
}

// Exporta o hook e a função para uso em qualquer lugar do sistema
export { useToast, toast }


//toasts são, em poucas palavras, notificações visuais temporarias. Aqui informamos ao usuário movimentos dentro do sistema
// os positivos e os negativos .