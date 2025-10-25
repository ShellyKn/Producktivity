import Logo from "../components/Logo";
import Header from "../components/Header";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

function LogIn() {
    return (
        <div className="bg-[#FAFAF0] h-screen flex flex-col">
            <Header
            left_side={<Logo />}
            right_side=""
            />

            {/*  */}
            <div className="m-auto border-4 flex flex-col gap-4 z-50 font-jua border-[#464141] rounded-xl p-6 w-[400px] shadow-xl text-[#464141]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl"> Log In/Sign Up </h2>
                </div>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-lg mb-1">Username:</label>
                        <input
                        type="text"
                        placeholder="who goes there?"
                        className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-1">Password:</label>
                        <input
                        type="password"
                        placeholder="shh it's a secret..."
                        className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
                        />
                    </div>
                </form>

                <Link to="/todo">
                    <button
                    className="w-full m-auto mt-2 bg-[#464141] text-white text-xl px-2 py-2 rounded-lg hover:bg-[#1e3442]"
                    >
                    Log In/Sign Up
                    </button>
                </Link>

                <p className="m-auto">OR</p>
                <Link to="/todo">
                    <button
                    className="w-full m-auto mt-2 bg-[#464141] text-white text-xl px-2 py-2 rounded-lg hover:bg-[#1e3442]"
                    >
                    Sign in With Google
                    </button>
                </Link> 
            </div>

            <img className="m-auto" src="art/duckFace.png" style={{ height: '100px', width: '100px' }}></img>
        </div>
    );
}

export default LogIn;

