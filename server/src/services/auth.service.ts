import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import type { UserRole } from "@prisma/client";
import type { AuthUser } from "../types/express.js";

export async function registerUser(input: {
  email: string;
  password: string;
  phone?: string;
  fullName?: string;
  role?: UserRole;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    const err = new Error("Email already registered");
    (err as Error & { status?: number }).status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      phone: input.phone,
      fullName: input.fullName,
      role: (input.role ?? "CUSTOMER") as UserRole,
    },
  });
  return { user: sanitizeUser(user), token: signToken(user) };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    const err = new Error("Invalid credentials");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
  return { user: sanitizeUser(user), token: signToken(user) };
}

function signToken(user: { id: string; role: UserRole; email: string }) {
  const secret = config.jwtSecret as Secret;
  const options = { expiresIn: config.jwtExpiresIn } as SignOptions;
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, options);
}

function sanitizeUser(user: {
  id: string;
  email: string;
  phone: string | null;
  fullName: string | null;
  role: UserRole;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function verifySocketToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      sub: string;
      role: UserRole;
      email: string;
    };
    return { id: decoded.sub, role: decoded.role, email: decoded.email };
  } catch {
    return null;
  }
}
