 function GetQuizData()
 {
   console.log('HIIII');

   var question = document.getElementById("question");

     $.getJSON('json/quizzes_sample.json',function(data)
     {
        //question.innerHTML = "data.Quizzes";
         $.each(data.Quizzes,function(i,emp){
           question.innerHTML = question.innerHTML + emp.title;
         });
     }).fail(function(){
       document.getElementById("question").innerHTML = "error";
         console.log('error');
     });
 };



 function NextQuestion()
 {

 };
