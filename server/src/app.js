import express from "express";
import cors from "cors";
import cookiesParser from "cookie-parser";
import profileRouter from "./routes/profile.route.js";
import eventRouter from "./routes/event.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookiesParser());


// Test routes
app.get("/", (req, res) => {
  res.json({ msg: "This is test route" });
});

// Routes
app.use("/api/create-profile", profileRouter);
app.use("/api/event", eventRouter)

export { app };
