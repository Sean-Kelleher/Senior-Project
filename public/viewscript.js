//colors of things
var warColor = "#ff6600";
var otherColor = "#898989";
var naturalColor = '#66ff33';
var scitechColor = "#33ccff";
var politicalColor = "#669999";
var economicColor = "#ccccff";
var culturalColor = "#ffcc99";

var culturalColorLight = "#ffeeaa";
var politicalColorLight = "#88bbbb";
var scitechColorLight = "#77eeff";
var warColorLight = "#ff8844";
var otherColorLight = "#979797";
var naturalColorLight = '#88ff66';
var economicColorLight = "#dedeff";

function init(){
	trends();
}
function trends(){
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
				var tr = {start:data.trends[i].startyear, end:data.trends[i].endyear, type:data.trends[i].type, name:data.trends[i].name, desc: data.trends[i].description};
				trendAry.push(tr);
			}
		}
		drawTrends(trendAry, length, start, interval, end, startEra, endEra);
	})
	bubbles();
}
function bubbles(){
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
			var pasts = [];
			var futures = [];
			var evIdPairs = [];
		
			for(var i=0;i<data.events.length;i++)
			{		
				var bubble = {name: data.events[i].name, type: data.events[i].type, 
					startYear:data.events[i].startyear, endYear:data.events[i].endyear, 
					id:data.events[i].id, desc:data.events[i].description};
				bubbleAry.push(bubble);
				var evId = {evt: data.events[i].name, id: data.events[i].id, 
					startYear:data.events[i].startyear, endYear:data.events[i].endyear};
				evIdPairs.push(evId);
			}	
			for(var i = 0; i < data.past.length;i++)
			{
				var obj = {eventid: data.past[i].event_id, pastid: data.past[i].past_id};
				pasts.push(obj);
			}
			for(var i = 0; i < data.future.length;i++)
			{
				var obj = {eventid: data.future[i].event_id, futid: data.future[i].fut_id};
				futures.push(obj);
			}
		}
		drawBubble(bubbleAry, length, start, interval, end, startEra, endEra, pasts, futures, evIdPairs);
	});
	
}
function timeline(){
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
}

