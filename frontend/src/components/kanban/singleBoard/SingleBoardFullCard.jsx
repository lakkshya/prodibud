import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { LuEllipsis } from "react-icons/lu";

const gradientMap = {
  TEAL_BLUE: "linear-gradient(to top, #37ecba 0%, #72afd3 100%)",
  PURPLE_INDIGO: "linear-gradient(to top, #cc208e 0%, #6713d2 100%)",
  YELLOW_RED: "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)",
  PINK_PEACH: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
  SKY_BLUE: "linear-gradient(to top, #00c6fb 0%, #005bea 100%)",
};

const SingleBoardsFullCard = () => {
  const { id } = useParams();
  const [boardData, setBoardData] = useState({});

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/kanban/board/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setBoardData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBoard();
  }, [id]);

  console.log(boardData);

  const handleInviteMembers = async () => {};

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col gap-5 bg-white px-5 py-2 md:py-5"
      style={{ backgroundImage: gradientMap[boardData.background] }}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[1rem] text-white font-medium">
            {boardData.name}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleInviteMembers}
            className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-2xl cursor-pointer"
          >
            Invite
          </button>

          <div className="relative" ref={mobileMenuRef}>
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-300/50 rounded-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <LuEllipsis className="text-[1.2rem] text-white" />
            </button>

            {isMobileMenuOpen && (
              <div className="w-30 absolute right-0 flex flex-col gap-1 mt-1 bg-white rounded-2xl shadow-lg p-1 z-50">
                <NavLink
                  to="/mail/inbox"
                  className={({ isActive }) =>
                    `flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Mail
                </NavLink>
                <NavLink
                  to="/kanban/boards"
                  className={({ isActive }) =>
                    `flex justify-center px-4 py-2 text-[0.9rem] rounded-2xl ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-black hover:bg-gray-300"
                    }`
                  }
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
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
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Calendar
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBoardsFullCard;
