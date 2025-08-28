import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { LuSearch } from "react-icons/lu";
import MailSmallCard from "../MailSmallCard";

const TrashList = ({ data }) => {
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
            <MailSmallCard mail={mail} />
          </Link>
        ))}
      </div>
    );
  };

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
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-white text-gray-900 pl-12 py-2 rounded-xl border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
        />
      </div>

      {renderContent()}
    </div>
  );
};

export default TrashList;
