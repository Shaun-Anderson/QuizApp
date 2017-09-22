//ONLOAD build the UI of the sign in Screen.
document.onload = CreateSignIn();

//Variables
var Users;
var _username;
var inputPassword;
var userNum;
//URL consts
var URL_GetUsers = 'http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users';
var URL_AddUserPrefix = 'http://introtoapps.com/datastore.php?action=append&appid=214098128&objectid=users&data=';

var UserObject = {
  Users : []
};

/*
* Creates the sign in UI.
* Changes the value of the username input field to the last username used to sign in if the user has signed in before.
*/
function CreateSignIn(){
  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('id', "usernameInput");
  onsItem.setAttribute('style', "style=display: block; width: 90%; height:20%;text-align:center; background-color: #FFFFFF;margin-top: 20px;font-size:2vh");
  onsItem.setAttribute('placeholder',"Username");

console.log(localStorage.getItem("username"));
if(localStorage.getItem("username"))
{
  console.log("HI");
  onsItem.setAttribute('value',localStorage.getItem("username"));
}

  document.getElementById('inputDiv').appendChild(onsItem);

  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('id', "passwordInput");
  onsItem.setAttribute('style', "style=display: block; width: 90%; height:20%;text-align:center; background-color: #FFFFFF;font-size:2vh");
  onsItem.setAttribute('type',"password");
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

  //Get list of Users and check if the username is currently already in use.
  $.getJSON(URL_GetUsers,function(data)
  {
    Users = data.Users;
    if(CheckUsername())
    {
      // var hashedPassword = Sha256.hash(inputPassword, { outFormat: 'hex-w' });
      //   console.log(hashedPassword);

          UserObject = data;
          UserObject.Users.push({
              "username" : _username,
              "password"  : inputPassword,
              "quizzes" : []
          });

          CreateNewUser();
          localStorage.setItem("username",_username);
          goToMenu();
    }

  }).fail(function(){
      console.log('No data found creating new data');
      CreateNewUser();
      goToMenu();
  });
}

/*
This function will check if the usernames exists and then will test the password matches if it does it will set the "username" item in local storage to be used as the default text for the username UI element.
It will then send the user to menu.html
*/
function CheckSignIn()
{
  _username = document.getElementById('usernameInput').value;
  inputPassword = document.getElementById('passwordInput').value;
  //Get current Users and cycle through usernames to check if it exists if not call dialog saying username not found.
  $.getJSON(URL_GetUsers,function(data)
  {

    Users = data.Users;
    if(!CheckUsername())
    {
      //USERNAME EXISTS
          if(CheckPassword())
          {
            //PASSWORD EXISTS
            localStorage.setItem("username",_username);
            goToMenu();
          }
          else {
            //PASSWORD DOESNT EXIST
            navigator.notification.alert(
              'Incorrect password',  // message
              alertDismissed,         // callback
              'Oops',            // title
              'Ok'                  // buttonName
            );
          }
    }
    else {
      //USERNAME DOESNT EXIST
      navigator.notification.alert(
          'Username does not exist',  // message
          alertDismissed,         // callback
          'oops',            // title
          'OK'                  // buttonName
      );
    }

  }).fail(function(){
      console.log('NO USERS EXIST');
  });
}

function alertDismissed() {
  document.getElementById('passwordInput').innerHTML = "";
}

function goToMenu()
{
   window.location = "menu.html";
}


/*
* formats the new new Userobject and sends it to the database.
*/
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


/*
* Check functions for username and password to see if they match the ones saved on the database
*/
function CheckUsername(){
  for (var i = 0; i < Users.length; i++) {
    if(Users[i].username == _username)
    {
      userNum = i;
      console.log(Users[i].username + " -NAME EXISTS- " + _username);
      localStorage.setItem("userNum",userNum);
      console.log('SET LOCAL SOTRAGE USERNUM: ' + userNum);
      return false;
    }
  }
  return true;
}

function CheckPassword(){
//  var hashedPassword = Sha256.hash(inputPassword, { outFormat: 'hex-w' });

    if(Users[userNum].password == inputPassword)
    {
      console.log(Users[userNum].username + " -PASWORD CORRECT- ");
      return true;
    }
    else {
      //TODO: display password specifc error message
      console.log(Users[userNum].username + " -PASWORD WRONG- ");
      return false;
    }
}
