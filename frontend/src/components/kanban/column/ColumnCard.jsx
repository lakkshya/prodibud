import { LuEllipsis, LuPlus, LuX } from "react-icons/lu";
import CardBox from "../cards/CardBox";
import { useState } from "react";

const ColumnCard = ({
  column,
  menuState,
  setMenuState,
  columnMenuRef,
  handleDeleteColumn,
  handleRenameColumn,
  textareaRef,
  cardData,
  cardDetails,
  setCardDetails,
  handleAddCard,
  onCardClick,
  activeColumn,
  setActiveColumn,
}) => {
  const [newColumnName, setNewColumnName] = useState(column.name);

  return (
    <div className="w-full flex flex-col justify-center gap-1 bg-gray-200 p-2 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-[0.95rem] font-medium ml-3">{column.name}</h4>
        <div className="relative" ref={columnMenuRef}>
          <button
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded-lg cursor-pointer ${
              menuState.columnId === column.id &&
              (menuState.state === "column" || menuState.state === "rename")
                ? "bg-gray-300"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuState((prev) =>
                prev.columnId === column.id && prev.state === "column"
                  ? { columnId: null, state: "closed" }
                  : { columnId: column.id, state: "column" }
              );
            }}
          >
            <LuEllipsis className="text-[1rem]" />
          </button>

          {/* Column menu */}
          {menuState.columnId === column.id && menuState.state === "column" && (
            <div className="w-60 absolute right-0 flex flex-col mt-1 bg-white rounded-2xl shadow-lg py-3 z-50 overflow-hidden">
              <h3 className="text-[0.9rem] text-gray-700 text-center font-medium mb-2">
                Column Menu
              </h3>
              <button
                className="flex px-4 py-1 text-[0.9rem] hover:bg-gray-300 cursor-pointer"
                onClick={() =>
                  setMenuState({ columnId: column.id, state: "rename" })
                }
              >
                Rename
              </button>
              <button
                className="flex px-4 py-1 text-[0.9rem] hover:bg-gray-300 cursor-pointer"
                onClick={() => handleDeleteColumn(column.id)}
              >
                Delete
              </button>
            </div>
          )}

          {/* Rename input */}
          {menuState.columnId === column.id && menuState.state === "rename" && (
            <div className="w-60 absolute right-0 flex flex-col gap-2 mt-1 bg-white rounded-2xl shadow-lg p-3 z-50">
              <h3 className="text-[0.9rem] text-gray-700 text-center font-medium mb-2">
                Rename Column
              </h3>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full px-3 py-1 text-[0.95rem] text-gray-800 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
                autoFocus
              />
              <button
                className="px-4 py-1 text-[0.9rem] text-white bg-gray-800 hover:bg-gray-600 cursor-pointer rounded-lg"
                onClick={() => handleRenameColumn(column.id, newColumnName)}
              >
                Rename
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-shrink-0 w-full">
        {cardData.length > 0 &&
          cardData.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0 w-full hover:scale-[1.02] cursor-pointer transition-transform"
              onClick={() => onCardClick(card)}
            >
              <CardBox card={card} />
            </div>
          ))}

        {activeColumn === column.id ? (
          <div className="w-full flex flex-col justify-center gap-2 bg-white p-3 rounded-xl">
            <input
              name="cardName"
              placeholder="Enter card name"
              maxLength="25"
              value={cardDetails.name || ""}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, name: e.target.value })
              }
              className="text-[0.95rem] text-gray-800 bg-white px-3 py-1 border border-gray-400 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-500 focus-within:border-transparent transition-all duration-200 focus:outline-none"
              autoFocus
            />
            <div className="bg-white border border-gray-400 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-500 focus-within:border-transparent transition-all duration-200">
              <textarea
                ref={textareaRef}
                name="cardDescription"
                placeholder="Enter card description"
                value={cardDetails.description || ""}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    description: e.target.value,
                  })
                }
                rows={2}
                className="text-[0.95rem] text-gray-800 bg-white px-3 py-1 focus:outline-none resize-none min-h-[2.5rem] max-h-60 overflow-y-auto w-full"
              />
            </div>
            <input
              type="date"
              name="dueDate"
              value={cardDetails.dueDate || ""}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, dueDate: e.target.value })
              }
              className="text-[0.95rem] text-gray-800 bg-white px-3 py-1 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-gray-500 focus-within:border-transparent transition-all duration-200 focus:outline-none"
            />
            <div className="w-full flex items-center gap-1">
              <button
                className="text-[0.95rem] text-white bg-gray-800 hover:bg-gray-600 px-3 py-1 rounded-lg cursor-pointer"
                onClick={() => handleAddCard(column.id)}
              >
                Add
              </button>
              <button
                className="hover:bg-gray-300 p-2 rounded-lg cursor-pointer"
                onClick={() => setActiveColumn(null)}
              >
                <LuX className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-2 hover:bg-white p-2 rounded-xl cursor-pointer"
            onClick={() => setActiveColumn(column.id)}
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
