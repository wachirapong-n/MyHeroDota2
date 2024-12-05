"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const [heroData, setHeroData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.opendota.com/api/heroStats');
        const heroData = await res.json();
        setHeroData(heroData);
      } catch (error) {
        console.log("Can not fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const path = 'https://cdn.cloudflare.steamstatic.com';
  var sortedHero = heroData.sort((a, b) =>
    a.localized_name.localeCompare(b.localized_name));
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Heroes</th>
          </tr>
        </thead>
        <tbody>
          {sortedHero.map((hero) => (
            <tr key={hero.id}>
              <th>
                <img src={path + hero.img}></img>
              </th>
              <th>
                <a href={`/heroes/${hero.id}`}>{hero.localized_name}</a>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
