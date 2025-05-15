import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function AuthUI() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && !user.emailVerified) {
      user.reload(); // update user info
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isSignup) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(res.user);
        setMessage("Account created! Verification email sent. Please check your inbox.");
      } else {
        await login(email, password);
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage("Please enter your email to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage(error.message || "Reset failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200 my-8 font-sans">
      {user ? (
        <div className="text-center">
          <p className="text-gray-800 mb-2">
            Logged in as <strong>{user.email}</strong>
          </p>
          {!user.emailVerified ? (
            <p className="text-sm text-red-600 mb-2">Please verify your email to access all features.</p>
          ) : null}
          <button
            onClick={logout}
            className="bg-gray-800 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-700 transition"
          >
            Sign out
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            {isSignup ? "Create an Account" : "Sign in to Your Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isSignup}
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-900 transition"
            >
              {isSignup ? "Sign up" : "Sign in"}
            </button>
          </form>
          <div className="mt-4 text-center space-y-2">
            {!isSignup && (
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="block text-sm text-blue-600 hover:underline"
            >
              {isSignup ? "Already have an account? Sign in" : "Create an account"}
            </button>
          </div>
          {message && (
            <p className="text-sm text-center text-red-600 mt-4">{message}</p>
          )}
        </>
      )}
    </div>
  );
}
