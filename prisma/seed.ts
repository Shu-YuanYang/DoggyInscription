import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";
  const walletAddr = "DK24VY9rop9NoHaM8iBAUTNAkVgRXuChVa";
  

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.fakeWallet.delete({ where: { address: walletAddr } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.fakeInscription.deleteMany({});


  // start seeding:
  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.fakeWallet.create({
    data: {
      addressType: "Legacy (P2PKH) (m/44'/3'/0'/0/0)",
      address: "DK24VY9rop9NoHaM8iBAUTNAkVgRXuChVa",
      customHdPath: "",
      phrase: "",
      network: ""
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
