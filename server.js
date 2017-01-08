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

app.get('/getyears', function(req, res){
  connection.query("SELECT start, end, intervals FROM timeline;",
      function(err, rows, fields){
        if(err)
        {
          throw err;
        }
        res.send(JSON.stringify(rows));
      }
    )
})

app.post('/timeline', function(req, res) {
  var total = arithmetic(req.body.start, req.body.end,req.body.era1,req.body.era2);
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

app.post('/trend',function(req,res) {
  if(req.body.start>req.body.end)
  {
    alert("Invalid: Trend cannot end before it's begun.");
  }
  connection.query('INSERT INTO trend (start,end,name,type) VALUES("'+req.body.start+'","'+req.body.end+'","'+req.body.name+'","'
    +req.body.type+"';", 
    function(err,rows,fields){
      if(err)
      {
        throw err;
      }
    }
  );
});

app.post('/event', function(req, res) {
  var startyear=req.body.startyear;
  var description = req.body.description;
  var endyear = req.body.endyear;
  var startera = req.body.startera;
  var endera = req.body.endera;
  var name = req.body.name;
  var type = req.body.type;
  var futureid = req.body.future;
  var pastid = req.body.past;

  connection.query("INSERT INTO events(name,description,startyear,endyear,startera,endera,type) VALUES('"+name+"','"
    +description+"',"+ startyear + "," +endyear+",'"+startera+"','" +endera+"','" +type+"');",
    function(err, rows, fields) {      
      if (err) 
      {
        throw err;
      }
      var eventid=rows.insertId;

      if(futureid!=null)
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
      if(pastid!=null)
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
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});