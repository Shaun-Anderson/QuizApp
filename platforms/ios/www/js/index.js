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
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        if( isAndroid() ) {
     var matches = device.version.match( /[0-9]+(\.[0-9]+)?/i );

     if( matches.length && parseFloat( matches[ 0 ] ) < 4.2 ) {
         document.body.style.zoom = 1 / window.devicePixelRatio;
     }
 }
        // Get the button, and when the user clicks on it, execute myFunction
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

  /*  var divGD = ons.GestureDetector(document.querySelector('#my-div'));
    divGD.on('dragup dragdown', function(event) {
      console.log('drag Y axis');
    });*/



};

app.initialize();

function isAndroid() {
    if( device.platform.match( /android/i ) ) {
        return true;
    }

    return false;
}

function LoadQuizzes()
{
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

  var onsItem= document.createElement('ons-list-item');
       onsItem.setAttribute('modifier', "chevron");
       onsItem.setAttribute('onclick', "functionName()");
       onsItem.innerHTML = emp.title;
document.getElementById('quizList').appendChild(onsItem);
}

function goToMain()
{
   window.location = "main.html";
}
