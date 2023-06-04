import React, { useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

function MapChart() {
  useEffect(() => {
    
    drawChart();
  }, []);

  const drawChart = () => {

    // Remove the old svg
    d3.select('#chart')
      .select('svg')
      .remove();

    var width = 960;
    var height = 500;
    
    const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);

    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(data){

    const countries = topojson.feature(data, data.objects.countries);
    
    console.log(countries)
    svg.selectAll("path").data(countries.feature).enter().append("path").attr("class", "country").attr(d, path);


    })
  }


  return (
    <div>
      <div id="chart"></div>
    </div>
  );
}

export default MapChart;
