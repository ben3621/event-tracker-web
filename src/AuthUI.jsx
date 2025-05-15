import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export default function AuthUI({ children }) {
  const { user, login, register, forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") login(email, password);
    else if (mode === "register") register(email, password);
    else forgotPassword(email);
  };

  if (user) return children;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 text-white p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md text-black w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">{mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Forgot Password"}</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode !== "forgot" && (
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        )}
        <Button type="submit" className="w-full">{mode === "login" ? "Sign In" : mode === "register" ? "Register" : "Send Reset Email"}</Button>
        <div className="flex justify-between text-sm">
          {mode !== "register" && <button type="button" className="underline" onClick={() => setMode("register")}>Create Account</button>}
          {mode !== "login" && <button type="button" className="underline" onClick={() => setMode("login")}>Back to Login</button>}
          {mode !== "forgot" && <button type="button" className="underline" onClick={() => setMode("forgot")}>Forgot Password?</button>}
        </div>
      </form>
    </div>
  );
}