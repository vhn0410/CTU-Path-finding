import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PathfindingVisualizer4 from './PathFindingVisualizerv4'
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  const [count, setCount] = useState(0)

  return(
    <Provider store={store}>
      <PathfindingVisualizer4 />
    </Provider>
  )
}

export default App
