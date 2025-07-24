import TopBar from "../components/TopBar";
import Inbox from "../components/Inbox";

const Home = () => {
  return (
    <div className="bg-gold-gradient min-h-screen p-5">
      <TopBar />
      <main className="py-5">
        <Inbox />
      </main>
    </div>
  );
};

export default Home;
