
var maxQuestionNum;
var questionNum = -1;
var quizNum = localStorage.getItem("_quizNum");
var answersCorrect = 0;
var score = 0;
var quizArray;
var question;
var multiAnswer = [];

var Users;
var userNum;

var UserObject = {
  Users : []
};

//URL consts
var URL_GetUsers = 'http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users';
var URL_AddUserPrefix = 'http://introtoapps.com/datastore.php?action=append&appid=214098128&objectid=users&data=';


document.onload = InitQuiz();

function InitQuiz()
{
  userNum = localStorage.getItem("userNum");
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
  var answered = true;
  console.log(thisAnswer);


  $.getJSON('json/quizzes_sample.json',function(data)
  {
      if(quizArray.score)
      {
        console.log("SCORE THIS QUIZ");
        if(quizArray.questions[questionNum].answer)
        {

          /*Get answer or array of answers depending on the type of question
          Examples:
          Multiplechoice needs all in the array to be correct.
          Textbox can have one or more ways to answer the question.
          */
          var answer = quizArray.questions[questionNum].answer;
          if(answer.constructor === Array)
          {
            /*
            * If multiple choice check if the size of the answer array is the size of the set answers array if it then then loop through to check
            * if the any of the answers are not in the actual answer array.
            */
            console.log(quizArray.questions[questionNum].type);
            switch (quizArray.questions[questionNum].type) {
              case "multiplechoice":

                  if(answer.length != thisAnswer.length)
                  for (i = 0; i < answer.length; i++)
                    {
                        if(thisAnswer == answer[i])
                          {
                              console.log("CORRECT");
                          }
                          else
                          {
                              console.log("INCORRECT");
                          }
                    }
                break;

                case "textbox":
                    for (i = 0; i < answer.length; i++)
                      {
                          if(thisAnswer == answer[i])
                            {
                                answered = true
                            }
                      }
                  break;
              default:

            }

            //If question is answer add to both score and answers correct and then nove to either the next question or end screen depending on what question the user is up to.
            if(answered)
            {
              console.log("CORRECT");
              score += quizArray.questions[questionNum].weighting;
              answersCorrect += 1;
              if(questionNum +1 == quizArray.questions.length)
              {
                EndScreen();
              }
              else {
                NextQuestion();
              }
            }
            else {
              if(questionNum +1 == quizArray.questions.length)
              {
                EndScreen();
              }
              else {
                NextQuestion();
              }
            }
          }
          else {
            console.log("ANSWER NOT ARRAY");
            if(thisAnswer == answer)
            {
              console.log("CORRECT");
              answersCorrect += 1;
              if(questionNum +1 == quizArray.questions.length)
              {
                EndScreen();
              }
              else {
                NextQuestion();
              }
            }
            else {
              console.log("INCORRECT");
              if(questionNum +1 == quizArray.questions.length)
              {
                EndScreen();
              }
              else {
                NextQuestion();
              }
            }
          }
        }
        else
        {
          console.log("QUESTION NOT SCORED");
          if(questionNum +1 == quizArray.questions.length)
          {
            EndScreen();
          }
          else {
            NextQuestion();
          }
        }
      }
      else {
        console.log("QUIZ NOT SCORED");

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

//Display the endscreen. This screen will show the user thier score if the quiz was one that has a score
function EndScreen()
{
  //Fill up progress bar
  questionNum += 1;
  var percent = questionNum/quizArray.questions.length * 100;
  var percentBar = document.getElementById('myBar');
  percentBar.style.width = percent + "%";



  //Clear former values
  question.innerHTML = '<span style="width: 90%; height: 100%;font-size: 5vh; margin-top: 5%; display: block; color:#DAF7A6"> COMPLETED <br> '+quizArray.title+'</span>';
  document.getElementById('answerSection').innerHTML ="";
  //Set new values

  if(quizArray.score) {
  var scoreText= document.createElement('p');
  scoreText.setAttribute('style', "width:100%;height:20%;font-size:4vh; color:#FFFFFF");
  scoreText.innerHTML = "<b>ANSWERS CORRECT: </b>" + answersCorrect + "/" + quizArray.questions.length+"<br> <b>SCORE: </b>" + score + " / "+quizArray.score+"<br><b>PERCENT: </b> " + (score/quizArray.score*100) + "%";
  document.getElementById('answerSection').appendChild(scoreText);
  // TODO: ADD SAVING DATA TO THE DB

  $.getJSON(URL_GetUsers,function(data)
  {
    var scoreExists = false;
    UserObject = data;
    console.log(UserObject.Users[userNum].quizzes.length);

    for(i = 0; i < UserObject.Users[userNum].quizzes.length; i++)
    {
      if(UserObject.Users[userNum].quizzes[i].quizName == quizArray.title)
      {
        console.log("Score exists overwiritng");

        UserObject.Users[userNum].quizzes[i] = { "quizName" : quizArray.title, "score" : score }
      scoreExists = true;
      }
    }


    if(!scoreExists)
    {
      console.log("No score exist pushing new one");

      UserObject.Users[userNum].quizzes.push({
          "quizName" : quizArray.title,
          "score" : score
      });
    }

    var jsonData = JSON.stringify(UserObject);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
        console.log("SAVED SCORE ");
        }
    }
    xmlHttp.open("GET",  URL_AddUserPrefix + encodeURIComponent(jsonData), true);
    xmlHttp.send();
  })
}

  var onsItem= document.createElement('button');
  onsItem.setAttribute('class', "button1");
  onsItem.setAttribute('id', "returnbutton");
  onsItem.setAttribute('onclick',"ReturnToMenu();");
  onsItem.setAttribute('style',"margin-top:10%");
  onsItem.innerHTML = "BACK TO MENU";
  document.getElementById('answerSection').appendChild(onsItem);

}

function CheckUsername(){
  for (var i = 0; i < Users.length; i++) {
    if(Users[i].username == _username)
    {
      userNum = i;
      console.log(Users[i].username + " -NAME EXISTS- " + _username);
      return false;
    }
  }
  return true;
}

function ValidateTextbox()
{
  quizArray.questions[questionNum].validate;
}

function ReturnToMenu()
{
  window.location = "menu.html";
}

function multipleAddAnswer(answer)
{
  console.log("MULTIADD" + answer);

  multiAnswer.push(answer)
  console.log(multiAnswer);

  // TODO: add remove from answer array
}

function Build_Date(){
  var onsItem= document.createElement('input');
  onsItem.setAttribute('type', "date");
  onsItem.setAttribute('style', "width:100%;height:100%;border: 0 ;text-align:center; font-size:5vh; background-color: rgba(0,0,0,0); color:#FFFFFF");

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
      onsItem.setAttribute('onclick', "multipleAddAnswer('" + emp + "');" + "document.getElementById('"+thisID+"').className = 'button2'");
       onsItem.innerHTML = emp;
       document.getElementById('answerSection').appendChild(onsItem);
       console.log(document.getElementById(thisID).value);
  });
  var nextbutton= document.createElement('button');
  nextbutton.setAttribute('class', "nextButton");
  nextbutton.setAttribute('onclick', "CheckAnswer(multiAnswer)");
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
  onsItem.setAttribute('style', "style=display: block; width: 100%; height:100%;text-align:center;font-size: 5vh; color:#FFFFFF");
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
    onsItem.setAttribute('id', "rounded");
    onsItem.setAttribute('style', "style=display: block; width: 90%; height:90%;text-align:center");
    document.getElementById('answerSection').appendChild(onsItem);

    var nextbutton= document.createElement('button');
    nextbutton.setAttribute('class', "nextButton");
    nextbutton.setAttribute('onclick', "CheckAnswer(document.getElementById('rounded').value)");
    nextbutton.innerHTML = "NEXT";
    document.getElementById('answerSection').appendChild(nextbutton);
}
function Build_Scale(){
  var output= document.createElement('p');
  output.setAttribute('id', "scaleOutput");
  output.setAttribute('style', "font-size: 5vh; color:#FFFFFF")
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
    html += "<ons-carousel-item id= answer"+i+" class='rounded' style='background-color:#FFFFFF; vertical-align:middle;'><div style='font-size:5vh;text-align: middle; margin:auto; height:100%; vertical-align:middle'>" +emoticon+ "<br>" + thisText +"</div></ons-carousel-item>";
  });

    document.getElementById('answerSection').innerHTML = html;

    for(i = 0; i <=amount;i++){
      var ele = document.getElementById('answer' + i);
      ele.setAttribute('onclick', "NextQuestion()");
    }
}
