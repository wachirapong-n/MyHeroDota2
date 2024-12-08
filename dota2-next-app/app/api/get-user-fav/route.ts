import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(req) {

  if (req.method === "POST") {
    const data = await req.json();

    // return user fav with current hero detail
    if (data.type === "current") {
      const userFav = await prisma.UserFavHero.findUnique({
        where: {
          userID_heroID: {
            userID: data.userID,
            heroID: data.heroID.toString()
          },

        },
        select: {
          favorite: true
        }
      })
      if (userFav) {

        return NextResponse.json({ userFav }, { status: 200 });
      }
      else {
        return NextResponse.json({ userFav: false }, { status: 200 });
      }
    }
    // return all hero that user fav
    else {
      const userFav = await prisma.UserFavHero.findMany({
        where: {
          userID: data.userID,
          favorite: true,
        },
        select: {
          heroID: true,
          favDate: true
        }
      })
      if (userFav) {
        return NextResponse.json({ userFav }, { status: 200 });
      }
      else {
        return NextResponse.json({ userFav: false }, { status: 200 });
      }
    }
  }

  else {
    return NextResponse.json({ message: "method not allow" }, { status: 405 });
  }
}