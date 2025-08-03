import { Link } from "react-router-dom";

const InboxCard = ({ mail }) => {
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    const initials = parts.map((p) => p[0].toUpperCase()).join("");
    return initials.slice(0, 2);
  };

  const getFormattedTimeOrDate = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMins = now - created;
    const diffInHours = diffInMins / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return created.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      return created.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <Link to={`/mail/inbox/${mail.id}`} className="flex justify-center gap-3 bg-white hover:scale-103 duration-200 p-5 rounded-xl">
      {/* Image */}
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
        {getInitials(mail.sender?.name)}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-[1rem] font-medium">{mail.sender.name}</h3>
        <p className="text-[0.875rem] text-gray-500 line-clamp-2">
          {mail.subject}
        </p>
      </div>
      <div>
        <p className="text-[0.8rem]">
          {getFormattedTimeOrDate(mail.createdAt)}
        </p>
      </div>
    </Link>
  );
};

export default InboxCard;
