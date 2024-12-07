"use client";
import { useEffect, useState } from "react";

export default function fetchHeroes(id) {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [dataLabels, setDataLabels] = useState([]);
  const [durations, setDurations] = useState([]);
  const [dataBarChart, setDataBarChart] = useState([]);
  const fetchData = async () => {
    try {
      if (selectedHeroes.length === 0) {
        const res = await fetch('https://api.opendota.com/api/heroStats');
        const heroData = await res.json();
        const selectedHero = heroData.filter((hero) => hero.id == id)[0];
        setSelectedHeroes(selectedHero);
      }
      if (benchmarks.length === 0) {
        const resBenchmarks = await fetch("https://api.opendota.com/api/benchmarks?hero_id=" + id);
        const benchmarkJson = await resBenchmarks.json();
        setBenchmarks(benchmarkJson);
      }

      if (durations.length === 0) {
        const resDuration = await fetch("https://api.opendota.com/api/heroes/" + id + "/durations");
        const durationJson = await resDuration.json();
        var sortDuration = durationJson.sort((a, b) => a.duration_bin - b.duration_bin)
        setDurations(sortDuration);
      }

    } catch (error) {
      console.log("Can not fetch data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);
  //set dataLabel for line chart
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

  //set data for bar chart
  useEffect(() => {
    if (durations.length !== 0) {
      var x = [];
      var y = [];
      var color = [];
      var winRates = [];

      durations.forEach(dur => {
        x.push(dur.duration_bin / 60);
        y.push(dur.games_played);
        var winRate = ((dur.wins / dur.games_played) * 100).toFixed(2);
        var colour = "red";
        if (winRate >= 50) {
          colour = "green";
        }
        color.push(colour)
        winRates.push(winRate);
      });

      var datasets = [{
        backgroundColor: color,
        data: y,
        winRates: winRates,
      }]
      var options = {
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "durations"
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (data) {
                var duration = data.label;
                var matches = data.dataset.data[data.dataIndex];
                var winRate = data.dataset.winRates[data.dataIndex];
                return ["Duration: " + duration + " min",
                "Matches: " + matches,
                "Win: " + winRate + "%"];
              }
            },
            footer: function (tooltipItems) {
              return "";
            }
          },

        },

      }

      var dataBarChart = {
        labels: x,
        datasets: datasets,
      };

      setDataBarChart({ data: dataBarChart, options })
    }
  }, [durations]);

  return { selectedHeroes, dataLabels, dataBarChart };

}