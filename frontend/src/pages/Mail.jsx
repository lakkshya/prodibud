import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import Inbox from "../components/mail/Inbox";
import MailCard from "../components/mail/MailCard";

const Mail = () => {
  const location = useLocation();
  const [toast, setToast] = useState(null);

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
      <main className="flex py-5">
        <Inbox />
        <MailCard />
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Mail;
