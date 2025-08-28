import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import InboxList from "../components/mail/inbox/InboxList";
import InboxFullCard from "../components/mail/inbox/InboxFullCard";
import MailNavbar from "../components/mail/MailNavbar";
import { LuArrowLeft } from "react-icons/lu";
import MobileInboxList from "../components/mail/inbox/MobileInboxList";

const MailInbox = () => {
  const location = useLocation();
  const { id } = useParams();

  const [toast, setToast] = useState(null);
  const [inboxMail, setInboxMail] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  //fetch trash emails from backend API
  useEffect(() => {
    const fetchMail = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mail/inbox", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setInboxMail(res.data);
      } catch (err) {
        console.error("Failed to fetch inbox:", err);
      }
    };

    fetchMail();
  }, [location]);

  //fetch particular trash email from backend API
  useEffect(() => {
    const fetchSingleMail = async () => {
      if (!id) {
        setSelectedMail(null);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/mail/inbox/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSelectedMail(res.data);
      } catch (err) {
        console.error("Failed to fetch single mail:", err);
      }
    };

    fetchSingleMail();
  }, [id]);

  //show toast
  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const hideToast = () => setToast(null);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* Desktop */}
      <main className="hidden md:block h-[calc(100vh-80px)] p-5">
        <div className="h-full grid grid-cols-10 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
          <div className="col-span-2 overflow-y-auto">
            <MailNavbar />
          </div>

          <div className="h-full bg-gray-100 col-span-3 overflow-y-auto">
            <InboxList data={inboxMail} />
          </div>

          <div className="h-full bg-white col-span-5 overflow-y-auto">
            <InboxFullCard mail={selectedMail} />
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
              <Link to="/mail/inbox" className="flex text-gray-500 p-2 ml-2">
                <LuArrowLeft className="w-5 h-5" />
              </Link>
              <InboxFullCard mail={selectedMail} />
            </div>
          ) : (
            <MobileInboxList data={inboxMail} />
          )}
        </div>
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default MailInbox;
