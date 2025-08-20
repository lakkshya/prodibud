import { LuFile, LuInbox, LuPencil, LuTrash2 } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const MailNavbar = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 bg-gray-200/70 p-5">
      <NavLink
        to="/mail/compose"
        className="relative bg-amber-400 text-left p-3 rounded-4xl cursor-pointer"
      >
        <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
          <LuPencil className="w-4 h-4" />
        </div>
        <span className="pl-10">Compose</span>
      </NavLink>

      <div className="flex flex-col">
        <NavLink
          to="/mail/inbox"
          className={({ isActive }) =>
            `relative text-left p-3 rounded-4xl ${
              isActive ? "bg-white" : "hover:bg-white/50"
            }`
          }
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuInbox className="w-4 h-4" />
          </div>
          <span className="pl-10">Inbox</span>
        </NavLink>

        <NavLink
          to="/mail/drafts"
          className={({ isActive }) =>
            `relative text-left p-3 rounded-4xl ${
              isActive ? "bg-white" : "hover:bg-white/50"
            }`
          }
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuFile className="w-4 h-4" />
          </div>
          <span className="pl-10">Drafts</span>
        </NavLink>

        <NavLink
          to="/mail/trash"
          className={({ isActive }) =>
            `relative text-left p-3 rounded-4xl ${
              isActive ? "bg-white" : "hover:bg-white/50"
            }`
          }
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuTrash2 className="w-4 h-4" />
          </div>
          <span className="pl-10">Trash</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MailNavbar;
