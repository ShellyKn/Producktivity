import { useEffect, useState } from "react";
import Logo from "./components/Logo.jsx";
import Header from "./components/Header.jsx";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="bg-[#FAFAF0] **overflow-hidden**">

      <Header left_side={<Logo></Logo>} right_side={<Link to="/login"><button className="h-[40px] font-josefin text-[18px] rounded-full bg-[#EDEEDE] text-[#5A311F] px-4 py-1.5">Sign Up / Log In</button></Link>}></Header>
      <div className="flex items-center justify-center h-screen">
        <div className="w-3/4 items-center relative">
          <img className="absolute top-[25%] right-[10%]" src="art/quak.png" style={{ height: '200px', width: '200px' }}></img>
          <img src="art/temp_pond.svg" className="w-full"></img>
          <div className="flex flex-col items-center absolute top-1/3 left-1/2 -translate-x-1/2">
            <h1 className="text-3xl w-full text-[#5A311F] text-center p-6">
              <i>Get things <strong>duck duck done</strong> with this gamified to-do list app!</i>
            </h1>
            <div className="flex justify-center">
              <ul className="list-disc list-inside text-center space-y-2 text-gray-700">
                <li>Keep track of all your tasks</li>
                <li>Easy-to-navigate interface</li>
                <li>Add, modify, and delete tasks through to-do and calendar views</li>
                <li>Leaderboard with friends for motivation</li>
                <li>View statistics to track your progress</li>
              </ul>
            </div>
            <br></br>
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
