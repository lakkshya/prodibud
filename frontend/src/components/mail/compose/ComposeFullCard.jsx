import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LuPaperclip, LuTrash2, LuX } from "react-icons/lu";
import ProgressBar from "../../ProgressBar";

const ComposeFullCard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef(); //for attachments

  const draft = location.state?.draft;

  const [composeData, setComposeData] = useState({
    draftId: draft?.id || null,
    recipients:
      draft?.draftRecipients?.map((r) => ({ id: r.id, email: r.email })) || [],
    cc: draft?.draftCC?.map((r) => ({ id: r.id, email: r.email })) || [],
    bcc: draft?.draftBCC?.map((r) => ({ id: r.id, email: r.email })) || [],
    attachments: draft?.draftAttachments || [],
    subject: draft?.subject || "",
    body: draft?.body || "",
  });

  const [validationResult, setValidationResult] = useState({
    recipients: { valid: [], invalid: [] },
    cc: { valid: [], invalid: [] },
    bcc: { valid: [], invalid: [] },
  });
  const [tempInput, setTempInput] = useState({
    recipients: "",
    cc: "",
    bcc: "",
  });
  const [composeErrors, setComposeErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const isValidEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddEmail = async (field) => {
    const email = tempInput[field].trim();
    if (!email) return;

    // Validate format using regex
    if (!isValidEmailFormat(email)) {
      setValidationResult((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          invalid: [...(prev[field]?.invalid || []), email],
        },
      }));
      setTempInput((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    // Prevent duplicates
    if (composeData[field].some((item) => item.email === email)) {
      setTempInput((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    // Temporarily add the email (without id yet)
    const updatedList = [...composeData[field].map((i) => i.email), email];
    setTempInput((prev) => ({ ...prev, [field]: "" }));

    try {
      // Validate emails with backend
      const res = await axios.post(
        "http://localhost:5000/api/mail/validate-recipients",
        { [field]: updatedList },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Backend response example:
      // res.data[field] = { valid: [{ email, id }], invalid: ['bademail@example.com'] }
      const validUsers = res.data[field]?.valid || [];
      const invalidEmails = res.data[field]?.invalid || [];

      // Update composeData with valid users (store email + id)
      setComposeData((prev) => ({
        ...prev,
        [field]: [
          ...prev[field].filter((u) => u.id), // keep existing valid ones
          ...validUsers,
        ],
      }));

      // Update invalid list for UI
      setValidationResult((prev) => ({
        ...prev,
        [field]: { valid: validUsers, invalid: invalidEmails },
      }));
    } catch (err) {
      console.log("Validation failed", err);
    }
  };

  const handleRemoveEmail = (field, email) => {
    //remove from composeData
    const updatedList = composeData[field].filter((item) => {
      const itemEmail = typeof item === "string" ? item : item.email;
      return itemEmail !== email;
    });
    setComposeData((prev) => ({ ...prev, [field]: updatedList }));

    //remove from validationResult
    setValidationResult((prev) => ({
      ...prev,
      [field]: {
        valid: prev[field].valid.filter((item) => item.email !== email),
        invalid: prev[field].invalid.filter((e) => e !== email),
      },
    }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail(field);
    }
  };

  useEffect(() => {
    const validateEmails = (emails) => {
      const valid = [];
      const invalid = [];

      emails.forEach((email) => {
        if (isValidEmailFormat(email)) {
          // For draft emails that are already validated, assume they have an id
          valid.push({ email, id: null }); // You might need to get the actual id from somewhere
        } else {
          invalid.push(email);
        }
      });

      return { valid, invalid };
    };

    if (draft) {
      const recips = draft.draftRecipients?.map((r) => r.email) || [];
      const ccs = draft.draftCC?.map((r) => r.email) || [];
      const bccs = draft.draftBCC?.map((r) => r.email) || [];

      setValidationResult({
        recipients: validateEmails(recips),
        cc: validateEmails(ccs),
        bcc: validateEmails(bccs),
      });
    }
  }, [draft]);

  //Attachments
  const handleAttachmentButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAttachmentChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const activeTimers = new Set(); // Track active timers for cleanup

    for (let file of files) {
      const tempId = `${file.name}-${Date.now()}`;

      // Show immediately
      setComposeData((prev) => ({
        ...prev,
        attachments: [
          ...(prev.attachments || []),
          { tempId, filename: file.name, isUploading: true },
        ],
      }));

      const formData = new FormData();
      formData.append("attachments", file);

      let fakeTimer, finishTimer;

      try {
        // Start fake progress bar
        fakeTimer = setInterval(() => {
          setUploadProgress((prev) => {
            let next = prev[tempId] || 0;

            if (next < 80) {
              // fast till 50%, then slow down
              next += next < 50 ? 2 : 1;
            }
            return { ...prev, [tempId]: Math.min(next, 80) };
          });
        }, 50);

        activeTimers.add(fakeTimer);

        // Real upload request (ignore actual onUploadProgress)
        const res = await axios.post(
          "http://localhost:5000/api/mail/upload-attachments",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // After server responds, complete to 100%
        clearInterval(fakeTimer);
        activeTimers.delete(fakeTimer);

        finishTimer = setInterval(() => {
          setUploadProgress((prev) => {
            let next = prev[tempId] || 80;
            if (next < 100) {
              next += 2;
            } else {
              clearInterval(finishTimer);
              activeTimers.delete(finishTimer);
            }
            return { ...prev, [tempId]: Math.min(next, 100) };
          });
        }, 30);

        activeTimers.add(finishTimer);

        // Replace temp file with backend data
        setComposeData((prev) => ({
          ...prev,
          attachments: prev.attachments.map((att) =>
            att.tempId === tempId
              ? { ...res.data.attachments[0], isUploading: false }
              : att
          ),
        }));
      } catch (err) {
        console.error("Attachment upload failed", err);
        setComposeData((prev) => ({
          ...prev,
          attachments: prev.attachments.filter((att) => att.tempId !== tempId),
        }));
        setUploadProgress((prev) => {
          const copy = { ...prev };
          delete copy[tempId];
          return copy;
        });
      } finally {
        // Clean up all timers
        [fakeTimer, finishTimer].forEach((timer) => {
          if (timer) {
            clearInterval(timer);
            activeTimers.delete(timer);
          }
        });
      }
    }
  };

  const handleDeleteAttachment = async (publicId) => {
    //Instantly remove from UI
    setComposeData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (file) => file.public_id !== publicId
      ),
    }));

    try {
      await axios.delete(
        `http://localhost:5000/api/mail/attachments/${encodeURIComponent(
          publicId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("❌ Failed to delete attachment:", err);
      // Optionally restore in UI if delete fails
      setComposeData((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          prev.removedFile, // if you want to restore, store before removing
        ],
      }));
    }
  };

  const validateComposeData = () => {
    const newErrors = {};

    if (composeData.recipients.length < 1)
      newErrors.recipients = "Atleast one recipient is required";
    if (!composeData.subject) newErrors.subject = "Subject is required";
    if (!composeData.body) newErrors.body = "Body is required";

    setComposeErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmail = async () => {
    if (!validateComposeData()) {
      return;
    }

    try {
      // Prepare payload
      const payload = {
        subject: composeData.subject,
        body: composeData.body,
        recipients: composeData.recipients.map((u) => u.id),
        cc: composeData.cc.map((u) => u.id),
        bcc: composeData.bcc.map((u) => u.id),
        attachments: composeData.attachments.map((att) => ({
          filename: att.filename,
          url: att.url,
        })),
      };

      await axios.post("http://localhost:5000/api/mail/send", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/mail/inbox", {
        state: {
          toast: { message: "Email sent successfully", type: "Success" },
        },
      });
    } catch (err) {
      console.log("Error sending email", err);
    }
  };

  //DRAFT

  const hasAnyContent = () => {
    const hasRecipients =
      composeData.recipients.length ||
      composeData.cc.length ||
      composeData.bcc.length;

    const hasText =
      (composeData.subject && composeData.subject.trim().length > 0) ||
      (composeData.body && composeData.body.trim().length > 0);

    const hasAttachments = (composeData.attachments || []).length > 0;

    return hasRecipients || hasText || hasAttachments;
  };

  const saveDraftOnce = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const payload = {
        id: composeData.draftId,
        subject: composeData.subject || "",
        body: composeData.body || "",
        recipients: composeData.recipients.map((u) => u.id).filter(Boolean),
        cc: composeData.cc.map((u) => u.id).filter(Boolean),
        bcc: composeData.bcc.map((u) => u.id).filter(Boolean),
        // only include finished uploads
        attachments: (composeData.attachments || [])
          .filter((att) => !att.isUploading && att.url)
          .map((att) => ({
            filename: att.filename,
            url: att.url,
            public_id: att.public_id,
          })),
      };

      let response;
      if (composeData.draftId) {
        const id = composeData.draftId;
        response = await axios.put(
          `http://localhost:5000/api/mail/draft/${id}`,
          payload,
          {
            headers,
          }
        );
        return id;
      } else {
        // your backend returns { message, draft }
        response = await axios.post(
          `http://localhost:5000/api/mail/draft`,
          payload,
          { headers }
        );
        const newId = response?.data?.draft?.id || response?.data?.id; // support either shape
        if (newId) {
          setComposeData((prev) => ({ ...prev, draftId: newId }));
        }
        return newId;
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  const handleCloseCompose = async () => {
    if (!hasAnyContent()) {
      return navigate("/mail/inbox");
    }

    try {
      await saveDraftOnce();
      navigate("/mail/inbox", {
        state: { toast: { message: "Saved to drafts", type: "Success" } },
      });
    } catch (err) {
      console.error("Failed to save draft on close:", err);
      navigate("/mail/inbox", {
        state: { toast: { message: "Couldn't save draft", type: "Error" } },
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 bg-white px-5 py-2 md:py-5">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[1rem] font-medium">New Mail</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSendEmail}
            className="flex justify-center items-center bg-amber-400 hover:bg-gray-200 px-4 py-2 rounded-2xl cursor-pointer"
          >
            Send
          </button>
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
          />
          <button
            onClick={handleAttachmentButtonClick}
            className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <LuPaperclip className="w-4 h-4" />
          </button>
          <button
            // onClick={moveToTrash}
            className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCloseCompose}
            className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        {/* Recipient */}
        <div className="flex gap-3 pb-2 border-b border-gray-300">
          <label htmlFor="recipient" className="text-[1rem] text-gray-700">
            Recipient
          </label>
          <div className="w-full flex flex-wrap gap-2">
            {validationResult.recipients?.valid?.map((item) => (
              <span
                key={item.email}
                className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded"
              >
                {item.email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveEmail("recipients", item.email)}
                />
              </span>
            ))}
            {validationResult.recipients?.invalid?.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded"
              >
                {email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveEmail("recipients", email)}
                />
              </span>
            ))}
            <input
              type="text"
              name="recipient"
              value={tempInput.recipients}
              placeholder="Type email and press Enter"
              onChange={(e) =>
                setTempInput((prev) => ({
                  ...prev,
                  recipients: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "recipients")}
              className="w-full focus:outline-none"
            />
          </div>
        </div>
        {composeErrors.recipients && (
          <p className="text-red-500 text-[0.9rem]">
            {composeErrors.recipients}
          </p>
        )}
        {/* CC */}
        <div className="flex gap-3 pb-2 border-b border-gray-300">
          <label htmlFor="cc" className="text-[1rem] text-gray-700">
            Cc
          </label>
          <div className="w-full flex flex-wrap gap-2">
            {validationResult.cc.valid.map((item) => (
              <span
                key={item.email}
                className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded"
              >
                {item.email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveEmail("cc", item.email)}
                />
              </span>
            ))}
            {validationResult.cc.invalid.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded"
              >
                {email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveEmail("cc", email)}
                />
              </span>
            ))}
            <input
              type="text"
              name="cc"
              value={tempInput.cc}
              placeholder="Type email and press Enter"
              onChange={(e) =>
                setTempInput((prev) => ({
                  ...prev,
                  cc: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "cc")}
              className="w-full focus:outline-none"
            />
          </div>
        </div>
        {/* BCC */}
        <div className="flex gap-3 pb-2 border-b border-gray-300">
          <label htmlFor="bcc" className="text-[1rem] text-gray-700">
            Bcc
          </label>
          <div className="w-full flex flex-wrap gap-2">
            {validationResult.bcc.valid.map((item) => (
              <span
                key={item.email}
                className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded"
              >
                {item.email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveEmail("bcc", item.email)}
                />
              </span>
            ))}
            {validationResult.bcc.invalid.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded"
              >
                {email}
                <LuX
                  className="w-4 h-4 cursor-pointer hover:text-gray-500"
                  onClick={() => handleRemoveEmail("bcc", email)}
                />
              </span>
            ))}
            <input
              type="text"
              name="bcc"
              value={tempInput.bcc}
              placeholder="Type email and press Enter"
              onChange={(e) =>
                setTempInput((prev) => ({
                  ...prev,
                  bcc: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "bcc")}
              className="w-full focus:outline-none"
            />
          </div>
        </div>
        {/* Subject */}
        <div className="flex gap-3 pb-2 border-b border-gray-300">
          <label htmlFor="subject" className="text-[1rem] text-gray-700">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={composeData.subject}
            onChange={(e) =>
              setComposeData((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="w-full focus:outline-none"
          />
        </div>
        {composeErrors.subject && (
          <p className="text-red-500 text-[0.9rem]">{composeErrors.subject}</p>
        )}
        {/* Body */}
        <div className="flex gap-3 pb-2">
          <label htmlFor="body" className="text-[1rem] text-gray-700 ">
            Body
          </label>
          <textarea
            name="body"
            value={composeData.body}
            onChange={(e) =>
              setComposeData((prev) => ({ ...prev, body: e.target.value }))
            }
            rows="8"
            className="w-full resize-none focus:outline-none"
          />
        </div>
        {composeErrors.body && (
          <p className="text-red-500 text-[0.9rem] mb-6">
            {composeErrors.body}
          </p>
        )}
        {/* Attachments */}
        <div className="flex flex-wrap gap-2 mb-6">
          {composeData.attachments?.map((file, index) => (
            <div
              key={
                file.public_id ||
                file.tempId ||
                `attachment-${index}-${file.filename}`
              }
              className="relative w-48 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-1">
                <span className="truncate max-w-[120px] text-sm font-medium">
                  {file.filename || file.url.split("/").pop()}
                </span>

                {!file.isUploading && (
                  <button
                    onClick={() => handleDeleteAttachment(file.public_id)}
                    className="text-gray-500 hover:text-red-500 text-lg leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>

              {uploadProgress[file.tempId] !== undefined && (
                <ProgressBar progress={uploadProgress[file.tempId]} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComposeFullCard;
