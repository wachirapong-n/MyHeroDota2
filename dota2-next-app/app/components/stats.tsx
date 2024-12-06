export default function HeroStats({ data }) {
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
  } = data;
  return (
    <div>
      <div>
        <img src={img} alt={heroName}></img>
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