import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Inbox from "../components/mail/Inbox";
import MailCard from "../components/mail/MailCard";
import MailNavbar from "../components/mail/MailNavbar";
import { LuArrowLeft, LuChevronLeft, LuMenu } from "react-icons/lu";
import MobileMailNavbar from "../components/mail/MobileMailNavbar";
import MobileInbox from "../components/mail/MobileInbox";

const MailInbox = () => {
  const location = useLocation();
  const { id } = useParams();

  const [toast, setToast] = useState(null);
  const [inboxMail, setInboxMail] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  const [isMobileMailNavOpen, setIsMobileMailNavOpen] = useState(false);

  useEffect(() => {
    const fetchMail = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mail/inbox", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Fetched inbox:", res.data);
        setInboxMail(res.data);
      } catch (err) {
        console.error("Failed to fetch inbox:", err);
      }
    };

    fetchMail();
  }, []);

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

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (isMobileMailNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMailNavOpen]);

  const hideToast = () => setToast(null);

  return (
    <div className="bg-gold-gradient min-h-screen flex flex-col">
      <Navbar />
      {/* Desktop */}
      <main className="hidden md:block h-[calc(100vh-80px)] p-5">
        <div className="h-full grid grid-cols-10 rounded-4xl overflow-hidden">
          <div className="col-span-2 overflow-y-auto">
            <MailNavbar />
          </div>

          <div className="col-span-3 overflow-y-auto">
            {inboxMail.length > 0 ? (
              <Inbox data={inboxMail} />
            ) : (
              <p>Your inbox is empty</p>
            )}
          </div>

          <div className="col-span-5 overflow-y-auto">
            <MailCard mail={selectedMail} />
          </div>
        </div>
      </main>

      {/* Mobile */}
      <main className="md:hidden flex flex-col gap-2 p-2">
        <div className="flex justify-between gap-2 bg-white p-2 rounded-xl">
          <button
            onClick={() => setIsMobileMailNavOpen(true)}
            className="flex-1 bg-white rounded-full px-2 cursor-pointer"
          >
            <LuMenu className="w-5 h-5 text-gray-400" />
          </button>
          <div className="w-full">
            <input
              type="text"
              name="search"
              placeholder="Search in emails"
              className="w-full text-gray-900 py-1 focus:outline-none"
            />
          </div>
        </div>

        <div className="h-[calc(100vh-108px)] overflow-y-auto">
          {id ? (
            <div className="bg-white rounded-xl py-2">
              <Link
                to="/mail/inbox"
                className="flex text-gray-500 p-2 ml-2"
              >
                <LuArrowLeft className="w-5 h-5"/>
              </Link>
              <MailCard mail={selectedMail} />
            </div>
          ) : inboxMail.length > 0 ? (
            <MobileInbox data={inboxMail} />
          ) : (
            <p>Your inbox is empty</p>
          )}
        </div>
      </main>
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
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default MailInbox;
