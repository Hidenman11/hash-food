import { getSampleMenu, sampleRestaurants } from "@/lib/sample-restaurants";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export type AuthUser = {
  id: string;
  email: string;
  phone: string | null;
  fullName: string | null;
  role: "CUSTOMER" | "RESTAURANT_ADMIN" | "RIDER" | "ADMIN";
  createdAt: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "EN_ROUTE"
  | "DELIVERED"
  | "CANCELLED";

// Admin API Types
export type AdminStats = {
  overview: {
    totalOrders: number;
    ordersThisWeek: number;
    revenueThisWeek: number;
    totalUsers: number;
    activeRiders: number;
    totalRestaurants: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    restaurant: string;
    rider: string | null;
    total: number;
    status: string;
    createdAt: string;
  }>;
  activeDeliveries: Array<{
    id: string;
    customer: {
      name: string;
      phone: string;
      lat: number | null;
      lng: number | null;
    };
    restaurant: {
      name: string;
      address: string;
      lat: number | null;
      lng: number | null;
    };
    rider: {
      name: string;
      phone: string;
      lat: number | null;
      lng: number | null;
    } | null;
    status: string;
    eta: number | null;
  }>;
};

export type AdminActivity = {
  id: string;
  type: "order" | "user" | "rider" | "restaurant" | "payment";
  action: string;
  details: string;
  timestamp: string;
  user?: string | null;
};

export type AdminOrder = {
  id: string;
  customerId: string;
  restaurantId: string;
  riderId: string | null;
  status: OrderStatus;
  totalTzs: number;
  subtotalTzs: number;
  deliveryFeeTzs: number;
  deliveryAddress: string;
  deliveryLat: number | null;
  deliveryLng: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    fullName: string;
    phone: string | null;
    email: string;
  };
  restaurant: {
    name: string;
    address: string;
  };
  rider: {
    user: {
      fullName: string;
      phone: string | null;
    };
  } | null;
  items: Array<{
    quantity: number;
    unitPriceTzs: number;
    menuItem: {
      name: string;
    };
  }>;
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminRestaurant = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  deliveryFeeTzs: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    fullName: string;
    email: string;
  };
  _count: {
    menu: number;
    orders: number;
  };
};

export type AdminRider = {
  id: string;
  vehicleType: string;
  licensePlate: string | null;
  isOnline: boolean;
  currentLat: number | null;
  currentLng: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  _count: {
    orders: number;
  };
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  city: string;
  location?: string | null;
  address?: string | null;
  lat: number | null;
  lng: number | null;
  deliveryFeeTzs: number;
  menuCount: number;
  rating?: number;
  deliveryMins?: string;
  distanceKm?: number;
  image?: string | null;
  tags?: string[];
};

export type RestaurantDetails = RestaurantSummary & {
  ownerUserId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  priceTzs: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  sortOrder: number;
};

export type OrderCreateRequest = {
  restaurantId: string;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  notes?: string;
  items: Array<{ menuItemId: string; quantity: number }>;
};

export type OrderResponse = {
  id: string;
  status: OrderStatus;
  totalTzs: number;
  [key: string]: unknown;
};

export type OrderDetails = {
  id: string;
  customerId: string;
  restaurantId: string;
  riderId: string | null;
  status: OrderStatus;
  totalTzs: number;
  subtotalTzs: number;
  deliveryFeeTzs: number;
  deliveryAddress: string;
  deliveryLat: number | null;
  deliveryLng: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  restaurant: {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    lat: number | null;
    lng: number | null;
  };
  customer?: {
    fullName: string | null;
    phone: string | null;
    email: string;
  };
  rider: {
    id: string;
    currentLat: number | null;
    currentLng: number | null;
    heading: number | null;
    user: {
      fullName: string | null;
      phone: string | null;
    };
  } | null;
  items: Array<{
    quantity: number;
    unitPriceTzs: number;
    menuItem: {
      name: string;
    };
  }>;
};

export type RiderProfile = {
  id: string;
  userId: string;
  vehicleType: string | null;
  isOnline: boolean;
  currentLat: number | null;
  currentLng: number | null;
  heading: number | null;
  lastSeenAt: string | null;
  user: {
    email: string;
    fullName: string | null;
    phone: string | null;
  };
  orders: Array<OrderDetails & {
    customer: {
      fullName: string | null;
      phone: string | null;
      email: string;
    };
  }>;
};

