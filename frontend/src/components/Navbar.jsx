import { NavLink, Link, useNavigate } from "react-router-dom";
import { LuMenu, LuUserRound } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef();
  const mobileMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-5 md:px-10 py-5">
      <div className="flex justify-between">
        <div className="flex items-center border border-gray-500 px-4 rounded-4xl">
          <h1 className="text-[1.2rem]">MailBoard</h1>
        </div>

        <div className="flex justify-between gap-2 sm:gap-5">
          {/* Mobile Nav */}
          <div className="sm:hidden relative" ref={mobileMenuRef}>
            <button
              className="w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-gray-300 rounded-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <LuMenu className="text-[1.2rem]" />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
                <NavLink
                  to="/mail"
                  className="block px-4 py-2 text-[0.9rem] text-black hover:bg-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mail
                </NavLink>
                <NavLink
                  to="/kanban"
                  className="block px-4 py-2 text-[0.9rem] text-black hover:bg-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kanban
                </NavLink>
                <NavLink
                  to="/calendar"
                  className="block px-4 py-2 text-[0.9rem] text-black hover:bg-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Calendar
                </NavLink>
              </div>
            )}
          </div>
          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-1 bg-white/80 p-1 rounded-4xl">
            <NavLink
              to="/mail"
              className={({ isActive }) =>
                `flex justify-center px-4 py-2 rounded-4xl ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-black hover:bg-gray-300"
                }`
              }
            >
              <h1 className="text-[1rem]">Mail</h1>
            </NavLink>
            <NavLink
              to="/kanban"
              className={({ isActive }) =>
                `flex justify-center px-4 py-2 rounded-4xl ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-black hover:bg-gray-300"
                }`
              }
            >
              <h1 className="text-[1rem]">Kanban</h1>
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex justify-center px-4 py-2 rounded-4xl ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-black hover:bg-gray-300"
                }`
              }
            >
              <h1 className="text-[1rem]">Calendar</h1>
            </NavLink>
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <div
              className="w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-gray-300 rounded-full cursor-pointer"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            >
              <LuUserRound className="text-[1.2rem]" />
            </div>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg py-2 z-50">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-[0.9rem] text-black hover:bg-gray-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-[0.9rem] text-black hover:bg-gray-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Signup
                </Link>
                <button
                  className="block w-full px-4 py-2 text-[0.9rem] text-left text-black hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsUserMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
