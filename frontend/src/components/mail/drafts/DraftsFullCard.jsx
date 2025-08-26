import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LuChevronDown,
  LuChevronUp,
  LuTrash2,
  LuArrowDownToLine,
} from "react-icons/lu";

const COLORS = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
];

const DraftsFullCard = ({ mail }) => {
  const navigate = useNavigate();

  const [isInfoShowing, setIsInfoShowing] = useState(false);

  if (!mail) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-white p-6 text-gray-500">
        <p>Click on a mail to view</p>
      </div>
    );
  }

  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  const bgColor = getColorFromName(mail.sender.name);

  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    const initials = parts.map((p) => p[0].toUpperCase()).join("");
    return initials.slice(0, 2);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleEditDraft = () => {
    navigate("/mail/compose", { state: { draft: mail } });
  };

  const moveToTrash = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/mail/draft/${mail.id}/delete`,
        {}, // body is empty, but axios requires a second param before headers
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/mail/drafts", {
        state: {
          toast: { message: "Draft moved to trash", type: "Success" },
        },
      });
    } catch (error) {
      console.error("Failed to move to trash", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 bg-white px-5 py-2 md:py-5">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-[0.9rem]"
            style={{ backgroundColor: bgColor }}
          >
            {getInitials(mail.sender?.name)}
          </div>
          <h3 className="text-[1rem] font-medium">{mail.sender.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEditDraft}
            className="flex justify-center items-center bg-amber-400 hover:bg-gray-200 px-4 py-2 rounded-2xl cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={moveToTrash}
            className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="flex flex-col gap-1 border border-gray-300 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsInfoShowing((prev) => !prev)}
          className={`flex justify-between items-center bg-gray-50 hover:bg-gray-100 border-gray-300 p-3 cursor-pointer ${
            isInfoShowing ? "border-b rounded-t-xl" : "rounded-xl"
          }`}
        >
          <p className="text-[0.9rem] text-gray-700">Mail Info</p>
          {isInfoShowing ? <LuChevronUp /> : <LuChevronDown />}
        </button>
        {isInfoShowing && (
          <div className="flex flex-col gap-1 p-3">
            <div className="flex">
              <p className="w-16 text-[0.9rem] text-gray-700">From</p>
              <p className="text-[0.9rem]">{mail.sender.email}</p>
            </div>
            <div className="flex">
              <p className="w-16 text-[0.9rem] text-gray-700">To</p>
              <p className="text-[0.9rem]">
                {mail.draftRecipients.map((r) => r.email)}
              </p>
            </div>
            <div className="flex">
              <p className="w-16 text-[0.9rem] text-gray-700">Cc</p>
              <p className="text-[0.9rem]">
                {mail.draftCC.map((r) => r.email)}
              </p>
            </div>
            <div className="flex">
              <p className="w-16 text-[0.9rem] text-gray-700">Date</p>
              <p className="text-[0.9rem]">{formatDate(mail.createdAt)}</p>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-3">
        {/* Subject */}
        <h5>Subject - {mail.subject}</h5>
        {/* Body */}
        <p className="text-[1rem]/6 text-gray-500">{mail.body}</p>
      </div>
      {/* Attachments */}
      <div className="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {mail.draftAttachments?.map((file, index) => (
          <div
            key={
              file.public_id ||
              file.tempId ||
              `attachment-${index}-${file.filename}`
            }
            className="relative bg-gray-100 rounded-lg border border-gray-300 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-1">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-[1rem] text-blue-600 hover:text-gray-500"
              >
                {file.filename || file.url.split("/").pop()}
              </a>
              <a
                href={file.url.replace("/upload/", "/upload/fl_attachment/")}
                className="text-[1rem] text-blue-600 hover:text-gray-500"
              >
                <LuArrowDownToLine />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftsFullCard;
