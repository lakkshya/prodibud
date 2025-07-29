import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
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
    <div className="bg-gold-gradient min-h-screen flex justify-center items-center relative overflow-hidden">
      <main className="w-full sm:w-7/10 md:w-full lg:w-8/10 relative flex flex-col md:flex-row gap-10 bg-white/95 backdrop-blur-sm px-8 py-10 md:px-12 md:py-12 mx-5 my-10 md:mx-10 rounded-4xl shadow-2xl border border-white/50">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-2/5 flex flex-col justify-center space-y-8 lg:pr-8">
          {/* Logo Section */}
          <div className="text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg mb-4">
              <MdEmail className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-[1.5rem] md:text-[2rem] font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-[1rem] md:text-[1.2rem]">
              Sign in to your MailBoard account
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="grid grid-cols-1 gap-8"
          >
            {/* Section: Account Details */}

            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[0.9rem] font-medium text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
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
                    className={`w-full pl-12 pr-4 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[0.9rem] font-medium text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                    className={`w-full pl-12 pr-12 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password - Future Purpose*/}
              {/* <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[0.875rem] md:text-[0.9rem] text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div> */}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full text-[0.9rem] md:text-[1rem] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
              >
                Sign In to MailBoard
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-[0.875rem] md:text-[0.9rem] text-gray-600">
                  New to MailBoard?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                  >
                    Create your account
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Login;
