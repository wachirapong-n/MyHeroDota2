import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

export async function POST(req) {
  if (req.method === "POST") {
    const data = await req.json()
    console.log(data)
    const hasUser = await prisma.Admin.findFirst({
      where: {
        username: data.username
      }
    })
    console.log(hasUser)
    if (hasUser) {
      const isPasswordValid = await bcrypt.compare(data.password, hasUser.password);
      if (isPasswordValid) {
        return NextResponse.json({ message: "login success" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "password not correct" }, { status: 401 });
      }
    }
    else {
      return NextResponse.json({ message: "invalid username" }, { status: 401 });
    }

  } else {
    return NextResponse.json({ message: "method not allow" }, { status: 405 });
  }

}
