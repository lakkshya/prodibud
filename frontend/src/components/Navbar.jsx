import { NavLink, Link, useNavigate } from "react-router-dom";
import { LuEllipsis, LuUserRound } from "react-icons/lu";
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
    <div className="h-18 md:h-20 flex items-center justify-center px-2 md:px-5">
      <div className="w-full h-12 md:h-15 flex items-center justify-between">
        <img src="/logo.png" alt="Prodibud Logo" className="h-full" />

        <div className="flex justify-between gap-2 sm:gap-5">
          {/* Mobile Nav */}
          <div className="sm:hidden relative" ref={mobileMenuRef}>
            <button
              className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-gray-300 rounded-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <LuEllipsis className="text-[1.2rem]" />
            </button>

            {isMobileMenuOpen && (
              <div className="w-30 absolute right-0 flex flex-col gap-1 mt-1 bg-white rounded-2xl shadow-lg p-1 z-50">
                <NavLink
                  to="/mail"
                  className={({ isActive }) =>
                    `flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mail
                </NavLink>
                <NavLink
                  to="/kanban"
                  className={({ isActive }) =>
                    `flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kanban
                </NavLink>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    `flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
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
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/80 hover:bg-gray-300 rounded-full cursor-pointer"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            >
              <LuUserRound className="text-[1.2rem]" />
            </div>

            {isUserMenuOpen && (
              <div className="w-36 absolute right-0 flex flex-col gap-1 mt-1 bg-white rounded-2xl shadow-lg p-1 z-50">
                <Link
                  to="/login"
                  className="flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl text-black hover:bg-gray-300"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Login
                </Link>
                <button
                  className="w-full flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl text-black hover:bg-gray-200 cursor-pointer"
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
