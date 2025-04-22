import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Moodmate from './components/Moodmate'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Moodmate />
    </>
  )
}

export default App
