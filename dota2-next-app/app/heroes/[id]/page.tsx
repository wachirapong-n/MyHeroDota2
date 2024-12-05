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
  if (!selectedHero) {
    return <div></div>
  }

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


  return (
    <div>
      <img src={img} alt={name}></img>
      <div>
        <p>attack: {attackMin} - {attackMax}</p>
      </div>
      <div></div>
    </div>
  );
}
