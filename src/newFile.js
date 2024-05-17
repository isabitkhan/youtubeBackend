import express from "express";
import cors from "cors";
import { app } from "./app";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
  app.use(
    express.json({
      limit: "16kb",
    })
  )
);
