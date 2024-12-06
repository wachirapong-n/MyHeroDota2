"use client";
import { useEffect, useState } from "react";

export default function fetchHeroes(id) {
  const [selectedHero, setSelectedHero] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [dataLabels, setDataLabels] = useState([]);

  const fetchData = async () => {

    try {
      const res = await fetch('https://api.opendota.com/api/heroStats');
      const heroData = await res.json();
      const selectedHero = heroData.filter((hero) => hero.id == id)[0];
      setSelectedHero(selectedHero);

      const resBenchmarks = await fetch("https://api.opendota.com/api/benchmarks?hero_id=" + id);
      const benchmarkJson = await resBenchmarks.json();
      setBenchmarks(benchmarkJson);

    } catch (error) {
      console.log("Can not fetch data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    var dataLabel = [];

    if (benchmarks.length !== 0) {

      var chartKeys = Object.keys(benchmarks.result)
      chartKeys.forEach(key => {
        var dataLineChart = {
          labels: [],
          datasets: [],
        };
        var temp = benchmarks.result[key];
        var tmpLabel = [];
        var tmpData = [];
        temp.forEach(item => {
          tmpLabel = tmpLabel.concat(item.percentile);
          tmpData = tmpData.concat(item.value)
        });

        var dataset = {
          label: key,
          data: tmpData,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1
        };

        dataLineChart["labels"] = tmpLabel;
        dataLineChart["datasets"].push(dataset);
        dataLabel = dataLabel.concat(dataLineChart);
      });
      setDataLabels(dataLabel);
    }
  }, [benchmarks]);

  return { selectedHero, benchmarks, dataLabels };

}