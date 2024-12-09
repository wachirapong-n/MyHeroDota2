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
    var heroes = allHero;

    if (heroName !== "") {
      heroes = filteredHero.filter((hero) =>
        hero.localized_name.toLowerCase().includes(heroName.toLowerCase()))

    }
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
      <div className="flex flex-wrap mt-8 pl-4">

        <div className="relative">

          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>

          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="simple-search"
            type="text"
            placeholder="Enter hero name"
            value={searchedHero}
            onChange={handleSearch}
          />
        </div>

      </div>


      <div className="flex flex-wrap  mb-3 mt-3">
        <div className="pl-5">
          <span className="mb-4 font-semibold text-gray-900 dark:text-white">Type</span>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="carry"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Carry</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="support"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Support</label>
          <br />
        </div>

        <div id="atkType" className="pl-5">
          <span className="mb-4 font-semibold text-gray-900 dark:text-white">Attack Type</span>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="melee"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Melee</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="ranged"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Ranged</label>
          <br />
        </div>

        <div id="attr" className="pl-5">
          <span className="mb-4 font-semibold text-gray-900 dark:text-white"  >Attributes</span>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="str"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Strength</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="agi"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Agility</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="int"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Intelligence</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="all"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Universal</label>
          <br />
        </div>

        <div className="pl-5 ">
          <span className="mb-4 font-semibold text-gray-900 dark:text-white">Tags</span>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="disabler"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Disabler</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="durable"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Durable</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="escape"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Escape</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="initiator"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Initiator</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="nuker"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Nuker</label>
          <br />
          <input
            id="default-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            value="pusher"
            onChange={handleCheckbox}
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">Pusher</label>
          <br />
        </div>

      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-lg rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="text-left text-base">
              <th onClick={handleSort} className="flex items-center justify-between px-6 py-3 text-center" scope="col">
                <div >
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

              <th scope="col" className="px-6 py-3"><span>Public Picks</span></th>
              <th scope="col" className="px-6 py-3"><span>Public Wins</span></th>
              <th scope="col" className="px-6 py-3"><span>Turbo Picks</span></th>
              <th scope="col" className="px-6 py-3"><span>Turbo Wins</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredHero.map((hero) => (
              <tr key={hero.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-left">
                <th scope="col" className="px-6 py-3">
                  <div className="justify-between inline-block align-middle relative">
                    <div onClick={handleFav} className="absolute top-0">
                      <Fav heroID={hero.id} isFav={hero.fav} />
                    </div>
                    <div >
                      <a href={`/heroes/${hero.id}`}><img className="h-auto max-w-lg rounded-lg" src={path + hero.img}></img></a>
                    </div>

                  </div>
                  <div>
                    <a className="text-blue-500" href={`../heroes/${hero.id}`}>{hero.localized_name}</a>
                  </div>
                </th>

                <th className="px-6 py-3"><span>{hero.pub_pick}</span></th>
                <th className="px-6 py-3">{<span>{((hero.pub_win / hero.pub_pick) * 100).toFixed(2)} %</span>}</th>
                <th className="px-6 py-3"><span>{hero.turbo_picks}</span></th>
                <th className="px-6 py-3">{<span>{((hero.turbo_wins / hero.turbo_picks) * 100).toFixed(2)} %</span>}</th>
              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </div >
  );
}
