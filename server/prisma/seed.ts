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

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "pizza-time" },
    update: {},
    create: {
      name: "Pizza Time",
      slug: "pizza-time",
      description: "Wood-fired pizzas and fresh pasta in Mwanza.",
      city: "Mwanza",
      address: "City center",
      lat: -2.5167,
      lng: 32.9,
      deliveryFeeTzs: 2000,
      ownerUserId: owner.id,
    },
  });

  await prisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        name: "Margherita",
        description: "Tomato, mozzarella, basil",
        priceTzs: 12000,
        sortOrder: 1,
      },
      {
        restaurantId: restaurant.id,
        name: "Pepperoni Feast",
        description: "Double pepperoni, mozzarella",
        priceTzs: 15000,
        sortOrder: 2,
      },
      {
        restaurantId: restaurant.id,
        name: "Veggie Supreme",
        description: "Seasonal vegetables, pesto drizzle",
        priceTzs: 13500,
        sortOrder: 3,
      },
    ],
  });

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
