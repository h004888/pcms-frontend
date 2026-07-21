import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const AuthPromptContext = createContext(null)

export function AuthPromptProvider({ children }) {
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const pendingCallback = useRef(null)

  const openAuthPrompt = useCallback((onSuccess) => {
    pendingCallback.current = onSuccess
    setIsPromptOpen(true)
  }, [])

  const closeAuthPrompt = useCallback(() => {
    pendingCallback.current = null
    setIsPromptOpen(false)
  }, [])

  const resolveAuthPrompt = useCallback((success) => {
    if (success && pendingCallback.current) {
      pendingCallback.current()
    }
    pendingCallback.current = null
    setIsPromptOpen(false)
  }, [])

  const value = useMemo(() => ({
    isPromptOpen,
    openAuthPrompt,
    closeAuthPrompt,
    resolveAuthPrompt,
  }), [isPromptOpen, openAuthPrompt, closeAuthPrompt, resolveAuthPrompt])

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
    </AuthPromptContext.Provider>
  )
}

export function useAuthPrompt() {
  const ctx = useContext(AuthPromptContext)
  if (!ctx) {
    throw new Error('useAuthPrompt must be used within AuthPromptProvider')
  }
  return ctx
}
