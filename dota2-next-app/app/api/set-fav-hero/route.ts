import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(req) {
  if (req.method === "POST") {
    const data = await req.json();

    const hasUser = await prisma.User.findFirst({
      where: {
        id: data.userID
      }
    })

    const hasHero = await prisma.Hero.findFirst({
      where: {
        id: data.heroID
      }
    })

    const hasFav = await prisma.UserFavHero.findFirst({
      where: {
        userID: data.userID,
        heroID: data.heroID
      }
    })

    if (!hasUser) {
      const createUser = await prisma.User.create({
        data: {
          id: data.userID
        }
      })
    }

    if (!hasHero) {
      const createHero = await prisma.Hero.create({
        data: {
          id: data.heroID
        }
      })
    }
    // if userFavHero in db
    if (hasFav) {
      var isFav = data.favorite;
      // if user click fav
      if (isFav) {
        const updateFav = await prisma.UserFavHero.update({
          where: {
            userID_heroID: {
              userID: data.userID,
              heroID: data.heroID
            }

          },
          data: {
            favorite: isFav,
            favDate: new Date()
          }
        })
      }
      else { // if user unfav
        const updateFav = await prisma.UserFavHero.update({
          where: {
            userID_heroID: {
              userID: data.userID,
              heroID: data.heroID
            }

          },
          data: {
            favorite: isFav,
          }
        })
      }

    }
    else { //if there is NOT userFavHero in db
      const createfav = await prisma.UserFavHero.create({
        data: {
          userID: data.userID,
          heroID: data.heroID,
          favorite: data.favorite,
          favDate: new Date()
        }
      });
    }
    return NextResponse.json({ message: "data success store to database" }, { status: 200 })
  }
  else {
    return NextResponse.json({ message: "method not allowed" }, { status: 405 })
  }
}
