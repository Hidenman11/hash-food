export type SampleRestaurant = {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  location: string;
  address: string;
  lat: number | null;
  lng: number | null;
  deliveryFeeTzs: number;
  menuCount: number;
  rating: number;
  deliveryMins: string;
  distanceKm: number;
  image: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SampleMenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  priceTzs: number;
  imageUrl: string;
  isAvailable: boolean;
  sortOrder: number;
};

export const FALLBACK_IMAGE = "/images/placeholder.png";

export const sampleRestaurants: SampleRestaurant[] = [
  {
    id: "rest_pizza_time",
    name: "Pizza Time",
    slug: "pizza-time",
    description: "Wood-fired pizza, pasta, and family combos.",
    city: "Mwanza",
    location: "Rock City Mall, Mwanza",
    address: "Rock City Mall, Mwanza",
    lat: -2.5164,
    lng: 32.9175,
    deliveryFeeTzs: 2000,
    menuCount: 5,
    rating: 4.8,
    deliveryMins: "25-35 min",
    distanceKm: 1.2,
    image:
      "/images/pizza.jpg",
    tags: ["Pizza", "Pasta", "Popular"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "rest_burger_house",
    name: "Burger House",
    slug: "burger-house",
    description: "Stacked burgers, crispy fries, and cold drinks.",
    city: "Mwanza",
    location: "Capri Point, Mwanza",
    address: "Capri Point, Mwanza",
    lat: -2.5239,
    lng: 32.9002,
    deliveryFeeTzs: 1500,
    menuCount: 4,
    rating: 4.7,
    deliveryMins: "15-25 min",
    distanceKm: 0.8,
    image:
      "/images/burger.jpg",
    tags: ["Burger", "Fast", "Fries"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "rest_spice_route",
    name: "Spice Route",
    slug: "spice-route",
    description: "Biryani, curry, pilau, and warm local plates.",
    city: "Dar es Salaam",
    location: "Masaki, Dar es Salaam",
    address: "Haile Selassie Road, Masaki",
    lat: -6.7468,
    lng: 39.2798,
    deliveryFeeTzs: 2500,
    menuCount: 5,
    rating: 4.6,
    deliveryMins: "25-35 min",
    distanceKm: 2.1,
    image:
      "/images/spice-route.jpg",
    tags: ["Rice", "Curry", "Local"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "rest_fresh_bowl",
    name: "Fresh Bowl",
    slug: "fresh-bowl",
    description: "Salads, grain bowls, juices, and healthy lunches.",
    city: "Arusha",
    location: "Clock Tower, Arusha",
    address: "Clock Tower, Arusha",
    lat: -3.3869,
    lng: 36.6829,
    deliveryFeeTzs: 2000,
    menuCount: 4,
    rating: 4.5,
    deliveryMins: "18-28 min",
    distanceKm: 1.5,
    image:
      "/images/fresh-bowl.jpg",
    tags: ["Healthy", "Salads", "Drinks"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "rest_sweet_corner",
    name: "Sweet Corner",
    slug: "sweet-corner",
    description: "Desserts, pastries, coffee, and weekend treats.",
    city: "Dodoma",
    location: "City Center, Dodoma",
    address: "City Center, Dodoma",
    lat: -6.163,
    lng: 35.7516,
    deliveryFeeTzs: 1000,
    menuCount: 4,
    rating: 4.4,
    deliveryMins: "12-22 min",
    distanceKm: 0.6,
    image:
      "/images/dessert.jpg",
    tags: ["Dessert", "Coffee", "Bakery"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "rest_chipsi_point",
    name: "Chipsi Point",
    slug: "chipsi-point",
    description: "Chips, chicken, mishkaki, and quick snacks.",
    city: "Mwanza",
    location: "Pasiansi, Mwanza",
    address: "Pasiansi, Mwanza",
    lat: -2.4824,
    lng: 32.9229,
    deliveryFeeTzs: 1500,
    menuCount: 4,
    rating: 4.3,
    deliveryMins: "15-25 min",
    distanceKm: 0.9,
    image:
      "/images/chicken.jpg",
    tags: ["Chicken", "Snacks", "Budget"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
];

export const sampleMenuItems: Record<string, SampleMenuItem[]> = {
  "pizza-time": [
    menu("pizza_margherita", "rest_pizza_time", "Margherita Pizza", "Tomato, mozzarella, basil.", 14000, "/images/pizza.jpg", 1),
    menu("pizza_pepperoni", "rest_pizza_time", "Pepperoni Pizza", "Smoky pepperoni and mozzarella.", 18000, "/images/pizza.jpg", 2),
    menu("pizza_pasta", "rest_pizza_time", "Creamy Pasta", "Penne with garlic cream sauce.", 12000, "/images/pasta.jpg", 3),
  ],
  "burger-house": [
    menu("burger_classic", "rest_burger_house", "Classic Beef Burger", "Beef patty, cheese, pickles.", 13000, "/images/burger.jpg", 1),
    menu("burger_chicken", "rest_burger_house", "Crispy Chicken Burger", "Crunchy chicken and slaw.", 12000, "/images/burger.jpg", 2),
    menu("burger_fries", "rest_burger_house", "Loaded Fries", "Fries, sauce, and cheese.", 7000, "/images/fries.jpg", 3),
  ],
  "spice-route": [
    menu("spice_biryani", "rest_spice_route", "Chicken Biryani", "Fragrant rice and spiced chicken.", 15000, "/images/rice.jpg", 1),
    menu("spice_pilau", "rest_spice_route", "Beef Pilau", "Local pilau with kachumbari.", 12000, "/images/rice.jpg", 2),
    menu("spice_curry", "rest_spice_route", "Paneer Curry", "Creamy curry with chapati.", 14000, "/images/spice-route.jpg", 3),
  ],
  "fresh-bowl": [
    menu("fresh_green", "rest_fresh_bowl", "Green Power Bowl", "Greens, avocado, grains.", 11000, "/images/fresh-bowl.jpg", 1),
    menu("fresh_chicken", "rest_fresh_bowl", "Grilled Chicken Bowl", "Chicken, rice, vegetables.", 13000, "/images/fresh-bowl.jpg", 2),
    menu("fresh_juice", "rest_fresh_bowl", "Passion Juice", "Fresh passion fruit juice.", 5000, "/images/drinks.jpg", 3),
  ],
  "sweet-corner": [
    menu("sweet_cake", "rest_sweet_corner", "Chocolate Cake", "Soft chocolate slice.", 6000, "/images/dessert.jpg", 1),
    menu("sweet_donut", "rest_sweet_corner", "Glazed Donuts", "Box of two donuts.", 5000, "/images/dessert.jpg", 2),
    menu("sweet_coffee", "rest_sweet_corner", "Iced Coffee", "Cold coffee with milk.", 4500, "/images/coffee.jpg", 3),
  ],
  "chipsi-point": [
    menu("chipsi_mayai", "rest_chipsi_point", "Chipsi Mayai", "Fries cooked with eggs.", 7000, "/images/chicken.jpg", 1),
    menu("chipsi_chicken", "rest_chipsi_point", "Chicken & Chips", "Grilled chicken with fries.", 11000, "/images/chicken.jpg", 2),
    menu("chipsi_mishkaki", "rest_chipsi_point", "Mishkaki Plate", "Skewers, chips, kachumbari.", 10000, "/images/chicken.jpg", 3),
  ],
};

function menu(
  id: string,
  restaurantId: string,
  name: string,
  description: string,
  priceTzs: number,
  imageUrl: string,
  sortOrder: number,
): SampleMenuItem {
  return {
    id,
    restaurantId,
    name,
    description,
    priceTzs,
    imageUrl,
    isAvailable: true,
    sortOrder,
  };
}

export function getSampleRestaurant(slug: string) {
  return sampleRestaurants.find((restaurant) => restaurant.slug === slug);
}

export function getSampleMenu(slug: string) {
  return sampleMenuItems[slug] ?? [];
}
