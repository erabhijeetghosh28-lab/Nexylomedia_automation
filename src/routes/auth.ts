import { Router } from "express";
import { signup, login } from "../services/authService";

export const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, tenantName } = req.body;
    const result = await signup({ email, password, tenantName });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

