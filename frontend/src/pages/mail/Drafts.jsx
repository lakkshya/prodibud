import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast";
import DraftsFullCard from "../../components/mail/drafts/DraftsFullCard";
import MailNavbar from "../../components/mail/MailNavbar";
import { LuArrowLeft } from "react-icons/lu";
import DraftsList from "../../components/mail/drafts/DraftsList";
import MobileDraftsList from "../../components/mail/drafts/MobileDraftsList";

const Drafts = () => {
  const location = useLocation();
  const { id } = useParams();

  const [toast, setToast] = useState(null);
  const [draftsMail, setDraftsMail] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);

  //fetch draft emails from backend API
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mail/drafts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setDraftsMail(res.data);
      } catch (err) {
        console.error("Failed to fetch inbox:", err);
      }
    };

    fetchDrafts();
  }, [location]);

  //fetch particular draft email from backend API
  useEffect(() => {
    const fetchSingleDraft = async () => {
      if (!id) {
        setSelectedDraft(null);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/mail/draft/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSelectedDraft(res.data);
      } catch (err) {
        console.error("Failed to fetch single draft:", err);
      }
    };

    fetchSingleDraft();
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
    <div className="bg-gold-gradient min-h-screen flex flex-col">
      <Navbar />
      {/* Desktop */}
      <main className="hidden md:block h-[calc(100vh-80px)] p-5">
        <div className="h-full grid grid-cols-10 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
          <div className="col-span-2 overflow-y-auto">
            <MailNavbar />
          </div>

          <div className="h-full bg-gray-100 col-span-3 overflow-y-auto">
            <DraftsList data={draftsMail} />
          </div>

          <div className="h-full bg-white col-span-5 overflow-y-auto">
            <DraftsFullCard mail={selectedDraft} />
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
              <Link to="/mail/drafts" className="flex text-gray-500 p-2 ml-2">
                <LuArrowLeft className="w-5 h-5" />
              </Link>
              <DraftsFullCard mail={selectedDraft} />
            </div>
          ) : (
            <MobileDraftsList data={draftsMail} />
          )}
        </div>
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Drafts;