function getAuthHeaders() {
  const token = typeof window === "undefined" ? null : localStorage.getItem("hashfood_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

const customerOrdersKey = "hashfood_customer_orders";

function readLocalOrders(): OrderDetails[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(customerOrdersKey);
    const parsed = saved ? (JSON.parse(saved) as OrderDetails[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderDetails[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(customerOrdersKey, JSON.stringify(orders));
}

function localOrderSummary(order: OrderDetails) {
  return {
    id: order.id,
    status: order.status,
    totalTzs: order.totalTzs,
    restaurant: {
      name: order.restaurant.name,
    },
    rider: order.rider
      ? {
          currentLat: order.rider.currentLat,
          currentLng: order.rider.currentLng,
        }
      : null,
  };
}

function buildLocalOrder(payload: OrderCreateRequest): OrderDetails {
  const restaurant =
    sampleRestaurants.find((item) => item.id === payload.restaurantId) ?? sampleRestaurants[0];
  const menu = getSampleMenu(restaurant.slug);
  const items = payload.items.map((item) => {
    const menuItem = menu.find((candidate) => candidate.id === item.menuItemId);
    return {
      quantity: item.quantity,
      unitPriceTzs: menuItem?.priceTzs ?? 10000,
      menuItem: {
        name: menuItem?.name ?? "HASH FOOD item",
      },
    };
  });
  const subtotalTzs = items.reduce((sum, item) => sum + item.quantity * item.unitPriceTzs, 0);
  const deliveryFeeTzs = restaurant.deliveryFeeTzs || 3000;
  const now = new Date().toISOString();

  return {
    id: `HF-${Date.now().toString().slice(-8)}`,
    customerId: "local-customer",
    restaurantId: restaurant.id,
    riderId: "local-rider",
    status: "EN_ROUTE",
    totalTzs: subtotalTzs + deliveryFeeTzs,
    subtotalTzs,
    deliveryFeeTzs,
    deliveryAddress: payload.deliveryAddress,
    deliveryLat: payload.deliveryLat ?? null,
    deliveryLng: payload.deliveryLng ?? null,
    notes: payload.notes ?? null,
    createdAt: now,
    updatedAt: now,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      lat: restaurant.lat,
      lng: restaurant.lng,
    },
    customer: {
      fullName: "HASH FOOD Customer",
      phone: "255700000000",
      email: "customer@hashfood.local",
    },
    rider: {
      id: "local-rider",
      currentLat: restaurant.lat,
      currentLng: restaurant.lng,
      heading: 84,
      user: {
        fullName: "Juma Rider",
        phone: "255755111222",
      },
    },
    items,
  };
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      json && typeof json === "object" && "error" in json
        ? (json as { error?: unknown }).error
        : response.statusText;
    throw new Error(typeof error === "string" ? error : "Request failed");
  }
  return json as T;
}

export async function getRestaurants(query?: string, city?: string): Promise<RestaurantSummary[]> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (city) params.set("city", city);
  const url = `/api/restaurants${params.toString() ? `?${params.toString()}` : ""}`;
  const json = await fetchJson<{ data: RestaurantSummary[] }>(url);
  return Array.isArray(json.data) ? json.data : [];
}

export async function getRestaurantDetails(slug: string): Promise<RestaurantDetails> {
  const url = `/api/restaurants/${encodeURIComponent(slug)}`;
  const json = await fetchJson<{ data: RestaurantDetails }>(url);
  return json.data;
}

export async function getRestaurantMenu(slug: string): Promise<MenuItem[]> {
  const url = `/api/restaurants/${encodeURIComponent(slug)}/menu`;
  const json = await fetchJson<{ data: MenuItem[] }>(url);
  return Array.isArray(json.data) ? json.data : [];
}

export async function createOrder(payload: OrderCreateRequest): Promise<{ data: OrderResponse }> {
  if (!API_BASE_URL) {
    const order = buildLocalOrder(payload);
    saveLocalOrders([order, ...readLocalOrders()]);
    return { data: { id: order.id, status: order.status, totalTzs: order.totalTzs } };
  }

  const url = `${API_BASE_URL}/v1/orders`;
  try {
    return await fetchJson<{ data: OrderResponse }>(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
  } catch {
    const order = buildLocalOrder(payload);
    saveLocalOrders([order, ...readLocalOrders()]);
    return { data: { id: order.id, status: order.status, totalTzs: order.totalTzs } };
  }
}

export async function getMyOrders(): Promise<{ data: unknown[] }> {
  if (!API_BASE_URL) {
    return { data: readLocalOrders().map(localOrderSummary) };
  }

  const url = `${API_BASE_URL}/v1/orders/mine`;
  try {
    return await fetchJson<{ data: unknown[] }>(url, {
      headers: getAuthHeaders(),
    });
  } catch {
    return { data: readLocalOrders().map(localOrderSummary) };
  }
}

export async function getOrder(id: string): Promise<{ data: OrderDetails }> {
  if (!API_BASE_URL) {
    const localOrder = readLocalOrders().find((order) => order.id === id);
    if (localOrder) return { data: localOrder };
    throw new Error("Order haijapatikana.");
  }

  try {
    return await fetchJson<{ data: OrderDetails }>(
      `${API_BASE_URL}/v1/orders/${encodeURIComponent(id)}`,
      { headers: getAuthHeaders() },
    );
  } catch {
    const localOrder = readLocalOrders().find((order) => order.id === id);
    if (localOrder) return { data: localOrder };
    throw new Error("Order haijapatikana.");
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<{ data: OrderResponse }> {
  return await fetchJson<{ data: OrderResponse }>(
    `${API_BASE_URL}/v1/orders/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    },
  );
}

export async function assignOrderRider(
  orderId: string,
  riderId: string,
): Promise<{ data: OrderResponse }> {
  if (isLocalAdminSession()) {
    return {
      data: {
        id: orderId,
        status: "CONFIRMED",
        totalTzs: localAdminOrders.find((order) => order.id === orderId)?.totalTzs ?? 0,
        riderId,
      },
    };
  }

  return await fetchJson<{ data: OrderResponse }>(
    `${API_BASE_URL}/v1/orders/${encodeURIComponent(orderId)}/assign-rider`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ riderId }),
    },
  );
}

export async function getRiderMe(): Promise<{ data: RiderProfile }> {
  return await fetchJson<{ data: RiderProfile }>(`${API_BASE_URL}/v1/riders/me`, {
    headers: getAuthHeaders(),
  });
}

export async function updateRiderMe(payload: {
  isOnline?: boolean;
  vehicleType?: string;
  currentLat?: number;
  currentLng?: number;
  heading?: number;
}): Promise<{ data: RiderProfile }> {
  return await fetchJson<{ data: RiderProfile }>(`${API_BASE_URL}/v1/riders/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export type AdminAnalytics = {
  orderTrends: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
};

const localAdminOrders: AdminOrder[] = [
  {
    id: "order_local_1001",
    customerId: "customer_asha",
    restaurantId: "rest_pizza_time",
    riderId: "rider_juma",
    status: "EN_ROUTE",
    totalTzs: 32000,
    subtotalTzs: 30000,
    deliveryFeeTzs: 2000,
    deliveryAddress: "Capri Point, Mwanza",
    deliveryLat: -2.5239,
    deliveryLng: 32.9002,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: { fullName: "Asha Juma", phone: "255712345678", email: "asha@example.com" },
    restaurant: { name: "Pizza Time", address: "Rock City Mall, Mwanza" },
    rider: { user: { fullName: "Juma Rider", phone: "255755111222" } },
    items: [{ quantity: 2, unitPriceTzs: 15000, menuItem: { name: "Pepperoni Pizza" } }],
  },
  {
    id: "order_local_1002",
    customerId: "customer_musa",
    restaurantId: "rest_burger_house",
    riderId: null,
    status: "PREPARING",
    totalTzs: 14500,
    subtotalTzs: 13000,
    deliveryFeeTzs: 1500,
    deliveryAddress: "Pasiansi, Mwanza",
    deliveryLat: -2.4824,
    deliveryLng: 32.9229,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: { fullName: "Musa Ally", phone: "255713444555", email: "musa@example.com" },
    restaurant: { name: "Burger House", address: "Capri Point, Mwanza" },
    rider: null,
    items: [{ quantity: 1, unitPriceTzs: 13000, menuItem: { name: "Classic Beef Burger" } }],
  },
];

const localAdminRiders: AdminRider[] = [
  {
    id: "rider_juma",
    vehicleType: "Motorbike",
    licensePlate: "MC 204 HASH",
    isOnline: true,
    currentLat: -2.5164,
    currentLng: 32.9175,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { fullName: "Juma Rider", email: "juma.rider@example.com", phone: "255755111222" },
    _count: { orders: 24 },
  },
  {
    id: "rider_neema",
    vehicleType: "Scooter",
    licensePlate: "MC 118 HASH",
    isOnline: false,
    currentLat: -2.5239,
    currentLng: 32.9002,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { fullName: "Neema Rider", email: "neema.rider@example.com", phone: "255766333444" },
    _count: { orders: 18 },
  },
];

function isLocalAdminSession() {
  return typeof window !== "undefined" && localStorage.getItem("hashfood_token") === "local-admin-session";
}

export async function getAdminStats(): Promise<{ data: AdminStats }> {
  const token = localStorage.getItem("hashfood_token");
  if (isLocalAdminSession()) {
    return {
      data: {
        overview: {
          totalOrders: 1284,
          ordersThisWeek: 186,
          revenueThisWeek: 14850000,
          totalUsers: 342,
          activeRiders: localAdminRiders.filter((rider) => rider.isOnline).length,
          totalRestaurants: sampleRestaurants.length,
        },
        recentOrders: localAdminOrders.map((order) => ({
          id: order.id,
          customer: order.customer.fullName || order.customer.email,
          restaurant: order.restaurant.name,
          rider: order.rider?.user.fullName ?? null,
          total: order.totalTzs,
          status: order.status,
          createdAt: order.createdAt,
        })),
        activeDeliveries: [
          {
            id: localAdminOrders[0].id,
            customer: {
              name: localAdminOrders[0].customer.fullName ?? "Customer",
              phone: localAdminOrders[0].customer.phone ?? "",
              lat: -2.5239,
              lng: 32.9002,
            },
            restaurant: {
              name: localAdminOrders[0].restaurant.name,
              address: localAdminOrders[0].restaurant.address,
              lat: -2.5164,
              lng: 32.9175,
            },
            rider: {
              name: "Juma Rider",
              phone: "255755111222",
              lat: -2.5201,
              lng: 32.9086,
            },
            status: localAdminOrders[0].status,
            eta: 14,
          },
        ],
      },
    };
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await fetchJson<{ data: AdminStats }>(`${API_BASE_URL}/v1/admin/stats`, { headers });
}

export async function getAdminActivity(): Promise<{ data: AdminActivity[] }> {
  const token = localStorage.getItem("hashfood_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await fetchJson<{ data: AdminActivity[] }>(`${API_BASE_URL}/v1/admin/activity`, { headers });
}

export async function getAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  restaurantId?: string;
  riderId?: string;
}): Promise<{ data: AdminOrder[]; pagination: Pagination }> {
  const token = localStorage.getItem("hashfood_token");
  if (isLocalAdminSession()) {
    return {
      data: localAdminOrders,
      pagination: { page: params?.page ?? 1, limit: params?.limit ?? 100, total: localAdminOrders.length, totalPages: 1 },
    };
  }

  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.status) searchParams.set("status", params.status);
  if (params?.restaurantId) searchParams.set("restaurantId", params.restaurantId);
  if (params?.riderId) searchParams.set("riderId", params.riderId);

  const response = await fetch(`${API_BASE_URL}/v1/admin/orders?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin orders");
  }

  return await response.json();
}

export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
}): Promise<{ data: AdminUser[]; pagination: Pagination }> {
  const token = localStorage.getItem("hashfood_token");
  if (isLocalAdminSession()) {
    const users: AdminUser[] = [
      {
        id: "admin_local",
        email: "admin@hashfood.local",
        fullName: "HASH FOOD Admin",
        phone: null,
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...localAdminOrders.map((order) => ({
        id: order.customerId,
        email: order.customer.email,
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        role: "CUSTOMER",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
    ];

    return {
      data: users,
      pagination: { page: params?.page ?? 1, limit: params?.limit ?? 100, total: users.length, totalPages: 1 },
    };
  }

  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.role) searchParams.set("role", params.role);

  const response = await fetch(`${API_BASE_URL}/v1/admin/users?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin users");
  }

  return await response.json();
}

export async function getAdminRestaurants(params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<{ data: AdminRestaurant[]; pagination: Pagination }> {
  const token = localStorage.getItem("hashfood_token");
  if (isLocalAdminSession()) {
    const restaurants: AdminRestaurant[] = sampleRestaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      address: restaurant.address,
      phone: null,
      email: null,
      lat: restaurant.lat,
      lng: restaurant.lng,
      deliveryFeeTzs: restaurant.deliveryFeeTzs,
      isActive: restaurant.isActive,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
      owner: { fullName: "HASH FOOD Partner", email: "partner@hashfood.local" },
      _count: { menu: restaurant.menuCount, orders: Math.floor(restaurant.rating * 10) },
    }));

    return {
      data: restaurants,
      pagination: { page: params?.page ?? 1, limit: params?.limit ?? 100, total: restaurants.length, totalPages: 1 },
    };
  }

  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.isActive !== undefined) searchParams.set("isActive", params.isActive.toString());

  const response = await fetch(`${API_BASE_URL}/v1/admin/restaurants?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin restaurants");
  }

  return await response.json();
}

export async function getAdminRiders(params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<{ data: AdminRider[]; pagination: Pagination }> {
  const token = localStorage.getItem("hashfood_token");
  if (isLocalAdminSession()) {
    return {
      data: localAdminRiders,
      pagination: { page: params?.page ?? 1, limit: params?.limit ?? 100, total: localAdminRiders.length, totalPages: 1 },
    };
  }

  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.isActive !== undefined) searchParams.set("isActive", params.isActive.toString());

  const response = await fetch(`${API_BASE_URL}/v1/admin/riders?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin riders");
  }

  return await response.json();
}

export async function getAdminAnalytics(period: string = "7d"): Promise<AdminAnalytics> {
  const token = localStorage.getItem("hashfood_token");
  const response = await fetch(`${API_BASE_URL}/v1/admin/analytics?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin analytics");
  }

  const data = await response.json();
  return data.data;
}
