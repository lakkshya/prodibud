const gradientMap = {
  TEAL_BLUE: "linear-gradient(to top, #37ecba 0%, #72afd3 100%)",
  PURPLE_INDIGO: "linear-gradient(to top, #cc208e 0%, #6713d2 100%)",
  YELLOW_RED: "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)",
  PINK_PEACH: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
  SKY_BLUE: "linear-gradient(to top, #00c6fb 0%, #005bea 100%)",
};

const BoardSmallCard = ({ board }) => {
  return (
    <div className="flex flex-col hover:scale-103 duration-200 rounded-xl overflow-hidden">
      <div
        className={`h-20`}
        style={{ backgroundImage: gradientMap[board.background] }}
      ></div>
      <div className="bg-gray-200 p-2">
        <h3>{board.name}</h3>
      </div>
    </div>
  );
};

export default BoardSmallCard;
