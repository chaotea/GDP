<template>
  <div id="app">
    <div class="title">
      <h2>Gross Domestic Product</h2>
      <p>An interactive nominal GDP graph. Data from <a href="https://data.worldbank.org/">World Bank</a>.</p>
      <multiselect
        class="search"
        v-model="selectedCountries"
        v-bind:options="countries"
        v-bind:placeholder="null"
        v-bind:selectLabel="null"
        v-bind:deselectLabel="null"
        v-bind:multiple="true"
        v-bind:close-on-select="false"
        v-bind:clear-on-select="true"
      ></multiselect>
    </div>
    <div class="graph-container">
      <canvas id="gdp-graph"></canvas>
    </div>
  </div>
</template>

<script>
import Multiselect from "./components/Multiselect.vue"
import Chart from "chart.js"
import jsondata from "./data/data.json"
import randomColor from "randomcolor"

var chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: false
  },
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      gridLines: {
        display: true
      },
      ticks: {
        callback: function(value) {
          let millions = (value - (value % 1000000000)) / 1000000000
          return "$" + millions.toLocaleString() + "b";
        },
        beginAtZero: true
      }
    }],
    xAxes: [ {
      gridLines: {
        display: false
      }
    }]
  },
  tooltips: {
    displayColors: false,
    callbacks: {
      title: function(tooltipItemArr, data) {
        return data["datasets"][tooltipItemArr[0]["datasetIndex"]]["label"]
      },
      label: function(tooltipItem, data) {
        return tooltipItem["xLabel"] + ": $" + tooltipItem["yLabel"].toLocaleString()
      }
    }
  }
}

export default {
  name: "App",
  data: function() {
    return {
      selectedCountries: ["United States", "China", "Japan", "European Union"],
      countries: Object.keys(jsondata).slice(1),
      options: chartOptions
    }
  },
  computed: {
    chartData: function() {
      let datasets
      if (this.selectedCountries == null) {
        datasets = null
      } else {
        datasets = this.selectedCountries.map(function(country) {
          return {
            label: country,
            data: jsondata[country],
            borderColor: randomColor(),
            fill: false,
            spanGaps: true
          }
        })
      }
      return {
        labels: jsondata["Year"].slice(0, -1),
        datasets: datasets,
      }
    }
  },
  methods: {
    createChart(chartId) {
      const ctx = document.getElementById(chartId)
      const chart = new Chart(ctx, {
        type: "line",
        data: this.chartData,
        options: this.options
      })
    }
  },
  mounted: function() {
    this.createChart("gdp-graph")
  },
  updated: function() {
    this.createChart("gdp-graph")
  },
  components: {
    "multiselect": Multiselect
  }
}

</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
}

.title {
  width: 80%;
  margin: 5vh auto;
  text-align: center;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: #111111;
}

.title h2 {
  margin: auto;
  font-size: 3rem;
  font-weight: 400;
}

.title p {
  font-size: 1.2rem;
  font-weight: 400;
}

.title a {
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #111111;
  transition: all 0.5s ease;
}

.search {
  width: 100%;
  margin: 5vh auto 0px;
}

/* TODO: Associate multiselect selections with graph colors */
/* .multiselect__tag {
  color: #111111;
  background: transparent;
  border: 1px solid #111111;
} */

.graph-container {
  position: relative;
  height: 60vh;
  width: 80%;
  margin: auto;
}
</style>
