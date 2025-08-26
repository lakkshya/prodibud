import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUserData(res.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const formatDateOfBirth = (dob) => {
    const date = new Date(dob);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!userData) {
    return <Loading />;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="h-[calc(100vh-80px)] flex justify-center p-5">
        <div className="w-1/2 flex flex-col bg-blue-100 items-center rounded-4xl shadow-md overflow-hidden">
          <div className="w-full flex justify-center bg-blue-800 p-5">
            <h1 className="text-[1.4rem] text-white">Profile</h1>
          </div>
          <div className="w-full flex flex-col p-5">
            <div className="flex gap-5 text-[1.1rem]">
              <p className="text-gray-600">Full Name</p>
              <p className="text-gray-800 font-medium">{userData.name}</p>
            </div>
            <div className="flex gap-5 text-[1.1rem]">
              <p className="text-gray-600">Date Of Birth</p>
              <p className="text-gray-800 font-medium">
                {formatDateOfBirth(userData.dateOfBirth)}
              </p>
            </div>
            <div className="flex gap-5 text-[1.1rem]">
              <p className="text-gray-600">Email ID</p>
              <p className="text-gray-800 font-medium">{userData.email}</p>
            </div>
            <div className="flex gap-5 text-[1.1rem]">
              <p className="text-gray-600">Phone Number</p>
              <p className="text-gray-800 font-medium">
                {userData.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
