import { LuAlarmClock } from "react-icons/lu";

const CardBox = ({ card }) => {
  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return "";

    const today = new Date();
    const target = new Date(dueDate);

    // Difference in milliseconds
    const diffMs = target - today;

    // Convert ms → days
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `${diffDays} days`;
    if (diffDays === 1) return `${diffDays} day`;
    if (diffDays === 0) return "Due today";
    return `Missed`;
  };

  return (
    <div className="w-full flex flex-col justify-center gap-3 bg-white p-3 rounded-xl">
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <h5 className="text-[0.9rem] text-left text-gray-700 font-semibold">
            {card.title}
          </h5>
        </div>
        <p className="text-[0.9rem] text-left text-gray-500">
          {card.description}
        </p>
        <div className="flex items-center gap-1">
          <LuAlarmClock className="w-4 h-4 text-gray-500" />
          <p className="text-[0.9rem] text-left text-gray-500">
            {card.dueDate ? getDaysRemaining(card.dueDate) : "No deadline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardBox;
