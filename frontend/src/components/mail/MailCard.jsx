import { useState } from "react";
import { LuChevronDown, LuForward, LuTrash2 } from "react-icons/lu";

const MailCard = () => {
  const [isInfoShowing, setIsInfoShowing] = useState(false);

  return (
    <div className="w-150 flex flex-col gap-5 bg-white p-5">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10">
            <img src="./user.png" alt="User image" className="rounded-full" />
          </div>
          <h3 className="text-[1rem] font-medium">Sender Name</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer">
            <LuForward className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer">
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
          <p className="w-15 text-[0.9rem] text-gray-700">Mail Info</p>
          <LuChevronDown />
        </button>
        {isInfoShowing && (
          <div className="flex flex-col gap-1 p-3">
            <div className="flex">
              <p className="w-15 text-[0.9rem] text-gray-700">From</p>
              <p className="text-[0.9rem]">sender@gmail.com</p>
            </div>
            <div className="flex">
              <p className="w-15 text-[0.9rem] text-gray-700">To</p>
              <p className="text-[0.9rem]">kaiparker.tvd11@gmail.com</p>
            </div>
            <div className="flex">
              <p className="w-15 text-[0.9rem] text-gray-700">Cc</p>
              <p className="text-[0.9rem]">kaiparker.tvd11@gmail.com</p>
            </div>
            <div className="flex">
              <p className="w-15 text-[0.9rem] text-gray-700">Bcc</p>
              <p className="text-[0.9rem]">kaiparker.tvd11@gmail.com</p>
            </div>
            <div className="flex">
              <p className="w-15 text-[0.9rem] text-gray-700">Date</p>
              <p className="text-[0.9rem]">2 Jun 2025, 23:18</p>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-3">
        {/* Subject */}
        <h5>Subject - Reminder for work submission</h5>
        {/* Body */}
        <p className="text-[0.9rem]/6 text-gray-500">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          porro impedit, eius quis placeat omnis tempora ipsum, quaerat, magnam
          nam ab quibusdam facilis? Assumenda dolorum quos, unde at iure
          perferendis dicta exercitationem culpa, inventore nobis aperiam
          pariatur, optio quidem consequatur rem corporis sequi deserunt! Unde
          at nam et sapiente rerum autem quisquam sit sed dolorem repellendus
          assumenda, aspernatur sint inventore sunt velit delectus eos odio
          dolores explicabo molestiae asperiores nulla aliquid. Minima esse
          maxime soluta dicta, nisi, fuga quam eius veniam harum, error possimus
          est natus reiciendis distinctio facere. Incidunt placeat sit labore
          consectetur suscipit quis quos quidem, amet facilis!
        </p>
      </div>
    </div>
  );
};

export default MailCard;
