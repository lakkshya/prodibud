import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast";
import MailNavbar from "../../components/mail/MailNavbar";
import { LuArrowLeft } from "react-icons/lu";
import MobileTrashList from "../../components/mail/trash/MobileTrashList";
import TrashList from "../../components/mail/trash/TrashList";
import TrashFullCard from "../../components/mail/trash/TrashFullCard";

const Trash = () => {
  const location = useLocation();
  const { id } = useParams();

  const [toast, setToast] = useState(null);
  const [trashMail, setTrashMail] = useState([]);
  const [selectedTrashMail, setSelectedTrashMail] = useState(null);

  //fetch trash emails from backend API
  useEffect(() => {
    const fetchTrashMail = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mail/trash", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTrashMail(res.data);
      } catch (err) {
        console.error("Failed to fetch trash:", err);
      }
    };

    fetchTrashMail();
  }, [location]);

  //fetch particular trash email from backend API
  useEffect(() => {
    const fetchSingleTrashMail = async () => {
      if (!id) {
        setSelectedTrashMail(null);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/mail/trash/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSelectedTrashMail(res.data);
      } catch (err) {
        console.error("Failed to fetch single trash mail:", err);
      }
    };

    fetchSingleTrashMail();
  }, [id]);

  //show toast
  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
    }

    window.history.replaceState({}, document.title);
  }, [location.state]);

  const hideToast = () => setToast(null);

  return (
    <div className="bg-gold-gradient min-h-screen flex flex-col">
      <Navbar />
      {/* Desktop */}
      <main className="hidden md:block h-[calc(100vh-80px)] p-5">
        <div className="h-full grid grid-cols-10 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
          <div className="col-span-2 overflow-y-auto">
            <MailNavbar />
          </div>

          <div className="h-full bg-gray-100 col-span-3 overflow-y-auto">
            <TrashList data={trashMail} />
          </div>

          <div className="h-full bg-white col-span-5 overflow-y-auto">
            <TrashFullCard mail={selectedTrashMail} />
          </div>
        </div>
      </main>

      {/* Mobile */}
      <main className="md:hidden flex flex-col gap-2 p-2">
        <div
          className={`h-[calc(100vh-108px)] overflow-y-auto ${
            id ? "rounded-xl border border-gray-200 shadow-xs" : ""
          }`}
        >
          {id ? (
            <div className="bg-white py-2">
              <Link to="/mail/trash" className="flex text-gray-500 p-2 ml-2">
                <LuArrowLeft className="w-5 h-5" />
              </Link>
              <TrashFullCard mail={selectedTrashMail} />
            </div>
          ) : (
            <MobileTrashList data={trashMail} />
          )}
        </div>
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Trash;
