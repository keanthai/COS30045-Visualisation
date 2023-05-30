import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";

export default function BarChart1() {

  const data= [
    { label: "Europe", value: 100 },
    { label: "Asia", value: 200 },
    { label: "Africa", value: 160 },
    { label: "Northern America", value: 150 },
    { label: "Latin America", value: 150 },
    { label: "Oceania", value: 150 }
  ];

  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const scaleX = scaleBand()
    .domain(data.map(({ label }) => label))
    .range([0, width])
    .paddingInner(0.1);

    const scaleY = scaleLinear()
    .domain([0, Math.max(...data.map(({ value }) => value))])
    .range([height, 0]);

  return (
    <svg
    width={width + margin.left + margin.right}
    height={height + margin.top + margin.bottom}
  >
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
      <AxisLeft scale={scaleY} />
      <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
    </g>
  </svg>
  );
}

function AxisBottom({ scale, transform }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

function AxisLeft({ scale }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisLeft(scale));
    }
  }, [scale]);

  return <g ref={ref} />;
}

function Bars({ data, height, scaleX, scaleY }) {
  return (
    <>
      {data.map(({ value, label }) => (
        <rect
          key={`bar-${label}`}
          x={scaleX(label)}
          y={scaleY(value)}
          width={scaleX.bandwidth()}
          height={height - scaleY(value)}
          fill="teal"
        />
      ))}
    </>
  );
}