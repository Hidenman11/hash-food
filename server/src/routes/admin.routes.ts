import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export function createAdminRouter() {
  const router = Router();

  // Get dashboard overview stats
  router.get("/stats", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get order stats
      const [totalOrders, ordersThisWeek, revenueThisWeek] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({
          where: { createdAt: { gte: sevenDaysAgo } }
        }),
        prisma.order.aggregate({
          where: { createdAt: { gte: sevenDaysAgo } },
          _sum: { totalTzs: true }
        })
      ]);

      // Get user stats
      const [totalUsers, activeRiders, totalRestaurants] = await Promise.all([
        prisma.user.count(),
        prisma.rider.count({ where: { isOnline: true } }),
        prisma.restaurant.count({ where: { isActive: true } })
      ]);

      // Get recent orders
      const recentOrders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { fullName: true } },
          restaurant: { select: { name: true } },
          rider: { select: { user: { select: { fullName: true } } } }
        }
      });

      // Get active deliveries
      const activeDeliveries = await prisma.order.findMany({
        where: {
          status: { in: ["CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP", "EN_ROUTE"] }
        },
        include: {
          customer: { select: { fullName: true, phone: true } },
          restaurant: { select: { name: true, address: true, lat: true, lng: true } },
          rider: { select: { user: { select: { fullName: true, phone: true } }, currentLat: true, currentLng: true } }
        },
        orderBy: { createdAt: "desc" }
      });

      res.json({
        data: {
          overview: {
            totalOrders,
            ordersThisWeek,
            revenueThisWeek: revenueThisWeek._sum.totalTzs || 0,
            totalUsers,
            activeRiders,
            totalRestaurants
          },
          recentOrders: recentOrders.map(order => ({
            id: order.id,
            customer: order.customer.fullName,
            restaurant: order.restaurant.name,
            rider: order.rider?.user.fullName || null,
            total: order.totalTzs,
            status: order.status,
            createdAt: order.createdAt
          })),
          activeDeliveries: activeDeliveries.map(order => ({
            id: order.id,
            customer: {
              name: order.customer.fullName,
              phone: order.customer.phone
            },
            restaurant: {
              name: order.restaurant.name,
              address: order.restaurant.address,
              lat: order.restaurant.lat,
              lng: order.restaurant.lng
            },
            rider: order.rider ? {
              name: order.rider.user.fullName,
              phone: order.rider.user.phone,
              lat: order.rider.currentLat,
              lng: order.rider.currentLng
            } : null,
            status: order.status,
            eta: null // We'll calculate this later
          }))
        }
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/activity", requireAuth, requireRole("ADMIN"), async (_req, res) => {
    try {
      const [orders, users, restaurants, riders, payments] = await Promise.all([
        prisma.order.findMany({
          take: 25,
          orderBy: { updatedAt: "desc" },
          include: {
            customer: { select: { fullName: true, email: true } },
            restaurant: { select: { name: true } },
            rider: { select: { user: { select: { fullName: true } } } },
          },
        }),
        prisma.user.findMany({
          take: 15,
          orderBy: { createdAt: "desc" },
          select: { id: true, email: true, fullName: true, role: true, createdAt: true },
        }),
        prisma.restaurant.findMany({
          take: 15,
          orderBy: { updatedAt: "desc" },
          select: { id: true, name: true, isActive: true, updatedAt: true, createdAt: true },
        }),
        prisma.rider.findMany({
          take: 15,
          orderBy: { updatedAt: "desc" },
          include: { user: { select: { fullName: true, email: true } } },
        }),
        prisma.payment.findMany({
          take: 15,
          orderBy: { updatedAt: "desc" },
          include: { order: { include: { customer: { select: { fullName: true, email: true } } } } },
        }),
      ]);

      const activity = [
        ...orders.map((order) => ({
          id: `order-${order.id}`,
          type: "order" as const,
          action: `Order ${order.status.replace(/_/g, " ")}`,
          details: `${order.customer.fullName || order.customer.email} ordered from ${order.restaurant.name}`,
          timestamp: order.updatedAt,
          user: order.rider?.user.fullName || order.customer.fullName || order.customer.email,
        })),
        ...users.map((user) => ({
          id: `user-${user.id}`,
          type: "user" as const,
          action: `${user.role.replace(/_/g, " ")} registered`,
          details: `${user.fullName || user.email} joined the platform`,
          timestamp: user.createdAt,
          user: user.fullName || user.email,
        })),
        ...restaurants.map((restaurant) => ({
          id: `restaurant-${restaurant.id}`,
          type: "restaurant" as const,
          action: restaurant.isActive ? "Restaurant active" : "Restaurant offline",
          details: `${restaurant.name} profile updated`,
          timestamp: restaurant.updatedAt || restaurant.createdAt,
          user: restaurant.name,
        })),
        ...riders.map((rider) => ({
          id: `rider-${rider.id}`,
          type: "rider" as const,
          action: rider.isOnline ? "Rider online" : "Rider offline",
          details: `${rider.user.fullName || rider.user.email} location/status updated`,
          timestamp: rider.updatedAt,
          user: rider.user.fullName || rider.user.email,
        })),
        ...payments.map((payment) => ({
          id: `payment-${payment.id}`,
          type: "payment" as const,
          action: `Payment ${payment.status}`,
          details: `${payment.provider} payment for ${payment.order.customer.fullName || payment.order.customer.email}`,
          timestamp: payment.updatedAt,
          user: payment.order.customer.fullName || payment.order.customer.email,
        })),
      ]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 60)
        .map((item) => ({ ...item, timestamp: item.timestamp.toISOString() }));

      res.json({ data: activity });
    } catch (error) {
      console.error("Admin activity error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all orders with filtering
  router.get("/orders", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const { page = 1, limit = 50, status, restaurantId, riderId } = req.query;

      const where: any = {};
      if (status) where.status = status;
      if (restaurantId) where.restaurantId = restaurantId;
      if (riderId) where.riderId = riderId;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: { createdAt: "desc" },
          include: {
            customer: { select: { fullName: true, phone: true, email: true } },
            restaurant: { select: { name: true, address: true } },
            rider: { select: { user: { select: { fullName: true, phone: true } } } },
            items: { include: { menuItem: { select: { name: true } } } }
          }
        }),
        prisma.order.count({ where })
      ]);

      res.json({
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error("Admin orders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all users
  router.get("/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const { page = 1, limit = 50, role } = req.query;

      const where: any = {};
      if (role) where.role = role;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all restaurants
  router.get("/restaurants", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const { page = 1, limit = 50, isActive } = req.query;

      const where: any = {};
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: { createdAt: "desc" },
          include: {
            owner: { select: { fullName: true, email: true } },
            _count: { select: { menu: true, orders: true } }
          }
        }),
        prisma.restaurant.count({ where })
      ]);

      res.json({
        data: restaurants,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error("Admin restaurants error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all riders
  router.get("/riders", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const { page = 1, limit = 50, isActive } = req.query;

      const where: any = {};
      if (isActive !== undefined) where.isOnline = isActive === 'true';

      const [riders, total] = await Promise.all([
        prisma.rider.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { fullName: true, email: true, phone: true } },
            _count: { select: { orders: true } }
          }
        }),
        prisma.rider.count({ where })
      ]);

      res.json({
        data: riders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error("Admin riders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get analytics data
  router.get("/analytics", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const { period = '7d' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Get order analytics
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          createdAt: true,
          totalTzs: true,
          status: true
        },
        orderBy: { createdAt: 'asc' }
      });

      // Group by date
      const orderData = orders.reduce((acc, order) => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { orders: 0, revenue: 0 };
        }
        acc[date].orders += 1;
        acc[date].revenue += order.totalTzs;
        return acc;
      }, {} as Record<string, { orders: number; revenue: number }>);

      // Get status distribution
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        data: {
          orderTrends: Object.entries(orderData).map(([date, data]) => ({
            date,
            orders: data.orders,
            revenue: data.revenue
          })),
          statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
          }))
        }
      });
    } catch (error) {
      console.error("Admin analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
