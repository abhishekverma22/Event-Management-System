import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect DB then start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection Failed !!!", error);
  });
