"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const [heroData, setHeroData] = useState([]);
  const [filteredHero, setFilteredHero] = useState([]);
  const [searchedHero, setSearchedHero] = useState("");
  const [sorted, setSorted] = useState("asc");
  const [filterArr, setfilterArr] = useState([]);
  const path = 'https://cdn.cloudflare.steamstatic.com';


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.opendota.com/api/heroStats');
        const heroData = await res.json();
        var sortedHero = heroData.sort((a, b) =>
          a.localized_name.localeCompare(b.localized_name));
        setHeroData(sortedHero);
        setFilteredHero(sortedHero);
      } catch (error) {
        console.log("Can not fetch data:", error);
      }
    }
    fetchData();
  }, []);


  const handleSearch = (e) => {
    var heroName = e.target.value;
    var heroes = heroData.filter((hero) =>
      hero.localized_name.toLowerCase().includes(heroName.toLowerCase()))
    setFilteredHero(heroes);
    setSearchedHero(heroName);
  };

  const handleSort = () => {
    if (sorted === "asc") {
      setSorted("desc");
      var sortedHero = heroData.sort((a, b) =>
        b.localized_name.localeCompare(a.localized_name));
      setFilteredHero(sortedHero);
    }
    else {
      setSorted("asc");
      var sortedHero = heroData.sort((a, b) =>
        a.localized_name.localeCompare(b.localized_name));
      setFilteredHero(sortedHero);
    }
  }

  const handleCheck = (e) => {
    var filteredVal = e.target.value;
    setfilterArr(filterArr + filteredVal)
    var heroes = filterArr.every(role => hero.roles.includes(role));
    console.log(heroes)

  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter hero name"
          value={searchedHero}
          onChange={handleSearch}
        />
      </div>

      <div>
        <div>
          <span>Type</span>
          <br />
          <input
            type="checkbox"
            value="carry"
          />
          <label>Carry</label>
          <br />
          <input
            type="checkbox"
            value="support"
          />
          <label>Support</label>
          <br />
        </div>

        <div>
          <span>Attack Type</span>
          <br />
          <input
            type="checkbox"
            value="melee"

            onChange={handleCheck}
          />
          <label>Melee</label>
          <br />
          <input
            type="checkbox"
            value="ranged"

            onChange={handleCheck}
          />
          <label>Ranged</label>
          <br />
        </div>

        <div>
          <span>Attributes</span>
          <br />
          <input
            type="checkbox"
            value="str"
          />
          <label>Strength</label>
          <br />
          <input
            type="checkbox"
            value="agility"
          />
          <label>Agility</label>
          <br />
          <input
            type="checkbox"
            value="int"
          />
          <label>Intelligence</label>
          <br />
          <input
            type="checkbox"
            value="all"
          />
          <label>Universal</label>
          <br />
        </div>

        <div>
          <span>Tags</span>
          <br />
          <input
            type="checkbox"
            value="disabler"
          />
          <label>Disabler</label>
          <br />
          <input
            type="checkbox"
            value="durable"
          />
          <label>Durable</label>
          <br />
          <input
            type="checkbox"
            value="escape"
          />
          <label>Escape</label>
          <br />
          <input
            type="checkbox"
            value="initiator"
          />
          <label>Initiator</label>
          <br />
          <input
            type="checkbox"
            value="nuker"
          />
          <label>Nuker</label>
          <br />
          <input
            type="checkbox"
            value="pusher"
          />
          <label>Pusher</label>
          <br />
        </div>

      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th onClick={handleSort}>Heroes</th>
              <td onClick={handleSort}>
                {sorted === "asc" && (
                  <span>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
                    </svg>
                  </span>)}

                {sorted === "desc" && (
                  <span>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                    </svg>
                  </span>
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredHero.map((hero) => (
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
    </div>
  );
}
