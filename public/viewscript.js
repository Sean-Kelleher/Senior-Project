//colors of things
var warColor = "#ff6600";
var otherColor = "#898989";
var naturalColor = '#66ff33';
var scitechColor = "#33ccff";
var politicalColor = "#669999";
var economicColor = "#ccccff";
var culturalColor = "#ffcc99";

//DOM-related variables
var xmlns = "http://www.w3.org/2000/svg";

d3.json('gettrends',function(data){
	var trendAry = []; //array of trends
	if(data!=null)
	{
		var length = data.timeline[0].length;
		var start = data.timeline[0].start;
		var interval = data.timeline[0].intervals;
		var startEra = data.timeline[0].era_start;
		var endEra = data.timeline[0].era_end;
		var end = data.timeline[0].end;
		for(var i=0;i<data.trends.length;i++)
		{			
			var tr = {start:data.trends[i].startyear, end:data.trends[i].endyear, type:data.trends[i].type, name:data.trends[i].name};
			trendAry.push(tr);
		}
	}
	drawTrends(trendAry, length, start, interval, end, startEra, endEra);
})

d3.json('getbubbles', function(data){
	var bubbleAry = []; //array of bubbles
	if(data!=null)
	{
		var length = data.timeline[0].length;
		var start = data.timeline[0].start;
		var interval = data.timeline[0].intervals;
		var startEra = data.timeline[0].era_start;
		var endEra = data.timeline[0].era_end;
		var end = data.timeline[0].end;
		
		for(var i=0;i<data.events.length;i++)
		{		
			var bubble = {name: data.events[i].name, type: data.events[i].type, 
				startYear:data.events[i].startyear, endYear:data.events[i].endyear};
			
			bubbleAry.push(bubble);
		}	
	}
	drawBubble(bubbleAry, length, start, interval, end, startEra, endEra);
	//desc:data[i].description, startEra:data[i].startera, endEra:data[i].endera,
});
d3.json('getconnections', function(data){
	if(data!=null)
	{
		var past = [];
		var future = [];
		var events = [];
		var length = data.timeline[0].length;
		var start = data.timeline[0].start;
		var startEra = data.timeline[0].era_start;
		var endEra = data.timeline[0].era_end;
		var end = data.timeline[0].end;
		for(var i = 0; i< data.past.length; i++)
		{
			var obj = {pastId : data.past[i].past_d, eventId : data.past[i].event_id}
			past.push(obj);
		}
		for(var i = 0; i< data.future.length; i++)
		{
			var obj = {futureId : data.future[i].fut_id, eventId : data.future[i].event_id}
			future.push(obj);
		}
		for(var i = 0; i<data.events.length; i++)
		{
			var obj = {id : data.events[i].id, year : data.events[i].startyear};
			events.push(obj);
		}
		drawConnections(past, future, events, startEra, endEra, start, end, length);
	}
});
d3.json('gettimeline', function(data){ 
	var interval = 0;
	var length = 0;
	var startyear = 0;
	var endyear = 0;
	var eraStart = ""; //BCE or CE
	var endEra = ""; //BCE or CE
	var lineTitle = "";

	if(data!=null)
	{
		startyear = data[0].start;
		endyear = data[0].end;
		interval = data[0].intervals;
		length = data[0].length;
		eraStart = data[0].era_start;
		eraEnd = data[0].era_end;
		lineTitle = data[0].title;
	}
	drawTicks(length, interval, startyear, endyear);
});

function drawConnections(past, future, events, startEra, endEra, start, end, length ){
	var svg = document.getElementById("#svgBubbles");	
	var tAry = timelineArys (startEra, endEra, start, end, length);
	var lengthAry = tAry[0];
	var pixelsAry = tAry[1];
	var yearsAry = tAry[2];
	var eventYears = [];
	var eventIds = [];
	var pairs = []; //array of objects that are the event id and a pixel amount representing the year
	events.forEach(function(elem){
		eventYears.push(elem.year);
		eventIds.push(elem.id);
	});
	
	for(var i =0; i<events.length;i++)
	{
		var index = yearsAry.indexOf(eventYears[i]);
		var obj = {id: eventIds[i], pix: pixelsAry[index]};
		pairs.push(obj);
	}

	function getIt(index){
		var ret = pairs.find(function(elem){
				return elem.id==future[index].eventId;
			});
		return ret;
	}
	/*
	console.log("Future:");
	console.log(future);
	console.log("Pairs:");
	console.log(pairs);

	for(var i = 0;i<future.length;i++)
	{
		var spotOne = getIt(i);
		console.log(spotOne.pix);
	}


	for()
 	iterate through future
 	for each object in future
 		find in pairs the object with the same id
 		get its pix  
 		draw stuff

 */
 	/*
	iterate through pairs and draw each point
		
	
	*/

}

