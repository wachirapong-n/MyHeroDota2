"use client"
import { useEffect, useState } from "react";
import userID from "@/app/lib/userIDLocal";
import dynamic from "next/dynamic";
const Fav = dynamic(() => import('@/app/components/favorite'), {
  ssr: false,
});

export default function MyHeroList() {
  const [allHero, setAllHero] = useState([]);
  const [filteredHero, setFilteredHero] = useState([]);
  const [searchedHero, setSearchedHero] = useState("");
  const [sorted, setSorted] = useState("asc");
  const [filterArr, setFilterArr] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const path = 'https://cdn.cloudflare.steamstatic.com';


  useEffect(() => {
    const fetchData = async () => {
      try {
        var res;
        var allHeroes;

        res = await fetch('https://api.opendota.com/api/heroStats');
        allHeroes = await res.json();

        allHeroes.forEach(hero => {
          var temp = [...hero.roles, hero.primary_attr, hero.attack_type];
          hero.roles = temp;
        });

        const response = await fetch("/api/get-user-fav", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ userID: userID, heroID: "", type: "all" })
        })

        var fav = await response.json()
        var favArr = fav.userFav.map((hero) => hero.heroID);
        allHeroes.forEach(hero => {
          if (favArr.includes((hero.id).toString())) {
            hero["fav"] = true
          } else {
            hero["fav"] = false
          }
        });

        var filterHero = allHeroes.filter((hero) => favArr.includes(hero.id.toString()))

        var sortedHero = filterHero.sort((a, b) =>
          a.localized_name.localeCompare(b.localized_name));
        setAllHero(sortedHero);
        setFilteredHero(sortedHero);
      } catch (error) {
        console.log("Can not fetch data:", error);
      }
    }
    fetchData();

  }, [isFav]);


  const handleSearch = (e) => {
    var heroName = e.target.value;
    var heroes = filteredHero.filter((hero) =>
      hero.localized_name.toLowerCase().includes(heroName.toLowerCase()))
    setFilteredHero(heroes);
    setSearchedHero(heroName);
  };

  const handleSort = () => {
    if (sorted === "asc") {
      setSorted("desc");
      var sortedHero = filteredHero.sort((a, b) =>
        b.localized_name.localeCompare(a.localized_name));
      setFilteredHero(sortedHero);
    }
    else {
      setSorted("asc");
      var sortedHero = filteredHero.sort((a, b) =>
        a.localized_name.localeCompare(b.localized_name));
      setFilteredHero(sortedHero);
    }
  }

  const handleCheckbox = (e) => {
    var arr = [];
    var type = e.target.value;
    if (e.target.checked) {
      if (type === "melee" || type === "ranged") {
        var boxes = document.getElementById("atkType").querySelectorAll("input[type=checkbox]");
        boxes.forEach(box => {
          box.checked = false;
        });

        e.target.checked = true;
        arr = removeType(filterArr, ["melee", "ranged"])
        arr = arr.concat(type)

      } else if (type === "agi" || type === "str" || type === "int" || type === "all") {
        var boxes = document.getElementById("attr").querySelectorAll("input[type=checkbox]");
        boxes.forEach(box => {
          box.checked = false;
        });

        e.target.checked = true;
        arr = removeType(filterArr, ["agi", "str", "int", "all"])
        arr = arr.concat(type)

      } else {
        arr = filterArr.concat(e.target.value)

      }

    }
    else {
      arr = filterArr.filter((val) => val !== e.target.value);

    }
    setFilterArr(arr);

    var filtered = allHero.filter((hero) => filterByCheckedbox(hero, arr));
    var filteredBySearch = filtered.filter((hero) =>
      hero.localized_name.toLowerCase().includes(searchedHero.toLowerCase()))

    setFilteredHero(filteredBySearch);

  }

  function removeType(arr, target) {
    target.forEach(val => {
      var indx = arr.indexOf(val);
      if (indx != -1) {
        arr.splice(indx, 1);
      }
    });
    return arr;
  }

  function filterByCheckedbox(hero, arr) {
    var roles = hero.roles;
    roles = roles.map((tag) => tag.toLowerCase());
    const isSubset = (a, b) => b.every((val) => a.includes(val));
    return isSubset(roles, arr);
  }

  const handleFav = (heroID) => {
    var filter = filteredHero.filter((hero) => hero.id !== heroID)
    setFilteredHero(filter);
    setIsFav(!isFav)
  }
  return (
    <div>
      <div>
        <input className="border-black-900 border"
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
            onChange={handleCheckbox}
          />
          <label>Carry</label>
          <br />
          <input
            type="checkbox"
            value="support"
            onChange={handleCheckbox}
          />
          <label>Support</label>
          <br />
        </div>

        <div id="atkType">
          <span>Attack Type</span>
          <br />
          <input
            type="checkbox"
            value="melee"
            onChange={handleCheckbox}
          />
          <label>Melee</label>
          <br />
          <input
            type="checkbox"
            value="ranged"
            onChange={handleCheckbox}
          />
          <label>Ranged</label>
          <br />
        </div>

        <div id="attr">
          <span>Attributes</span>
          <br />
          <input
            type="checkbox"
            value="str"
            onChange={handleCheckbox}
          />
          <label>Strength</label>
          <br />
          <input
            type="checkbox"
            value="agi"
            onChange={handleCheckbox}
          />
          <label>Agility</label>
          <br />
          <input
            type="checkbox"
            value="int"
            onChange={handleCheckbox}
          />
          <label>Intelligence</label>
          <br />
          <input
            type="checkbox"
            value="all"
            onChange={handleCheckbox}
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
            onChange={handleCheckbox}
          />
          <label>Disabler</label>
          <br />
          <input
            type="checkbox"
            value="durable"
            onChange={handleCheckbox}
          />
          <label>Durable</label>
          <br />
          <input
            type="checkbox"
            value="escape"
            onChange={handleCheckbox}
          />
          <label>Escape</label>
          <br />
          <input
            type="checkbox"
            value="initiator"
            onChange={handleCheckbox}
          />
          <label>Initiator</label>
          <br />
          <input
            type="checkbox"
            value="nuker"
            onChange={handleCheckbox}
          />
          <label>Nuker</label>
          <br />
          <input
            type="checkbox"
            value="pusher"
            onChange={handleCheckbox}
          />
          <label>Pusher</label>
          <br />
        </div>

      </div>
      <div>
        <table className="border-slate-400 border border-collapse">
          <thead>
            <tr>
              <th onClick={handleSort} className="flex items-center justify-between border-slate-300 border">
                <div>
                  <span>Heroes</span>
                </div>
                <div>
                  {sorted === "asc" && (
                    <span>
                      <svg className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
                      </svg>
                    </span>)}

                  {sorted === "desc" && (
                    <span>
                      <svg className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                </div>
              </th>

              <th className="border-slate-400 border">Public Pick</th>
              <th className="border-slate-400 border">Public Wins</th>
              <th className="border-slate-400 border">Turbo Pick</th>
              <th className="border-slate-400 border">Turbo Wins</th>
            </tr>
          </thead>
          <tbody>
            {filteredHero.map((hero) => (
              <tr key={hero.id}>
                <th className="border-slate-400 border">
                  <div>
                    <a href={`/heroes/${hero.id}`}><img src={path + hero.img}></img></a>
                    <div onClick={handleFav}>
                      <Fav heroID={hero.id} isFav={hero.fav} />
                    </div>


                  </div>
                  <a href={`../heroes/${hero.id}`}>{hero.localized_name}</a>
                </th>

                <th className="border-slate-400 border">{hero.pub_pick}</th>
                <th className="border-slate-400 border">{hero.pub_win}</th>
                <th className="border-slate-400 border">{hero.turbo_picks}</th>
                <th className="border-slate-400 border">{hero.turbo_wins}</th>
              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
