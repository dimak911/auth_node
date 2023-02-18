const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const { PORT, DB_URI } = require("./config");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URI);
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
