import { ModeToggle } from "@/components/mode-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { TriviaVisualizer } from "@/components/TriviaVisualizer"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <span className="text-lg font-semibold">Open Trivia Visualizer</span>
            <ModeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">
          <TriviaVisualizer />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
