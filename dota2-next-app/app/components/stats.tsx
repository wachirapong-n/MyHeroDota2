import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const userID = localStorage.getItem("userID");
if (!userID) {
  localStorage.setItem("userID", uuidv4());
}

export default function HeroStats({ data }) {
  const [favData, setFavData] = useState({
    heroID: "",
    userID: "",
    favourite: false
  });
  const [isFav, setIsFav] = useState(false);
  const {
    attackMin,
    attackMax,
    attackRange,
    attackSpd,
    health,
    healthRegen,
    mana,
    manaRegen,
    armor,
    magicResist,
    movementSpd,
    attackType,
    roles,
    img,
    heroName,
    selectedHero,
    id
  } = data;

  useEffect(() => {
    sendFavtoBackend();
  }, [favData])

  useEffect(() => {
    getUserFav()
  }, [id])

  useEffect(() => {
    if (!isFav) {
      document.getElementById("fav")?.setAttribute("fill", "none")
    } else {
      document.getElementById("fav")?.setAttribute("fill", "#eab308")
    }
  }, [isFav])

  const getUserFav = async () => {
    try {
      const response = await fetch("/api/get-user-fav", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ userID: userID, heroID: id })
      })
      if (response.ok) {
        console.log("get user fav sucess")
      } else {
        console.log("failed to get user fav")
      }
      var fav = await response.json()
      setIsFav(fav.userFav.favourite);
    }
    catch (error) {
      console.log(error)
    }
  }

  const sendFavtoBackend = async () => {
    try {
      const req = await fetch("../api/set-fav-hero", {
        method: "POST",
        body: JSON.stringify(favData),
        headers: {
          "content-type": "application/json"
        }
      })
      if (req.ok) {
        console.log("send success")
      } else {
        console.log("failed to send")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleFav = () => {
    var isFav = false
    if (document.getElementById("fav")?.getAttribute("fill") === "#eab308") {
      document.getElementById("fav")?.setAttribute("fill", "none")
    } else {
      document.getElementById("fav")?.setAttribute("fill", "#eab308")
      isFav = true
    }
    setFavData({ heroID: id, userID: userID, favourite: isFav });

  }
  return (
    <div>
      <div>
        <img src={img} alt={heroName}></img>
        <button
          onClick={handleFav}
          className="text-yellow-500">
          <svg id="fav" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 
              3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 
              0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </button>
      </div>

      <div>
        <span className="font-bold">{attackType}</span>
        <span> - {roles}</span>
      </div>

      <div>
        <div className="flex">
          <div className="w-4 h-4 rounded-full bg-[#f44336] mr-1 mt-0.5"></div>
          <span>{selectedHero.base_str} + {selectedHero.str_gain}</span>
        </div>
        <div className="flex">
          <div className="w-4 h-4 rounded-full bg-[#39d402] mr-1 mt-0.5"></div>
          <span>{selectedHero.base_agi} + {selectedHero.agi_gain}</span>
        </div>
        <div className="flex">
          <div className="w-4 h-4 rounded-full bg-[#019af4] mr-1 mt-0.5"></div>
          <span >{selectedHero.base_int} + {selectedHero.int_gain}</span>
        </div>
      </div>

      <div className="flex">
        <div className="mr-2">
          <div className="col">attack: {attackMin} - {attackMax}</div>
          <div className="col">attack range: {attackRange} </div>
          <div className="col">attack speed: {attackSpd} </div>
        </div>
        <div className="mr-2">
          <div className="col">health: {health}</div>
          <div className="col">health regen: {healthRegen} </div>
          <div className="col">mana: {mana} </div>
          <div className="col">mana regen: {manaRegen} </div>
        </div>
        <div className="mr-2">
          <div className="col">armor: {armor}</div>
          <div className="col">magic resistance: {magicResist}%</div>
          <div className="col">movement speed: {movementSpd}</div>
        </div>
      </div>
    </div>
  )
}