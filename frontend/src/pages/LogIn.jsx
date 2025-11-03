import Logo from "../components/Logo";
import Header from "../components/Header";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function LogIn() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
        const res = await fetch("http://localhost:4000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/todo");
        } catch (err) {
        setError(err.message);
        }
    };

      const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
        const res = await fetch("http://localhost:4000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: form.email,
            userName: form.email.split("@")[0],
            name: form.email.split("@")[0],
            password: form.password,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/todo");
        } catch (err) {
        setError(err.message);
        }
    };

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
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-[#464141] text-white text-xl py-2 rounded-lg hover:bg-[#1e3442]"
                    >
                        Log In
                    </button>
                    <button
                        onClick={handleRegister}
                        className="w-full bg-[#464141] text-white text-xl py-2 rounded-lg hover:bg-[#1e3442]"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
            <img className="m-auto" src="art/duckFace.png" style={{ height: '100px', width: '100px' }}></img>
        </div>
    );
}

export default LogIn;