function drawTrends(trends, length, start, interval, end, startEra, endEra)
{
	var svg = d3.select("#svgTrends");	
	var yearPix = 1000/length; //amount of pixels per year
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //am array that contains the pixel location for each year
	var trendStarts = []; //array of starting years
	var trendEnds = []; //array of ending years
	var startPix = [];
	var endPix = [];
	var pixels = 0;
	var trendsLength = trends.length;
	var lengthAry = []; //array of 0-end
	var i = 0;
	var tAry = timelineArys (startEra, endEra, start, end, length);
	lengthAry = tAry[0];
	pixelsAry = tAry[1];
	yearsAry = tAry[2];
	for(var i = 0; i< trendsLength; i++)
	{
		trendStarts.push(trends[i].start);
		trendEnds.push(trends[i].end);
	}
	for(var i = 0; i< trendsLength; i++)
	{
		var trst = trendStarts[i];
		var tred = trendEnds[i];
		var stIndex = yearsAry.indexOf(trst);
		var endIndex = yearsAry.indexOf(tred);
		startPix.push(pixelsAry[stIndex]);
		endPix.push(pixelsAry[endIndex]);
	}
}
function drawBubble(bubbleAry, length, start, interval, end, startEra, endEra){
	var svg = d3.select("#svgBubbles");
	var yearPix = 1000/length; //amount of pixels per year
	var lengthAry = []; //array of 0-end
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //an array that contains the pixel location for each year
	var eventStarts = []; //array of starting years
	var eventEnds = []; //array of ending years
	var startPix = []; //array of pixel locations for starting years
	var endPix = []; //array of pixel locations for ending years
	var pixels = 0;
	var eventsLength = bubbleAry.length;
	var i = 0;
	var tAry = timelineArys (startEra, endEra, start, end, length);
	lengthAry = tAry[0];
	pixelsAry = tAry[1];
	yearsAry = tAry[2];

	for(var i = 0; i< eventsLength; i++)
	{
		eventStarts.push(bubbleAry[i].startYear);
		eventEnds.push(bubbleAry[i].endYear);
	}
	for(var i = 0; i< eventsLength; i++)
	{
		var evst = eventStarts[i];
		var eved = eventEnds[i];
		var stIndex = yearsAry.indexOf(evst);
		var endIndex = yearsAry.indexOf(eved);
		startPix.push(pixelsAry[stIndex]);
		endPix.push(pixelsAry[endIndex]);
	}
	

}
function drawTicks(length, interval, startyear, endyear){
	var ticks = length/interval;
	var pix = 1000/ticks; //actual pixels that there should be between the ticks
	var ticksAry = [];
	var p = 10;
	var vis = d3.select("div").append("svg:svg").attr('width', 1000).attr("height", 400);

	while(p < 1000)
	{
		ticksAry.push(p);
		p += interval;
	} 
	var rect = vis.selectAll('rect').data(ticksAry).enter().append("svg:rect");
		rect.attr('x', function(d){return d})
		.attr('y', 380)
		.attr('height', '10px')
		.attr('width', '2px')
		.attr('fill', 'black');
}
function timelineArys(startEra, endEra, start, end, length){
	var lengthAry = []; //array of 0-end
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //an array that contains the pixel location for each year
	var yearPix = 1000 / length;
	var i = 0;
	var pixels = 0;

	while(i<length)
	{
		lengthAry.push(i);
		i++;
	}
	if(startEra == "CE" && endEra == "CE")
	{	
		while(start < end)
		{
			yearsAry.push(start);
			start++;
		}
	}
	else if(startEra=="BCE" && endEra=="CE")
	{
		while(start > 0)
		{
			yearsAry.push(start);
			start--;
			len--;
		}
		for(var i = 0; i < len; i++)
		{
			yearsAry.push(i);
		}
	}
	else if(startEra == "BCE" && endEra == "BCE")
	{
		while(start > end)
		{
			yearsAry.push(start);
			start--;
		}
	}
	for(var i=0; i < yearsAry.length; i++)
	{
		pixelsAry.push(pixels);
		pixels += yearPix;
	}
	var arys = [lengthAry, pixelsAry, yearsAry];
	return arys;
}