import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dbConnection } from "./database/db.js";
import { errorMiddleware } from "./middleware/errorHandler.js";
import userRouter from "./routes/userRoute.js";

import blogRouter from "./routes/blogRoute.js";

const app = express();

// Correct dotenv configuration
dotenv.config({ path: ".env" });

app.use(
  cors({
    origin: [process.env.FRONTENT_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


// Apply cookieParser middleware correctly
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

// Connect to the database
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

export default app;
