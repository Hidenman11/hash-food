export type Restaurant = {
  id: string;
  name: string;
  cuisines: string;
  city: string;
  image: string;
  rating: number;
  deliveryMins: string;
  distanceKm: number;
  deliveryFee: number;
  tags: string[];
  promo?: string;
};

export type Offer = {
  id: string;
  title: string;
  code: string;
  restaurant: string;
  details: string;
  expires: string;
  image: string;
  minimumOrder: number;
  saving: string;
};

export const restaurants: Restaurant[] = [
  {
    id: "pizza-time",
    name: "Pizza Time",
    cuisines: "Pizza, Pasta, Italian",
    city: "Mwanza",
    image: "/images/pizza.svg",
    rating: 4.8,
    deliveryMins: "25-35 min",
    distanceKm: 1.2,
    deliveryFee: 2000,
    tags: ["Pizza", "Open", "Popular"],
    promo: "50% off today",
  },
  {
    id: "mamas-kitchen",
    name: "Mama's Kitchen",
    cuisines: "Pilau, Biryani, Local food",
    city: "Mwanza",
    image: "/images/spice-route.svg",
    rating: 4.7,
    deliveryMins: "20-30 min",
    distanceKm: 1.5,
    deliveryFee: 2500,
    tags: ["Rice", "Local", "Family"],
  },
  {
    id: "chipsi-point",
    name: "Chipsi Point",
    cuisines: "Chips, Chicken, Snacks",
    city: "Mwanza",
    image: "/images/chicken.svg",
    rating: 4.5,
    deliveryMins: "15-25 min",
    distanceKm: 0.9,
    deliveryFee: 1500,
    tags: ["Chicken", "Fast", "Budget"],
    promo: "Free delivery",
  },
  {
    id: "burger-house",
    name: "Burger House",
    cuisines: "Burgers, Fries, Drinks",
    city: "Mwanza",
    image: "/images/burger.svg",
    rating: 4.9,
    deliveryMins: "18-28 min",
    distanceKm: 2.1,
    deliveryFee: 3000,
    tags: ["Burger", "Premium", "Popular"],
  },
  {
    id: "fresh-bowl",
    name: "Fresh Bowl",
    cuisines: "Salads, Bowls, Juice",
    city: "Mwanza",
    image: "/images/fresh-bowl.svg",
    rating: 4.6,
    deliveryMins: "18-26 min",
    distanceKm: 2.4,
    deliveryFee: 2000,
    tags: ["Healthy", "Drinks", "Fresh"],
  },
  {
    id: "sweet-corner",
    name: "Sweet Corner",
    cuisines: "Desserts, Coffee, Bakery",
    city: "Mwanza",
    image: "/images/dessert.svg",
    rating: 4.4,
    deliveryMins: "12-22 min",
    distanceKm: 0.6,
    deliveryFee: 1000,
    tags: ["Dessert", "Coffee", "Fast"],
    promo: "Buy 1 get 1",
  },
];

export const offers: Offer[] = [
  {
    id: "hashfirst",
    title: "50% off first order",
    code: "HASHFIRST",
    restaurant: "All restaurants",
    details: "Valid for new customers on food subtotal.",
    expires: "Tonight 11:59 PM",
    image: "/images/pizza.svg",
    minimumOrder: 12000,
    saving: "Up to TSh 8,000",
  },
  {
    id: "freebike",
    title: "Free delivery near you",
    code: "FREEBIKE",
    restaurant: "Chipsi Point",
    details: "No rider fee for orders within 2 km.",
    expires: "May 15, 2026",
    image: "/images/chicken.svg",
    minimumOrder: 8000,
    saving: "Save TSh 3,000",
  },
  {
    id: "lunch20",
    title: "Lunch combo discount",
    code: "LUNCH20",
    restaurant: "Mama's Kitchen",
    details: "Pilau or biryani combo with soda included.",
    expires: "Weekdays 11 AM - 3 PM",
    image: "/images/spice-route.svg",
    minimumOrder: 10000,
    saving: "20% off",
  },
  {
    id: "sweet2",
    title: "Buy 1 get 1 dessert",
    code: "SWEET2",
    restaurant: "Sweet Corner",
    details: "Applies to selected cakes, donuts, and coffee.",
    expires: "This weekend",
    image: "/images/dessert.svg",
    minimumOrder: 6000,
    saving: "BOGO",
  },
];

export function formatTzs(value: number) {
  return `TSh ${value.toLocaleString("en-US")}`;
}
