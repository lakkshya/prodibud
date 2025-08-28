import { NavLink } from "react-router-dom";
import { LuHouse, LuPlus, LuSquareKanban } from "react-icons/lu";

const KanbanNavbar = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 bg-blue-800 p-5">
      <NavLink
        to="/kanban/create"
        className="relative bg-white text-left p-3 rounded-4xl cursor-pointer"
      >
        <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
          <LuPlus className="w-4 h-4" />
        </div>
        <span className="pl-10">Create Board</span>
      </NavLink>

      <div className="flex flex-col text-white">
        <NavLink
          to="/kanban/home"
          className={({ isActive }) =>
            `relative text-left p-3 rounded-4xl ${
              isActive
                ? "bg-blue-200 text-black"
                : "hover:bg-white/50 hover:text-black"
            }`
          }
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuHouse className="w-4 h-4" />
          </div>
          <span className="pl-10">Home</span>
        </NavLink>

        <NavLink
          to="/kanban/boards"
          className={({ isActive }) =>
            `relative text-left p-3 rounded-4xl ${
              isActive
                ? "bg-blue-200 text-black"
                : "hover:bg-white/50 hover:text-black"
            }`
          }
        >
          <div className="absolute left-0 inset-y-0 pl-5 flex items-center">
            <LuSquareKanban className="w-4 h-4" />
          </div>
          <span className="pl-10">Boards</span>
        </NavLink>
      </div>
    </div>
  );
};

export default KanbanNavbar;
