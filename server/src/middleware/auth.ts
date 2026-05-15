import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { AuthUser } from "../types/express.js";
import type { UserRole } from "@prisma/client";

type JwtPayload = { sub: string; role: UserRole; email: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
