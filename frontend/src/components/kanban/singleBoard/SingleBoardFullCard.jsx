import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LuEllipsis, LuPlus, LuX } from "react-icons/lu";
import ColumnCard from "../column/ColumnCard";

const gradientMap = {
  TEAL_BLUE: "linear-gradient(to top, #37ecba 0%, #72afd3 100%)",
  PURPLE_INDIGO: "linear-gradient(to top, #cc208e 0%, #6713d2 100%)",
  YELLOW_RED: "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)",
  PINK_PEACH: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
  SKY_BLUE: "linear-gradient(to top, #00c6fb 0%, #005bea 100%)",
};

const SingleBoardsFullCard = () => {
  const { id } = useParams();
  const boardMenuRef = useRef();

  const [boardData, setBoardData] = useState({});
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnData, setColumnData] = useState([]);

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

  const handleInviteMembers = async () => {};

  const handleAddColumn = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/kanban/board/${boardData.id}/column`,
        {
          name: columnName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setColumnData(res.data);
      setColumnName("");
      setShowCreateColumn(false);
      console.log(columnData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!boardData?.id) return;

    const fetchAllColumns = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/kanban/board/${boardData.id}/columns`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setColumnData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllColumns();
  }, [boardData.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boardMenuRef.current && !boardMenuRef.current.contains(e.target)) {
        setIsBoardMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col gap-5 bg-white"
      style={{ backgroundImage: gradientMap[boardData.background] }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-5">
        <div className="flex items-center gap-3">
          <h3 className="text-[1.2rem] text-white font-medium">
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

          <div className="relative" ref={boardMenuRef}>
            <button
              className={`w-10 h-10 flex items-center justify-center hover:bg-gray-300/50 rounded-xl cursor-pointer ${
                isBoardMenuOpen ? "bg-gray-300/50" : ""
              }`}
              onClick={() => setIsBoardMenuOpen((prev) => !prev)}
            >
              <LuEllipsis className="text-[1.2rem] text-white" />
            </button>

            {isBoardMenuOpen && (
              <div className="w-50 absolute right-0 flex flex-col gap-1 mt-1 bg-white rounded-2xl shadow-lg p-1 z-50">
                <button
                  className={`flex px-4 py-2 text-[0.9rem] rounded-2xl text-black hover:bg-gray-300 cursor-pointer`}
                  onClick={() => {
                    setIsBoardMenuOpen(false);
                  }}
                >
                  About board
                </button>
                <button
                  className={`flex px-4 py-2 text-[0.9rem] rounded-2xl text-black hover:bg-gray-300 cursor-pointer`}
                  onClick={() => {
                    setIsBoardMenuOpen(false);
                  }}
                >
                  Change background
                </button>
                <button
                  className={`flex px-4 py-2 text-[0.9rem] rounded-2xl text-black hover:bg-gray-300 cursor-pointer`}
                  onClick={() => {
                    setIsBoardMenuOpen(false);
                  }}
                >
                  Delete board
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-full flex gap-3 px-3 mb-2 overflow-x-auto">
        {/* Render all columns */}
        {columnData.length > 0 &&
          columnData.map((col) => (
            <div key={col.id} className="flex-shrink-0 w-72">
              <ColumnCard
                column={col}
                onColumnDelete={(deletedId) =>
                  setColumnData((prev) =>
                    prev.filter((c) => c.id !== deletedId)
                  )
                }
                onColumnRename={(renamedCol) =>
                  setColumnData((prev) =>
                    prev.map((c) => (c.id === renamedCol.id ? renamedCol : c))
                  )
                }
              />
            </div>
          ))}

        <div className="flex-shrink-0 w-72">
          {showCreateColumn ? (
            <div className="w-70 flex flex-col justify-center gap-2 bg-gray-200 p-3 rounded-xl">
              <input
                type="text"
                name="columnName"
                placeholder="Enter column name"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className="text-gray-800 bg-white px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 rounded-xl"
              />
              <div className="w-full flex items-center gap-1">
                <button
                  className="text-white bg-gray-800 hover:bg-gray-600 px-3 py-2 rounded-xl cursor-pointer"
                  onClick={handleAddColumn}
                >
                  Add
                </button>
                <button
                  className="hover:bg-gray-400 p-3 rounded-xl cursor-pointer"
                  onClick={() => setShowCreateColumn(false)}
                >
                  <LuX className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="w-70 flex items-center gap-3 bg-gray-300/60 hover:bg-gray-300/50 p-3 rounded-xl cursor-pointer"
              onClick={() => setShowCreateColumn(true)}
            >
              <LuPlus className="w-4 h-4 text-white" strokeWidth={3} />
              <h4 className="text-white font-medium">Add a column</h4>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBoardsFullCard;
