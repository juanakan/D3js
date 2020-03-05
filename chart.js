var dataset = [2, 4, 5, 5, 3,];
var numCamas = ['0','1 bedroom','2 bedroom','3 bedroom','4 bedroom','5 or more rooms','']


// tamaño avg
const width = 500;
const height =500;
const barWidth = 70;

const svg = d3.select('#prueba')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var x_axis = d3.scalePoint()
        .domain(numCamas)
        .range([5, 440]);

    //escala tamaño barras alto
var yScale = d3.scaleLinear()
    .domain([0,d3.max(dataset)])
    .range([0, height-40]);

var yScaleChart = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height-28,0]);

var barChart = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('y', function(d) {
    return height-yScale(d)-20;})
    .attr('x', 0)

    .attr('height', function(d) {
    return yScale(d);})
    .attr('width',60)
    .attr('fill', '#F2BF23')
    .attr('transform', function (d, i) {
    var translate = [barWidth *i+50,0];
        return 'translate('+ translate +')';});

    var text = svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(function(d) {
        return d;})
        .attr('y', function(d, i) {
        return height-yScale(d)-25;})
        .attr('x', function(d, i) {
        return barWidth * i + 75;})
        .attr('fill', '#A64C38');

    svg
        .append("g")
        .attr("transform", "translate(0,482)")
        .call(d3.axisBottom(x_axis));



