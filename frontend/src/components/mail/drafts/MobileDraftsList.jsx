import { Link } from "react-router-dom";
import MobileMailSmallCard from "../MobileMailSmallCard";

const MobileDraftsList = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-100 p-6 text-gray-500">
        <p>Your darfts is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {data.map((mail) => (
          <Link to={`/mail/drafts/${mail.id}`} key={mail.id}>
            <MobileMailSmallCard mail={mail} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileDraftsList;
