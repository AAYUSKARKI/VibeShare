import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import AppLayout from "./components/Applayout"

function App() {
  return (
    <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </AppLayout>
    </BrowserRouter>
  )
}

export default App