function drawBubble(bubbleAry, length, start, interval, end, startEra, endEra, pasts, futures, evIdPairs){
	var vis = d3.select("div").append("svg:svg").attr('width', 1035).attr("height", 400);
	var tipSpace = d3.select("p");
	var yearPix = 1000/length; //amount of pixels per year
	var lengthAry = []; //array of 0-end
	var yearsAry = []; //an array that contains all the years
	var pixelsAry = []; //an array that contains the pixel location for each year
	var eventStarts = []; //array of starting years
	var eventEnds = []; //array of ending years
	var startPix = []; //array of pixel locations for starting years
	var endPix = []; //array of pixel locations for ending years
	var allData = []; //all the data that will be used in creating bubbles: names, startpix, endpix description, type
	var connData = []; //array that will be used for connection stuff
	var pixels = 0;
	var eventsLength = bubbleAry.length;
	var tAry = timelineArys (startEra, endEra, start, end, length);
	var textTier = true; //for deciding the x level a bubble's label should be on
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
	startPix = addMargin(startPix);
	endPix = addMargin(endPix);
	for(var i =0; i < bubbleAry.length; i++)
	{
		obj = {name : bubbleAry[i].name, type: bubbleAry[i].type, start: startPix[i], end: endPix[i], 
			desc:bubbleAry[i].desc, startyear:bubbleAry[i].startYear, endyear:bubbleAry[i].endYear};
		allData.push(obj);
	}
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
	for(var i = 0; i < evIdPairs.length; i++)
	{
		var corresponding = allData.find(function(elem){
			return elem.name == evIdPairs[i].evt;
		})
		evIdPairs[i].startPix = corresponding.start;
		evIdPairs[i].endPix = corresponding.end;
		evIdPairs[i].tier = corresponding.tier;
	}
	for(var i = 0; i < pasts.length; i++)
	{
		if(pasts[i].eventid != "" && pasts[i].pastid != "")
		{
			var corr1 = evIdPairs.find(function(elem){
				return elem.id == pasts[i].eventid;
			})
			var corr2 = evIdPairs.find(function(elem){
				return elem.id == pasts[i].pastid;
			})
			var start1 = 0;
			var start2 = 0;
			if(corr1.startYear == corr1.endYear)
				start1 = corr1.startPix + 5;
			else if(corr1.startYear != corr1.endYear)
				start1 =  corr1.startPix  + (corr1.endPix-corr1.startPix)/2;
			if(corr2.startYear == corr2.endYear)
				start2 = corr2.startPix + 5;
			else if(corr2.startYear != corr2.endYear)
				start2 = corr2.startPix + (corr2.endPix-corr2.startPix)/2;

			var obj = {x1: start1, y1: corr1.tier, x2: start2, y2: corr2.tier};
			connData.push(obj);
		}
	}
	for(var i = 0; i < futures.length; i++)
	{
		if(futures[i].eventid != "" && futures[i].futid != "")
		{
			var corr1 = evIdPairs.find(function(elem){
				return elem.id == futures[i].eventid;
			})		
			var corr2 = evIdPairs.find(function(elem){
				return elem.id == futures[i].futid;
			})

			var start1 = 0;
			var start2 = 0;
			if(corr1.startYear == corr1.endYear)
				start1 = corr1.startPix + 5;
			else if(corr1.startYear != corr1.endYear)
				start1 =  corr1.startPix  + (corr1.endPix-corr1.startPix)/2;
			if(corr2.startYear == corr2.endYear)
				start2 = corr2.startPix + 5;
			else if(corr2.startYear != corr2.endYear)
				start2 = corr2.startPix + (corr2.endPix-corr2.startPix)/2;
			
			var obj = {x1: start1, y1: corr1.tier, x2: start2, y2: corr2.tier};
			connData.push(obj);
		}
	}
	var line = vis.selectAll('path').data(connData).enter().append("svg:path")
		line.attr('d',function(d){
			var x1 = d.x1;
			var y1 = 306 - d.y1 * 40;
			var x2 = d.x2;
			var y2 = 306 - d.y2 * 40;
			var controlY1 = 0;
			var controlY2 = 0;
			if(y1 == y2)
			{
				var controlX1 = x1;
				var controlX2 = x2;
				if(y1 == 306)
				{
					controlY1 = y1 + 20;
					controlY2 = y2 + 20;				
				}
				else
				{
					controlY1 = y1 - 20;
					controlY2 = y2 - 20;	
				}
				return "M" + x1 + " " + y1 + " C " + controlX1 + " " + controlY1 + ", " + controlX2 + " " + controlY2 + ", " + " " + x2 + " " + y2;
			}
			else
			{
				return "M" + x1 + " " + y1 + " " + x2 + " " + y2;
			}
		})
		.attr('stroke', '#8E9886')
		.attr('stroke-width', '1')
		.attr('fill','none');
		var lastTier = allData[0].tier;
	var text = vis.selectAll('text').data(allData).enter().append("svg:text")
		text.attr('x', function(d){return d.start})
		.attr('y', function(d){
			var ret = 0;
			if(d.tier == lastTier && d != allData[0])
				textTier = !textTier;
			if(textTier)
				ret = 296 - d.tier * 50;
			else
				ret = 284 -d.tier * 50;
			lastTier = d.tier;
			return ret
		})
		.attr('class','titleStyle')
		.text(function(d){return d.name});
	var bubble = vis.selectAll('rect').data(allData).enter().append('svg:rect');
		bubble.attr('x', function(d){return d.start})
		.attr('y', function(d){return 300 - d.tier * 50})
		.attr('width', function(d){
			var w = 10;
			if(d.end != d.start)
			{
				w = d.end-d.start
			}
			return w;
		})
		.attr('height', 20)
		.attr('rx',15)
		.attr('id',function(d){ return d.desc})
		.attr('class',function(d){
			var ret = d.name + ", ";
			if(d.startyear == d.endyear)
				ret += d.startyear
			else
				ret += d.startyear + " - " + d.endyear;
			return ret;
		})
		.attr('fill',function(d){
				var ret = "";
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
			})
		.attr('style','cursor:pointer;')
		.on('mouseenter',bubbleEnter)
		.on('mouseout',bubbleExit);
	
	function bubbleEnter(){
		var current = d3.select(this);
		var typeColor = current.attr('fill');
		var lightColor = "";
		switch(typeColor){
			case "#ff6600": //war
				lightColor = "#ff8844";
				break;
			case "#898989": //other
				lightColor = "#979797";
				break;
			case "#66ff33": //natural
				lightColor = "#88ff66";
				break;
			case "#33ccff": //scitech
				lightColor = "#77eeff";
				break;
			case "#669999": //political
				lightColor = "#88bbbb";
				break;
			case "#ccccff": //economic
				lightColor = "#dedeff";
				break;
			case "#ffcc99": //cultural
				lightColor = "#ffeeaa";
				break;
		}
		var desc = current.attr('id');
		var titleInfo = current.attr('class');
		var title = tipSpace.append('p');
		title.text(titleInfo)
		.attr('style',' font-weight: bold; padding: 3px; border:3px solid '+typeColor+'; background-color: '+ lightColor+"; border-radius: 4px;");
		var tip = tipSpace.append('p');
		tip.text(desc)
		.attr('style','padding: 3px; border:3px solid '+typeColor+'; background-color: '+ lightColor+"; border-radius: 4px;");
	}
	function bubbleExit(){
		tipSpace.selectAll('p').remove();
	}	
	timeline();
}

