
var maxQuestionNum;
var questionNum = -1;
var quizNum = localStorage.getItem("_quizNum");
var score = 0;
var quizArray;
var question;

document.onload = InitQuiz();

function InitQuiz()
{
  score = 0;
  question = document.getElementById("question");
  NextQuestion();
}
//NextQuestion will do everything to set up the next question such as clearing the values from the previous question and then it uses the json information to create the new UI
 function NextQuestion()
 {
   document.getElementById('answerSection').innerHTML ="";

   $.getJSON('json/quizzes_sample.json',function(data)
   {
     //Update progress bar
      quizArray = data.Quizzes[quizNum];
      var percent = questionNum/quizArray.questions.length * 100;
      var percentBar = document.getElementById('myBar');
      percentBar.style.width = percent + "%";

      //Set the question text
      question.innerHTML = '<span style="width: 90%; height: 100%;font-size: 4vh; margin-top: 5%; display: block; color:#DAF7A6">'+findId(quizArray, questionNum)+'</span>';
      //Switch statement that builds the UI depending on the type of question
      switch (quizArray.questions[questionNum].type) {
        case "date":
        console.log("TYPE: date");
          Build_Date();
          break;
        case "textbox":
          Build_Textbox();
          break;
        case "textarea":
          Build_TextArea();
          break;
        case "choice":
          Build_Choice(quizArray);
          break;
        case "multiplechoice":
          Build_MultipleChoice();
          break;
        case "slidingoption":
          Build_SlidingOption();
          break;
        case "scale":
          Build_Scale();
          break;
        default:

      }
   }).fail(function(){
       console.log('error');
   });

   questionNum += 1;

   console.log(questionNum);
 };

 function findId(thisArray, idToLookFor) {
   console.log(thisArray.questions[questionNum].text);
    return thisArray.questions[questionNum].text.toUpperCase();
}

function CheckAnswer(thisAnswer)
{
  var _answer = thisAnswer;

  $.getJSON('json/quizzes_sample.json',function(data)
  {
      if(quizArray.score)
      {
        console.log("SCORE THIS QUIZ");
        if(thisAnswer == quizArray.questions[questionNum].answer)
        {
          console.log("CORRECT");
          if(questionNum +1 == quizArray.questions.length)
          {
            EndScreen();
          }
          else {
            NextQuestion();
          }
        }
        else
        {
          console.log("INCORRECT");
          if(questionNum +1== quizArray.questions.length)
          {
            EndScreen();
          }
          else {
            NextQuestion();
          }
        }
      }
      else {
        console.log("hiiiiiiiii");

        if(questionNum +1== quizArray.questions.length)
        {
          EndScreen();
        }
        else {
          NextQuestion();
        }
      }
  })
  .fail(function(){console.log('error')});
}

//The end screen of a quiz. Involves the score and a button to return user to menu.
function EndScreen()
{
  //Fill up progress bar
  questionNum += 1;
  var percent = questionNum/quizArray.questions.length * 100;
  var percentBar = document.getElementById('myBar');
  percentBar.style.width = percent + "%";

  //Clear former values
  question.innerHTML = "";
  document.getElementById('answerSection').innerHTML ="";
  //Set new values
  var scoreText= document.createElement('p');
  scoreText.setAttribute('style', "width:100%;height:20%;font-size:5vh");
  scoreText.innerHTML = "<b>COMPLETE</b><br><br><b>SCORE: </b>" + score + "<br>";
  document.getElementById('answerSection').appendChild(scoreText);
  // TODO: ADD SAVING DATA TO THE DB


  var onsItem= document.createElement('button');
  onsItem.setAttribute('class', "button1");
  onsItem.setAttribute('id', "returnbutton");
  onsItem.setAttribute('onclick',"ReturnToMenu();");
  onsItem.setAttribute('style',"margin-top:10%");
  onsItem.innerHTML = "BACK TO MENU";
  document.getElementById('answerSection').appendChild(onsItem);
}

function ValidateTextbox()
{
  quizArray.questions[questionNum].validate;
}

function ReturnToMenu()
{
  window.location = "index.html";
}

function multipleAddAnswer()
{
}

function Build_Date(){
  var onsItem= document.createElement('input');
  onsItem.setAttribute('type', "date");
  onsItem.setAttribute('style', "width:100%;height:100%; background-color:#FFF09B;border: 0 ;text-align:center; font-size:5vh");

  document.getElementById('answerSection').appendChild(onsItem);

  var nextbutton= document.createElement('button');
     nextbutton.setAttribute('class', "nextButton");
     nextbutton.setAttribute('onclick', "NextQuestion()");
     nextbutton.innerHTML = "NEXT";
     document.getElementById('answerSection').appendChild(nextbutton);
}

