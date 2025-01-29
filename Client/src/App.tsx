import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { useSelector } from "react-redux";
import AppLayout from "./components/Applayout";
import AuthPage from "./components/Authpage";
import { socket } from "./socket";
function App() {
  const { user } = useSelector((state: any) => state.user);
  const isAuthenticated = !!user; // Check if user exists
   socket.on("connect", () => {
     console.log("Connected to the server");
   })
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Home />
              </AppLayout>
            ) : (
              <AuthPage />
            )
          }
        />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;