function drawTrends(trends, length, start, interval, end, startEra, endEra)
{
	var tipSpace = d3.select("p");
	var vis = d3.select("div").append("svg:svg").attr('width', 1035).attr("height", 40);
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
	startPix = addMargin(startPix);
	endPix = addMargin(endPix);
	for(var i = 0; i < trendsLength; i++)
	{
		var obj = {startyear:trends[i].start, endyear: trends[i].end, start: startPix[i] + 10, end: endPix[i] + 10, type: trends[i].type, name: trends[i].name, desc:trends[i].desc};
		allData.push(obj);
	}
	
	var polyline = vis.selectAll('polyline').data(allData).enter().append("svg:polyline")
		polyline.attr('points', function(d){
			var x1 = d.start;
			var x2 = d.end;
			var ret = x1 + ",25 " + x1 + ",15 " + x2 + ",15 " + x2 + ",25";
			return ret;
		})
		.attr('class',function(d){
			var ret = d.name + ", " + d.startyear + " - " + d.endyear;
			return ret;
		})
		.attr('id',function(d){return d.desc})
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
			.attr('fill', function(d){
				var f = "";
				switch(d.type){
					case "other" : 
						f = otherColorLight;
						break;
					case "natural" : 
						f = naturalColorLight;
						break;
					case "political" : 
						f = politicalColorLight;
						break;
					case "economic" : 
						f = economicColorLight;
						break;
					case "cultural" : 
						f = culturalColorLight;
						break;
					case "science/technology" : 
						f = scitechColorLight;
						break;
					case "war": 
						f = warColorLight;	
						break;
				}
				return f;
			})
			.attr('style','cursor:pointer;')
			.on('mouseenter',trendEnter)
			.on('mouseout',trendExit);
			
	function trendEnter(){
		var current = d3.select(this);
		var typeColor = current.attr('stroke');
		var lightColor = "";
		switch(typeColor){
			case "#ff6600": //war
				lightColor = "#ff8844";
				break;
			case "#898989": //other
				lightColor = "#979797";
				break;
			case "#66ff33": //natural
				lightColor = "#88ff66";
				break;
			case "#33ccff": //scitech
				lightColor = "#77eeff";
				break;
			case "#669999": //political
				lightColor = "#88bbbb";
				break;
			case "#ccccff": //economic
				lightColor = "#dedeff";
				break;
			case "#ffcc99": //cultural
				lightColor = "#ffeeaa";
				break;
		}
		var desc = current.attr('id');
		var titleInfo = current.attr('class');
		var title = tipSpace.append('p');
		title.text(titleInfo)
		.attr('style',' font-weight: bold; padding: 3px; border:3px solid '+typeColor+'; background-color: '+ lightColor+"; border-radius: 4px;");
		var tip = tipSpace.append('p');
		tip.text(desc)
		.attr('style','padding: 3px; border:3px solid '+typeColor+'; background-color: '+ lightColor+"; border-radius: 4px;");
	}
	function trendExit(){
		tipSpace.selectAll('p').remove();
	}
	var text = vis.selectAll('text').data(allData).enter().append("svg:text")
		text.attr('x', function(d){return d.start})
		.attr('y', '12')
		.attr('class','titleStyle')
		.text(function(d){return d.name});
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
	var vis = d3.select("div").append("svg:svg").attr('width', 1035).attr("height", 30);
	var tArys = timelineArys(startEra, endEra, startyear, endyear, length);//[lengthAry, pixelsAry, yearsAry]
	var yearsAry = tArys[2];
	var pixelsAry = tArys[1];
	if(startEra == "CE" && endEra == "CE")
	{
		while(startyear < endyear)
		{
			intervYears.push(startyear);
			var dex = yearsAry.indexOf(startyear);
			indices.push(dex);
			startyear += interval;
		}
	}
	if(startEra == "BCE" && endEra == "BCE")
	{
		while(startyear > endyear)
		{
			intervYears.push(startyear);
			var dex = yearsAry.indexOf(startyear);
			indices.push(dex);
			startyear -= interval;
		}
	}
	else if(startEra=="BCE" && endEra=="CE")
	{
		while(startyear > 0)
		{
			intervYears.push(startyear);
			var dex = yearsAry.indexOf(startyear);
			indices.push(dex);
			startyear -= interval;
		}
		while(startyear < endyear)
		{
			intervYears.push(startyear);
			var dex = yearsAry.indexOf(startyear);
			indices.push(dex);
			startyear += interval;
		}
	}
	for(var i = 0; i<indices.length;i++)
	{
		var dex = indices[i];
		intervPix.push(pixelsAry[dex]);
	}
	for(var i = 0; i < intervPix.length; i++)
	{
		var obj = {pix: intervPix[i], year: intervYears[i]};
		ticksAry.push(intervPix[i]);
		textAry.push(obj);
	}
	var rect = vis.selectAll('rect').data(ticksAry).enter().append("svg:rect");
		rect.attr('x', function(d){return d+15})
		.attr('y', 0)
		.attr('height', '15px')
		.attr('width', '2px')
		.attr('fill', 'black');
	var text = vis.selectAll('text').data(textAry).enter().append("svg:text");
		text.attr('x', function(d){return d.pix +15})
		.attr('y', 30)
		.attr('size', '9px')
		.attr('text-anchor','middle')
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
function addMargin(ary){
	for(var i =0; i < ary.length; i++)
	{
		ary[i]+= 15;
	}
	return ary;
}
init();