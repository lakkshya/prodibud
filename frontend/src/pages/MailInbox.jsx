import axios from "axios";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import Inbox from "../components/mail/Inbox";
import MailCard from "../components/mail/MailCard";
import MailNavbar from "../components/mail/MainNavbar";

const MailInbox = () => {
  const location = useLocation();
  const [toast, setToast] = useState(null);

  const [inboxMail, setInboxMail] = useState([]);

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
    if (location.state?.toast) {
      setToast(location.state.toast);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const hideToast = () => setToast(null);

  return (
    <div className="bg-gold-gradient min-h-screen">
      <Navbar />
      <main className="flex justify-center px-4 py-5">
        <MailNavbar />
        {inboxMail.length > 0 ? (
          <Inbox data={inboxMail} />
        ) : (
          <p>Your inbox is empty</p>
        )}
        <MailCard />
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default MailInbox;
