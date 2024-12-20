"use client"
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [filteredHero, setFilteredHero] = useState([]);
  const [sorted, setSorted] = useState("asc");
  const path = 'https://cdn.cloudflare.steamstatic.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get-total-fav")
        const topHero = await response.json();

        const res = await fetch('https://api.opendota.com/api/heroStats');
        const allHero = await res.json();

        allHero.forEach(hero => {
          var temp = [...hero.roles, hero.primary_attr, hero.attack_type];
          hero.roles = temp;
        });
        var topHeroID = topHero.fav.map((hero) => hero.heroID);
        var filterTopHero = allHero.filter((hero) => topHeroID.includes(hero.id.toString()))
        filterTopHero = filterTopHero.sort((a, b) =>
          b.id - a.id)

        var data = merge(topHero.fav, filterTopHero)

        var sortedHero = data.sort((a, b) => {
          if (a.fav !== b.fav) {
            return b.fav - a.fav;
          } else {
            return a.localized_name.localeCompare(b.localized_name)
          }
        })
        setFilteredHero(sortedHero);
      } catch (error) {
        console.log("Can not fetch data:", error);
      }
    }
    fetchData();
  }, []);

  function merge(arr, filterArr) {
    for (var i = 0; i < arr.length; i++) {
      var key = parseInt(arr[i].heroID)
      var val = arr[i].fav
      var valDate = arr[i].favDate.split("T")[0]
      for (var j = 0; j < filterArr.length; j++) {
        if (filterArr[j].id === key) {
          filterArr[j]["fav"] = val;
          filterArr[j]["favDate"] = valDate
        }
      }
    }
    return filterArr
  }


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

  return (
    <div>
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
                    <div>
                      <a href={`/heroes/${hero.id}`}><img className="h-auto max-w-lg rounded-lg" src={path + hero.img}></img></a>
                    </div>
                    <a href={`../heroes/${hero.id}`} className="text-blue-500">

                      <div className="relative group">
                        <span data-proper-target="popover-default">{hero.localized_name}</span>

                        <div data-popover
                          id="popover-default"
                          role="tooltip"
                          className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 group-hover:visible group-hover:opacity-100">
                          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Last Favorite Date</h3>
                          </div>
                          <div className="px-3 py-2">
                            <p>{hero.favDate}</p>
                          </div>
                          <div data-popper-arrow></div>
                        </div>
                      </div>
                    </a>
                    <span> Total Favorite(s): {hero.fav}</span>
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
