import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BoardSmallCard from "./BoardSmallCard";

const BoardsFullCard = () => {
  const [boardsData, setBoardsData] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/kanban/boards", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setBoardsData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5 bg-white px-5 py-2 md:py-5">
      {/* All boards */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[1rem] font-medium">All Boards</h3>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {boardsData.map((board) => (
            <Link to={`/kanban/board/${board.id}`} key={board.id}>
              <BoardSmallCard board={board} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardsFullCard;
