const express = require('express');
let dateformat = require('dateformat');
let ejs = require('ejs');
let app = express();

const months = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('index');
});

app.get('/:time', function (request, response) {
  let time = request.params.time;
  let unix;
  let natural;
  if (time.match('[a-zA-Z]+')) {
    // NATURAL to UNIX
    natural = time.replace(/%20/g, ' ');
    let naturalArray = natural.replace(',', ' ').split(' ');
    let month = naturalArray[0].toLowerCase();
    let monthNum = months.indexOf(month) + 1;
    let day = naturalArray[1];
    let year = naturalArray[2];
    let dateFormatted = `${year}.${monthNum}.${day}`;
    unix = new Date(dateFormatted).getTime() / 1000;
    try {
      natural = dateformat(natural, 'longDate');
    } catch (err) {
      response.send(`Sorry, something went wrong. Double check that you entered your date in the URL correctly.`);
    }
  } else {
  // UNIX to NATURAL
    unix = Number(time) * 1000;
    let date = new Date(unix);
    try {
      natural = dateformat(date, 'longDate');
    } catch (err) {
      response.send(`Sorry, something went wrong. Double check that you entered your date in the URL correctly.`);
    }
  }
  const jsonToReturn =
    {
      'unix': unix,
      'natural': natural
    };

  response.json(jsonToReturn);
});

app.listen(3000, function () {
  console.log('listening...');
});
