import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import InboxList from "../components/mail/inbox/InboxList";

import MailNavbar from "../components/mail/MailNavbar";
import { LuArrowLeft, LuMenu } from "react-icons/lu";
import MobileMailNavbar from "../components/mail/MobileMailNavbar";
import MobileInboxList from "../components/mail/inbox/MobileInboxList";
import ComposeFullCard from "../components/mail/compose/ComposeFullCard";

const MailCompose = () => {
  return (
    <div className="bg-gold-gradient min-h-screen flex flex-col">
      <Navbar />
      {/* Desktop */}
      <main className="hidden md:block h-[calc(100vh-80px)] p-5">
        <div className="h-full grid grid-cols-10 rounded-4xl overflow-hidden">
          <div className="h-full col-span-2 overflow-y-auto">
            <MailNavbar />
          </div>

          <div className="h-full col-span-8 bg-white overflow-y-auto">
            <ComposeFullCard />
          </div>
        </div>
      </main>

      {/* Mobile */}
      {/* <main className="md:hidden flex flex-col gap-2 p-2">
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
              <Link to="/mail/inbox" className="flex text-gray-500 p-2 ml-2">
                <LuArrowLeft className="w-5 h-5" />
              </Link>
              <InboxFullCard mail={selectedMail} />
            </div>
          ) : inboxMail.length > 0 ? (
            <MobileInboxList data={inboxMail} />
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
      )} */}
    </div>
  );
};

export default MailCompose;
