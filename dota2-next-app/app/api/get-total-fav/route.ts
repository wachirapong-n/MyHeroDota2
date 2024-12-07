import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function GET() {
  const sumFav = await prisma.UserFavHero.groupBy({
    by: ["heroID"],
    _count: {
      favorite: true
    },
    where: {
      favorite: true
    }

  })

  var data = sumFav.map((hero) => ({ fav: hero._count.favorite, heroID: hero.heroID }))
  var sortData = data.sort((a, b) => b.fav - a.fav)
  data = sortData.slice(0, 10)

  return NextResponse.json({ fav: data }, { status: 200 });
}
