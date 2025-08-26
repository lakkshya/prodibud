import { MdEmail, MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="md:min-h-screen bg-gradient-to-br from-blue-300 via-blue-500 to-blue-800 relative overflow-hidden">
        <div className="relative flex flex-col items-center gap-10 md:gap-8 px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Brand */}
          <img
            src="./logo.png"
            alt="Prodibud Logo"
            className="max-w-6/10 md:max-w-1/4"
          />
          {/* Content */}
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="w-7/10 md:w-full text-[2.6rem]/14 md:text-[4rem] font-semibold">
              Email Meets Productivity
            </h1>
            <p className="w-7/10 text-[1.2rem]">
              Combine powerful email with Kanban boards. Perfect for
              professionals who need to stay organized.
            </p>
          </div>
          {/* CTA */}
          <div className="w-7/10 md:w-1/3 flex flex-col md:flex-row items-center justify-center gap-5 mt-5">
            <button
              onClick={() => navigate("/login")}
              className="w-full px-6 py-2 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-blue-500 cursor-pointer transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full px-6 py-2 bg-black text-blue-500 border-2 border-black rounded-full font-semibold hover:bg-transparent hover:text-black cursor-pointer transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-gray-900 mb-4">
              Why Prodibud?
            </h2>
            <p className="text-[1.1rem] text-gray-600">
              The only platform that combines email and task management in one
              place.
            </p>
          </div>

          <div className="w-full md:w-7/10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="text-blue-600 mb-4">
                <MdEmail className="w-10 h-10" />
              </div>
              <h3 className="text-[1.2rem] font-bold text-gray-900 mb-3">
                Professional Email
              </h3>
              <p className="text-[1rem] text-gray-600">
                Full-featured email client with all the tools you need. Clean
                interface, powerful search, and reliable delivery.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-sky-500">
              <div className="text-sky-600 mb-4">
                <MdDashboard className="w-10 h-10" />
              </div>
              <h3 className="text-[1.2rem] font-bold text-gray-900 mb-3">
                Kanban Boards
              </h3>
              <p className="text-[1rem] text-gray-600">
                Transform emails into tasks instantly. Organize projects with
                drag-and-drop boards and track your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-300 pt-10 pb-15">
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 text-center">
          <img
            src="./logo.png"
            alt="Prodibud Logo"
            className="max-w-1/2 md:max-w-3/20"
          />
          <p className="text-[1rem] text-gray-800">
            © 2025 Prodibud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
