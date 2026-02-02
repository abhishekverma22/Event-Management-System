import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import cookiesParser from "cookie-parser";
import profileRouter from "./routes/profile.route.js";
import eventRouter from "./routes/event.route.js";

dotenv.config()
const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CORS_ORIGIN,
        "http://localhost:5173", 
        "http://localhost:3000"
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") || // Allow all Vercel deployments
        origin.endsWith(".onrender.com")  // Allow all Render deployments
      ) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookiesParser());



app.get("/", (req, res) => {
  res.json({ msg: "This is test route" });
});

app.use("/api", profileRouter);
app.use("/api/event", eventRouter)

export { app };
