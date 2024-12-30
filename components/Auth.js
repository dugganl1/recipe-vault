import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Success! The session change will be caught by our listener
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form
        onSubmit={handleAuth}
        className="p-8 max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"} to Recipe Vault
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
        <button
          type="button"
          className="w-full text-sm text-gray-600"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </button>
      </form>
    </div>
  );
}
