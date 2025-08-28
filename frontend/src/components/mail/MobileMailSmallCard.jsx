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

const MobileMailSmallCard = ({ mail }) => {
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

  const getFormattedTimeOrDate = (updatedAt) => {
    const now = new Date();
    const created = new Date(updatedAt);
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
    <div className="flex justify-center gap-3 bg-white hover:scale-103 duration-200 p-3 rounded-xl border border-gray-200 shadow-xs">
      {/* Image */}
      <div
        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[0.9rem]"
        style={{ backgroundColor: bgColor }}
      >
        {getInitials(mail.sender?.name)}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-[0.9rem] md:text-[1rem] font-medium">
          {mail.sender.name}
        </h3>
        <p className="text-[0.825rem] md:text-[0.875rem] text-gray-500 line-clamp-2">
          {mail.subject}
        </p>
      </div>
      <div>
        <p className="text-[0.75rem] md:text-[0.8rem]">
          {getFormattedTimeOrDate(mail.updatedAt)}
        </p>
      </div>
    </div>
  );
};

export default MobileMailSmallCard;