//Build functions for the different question types
function Build_MultipleChoice(){
  $.each(quizArray.questions[questionNum].options,function(i,emp){
    var onsItem= document.createElement('button');
      onsItem.setAttribute('class', "button1");
      onsItem.setAttribute('id', "choiceButton" + i);
      var thisID = onsItem.id;
      onsItem.setAttribute('onclick',
      "multipleAddAnswer();"+
      "document.getElementById('"+thisID+"').className = 'button2'");
       onsItem.innerHTML = emp;
       document.getElementById('answerSection').appendChild(onsItem);
       console.log(document.getElementById(thisID).value);
  });
  var nextbutton= document.createElement('button');
  nextbutton.setAttribute('class', "nextButton");
  nextbutton.setAttribute('onclick', "CheckAnswer(document.getElementById('choiceButton0').value)");
  nextbutton.innerHTML = "NEXT";
  document.getElementById('answerSection').appendChild(nextbutton);
}
function Build_Choice(data){
  $.each(data.questions[questionNum].options,function(i,emp){
    var onsItem= document.createElement('button');
      onsItem.setAttribute('class', "button1");
      onsItem.setAttribute('id', "choiceButton" + i);
      var thisID = onsItem.id;
      onsItem.setAttribute('onclick', "CheckAnswer(document.getElementById('"+ thisID +"').value)");

       onsItem.innerHTML = emp;
       document.getElementById('answerSection').appendChild(onsItem);
       console.log(document.getElementById(thisID).value);

  });
}
function Build_Textbox(){
  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('pattern', "[0-9]");
  onsItem.setAttribute('id', "textInput");
  onsItem.setAttribute('style', "style=display: block; width: 100%; height:100%;text-align:center");
  if(quizArray.questions[questionNum].help){onsItem.setAttribute('placeholder', quizArray.questions[questionNum].help);} else {onsItem.setAttribute('placeholder', "Text here"); }
  document.getElementById('answerSection').appendChild(onsItem);

  var nextbutton= document.createElement('button');
  nextbutton.setAttribute('class', "nextButton");
  nextbutton.setAttribute('onclick', "CheckAnswer(document.getElementById('textInput').value)");
  nextbutton.innerHTML = "NEXT";
  document.getElementById('answerSection').appendChild(nextbutton);
}
function Build_TextArea(){
  var onsItem= document.createElement('textarea');
    onsItem.setAttribute('rows', "10");
    onsItem.setAttribute('id', "textInput");
    onsItem.setAttribute('style', "style=display: block; width: 90%; height:90%;text-align:center");
    document.getElementById('answerSection').appendChild(onsItem);

    var nextbutton= document.createElement('button');
    nextbutton.setAttribute('class', "nextButton");
    nextbutton.setAttribute('onclick', "CheckAnswer(document.getElementById('textInput').value)");
    nextbutton.innerHTML = "NEXT";
    document.getElementById('answerSection').appendChild(nextbutton);
}
function Build_Scale(){
  var output= document.createElement('p');
  output.setAttribute('id', "scaleOutput");
  output.setAttribute('style', "font-size: 2vh")
  document.getElementById('answerSection').appendChild(output);

  //Create slider
  var onsItem= document.createElement('ons-range');
     onsItem.setAttribute('onclick', "CheckAnswer()");
     onsItem.setAttribute('id', "range-slider");
     onsItem.setAttribute('max', quizArray.questions[questionNum].end)
     onsItem.setAttribute('min', quizArray.questions[questionNum].start)
    onsItem.setAttribute('value', "0")
    onsItem.setAttribute('step', quizArray.questions[questionNum].increment)
     onsItem.setAttribute('style', "width:90%;");
     document.getElementById('answerSection').appendChild(onsItem);
     output.innerHTML = onsItem.value;
     document.getElementById('range-slider').addEventListener('input', function (event) {
     document.getElementById('scaleOutput').innerHTML = `&nbsp;${event.target.value}`;
   })

   var nextbutton= document.createElement('button');
      nextbutton.setAttribute('class', "nextButton");
      nextbutton.setAttribute('onclick', "CheckAnswer()");
      nextbutton.innerHTML = "NEXT";
      document.getElementById('answerSection').appendChild(nextbutton);
}
function Build_SlidingOption(){
  var html = "  <ons-carousel swipeable overscrollable auto-scroll  var='carousel' id='carousel' style='width:100%;height:100%'>";
  var thisText;
  var emoticon;
  var amount = 0;
  $.each(quizArray.questions[questionNum].options,function(i,emp){
    thisText = emp;
    amount = i;

    emoticon = quizArray.questions[questionNum].optionVisuals[i];
    html += "<ons-carousel-item id= answer"+i+"><div style='font-size:5vh;text-align: center;vertical-align: middle;'>" +emoticon+ "<br>" + thisText +"</div></ons-carousel-item>";
  });

    document.getElementById('answerSection').innerHTML = html;

    for(i = 0; i <=amount;i++){
      var ele = document.getElementById('answer' + i);
      ele.setAttribute('onclick', "NextQuestion()");
    }
}
