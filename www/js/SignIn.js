document.onload = CreateSignIn();

var Users;
var _username;
//Create the sign in UI
function CreateSignIn(){
  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('id', "usernameInput");
  onsItem.setAttribute('style', "style=display: block; width: 90%; height:20%;text-align:center; background-color: #FFFFFF;margin-top: 40%;");
  onsItem.setAttribute('placeholder',"Username");
  document.getElementById('inputDiv').appendChild(onsItem);

  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('id', "passwordInput");
  onsItem.setAttribute('style', "style=display: block; width: 90%; height:20%;text-align:center; background-color: #FFFFFF");
  onsItem.setAttribute('placeholder',"Password");
  document.getElementById('inputDiv').appendChild(onsItem);

  var signInButton= document.createElement('button');
  signInButton.setAttribute('class', "signInButton");
  signInButton.setAttribute('onclick', "CheckSignIn()");
  signInButton.setAttribute('style', "display: block;height: 15%; background-color: #41C9C9;text-align:center");
  signInButton.innerHTML = "SIGN IN";
  document.getElementById('inputDiv').appendChild(signInButton);
  var signUpButton= document.createElement('button');
  signUpButton.setAttribute('class', "signUpButton");
  signUpButton.setAttribute('onclick', "CheckSignUp()");
  signUpButton.setAttribute('style', "height: 30%; width: 80%;");
  signUpButton.innerHTML = "SIGN UP";
  document.getElementById('buttonDiv').appendChild(signUpButton);

}

function CheckSignUp()
{
  _username = document.getElementById('usernameInput').value;
  var _password = document.getElementById('passwordInput').value;

  //Simple check if nothing is entered in either input
  if(_username == "" || _password == "")
  {
    return null;
  }

  var UserObject = {
    Users : []
  };

  //Get list of Users and check if the username is currently being used by a user
  $.getJSON('http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users',function(data)
  {
    console.log("USER DATA EXISTS");
    console.log(data);

    Users = data.Users;
    if(CheckUsername())
    {
          UserObject = data;
          UserObject.Users.push({
              "username" : _username,
              "password"  : _password
          });

          var jsonData = JSON.stringify(UserObject);
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.onreadystatechange = function() {
              if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              {
              console.log("ADDED USER" + _username);
              }
          }
          xmlHttp.open("GET",  "http://introtoapps.com/datastore.php?action=append&appid=214098128&objectid=users&data=" + encodeURIComponent(jsonData), true);
          xmlHttp.send();
    }

  }).fail(function(){
      console.log('ERROR');

      var jsonData = JSON.stringify(UserObject);
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          {
          console.log("Created ");
          }
      }
      xmlHttp.open("GET",  "http://introtoapps.com/datastore.php?action=save&appid=214098128&objectid=users&&data=" + encodeURIComponent(jsonData), true);
      xmlHttp.send();
  });
}

function CheckSignIn()
{
  //Get current Users and cycle through usernames to check if it exists if not call dialog saying username not found.

  //Check if the password entered is the same as the one for the username.

  //Move to next page
goToMain();
}

function goToMain(pos)
{
   window.location = "index.html";
   localStorage.setItem("_quizNum",pos);
}

function CheckUsername()
{
  for (var i = 0; i < Users.length; i++) {
    if(Users[i].username == _username)
    {
      console.log(Users[i].username + " -NAME EXISTS- " + _username);
      return false;
    }
  }
  return true;
}
