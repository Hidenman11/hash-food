import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import type { UserRole } from "@prisma/client";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  /** Public self-signup is limited; admin accounts are seed-only. */
  role: z.enum(["CUSTOMER", "RESTAURANT_ADMIN", "RIDER"]).optional(),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const result = await registerUser(parsed.data);
    res.status(201).json(result);
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const result = await loginUser(parsed.data.email, parsed.data.password);
    res.json(result);
  } catch (e) {
    const err = e as Error & { status?: number };
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      phone: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user });
});

export default router;
