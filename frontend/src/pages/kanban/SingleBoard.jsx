import Navbar from "../../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

import KanbanNavbar from "../../components/kanban/KanbanNavbar";
import { LuArrowLeft, LuMenu } from "react-icons/lu";
import MobileKanbanNavbar from "../../components/kanban/MobileKanbanNavbar";
import SingleBoardsFullCard from "../../components/kanban/singleBoard/SingleBoardFullCard";

const SingleBoard = () => {
  const [isMobileMailNavOpen, setIsMobileMailNavOpen] = useState(false);

  return (
    <div>
      <Navbar />

      {/* Desktop */}
      <main className="hidden md:block h-[calc(100vh-80px)] p-5">
        <div className="h-full grid grid-cols-10 gap-3 overflow-hidden">
          <div className="h-full col-span-2 rounded-2xl shadow-md overflow-y-auto">
            <KanbanNavbar />
          </div>

          <div className="h-full col-span-8 bg-white rounded-2xl shadow-md overflow-y-auto">
            <SingleBoardsFullCard />
          </div>
        </div>
      </main>

      {/* Mobile */}
      <main className="md:hidden flex flex-col gap-2 p-2">
        <div className="flex justify-between gap-2 bg-blue-100 p-2 rounded-xl">
          <button
            onClick={() => setIsMobileMailNavOpen(true)}
            className="flex-1 rounded-full px-2 cursor-pointer"
          >
            <LuMenu className="w-5 h-5 text-gray-400" />
          </button>
          <div className="w-full">
            <input
              type="text"
              name="search"
              placeholder="Search in boards"
              className="w-full text-gray-900 py-1 focus:outline-none"
            />
          </div>
        </div>

        <div className="h-[calc(100vh-108px)] overflow-y-auto rounded-xl border border-gray-200 shadow-md">
          <div className="bg-white rounded-xl py-2">
            <Link to="/mail/inbox" className="flex text-gray-500 p-2 ml-2">
              <LuArrowLeft className="w-5 h-5" />
            </Link>
            <SingleBoardsFullCard />
          </div>
        </div>
      </main>
      {isMobileMailNavOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileMailNavOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-8/10 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMailNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MobileKanbanNavbar />
      </div>
    </div>
  );
};

export default SingleBoard;
