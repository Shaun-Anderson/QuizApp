 function GetQuizData()
 {
   document.getElementById("question").innerHTML = "nothing happened";

     $.getJSON('json/quizzes_sample.json',function(data)
     {
       document.getElementById("question").innerHTML = "success";
         $.each(data.title,function(i,emp){
           document.getElementById("question").innerHTML = emp;
         });
     }).fail(function(){
       document.getElementById("question").innerHTML = "error";

         console.log('error');
     });

 };
