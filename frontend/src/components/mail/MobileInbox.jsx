import MobileInboxCard from "./MobileInboxCard";

const MobileInbox = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {data.map((mail) => (
          <MobileInboxCard key={mail.id} mail={mail} />
        ))}
      </div>
    </div>
  );
};

export default MobileInbox;
