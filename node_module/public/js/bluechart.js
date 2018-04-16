function bluechart(judge_1, judge_2, judge_3, chart_name){
var Canvas = document.getElementById(chart_name);

Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = false;		
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var Data = {
  data: [judge_1, judge_2, judge_3],
  backgroundColor: [
    '#020EEB',
    '#020EEB',
    '#020EEB',
  ],
  borderColor: [
    'white',
    'white',
    'white'
  ],
  borderWidth: 2,
  hoverBorderWidth: 0
};

var chartOptions = {
  scales: {
	xAxes: [{
		ticks: {
                display:false,
				min:0,
				max:120
		},
		gridLines: {
        display: false

		},
		barPercentage: 0.5
    }],
    yAxes: [{
		gridLines: {
        	display: false,
		},
      	barPercentage: 0.65
    }]
  },
	legend:{display:false},
  elements: { 
    rectangle: {
      borderSkipped: 'right',
    }
  }
};

var barChart = new Chart(Canvas, {
  type: 'horizontalBar',
  data: {
    labels: ["Judge 1", "Judge 2", "Judge 3"],
    datasets: [Data],
  },
  options: chartOptions
});
}