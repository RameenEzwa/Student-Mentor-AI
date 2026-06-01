import { Router, type IRouter } from "express";
import { LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const CREDENTIALS: Record<string, { password: string; role: "student" | "teacher" | "admin" }> = {
  student: { password: "learn2030", role: "student" },
  teacher: { password: "edu4all", role: "teacher" },
  admin: { password: "sys2035", role: "admin" },
};

router.post("/auth/login", (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { username, password } = parsed.data;
  const user = CREDENTIALS[username.toLowerCase()];

  if (!user || user.password !== password) {
    res.status(401).json({
      success: false,
      role: "student",
      token: "",
      message: "Invalid username or password",
    });
    return;
  }

  const token = Buffer.from(`${username}:${user.role}:${Date.now()}`).toString("base64");

  res.json({
    success: true,
    role: user.role,
    token,
    message: `Welcome, ${username}`,
  });
});

export default router;
