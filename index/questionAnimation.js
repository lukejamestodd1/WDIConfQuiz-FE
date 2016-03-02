$(function(){
    console.log("HEEEELLLOO")
    var loading = $('#loadbar').hide();
    $(document)
    .ajaxStart(function () {
        loading.show();
    }).ajaxStop(function () {
    	loading.hide();
    });
    
    $("label.btn").on('click',function () {
        console.log('HELLO');
    	var choice = $(this).find('input:radio').val();
    	$('#loadbar').show();
    	$('#quiz').fadeOut();
    	setTimeout(function(){
           $( "#answer" ).html(  $(this).checking(choice) );      
            $('#quiz').show();
            $('#loadbar').fadeOut();
           /* something else */
    	}, 1500);
    });

    $ans = 3 //question.get('answer');

    $.fn.checking = function(ck) {
        if (ck != $ans){
            console.log('INCORRECT');
            return 'INCORRECT';
        }
        else {
            console.log('CORRECT');
            return 'CORRECT';
        }
    }; 
});	
