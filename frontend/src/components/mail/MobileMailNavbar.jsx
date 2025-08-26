import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LuFile,
  LuInbox,
  LuPencil,
  LuSendHorizontal,
  LuTrash2,
} from "react-icons/lu";
import Popup from "../Popup";

const MobileMailNavbar = ({ isDirty }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const handleNavClick = (e, path) => {
    e.preventDefault(); // don’t let NavLink do anything
    if (location.pathname === "/mail/compose" && isDirty) {
      setShowLeavePrompt(true);
      setPendingNavigation(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 bg-blue-800 p-3">
      <NavLink
        to="/mail/compose"
        className="relative flex items-center bg-white text-left p-3 rounded-4xl cursor-pointer"
      >
        <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
          <LuPencil className="w-4 h-4" />
        </div>
        <span className="text-[0.9rem] pl-10">Compose</span>
      </NavLink>

      <div className="flex flex-col text-white">
        <NavLink
          to="/mail/inbox"
          className={({ isActive }) =>
            `relative flex items-center text-left p-3 rounded-4xl ${
              isActive
                ? "bg-blue-200 text-black"
                : "hover:bg-white/50 hover:text-black"
            }`
          }
          onClick={(e) => handleNavClick(e, "/mail/inbox")}
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuInbox className="w-4 h-4" />
          </div>
          <span className="text-[0.9rem] pl-10">Inbox</span>
        </NavLink>

        <NavLink
          to="/mail/drafts"
          className={({ isActive }) =>
            `relative flex items-center text-left p-3 rounded-4xl ${
              isActive
                ? "bg-blue-200 text-black"
                : "hover:bg-white/50 hover:text-black"
            }`
          }
          onClick={(e) => handleNavClick(e, "/mail/drafts")}
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuFile className="w-4 h-4" />
          </div>
          <span className="text-[0.9rem] pl-10">Drafts</span>
        </NavLink>

        <NavLink
          to="/mail/sent"
          className={({ isActive }) =>
            `relative flex items-center text-left p-3 rounded-4xl ${
              isActive
                ? "bg-blue-200 text-black"
                : "hover:bg-white/50 hover:text-black"
            }`
          }
          onClick={(e) => handleNavClick(e, "/mail/sent")}
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuSendHorizontal className="w-4 h-4" />
          </div>
          <span className="text-[0.9rem] pl-10">Sent</span>
        </NavLink>

        <NavLink
          to="/mail/trash"
          className={({ isActive }) =>
            `relative flex items-center text-left p-3 rounded-4xl ${
              isActive
                ? "bg-blue-200 text-black"
                : "hover:bg-white/50 hover:text-black"
            }`
          }
          onClick={(e) => handleNavClick(e, "/mail/trash")}
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuTrash2 className="w-4 h-4" />
          </div>
          <span className="text-[0.9rem] pl-10">Trash</span>
        </NavLink>
      </div>

      {showLeavePrompt && (
        <Popup
          title="Unsaved Changes"
          message="Do you want to leave this page before saving as draft?"
          onClose={() => setShowLeavePrompt(false)}
          actions={[
            {
              label: "Stay",
              className: "bg-gray-200 hover:bg-gray-300",
              onClick: () => {
                setShowLeavePrompt(false);
                setPendingNavigation(null);
              },
            },
            {
              label: "Leave",
              className: "bg-gray-200 hover:bg-gray-300",
              onClick: async () => {
                if (pendingNavigation) {
                  navigate(pendingNavigation);
                }
                setShowLeavePrompt(false);
                setPendingNavigation(null);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default MobileMailNavbar;
