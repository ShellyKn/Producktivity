// Login.jsx
// Renders a simple combined Log In / Sign Up screen.
// Persists the authenticated user object to localStorage on success,
// then navigates to the main app route ("/todo").
//
// Notes:
// This component stores the entire user payload in localStorage under "user"
//   (to-do: store an auth token instead).
// Basic error handling shows a message under the form.

import Logo from "../components/Logo";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LogIn() {
  // Router navigation helper
  const navigate = useNavigate();

  // Local form state for email/password and an error banner
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Generic input change handler (keeps form fields in sync with state)
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Log in flow:
  // - POST /api/users/login with email/password
  // - On success, store user in localStorage and navigate to "/todo"
  // - On failure, surface the error message
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

      // Persist authenticated user (used elsewhere to identify the current user)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Route to the main app screen
      navigate("/todo");
    } catch (err) {
      setError(err.message);
    }
  };

  // Sign up flow:
  // - POST /api/users/register with minimal fields
  // - Derives a default userName + name from the email local-part
  // - On success, store user in localStorage and navigate to "/todo"
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const localPart = (form.email || "").split("@")[0] || "";
      const res = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          userName: localPart, // default username suggestion
          name: localPart,     // default display name suggestion
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Persist newly created user and navigate in
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/todo");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Full-height page with a header and centered auth card
    <div className="bg-[#FAFAF0] h-screen flex flex-col">
      <Header left_side={<Logo />} right_side="" />

      {/* Auth card */}
      <div className="m-auto border-4 flex flex-col gap-4 z-50 font-jua border-[#464141] rounded-xl p-6 w-[400px] shadow-xl text-[#464141]">
        {/* Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl"> Log In/Sign Up </h2>
        </div>

        {/* Form: email + password; buttons for Log In and Sign Up */}
        <form className="flex flex-col gap-4">
          {/* Email input (controlled) */}
          <input
            type="email"
            name="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
          />

          {/* Password input (controlled) */}
          <input
            type="password"
            name="password"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border-2 border-[#464141] rounded-lg p-2 bg-white"
          />

          {/* Error banner (only renders when an error is set) */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit buttons:
              - "Log In" calls handleSubmit
              - "Sign Up" calls handleRegister
             */}
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

      {/* Footer image */}
      <img
        className="m-auto"
        src="art/duckFace.png"
        style={{ height: "100px", width: "100px" }}
        alt="Duck face"
      />
    </div>
  );
}

export default LogIn;
