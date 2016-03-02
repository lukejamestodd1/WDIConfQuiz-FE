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
  	// 'click label.btn': 'abc',
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
				//console.log(questions[0]);

				// var url = "#quiz/" + qid + "/question/" + questions[0].get('id');
				// console.log(url);
				// $('#nextQuestion').attr("href", url);

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
		// setupBody();
		// question = new Question({id: id});
		// question.fetch().done(function(){
		// 	var questionPage = new QuestionPageView({model: question});
		// 	$('body').append(questionPage.render().el);
		// 	$('#qid').html(question.get('content'));
		// 	$('#answer1').html(question.get('a'));
		// 	$('#answer2').html(question.get('b'));
		// 	$('#answer3').html(question.get('c'));
		// 	$('#answer4').html(question.get('d'));
		// });
	},

	//=== RESULTS PAGE ===//after each quiz
	showResults: function(){

	},

	//=== TOTALS PAGE ===//end of quiz
	showTotals: function(){

	}
});

//============== START ROUTER ==============//
$(document).ready( function() {
  console.log('Initiating router...');
  var router = new Router();
  Backbone.history.start();
});





