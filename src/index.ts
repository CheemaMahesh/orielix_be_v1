import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { eventRouter } from "./routes/event";
import { sessionRouter } from "./routes/sesssion";
import { preferencesRouter } from "./routes/preferences";
import { notificationsRouter } from "./routes/notifications";
import rateLimit from "express-rate-limit";
// import "./jobs/updateUserRankings";

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/preferences", preferencesRouter);
app.use("/api/v1/notifications", notificationsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
