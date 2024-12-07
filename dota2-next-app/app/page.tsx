"use client"
import { useEffect, useState } from "react";
import ".//styles/favIcon.css";

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
      for (var j = 0; j < filterArr.length; j++) {
        if (filterArr[j].id === key) {
          filterArr[j]["fav"] = val;
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
      <div><span>Top 10 Favorite Heroes (Favorite)</span></div>
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
                  </div>
                  <a href={`../heroes/${hero.id}`}>{hero.localized_name}</a>
                  <span> ({hero.fav})</span>
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
