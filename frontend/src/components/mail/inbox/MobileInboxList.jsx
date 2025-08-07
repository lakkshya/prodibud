import { Link } from "react-router-dom";
import MobileMailSmallCard from "../MobileMailSmallCard";

const MobileInboxList = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {data.map((mail) => (
          <Link to={`/mail/inbox/${mail.id}`} key={mail.id}>
            <MobileMailSmallCard mail={mail} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileInboxList;
