import { useState, useEffect } from "react";
import userID from "@/app/lib/userIDLocal";

export default function Favourite({ heroID, isFav }) {

  const [isFavs, setIsFavs] = useState(isFav);

  useEffect(() => {
    setIsFavs(isFav);
  }, [isFav])

  const sendFavtoBackend = async (fav) => {
    try {
      const req = await fetch("../api/set-fav-hero", {
        method: "POST",
        body: JSON.stringify({ heroID: heroID.toString(), userID: userID, favorite: fav }),
        headers: {
          "content-type": "application/json"
        }
      })

    }
    catch (error) {
      console.log(error)
    }
  }

  const handleFav = () => {
    var fav = !isFavs
    setIsFavs(fav);
    sendFavtoBackend(fav)

  }
  return (
    <div>
      <div>
        <button
          onClick={handleFav}
          className="text-[#f1c40f]">
          <svg id="fav" xmlns="http://www.w3.org/2000/svg" fill={isFavs ? "#f1c40f" : "none"} viewBox="0 0 24 24"
            strokeWidth="2" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 
              3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 
              0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}