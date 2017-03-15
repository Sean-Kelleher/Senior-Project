//colors of things
var warColor = "#ff6600";
var otherColor = "#898989";
var naturalColor = '#66ff33';
var scitechColor = "#33ccff";
var politicalColor = "#669999";
var economicColor = "#ccccff";
var culturalColor = "#ffcc99";

/*
Possibly: Fill the trends with these
var culturalLight = "#ffeeaa";
var politicalColor = "#88bbbb";
var scitechLight = "#77eeff";
var warLight = "#ff8844";
var otherLight = "#979797";
var naturalLight = '#88ff66';
var economicLight = "#dedeff";
*/
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
	drawTicks(length, interval, startyear, endyear, eraStart, eraEnd);
});

function drawTrends(trends, length, start, interval, end, startEra, endEra)
{
	var vis = d3.select("div").append("svg:svg").attr('width', 1000).attr("height", 40);
	var yearPix = 1000/length; //amount of pixels per year
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //am array that contains the pixel location for each year
	var trendStarts = []; //array of starting years
	var trendEnds = []; //array of ending years
	var startPix = [];
	var endPix = [];
	var allData = [];
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
	for(var i = 0; i < trendsLength; i++)
	{
		var obj = {start: startPix[i] + 10, end: endPix[i] + 10, type: trends[i].type, name: trends[i].name};
		console.log(obj.start);
		allData.push(obj);
	}
	
	var polyline = vis.selectAll('polyline').data(allData).enter().append("svg:polyline")
		polyline.attr('points', function(d){
			var x1 = d.start;
			var x2 = d.end;
			var ret = x1 + ",25 " + x1 + ",15 " + x2 + ",15 " + x2 + ",25";
			console.log(ret);
			return ret;
		})
		.attr('stroke',function(d){
				var stroke = "";
				switch(d.type){
					case "other" : 
						stroke = otherColor;
						break;
					case "natural" : 
						stroke = naturalColor;
						break;
					case "political" : 
						stroke = politicalColor;
						break;
					case "economic" : 
						stroke = economicColor;
						break;
					case "cultural" : 
						stroke = culturalColor;
						break;
					case "science/technology" : 
						stroke = scitechColor;
						break;
					case "war": 
						stroke = warColor;	
						break;
				}
				return stroke;
			})
			.attr('stroke-width', '2')
			.attr('fill', 'none'); //possible: Replace the fill with the lighter colors commented above
	var text = vis.selectAll('text').data(allData).enter().append("svg:text")
		text.attr('x', function(d){return d.start})
		.attr('y', '12')
		.attr('size', '8px')
		.text(function(d){return d.name});
}
//ALSO NEEDED: type, name, description
function drawBubble(bubbleAry, length, start, interval, end, startEra, endEra){
	var vis = d3.select("div").append("svg:svg").attr('width', 1000).attr("height", 400);
	var yearPix = 1000/length; //amount of pixels per year
	var lengthAry = []; //array of 0-end
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //an array that contains the pixel location for each year
	var eventStarts = []; //array of starting years
	var eventEnds = []; //array of ending years
	var startPix = []; //array of pixel locations for starting years
	var endPix = []; //array of pixel locations for ending years
	var allData = []; //all the data that will be used in creating bubbles: names, startpix, description, etc.
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
	for(var i =0; i < bubbleAry.length; i++)
	{
		obj = {name : bubbleAry[i].name, type: bubbleAry[i].type, start: startPix[i], end: endPix[i]};		
		allData.push(obj);
	}
	/*
		bubble = {name: data.events[i].name, type: data.events[i].type, 
				startYear:data.events[i].startyear, endYear:data.events[i].endyear};
	*/
	/*TODO:
		make it interactive
	*/
	function checkOverlap(data){
		var overlaps = new Array(data.length);
		overlaps.fill(0);
		var ranges = [];
		for(var i = 0; i < data.length; i++)
		{
			var bubble = {low:data[i].start, high: data[i].end};
			ranges.push(bubble);
		}
		for(var i = 0; i < ranges.length; i++)
		{
			for(var j = i; j < ranges.length; j++)
			{
				if(i != j)
				{
					if(ranges[i].low >= ranges[j].low && ranges[i].low <= ranges[j].high)
					{
						overlaps[i]++;
					}
					else if(ranges[i].high >= ranges[j].low && ranges[i].high <= ranges[j].high)
					{
						overlaps[i]++;
					}
				}
			}
		}
		return overlaps;
	}
	var overlaps = checkOverlap(allData);
	for(var i = 0; i < allData.length; i++)
	{
		allData[i].tier=overlaps[i];
	}
	var text = vis.selectAll('text').data(allData).enter().append("svg:text")
		text.attr('x', function(d){return d.start + ((d.end-d.start)/6)})
		.attr('y', function(d){return 296 - d.tier * 40})
		.attr('size', '8px')
		.text(function(d){return d.name});
	var rect = vis.selectAll('rect').data(allData).enter().append("svg:rect")
		rect.attr('x', function(d){return d.start})
		.attr('y', function(d){return 300 - d.tier * 40})
		.attr('width', function(d){return d.end-d.start})
		.attr('height', 20)
		.attr('rx',15)
		.attr('fill',function(d){
				var ret = ""
				switch(d.type){
					case "other" : 
						ret = otherColor;
						break;
					case "natural" : 
						ret = naturalColor;
						break;
					case "political" : 
						ret = politicalColor;
						break;
					case "economic" : 
						ret = economicColor;
						break;
					case "cultural" : 
						ret = culturalColor;
						break;
					case "science/technology" : 
						ret = scitechColor;
						break;
					case "war": 
						ret = warColor;	
						break;
				}
				return ret;
			});
}

