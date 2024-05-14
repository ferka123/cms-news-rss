import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Seeding users...");
  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@news.com",
        password:
          "$2a$10$4u3us1T4MQakzTP18064VOxunxFCHXse2Z3xYmSlryv0FY5bRwuh6", //12345678
        role: "admin",
      },
      {
        name: "User",
        email: "user@news.com",
        password:
          "$2a$10$4u3us1T4MQakzTP18064VOxunxFCHXse2Z3xYmSlryv0FY5bRwuh6",
        role: "author",
      },
    ],
    skipDuplicates: true,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
