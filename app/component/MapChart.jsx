import React, { useEffect } from "react";
import * as d3 from "d3";

function MapChart() {
  useEffect(() => {
    
    drawChart();
  }, []);

  const drawChart = () => {
    var width = 960;
    var height = 500;
    
    var color = d3.scaleOrdinal().range(d3.schemeCategory10);
    var graticule = d3.geoGraticule();
    var svg = d3.select("#chart").append("svg");
    var g = svg.append("g");

    //https://bl.ocks.org/mbostock/3710082
		var projection = d3.geoKavrayskiy7()
    .scale(170)
    .translate([width / 2, height / 2])
    .precision(.1)
    .rotate([-11,0]);
    
    var path = d3.geoPath().projection(projection);

    svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    
    var data = "https://piwodlaiwo.github.io/topojson//world-continents.json";
    
    d3.json(data, function(error, topology) {
      var continents = topojson.feature(topology, topology.objects.continent).features;
      
      var centroids = continents.map(function (d){
        return projection(d3.geoCentroid(d))
  		});
      
      svg.selectAll(".continent")
      .data(continents)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("title", function(d,i) { 
        return d.properties.continent;
      })
      .style("fill", function(d, i) { return color(i); });
      
       svg.selectAll(".name").data(centroids)
    	 .enter().append("text")
       .attr("x", function (d){ return d[0]; })
       .attr("y", function (d){ return d[1]; })
 		   .style("fill", "black")
       .attr("text-anchor", "middle")
       .text(function(d,i) {
         return continents[i].properties.continent;
       });

     
    })

  };

  return (
    <div>
      <div id="chart"></div>
    </div>
  );
}

export default MapChart;
