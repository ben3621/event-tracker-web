import { useState } from "react";
import { useAuth } from "./AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function AuthUI() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created successfully. You are now logged in.");
      } else {
        await login(email, password);
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded bg-white shadow-sm">
      {user ? (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Logged in as <strong>{user.email}</strong></span>
          <button className="text-red-500 hover:underline" onClick={logout}>Sign out</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            type="submit"
          >
            {isSignup ? "Sign up" : "Login"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-blue-600 underline"
          >
            {isSignup ? "Already have an account? Log in" : "Create an account"}
          </button>
          {message && <p className="text-sm text-red-600 w-full mt-1">{message}</p>}
        </form>
      )}
    </div>
  );
}
