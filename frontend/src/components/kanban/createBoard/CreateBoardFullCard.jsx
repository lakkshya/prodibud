import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LuCheck, LuX } from "react-icons/lu";

const gradientMap = {
  TEAL_BLUE: "linear-gradient(to top, #37ecba 0%, #72afd3 100%)",
  PURPLE_INDIGO: "linear-gradient(to top, #cc208e 0%, #6713d2 100%)",
  YELLOW_RED: "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)",
  PINK_PEACH: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
  SKY_BLUE: "linear-gradient(to top, #00c6fb 0%, #005bea 100%)",
};

const CreateBoardFullCard = () => {
  const navigate = useNavigate();

  const [createData, setCreateData] = useState({
    name: "",
    background: "TEAL_BLUE",
    members: [],
  });

  const [validationResult, setValidationResult] = useState({
    valid: [],
    invalid: [],
  });
  const [tempMembers, setTempMembers] = useState("");
  const [createErrors, setCreateErrors] = useState({});

  const isValidEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddMembers = async () => {
    const email = tempMembers.trim();
    if (!email) return;

    // Validate format using regex
    if (!isValidEmailFormat(email)) {
      setValidationResult((prev) => ({
        ...prev,
        invalid: [...(prev?.invalid || []), email],
      }));
      setTempMembers("");
      return;
    }

    // Prevent duplicates
    if (createData.members.some((item) => item.email === email)) {
      setTempMembers("");
      return;
    }

    // Temporarily add the email (without id yet)
    const updatedList = [...createData.members.map((i) => i.email), email];
    setTempMembers("");

    try {
      // Validate emails with backend
      const res = await axios.post(
        "http://localhost:5000/api/kanban/validate-members",
        { members: updatedList },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Backend response example:
      // res.data.members = { valid: [{ email, id }], invalid: ['bademail@example.com'] }
      const validUsers = res.data?.valid || [];
      const invalidEmails = res.data?.invalid || [];

      // Update createData with valid users (store email + id)
      setCreateData((prev) => {
        const merged = [...prev.members, ...validUsers];
        const unique = merged.filter(
          (obj, index, self) =>
            index === self.findIndex((o) => o.email === obj.email)
        );
        return { ...prev, members: unique };
      });

      // Update invalid list for UI
      setValidationResult({ valid: validUsers, invalid: invalidEmails });
    } catch (err) {
      console.log("Validation failed", err);
    }
  };

  const handleRemoveMembers = (email) => {
    //remove from createData
    const updatedList = createData.members.filter((item) => {
      const itemEmail = typeof item === "string" ? item : item.email;
      return itemEmail !== email;
    });
    setCreateData((prev) => ({ ...prev, members: updatedList }));

    //remove from validationResult
    setValidationResult((prev) => ({
      valid: prev.valid.filter((item) => item.email !== email),
      invalid: prev.invalid.filter((e) => e !== email),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMembers();
    }
  };

  const validateCreateData = () => {
    const newErrors = {};

    if (!createData.name) newErrors.name = "Name is required";
    if (createData.members.length < 1)
      newErrors.members = "Atleast one member is required";

    setCreateErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBoard = async () => {
    if (!validateCreateData()) {
      return;
    }

    try {
      // Prepare payload
      const payload = {
        name: createData.name,
        background: createData.background,
        members: createData.members.map((u) => u.id),
      };

      const res = await axios.post(
        "http://localhost:5000/api/kanban/board",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/kanban/board/${res.data.id}`, {
        state: {
          toast: { message: "Board created successfully", type: "Success" },
        },
      });
    } catch (err) {
      console.log("Error creating board", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 bg-white px-5 py-2 md:py-5">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[1rem] font-medium">New Board</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateBoard}
            className="flex justify-center items-center bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-2xl cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        {/* Name */}
        <div className="flex gap-3 pb-1 border-b border-gray-300">
          <label htmlFor="name" className="text-[1rem] text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={createData.name}
            onChange={(e) =>
              setCreateData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full focus:outline-none"
          />
        </div>
        {createErrors.name && (
          <p className="text-red-500 text-[0.9rem]">{createErrors.name}</p>
        )}

        {/* Members */}
        <div className="flex gap-3 mt-4 pb-1 border-b border-gray-300">
          <label htmlFor="members" className="text-[1rem] text-gray-700">
            Members
          </label>
          <div className="w-full flex flex-wrap gap-2">
            {validationResult?.valid?.map((item) => (
              <span
                key={item.email}
                className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded"
              >
                {item.email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveMembers(item.email)}
                />
              </span>
            ))}
            {validationResult?.invalid?.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded"
              >
                {email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveMembers(email)}
                />
              </span>
            ))}
            <input
              type="text"
              name="members"
              value={tempMembers}
              placeholder="Type email and press Enter"
              onChange={(e) => setTempMembers(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              className="w-full focus:outline-none"
            />
          </div>
        </div>
        {createErrors.members && (
          <p className="text-red-500 text-[0.9rem]">{createErrors.members}</p>
        )}

        {/* Background */}
        <div className="flex gap-3 mt-4 pb-1">
          <label htmlFor="background" className="text-[1rem] text-gray-700 ">
            Background
          </label>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {Object.entries(gradientMap).map(([key, gradient]) => (
              <div
                key={key}
                className={`h-20 rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
                  createData.background === key
                    ? "ring-2 ring-gray-500"
                    : "ring-2 ring-transparent"
                }`}
                style={{ backgroundImage: gradient }}
                onClick={() =>
                  setCreateData((prev) => ({ ...prev, background: key }))
                }
              >
                <div className="w-full h-full flex items-center justify-center">
                  {createData.background === key && (
                    <LuCheck className="w-4 h-4 text-white" strokeWidth={4} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardFullCard;
