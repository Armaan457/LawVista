import autoprefixer from "autoprefixer";
import { useState, useEffect, FormEvent } from "react";
import AuthAxios from "../utils/authaxios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/loader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Effect to apply theme on component mount and when dark state changes
  useEffect(() => {
    if (dark) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      console.log("Registration data:", { name, email, password });
      setLoading(true);
      const res = await AuthAxios.post("/auth/login", { email, password });
      setLoading(false);
      const data = res.data;

      if (data.success) {
        toast.success("Login successful.");
        navigate("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full dark:bg-PrimaryBlack bg-PrimaryWhite flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center font-semibold dark:text-white text-black text-lg">
          Welcome
        </h2>
        <p className="mt-1 text-center dark:text-PrimaryGrayTextDark text-slate-500">
          Login to continue
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-white text-slate-800"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="johndoe@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-4 border-none dark:bg-PrimaryGrayDark dark:text-white text-black bg-TertiaryWhite rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium dark:text-white text-slate-800"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-4 border-none dark:bg-PrimaryGrayDark dark:text-white text-black bg-TertiaryWhite rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white dark:bg-PrimaryBlue bg-DarkBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <a href="/register"><p className="text-center text-PrimaryGrayTextDark hover:underline cursor-pointer">Don't have an account? Sign Up</p></a>
      </div>

      {loading && <Loader />}
    </div>
  );
}
