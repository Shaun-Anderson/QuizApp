//ONLOAD build the UI of the sign in Screen.
document.onload = CreateSignIn();

//Variables
var Users;
var _username;
var inputPassword;
//URL consts
const String URL_GetUsers = 'http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users';
const String URL_AddUserPrefix = 'http://introtoapps.com/datastore.php?action=append&appid=214098128&objectid=users&data=';

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

//Check the input from the user when the sign up button is pressed.
function CheckSignUp()
{
  _username = document.getElementById('usernameInput').value;
  inputPassword = document.getElementById('passwordInput').value;

  //Simple check if nothing is entered in either input
  if(_username == "" || inputPassword == "")
  {
    return null;
  }

  var UserObject = {
    Users : []
  };

  //Get list of Users and check if the username is currently already in use.
  $.getJSON(URL_GetUsers,function(data)
  {
    Users = data.Users;
    if(CheckUsername())
    {
          UserObject = data;
          UserObject.Users.push({
              "username" : _username,
              "password"  : inputPassword
          });

          CreateNewUser();
    }

  }).fail(function(){
      console.log('No data found creating new data');
      CreateNewUser();
  });
}

function CheckSignIn()
{
  //Get current Users and cycle through usernames to check if it exists if not call dialog saying username not found.
  $.getJSON(URL_GetUsers,function(data)
  {

    Users = data.Users;
    if(CheckUsername())
    {
      //USERNAME EXISTS
          if(CheckPassword())
          {

            //PASSWORD EXISTS
            goToMain();
          }
          else {
            //PASSWORD DOESNT EXIST
          }
    }
    else {
      //USERNAME DOESNT EXIST
    }

  }).fail(function(){
      console.log('NO USERS EXIST');
  });
  }
  //Check if the password entered is the same as the one for the username.

  //Move to next page
}

function goToMain(pos)
{
   window.location = "index.html";
   localStorage.setItem("_quizNum",pos);
}

function CreateNewUser(){
  var jsonData = JSON.stringify(UserObject);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      {
      console.log("Created ");
      }
  }
  xmlHttp.open("GET",  URL_AddUserPrefix + encodeURIComponent(jsonData), true);
  xmlHttp.send();
}

function ErrorMessage(String message){

}

function CheckUsername(){
  for (var i = 0; i < Users.length; i++) {
    if(Users[i].username == _username)
    {
      console.log(Users[i].username + " -NAME EXISTS- " + _username);
      return false;
    }
  }
  return true;
}

function CheckPassword(){
  for (var i = 0; i < Users.length; i++) {
    if(Users[i].password == inputPassword)
    {
      console.log(Users[i].username + " -PASWORD CORRECT- ");
      return true;
    }
    else {
      //TODO: display password specifc error message
      console.log(Users[i].username + " -PASWORD WRONG- ");
      return false;
    }
  }
}
