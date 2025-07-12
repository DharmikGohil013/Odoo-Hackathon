import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('admin-theme')
      if (saved === null) return false
      
      // Handle both boolean and string values
      if (saved === 'true') return true
      if (saved === 'false') return false
      
      // Try to parse as JSON for boolean values
      return JSON.parse(saved)
    } catch (error) {
      console.warn('Error parsing theme from localStorage:', error)
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('admin-theme', JSON.stringify(isDark))
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error)
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
