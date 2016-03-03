

//to give a random score
var randomScalingFactor = function(){ return Math.round(Math.random()*100)};

var User = Backbone.Model.extend({
urlRoot: 'http://localhost:3000/api/users'
});

var Users = Backbone.Model.extend({
	model: User,
	urlRoot: 'http://localhost:3000/api/users'
});
	
window.onload = function(){
		
	var namesArray = []
	var scoresArray = []
	var users = new Users();

	users.fetch().done(function(users){
		
		_.each(users, function(user){
			console.log(user.name);
			namesArray.push(user.name);
			console.log(user.score);
			//CHANGE THIS WHEN REAL SCORES ARE AVAILABLE
			scoresArray.push(user.score + randomScalingFactor());
		});
		
		console.log(namesArray);

		var barChartData = {
		labels : namesArray,
		datasets : [
			// {
			// 	fillColor : "rgba(220,220,220,0.5)",
			// 	strokeColor : "rgba(220,220,220,0.8)",
			// 	highlightFill: "rgba(220,220,220,0.75)",
			// 	highlightStroke: "rgba(220,220,220,1)",
			// 	data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
			// },
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(151,187,205,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : scoresArray
			}
		]

	}

		var ctx = document.getElementById("canvas").getContext("2d");
		window.myBar = new Chart(ctx).Bar(barChartData, {
		responsive : true
	});




	});







	









	
}





