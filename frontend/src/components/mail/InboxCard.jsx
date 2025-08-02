const InboxCard = () => {
  return (
    <div className="flex justify-center gap-3 bg-white p-5 rounded-xl">
      {/* Image */}
      <div className="w-25">
        <img src="./user.png" alt="User image" className="rounded-full" />
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[1rem] font-medium">Sender Name</h3>
        <p className="text-[0.875rem] text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
          possimus.
        </p>
      </div>
      <div>
        <p className="text-[0.8rem]">18:25</p>
      </div>
    </div>
  );
};

export default InboxCard;
