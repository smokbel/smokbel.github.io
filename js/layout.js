let barChart = bars(20)
d3.select('#barChart').call(barChart)

let pieChart = bars(50)
d3.select('#pieChart').call(pieChart)

let layout = function() {
  return [
    {
      name: 'mainHeader',
      type: 'header',
      el: d3.select('#mainHeader'),
      height: 500
    },
    {
      name: 'csdMap',
      el: d3.select('#barText'),
      chartEl: d3.select('#barChart'),
      type: 'chart',
      height: 3000,
      animations: [
        {
          name: 'top',
          draw: () => {
						barChart.draw()
            d3.select('#barChart').classed('is-bottom', false)
          },
          height: 0.1
        },
        {
          name: 'anim1',
          draw: () => {
            barChart.draw(true)
          },
          height: 0.1
        },
        {
          name: 'bottom',
          draw: () => {
            d3.select('#barChart').classed('fixedChart', false).classed('is-bottom', true)
          },
          height: 0.5
        }
      ]
    },
    {
      name: 'pieChart',
      el: d3.select('#pieText'),
      chartEl: d3.select('#pieChart'),
      type: 'chart',
      gap: 800,
      height: 3000,
      animations: [
        {
          name: 'top',
          draw: () => {
            pieChart.draw()
            d3.select('#pieChart').classed('is-bottom', false)
          },
          height: 0.1
        },
        {
          name: 'anim1',
          draw: () => {
            pieChart.draw(true)
          },
          height: 0.2
        },
        {
          name: 'isBottom',
          draw: () => {
            d3.select('#pieChart').classed('fixedChart', false).classed('is-bottom', true)
          },
          height: 0.5
        }
      ]
    }
  ]
}
