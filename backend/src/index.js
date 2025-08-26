const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const authRoutes = require("./routes/authRoutes");
const mailRoutes = require("./routes/mailRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
