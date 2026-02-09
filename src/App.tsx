import './App.css'
import { QueryProvider } from './providers/QueryProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { ExplorerView } from './features/explorer/ExplorerView'
import { ReactNode } from 'react'

/**
 * Main application component
 * Only responsible for providing context
 * 
 * @returns Application root component
 */
function App(): ReactNode {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ExplorerView />
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App