"use client"

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import fetchHeroes from '@/app/components/fetchHero';

export default function heroDetails() {
  const id = useParams<{ id: string }>().id;
  const selectedHero = fetchHeroes(id).selectedHero;
  const dataLabels = fetchHeroes(id).dataLabels;

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
    selectedHero: selectedHero
  }

  const HeroStats = dynamic(() => import('@/app/components/stats'), {
    ssr: false,
  });
  const Chart = dynamic(() => import('@/app/components/chart'), {
    ssr: false,
  });
  return (
    <div>
      <HeroStats data={data} />
      <Chart dataLabels={dataLabels} />
    </div>
  );
}
