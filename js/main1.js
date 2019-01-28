function bubbleChart() {
  var width = 1000, height = 950, dp = 40, dpE= 200;

// location to move bubbles towards, when they're combined
  var center = {
    x: width/2,
    y: height/2
  };

  // the bubbles centers based on noc group

  var secCenter = {
    "Business, Finance & Administration": {x: width/2, y: dpE},
    "Natural and applied sciences": {x: width-dpE, y: height/2},
    "Health occupations": {x: width-dpE-dp, y: height-dpE},
    "Occupations in education, law, social": {x: width-dpE-dp, y: dpE},
    "Occupations in art, culture, recreation": {x: dpE, y: height/2},
    "Sales and service occupations": {x: width/2, y: height/2},
    "Trades, transport, and equipment": {x: width/2, y: height-dpE+dp},
    "Natural resources, agriculture, and related": {x: dpE+dp, y: dpE+dp},
    "Manufactoring and utilities": {x: dpE+dp, y: height-dpE-dp }

  }
  // their corresponding titles positions
  var secTitle = {
    "Business, Finance & Administration": {x: width/2, y: dpE},
    "Natural and applied sciences": {x: width-dpE, y: (height/2)+dp},
    "Health occupations": {x: width-dpE-dp, y: height-dpE+dp},
    "Occupations in education, law, social": {x: width-dpE-dp, y: dpE+dp},
    "Occupations in art, culture, recreation": {x: dpE, y: height/2+dp},
    "Sales and service occupations": {x: width/2, y: height/2+dpE},
    "Trades, transport, and equipment": {x: width/2, y: height-dpE+dp},
    "Natural resources, agriculture, and related": {x: dpE+dp, y: dpE+dp+dp},
    "Manufactoring and utilities": {x: dpE+dp, y: height-dpE+(dp*3)}
  }

  var forceStrength = 0.1;

  var svg, bubbles, nodes;

  // larger particles have greater charge (logically), so the charge function
  // alters charges based on node size -->

  function charge(d) {
    return -Math.pow(d.radius, 2.0)*forceStrength;
  };

  // force simulation -->
  // nothing is simulating here since we don't have nodes yet.
  // so simulation.stop()

  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  simulation.stop();

  // different colors based on csd TYPE

  var colors = d3.scaleOrdinal()
    .domain(['UC', 'CDR', 'CTY', 'RM', 'DIS'])
    .range(['#05668D', '#028090', '#00A896','#02C39A', '#F0F3BD']);


  function createNodes(rawData) {

    var maxPop = d3.max(rawData, function(d) {return +d.amount; });

    var radiusScale = d3.scalePow()
    .exponent(0.6)
    .range([2,60])
    .domain([0,maxPop]);

    var myNodes = rawData.map(function(d) {
        return {
          id: d.CDUID,
          radius: radiusScale(+d.amount),
          value: +d.amount,
          name: d.CDNAME,
          type: d.type,
          occupation: d.NOC,
          x: Math.random() * 800,
          y: Math.random() * 800
        };
    });

    // this prevents occlusion of smaller nodes

    //myNodes.sort(function(a,b) {return b.value - a.value; });

    return myNodes;
  }


  var chart = function chart(selector, rawData) {

    nodes = createNodes(rawData);

    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    bubbles = svg.selectAll('.bubble')
      .data(nodes, function(d) {return d.id; });

      var bubblesE = bubbles.enter()
        .append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', function(d) {return colors(d.type); })
        .attr('stroke', 'grey')
        .attr('stroke-width', 1.5)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail)

     bubbles = bubbles.merge(bubblesE);

     // transition to make bubbles initially appear

     bubbles.transition()
      .duration(2500)
      .attr('r', function(d) {return d.radius; });

      // simulations nodes to our nodes array

      simulation.nodes(nodes);

      // initial layout is the grouped bubbles
      groupBubbles();

  };

  // callback function for every tick of the force simulation,
  // random bubble positions

  function ticked() {
    bubbles
      .attr('cx', function(d) {return d.x; })
      .attr('cy', function (d) {return d.y; });
  }

  // position x, y for each node based on the NOC..

  function nodeNocPosX(d) {return secCenter[d.occupation].x;}
  function nodeNocPosY(d) {return secCenter[d.occupation].y;}


// single group mode for bubbles

  function groupBubbles() {
    hideTitles();

    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));
    // reheat simulation, restarting its internal timer, since we've temporarily stopped it
    simulation.alpha(1).restart();

  }

  function seperateBubbles() {
    showTitles();
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeNocPosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeNocPosY));
    simulation.alpha(1).restart();
  }

  //hiding the noc title display

  function hideTitles() {
    svg.selectAll('.noc').remove();
  }

  function showTitles() {
    var nocData = d3.keys(secTitle);
    var nocs = svg.selectAll('.noc')
      .data(nocData)
      .enter()
      .append('text')
      .attr('class', 'noc')
      .attr('x', function(d){return secTitle[d].x; })
      .attr('y', function(d){return secTitle[d].y; })
      .attr('text-anchor', 'middle')
      .text(function(d) {return d; });
  }


  var div = d3.select('#vis').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // tooltip detail function

  function showDetail(d) {
    d3.select(this).attr('stroke', 'white');
    div.transition()
      .duration(100)
      .style('opacity', 0.9);
    div.html(d.value + ' of ' + d.name + ' youth are working in ' + d.occupation)
        .style('left', 200)
        .style('top', 200);
  }

// Hiding tooltip

  function hideDetail(d) {
    d3.select(this).attr('stroke', 'grey');
    div.transition()
      .duration(100)
      .style('opacity', 0);
  }

  // toggle button to seperate if the id of the clicked button
  // is equal to noc;

  chart.toggleDisplay = function(displayName) {
    if (displayName === 'noc') {
      seperateBubbles(); }
    else {
      groupBubbles();
    }

  };
  return chart;
}

var myBubbleChart = bubbleChart();

function display(error, data) {
  if (error) {console.log(error); }
  myBubbleChart('#vis', data);
}

// the buttons

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);
      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}


d3.csv('data/occdata.csv', display);

setupButtons();
