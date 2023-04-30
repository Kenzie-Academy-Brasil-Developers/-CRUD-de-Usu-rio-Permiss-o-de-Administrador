import "express-async-errors";
import express, { Application } from "express";
import loginRoutes from "./routes/login.routes";
import userRoutes from "./routes/user.routes";

import { handleErrors } from "./error";

const app: Application = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/login", loginRoutes);

app.use(handleErrors);

export default app;
