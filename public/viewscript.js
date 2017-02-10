//timeline-related variables

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


/*
for each object in connectAry
reference evetns
find the year that corresponds to it

*/


d3.json('gettrends',function(data){
	var trendAry = []; //array of trends

	if(data!=null)
	{
		var length = data[0].length;
		var interval = data[0].intervals;
		var 
		for(var i=0;i<data.length;i++)
		{			
			var tr = {start:data[i].start, end:data[i].end, type:data[i].type, name:data[i].name};
			trendAry.push(tr);
		}
	}
	drawTrends(trendAry)
})
d3.json('getbubbles', function(data){
	var bubbleAry = []; //array of bubbles
	var length = 0;
	var start = 0;
	var interval = 0;
	if(data!=null)
	{

		length = data[0].length;
		start = data[0].start;
		interval = data[0].intervals;
		for(var i=0;i<data.length;i++)
		{		
			var bubble = {name: data[i].name, type: data[i].type, desc:data[i].description, startYear:data[i].startyear, endYear:data[i].endyear, startEra:data[i].startera, endEra:data[i].endera, eventId:data[i].id};
			bubbleAry.push(bubble);
		}	
	}
	
	drawBubble(bubbleAry, length, start, interval);
	
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


function drawBubble(bubbleAry, length, start, interval){
	var svg = document.getElementById("#svgBubbles");
	var yearPix = 1000/length; //amount of pixels per year
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //am array that contains the pixel location for each year
	var eventStarts = []; //array of starting years
	var eventEnds = []; //array of ending years
	var startPix = []; //array of pixel locations for starting years
	var endPix = []; //array of pixel locations for ending years
	var pixels = 0;
	var eventsLength = bubbleAry.length;

	while(start<length)
	{
		yearsAry.push(start);
		pixelsAry.push(pixels);
		pixels += yearPix;
		start++;
	}

	for(var i = 0; i< eventsLength; i++)
	{
		eventStarts.push(bubbleAry[i].startYear);
		eventEnds.push(bubbleAry[i].endYear);
		
	}
	
	for(var i = 0; i< eventsLength; i++)
	{
		var stIndex = yearsAry.indexOf(eventStarts[i]);
		var edIndex = yearsAry.indexOf(eventEnds[i]);
		console.log(stIndex);
		console.log(edIndex);
		startPix.push(pixelsAry[stIndex]);
		endPix.push(pixelsAry[edIndex]);
	}
 
}


function drawTrends(trends)
{
	var svg = document.getElementById("#svgTrends");	
	var yearPix = 1000/length; //amount of pixels per year
	var yearsAry = []; //an array that contains all the years, with the pixel location for each year
	var trendStarts = []; //array of starting years
	var trendEnds = []; //array of ending years
	var startPix = [];
	var endPix = [];
	var pixels = 0;

	/*
	...find index ?
	once i have the year, match it to a pixel amount
	yeah, find index
	*/

	while(start<length)
	{
		var item = {year:start, pix:pixels};
		yearsAry.push(item);
		pixels += yearPix;
		start++;
	}
	for(var i = 0; i< eventsLength; i++)
	{
		eventStarts.push(bubbleAry[i].startYear);
		eventEnds.push(bubbleAry[i].endYear);
		/*
		function checkIndex(ind){
			return ind.year==bubbleAry[i].startYear;
		}
		
		var y = yearsAry.findIndex(checkIndex);
		var bubble = document.createElementNS(xmlns, "circle");
		bubble.setAttribute('r', '20px');
		bubble.setAttribute('cx',);*/
	}
	for(var i = 0; i< eventsLength; i++)
	{
		startPix.push();
		endPix.push();
	}
}

function drawTicks(length, interval, startyear, endyear){
	var ticks = length/interval;
	var pix = 1000/ticks; //actual pixels that there should be between the ticks
	var i = 0;
	var svg = document.getElementById("#svgTicks");
	while(i<1000)
	{
		console.log(i);
		var tick = document.createElementNS(xmlns,'rect');
		
		tick.setAttribute('style',"fill:'black';stroke-width:3;stroke:'black'");
		tick.setAttribute('x',i+10);
		tick.setAttribute('y',380);
		tick.setAttribute('width','4px');
		tick.setAttribute('height','10px');
		svg.append(tick);
		i+=pix;
	}
}

function drawTrend(trends){
	var svg = document.getElementById("#svgTrends");
	//draw the trends
}

//necessary stuff:
/*
-set up the stuff on the bottom
 -- numbers
 -- assign numerical values to certain spots on it?

 --[] of the pixel locations of each tick
 -- how many pixels a year is?
 -- 1000/length = how many pixels per year


*/