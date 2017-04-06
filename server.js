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
connection.connect({multipleStatements: true});

function arithmetic(start,end,eraStart,eraEnd){
  if(eraStart=="BCE")
  {
    start=0-start;
  }
  if(eraEnd=="BCE")
  {
    end=0-end;
  }
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
//verifies that the input did not start after it ended or end before it began
function timeVerify(start,end,eraStart,eraEnd){
  var correct = true;
  
  if(eraStart=="CE" && eraEnd=="CE")
  {
    if(end < start)
    {
      correct = false;
    }
  }
  else if(eraStart=="BCE" && eraEnd=="BCE")
  {
    if(end > start)
      correct = false;
  }
  else if(eraEnd=="BCE" && eraStart=="CE")
  {
    correct = false;
  }
  return correct;
}

function escapeQuote(str){
  rep = "\\";
  var ret = str.replace("'",rep + "'");
  return ret;
}
app.get('/getevents', function(req,res){
  connection.query('SELECT name, id FROM events;',
    function(err, rows, fields) {
      if (err) 
      {
        throw err;
      }
      res.send(JSON.stringify(rows));        
    }
  )
});

app.get('/gettrends',function(req,res){
  connection.query('SELECT startyear, endyear, type, name FROM trend;',
    function(err1, rows1, fields1) {
      connection.query('SELECT length, intervals, start, end, era_start, era_end FROM timeline;',
        function(err2, rows2, fields2) {
          var obj = {'trends': rows1, 'timeline': rows2};
          res.send(JSON.stringify(obj));
        });
      });
});

app.get('/gettimeline', function(req, res){
  connection.query("SELECT title, start, end, intervals, era_start, era_end, length FROM timeline;",
      function(err, rows, fields){
        if(err)
        {
          throw err;
        }
        res.send(JSON.stringify(rows));
      }
    )
});
app.get('/getbubbles',function(req,res){
  connection.query('SELECT name, type, startyear, endyear, startera, endera, description, id FROM events;',
    function(err1, rows1, fields1) {
      connection.query('SELECT length, intervals, start, end, era_start, era_end FROM timeline;',
        function(err2, rows2, fields2) {
          connection.query('SELECT event_id, past_id FROM past_connections;',
            function(err3, rows3, fields3) {
              connection.query('SELECT event_id, fut_id FROM future_connections;',
                function(err4, rows4, fields4) {
                    var obj = {'events': rows1, 'timeline': rows2, 'past': rows3, 'future': rows4};
                    res.send(JSON.stringify(obj));                          
                });
            }); 
        });
    });
});

app.post('/timeline', function(req, res) {
  var total = arithmetic(req.body.start, req.body.end,req.body.era1,req.body.era2);
  var title = escapeQuote(req.body.title);
  connection.query('INSERT INTO  timeline(title,era_start,era_end,intervals,start,end,length) VALUES ("'+ title +'","'+
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

app.post('/trend',function(req,res) {  
  var startyear=req.body.start;
  var endyear = req.body.end;
  var startera = req.body.startera;
  var endera = req.body.endera;
  var correct = timeVerify(startyear, endyear, startera, endera);
  if(!correct)
  {
    res.send("Invalid: Trend cannot end before it's begun.");
  }
  else
  {
    var name = escapeQuote(req.body.name);
    var description = escapeQuote(req.body.description);
    connection.query('INSERT INTO trend (startyear,endyear,name,type,description) VALUES("'+req.body.start+'","'+req.body.end+'","'+name+'","'
      +req.body.eType.toLowerCase()+'","'+description+'");', 
      function(err,rows,fields){
        if(err)
        {
          throw err;
        }
      }
    );
    res.send("success!");
  }
});

app.post('/event', function(req, res) {
  var startyear=req.body.startyear;
  var description = escapeQuote(req.body.description);
  var endyear = req.body.endyear;
  var startera = req.body.startera;
  var endera = req.body.endera;
  var name = escapeQuote(req.body.name);
  var type = req.body.type;
  var futureid = req.body.future;
  var pastid = req.body.past;
  var correct = timeVerify(startyear, endyear, startera, endera);
  if(!correct)
  {
    res.send("Invald: Event cannot end before it begins.")
  }
  else
  {
    connection.query("INSERT INTO events(name,description,startyear,endyear,startera,endera,type) VALUES('"+name+"','"
      +description+"',"+ startyear + "," +endyear+",'"+startera+"','" +endera+"','" +type+"');",
      function(err, rows, fields) {      
        if (err) 
        {
          throw err;
        }
        var eventid=rows.insertId;

        if(futureid!='')
        {
          connection.query("INSERT INTO future_connections(event_id,fut_id) VALUES('"+eventid+"','"+futureid+"');",
            function(err, rows, fields) {
               if (err)
               {
                 throw err;
               }
             }
          );
        }    
        if(pastid!='')
        {
          connection.query("INSERT INTO past_connections(event_id,past_id) VALUES('"+eventid+"','"+pastid+"');",
            function(err, rows, fields) {
               if (err)
               {
                 throw err;
               }
             }
          );
        }
      }
    );
    res.send("success!");
  }
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});