const Inbox = () => {
  return (
    <div className="bg-white/70 rounded-4xl">
      <div className="flex p-5">
        <input
          type="text"
          placeholder="Search"
          name="searchBar"
          id="searchBar"
          className="bg-white rounded-4xl p-2"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-1 flex justify-center">
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div className="col-span-3">Title</div>
        <div className="col-span-5">Subject</div>
        <div className="col-span-3 flex gap-2 justify-end">
          <button className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
            Reply
          </button>
          <button className="px-2 py-1 bg-green-500 text-white text-xs rounded">
            Archive
          </button>
          <button className="px-2 py-1 bg-red-500 text-white text-xs rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
