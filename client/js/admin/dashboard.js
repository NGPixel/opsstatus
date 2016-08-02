
// ====================================
// TDashboard (Admin)
// ====================================

if($('#admin-dashboard').length) {

	var ctx = document.getElementById("chartIncidents");
	var myChart = new Chart(ctx, {
    type: 'line',
    data: {
	        labels: ["March", "April", "May", "June", "July", "August"],
	        datasets: [{
	            label: '# of Incidents',
	            data: [12, 19, 3, 5, 2, 3],
	            backgroundColor: 'rgba(255, 99, 132, 0.2)',
	            borderColor: 'rgba(255,99,132,1)',
	            borderWidth: 1
	        }]
	    },
	    options: {
	    	responsiveAnimationDuration: 400,
	    	maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
	    }
	});

}