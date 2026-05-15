import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/** Browser-restricted key for Maps JavaScript API (never use server secrets in the client). */
router.get("/config", (_req, res) => {
  res.json({
    googleMapsApiKey: config.googleMapsBrowserKey,
    mapId: process.env.GOOGLE_MAPS_MAP_ID ?? null,
  });
});

/**
 * Server-side Directions API proxy — keeps the server key off the client.
 * Enable Routes/Directions API and set GOOGLE_MAPS_SERVER_KEY.
 */
router.get("/directions", requireAuth, async (req, res) => {
  if (!config.googleMapsServerKey) {
    res.status(503).json({ error: "GOOGLE_MAPS_SERVER_KEY not configured" });
    return;
  }
  const q = z
    .object({
      origin: z.string(),
      destination: z.string(),
      mode: z.enum(["driving", "walking", "bicycling"]).optional(),
    })
    .safeParse(req.query);
  if (!q.success) {
    res.status(400).json({ error: q.error.flatten() });
    return;
  }

  const params = new URLSearchParams({
    origin: q.data.origin,
    destination: q.data.destination,
    mode: q.data.mode ?? "driving",
    key: config.googleMapsServerKey,
  });

  const url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
  const r = await fetch(url);
  const data = (await r.json()) as { status: string; routes?: unknown[]; error_message?: string };
  if (data.status !== "OK") {
    res.status(400).json({ error: data.error_message ?? data.status });
    return;
  }
  res.json({ data });
});

export default router;