function drawConnections(past, future, events, startEra, endEra, start, end, length ){
//	var svg = d3.selectAll('#bubblesSvg').append("svg:svg").attr("width", 1000).attr("height", 20);
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

	iterate through pairs and draw each point
	*/
}
function drawTicks(length, interval, startyear, endyear, startEra, endEra){
	var ticks = length/interval;
	var pix = 1000/ticks; //actual pixels that there should be between the ticks
	var ticksAry = [];
	var intervPix = [];
	var intervYears = [];
	var textAry = [];
	var indices = [];
	var p = 10;
	var p2 = 0;
	var vis = d3.select("div").append("svg:svg").attr('width', 1000).attr("height", 30);
	var tArys = timelineArys(startEra, endEra, startyear, endyear, length);//[lengthAry, pixelsAry, yearsAry]
	var yearsAry = tArys[2];
	var pixelsAry = tArys[1];
	while(p < 1000)
	{
		ticksAry.push(p);
		p += interval;
	}
	while(startyear < endyear)
	{
		intervYears.push(startyear);
		var dex = yearsAry.indexOf(startyear);
		indices.push(dex);
		startyear += interval;
	}
	for(var i = 0; i<indices.length;i++)
	{
		var dex = indices[i];
		intervPix.push(pixelsAry[dex]);
	}
	for(var i = 0; i < intervPix.length; i++)
	{
		var obj = {pix: intervPix[i], year: intervYears[i]};
		textAry.push(obj);
	}
	var rect = vis.selectAll('rect').data(ticksAry).enter().append("svg:rect");
		rect.attr('x', function(d){return d})
		.attr('y', 0)
		.attr('height', '15px')
		.attr('width', '2px')
		.attr('fill', 'black');
	var text = vis.selectAll('text').data(textAry).enter().append("svg:text");
		text.attr('x', function(d){return d.pix+8})
		.attr('y', 30)
		.attr('size', '9px')
		.text(function(d){return d.year});
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
		//add the final year
		var last = yearsAry[yearsAry.length-1];
		last++;
		yearsAry.push(last);
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
		//add the final year
		var last = yearsAry[yearsAry.length-1];
		last++;
		yearsAry.push(last);
	}
	else if(startEra == "BCE" && endEra == "BCE")
	{
		while(start > end)
		{
			yearsAry.push(start);
			start--;
		}
		//add the final year
		var last = yearsAry[yearsAry.length-1];
		last--;
		yearsAry.push(last);
	}
	for(var i=0; i < yearsAry.length; i++)
	{
		pixelsAry.push(pixels);
		pixels += yearPix;
	}
	var arys = [lengthAry, pixelsAry, yearsAry];
	return arys;
}
function rangeAry(obj){
	var start = obj.low;
	var end = obj.high;
	ary = [];
	while(start < end)
	{
		ary.push(start);
		start++
	}
	return ary;
}