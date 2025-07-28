import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";
import Loading from "../components/Loading";
import withMinDelay from "../utils/withMinDelay";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast({ message: "", type: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userData.email))
      newErrors.email = "Invalid email address";
    if (!userData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await withMinDelay(
        axios.post("http://localhost:5000/api/auth/login", userData),
        2000
      );
      const { token } = response.data;
      localStorage.setItem("token", token);

      navigate("/mail", {
        state: {
          toast: { message: "Login successful", type: "Success" },
        },
      });
    } catch (err) {
      const msg =
        err.response && err.response.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      showToast(msg, "error");
      console.error("Login error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Logging in your account..." />;

  return (
    <div className="bg-gold-gradient min-h-screen flex justify-center items-center">
      <main className="flex flex-col gap-10 bg-white px-6 py-6 md:px-15 md:py-10 mx-5 md:mx-10 rounded-4xl">
        <h1 className="text-[1.4rem] md:text-[1.8rem] font-bold text-center">
          Login
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="grid grid-cols-1 gap-8"
        >
          {/* Section: Account Details */}
          <div className="space-y-6 flex flex-col">
            <div className="space-y-2">
              <h2 className="text-[1rem] md:text-[1.2rem] font-semibold text-gray-800">
                Welcome Back!
              </h2>
              <p className="text-[0.825rem] md:text-[0.9rem] text-gray-600">
                Login with your email and password to continue
              </p>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setUserData((prev) => ({ ...prev, [name]: value }));

                  setErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors[name];
                    return updatedErrors;
                  });
                }}
                className="w-full text-[0.9rem] md:text-[1rem] border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.email && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.email}
                </p>
              )}

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUserData((prev) => ({ ...prev, [name]: value }));

                    setErrors((prevErrors) => {
                      const updatedErrors = { ...prevErrors };
                      delete updatedErrors[name];
                      return updatedErrors;
                    });
                  }}
                  className="w-full text-[0.9rem] md:text-[1rem] border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[0.8rem] md:text-[0.85rem] text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.password}
                </p>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full text-[0.9rem] md:text-[1rem] text-white font-semibold py-2 rounded-full transition duration-200 bg-amber-400 hover:bg-amber-500 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </form>
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </main>
    </div>
  );
};

export default Login;
