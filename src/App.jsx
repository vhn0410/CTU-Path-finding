import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PathfindingVisualizer4 from './PathFindingVisualizerv4'


function App() {
  const [count, setCount] = useState(0)

  // return <PathfindingVisualizer />
  // return <PathfindingVisualizerv2 />
  return <PathfindingVisualizer4 />
}

export default App
