"use client"
import { useEffect, useState } from "react";

export default function heroDetails({ params }) {
  const [selectedHero, setSelectedHero] = useState([]);
  const path = 'https://cdn.cloudflare.steamstatic.com'
  useEffect(() => {
    const fetchData = async () => {
      var { id } = await params;

      try {
        const res = await fetch('https://api.opendota.com/api/heroStats');
        const heroData = await res.json();

        const selectedHero = heroData.filter((hero) => hero.id == id)[0];
        setSelectedHero(selectedHero);
      } catch (error) {
        console.log("Can not fetch data:", error);
      }
    }
    fetchData();
  }, []);

  console.log("heroww", selectedHero);
  var img = path + selectedHero.img;
  var name = selectedHero.localized_name;
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
  var attackMin = Math.round(selectedHero.base_attack_min + (sumAttribute * multiplier));
  var attackMax = Math.round(selectedHero.base_attack_max + (sumAttribute * multiplier));
  var attackRange = selectedHero.attack_range;
  var attackSpd = selectedHero.base_attack_time + selectedHero.base_agi;
  var health = selectedHero.base_health + (22 * selectedHero.base_str);
  var healthRegen = (selectedHero.base_health_regen + (0.1 * selectedHero.base_str)).toFixed(1);
  var mana = (selectedHero.base_mana + (12 * selectedHero.base_int));
  var manaRegen = (selectedHero.base_mana_regen + (0.05 * selectedHero.base_int)).toFixed(1);
  var armor = (selectedHero.base_armor + (selectedHero.base_agi / 6)).toFixed(1);
  var magicResist = Math.round(selectedHero.base_mr + (0.1 * selectedHero.base_int));
  var movementSpd = selectedHero.move_speed;

  return (
    <div>
      <div>
        <img src={img} alt={name}></img>
      </div>
      <div>
        <div className="row">
          <div className="col">attack: {attackMin} - {attackMax}</div>
          <div className="col">attack range: {attackRange} </div>
          <div className="col">attack speed: {attackSpd} </div>
        </div>
        <div className="row">
          <div className="col">health: {health}</div>
          <div className="col">health regen: {healthRegen} </div>
          <div className="col">mana: {mana} </div>
          <div className="col">mana regen: {manaRegen} </div>
        </div>
        <div className="row">
          <div className="col">armor: {armor}</div>
          <div className="col">magic resistance: {magicResist}%</div>
          <div className="col">movement speed: {movementSpd}</div>
        </div>
      </div>
    </div>
  );
}
