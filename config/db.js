import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI; // Lấy URL từ biến môi trường
  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  await mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Connection Error:", err));
};
