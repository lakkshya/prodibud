import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import { LuArrowLeft } from "react-icons/lu";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import MailNavbar from "../components/mail/MailNavbar";
import SentList from "../components/mail/sent/SentList";
import SentFullCard from "../components/mail/sent/SentFullCard";
import MobileSentList from "../components/mail/sent/MobileSentList";

const MailSent = () => {
  const location = useLocation();
  const { id } = useParams();

  const [toast, setToast] = useState(null);
  const [sentMail, setSentMail] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  //fetch sent emails from backend API
  useEffect(() => {
    const fetchMail = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mail/sent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSentMail(res.data);
      } catch (err) {
        console.error("Failed to fetch sent:", err);
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
          `http://localhost:5000/api/mail/sent/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSelectedMail(res.data);
      } catch (err) {
        console.error("Failed to fetch single sent mail:", err);
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
            <SentList data={sentMail} />
          </div>

          <div className="h-full bg-white col-span-5 overflow-y-auto">
            <SentFullCard mail={selectedMail} />
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
              <Link to="/mail/sent" className="flex text-gray-500 p-2 ml-2">
                <LuArrowLeft className="w-5 h-5" />
              </Link>
              <SentFullCard mail={selectedMail} />
            </div>
          ) : (
            <MobileSentList data={sentMail} />
          )}
        </div>
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default MailSent;
