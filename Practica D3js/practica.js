d3.json('https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json')
  .then((featureCollection) => {
    drawMap(featureCollection);
  });

function drawMap(featureCollection) {
  const svg = d3.select('#practica')
    .append('svg');
  
  const width = 500;
  const height = 500;


  svg.attr('width', width)
    .attr('height', height);

  const center = d3.geoCentroid(featureCollection);
  const projection =  d3.geoMercator()
    .fitSize([width, height], featureCollection)
    .center(center)
    .translate([width/2, height/2])
  
  const pathProjection = d3.geoPath().projection(projection);

  const features = featureCollection.features;

  const priceMax = d3.max(features,(d)=>d.properties.avgprice);
  const priceMin = d3.min(features,(d)=>d.properties.avgprice);
 
  const groupMap = svg.append('g').attr('class', 'map');
  const subunitsPath = groupMap.selectAll('.subunits')
    .data(features)
    .enter()
    .append('path');
  
  subunitsPath.attr('d', (d) =>{
    d.opacity = 1;
    return pathProjection(d);
  });
  
  const color = d3.scaleSequential()
    .domain([priceMin,priceMax])
    .interpolator(d3.interpolateViridis);

  subunitsPath.attr('fill',(d)=>color(d.properties.avgprice))

  subunitsPath.on('click', function clickSubunit(d) {
    d.opacity = d.opacity ? 0 : 1;
    d3.select(this).attr('opacity', d.opacity);
    const numBedrooms = d.properties.properties;
    let dataBedrooms=[];
    let bedrooms0=0;
    let bedrooms1=0;
    let bedrooms2=0;
    let bedrooms3=0;
    let bedrooms4=0;
    let bedrooms5=0;

    d3.select('#drawBar').remove();
  
    if (numBedrooms.length>0){

      for (let i = 0; i < numBedrooms.length;i++){
        console.log(numBedrooms.length);
        if(numBedrooms[i].bedrooms==1){
          bedrooms1=bedrooms1+1

        }else if(numBedrooms[i].bedrooms==2){
          bedrooms2=bedrooms2+1

        }
        else if(numBedrooms[i].bedrooms==3){
          bedrooms3=bedrooms3+1

        }else if(numBedrooms[i].bedrooms==4){
          bedrooms4=bedrooms4+1

        }else if(numBedrooms[i].bedrooms>4){
          bedrooms5=bedrooms5+1
        
        }else if(numBedrooms[i].bedrooms==0){
          bedrooms0=bedrooms0+1
      }
      }
      dataBedrooms [0]= bedrooms0;
      dataBedrooms [1]= bedrooms1;
      dataBedrooms [2]= bedrooms2;
      dataBedrooms [3]= bedrooms3;
      dataBedrooms [4]= bedrooms4;
      dataBedrooms [5]= bedrooms5;

  // llamamos a la funcion que pinta el grafico de drawBar
      drawBar(dataBedrooms);
    }

  // aqui meto el codigo de las drawBar
  function drawBar (input){
    var data = [
      {bedrooms: "0", value: input[0]},
      {bedrooms: "1", value: input[1]},
      {bedrooms: "2", value: input[2]},
      {bedrooms: "3", value: input[3]},
      {bedrooms: "4", value: input[4]},
      {bedrooms: "5 o mas", value: input[5]}
      
    ];
  
  const height = 500;
  const width = 500;
  const margin = 50;
  
  const x = d3.scaleBand()
    .domain(data.map(d => d.bedrooms))
    .range([margin, width - margin])
    .padding(0.1);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height - margin, margin+50]);
  
  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin})`)
    .call(d3.axisBottom(x));
  
  const yAxis = g => g
    .attr("transform", `translate(${margin},0)`)
    .call(d3.axisLeft(y));
  
  const svg = d3.select('#practica')
      .append('svg')
      .attr('id','drawBar')
      .attr('width', width)
      .attr('height', height);
  
  const g = svg.append("g").attr("fill", "#10DAA7");
    
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.bedrooms))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth())
  
  const text = g.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(function(d) {
      return d.value;})
      .attr("x", d => x(d.bedrooms)+22)
      .attr("y", d => y(d.value)-5)
      .attr('fill', 'black');
  
    svg.append("g").call(xAxis);
    
    svg.append("g").call(yAxis);
  
    svg.append('text')
      .text('numero de habitaciones')
      .attr('class','leyenda')
      .attr("x",width/2-80)
      .attr("y", height-5)
      .attr('fill', 'black');
  
      svg.append('text')
      .attr("transform", "rotate(-90)")
      .text('propiedades')
      .attr('class','leyenda')
      .attr("x",-300)
      .attr("y", 10);
  
    svg.append('text')
      .text(d.properties.name)
      .attr('class','barrio')
      .attr("x",width/2-80)
      .attr("y", 30);

    svg.append('text')
      .text('Precio medio: '+d.properties.avgprice+' Euros')
      .attr('class','leyenda')
      .attr("x",width/2-80)
      .attr("y", 50);
  }
  })
}