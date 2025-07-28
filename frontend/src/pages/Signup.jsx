import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import Toast from "../components/Toast";
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

      navigate("/mail", {
        state: {
          toast: { message: "Signup successful", type: "Success" },
        },
      });
    } catch (err) {
      const msg =
        err.response && err.response.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      showToast(msg, "error");
      console.error("Signup error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Creating your account..." />;

  return (
    <div className="bg-gold-gradient min-h-screen flex justify-center items-center">
      <main className="flex flex-col gap-10 bg-white px-6 py-6 md:px-15 md:py-10 mx-5 md:mx-10 rounded-4xl">
        <h1 className="text-[1.4rem] md:text-[1.8rem] font-bold text-center">
          Signup
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}
          className="grid grid-cols-1 gap-8 md:gap-0 md:grid-cols-2"
        >
          {/* Left Section: Basic Details */}
          <div className="space-y-6 pb-5 md:pb-0 md:pr-10">
            <div className="space-y-2">
              <h2 className="text-[1rem] md:text-[1.2rem] font-semibold text-gray-800">
                👤 Personal Information
              </h2>
              <p className="text-[0.825rem] md:text-[0.9rem] text-gray-600">
                Enter your basic info to create your identity.
              </p>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Name"
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
                className="w-full text-[0.9rem] md:text-[1rem] border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.name && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.name}
                </p>
              )}

              {/* Date of Birth */}
              <input
                type="date"
                name="dateOfBirth"
                placeholder="DOB"
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
                className="w-full text-[0.9rem] md:text-[1rem] border border-gray-300 rounded-full px-5 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.dateOfBirth && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.dateOfBirth}
                </p>
              )}

              {/* Phone Number */}
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
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
                className="w-full text-[0.9rem] md:text-[1rem] border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.phoneNumber && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Account Details */}
          <div className="space-y-6 flex flex-col pt-10 md:pt-0 md:pl-10 border-t md:border-t-0 md:border-l border-gray-400">
            <div className="space-y-2">
              <h2 className="text-[1rem] md:text-[1.2rem] font-semibold text-gray-800">
                🔒 Account Credentials
              </h2>
              <p className="text-[0.825rem] md:text-[0.9rem] text-gray-600">
                Complete account setup with password and email login
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

                  const isValidFormat =
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                  if (isValidFormat) {
                    checkEmailUniqueness(value);
                  } else {
                    setEmailStatus(null);
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  const isValidFormat =
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                  if (isValidFormat) {
                    checkEmailUniqueness(value);
                  }
                }}
                className="w-full text-[0.9rem] md:text-[1rem] border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.email && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.email}
                </p>
              )}
              {userData.email &&
                !errors.email &&
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  userData.email
                ) &&
                (isCheckingEmail ? (
                  <p className="text-[0.825rem] md:text-[0.875rem] text-gray-500 pl-2 -mt-3">
                    Checking email...
                  </p>
                ) : emailStatus === "taken" ? (
                  <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                    Email is already taken
                  </p>
                ) : emailStatus === "available" ? (
                  <p className="text-[0.825rem] md:text-[0.875rem] text-green-600 pl-2 -mt-3">
                    Email is available
                  </p>
                ) : null)}

              {/* Password */}
              <input
                type="password"
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
              {errors.password && (
                <p className="text-[0.825rem] md:text-[0.875rem] text-red-600 pl-2 -mt-3">
                  {errors.password}
                </p>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={emailStatus === "taken" || isCheckingEmail}
                className={`w-full text-[0.9rem] md:text-[1rem] text-white font-semibold py-2 rounded-full transition duration-200 ${
                  emailStatus === "taken" || isCheckingEmail
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-400 hover:bg-amber-500"
                }`}
              >
                Sign Up
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

export default Signup;
