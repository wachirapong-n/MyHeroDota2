import { useState } from "react";

export default function FilterHero({ allHero, searchedHero }) {
  const [filterArr, setFilterArr] = useState([]);
  const [filteredHero, setFilteredHero] = useState([]);
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


  return (
    <div>
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
    </div>
  );
}
