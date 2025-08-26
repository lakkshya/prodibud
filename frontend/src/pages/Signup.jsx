import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import {
  MdEmail,
  MdPerson,
  MdPhone,
  MdLock,
  MdDateRange,
} from "react-icons/md";
import Loading from "../components/Loading";
import withMinDelay from "../utils/withMinDelay";

const Signup = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [emailStatus, setEmailStatus] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name.trim()) newErrors.name = "Name is required";
    if (!userData.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date Of Birth is required";
    if (!userData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required";
    if (!userData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userData.email))
      newErrors.email = "Invalid email address";
    if (!userData.password.trim()) newErrors.password = "Password is required";
    else if (userData.password.length < 6)
      newErrors.password = "Password must be atleast 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailUniqueness = useMemo(
    () =>
      debounce(async (email) => {
        setIsCheckingEmail(true);
        try {
          const res = await axios.post(
            "http://localhost:5000/api/auth/check-email",
            { email }
          );
          if (res.data.exists) {
            setEmailStatus("taken");
          } else {
            setEmailStatus("available");
          }
        } catch (err) {
          console.error("Error checking email uniqueness", err);
          setEmailStatus(null);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 1000),
    []
  );

  useEffect(() => {
    const isValidFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
      userData.email
    );

    if (userData.email && isValidFormat) {
      setIsCheckingEmail(true);
      checkEmailUniqueness(userData.email);
    } else {
      setEmailStatus(null);
    }
  }, [userData.email, checkEmailUniqueness]);

  useEffect(() => {
    return () => checkEmailUniqueness.cancel();
  }, [checkEmailUniqueness]);

  const signup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await withMinDelay(
        axios.post("http://localhost:5000/api/auth/signup", userData),
        2000
      );
      const { token } = response.data;
      localStorage.setItem("token", token);

      navigate("/mail/inbox", {
        state: {
          toast: { message: "Signup successful", type: "Success" },
        },
      });
    } catch (err) {
      console.error("Signup error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Creating your account..." />;

  return (
    <div className="bg-gold-gradient min-h-screen flex justify-center items-center relative overflow-hidden">
      <main className="w-full sm:w-7/10 md:w-full lg:w-8/10 relative flex flex-col md:flex-row gap-10 bg-white/95 backdrop-blur-sm px-8 py-10 md:px-12 md:py-12 mx-5 my-10 md:mx-10 rounded-4xl shadow-2xl border border-white/50">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 lg:pr-8">
          {/* Logo Section */}
          <div className="text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl shadow-lg mb-4">
              <MdEmail className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-[1.5rem] md:text-[2rem] font-bold text-gray-800 mb-2">
              Join Prodibud Today
            </h1>
            <p className="text-gray-600 text-[1rem] md:text-[1.2rem]">
              Create your account and start managing emails efficiently
            </p>
          </div>

          {/* Additional Welcome Content */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-800 rounded-full mt-3"></div>
              <div>
                <h3 className="text-[1.2rem] font-semibold text-gray-800 mb-2">
                  Quick Setup
                </h3>
                <p className="text-[1rem] text-gray-600">
                  Get started in minutes with our streamlined registration
                  process
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-sky-500 rounded-full mt-3"></div>
              <div>
                <h3 className="text-[1.2rem] font-semibold text-gray-800 mb-2">
                  Powerful Features
                </h3>
                <p className="text-[1rem] text-gray-600">
                  Access advanced email management tools right from day one
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-800 rounded-full mt-3"></div>
              <div>
                <h3 className="text-[1.2rem] font-semibold text-gray-800 mb-2">
                  Free to Start
                </h3>
                <p className="text-[1rem] text-gray-600">
                  Begin with our comprehensive free plan, upgrade when you're
                  ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signup();
            }}
            className="grid grid-cols-1 gap-8"
          >
            {/* Section: Personal Information */}
            <div className="space-y-6 flex flex-col">
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[0.9rem] font-medium text-gray-700 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MdPerson className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={userData.name}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setUserData((prev) => ({ ...prev, [name]: value }));

                        setErrors((prevErrors) => {
                          const updatedErrors = { ...prevErrors };
                          delete updatedErrors[name];
                          return updatedErrors;
                        });
                      }}
                      className={`w-full pl-12 pr-4 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-200 ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-[0.9rem] font-medium text-gray-700 block">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MdDateRange className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={userData.dateOfBirth}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setUserData((prev) => ({ ...prev, [name]: value }));

                        setErrors((prevErrors) => {
                          const updatedErrors = { ...prevErrors };
                          delete updatedErrors[name];
                          return updatedErrors;
                        });
                      }}
                      className={`w-full pl-12 pr-4 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-200 ${
                        errors.dateOfBirth
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[0.9rem] font-medium text-gray-700 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MdPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      value={userData.phoneNumber}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setUserData((prev) => ({ ...prev, [name]: value }));

                        setErrors((prevErrors) => {
                          const updatedErrors = { ...prevErrors };
                          delete updatedErrors[name];
                          return updatedErrors;
                        });
                      }}
                      className={`w-full pl-12 pr-4 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-200 ${
                        errors.phoneNumber
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

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

                        const isValidFormat =
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            value
                          );
                        if (isValidFormat) {
                          checkEmailUniqueness(value);
                        } else {
                          setEmailStatus(null);
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        const isValidFormat =
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            value
                          );
                        if (isValidFormat) {
                          checkEmailUniqueness(value);
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-200 ${
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
                  {userData.email &&
                    !errors.email &&
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      userData.email
                    ) &&
                    (isCheckingEmail ? (
                      <p className="text-[0.875rem] md:text-[0.9rem] text-gray-500 flex items-center mt-1">
                        Checking email...
                      </p>
                    ) : emailStatus === "taken" ? (
                      <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                        Email is already taken
                      </p>
                    ) : emailStatus === "available" ? (
                      <p className="text-[0.875rem] md:text-[0.9rem] text-green-600 flex items-center mt-1">
                        Email is available
                      </p>
                    ) : null)}
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
                      type="password"
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
                      className={`w-full pl-12 pr-4 py-3 text-[0.9rem] md:text-[1rem] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-200 ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[0.875rem] md:text-[0.9rem] text-red-600 flex items-center mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={emailStatus === "taken" || isCheckingEmail}
                  className={`w-full text-[0.9rem] md:text-[1rem] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200  ${
                    emailStatus === "taken" || isCheckingEmail
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-800 hover:bg-blue-900 cursor-pointer"
                  }`}
                >
                  Create Prodibud Account
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-[0.875rem] md:text-[0.9rem] text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
