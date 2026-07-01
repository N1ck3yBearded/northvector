import { MotionConfig } from 'framer-motion'
import { useLenis } from './hooks/useLenis'
import { LangProvider } from './lib/LangProvider'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Packages from './components/Packages'
import Manifesto from './components/Manifesto'
import Showreel from './components/Showreel'
import PyLab from './components/PyLab'
import Capabilities from './components/Capabilities'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  useLenis()

  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen bg-ink-900">
          <Nav />
          <main>
            <Hero />
            <Packages />
            <Manifesto />
            <Showreel />
            <PyLab />
            <Capabilities />
            <Work />
            <Contact />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LangProvider>
  )
}

export default App
