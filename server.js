const express = require("express");
const connectDB = require("./config/db");
const User = require("./models/User");
require("dotenv").config();

connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use("/create-user", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ error: "Invalid data format" });

    const userdata = req.body;
    await User(userdata).save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ err: "User registration failed" });
  }
});

app.use("/users-auth", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) return res.status(400).json({ message: "User not found" });

    if (!findUser || (findUser.password !== password))   return res.status(400).json({ message: "invalid Credentials" });

    res.status(200).json({ message: "Signed in successfully!", data: findUser });
  } catch (err) {

    res.status(500).json({ err: "Internal Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on PORT: ${PORT}`);
});
