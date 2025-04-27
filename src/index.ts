import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { eventRouter } from "./routes/event";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", eventRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
