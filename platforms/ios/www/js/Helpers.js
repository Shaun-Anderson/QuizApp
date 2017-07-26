 function GetQuizData()
 {
   document.getElementById("question").innerHTML = "nothing happened";

     $.getJSON('json/quizzes_sample.json',function(data)
     {
       document.getElementById("question").innerHTML = "success";
         $.each(data.questions,function(i,emp){
           document.getElementById("question").innerHTML = emp.type;
         });
     }).fail(function(){
       document.getElementById("question").innerHTML = "error";

         console.log('error');
     });

 };
