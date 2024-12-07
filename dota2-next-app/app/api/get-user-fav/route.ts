import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(req) {
  if (req.method === "POST") {
    const data = await req.json();
    const userFav = await prisma.UserFavHero.findUnique({
      where: {
        userID_heroID: {
          userID: data.userID,
          heroID: data.heroID
        },

      },
      select: {
        favourite: true
      }
    })
    return NextResponse.json({ userFav }, { status: 200 });
  }

  else {
    return NextResponse.json({ message: "method not allow" }, { status: 405 });
  }
}