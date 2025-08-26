import { LuX } from "react-icons/lu";

const Popup = ({ title, message, actions, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] md:w-[400px] relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <LuX />
        </button>

        {/* Title */}
        {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}

        {/* Message */}
        {message && <p className="text-gray-600 mb-6">{message}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {actions?.map((action, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-lg ${action.className}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
