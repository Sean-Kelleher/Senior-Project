// npm init
// npm install --save mysql express


var bodyParser = require('body-parser');
var mysql = require('mysql');
var express = require('express');
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodeman',
  password : 'node',
  database : 'historydb'
});


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
connection.connect();

function arithmetic(start,end,eraStart,eraEnd){
  if(eraStart=="CE" && eraEnd=="CE")
  {
    totes=end-start;
  }
  else if(eraStart=="BCE" && eraEnd=="BCE")
  {
    totes=Math.abs(start)-Math.abs(end);
  }
  else if(eraStart=="BCE" && eraEnd=="CE")
  {
    totes=Math.abs(start)+Math.abs(end);
  }
        return Math.abs(totes);
}

function calculate(req){
    var start,
        end;
    var eraStart=req.body.era1;
    var eraEnd=req.body.era2;
    if(eraStart=="CE" && eraEnd=="BCE")
    {
      alert("you can't start with CE and end with BCE");
    }

    else
    {
      start=req.body.start;
      end=req.body.end;
      interval=req.body.interval;      
      if(eraStart=="BCE")
      {
        start=0-start;
      }
      if(eraEnd=="BCE")
      {
        end=0-end;
      }
      return arithmetic(start,end,eraStart,eraEnd);
    }
  }


app.post('/myaction', function(req, res) {
  var total = calculate(req);

  connection.query('INSERT INTO  timeline(title,era_start,era_end,intervals,start,end,length) VALUES ("'+ req.body.title +'","'+
    req.body.era1+'","' + req.body.era2 +'","'+req.body.interval+'","'+req.body.start+'","'+req.body.end+'","'+total+'");',
    function(err, rows, fields) {
      if (err) 
      {
        throw err;
      }
    }
  );

  res.send("success!");
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});