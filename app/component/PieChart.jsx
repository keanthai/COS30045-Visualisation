import React, { useEffect } from "react";
import * as d3 from "d3";

function PieChart() {
  const data = [
    { label: "High Income", value: 160366582 },
    { label: "Middle Income", value: 76123099 },
    { label: "Lower Income", value: 11869725 },
    { label: "No Income Group Available", value: 7101890 },
  ];
  const colors = [
    "#C0504D",
    "#4BABC6",
    "#4E81BD",
    "#4EAD5B"
  ];

  useEffect(() => {
    drawChart();
  }, []);

  function drawChart() {

    // Remove the old svg
    d3.select('#mainPie')
      .select('svg')
      .remove();

    var width = 300,
      height = 300,
      radius = Math.min(width, height) / 2;
    var divNode = d3.select("body").node();
    var color = d3.scaleOrdinal()
      .range(colors);

    var arc = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 80);

    var pie = d3
      .pie()
      .sort(null)
      .value(function (d) {
        return d.value;
      });

    d3.select("#pie-chart")
      .append("div")
      .attr("id", "mainPie")
      .attr("class", "pieBox");

    var svg = d3
      .select("#mainPie")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var defs = svg.append("defs");
    var filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("result", "offsetBlur");
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    var g = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function (d) {
        return color(d.data.value);
      })
      .on("mousemove", function (event, d) {
        d3.select(this)
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px")
          .style("filter", "url(#drop-shadow)");
        d3.select(this)
          .transition()
          .duration(500)
          .ease(d3.easeCircleIn)
          .attr("transform", function (d) {
            var dist = 1;
            d.midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
            var x = Math.sin(d.midAngle) * dist;
            var y = Math.cos(d.midAngle) * dist;
            return "translate(" + x + "," + y + ")";
          });
        var mousePos = [event.clientX, event.clientY]

        d3.select("#mainTooltip")
          .style("left", mousePos[0] + "px")
          .style("top", mousePos[1]+ "px")
          .select("#value")
          .attr("text-anchor", "middle")
          .html(d.data.label + "<br />" + d.data.value + " People");

        d3.select("#mainTooltip").classed("hidden", false);
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("stroke", "none").style("filter", "none");
        d3.select(this)
          .transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr("transform", "translate(0,0)");

        d3.select("#mainTooltip").classed("hidden", true);
      });
    var centerSvg = svg
      .append("circle")
      .attr("fill", "#42A5F5")
      .attr("r", "62");

    svg
      .append("text")
      .style("fill", "#F2F2F2")
      .style("font-size", "64px")
      .style("font-weight", "bold")
      .attr("transform", "translate(0," + 20 + ")")
      .attr("text-anchor", "middle")
      .html(data.length);
  }

  return(
    
    <div className="w-[800px]">
    <div className="  border-2 px-10 py-5 flex flex-col justify-center items-center space-y-2 border-primary rounded-lg shadow-lg select-none">
      <h1 className=" text-2xl font-bold">Income Group</h1>
      <div id="pie-chart" />
      <div id="mainTooltip" className="hidden">
        <p><span id="value"></span></p>
      </div>

      <div className="grid grid-cols-2">

        {
          data.map((value, index)=>{

            const color = colors[index];
            //
            return <div className="flex my-2 space-x-2"><div className="w-6 h-6" style={{backgroundColor: `${color}`}} /><span>{value.label}</span></div>
          })
        }
        
      </div>
    </div>

      <div className=" min-h-[200px] border-2 border-primary rounded-lg mt-5 py-4 px-4 space-y-4  shadow-lg select-none">
        <h1 className="text-2xl font-bold text-center ">Description</h1>
        <p className=" text-lg text-left">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere doloremque aspernatur reprehenderit odio, tempora temporibus dolorum expedita veritatis eius iste inventore 
          vel hic maiores eaque provident unde minima magni sed Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis, recusandae tempora autem maxime minus cupiditate dolore aliquid iure quos laudantium.
           Omnis, earum dolor mollitia voluptatibus molestias adipisci repellendus quibusdam aut? lo!</p>
      </div>
    </div>
  );
}

export default PieChart;
