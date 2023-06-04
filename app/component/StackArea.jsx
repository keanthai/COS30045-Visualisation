import React, { useEffect } from "react";
import * as d3 from "d3";

function StackArea({timeRange}) {

  useEffect(() => {
    drawChart();
  }, [timeRange]);

  function drawChart() {
    // Remove the old svg
    d3.select("#stack").select("svg").remove();

    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 230, bottom: 100, left: 150 },
      width =800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#stack")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("disaster.csv").then(function (dataList) {
      // List of groups = header of the csv files

      var data = dataList.filter(
        (item) =>
          item.year >= 2013 + timeRange[0] && item.year <= 2013 + timeRange[1]
      );

      var keys = dataList.columns.slice(1);
      // color palette
      var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

      //stack the data?
      var stackedData = d3.stack().keys(keys)(data);

      // Add X axis
      // var x = d3
      //   .scaleLinear()
      //   .domain(
      //     d3.extent(data, function (d) {
      //       return d.year;
      //     })
      //   )
      //   .range([0, width]);

      var x = d3.scaleBand().range([0, width]).padding(0.4);

      x.domain(
        data.map(function (d) {
          return d.year;
        })
      );
      var xAxis = svg
        .append("g")
        .style("font", "16px times")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add X axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .style("font", "22px times")
        .text("Time (year)");

      // Add Y axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .style("font", "22px times")
        .text("# of Disaster Internal Displacements")
        .attr("text-anchor", "start");

      // Add Y axis
      var y = d3.scaleLinear().domain([0, 35000000]).range([height, 0]);
      svg.append("g").style("font", "16px times").call(d3.axisLeft(y).ticks(5));

      var clip = svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Add brushing
      var brush = d3
        .brushX() // Add the brush feature using the d3.brush function
        .extent([
          [0, 0],
          [width, height],
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

      // Create the scatter variable: where both the circles and the brush take place
      var areaChart = svg.append("g").attr("clip-path", "url(#clip)");

      // Area generator
      var area = d3
        .area()
        .x(function (d) {
          return x(d.data.year);
        })
        .y0(function (d) {
          return y(d[0]);
        })
        .y1(function (d) {
          return y(d[1]);
        });

      // Show the areas
      areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", function (d) {
          return "myArea " + d.key;
        })
        .style("fill", function (d) {
          return color(d.key);
        })
        .attr("d", area);

      // Add the brushing
      areaChart.append("g").attr("class", "brush").call(brush);

      var idleTimeout;
      function idled() {
        idleTimeout = null;
      }

      // A function that update the chart for given boundaries
      function updateChart() {
        extent = d3.selection;

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
          x.domain(
            d3.extent(data, function (d) {
              return d.year;
            })
          );
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])]);
          areaChart.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and area position
        xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
        areaChart.selectAll("path").transition().duration(1000).attr("d", area);
      }

      var highlight = function (d) {
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", 0.1);
        // expect the one that is hovered
        d3.select("." + d).style("opacity", 1);
      };

      // And when it is not hovered anymore
      var noHighlight = function (d) {
        d3.selectAll(".myArea").style("opacity", 1);
      };

      // Add one dot in the legend for each name.
      var size = 20;
      svg
        .selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 500)
        .attr("y", function (d, i) {
          return 10 + i * (size + 5);
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) {
          return color(d);
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

      // Add one dot in the legend for each name.
      svg
        .selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 500 + size * 1.2)
        .attr("y", function (d, i) {
          return 10 + i * (size + 5) + size / 2;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
          return color(d);
        })
        .text(function (d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);
    });
  }

  return (
    <div className="w-[800px]">
      <div className=" border-2 px-10 py-5 flex flex-col justify-center items-center space-y-1 border-primary rounded-lg shadow-lg select-none">
        <h1 className=" text-2xl font-bold">Disaster</h1>
        <div id="stack"></div>
        <p>Total number of Disaster Internal Displacement</p>
      </div>
      <div className=" min-h-[200px] border-2 border-primary rounded-lg mt-5 py-4 px-4 space-y-4  shadow-lg select-none">
        <h1 className="text-2xl font-bold text-center ">Description</h1>
        <p className=" text-lg text-left">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere
          doloremque aspernatur reprehenderit odio, tempora temporibus dolorum
          expedita veritatis eius iste inventore vel hic maiores eaque provident
          unde minima magni sed Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Reiciendis, recusandae tempora autem maxime minus
          cupiditate dolore aliquid iure quos laudantium. Omnis, earum dolor
          mollitia voluptatibus molestias adipisci repellendus quibusdam aut?
          lo!
        </p>
      </div>
    </div>
  );
}

export default StackArea;
