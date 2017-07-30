
var maxQuestionNum;
var questionNum = -1;
var quizNum;

 function CheckAnswer()
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
   console.log('QUESTION ' + questionNum);

   document.getElementById('answerSection').innerHTML ="";

   var question = document.getElementById("question");

   $.getJSON('json/quizzes_sample.json',function(data)
   {
     console.log('JSON success');

      var quizArray = data.Quizzes[0];
      console.log(quizArray);
      //Set the question text
      question.innerHTML = '<span style="width: 100%;margin: auto 5px; font-size: 5vh;">'+findId(quizArray, questionNum)+'</span>';
      console.log(quizArray.questions[questionNum].options);

      switch (quizArray.questions[questionNum].type) {
        //text
        case "date":
        console.log("TYPE: date");
          break;
        case "textbox":
        console.log("TYPE: textbox");
        var onsItem= document.createElement('input');
           onsItem.setAttribute('class', "text-input");
           onsItem.setAttribute('ng-model', "text");
           onsItem.setAttribute('style', "style=display: block; width: 100%; height:100%;text-align:center");
           onsItem.setAttribute('placeholder', "ANSWER HERE");
           document.getElementById('answerSection').appendChild(onsItem);
          break;

        //TEXTAREA
        case "textarea":
        console.log("TYPE: textarea");
          break;

          //CHOICE
        case "choice":
          console.log("TYPE: choice");
          $.each(data.Quizzes[0].questions[questionNum].options,function(i,emp){
            var onsItem= document.createElement('button');
              onsItem.setAttribute('class', "button1");
               onsItem.innerHTML = emp;
               document.getElementById('answerSection').appendChild(onsItem);
          });
            break;

            //MULTIPLE CHOICE
            case "multiplechoice":
            console.log("TYPE: mulitpleChoice");
            $.each(data.Quizzes[0].questions[questionNum].options,function(i,emp){
              var onsItem= document.createElement('ons-button');
                 onsItem.setAttribute('modifier', "chevron");
                 onsItem.setAttribute('onclick', "CheckAnswer()");
                 onsItem.setAttribute('style', "height:50%;width:25%;white-space:normal; text-align:center; vertical-align:middle");
                 onsItem.innerHTML = emp;
                 document.getElementById('answerSection').appendChild(onsItem);
            });
              break;

              //SLIDER
              case "slidingoption":
              //Create slider
              var onsItem= document.createElement('ons-range');
                 onsItem.setAttribute('onclick', "CheckAnswer()");
                 onsItem.setAttribute('id', "range-slider");
                 onsItem.setAttribute('max', "2")
                onsItem.setAttribute('value', "1")
                 onsItem.setAttribute('style', "width:100%;");
                 document.getElementById('answerSection').appendChild(onsItem);

                 document.getElementById('range-slider').addEventListener('input', function (event) {
                 document.getElementById('volume-value').innerHTML = `&nbsp;${event.target.value}`;
                 if (event.target.value > 80) {
                   document.getElementById('careful-message').style.display = 'inline-block';
                 } else {
                   document.getElementById('careful-message').style.display = 'none';
                 }
               })
                break;

                //SCALE
                case "scale":
                //Create slider
                var onsItem= document.createElement('ons-range');
                   onsItem.setAttribute('onclick', "CheckAnswer()");
                   onsItem.setAttribute('id', "range-slider");
                   onsItem.setAttribute('max', "2")
                  onsItem.setAttribute('value', "1")
                   onsItem.setAttribute('style', "width:100%;");
                   document.getElementById('answerSection').appendChild(onsItem);

                   document.getElementById('range-slider').addEventListener('input', function (event) {
                   document.getElementById('volume-value').innerHTML = `&nbsp;${event.target.value}`;
                   if (event.target.value > 80) {
                     document.getElementById('careful-message').style.display = 'inline-block';
                   } else {
                     document.getElementById('careful-message').style.display = 'none';
                   }
                 })
                  break;
        default:

      }
   }).fail(function(){
       console.log('error');
   });

   questionNum += 1;
 };

 function findId(thisArray, idToLookFor) {
   console.log(thisArray.questions[questionNum].text);
    return thisArray.questions[questionNum].text.toUpperCase();
}

function CheckAnswer()
{

}
