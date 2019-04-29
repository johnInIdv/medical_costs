import * as d3 from 'd3';

export default function riskBarDisplay(data){

let margin = ({top: 30, right: 0, bottom: 40, left: 20})
let height = 400;
let width = 400;

let yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))
  .call(g => g.select(".domain").remove());

let xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).tickSizeOuter(0));
  // .call(text_bottom);

let y = d3.scaleLinear()
  .domain([0, 10]).nice()
  .range([height - margin.bottom, margin.top]);

let x = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([margin.left, width - margin.right])
  .padding(0.1);

let text = g => g
  .attr("transform", `translate(${margin.left},${height - 5})`)
  .append('text')
  .attr('font-size',14)
  .text('Higher the bar, the more urgently we recommend the option.');

const svg = d3.select('#svg1').attr('width',width).attr('height',height);

//UPDATE SELECTION
const nodes = svg.selectAll('.node')
	.data(data);

//ENTER SELECTION
const nodesEnter = nodes.enter()
	.append('g').attr('class', 'node');
nodesEnter.append('rect');

nodes.merge(nodesEnter)
  .select('rect')
  .transition()
  .attr("x", d => x(d.name))
  .attr("y", d => y(d.value))
  .attr("height", d => y(0) - y(d.value))
  .attr("width", x.bandwidth())
  .attr("fill", '#1ABB9C');


const xAx = nodes.enter()
  .append("g")
  .call(xAxis);

const yAx = nodes.enter()
  .append("g")
  .call(yAxis);

const xText = nodes.enter()
  .append('g')
  .call(text);

}
