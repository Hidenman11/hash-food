import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const schema = z.object({
    city: z.string().optional(),
    q: z.string().optional(),
  });
  const q = schema.safeParse(req.query);
  if (!q.success) {
    res.status(400).json({ error: q.error.flatten() });
    return;
  }
  const where = {
    isActive: true,
    ...(q.data.city ? { city: q.data.city } : {}),
    ...(q.data.q
      ? {
          OR: [
            { name: { contains: q.data.q } },
            { description: { contains: q.data.q } },
          ],
        }
      : {}),
  };
  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      _count: { select: { menu: true } },
    },
  });
  res.json({
    data: restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      city: r.city,
      address: r.address,
      lat: r.lat,
      lng: r.lng,
      deliveryFeeTzs: r.deliveryFeeTzs,
      menuCount: r._count.menu,
    })),
  });
});

router.get("/:idOrSlug", async (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      isActive: true,
    },
    include: {
      _count: { select: { menu: true } },
    },
  });
  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }
  const { _count, ...rest } = restaurant;
  res.json({
    data: {
      ...rest,
      menuCount: _count.menu,
    },
  });
});

router.get("/:idOrSlug/menu", async (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const restaurant = await prisma.restaurant.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });
  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }
  const menu = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id, isAvailable: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  res.json({ data: menu });
});

const createRestaurantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  deliveryFeeTzs: z.number().int().nonnegative().optional(),
});

router.post(
  "/",
  requireAuth,
  requireRole("RESTAURANT_ADMIN", "ADMIN"),
  async (req, res) => {
    const parsed = createRestaurantSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    try {
      const restaurant = await prisma.restaurant.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          city: data.city ?? "Mwanza",
          address: data.address,
          lat: data.lat,
          lng: data.lng,
          deliveryFeeTzs: data.deliveryFeeTzs ?? 2000,
          ownerUserId: req.user!.role === "RESTAURANT_ADMIN" ? req.user!.id : undefined,
        },
      });
      res.status(201).json({ data: restaurant });
    } catch (e) {
      res.status(400).json({ error: "Could not create restaurant (slug taken?)" });
    }
  },
);

export default router;
