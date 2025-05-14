// src/AuthUI.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function AuthUI() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="mb-4">
      {user ? (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Logged in as {user.email}</span>
          <button className="text-red-500" onClick={logout}>Sign out</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="flex gap-2 flex-wrap items-center">
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-red-500 text-white px-3 py-1 rounded" type="submit">Login</button>
        </form>
      )}
    </div>
  );
}
