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

export async function createOrder(payload: OrderCreateRequest): Promise<{ data: OrderResponse }> {
  const url = `${API_BASE_URL}/v1/orders`;
  return await fetchJson<{ data: OrderResponse }>(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders(): Promise<{ data: unknown[] }> {
  const url = `${API_BASE_URL}/v1/orders/mine`;
  return await fetchJson<{ data: unknown[] }>(url, {
    headers: getAuthHeaders(),
  });
}

export async function getOrder(id: string): Promise<{ data: OrderDetails }> {
  return await fetchJson<{ data: OrderDetails }>(
    `${API_BASE_URL}/v1/orders/${encodeURIComponent(id)}`,
    { headers: getAuthHeaders() },
  );
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

export async function getAdminStats(): Promise<{ data: AdminStats }> {
  const token = localStorage.getItem("hashfood_token");
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
