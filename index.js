const express = require('express');
let dateformat = require('dateformat');
let path = require('path');
let ejs = require('ejs');
let app = express();

const months = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// tell express to read base html page as ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/views')));

// base page with no parameters - show instructions html page
app.get('/', function (request, response) {
  response.render('index');
});

// the /:time part will store whatever user types after name of app in an object with the key 'time'; the value can be accessed through request.params.time
app.get('/:time', function (request, response) {
  const errorMsg = `Sorry, something went wrong. Double check that you entered your date in the URL correctly.`;
  let time = request.params.time;
  let unix;
  let natural;
  // check if user typed any letters; if they did it's not a unix number
  if (time.match('[a-zA-Z]+')) {
    // NATURAL to UNIX
    natural = time.replace(/%20/g, ' ');
    try {
      // using dateformat module here allows for some flexibility in what user types, such as sept or septemberr instead of september
      natural = dateformat(time, 'longDate');
    } catch (err) {
      response.send(errorMsg);
    }
    let naturalArray = natural.replace(',', '').split(' ');
    let month = naturalArray[0].toLowerCase();
    let monthNum = months.indexOf(month) + 1;
    let day = naturalArray[1];
    let year = naturalArray[2];
    let dateFormatted = `${year}.${monthNum}.${day}`;
    try {
      unix = new Date(dateFormatted).getTime() / 1000;
    } catch (err) {
      response.send(errorMsg);
    }
  } else {
  // UNIX to NATURAL
    unix = Number(time);
    let unixMult = Number(time) * 1000;
    let date = new Date(unixMult);
    try {
      natural = dateformat(date, 'longDate');
    } catch (err) {
      response.send(errorMsg);
    }
  }
  const jsonToReturn =
    {
      'unix': unix,
      'natural': natural
    };
  // if no errors occured, return natural and unix dates in json object
  response.json(jsonToReturn);
});

app.listen(process.env.PORT || 3000, function () {
  console.log('listening...');
});
