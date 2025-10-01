import { useEffect, useState } from "react";
import Logo from "./components/Logo.jsx";
import NavBar from "./components/NavBar.jsx";

// basic test function 
function App() {
  const [message, setMessage] = useState("Loading...")

  // Example of connecting with the backend
  useEffect(() => {
    fetch("/api/hello") 
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err.message))
  }, [])

  return (
    <div className="bg-white **overflow-hidden**">

      <NavBar left_side={<Logo></Logo>} right_side="Sign Up/Log In"></NavBar>
      {/* <h1 className="text-3xl font-bold text-black font-inria-sans">{message}</h1> */}
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center rounded-3xl h-48 border bg-blue-400">
          Get things duck duck done with this gamified to-do list app!
          <button className="bg-slate-50 text-slate-900 rounded-3xl p-3 hover:bg-slate-900 hover:text-slate-50 transition duration-700 ease-in-out w-fit">
            Get Started!
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
