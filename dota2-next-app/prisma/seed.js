const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcryptjs");
const adminData = require("./data");
const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.Admin.deleteMany()

    for (var i = 0; i < adminData.length; i++) {
      var username = adminData[i].username;
      var passwd = adminData[i].password;
      var hashedPasswd = await bcrypt.hash(passwd, 10);
      await prisma.Admin.create({
        data: {
          username: username,
          password: hashedPasswd
        }
      })

    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()