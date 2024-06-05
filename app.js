const express = require("express");

const mongoose = require("mongoose");

const app = express();

const mainRouter = require("./routes/routesIndex");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "66592b24805fd893060bbbf5",
  };
  next();
});

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
