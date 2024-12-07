import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function GET() {
  const sumFav = await prisma.UserFavHero.groupBy({
    by: ["heroID"],
    _sum: {
      favourite: true
    }
  })
  return NextResponse.json({ fav: sumFav }, { status: 200 });
}