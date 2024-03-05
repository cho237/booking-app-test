import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import trainingRoutes from "./routes/training";
import cors from "cors";
import mongoose from "mongoose";


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/training", trainingRoutes);
app.use("/auth", authRoutes);
app.use((error: any, req: any, res: any, next: any) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An error occurred! Please try again" });
});


let url =  'mongodb+srv://tejiz:1234@cluster0.cblz1.mongodb.net/training'
mongoose.connect(url
).then(result => {
  console.log("connected");
  app.listen(process.env.PORT || 5000);
}).catch((err: any) => console.log(err))
