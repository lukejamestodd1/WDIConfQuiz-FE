//================= MODELS =================//
var Question = Backbone.Model.extend({
	urlRoot: 'http://localhost:3000/api/questions'
});


//=============== COLLECTIONS ==============//
var Questions = Backbone.Collection.extend({
	model: Question,
	url: 'http://localhost:3000/api/questions'
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
    var html = Mustache.render(this.template);
		this.$el.html(html);
		return this;
  }
});

//=== QUIZ QUESTION VIEW ===//
var QuestionPageView = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: $('#quizQuestionTemplate').html(),
  render: function() {
    var html = Mustache.render(this.template, this.model.toJSON());
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
			"quiz/:id": "showQuiz",
			"quiz/:id/question/:id": "showQuestion",
			"quiz/:id/results": "showResults",
			"totals": "showTotals"
	},

	//=== INDEX/HOME PAGE ===//quiz main menu
	showIndex: function(){
		
		var nSpeakers = 6;
		var quizArray = [];

		setupBody();
		var mainMenu = new MainMenuView();
		$('body').append(mainMenu.render().el);
		
		for (var i = 1; i < nSpeakers; i++){
			var quiz = new Questions({speaker_no: i});
			quiz.fetch().done(function(){
				quizArray.push(quiz);
				console.log(quizArray[i-1]);
			});
		}


	},

	//=== QUIZ TITLE PAGE ===//for each quiz
	showQuiz: function(){
		setupBody();
		console.log('HELLO');
		var quizTitlePageView = new QuizTitlePageView();
		$('body').append(quizTitlePageView.render().el);
	},

	//=== QUESTION PAGE ===//for each question
	showQuestion: function(){
		setupBody();

		

		question = new Question({id: 21});
		question.fetch().done(function(){

			var questionPage = new QuestionPageView({model: question});
			$('body').append(questionPage.render().el);

			$('#qid').html(question.get('content'));
			$('#answer1').html(question.get('a'));
			$('#answer2').html(question.get('b'));
			$('#answer3').html(question.get('c'));
			$('#answer4').html(question.get('d'));
		});
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





