export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

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

export type AdminOrder = {
  id: string;
  customerId: string;
  restaurantId: string;
  riderId: string | null;
  status: string;
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

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  city: string;
  address?: string | null;
  lat: number | null;
  lng: number | null;
  deliveryFeeTzs: number;
  menuCount: number;
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

function getAuthHeaders() {
  const token = typeof window === "undefined" ? null : localStorage.getItem("hashfood_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const error = json && typeof json === "object" && "error" in json ? (json as any).error : response.statusText;
    throw new Error(typeof error === "string" ? error : "Request failed");
  }
  return json as T;
}

export async function getRestaurants(query?: string, city?: string): Promise<RestaurantSummary[]> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (city) params.set("city", city);
  const url = `${API_BASE_URL}/v1/restaurants${params.toString() ? `?${params.toString()}` : ""}`;
  const json = await fetchJson<{ data: RestaurantSummary[] }>(url);
  return json.data;
}

export async function getRestaurantDetails(slug: string): Promise<RestaurantDetails> {
  const url = `${API_BASE_URL}/v1/restaurants/${encodeURIComponent(slug)}`;
  const json = await fetchJson<{ data: RestaurantDetails }>(url);
  return json.data;
}

export async function getRestaurantMenu(slug: string): Promise<MenuItem[]> {
  const url = `${API_BASE_URL}/v1/restaurants/${encodeURIComponent(slug)}/menu`;
  const json = await fetchJson<{ data: MenuItem[] }>(url);
  return json.data;
}

export async function createOrder(payload: OrderCreateRequest): Promise<any> {
  const url = `${API_BASE_URL}/v1/orders`;
  return await fetchJson<{ data: any }>(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders(): Promise<{ data: any[] }> {
  const url = `${API_BASE_URL}/v1/orders/mine`;
  return await fetchJson<{ data: any[] }>(url, {
    headers: getAuthHeaders(),
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

export const mockAdminStats: AdminStats = {
  overview: {
    totalOrders: 120,
    ordersThisWeek: 28,
    revenueThisWeek: 850000,
    totalUsers: 45,
    activeRiders: 12,
    totalRestaurants: 8,
  },
  recentOrders: [
    {
      id: "mock-order-01",
      customer: "Amina",
      restaurant: "Spice Kitchen",
      rider: "Rider John",
      total: 42000,
      status: "EN_ROUTE",
      createdAt: new Date().toISOString(),
    },
    {
      id: "mock-order-02",
      customer: "David",
      restaurant: "Pizza Time",
      rider: "Rider Grace",
      total: 78000,
      status: "PREPARING",
      createdAt: new Date().toISOString(),
    },
  ],
  activeDeliveries: [
    {
      id: "mock-order-03",
      customer: { name: "Mariam", phone: "+255700123456" },
      restaurant: { name: "Burger House", address: "Mwanza Rd", lat: null, lng: null },
      rider: { name: "Rider Alex", phone: "+255700987654", lat: null, lng: null },
      status: "EN_ROUTE",
      eta: null,
    },
  ],
};

export async function getAdminStats(): Promise<{ data: AdminStats; isFallback: boolean }> {
  const token = localStorage.getItem("hashfood_token");
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/v1/admin/stats`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch admin stats (${response.status})`);
    }

    const json = await response.json();
    if (!json?.data) {
      throw new Error("Invalid admin stats response");
    }

    return { data: json.data as AdminStats, isFallback: false };
  } catch (error) {
    console.error("Admin stats fetch failed:", error);
    return { data: mockAdminStats, isFallback: true };
  }
}

export async function getAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  restaurantId?: string;
  riderId?: string;
}): Promise<{ data: AdminOrder[]; pagination: any }> {
  const token = localStorage.getItem("hashfood_token");
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
}): Promise<{ data: AdminUser[]; pagination: any }> {
  const token = localStorage.getItem("hashfood_token");
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
}): Promise<{ data: AdminRestaurant[]; pagination: any }> {
  const token = localStorage.getItem("hashfood_token");
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
}): Promise<{ data: AdminRider[]; pagination: any }> {
  const token = localStorage.getItem("hashfood_token");
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
