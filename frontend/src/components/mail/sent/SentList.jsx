import { Link } from "react-router-dom";
import MailSmallCard from "../MailSmallCard";
import { LuSearch } from "react-icons/lu";

const SentList = ({ data }) => {
  if (data.length===0) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-100 p-6 text-gray-500">
        <p>Your sent is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 bg-gray-100 p-5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <LuSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Search"
          className="w-full bg-white text-gray-900 pl-12 py-2 rounded-xl border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        {data.map((mail) => (
          <Link to={`/mail/sent/${mail.id}`} key={mail.id}>
            <MailSmallCard mail={mail} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SentList;
