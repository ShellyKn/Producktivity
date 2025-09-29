import { useEffect, useState } from "react"

// basic test function 
function App() {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    fetch("/api/hello") 
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err.message))
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">{message}</h1>
    </div>
  )
}

export default App
