//================= MODELS =================//
var Question = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/api/questions'
});

var Quiz = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/api/quizzes'
});

var User = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/api/users'
});


//=============== COLLECTIONS ==============//
var Questions = Backbone.Collection.extend({
	model: Question,
	url: 'http://localhost:3000/api/questions'
});

var Quizzes = Backbone.Model.extend({
	model: Quiz,
	urlRoot: 'http://localhost:3000/api/quizzes'
});

var Users = Backbone.Model.extend({
	model: User,
	urlRoot: 'http://localhost:3000/api/users'
});


//================== VIEWS =================//

//=== MAIN MENU VIEW ===//
var MainMenuView = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: $('#mainMenuTemplate').html(),
  render: function() {
    var html = Mustache.render(this.template);
		this.$el.html(html);
		return this;
  }
});

//=== QUIZ TITLE VIEW ===//
var QuizTitlePageView = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: $('#quizTitlePageTemplate').html(),
  render: function() {
    var html = Mustache.render(this.template, this.model.toJSON());
		this.$el.html(html);
		return this;
  }
});

//=== QUIZ MENU ITEM VIEW ===//
var QuizItemTemplateView = Backbone.View.extend({
  tagName: 'div',
  className: 'col-md-3 col-sm-6 hero-feature',
  template: $('#quizMenuItemTemplate').html(),

  //if logged in display buttons etc....

  render: function() {
    var html = Mustache.render(this.template, this.model);
		this.$el.html(html);
		return this;
  }
});

//=== QUIZ QUESTION VIEW ===//
var QuestionPageView = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: $('#quizQuestionTemplate').html(),

  events: {
  	'click .quiz label': 'abc'
  },

	abc: function (event) {
				//get question info
				var selectedAnswer = $(event.target).closest('.btn').find('#answer').html();
				
				console.log(selectedAnswer);
				//check answer
				if (selectedAnswer == this.model.get('answer'))
					console.log('CORRECT');
				else
					console.log('INCORRECT');
				//if correct update user score
		},

  render: function() {
    var html = Mustache.render(this.template, this.model.toJSON());
		this.$el.html(html);
		return this; 
  },
});


//=== CHART TOTALS VIEW ===//
var ChartTotalsView = Backbone.View.extend({
  tagName: 'div',
  template: $('#totalsTemplate').html(),
  
  //move logic from routes function to here

  render: function() {
    var html = Mustache.render(this.template);
		this.$el.html(html);
		return this;
  }
});




//========== SETUP PAGE FUNCTIONS ==========//

//=== CLEAR SCREEN ===//collect all elements and remove
var setupBody = function() {
  $('body').children().each( function(child) {
      $(this).remove();
	});
}

//=========== ROUTER DECLARATION ===========//

var Router = Backbone.Router.extend({

	//=== ROUTES ===//
	routes: {
			"": "showIndex",
			"quiz/:qid": "showQuiz",
			"quiz/:qid/question/:id": "showQuestion",
			"quiz/:qid/results": "showResults",
			"totals": "showTotals"
	},

	//=== INDEX/HOME PAGE ===//quiz main menu
	showIndex: function(){
		setupBody();
		var mainMenu = new MainMenuView();
		$('body').append(mainMenu.render().el);

		var quizzes = new Quizzes();
		quizzes.fetch().done(function(quizzes){
			_.each(quizzes, function(quiz){
				var quizItemTemplate = new QuizItemTemplateView({ model: quiz});
				$('#listArea').append(quizItemTemplate.render().el);
			});
		});	
	},

	//=== QUIZ TITLE PAGE ===//for each quiz
	showQuiz: function(qid){
		setupBody();
		var quiz = new Quiz({id: qid});
		quiz.fetch().done(function(){
			
			var quizTitlePageView = new QuizTitlePageView({model: quiz});
			$('body').append(quizTitlePageView.render().el);
			
			var questionsAll = new Questions();

			questionsAll.fetch().done(function(questions){

				var questions = questionsAll.where({quiz_id: parseInt(qid)});
				
				_.each(questions, function(question){
					// console.log(question);
					//make a question view template for each Q
					var questionTemplate = new QuestionPageView({model: question});
					$('body').append(questionTemplate.render().el);

					//hide other questions
					
				});
			});
		});
	},

	//=== QUESTION PAGE ===//for each question
	showQuestion: function(id){
		//not used: showing all questions on same page atm
	},

	//=== RESULTS PAGE ===//after each quiz
	showResults: function(){
		//not used: only showing totals atm
	},

	//=== TOTALS PAGE ===//end of quiz
	showTotals: function(){
		setupBody();

		var header = new MainMenuView();
		$('body').append(header.render().el);
		$('#headerText').html('Results');
		$('#subheaderText').html('the totals so far');

		var chartTotalsView = new ChartTotalsView();
		$('#listArea').append(chartTotalsView.render().el);

		//to give a random score - CHANGE WHEN HAVE DATA
		var randomScalingFactor = function(){ return Math.round(Math.random()*100)};

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
});

//============== START ROUTER ==============//
$(document).ready( function() {
  console.log('Initiating router...');
  var router = new Router();
  Backbone.history.start();
});





