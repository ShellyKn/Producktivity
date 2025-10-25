import { useEffect, useState } from "react";
import Logo from "./components/Logo.jsx";
import Header from "./components/Header.jsx";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

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
    <div className="bg-[#FAFAF0] **overflow-hidden**">

      <Header left_side={<Logo></Logo>} right_side={<Link to="/login"><button className="h-[60px] font-josefin text-[30px] rounded-full bg-[#EDEEDE] text-[#5A311F] px-7 py-2">Sign Up / Log In</button></Link>}></Header>
      {/* <h1 className="text-3xl font-bold text-black font-inria-sans">{message}</h1> */}
      <div className="flex items-center justify-center h-screen">
        <div className="w-3/4 items-center">
          <img src="art/temp_pond.svg" className="w-full"></img>
          <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2">
            <h1 className="text-3xl w-full text-[#5A311F] text-center p-6">
              <i>Get things <strong>duck duck done</strong> with this gamified to-do list app!</i>
            </h1>
            <Link to="/login">
              <button className="drop-shadow-md text-xl px-20 bg-[#FAFAF0] text-[#5A311F] rounded-full p-3 hover:bg-[#5A311F] hover:text-[#FAFAF0] transition duration-700 ease-in-out w-fit border border-[#5A311F]">
                get started!
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
