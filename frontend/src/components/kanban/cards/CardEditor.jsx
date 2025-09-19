import { useEffect, useState } from "react";
import axios from "axios";
import {
  LuCalendar,
  LuChevronDown,
  LuTrash2,
  LuX,
} from "react-icons/lu";

const CardEditor = ({ card, onClose, onUpdate, onCardDelete }) => {
  const toDateInputValue = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const toISOString = (dateString) => {
    return dateString ? new Date(dateString).toISOString() : null;
  };

  const [title, setTitle] = useState(card.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [description, setDescription] = useState(card.description);
  const [columnId, setColumnId] = useState(card.columnId);
  const [position, setPosition] = useState(card.position || 0);
  const [dueDate, setDueDate] = useState(toDateInputValue(card.dueDate));
  const [members, setMembers] = useState(card.members || []);
  const [allMembers, setAllMembers] = useState([]);

  // Fetch available members (e.g., board users)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/kanban/board/${card.column.boardId}/members`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAllMembers(res.data);
      } catch (err) {
        console.error("Failed to load members:", err);
      }
    };

    fetchMembers();
  }, [card.column.boardId]);

  // Save card to backend
  const handleSave = async () => {
    try {
      const formattedDueDate = toISOString(dueDate);

      const res = await axios.put(
        `http://localhost:5000/api/kanban/card/${card.id}/update`,
        {
          title,
          description,
          dueDate: formattedDueDate,
          columnId,
          position,
          members: members.map((m) => m.id), // only send IDs
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onUpdate(res.data);
    } catch (err) {
      console.error("Failed to save card:", err);
    }
  };

  // Delete card
  const handleDeleteCard = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/kanban/card/${card.id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (onCardDelete) {
        onCardDelete(card.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle member assignment
  const toggleMember = (member) => {
    setMembers((prev) =>
      prev.find((m) => m.id === member.id)
        ? prev.filter((m) => m.id !== member.id)
        : [...prev, member]
    );
  };

  // Input blur (save title inline)
  const handleBlur = () => {
    setIsEditing(false);
    onUpdate({ title, completed: isCompleted });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gray-50">
        <button className="flex items-center gap-2 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 transition-colors">
          <span className="text-sm font-medium text-gray-700">
            {card.column.name}
          </span>
          <LuChevronDown size={16} />
        </button>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-[0.9rem] font-medium text-white rounded-lg transition-colors cursor-pointer"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors cursor-pointer"
            onClick={handleDeleteCard}
            title="Delete card"
          >
            <LuTrash2 />
          </button>
          <button
            className="p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            title="Close"
          >
            <LuX />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 px-6 py-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Title */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => {
                setIsCompleted(!isCompleted);
                onUpdate({ title, completed: !isCompleted });
              }}
              className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />

            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1 text-xl font-semibold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 focus:rounded px-2 py-1"
              />
            ) : (
              <h1
                onClick={() => setIsEditing(true)}
                className={`flex-1 text-xl font-semibold cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors ${
                  isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                }`}
              >
                {title || "Untitled Card"}
              </h1>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LuCalendar size={16} />
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Add a description to this card..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Members */}
        <div className="w-80 space-y-2">
          <label className="text-sm font-medium text-gray-700">Members</label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allMembers.length > 0 ? (
                allMembers.map((member) => {
                  const user = member.user; // extract user details

                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => toggleMember(user)}
                    >
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={members.some((m) => m.id === user.id)}
                        onChange={() => toggleMember(user)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No members available
                </p>
              )}
            </div>

            {members.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No members assigned
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
