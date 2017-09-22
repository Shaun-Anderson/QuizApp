/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var URL_GetUsers = 'http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users';
 var URL_GetQuizzes = 'http://introtoapps.com/quizzes_sample.json';

GetQuizzes();

var UserObject = {
  username : String,
  password : String,
  quizzes : []
};
//const URL_GetQuizzes;

var tempScore;
var onsItem;

function GetQuizzes(){
  //Check if the user has already attempted/completed this quiz
   $.getJSON(URL_GetUsers,function(data)
   {
     UserObject = data.Users[localStorage.getItem("userNum")];
     console.log(localStorage.getItem("userNum"));
     console.log(UserObject);

     LoadQuizzes();
   })
}

//Load all the quizzes from the json file
function LoadQuizzes()
{
  //ERROR cannot get access to resource.
  $.getJSON("json/quizzes_sample.json",function(data)
  {

        $.each(data.Quizzes,function(i,emp){
             onsItem = document.createElement('ons-list-item');
             onsItem.setAttribute('id', "item("+i+")");
             onsItem.setAttribute('onclick', "goToMain("+i+")");

             for(i = 0; i < UserObject.quizzes.length; i++)
             {
               if(UserObject.quizzes[i].quizName == emp.title)
               {
                 tempScore = UserObject.quizzes[i].score;
               }
             }
             onsItem.innerHTML = "<div class='left'>" + emp.title +" </div>" + "<div class='right'> Not attempted </div>";


             if(UserObject.quizzes[i-1] != null )
             {
             onsItem.innerHTML = "<div class='left'>" + emp.title +" </div>" + "<div class='right'>" + tempScore + "/" + emp.score +" </div>";
              }else {
             onsItem.innerHTML = "<div class='left'>" + emp.title +" </div>" + "<div class='right'> Not attempted </div>";
              }

             //If the quiz is not scored do not show anything for the right side of the list item.
             if(emp.score == null)
             {
               onsItem.innerHTML = "<div class='left'>" + emp.title +" </div>";
             }
             document.getElementById('quizList').appendChild(onsItem);

      });

      console.log('Loaded quizzes for user: ' +  localStorage.getItem("userNum"));

  }).fail(function(){
    document.getElementById("question").innerHTML = "error";
      console.log('error');
  });

}
//Move to main.html and save the quiz number to be used when accessing it later
function goToMain(pos)
{
   window.location = "main.html";
   localStorage.setItem("_quizNum",pos);
}
