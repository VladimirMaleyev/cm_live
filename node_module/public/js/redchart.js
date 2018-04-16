function redchart(judge_1, judge_2, judge_3, chart_name){
var Canvas = document.getElementById(chart_name);

Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = false;	
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

judge_1="-"+judge_1;
judge_2="-"+judge_2;
judge_3="-"+judge_3;
	
var Data = {
  data: [judge_1, judge_2, judge_3],
  backgroundColor: [
    '#EA0101',
    '#EA0101',
    '#EA0101',
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
  showAllTooltips:false,
  scales: {
	xAxes: [{
		ticks: {
                display:false
		},
		gridLines: {
        display: false

		},
      	barPercentage: 0.25
    }],
    yAxes: [{
		position:'right',
		gridLines: {
        	display: false,
		},
      	barPercentage: 0.5
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