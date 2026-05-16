import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@hashfood.local" },
    update: {},
    create: {
      email: "admin@hashfood.local",
      fullName: "Platform Admin",
      passwordHash,
      role: UserRole.ADMIN,
      phone: "+255700000001",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@hashfood.local" },
    update: {},
    create: {
      email: "owner@hashfood.local",
      fullName: "Pizza Owner",
      passwordHash,
      role: UserRole.RESTAURANT_ADMIN,
      phone: "+255700000002",
    },
  });

  const riderUser = await prisma.user.upsert({
    where: { email: "rider@hashfood.local" },
    update: {},
    create: {
      email: "rider@hashfood.local",
      fullName: "John Rider",
      passwordHash,
      role: UserRole.RIDER,
      phone: "+255700000003",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@hashfood.local" },
    update: {},
    create: {
      email: "customer@hashfood.local",
      fullName: "Happy Customer",
      passwordHash,
      role: UserRole.CUSTOMER,
      phone: "+255700000004",
    },
  });

  const seedRestaurants = [
    {
      slug: "pizza-time",
      name: "Pizza Time",
      description: "Wood-fired pizzas and fresh pasta in Mwanza.",
      deliveryFeeTzs: 2000,
      ownerUserId: owner.id,
      menu: [
        { name: "Margherita", description: "Tomato, mozzarella, basil", priceTzs: 12000, sortOrder: 1 },
        { name: "Pepperoni Feast", description: "Double pepperoni, mozzarella", priceTzs: 15000, sortOrder: 2 },
        { name: "Veggie Supreme", description: "Seasonal vegetables, pesto drizzle", priceTzs: 13500, sortOrder: 3 },
      ],
    },
    {
      slug: "burger-house",
      name: "Burger House",
      description: "American burgers, crispy fries, and shakes.",
      deliveryFeeTzs: 1500,
      menu: [
        { name: "Classic Burger", description: "Beef patty, cheddar, house sauce", priceTzs: 11000, sortOrder: 1 },
        { name: "Chicken Burger", description: "Grilled chicken, lettuce, mayo", priceTzs: 10000, sortOrder: 2 },
      ],
    },
    {
      slug: "spice-route",
      name: "Spice Route",
      description: "Indian curry, biryani, and tandoori favorites.",
      deliveryFeeTzs: 2500,
      menu: [
        { name: "Chicken Biryani", description: "Fragrant basmati rice with spiced chicken", priceTzs: 14000, sortOrder: 1 },
        { name: "Butter Chicken", description: "Creamy tomato curry with naan", priceTzs: 13000, sortOrder: 2 },
      ],
    },
    {
      slug: "fresh-bowl",
      name: "Fresh Bowl",
      description: "Healthy salads, grain bowls, and smoothies.",
      deliveryFeeTzs: 2000,
      menu: [
        { name: "Green Power Bowl", description: "Quinoa, avocado, grilled veggies", priceTzs: 12500, sortOrder: 1 },
        { name: "Berry Smoothie", description: "Mixed berries, yogurt, honey", priceTzs: 8000, sortOrder: 2 },
      ],
    },
  ] as const;

  for (const entry of seedRestaurants) {
    const restaurant = await prisma.restaurant.upsert({
      where: { slug: entry.slug },
      update: {
        name: entry.name,
        description: entry.description,
        deliveryFeeTzs: entry.deliveryFeeTzs,
      },
      create: {
        name: entry.name,
        slug: entry.slug,
        description: entry.description,
        city: "Mwanza",
        address: "City center",
        lat: -2.5167,
        lng: 32.9,
        deliveryFeeTzs: entry.deliveryFeeTzs,
        ownerUserId: "ownerUserId" in entry ? entry.ownerUserId : undefined,
      },
    });

    await prisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
    await prisma.menuItem.createMany({
      data: entry.menu.map((item) => ({
        restaurantId: restaurant.id,
        ...item,
      })),
    });
  }

  const restaurant = await prisma.restaurant.findUniqueOrThrow({ where: { slug: "pizza-time" } });

  await prisma.rider.upsert({
    where: { userId: riderUser.id },
    update: {},
    create: {
      userId: riderUser.id,
      vehicleType: "motorbike",
      isOnline: true,
      currentLat: -2.52,
      currentLng: 32.91,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete:", {
    admin: admin.email,
    owner: owner.email,
    rider: riderUser.email,
    customer: customer.email,
    restaurant: restaurant.slug,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
