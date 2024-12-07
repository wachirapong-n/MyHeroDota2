"use client"

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import userID from "@/app/lib/userIDLocal";
import fetchHeroes from '@/app/components/fetchHero';

const HeroStats = dynamic(() => import('@/app/components/stats'), {
  ssr: false,
});
const Chart = dynamic(() => import('@/app/components/chart'), {
  ssr: false,
});
const Fav = dynamic(() => import('@/app/components/favorite'), {
  ssr: false,
});


export default function heroDetails() {
  const id = useParams<{ id: string }>().id;
  const [isFav, setIsFav] = useState(false)
  const selectedHero = fetchHeroes(id).selectedHeroes;
  const dataLabels = fetchHeroes(id).dataLabels;
  const dataBarChart = fetchHeroes(id).dataBarChart;
  const path = 'https://cdn.cloudflare.steamstatic.com'

  var img = path + selectedHero.img;
  var primeAttribute = selectedHero.primary_attr;
  var sumAttribute = selectedHero.base_str;
  var multiplier = 1;
  if (primeAttribute === "all") {
    sumAttribute = selectedHero.base_str + selectedHero.base_int + selectedHero.base_agi;
    multiplier = 0.7;
  }
  else if (primeAttribute === "int") {
    sumAttribute = selectedHero.base_int;
  }
  else if (primeAttribute === "agi") {
    sumAttribute = selectedHero.base_agi;
  }

  const data = {
    attackMin: Math.round(selectedHero.base_attack_min + (sumAttribute * multiplier)),
    attackMax: Math.round(selectedHero.base_attack_max + (sumAttribute * multiplier)),
    attackRange: selectedHero.attack_range,
    attackSpd: selectedHero.base_attack_time + selectedHero.base_agi,
    health: selectedHero.base_health + (22 * selectedHero.base_str),
    healthRegen: (selectedHero.base_health_regen + (0.1 * selectedHero.base_str)).toFixed(1),
    mana: (selectedHero.base_mana + (12 * selectedHero.base_int)),
    manaRegen: (selectedHero.base_mana_regen + (0.05 * selectedHero.base_int)).toFixed(1),
    armor: (selectedHero.base_armor + (selectedHero.base_agi / 6)).toFixed(1),
    magicResist: Math.round(selectedHero.base_mr + (0.1 * selectedHero.base_int)),
    movementSpd: selectedHero.move_speed,
    attackType: selectedHero.attack_type,
    roles: selectedHero.roles,
    img: img,
    heroName: selectedHero.localized_name,
    selectedHero: selectedHero,
    id: id
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get-user-fav", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ userID: userID, heroID: id, type: "current" })
        })

        var fav = await response.json()
        setIsFav(fav.userFav.favorite)

      } catch (error) {
        console.log("Can not fetch data:", error);
      }
    }
    fetchData()
  }, [])
  if ((dataLabels.length === 0 ||
    dataBarChart.length === 0)) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div >
      <div className='flex justify-between '>
        <div >
          <HeroStats data={data} />
        </div>
        <div className="absolute top-0 left-0">
          <Fav heroID={id} isFav={isFav} />
        </div>
      </div>
      <div>
        <Chart dataLabels={dataLabels} dataBarChart={dataBarChart} />
      </div>
    </div>
  );
}
