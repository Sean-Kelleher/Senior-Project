// npm init
// npm install --save mysql express

var mysql = require('mysql');
var express = require('express');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodeman',
  password : 'node',
  database : 'historydb'
});

var app = express();

app.use(express.static('public'))

// respond with "hello world" when a GET request is made to the homepage
app.get('/api', function (req, res) {
    connection.connect();
    connection.query('SELECT name FROM events;', function(err, rows, fields) {
      if (err) 
      {
        throw err;
      }

  //    var output = 'The solution is: ' + rows[0].solution;

      //console.log('output = ' + output);

      console.log(JSON.stringify({
          rows: rows,
          fields: fields
      }, null, 2));

      res.send("heya");
    });
    connection.end();
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})