import { useEffect } from "react";
import { LuX } from "react-icons/lu";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex justify-between items-stretch gap-5 border shadow-lg transition-all duration-300 ${
        type === "Success"
          ? "bg-green-100 text-green-500 border-green-500"
          : "bg-red-100 text-red-500 border-red-500"
      }`}
    >
      <div className="px-4 py-2">{message}</div>
      <button
        className={`px-4 ${
          type === "Success" ? "hover:bg-green-300" : "hover:bg-red-300"
        }`}
        onClick={onClose}
      >
        <LuX />
      </button>
    </div>
  );
};

export default Toast;
