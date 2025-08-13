const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../../../config/cloudinary");

const validateRecipients = async (req, res) => {
  const { recipients = [], cc = [], bcc = [] } = req.body;

  const allEmails = [...recipients, ...cc, ...bcc];

  try {
    const users = await prisma.user.findMany({
      where: { email: { in: allEmails } },
      select: { email: true, id: true },
    });

    const foundEmails = users.map((u) => u.email);
    const emailMap = Object.fromEntries(users.map((u) => [u.email, u.id]));

    //helper function to split valid and invalid email
    const categorize = (list) => {
      const valid = list
        .filter((email) => foundEmails.includes(email))
        .map((email) => ({ email, id: emailMap[email] }));
      const invalid = list.filter((email) => !foundEmails.includes(email));

      return { valid, invalid };
    };

    res.json({
      recipients: categorize(recipients),
      cc: categorize(cc),
      bcc: categorize(bcc),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to validate email" });
  }
};

const uploadAttachment = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "prodibud_attachments",
            use_filename: true, // keep original filename
            unique_filename: false, // no random name
            filename_override: file.originalname, // real original name
          },
          (error, uploadedFile) => {
            if (error) return reject(error);
            resolve(uploadedFile);
          }
        );
        stream.end(file.buffer);
      });
    };

    const uploadPromises = req.files.map((file) => uploadToCloudinary(file));

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      attachments: results.map((f) => ({
        filename: f.original_filename,
        public_id: f.public_id,
        url: f.secure_url,
      })),
    });
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const deleteAttachment = async (req, res) => {
  const { public_id } = req.params;

  if (!public_id) {
    return res.status(400).json({ error: "public_id is required" });
  }

  // Try image first
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });
    if (result.result === "not found") {
      // Try raw if not found as image
      const rawResult = await cloudinary.uploader.destroy(public_id, {
        resource_type: "raw",
      });
      if (rawResult.result === "not found") {
        return res.status(404).json({ error: "File not found on Cloudinary" });
      }
      return res.status(200).json({
        message: "Attachment deleted successfully",
        result: rawResult,
      });
    }
    return res
      .status(200)
      .json({ message: "Attachment deleted successfully", result });
  } catch (err) {
    console.error("❌ Cloudinary delete failed:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const sendEmail = async (req, res) => {
  const {
    subject,
    body,
    recipients = [],
    cc = [],
    bcc = [],
    attachments = [],
  } = req.body;

  if (!recipients || recipients.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one recipient is required" });
  }

  try {
    const email = await prisma.email.create({
      data: {
        subject,
        body,
        sender: { connect: { id: req.user.id } },
        recipients: {
          create: recipients.map((id) => ({
            user: { connect: { id } },
          })),
        },
        cc: {
          create: cc.map((id) => ({
            user: { connect: { id } },
          })),
        },
        bcc: {
          create: bcc.map((id) => ({
            user: { connect: { id } },
          })),
        },
        attachments: {
          create: attachments.map((att) => ({
            filename: att.filename,
            url: att.url,
          })),
        },
      },
    });

    res.status(201).json({ message: "Email sent successfully", email });
  } catch (err) {
    console.error("Error in sendEmail:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  validateRecipients,
  uploadAttachment,
  deleteAttachment,
  sendEmail,
};
