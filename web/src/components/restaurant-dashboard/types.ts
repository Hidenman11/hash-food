export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered";

export type Order = {
  id: string;
  customer: string;
  items: string[];
  total: string;
  status: OrderStatus;
  placedAt: string;
  eta: string;
  table: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  available: boolean;
  image: string;
  stock: "Available" | "Out of stock";
};

export type Transaction = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Refunded";
};

export type RestaurantProfile = {
  name: string;
  location: string;
  phone: string;
  open: boolean;
};
