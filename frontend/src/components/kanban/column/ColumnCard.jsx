import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { LuEllipsis, LuPlus, LuX } from "react-icons/lu";

const ColumnCard = ({ column, onColumnDelete, onColumnRename }) => {
  const columnMenuRef = useRef();
  const textareaRef = useRef(null);

  const [menuState, setMenuState] = useState("closed");
  const [newName, setNewName] = useState(column.name);

  const [showCreateCard, setShowCreateCard] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardData, setCardData] = useState([]);

  const handleDeleteColumn = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/kanban/column/${column.id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Tell parent to remove this column from UI
      if (onColumnDelete) {
        onColumnDelete(column.id);
      }

      setMenuState("closed");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRenameColumn = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/kanban/column/${column.id}/rename`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onColumnRename(res.data); // send updated column back to parent
      setMenuState("closed");
    } catch (err) {
      console.error(err);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const lineHeight = 24;
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;

      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = newHeight + "px";

      // Enable/disable scroll based on content
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  const handleAddCard = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/kanban/column/${column.id}`,
        {
          name: cardName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCardData(res.data);
      setCardName("");
      setShowCreateCard(false);
      console.log(cardData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [cardName]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
        setMenuState("closed");
      }
    };

    if (menuState !== "closed") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuState]);

  return (
    <div className="w-full flex flex-col justify-center gap-1 bg-gray-200 p-2 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-[0.95rem] font-medium ml-3">{column.name}</h4>
        <div className="relative" ref={columnMenuRef}>
          <button
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded-lg cursor-pointer ${
              menuState === "column" || menuState === "rename"
                ? "bg-gray-300"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation;
              setMenuState(menuState === "column" ? "closed" : "column");
            }}
          >
            <LuEllipsis className="text-[1rem]" />
          </button>

          {menuState === "column" && (
            <div className="w-60 absolute right-0 flex flex-col mt-1 bg-white rounded-2xl shadow-lg py-3 z-50 overflow-hidden">
              <h3 className="text-[0.9rem] text-gray-700 text-center font-medium mb-2">
                Column Menu
              </h3>
              <button
                className={`flex px-4 py-1 text-[0.9rem] hover:bg-gray-300 cursor-pointer`}
                onClick={() => {
                  setMenuState("rename");
                }}
              >
                Rename
              </button>
              <button
                className={`flex px-4 py-1 text-[0.9rem] hover:bg-gray-300 cursor-pointer`}
                onClick={handleDeleteColumn}
              >
                Delete
              </button>
            </div>
          )}
          {menuState === "rename" && (
            <div className="w-60 absolute right-0 flex flex-col gap-2 mt-1 bg-white rounded-2xl shadow-lg p-3 z-51">
              <h3 className="text-[0.9rem] text-gray-700 text-center font-medium mb-2">
                Rename Column
              </h3>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1 text-[0.95rem] text-gray-800 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 rounded-lg"
                autoFocus
              />
              <button
                className={`px-4 py-1 text-[0.9rem] text-white bg-gray-800 hover:bg-gray-600 cursor-pointer rounded-lg`}
                onClick={handleRenameColumn}
              >
                Rename
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="flex-shrink-0 w-full">
        {showCreateCard ? (
          <div className="w-full flex flex-col justify-center gap-2 rounded-xl">
            <div className="bg-white border border-gray-400 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-500 focus-within:border-transparent transition-all duration-200">
              <textarea
                ref={textareaRef}
                name="cardName"
                placeholder="Enter card name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                rows={2}
                className="text-[0.95rem] text-gray-800 bg-white px-3 py-1 focus:outline-none resize-none min-h-[2.5rem] max-h-60 overflow-y-auto w-full"
                autoFocus
              />
            </div>
            <div className="w-full flex items-center gap-1">
              <button
                className="text-[0.95rem] text-white bg-gray-800 hover:bg-gray-600 px-3 py-1 rounded-lg cursor-pointer"
                onClick={handleAddCard}
              >
                Add
              </button>
              <button
                className="hover:bg-gray-300 p-2 rounded-lg cursor-pointer"
                onClick={() => setShowCreateCard(false)}
              >
                <LuX className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-2 hover:bg-white p-2 rounded-xl cursor-pointer"
            onClick={() => setShowCreateCard(true)}
          >
            <LuPlus className="w-4 h-4 text-gray-700" strokeWidth={2} />
            <h4 className="text-[0.95rem] text-gray-700">Add a card</h4>
          </button>
        )}
      </div>
    </div>
  );
};

export default ColumnCard;
