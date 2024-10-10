import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/user.route.js";
import AuthRouter from "./routes/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());

//Routes
app.use("/api/user", UserRouter);
app.use("/api/auth", AuthRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3000, () => {
  console.log(`server is running on port 3000`);
});
