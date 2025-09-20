import './App.css'
import { Nav, Footer, BackToBtn } from './index.js'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <BackToBtn />
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
