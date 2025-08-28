import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { LuMenu } from "react-icons/lu";
import MobileMailNavbar from "../MobileMailNavbar";
import MobileMailSmallCard from "../MobileMailSmallCard";

const MobileTrashList = ({ data }) => {
  const [isMobileMailNavOpen, setIsMobileMailNavOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(data);

  const fetchResults = useCallback(
    async (value) => {
      if (value.trim() === "") {
        setResults(data);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/search/trash", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { query: value },
        });

        setResults(res.data);
      } catch (error) {
        console.error("Search failed:", error);
      }
    },
    [data] // refetch logic depends on current trash
  );

  // memoized debounced version of fetchResults
  const debouncedSearch = useMemo(
    () => debounce(fetchResults, 500),
    [fetchResults] // re-create if trash data changes
  );

  const handleSearch = (value) => {
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    // When `data` changes (fresh trash load), reset results
    setResults(data);
  }, [data]);

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const renderContent = () => {
    if (!data || data.length === 0) {
      // trash is totally empty
      return (
        <div className="flex justify-center items-center p-6 text-gray-500">
          <p>Your trash is empty</p>
        </div>
      );
    }

    if (results.length === 0 && query.trim() !== "") {
      // search returned no matches
      return (
        <div className="flex justify-center items-center p-6 text-gray-500">
          <p>No emails match your search</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {results.map((mail) => (
          <Link to={`/mail/trash/${mail.id}`} key={mail.id}>
            <MobileMailSmallCard mail={mail} />
          </Link>
        ))}
      </div>
    );
  };

  //mobile mail navbar
  useEffect(() => {
    if (isMobileMailNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMailNavOpen]);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex justify-between gap-2 bg-blue-100 p-2 rounded-xl">
        <button
          onClick={() => setIsMobileMailNavOpen(true)}
          className="flex-1 rounded-full px-2 cursor-pointer"
        >
          <LuMenu className="w-5 h-5 text-gray-400" />
        </button>
        <div className="w-full">
          <input
            type="text"
            name="search"
            placeholder="Search in emails"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full text-gray-900 py-1 focus:outline-none"
          />
        </div>
      </div>

      {renderContent()}

      {isMobileMailNavOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileMailNavOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-8/10 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMailNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MobileMailNavbar />
      </div>
    </div>
  );
};

export default MobileTrashList;
