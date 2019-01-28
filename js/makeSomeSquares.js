let bars = function(numRandom) {
	let width = 800,
			height = 800,
			data = [],
			visible = false,
			yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]),
			svg,
			rects

	let chart = function(selection) {
		svg = selection.append('svg').attr('width', width).attr('height', height)
		rects = svg.append('g').classed('rects', true)

		if(numRandom){
			data = createRandomData(numRandom, width)
		}

		chart.draw()
	}

	chart.width = function (val) {
		if(!arguments.length) return width
		width = val
		return chart
	}

	chart.height = function (val) {
		if(!arguments.length) return height
		height = val
		return chart
	}

	chart.data = function(d) {
		if(!arguments.length) return d
		data = d
		return chart
	}

  chart.draw = function(sorted) {
		let dataRect = rects.selectAll('rect').data(data)

		if(sorted) {
			dataRect = dataRect.sort((a, b) => {
	      return b.height - a.height
	    })
		}

    dataRect.exit().remove()

    dataRect
      .enter()
      .append('rect')
			.attr('width', d => d.width)
			.attr('height', d => d.height)
			.attr('x', d=>d.x)
      .attr('y', d => d.y)
      .attr('fill', d => d.fill)

    dataRect
			.order()
      .transition()
      .duration(1000)
			.attr('x', (d,i)=>{return d.width * i})
			.attr('fill', d => d.fill)
			.attr('y', d => d.y)
			.attr('height', d => d.height)

		return chart
  }

	function createRandomData(amount, width) {
		let th = 0
		let data = []

		for (let i = 0; i < amount; i++) {
			th = Math.floor(yScale(Math.random()))

			data.push({
				width: width / amount,
				height: th,
				x: i * width / amount,
				y: 800 - th,
				fill: randColor()
			})
		}
		return data
	}

	function randColor() {
		let R = Math.floor(Math.random() * 200 + 55).toString(16)
		let G = Math.floor(Math.random() * 200 + 55).toString(16)
		let B = Math.floor(Math.random() * 200 + 55).toString(16)
		return '#' + R + G + B
	}

	return chart
}
