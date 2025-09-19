import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LuEllipsis, LuPlus, LuX } from "react-icons/lu";
import ColumnCard from "../column/ColumnCard";
import CardEditor from "../cards/CardEditor";

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
  const columnMenuRef = useRef();
  const textareaRef = useRef(null);

  const [boardData, setBoardData] = useState({});
  const [columnData, setColumnData] = useState([]);
  const [cardData, setCardData] = useState([]);

  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [menuState, setMenuState] = useState({
    columnId: null,
    state: "closed",
  });

  const [columnName, setColumnName] = useState("");

  const [cardDetails, setCardDetails] = useState({
    name: "",
    description: "",
    dueDate: "",
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  //board and card
  useEffect(() => {
    const fetchBoardAndCards = async () => {
      try {
        const [boardRes, cardsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/kanban/board/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`http://localhost:5000/api/kanban/board/${id}/cards`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setBoardData(boardRes.data);
        setCardData(cardsRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoardAndCards();
  }, [id]);

  const handleInviteMembers = async () => {};

  //column
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

      setColumnData((prev) => [...prev, res.data]);
      setColumnName("");
      setShowCreateColumn(false);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Delete column
  const handleDeleteColumn = async (columnId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/kanban/column/${columnId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setColumnData((prev) => prev.filter((col) => col.id !== columnId));
      setMenuState("closed");
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Rename column
  const handleRenameColumn = async (columnId, newColumnName) => {
    if (!newColumnName.trim()) return; // prevent empty name

    try {
      const res = await axios.put(
        `http://localhost:5000/api/kanban/column/${columnId}/rename`,
        { name: newColumnName.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setColumnData((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, name: res.data.name } : col
        )
      );
      setMenuState("closed");
    } catch (err) {
      console.error(err);
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

  // ✅ Add card
  const handleAddCard = async (columnId) => {
    if (!cardDetails.name.trim()) return; // prevent empty title

    try {
      const res = await axios.post(
        `http://localhost:5000/api/kanban/column/${columnId}/card`,
        {
          title: cardDetails.name.trim(),
          description: cardDetails.description || "",
          dueDate: cardDetails.dueDate
            ? new Date(cardDetails.dueDate).toISOString()
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCardData((prev) => [...prev, res.data]);
      setCardDetails({ name: "", description: "", dueDate: null });
      setActiveColumn(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Auto-resize textarea in CardCreator
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const lineHeight = 24;
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;

      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = newHeight + "px";

      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [cardDetails.name]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boardMenuRef.current && !boardMenuRef.current.contains(e.target)) {
        setIsBoardMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Close menu when clicking outside
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
                menuState={menuState}
                setMenuState={setMenuState}
                columnMenuRef={columnMenuRef}
                handleDeleteColumn={handleDeleteColumn}
                handleRenameColumn={handleRenameColumn}
                textareaRef={textareaRef}
                cardData={cardData.filter((card) => card.columnId === col.id)}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                handleAddCard={handleAddCard}
                onCardClick={(card) => setSelectedCard(card)}
                activeColumn={activeColumn}
                setActiveColumn={setActiveColumn}
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
      {selectedCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-2/3 h-2/3 bg-white rounded-2xl shadow-xl">
            <CardEditor
              card={selectedCard}
              onClose={() => setSelectedCard(null)}
              onCardDelete={(deletedId) =>
                setCardData((prev) => prev.filter((c) => c.id !== deletedId))
              }
              columns={columnData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBoardsFullCard;
