const TopBar = () => {
  return (
    <div className="flex justify-end gap-3">
      <div className="w-3/5 grid grid-cols-3 gap-5 bg-white !p-2 rounded-4xl">
        <div className="flex justify-center">
          <h1>Mail</h1>
        </div>
        <div className="flex justify-center">
          <h1>Kanban</h1>
        </div>
        <div className="flex justify-center">
          <h1>Calendar</h1>
        </div>
      </div>

      <div className="bg-white !p-2 rounded-4xl">
        <h1>Profile</h1>
      </div>
    </div>
  );
};

export default TopBar;
